from portals.base_site_adapter import BaseSiteAdapter
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.normalizer import Normalizer

class MockAdapter(BaseSiteAdapter):
    \"\"\"Adaptador de demostración simulando una web real para el MVP.\"\"\"
    def discover_model_urls(self) -> list[str]:
        return [f"{self.base_url}/modelo-1", f"{self.base_url}/modelo-2"]

    def parse_company_info(self) -> CompanySchema:
        return CompanySchema(
            name="Casas Prefabricadas Mock",
            domain="mock-casas.cl",
            website=self.base_url,
            company_type="Fabricante",
            specialty="Casas SIP",
            base_city="Temuco",
            base_region="La Araucanía",
            source_url=self.base_url
        )

    def parse_model_page(self, url: str) -> ModelSchema:
        price_text = "$ 25.500.000" if "1" in url else "1200 UF"
        m2_text = "54 m2" if "1" in url else "80 m2"
        
        val, curr = Normalizer.normalize_price(price_text)
        m2 = Normalizer.normalize_m2(m2_text)
        
        return ModelSchema(
            company_name="Casas Prefabricadas Mock",
            model_name=f"Modelo Demos {'1' if '1' in url else '2'}",
            model_url=url,
            category="SIP",
            surface_m2=m2,
            bedrooms=3 if "2" in url else 2,
            bathrooms=2 if "2" in url else 1,
            price_from=val,
            currency=curr,
            original_price_text=price_text,
            delivery_modes=["Kit Básico", "Llave en mano"]
        )
