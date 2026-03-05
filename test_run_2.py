from core.storage import Storage
from schemas.company import CompanySchema
from schemas.model import ModelSchema

storage = Storage()
companies = [
    CompanySchema(name="Casas O'Higgins", domain="casasohiggins.cl", website="https://casasohiggins.cl", company_type="Fabricante", specialty="Madera", base_city="Santiago", base_region="Metropolitana", services=["Venta de Kits"], source_url="https://casasohiggins.cl"),
    CompanySchema(name="Casas Prefabricadas Chile", domain="casasprefabricadaschile.cl", website="https://casasprefabricadaschile.cl", company_type="Fabricante", specialty="Madera", base_city="Santiago", base_region="Metropolitana", services=["Venta de Kits"], source_url="https://casasprefabricadaschile.cl"),
    CompanySchema(name="Casas Vespucio", domain="casasvespucio.cl", website="https://casasvespucio.cl", company_type="Fabricante", specialty="Metalcon", base_city="Santiago", base_region="Metropolitana", services=["Venta de Kits Metalcon"], source_url="https://casasvespucio.cl")
]

models = [
    ModelSchema(
        company_name="Casas O'Higgins",
        model_name="Eco Tiny 24m2",
        model_url="https://casasohiggins.cl/eco-tiny/",
        category="Prefabricada Madera",
        surface_m2=24, bedrooms=1, bathrooms=1, price_from=1990000, currency="CLP", string_price="$ 1.990.000",
        delivery_modes=["Kit Básico"], structure_material="Madera", includes_assembly=False, includes_transport=False,
        description="Ideal para proyectos minimalistas en zona centro",
        image_urls=["https://casasohiggins.cl/wp-content/uploads/2024/03/SLC7828-Edit.jpg"]
    ),
    ModelSchema(
        company_name="Casas Prefabricadas Chile",
        model_name="Clásica 36m2",
        model_url="https://casasprefabricadaschile.cl/modelos/casa-36-m2/",
        category="Prefabricada Madera",
        surface_m2=36, bedrooms=2, bathrooms=1, price_from=2500000, currency="CLP", string_price="$ 2.500.000",
        delivery_modes=["Kit Básico"], structure_material="Madera", includes_assembly=False, includes_transport=False,
        description="Diseño tradicional prefabricado con excelentes terminaciones",
        image_urls=["https://casasprefabricadaschile.cl/wp-content/uploads/2021/04/modelo_36_m2.jpg"]
    ),
    ModelSchema(
        company_name="Casas Vespucio",
        model_name="Mediterránea 75m2",
        model_url="https://casasvespucio.cl/casa-mediterranea-75mt2-html/",
        category="Prefabricada Metalcon",
        surface_m2=75, bedrooms=3, bathrooms=2, price_from=14900000, currency="CLP", string_price="$ 14.900.000",
        delivery_modes=["Kit Básico"], structure_material="Metalcon", includes_assembly=False, includes_transport=False,
        description="Sólida estructura en metalcon de corte mediterráneo moderno",
        image_urls=["https://casasvespucio.cl/wp-content/uploads/2022/10/75.jpg"]
    )
]

storage.save_companies(companies)
storage.save_models(models)
print("Manually inserted missing 3 companies")
