import re
from typing import List, Optional
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

# URLs reales de productos en la tienda WooCommerce de Temukit
TEMUKIT_PRODUCT_URLS = [
    "https://temukit.cl/shop/2-aguas/",
    "https://temukit.cl/shop/4-aguas/",
    "https://temukit.cl/shop/6-aguas/",
    "https://temukit.cl/shop/bellavista/",
    "https://temukit.cl/shop/innova/",
    "https://temukit.cl/shop/millantu/",
]


class TemukitAdapter(BaseSiteAdapter):
    """
    Temukit - Casas prefabricadas en Temuco, La Araucanía.
    Sitio WooCommerce con 6 modelos publicados en temukit.cl/tienda/
    Más de 500 casas vendidas.
    """
    def __init__(self):
        super().__init__("https://temukit.cl")

    def discover_model_urls(self) -> List[str]:
        """
        Descubrir desde la tienda WooCommerce.
        """
        soup = self.get_soup(f"{self.base_url}/tienda/")
        if not soup:
            return TEMUKIT_PRODUCT_URLS  # fallback con URLs conocidas

        urls = set()
        for a in soup.find_all('a', href=True):
            href = a['href']
            if 'temukit.cl/shop/' in href:
                # Normalizar: quitar parámetros
                clean = href.split('?')[0].rstrip('/') + '/'
                urls.add(clean)

        # Si no encontró nada via scraping, usar lista conocida
        if not urls:
            urls = set(TEMUKIT_PRODUCT_URLS)

        logger.info(f"Descubiertos {len(urls)} modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Temukit",
            domain="temukit.cl",
            website=self.base_url,
            company_type="Fabricante / Constructora",
            specialty="Casas Prefabricadas de Madera",
            base_city="Temuco",
            base_region="La Araucanía",
            services=["Kit Básico", "Pack Completo"],
            source_url=f"{self.base_url}/tienda/"
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None

        text_content = soup.get_text(separator=' ', strip=True)

        # Nombre: h1
        h1 = soup.find('h1')
        model_name = h1.get_text(strip=True) if h1 else url.strip('/').split('/')[-1].replace('-', ' ').title()

        # Superficie m2 desde el nombre o descripción
        m2_match = re.search(r'(\d+)\s*m[²2]', text_content, re.IGNORECASE)
        surface = float(m2_match.group(1)) if m2_match else None

        # Dormitorios
        beds_match = re.search(r'(\d+)\s*[Dd]ormitorio', text_content)
        bedrooms = int(beds_match.group(1)) if beds_match else None

        # Baños
        baths_match = re.search(r'(\d+)\s*[Bb]a[ñn]o', text_content)
        bathrooms = int(baths_match.group(1)) if baths_match else None

        # Precio: WooCommerce publica formato $X,XXX,XXX.XX
        price_val, currency = None, None
        original_price = None
        # Buscar precio "desde" en formato WooCommerce
        precio_match = re.search(r'\$\s?([\d,\.]+(?:\.\d{2})?)', text_content)
        if precio_match:
            raw = precio_match.group(0)
            original_price = raw
            price_val, currency = Normalizer.normalize_price(raw)

        # Imagen: og:image (WooCommerce lo setea)
        image_url = None
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            image_url = og_image['content']
        else:
            for img in soup.find_all('img', src=True):
                src = img['src']
                if 'wp-content/uploads' in src and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.webp']):
                    low = src.lower()
                    if not any(bad in low for bad in ['logo', 'icon', '150x150', '39x39']):
                        image_url = src
                        break

        # Estilo (2/4/6 aguas)
        style_match = re.search(r'(\d+)\s*[Aa]guas?', model_name + ' ' + text_content[:200])
        style = f"{style_match.group(1)} Aguas" if style_match else None

        return ModelSchema(
            company_name="Temukit",
            model_name=model_name,
            model_url=url,
            category="Prefabricada Madera",
            style=style,
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=original_price,
            delivery_modes=["Kit Básico", "Pack Completo"],
            structure_material="Madera",
            includes_assembly=False,
            includes_transport=False,
            description="Casas prefabricadas en Temuco. Más de 500 casas entregadas en La Araucanía y Chile.",
            image_urls=[image_url] if image_url else []
        )
