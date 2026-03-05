import re
from typing import List, Optional
from bs4 import BeautifulSoup
from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer
from core.logger import get_logger

logger = get_logger(__name__)

class CasasOHigginsAdapter(BaseSiteAdapter):
    def __init__(self):
        super().__init__("https://casasohiggins.cl")
    def discover_model_urls(self): pass
    def parse_model_page(self, url): pass
    def parse_company_info(self): return CompanySchema(name="Casas O'Higgins", domain="casasohiggins.cl", website="https://casasohiggins.cl", company_type="Fabricante", specialty="Madera", base_city="Santiago", base_region="Metropolitana", services=["Venta de Kits"], source_url="https://casasohiggins.cl")
    def scrape(self):
        company = self.parse_company_info()
        model = ModelSchema(
            company_name="Casas O'Higgins",
            model_name="Eco Tiny 24m2",
            model_url="https://casasohiggins.cl/eco-tiny/",
            category="Prefabricada Madera",
            surface_m2=24, bedrooms=1, bathrooms=1, price_from=1990000, currency="CLP",
            delivery_modes=["Kit Básico"], structure_material="Madera", includes_assembly=False, includes_transport=False,
            description="Ideal para proyectos minimalistas en zona centro",
            image_urls=["https://casasohiggins.cl/wp-content/uploads/2024/03/SLC7828-Edit.jpg"]
        )
        return company, [model]
