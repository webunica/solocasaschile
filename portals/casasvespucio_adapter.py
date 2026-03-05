import re
from typing import List, Optional
from bs4 import BeautifulSoup
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

class CasasVespucioAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://casasvespucio.cl")
    def discover_model_urls(self): pass
    def parse_model_page(self, url): pass
    def parse_company_info(self): return CompanySchema(name="Casas Vespucio", domain="casasvespucio.cl", website="https://casasvespucio.cl", company_type="Fabricante", specialty="Metalcon", base_city="Santiago", base_region="Metropolitana", services=["Venta de Kits Metalcon"], source_url="https://casasvespucio.cl")

    def scrape(self):
        company = self.parse_company_info()
        model = ModelSchema(
            company_name="Casas Vespucio",
            model_name="Mediterránea 75m2",
            model_url="https://casasvespucio.cl/casa-mediterranea-75mt2-html/",
            category="Prefabricada Metalcon",
            surface_m2=75, bedrooms=3, bathrooms=2, price_from=14900000, currency="CLP", string_price="$ 14.900.000",
            delivery_modes=["Kit Básico"], structure_material="Metalcon", includes_assembly=False, includes_transport=False,
            description="Sólida estructura en metalcon de corte mediterráneo moderno",
            image_urls=["https://casasvespucio.cl/wp-content/uploads/2022/10/75.jpg"]
        )
        return company, [model]
