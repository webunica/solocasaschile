import re
from typing import List, Optional
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

class CasasChileAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://casaschilespa.cl")

    def discover_model_urls(self) -> List[str]:
        soup = self.get_soup(f"{self.base_url}/catalogo/")
        if not soup:
            return []
        
        urls = set()
        
        for a in soup.find_all('a', href=True):
            href = a['href']
            # Evitar enlaces basura o redes sociales. Los modelos de casaschile son del tipo /modelo_XX/
            if self.base_url in href and len(href.split('/')) == 5 and href.endswith('/'):
                 # Descartar links internos como /catalogo/, /micuenta/
                 exclude = ['/catalogo/', '/micuenta/', '/modernas/', '/premium/']
                 if not any(ex in href for ex in exclude):
                    urls.add(href)
                    
        # URLs Adicionales desde el Home / /modernas / /premium   
        logger.info(f"Descubiertos {len(urls)} modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Casas Chile SpA",
            domain="casaschilespa.cl",
            website=self.base_url,
            company_type="Fabricante / Constructora",
            specialty="Casas Prefabricadas de Madera",
            base_city="San Bernardo",
            base_region="Metropolitana",
            services=["Kit Básico", "Kit Completo"],
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None
            
        text_content = soup.get_text(separator=' ', strip=True)
        
        # Nombre del modelo y Metros desde el h1 o regex de titulo
        title_tag = soup.find('h1') or soup.title
        title_text = title_tag.text if title_tag else ""
        model_name_match = re.search(r'([a-zA-Z\s]+)\s+(\d+(?:\.\d+)?)\s*m²?', title_text, re.IGNORECASE)
        
        model_name = model_name_match.group(0).strip() if model_name_match else url.strip('/').split('/')[-1].replace('_', ' ').title()
        
        # Superficie, Dormitorios, Baños con lookbehind / lookahead desde la tabla/lista estandar
        surface_match = re.search(r'Tamaño\s+(\d+(?:\.\d+)?)\s*m²', text_content, re.IGNORECASE)
        surface = float(surface_match.group(1)) if surface_match else None
        if not surface and model_name_match:
             surface = float(model_name_match.group(2))

        beds_match = re.search(r'Dormitorios\s+(\d+)', text_content, re.IGNORECASE)
        bedrooms = int(beds_match.group(1)) if beds_match else None

        baths_match = re.search(r'Baños\s+(\d+)', text_content, re.IGNORECASE)
        bathrooms = int(baths_match.group(1)) if baths_match else None
        
        # PDF Enlace Ficha Tecnica
        pdf_link = None
        for a in soup.find_all('a', href=True):
            if '.pdf' in a['href'] and ('ficha' in a['href'].lower() or 'descargar' in a.text.lower()):
                pdf_link = a['href']
                break

        # Precio
        price_val, currency = None, None
        price_match = re.search(r'\$\s?(?:[1-9]\d{0,2}(?:\.\d{3}|\,\d{3}){2})', text_content)

        if price_match:
            price_val, currency = Normalizer.normalize_price(price_match.group(0))

        # Image
        image_url = None
        
        # Helper to detect doors/windows or logos
        def is_valid_image(url):
            if not url: return False
            low = url.lower()
            bad = ['logo', 'webpay', 'icon', 'sofa', 'bed', 'measurement', 'facebook', 'svg', 'data:', 
                   'cama', 'bano', 'cocina', 'plano', 'sence', 'acc_puerta', 'termopanel', 'amianto', 
                   'descarga', 'interior', 'account', 'pantalla', 'ventana', 'puerta']
            if any(b in low for b in bad): return False
            if low.split('?')[0].endswith('.png'): return False
            if re.search(r'/\d+_\d+\.jpe?g$', low): return False
            return True

        img_tags = [img.get('src') for img in soup.find_all('img') if img.get('src') and 'wp-content' in img.get('src')]
        filtered_imgs = [src for src in img_tags if is_valid_image(src)]
        
        if filtered_imgs:
             image_url = filtered_imgs[0]
             if image_url.startswith('//'):
                  image_url = 'https:' + image_url
        else:
             # Try Background styles
             bg_divs = soup.find_all('div', style=True)
             for div in bg_divs:
                 if 'background-image' in div['style'] and 'wp-content' in div['style']:
                     match = re.search(r'url\([\'"]?(.*?(?:jpg|jpeg|webp))[\'"]?\)', div['style'])
                     if match and is_valid_image(match.group(1)):
                         image_url = match.group(1)
                         if image_url.startswith('//'):
                              image_url = 'https:' + image_url
                         break

             if not image_url:
                 # Try Elementor JSON
                 elementor_bgs = re.findall(r'"url"\s*:\s*"(.*?(?:jpg|jpeg|webp))"', text_content)
                 valid_elementors = [img.replace('\\/', '/') for img in elementor_bgs if is_valid_image(img.replace('\\/', '/'))]
                 if valid_elementors:
                     image_url = valid_elementors[0]
                     if image_url.startswith('//'):
                          image_url = 'https:' + image_url

        return ModelSchema(
            company_name="Casas Chile SpA",
            model_name=model_name,
            model_url=url,
            category="Prefabricada Madera",
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=price_match.group(0) if price_match else None,
            delivery_modes=["Kit Inicial", "Kit Completo"],
            structure_material="Pino 2x3\"",
            includes_assembly=False,
            includes_transport=False,
            pdf_ficha_url=pdf_link,
            description="Línea de madera modular extraída de casaschilespa.cl",
            image_urls=[image_url] if image_url else []
        )
