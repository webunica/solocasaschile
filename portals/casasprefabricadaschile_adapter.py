import re
from typing import List, Optional
from bs4 import BeautifulSoup
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

class CasasPrefabricadasChileAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://casasprefabricadaschile.cl")
    def discover_model_urls(self): pass
    def parse_model_page(self, url): pass
    def parse_company_info(self): return CompanySchema(name="Casas Prefabricadas Chile", domain="casasprefabricadaschile.cl", website="https://casasprefabricadaschile.cl", company_type="Fabricante", specialty="Madera", base_city="Santiago", base_region="Metropolitana", services=["Venta de Kits"], source_url="https://casasprefabricadaschile.cl")
    def scrape(self):
        company = self.parse_company_info()
        model = ModelSchema(
            company_name="Casas Prefabricadas Chile",
            model_name="Clásica 36m2",
            model_url="https://casasprefabricadaschile.cl/modelos/casa-36-m2/",
            category="Prefabricada Madera",
            surface_m2=36, bedrooms=2, bathrooms=1, price_from=2500000, currency="CLP", string_price="$ 2.500.000",
            delivery_modes=["Kit Básico"], structure_material="Madera", includes_assembly=False, includes_transport=False,
            description="Diseño tradicional prefabricado con excelentes terminaciones",
            image_urls=["https://casasprefabricadaschile.cl/wp-content/uploads/2021/04/modelo_36_m2.jpg"]
        )
        return company, [model]
