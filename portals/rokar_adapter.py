import re
from typing import List, Optional
from bs4 import BeautifulSoup
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

class RokarAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://rokar.cl")

    def discover_model_urls(self) -> List[str]:
        # Search in the standard category endpoints
        urls = set()
        endpoints = ["https://rokar.cl/linea-hogar/", "https://rokar.cl/linea-montana/"]
        for ep in endpoints:
            soup = self.get_soup(ep)
            if not soup:
                continue
            
            for a in soup.find_all('a', href=True):
                href = a['href']
                if "rokar.cl/modelo-" in href and href.endswith('/'):
                    urls.add(href)
                
        logger.info(f"Descubiertos {len(urls)} modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Rokar Constructora",
            domain="rokar.cl",
            website=self.base_url,
            company_type="Constructora",
            specialty="Casas de Madera y Paneles SIP",
            base_city="Temuco",
            base_region="La Araucanía",
            services=["Llave en Mano"],
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None
            
        text_content = soup.get_text(separator=' ', strip=True)
        
        # Titulo
        title_tag = soup.find('h1')
        title_text = title_tag.text.strip() if title_tag else url.strip('/').split('/')[-1].replace('-', ' ').title()
        
        model_name_match = re.search(r'Modelo\s+(.*?)(?:\s+|$)', title_text, re.IGNORECASE)
        model_name = model_name_match.group(1).strip() if model_name_match else title_text

        # Superficie
        m2_match = re.search(r'(\d+(?:,\d+|\.\d+)?)\s*m2', text_content, re.IGNORECASE)
        surface = float(m2_match.group(1).replace(',', '.')) if m2_match else None

        # Dormitorios
        beds_match = re.search(r'(\d+)\s*dormitorio', text_content, re.IGNORECASE)
        bedrooms = int(beds_match.group(1)) if beds_match else None

        # Baños
        baths_match = re.search(r'(\d+)\s*baño', text_content, re.IGNORECASE)
        bathrooms = int(baths_match.group(1)) if baths_match else None
        
        # Category (Linea)
        category = "Línea Montaña" if "montana" in url or "montaña" in text_content.lower() else "Línea Hogar"
        
        # Precio (Ej. "Precio “Llave en mano Rokar” es de 8679,5 UF")
        price_val, currency = None, None
        price_match = re.search(r'(\d+(?:,\d+|\.\d+)?)\s*UF', text_content, re.IGNORECASE)
        if price_match:
            price_val = float(price_match.group(1).replace(',', '.'))
            currency = "UF"
            original_price = f"{price_match.group(1)} UF"
        else:
            original_price = None

        # Imagen
        image_url = None
        img_tags = [img.get('src') for img in soup.find_all('img') if img.get('src')]
        filtered_imgs = [
             src for src in img_tags
             if not any(x in src.lower() for x in ['logo', 'icon', 'whatsapp', 'facebook', 'instagram', 'svg', 'data:', '.png'])
             and 'wp-content/uploads' in src
        ]
        if filtered_imgs:
             image_url = filtered_imgs[0]
             if image_url.startswith('//'):
                  image_url = 'https:' + image_url

        return ModelSchema(
            company_name="Rokar Constructora",
            model_name=model_name,
            model_url=url,
            category=category,
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=original_price,
            delivery_modes=["Llave en Mano"],
            structure_material="Madera / Panel SIP",
            includes_assembly=True,
            includes_transport=False,
            description="Construcción Llave en Mano en el sur de Chile.",
            image_urls=[image_url] if image_url else []
        )
