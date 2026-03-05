import re
from typing import List, Optional
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)


class CasasSanAlbertoAdapter(BaseSiteAdapter):
    """
    Casas San Alberto - Empresa líder en casas prefabricadas desde Temuco al sur.
    Sitio WooCommerce en casasanalberto.com
    """
    def __init__(self):
        super().__init__("https://casasanalberto.com")

    def discover_model_urls(self) -> List[str]:
        """
        WooCommerce: productos en /casas-prefabricadas-2/ y /producto/
        """
        urls = set()

        # Página principal de catálogo
        soup = self.get_soup(f"{self.base_url}/casas-prefabricadas-2/")
        if soup:
            for a in soup.find_all('a', href=True):
                href = a['href']
                if '/producto/' in href and 'casasanalberto.com' in href:
                    urls.add(href.split('?')[0])

        # También intentar desde home
        soup2 = self.get_soup(self.base_url)
        if soup2:
            for a in soup2.find_all('a', href=True):
                href = a['href']
                if '/producto/' in href and 'casasanalberto.com' in href:
                    urls.add(href.split('?')[0])

        logger.info(f"Descubiertos {len(urls)} modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Casas San Alberto",
            domain="casasanalberto.com",
            website=self.base_url,
            company_type="Fabricante / Constructora",
            specialty="Casas Prefabricadas de Madera",
            base_city="Temuco",
            base_region="La Araucanía",
            services=["Kit Básico", "Servicio de Armado"],
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None

        text_content = soup.get_text(separator=' ', strip=True)

        h1 = soup.find('h1')
        model_name = h1.get_text(strip=True) if h1 else url.strip('/').split('/')[-1].replace('-', ' ').title()

        # m2 desde nombre – "casa 36 mts 2 a 2 aguas" → 36
        m2_match = re.search(r'(\d+)\s*[Mm]ts\.?\s*2', text_content)
        if not m2_match:
            m2_match = re.search(r'(\d+)\s*m[²2]', text_content, re.IGNORECASE)
        surface = float(m2_match.group(1)) if m2_match else None

        beds_match = re.search(r'(\d+)\s*[Dd]ormitorio', text_content)
        bedrooms = int(beds_match.group(1)) if beds_match else None

        baths_match = re.search(r'(\d+)\s*[Bb]a[ñn]o', text_content)
        bathrooms = int(baths_match.group(1)) if baths_match else None

        # Precio WooCommerce
        price_val, currency = None, None
        price_match = re.search(r'\$\s?(?:[1-9]\d{0,2}(?:[.,]\d{3})+)', text_content)
        if price_match:
            price_val, currency = Normalizer.normalize_price(price_match.group(0))

        # Imagen og:image
        image_url = None
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            image_url = og_image['content']
        else:
            for img in soup.find_all('img', src=True):
                src = img['src']
                if 'wp-content' in src and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.webp']):
                    low = src.lower()
                    if not any(bad in low for bad in ['logo', 'icon']):
                        image_url = src
                        break

        # Estilo (2 aguas / 6 aguas)
        style_match = re.search(r'[a-z]\s+(\d+)\s*[Aa]gua', text_content)
        style = f"{style_match.group(1)} Aguas" if style_match else None

        return ModelSchema(
            company_name="Casas San Alberto",
            model_name=model_name,
            model_url=url,
            category="Prefabricada Madera",
            style=style,
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=price_match.group(0) if price_match else None,
            delivery_modes=["Kit Básico", "Servicio de Armado"],
            structure_material="Madera de Alta Calidad",
            includes_assembly=False,
            includes_transport=False,
            description="Empresa líder en ventas de casas prefabricadas desde Temuco al sur. Reserva con $100.000.",
            image_urls=[image_url] if image_url else []
        )
