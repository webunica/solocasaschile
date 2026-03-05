import os
import bcrypt
import requests
import json
from dotenv import load_dotenv

load_dotenv()

SANITY_PROJECT_ID = os.getenv("SANITY_PROJECT_ID")
SANITY_DATASET = "production"
SANITY_TOKEN = os.getenv("SANITY_TOKEN")
SANITY_API_VERSION = "2024-02-26"

SANITY_MUTATION_URL = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/data/mutate/{SANITY_DATASET}"

def create_super_admin():
    password = "admin"
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    mutations = [
        {
            "createOrReplace": {
                "_id": "super-admin-id",
                "_type": "companyUser",
                "company_name": "Administración del Portal",
                "email": "admin@solocasaschile.com",
                "password": hashed_password,
                "role": "admin"
            }
        }
    ]

    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {SANITY_TOKEN}"
    }

    print("Creando SUPER ADMIN...")
    response = requests.post(SANITY_MUTATION_URL, headers=headers, json={"mutations": mutations})
    
    if response.status_code == 200:
        print("¡Usuario Admin Creado! Email: admin@solocasaschile.com | Pass: admin")
    else:
        print("Error:", response.text)

if __name__ == "__main__":
    create_super_admin()
