import argparse
from core.storage import Storage
from portals.tucasafacil_adapter import TuCasaFacilAdapter
from portals.metalkit_adapter import MetalkitAdapter
from portals.casassip_adapter import CasasSipAdapter
from portals.boxpanel_adapter import BoxPanelAdapter
from portals.rokar_adapter import RokarAdapter
from portals.hcpcasas_adapter import HcpCasasAdapter
from portals.magisur_adapter import MagisurAdapter
from portals.casaschile_adapter import CasasChileAdapter
from portals.casur_adapter import CasurAdapter
from portals.casasalvarado_adapter import CasasAlvaradoAdapter
from portals.casasflorida_adapter import CasasFloridaAdapter
from portals.casasohiggins_adapter import CasasOHigginsAdapter
from portals.casasamerica_adapter import CasasAmericaAdapter
from portals.casasprefabricadaschile_adapter import CasasPrefabricadasChileAdapter
from portals.casasvespucio_adapter import CasasVespucioAdapter
# Nuevas empresas (Marzo 2026)
from portals.casaselmirador_adapter import CasasElMiradorAdapter
from portals.casaslihuel_adapter import CasasLihuelAdapter
from portals.chilehome_adapter import ChileHomeAdapter
from portals.casassanalberto_adapter import CasasSanAlbertoAdapter
from portals.temukit_adapter import TemukitAdapter
from core.logger import get_logger

logger = get_logger(__name__)

def main():
    parser = argparse.ArgumentParser(description="Scraper de Casas Prefabricadas - MVP")
    parser.add_argument("--pais", default="Chile", help="País objetivo")
    parser.add_argument("--region", default="Opcional", help="Región objetivo")
    parser.add_argument("--salida", default="csv+sqlite", help="Formatos de salida")
    args = parser.parse_args()
    
    logger.info(f"Iniciando sistema de Extracción y Normalización ({args.pais} - {args.region})...")
    
    # Init storage
    storage = Storage()
    
    # Adapters list
    adapters = [
        TuCasaFacilAdapter(),
        MetalkitAdapter(),
        CasasSipAdapter(),
        BoxPanelAdapter(),
        RokarAdapter(),
        HcpCasasAdapter(),
        MagisurAdapter(),
        CasasChileAdapter(),
        CasurAdapter(),
        CasasAlvaradoAdapter(),
        CasasFloridaAdapter(),
        CasasOHigginsAdapter(),
        CasasAmericaAdapter(),
        CasasPrefabricadasChileAdapter(),
        CasasVespucioAdapter(),
        # Nuevas empresas (Marzo 2026)
        CasasElMiradorAdapter(),
        CasasLihuelAdapter(),
        ChileHomeAdapter(),
        CasasSanAlbertoAdapter(),
        TemukitAdapter(),
    ]
    
    all_companies = []
    all_models = []
    
    for adapter in adapters:
        company, models = adapter.scrape()
        all_companies.append(company)
        all_models.extend(models)
        
    storage.save_companies(all_companies)
    storage.save_models(all_models)
    logger.info("Proceso completado.")

if __name__ == "__main__":
    main()
