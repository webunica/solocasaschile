"""
Script para correr solo los 5 nuevos adapters y sincronizar con Sanity.
"""
from core.storage import Storage
from portals.casaselmirador_adapter import CasasElMiradorAdapter
from portals.casaslihuel_adapter import CasasLihuelAdapter
from portals.chilehome_adapter import ChileHomeAdapter
from portals.casassanalberto_adapter import CasasSanAlbertoAdapter
from portals.temukit_adapter import TemukitAdapter
from core.sanity_uploader import sync_models_to_sanity
from core.logger import get_logger

logger = get_logger(__name__)

def main():
    storage = Storage()

    adapters = [
        CasasElMiradorAdapter(),
        CasasLihuelAdapter(),
        ChileHomeAdapter(),
        CasasSanAlbertoAdapter(),
        TemukitAdapter(),
    ]

    all_companies = []
    all_models = []

    for adapter in adapters:
        logger.info(f"Scrapeando: {adapter.base_url}")
        try:
            company, models = adapter.scrape()
            all_companies.append(company)
            all_models.extend(models)
            logger.info(f"  -> {len(models)} modelos obtenidos de {company.name}")
        except Exception as e:
            logger.error(f"Error en {adapter.base_url}: {e}")

    logger.info(f"\nTotal modelos scrapeados: {len(all_models)}")

    if all_models:
        storage.save_companies(all_companies)
        storage.save_models(all_models)
        logger.info("Guardado en SQLite.")

        logger.info("Sincronizando con Sanity...")
        sync_models_to_sanity(all_models)
        logger.info("Sincronización completada.")
    else:
        logger.warning("No se obtuvieron modelos. Revisa los adapters.")

if __name__ == "__main__":
    main()
