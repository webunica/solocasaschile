import re
from typing import List, Optional
from bs4 import BeautifulSoup
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

class TuCasaFacilAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://tucasafacil.cl")

    def discover_model_urls(self) -> List[str]:
        soup = self.get_soup(self.base_url)
        if not soup:
            return []
        
        # En Tu Casa Fácil los modelos están bajo /property/
        urls = set()
        for a in soup.find_all('a', href=True):
            href = a['href']
            if "/property/" in href and href != "https://tucasafacil.cl/property/":
                urls.add(href)
                
        logger.info(f"Descubiertos {len(urls)} modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        # Extraemos info estática conocida del sitio y dinámica del HTML
        return CompanySchema(
            name="Tu Casa Fácil",
            domain="tucasafacil.cl",
            website=self.base_url,
            company_type="Fabricante",
            specialty="Casas SIP",
            base_city="Llanquihue / Santiago",
            base_region="Los Lagos / Metropolitana",
            services=["Kit Inicial SIP", "Kit Inicial + Piso SIP"],
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None
            
        text_content = soup.get_text(separator=' ', strip=True)
        
        # Nombre del modelo
        title_tag = soup.find('h1')
        model_name = title_tag.text.strip() if title_tag else url.strip('/').split('/')[-1].replace('-', ' ').title()
        
        # Extracción vía expresiones regulares sobre el texto general
        
        # Precio: Buscamos el primer patrón de dinero grande asociado a SIP
        price_val, currency = None, None
        price_match = re.search(r'\$\s?(?:[1-9]\d{0,2}(?:\.\d{3}|\,\d{3}){2})', text_content)
        if price_match:
            price_val, currency = Normalizer.normalize_price(price_match.group(0))

        # Habitaciones y Baños
        beds_match = re.search(r'(\d+)\s*(?:Dormitorios|Beds)', text_content, re.IGNORECASE)
        baths_match = re.search(r'(\d+)\s*(?:Baños|Baths)', text_content, re.IGNORECASE)
        
        bedrooms = int(beds_match.group(1)) if beds_match else None
        bathrooms = int(baths_match.group(1)) if baths_match else None
        
        # Superficie
        m2_match = re.search(r'(\d+(?:\.\d+)?)\s*[mM]2', text_content)
        surface = Normalizer.normalize_m2(m2_match.group(1)) if m2_match else None
        if not surface and " m²" in text_content:
            m2_match2 = re.search(r'(\d+(?:\.\d+)?)\s*m²', text_content)
            surface = Normalizer.normalize_m2(m2_match2.group(1)) if m2_match2 else None

        # Imagen Principal a través de Open Graph (og:image) o primera imagen grande
        image_url = None
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            image_url = og_image['content']
        else:
            # Busqueda alternativa: buscar la primera tag img del bloque main o article
            first_img = soup.find('img')
            if first_img and first_img.get('src'):
                image_url = first_img['src']

        return ModelSchema(
            company_name="Tu Casa Fácil",
            model_name=model_name,
            model_url=url,
            category="SIP",
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=price_match.group(0) if price_match else None,
            delivery_modes=["Kit Básico", "Kit + Piso"],
            structure_material="Panel SIP",
            includes_assembly=False,
            includes_transport=False,
            description="Extraído de Tu Casa Fácil",
            image_urls=[image_url] if image_url else []
        )
