import os
import requests
import json
import time
from dotenv import load_dotenv
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type
from core.logger import get_logger
from schemas.model import ModelSchema

load_dotenv()

logger = get_logger(__name__)

SANITY_PROJECT_ID = os.getenv("SANITY_PROJECT_ID", "tu_project_id")
SANITY_DATASET = os.getenv("SANITY_DATASET", "production")
SANITY_TOKEN = os.getenv("SANITY_TOKEN", "tu_api_token_con_permisos_write")
SANITY_API_VERSION = "2024-02-26"

SANITY_MUTATION_URL = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/data/mutate/{SANITY_DATASET}"

class RateLimitError(Exception):
    pass

def upload_image_to_sanity(image_url: str) -> str | None:
    try:
        res = requests.get(image_url, timeout=15)
        res.raise_for_status()
        content_type = res.headers.get("Content-Type", "image/jpeg")
        
        post_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/assets/images/{SANITY_DATASET}"
        headers = {
            "Authorization": f"Bearer {SANITY_TOKEN}",
            "Content-Type": content_type
        }
        
        resp = requests.post(post_url, headers=headers, data=res.content)
        resp.raise_for_status()
        asset_doc = resp.json().get("document")
        if asset_doc:
            return asset_doc.get("_id")
        return None
    except Exception as e:
        logger.error(f"Error descargando/subiendo imagen {image_url}: {e}")
        return None

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type(RateLimitError)
)
def submit_mutations(mutations: list):
    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {SANITY_TOKEN}"
    }
    
    payload = {"mutations": mutations}
    
    response = requests.post(SANITY_MUTATION_URL, headers=headers, json=payload)
    
    if response.status_code == 429: # Rate limit
        logger.warning("Sanity Rate Limit alcanzado, reintentando...")
        raise RateLimitError("Rate limit exceeded")
        
    if response.status_code != 200:
        logger.error(f"Error subiendo a Sanity ({response.status_code}): {response.text}")
    else:
        logger.info(f"Subidos {len(mutations)} documentos a Sanity.")

def sync_models_to_sanity(models: list[ModelSchema]):
    mutations = []
    
    for model in models:
        doc = model.model_dump(exclude_none=True)
        # Excluir id autogenerado de SQLite
        doc.pop("id", None)
        # Convertir scrape_date a string ISO
        if "scrape_date" in doc and doc["scrape_date"]:
            doc["scrape_date"] = doc["scrape_date"].isoformat()
            
        doc["_type"] = "houseModel"
        
        # Parseo de Imagenes físicas
        images_assets = []
        if "image_urls" in doc and doc["image_urls"]:
            logger.info(f"Sincronizando {(len(doc['image_urls']))} imágenes de {model.model_name}")
            for idx, img_url in enumerate(doc["image_urls"]):
                # Saltar invalidas o de placeholder muy notorias si las hay
                asset_id = upload_image_to_sanity(img_url)
                if asset_id:
                    images_assets.append({
                        "_key": f"img-{idx}",
                        "_type": "image",
                        "asset": {
                            "_type": "reference",
                            "_ref": asset_id
                        }
                    })
        
        # Limpiar keys y asignar al nuevo mapping "images" del schema Sanity
        doc.pop("image_urls", None)
        if images_assets:
            doc["images"] = images_assets
        
        # Usamos createOrReplace usando el fingerprint_hash como id base
        import re
        raw_id = f"model-{model.fingerprint_hash}" if model.fingerprint_hash else f"model_{model.company_name}_{model.model_name}".replace(" ", "_").lower()
        _id = re.sub(r'[^a-zA-Z0-9_\-.]', '', raw_id)
        doc["_id"] = _id

        mutations.append({
            "createOrReplace": doc
        })
        
        # Agrupar mutaciones (Sanity recomienda max ~100 por request)
        if len(mutations) >= 50:
            submit_mutations(mutations)
            mutations = []
            
    # Subir el remanente
    if mutations:
        submit_mutations(mutations)
