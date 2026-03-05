import re
from typing import List, Optional
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)


class ChileHomeAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://chilehome.cl")

    def discover_model_urls(self) -> List[str]:
        """
        ChileHome presenta modelos en la homepage bajo secciones.
        Buscamos links que contengan /modelo/ o /casa- en el dominio.
        """
        soup = self.get_soup(self.base_url)
        if not soup:
            return []

        urls = set()
        for a in soup.find_all('a', href=True):
            href = a['href']
            if re.search(r'chilehome\.cl/(modelo|casa)-', href):
                urls.add(href)

        # Si no encontró nada, intentar sección de catálogo
        if not urls:
            soup2 = self.get_soup(f"{self.base_url}/catalogo/")
            if soup2:
                for a in soup2.find_all('a', href=True):
                    href = a['href']
                    if 'chilehome.cl' in href and re.search(r'/(modelo|casa)-', href):
                        urls.add(href)

        logger.info(f"Descubiertos {len(urls)} modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Chile Home",
            domain="chilehome.cl",
            website=self.base_url,
            company_type="Fabricante",
            specialty="Casas Prefabricadas de Madera / Pino Impregnado",
            base_city="Santiago",
            base_region="Metropolitana",
            services=["Despacho a domicilio", "Despacho nacional"],
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None

        text_content = soup.get_text(separator=' ', strip=True)

        h1 = soup.find('h1')
        model_name = h1.get_text(strip=True) if h1 else url.strip('/').split('/')[-1].replace('-', ' ').title()

        m2_match = re.search(r'(\d+)\s*m[²2]', text_content, re.IGNORECASE)
        surface = float(m2_match.group(1)) if m2_match else None

        beds_match = re.search(r'(\d+)\s*[Dd]ormitorio', text_content)
        bedrooms = int(beds_match.group(1)) if beds_match else None

        baths_match = re.search(r'(\d+)\s*[Bb]a[ñn]o', text_content)
        bathrooms = int(baths_match.group(1)) if baths_match else None

        # Precio: ChileHome publica desde $X.XXX.XXX
        price_val, currency = None, None
        price_match = re.search(r'\$\s?(?:[1-9]\d{0,2}(?:[.\d]{3})+)', text_content)
        if price_match:
            price_val, currency = Normalizer.normalize_price(price_match.group(0))

        image_url = None
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            image_url = og_image['content']
        else:
            for img in soup.find_all('img', src=True):
                src = img['src']
                if any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.webp']):
                    low = src.lower()
                    if not any(bad in low for bad in ['logo', 'icon', 'banner']):
                        image_url = src
                        break

        return ModelSchema(
            company_name="Chile Home",
            model_name=model_name,
            model_url=url,
            category="Prefabricada Madera",
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=price_match.group(0) if price_match else None,
            delivery_modes=["Despacho a domicilio"],
            structure_material="Pino Impregnado",
            includes_assembly=False,
            includes_transport=True,
            description="Casa prefabricada de pino impregnado. Más de 25.000 casas vendidas en Chile.",
            image_urls=[image_url] if image_url else []
        )
