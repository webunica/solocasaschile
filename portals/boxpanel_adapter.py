import re
from typing import List, Optional
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

class BoxPanelAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://boxpanelchile.cl")

    def discover_model_urls(self) -> List[str]:
        soup = self.get_soup(f"{self.base_url}/categoria-producto/kit-autoconstruccion/")
        if not soup:
            return []
        
        urls = set()
        
        # Productos tienda WooCommerce base
        for a in soup.find_all('a', href=True):
            href = a['href']
            if '/tienda/' in href and href != "https://boxpanelchile.cl/tienda/":
                urls.add(href)
                
        logger.info(f"Descubiertos {len(urls)} modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Box Panel Chile",
            domain="boxpanelchile.cl",
            website=self.base_url,
            company_type="Fabricante / Constructor",
            specialty="Paneles SIP y Obra Gruesa Térmica",
            base_city="La Pintana",
            base_region="Metropolitana",
            services=["Kit Autoconstrucción (Materiales Iniciales)", "Planos de Arquitectura", "Planos de Montaje", "Llave en Mano"],
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None
            
        text_content = soup.get_text(separator=' ', strip=True)
        
        # Extraer Título Principal (ej. ATACAMA 196m2 o Modelo Maipo 150m² | Obra Gruesa Térmica)
        title_tag = soup.find('h1')
        title_text = title_tag.text.strip() if title_tag else url.strip('/').split('/')[-1].replace('-', ' ').title()
        
        # Limpiar modelo principal
        model_name_match = re.match(r'^([^|]+)', title_text)
        model_name = model_name_match.group(1).strip() if model_name_match else title_text

        # Obtener superficie
        m2_match = re.search(r'(\d+(?:\.\d+)?)\s?[mM]2', title_text, re.IGNORECASE)
        # fallback al texto entero si no esta en titulo
        if not m2_match:
             m2_match = re.search(r'(\d+(?:\.\d+)?)\s?[mM]2', text_content, re.IGNORECASE)
             
        surface = Normalizer.normalize_m2(m2_match.group(1)) if m2_match else None

        # Como la página no muestra estructura tabular de baños (es tienda pura con descripcion texto libre):
        bedrooms, bathrooms = None, None
        beds_match = re.search(r'(\d+)\s*Dormitorio', text_content, re.IGNORECASE)
        baths_match = re.search(r'(\d+)\s*Baño', text_content, re.IGNORECASE)
        if beds_match: bedrooms = int(beds_match.group(1))
        if baths_match: bathrooms = int(baths_match.group(1))

        # Precio (Buscamos la marca de precio WooCommerce)
        price_val, currency = None, None
        price_match = re.search(r'\$\s?(?:[1-9]\d{0,2}(?:\.\d{3}|\,\d{3}){2})', text_content)
        if price_match:
            price_val, currency = Normalizer.normalize_price(price_match.group(0))

        # Determinar categoría Premium
        category = "SIP Premium" if "PREMIUM" in title_text.upper() else "SIP Estándar"
        
        # Image
        img_tag = soup.select_one('.woocommerce-product-gallery__image img')
        image_url = None
        if img_tag and img_tag.get('data-src'):
             image_url = img_tag['data-src']
        elif img_tag and img_tag.get('src'):
             image_url = img_tag['src']
        else:
             imgs = [img.get('src') for img in soup.find_all('img') if img.get('src') and 'wp-content/uploads' in img.get('src', '')]
             if imgs: image_url = imgs[0]
             
        if image_url and image_url.startswith('//'):
             image_url = 'https:' + image_url

        return ModelSchema(
            company_name="Box Panel Chile",
            model_name=model_name,
            model_url=url,
            category=category,
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=price_match.group(0) if price_match else None,
            delivery_modes=["Kit Autoconstrucción", "Obra Gruesa"],
            structure_material="Panel SIP OSB APA 114 mm",
            includes_assembly=False,
            includes_transport=False,
            description="Kit estructural térmico (Materiales + Planos de Arquitectura y Montaje).",
            image_urls=[image_url] if image_url else []
        )
