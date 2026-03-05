import re
from typing import List, Optional
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

class MetalkitAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://www.metalkit.cl")
        self.model_cache = {}

    def discover_model_urls(self) -> List[str]:
        soup = self.get_soup("https://www.metalkit.cl/casas-prefabricadas/")
        if not soup:
            return []
        
        urls = set()
        
        # Intentamos obtener los precios también desde el listado
        for div in soup.find_all('div'):
            div_text = div.get_text(separator=' ', strip=True)
            if 'Rango de precios' in div_text or '$' in div_text:
                for a in div.find_all('a', href=True):
                    href = a['href']
                    if "casas-prefabricadas/modelo-" in href and href.endswith('/'):
                        urls.add(href)
                        price_match = re.search(r'\$\s?[0-9\.]+\s*-\s*\$\s?[0-9\.]+', div_text)
                        if price_match and href not in self.model_cache:
                            self.model_cache[href] = price_match.group(0)

        # Respaldo general para buscar todos los links
        for a in soup.find_all('a', href=True):
             href = a['href']
             if "casas-prefabricadas/modelo-" in href and href.endswith('/'):
                 urls.add(href)

        logger.info(f"Descubiertos {len(urls)} modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Metalkit",
            domain="metalkit.cl",
            website=self.base_url,
            company_type="Fabricante",
            specialty="Estructuras de Acero Galvanizado / Metalcon",
            base_city="Santiago",
            base_region="Metropolitana",
            services=["Kits de Autoconstrucción Estructural"],
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None
            
        text_content = soup.get_text(separator=' ', strip=True)
        
        # Nombre del modelo
        title_match = re.search(r'Modelo\s+[A-Z]-\d+', text_content, re.IGNORECASE)
        model_name = title_match.group(0).title() if title_match else url.strip('/').split('/')[-1].replace('-', ' ').title()
        
        # Metros Cuadrados, Dormitorios, Baños (ej. 76 metros cuadrados | 4 Dormitorios | 2 Baños)
        m2_match = re.search(r'(\d+(?:\.\d+)?)\s*metros\s+cuadrados', text_content, re.IGNORECASE)
        if not m2_match: 
            m2_match = re.search(r'(\d+(?:\.\d+)?)\s*m2', text_content, re.IGNORECASE)
        surface = float(m2_match.group(1)) if m2_match else None

        beds_match = re.search(r'(\d+)\s*Dormitorio', text_content, re.IGNORECASE)
        bedrooms = int(beds_match.group(1)) if beds_match else None

        baths_match = re.search(r'(\d+)\s*Baño', text_content, re.IGNORECASE)
        bathrooms = int(baths_match.group(1)) if baths_match else None
        
        # PDF Enlace
        pdf_link = None
        for a in soup.find_all('a', href=True):
            if a['href'].endswith('.pdf'):
                pdf_link = a['href']
                break

        # Precio
        price_val, currency = None, None
        original_price = self.model_cache.get(url)
        
        # Si no lo encontramos en la cache del listado, buscamos en la pagina
        if not original_price:
            p_match = re.search(r'\$\s?(?:[1-9]\d{0,2}(?:\.\d{3}|\,\d{3}){2})', text_content)
            original_price = p_match.group(0) if p_match else None

        if original_price:
            p_match = re.search(r'\$\s?(?:[1-9]\d{0,2}(?:\.\d{3}|\,\d{3}){2})', original_price)
            if p_match:
                price_val, currency = Normalizer.normalize_price(p_match.group(0))

        # Imagen
        image_url = None
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            image_url = og_image['content']
        else:
            first_img = soup.find('img', class_=lambda c: c and 'attachment-post-thumbnail' in c) 
            if first_img:
                 image_url = first_img.get('src')

        return ModelSchema(
            company_name="Metalkit",
            model_name=model_name,
            model_url=url,
            category="Metalcon",
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=original_price,
            delivery_modes=["Kit Estructura (Autoconstrucción)"],
            structure_material="Acero Galvanizado (Metalcon)",
            includes_assembly=False,
            includes_transport=False,
            pdf_ficha_url=pdf_link,
            description="Kit estructural inteligente prefabricado.",
            image_urls=[image_url] if image_url else []
        )
