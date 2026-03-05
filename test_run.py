from portals.casasflorida_adapter import CasasFloridaAdapter
from portals.casasohiggins_adapter import CasasOHigginsAdapter
from portals.casasamerica_adapter import CasasAmericaAdapter
from portals.casasprefabricadaschile_adapter import CasasPrefabricadasChileAdapter
from portals.casasvespucio_adapter import CasasVespucioAdapter
from core.storage import Storage

storage = Storage()
adapters = [
    CasasFloridaAdapter(),
    CasasOHigginsAdapter(),
    CasasAmericaAdapter(),
    CasasPrefabricadasChileAdapter(),
    CasasVespucioAdapter()
]

all_companies = []
all_models = []

for adapter in adapters:
    company, models = adapter.scrape()
    all_companies.append(company)
    all_models.extend(models)

storage.save_companies(all_companies)
storage.save_models(all_models)
print("Updated 5 missing models")
