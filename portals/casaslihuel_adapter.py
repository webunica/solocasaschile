import re
from typing import List, Optional
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

# URLs reales de modelos de Casas Lihuel (descubiertas de la página de modelos)
# El sitio presenta líneas con catálogos PDF, sin páginas individuales por modelo.
# Los modelos se descubren por línea desde /modelos/
LIHUEL_LINES = {
    "Línea Nogal":  "https://www.casaslihuel.cl/linea-nogal/",
    "Línea Olivo":  "https://www.casaslihuel.cl/linea-olivo/",
    "Línea Arrayán": "https://www.casaslihuel.cl/linea-arrayan/",
    "Línea Álamo":  "https://www.casaslihuel.cl/linea-alamo/",
    "Línea Ciprés": "https://www.casaslihuel.cl/linea-cipres/",
    "Línea Quillay": "https://www.casaslihuel.cl/linea-quillay/",
    "Línea Raulí":  "https://www.casaslihuel.cl/linea-rauli/",
}


class CasasLihuelAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://www.casaslihuel.cl")

    def discover_model_urls(self) -> List[str]:
        """
        Casas Lihuel estructura su catálogo por líneas, cada una con
        múltiples sub-modelos. Usamos las URLs de línea como modelo.
        """
        soup = self.get_soup(f"{self.base_url}/modelos/")
        if not soup:
            return list(LIHUEL_LINES.values())

        urls = set()
        for a in soup.find_all('a', href=True):
            href = a['href']
            if '/linea-' in href and href.startswith(self.base_url):
                urls.add(href)

        if not urls:
            urls = set(LIHUEL_LINES.values())

        logger.info(f"Descubiertos {len(urls)} líneas/modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Casas Lihuel",
            domain="casaslihuel.cl",
            website=self.base_url,
            company_type="Fabricante / Constructora",
            specialty="Casas Prefabricadas de Madera",
            base_city="Santiago",
            base_region="Metropolitana",
            services=["Kit Inicial", "Llave en Mano"],
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None

        text_content = soup.get_text(separator=' ', strip=True)

        # Nombre: h1 o slug de la URL
        h1 = soup.find('h1')
        model_name = h1.get_text(strip=True) if h1 else url.strip('/').split('/')[-1].replace('-', ' ').title()

        # Superficie: buscar patrones "36 m2", "desde 36m2", etc.
        m2_match = re.search(r'(\d+)\s*m2', text_content, re.IGNORECASE)
        surface = float(m2_match.group(1)) if m2_match else None

        # Dormitorios y baños
        beds_match = re.search(r'(\d+)\s*[Dd]ormitorio', text_content)
        bedrooms = int(beds_match.group(1)) if beds_match else None

        baths_match = re.search(r'(\d+)\s*[Bb]a[ñn]o', text_content)
        bathrooms = int(baths_match.group(1)) if baths_match else None

        # Precio
        price_val, currency = None, None
        price_match = re.search(r'\$\s?(?:[1-9]\d{0,2}(?:[.\d]{3})+)', text_content)
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

        # PDF de catálogo
        pdf_link = None
        for a in soup.find_all('a', href=True):
            if '.pdf' in a['href'].lower():
                pdf_link = a['href']
                break

        return ModelSchema(
            company_name="Casas Lihuel",
            model_name=model_name,
            model_url=url,
            category="Prefabricada Madera",
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=price_match.group(0) if price_match else None,
            delivery_modes=["Kit Inicial", "Llave en Mano"],
            structure_material="Madera Pino",
            includes_assembly=True,
            includes_transport=False,
            pdf_ficha_url=pdf_link,
            description="Línea de casas prefabricadas de madera de Casas Lihuel. Más de 50 modelos disponibles.",
            image_urls=[image_url] if image_url else []
        )
