import re
from typing import List, Optional
from bs4 import BeautifulSoup
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

class CasasSipAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://casassip.cl")

    def discover_model_urls(self) -> List[str]:
        urls = set()
        
        # Try a few pagination pages to make sure we grab all or most
        for page in range(1, 4):
            soup = self.get_soup(f"{self.base_url}/casas/page/{page}/") if page > 1 else self.get_soup(f"{self.base_url}/casas/")
            if not soup:
                break
                
            page_urls = set()
            for a in soup.find_all('a', href=True):
                href = a['href']
                if '/casa/' in href and href.startswith(self.base_url):
                    page_urls.add(href)
            
            if not page_urls:
                break
            urls.update(page_urls)
                
        logger.info(f"Descubiertos {len(urls)} modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Trupanel Casas SIP",
            domain="casassip.cl",
            website=self.base_url,
            company_type="Fabricante",
            specialty="Paneles SIP",
            base_city="Santiago",
            base_region="Metropolitana",
            services=["Venta de Kits", "Despacho a todo Chile"],
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None
            
        text_content = soup.get_text(separator=' ', strip=True)
        
        # Titulo
        title_tag = soup.find('h1')
        model_name = title_tag.text.strip() if title_tag else url.strip('/').split('/')[-1].replace('-', ' ').title()

        # Superficie (e.g., Superficie total : 115,2 m²)
        surface = None
        m2_match = re.search(r'superficie.*?:\s*(\d+(?:,\d+|\.\d+)?)\s*m2?', text_content, re.IGNORECASE)
        if not m2_match:
            # Fallback en titulo o en tab text 
            m2_match = re.search(r'(\d+(?:,\d+|\.\d+)?)\s*m2?', text_content, re.IGNORECASE)
            
        if m2_match:
            surface = float(m2_match.group(1).replace(',', '.'))
        
        # Dormitorios 
        bedrooms = None
        beds_match = re.search(r'dormitorios?\s*:\s*(\d+)', text_content, re.IGNORECASE)
        if beds_match:
            bedrooms = int(beds_match.group(1))

        # Baños
        bathrooms = None
        baths_match = re.search(r'baños?\s*:\s*(\d+)', text_content, re.IGNORECASE)
        if baths_match:
            bathrooms = int(baths_match.group(1))
        
        # Precio
        price_val, currency = None, None
        price_match = re.search(r'\$\s?(?:[1-9]\d{0,2}(?:\.\d{3}|\,\d{3}){2}|\d{1,3}(?:\.\d{3}|\,\d{3}))', text_content)
        if price_match:
            price_val, currency = Normalizer.normalize_price(price_match.group(0))

        # Imagen
        image_url = None
        img_tags = [img.get('data-src') or img.get('src') for img in soup.find_all('img')]
        filtered_imgs = [
             src for src in img_tags if src
             and not any(x in src.lower() for x in ['logo', 'icon', 'webpay', 'svg', 'data:', 'fb-', 'instagram', 'avatar'])
             and 'wp-content/uploads' in src
        ]
        
        if filtered_imgs:
             image_url = filtered_imgs[0]
             if image_url.startswith('//'):
                  image_url = 'https:' + image_url

        return ModelSchema(
            company_name="Trupanel Casas SIP",
            model_name=model_name,
            model_url=url,
            category="Kit SIP",
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=price_match.group(0) if price_match else None,
            delivery_modes=["Kit Básico", "Kit Plus"],
            structure_material="Panel SIP",
            includes_assembly=False,
            includes_transport=False,
            description="Especialistas en la fabricación de viviendas panel SIP. Kits de autoconstrucción eficientes.",
            image_urls=[image_url] if image_url else []
        )
