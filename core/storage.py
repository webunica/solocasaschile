import os
import pandas as pd
from sqlalchemy import create_engine
from schemas.company import CompanySchema
from schemas.model import ModelSchema
from core.logger import get_logger

logger = get_logger(__name__)

class Storage:
    def __init__(self, db_path="outputs/database.sqlite"):
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        self.engine = create_engine(f"sqlite:///{db_path}")

    def save_companies(self, companies: list[CompanySchema]):
        if not companies: return
        df = pd.DataFrame([c.model_dump() for c in companies])
        df['geographic_coverage'] = df['geographic_coverage'].apply(lambda x: ', '.join(x) if x else '')
        df['social_networks'] = df['social_networks'].apply(lambda x: ', '.join(x) if x else '')
        df['services'] = df['services'].apply(lambda x: ', '.join(x) if x else '')
        
        df.to_sql("companies", self.engine, if_exists="replace", index=False)
        df.to_csv("outputs/empresas.csv", index=False)
        logger.info(f"Guardadas {len(companies)} empresas en DB y CSV.")

    def save_models(self, models: list[ModelSchema]):
        if not models: return
        df = pd.DataFrame([m.model_dump() for m in models])
        df['delivery_modes'] = df['delivery_modes'].apply(lambda x: ', '.join(x) if x else '')
        df['image_urls'] = df['image_urls'].apply(lambda x: ', '.join(x) if x else '')
        
        df.to_sql("models", self.engine, if_exists="replace", index=False)
        df.to_csv("outputs/modelos.csv", index=False)
        logger.info(f"Guardados {len(models)} modelos en DB y CSV.")
        
        # Subir a Sanity
        from core.sanity_uploader import sync_models_to_sanity
        try:
            logger.info("Iniciando subida de modelos a Sanity...")
            sync_models_to_sanity(models)
            logger.info("Subida a Sanity completada con éxito.")
        except Exception as e:
            logger.error(f"Fallo al subir a Sanity: {e}")
