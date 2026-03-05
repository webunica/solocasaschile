import re
from typing import List, Optional
from bs4 import BeautifulSoup
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

class CasasFloridaAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://casasflorida.cl")

    def discover_model_urls(self) -> List[str]:
        soup = self.get_soup(self.base_url)
        if not soup:
            return []
            
        urls = set()
        for a in soup.find_all('a', href=True):
            href = a['href']
            if 'casa' in href and self.base_url in href and len(href.split('/')) > 3:
                urls.add(href)
                
        logger.info(f"Descubiertos {len(urls)} modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Casas Florida",
            domain="casasflorida.cl",
            website=self.base_url,
            company_type="Fabricante",
            specialty="Casas Prefabricadas",
            base_city="Santiago",
            base_region="Metropolitana",
            services=["Venta de Kits"],
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None
            
        text_content = soup.get_text(separator=' ', strip=True)
        
        title_tag = soup.find('h1')
        model_name = title_tag.text.strip().title() if title_tag else url.strip('/').split('/')[-1].replace('-', ' ').title()

        surface = None
        m2_match = re.search(r'(\d+(?:,\d+|\.\d+)?)\s*m2?', text_content, re.IGNORECASE)
        if m2_match:
            surface = float(m2_match.group(1).replace(',', '.'))
        
        bedrooms = None
        beds_match = re.search(r'(\d+)\s*DORMITORIOS?', text_content, re.IGNORECASE)
        if beds_match:
            bedrooms = int(beds_match.group(1))

        bathrooms = None
        baths_match = re.search(r'(\d+)\s*BAÑO?', text_content, re.IGNORECASE)
        if baths_match:
            bathrooms = int(baths_match.group(1))
        
        price_val, currency = None, None
        price_match = re.search(r'\$\s?(?:[1-9]\d{0,2}(?:\.\d{3}|\,\d{3}){2}|\d{1,3}(?:\.\d{3}|\,\d{3}))', text_content)
        if price_match:
            price_val, currency = Normalizer.normalize_price(price_match.group(0))

        image_url = None
        img_tags = [img.get('data-src') or img.get('src') for img in soup.find_all('img')]
        filtered_imgs = [
             src for src in img_tags if src
             and not any(x in src.lower() for x in ['logo', 'icon', 'whatsapp', 'svg', 'data:', 'fb-', 'instagram'])
             and not src.lower().endswith(('.png', '.svg'))
        ]
        
        if filtered_imgs:
             image_url = filtered_imgs[0]
             if image_url.startswith('/'):
                 image_url = self.base_url + image_url
             if image_url.startswith('//'):
                  image_url = 'https:' + image_url

        return ModelSchema(
            company_name="Casas Florida",
            model_name=model_name.replace('Casa', '').strip(), 
            model_url=url,
            category="Prefabricada Madera",
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=price_match.group(0) if price_match else None,
            delivery_modes=["Kit Básico"],
            structure_material="Madera",
            includes_assembly=False,
            includes_transport=False,
            description="Variedad en diseños y calidad en casas prefabricadas.",
            image_urls=[image_url] if image_url else []
        )
