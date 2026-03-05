from portals.casasohiggins_adapter import CasasOHigginsAdapter
from portals.casasprefabricadaschile_adapter import CasasPrefabricadasChileAdapter
from portals.casasvespucio_adapter import CasasVespucioAdapter
from functools import wraps

for Adapter in [CasasOHigginsAdapter, CasasPrefabricadasChileAdapter, CasasVespucioAdapter]:
    a = Adapter()
    print(f"Testing {Adapter.__name__}")
    try:
        urls = a.discover_model_urls()
        print(f"Discovered: {len(urls)}")
    except Exception as e:
        import traceback
        traceback.print_exc()
