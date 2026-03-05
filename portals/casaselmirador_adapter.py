import re
from typing import List, Optional
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

class CasasElMiradorAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://casaselmirador.cl")

    def discover_model_urls(self) -> List[str]:
        soup = self.get_soup(f"{self.base_url}")
        if not soup:
            return []

        urls = set()
        for a in soup.find_all('a', href=True):
            href = a['href']
            # Las páginas de modelos tienen el patrón /casa-XXmts2-.../
            if re.search(r'/casa-\d+mts2-', href):
                urls.add(href)

        logger.info(f"Descubiertos {len(urls)} modelos en {self.base_url}")
        return list(urls)

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Casas El Mirador",
            domain="casaselmirador.cl",
            website=self.base_url,
            company_type="Fabricante / Constructora",
            specialty="Casas Prefabricadas de Madera",
            base_city="Talca",
            base_region="Maule",
            services=["Pack Básico", "Pack Completo sin Piso", "Pack Completo con Piso"],
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        soup = self.get_soup(url)
        if not soup:
            return None

        text_content = soup.get_text(separator=' ', strip=True)

        # Nombre del modelo desde el h1
        h1 = soup.find('h1')
        model_name = h1.get_text(strip=True) if h1 else url.strip('/').split('/')[-1].replace('-', ' ').title()

        # Superficie desde el nombre del modelo (Ej: Casa 36mts2)
        m2_match = re.search(r'(\d+)\s*mts2', model_name, re.IGNORECASE)
        surface = float(m2_match.group(1)) if m2_match else None

        # Dormitorios
        beds_match = re.search(r'(\d+)\s*dormitorio', text_content, re.IGNORECASE)
        bedrooms = int(beds_match.group(1)) if beds_match else None

        # Baños
        baths_match = re.search(r'(\d+)\s*ba[ñn]o', text_content, re.IGNORECASE)
        bathrooms = int(baths_match.group(1)) if baths_match else None

        # Precio puesta en fábrica (precio base del pack básico)
        price_match = re.search(r'Precio puesta en f[áa]brica\s*\$\s*([\d\.]+)', text_content, re.IGNORECASE)
        price_val, currency = None, None
        if price_match:
            price_str = '$' + price_match.group(1)
            price_val, currency = Normalizer.normalize_price(price_str)

        # Imagen: og:image o primera imagen de wp-content
        image_url = None
        og_image = soup.find('meta', property='og:image')
        if og_image and og_image.get('content'):
            image_url = og_image['content']
        else:
            for img in soup.find_all('img', src=True):
                src = img['src']
                if 'wp-content' in src and any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.webp', '.png']):
                    low = src.lower()
                    if not any(bad in low for bad in ['logo', 'icon', 'thumb']):
                        image_url = src
                        break

        # PDF ficha
        pdf_link = None
        for a in soup.find_all('a', href=True):
            if '.pdf' in a['href'].lower():
                pdf_link = a['href']
                break

        # Estilo desde el nombre (2 agua / 4 agua / 6 agua)
        style_match = re.search(r'(\d+\s*agua)', model_name, re.IGNORECASE)
        style = style_match.group(1).title() if style_match else None

        return ModelSchema(
            company_name="Casas El Mirador",
            model_name=model_name,
            model_url=url,
            category="Prefabricada Madera",
            style=style,
            surface_m2=surface,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            price_from=price_val,
            currency=currency,
            original_price_text=f"${price_match.group(1)}" if price_match else None,
            delivery_modes=["Pack Básico", "Pack Completo sin Piso", "Pack Completo con Piso"],
            structure_material="Pino Impregnado 2x3",
            includes_assembly=False,
            includes_transport=False,
            pdf_ficha_url=pdf_link,
            description="Casas prefabricadas de madera fabricadas en Talca. Despacho a todo Chile.",
            image_urls=[image_url] if image_url else []
        )
