import os
import requests
import json
import csv
import re

# Use the credentials from .env
SANITY_PROJECT_ID = "c3n3g73v"
SANITY_DATASET = "production"
SANITY_TOKEN = "sk0ct6lYuk7rOavlZRL80GtlmhwwBGDCWLMQJLRzWdRVrejl79UojFkskzOqQo5jDBcb3T8wDwevxn5Q16WS4p5PlXcT1lkmjvAHUiOLfR2t6VhNc3hHsM05O4Zbx3Mn4N8JBVLiwJ6oHk7LXyGGgsdqHrYOJ16FfBPR6r0DgsCNqKLm4OfG"
SANITY_API_VERSION = "2024-02-26"

SANITY_MUTATION_URL = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/data/mutate/{SANITY_DATASET}"
SANITY_QUERY_URL = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/data/query/{SANITY_DATASET}"

headers = {
    "Content-type": "application/json",
    "Authorization": f"Bearer {SANITY_TOKEN}"
}

def do_query(groq):
    resp = requests.get(SANITY_QUERY_URL, params={"query": groq}, headers=headers)
    if resp.status_code != 200:
        print(f"Error Querying: {resp.status_code} - {resp.text}")
        resp.raise_for_status()
    return resp.json()["result"]

def do_mutate(mutations):
    payload = {"mutations": mutations}
    resp = requests.post(SANITY_MUTATION_URL, headers=headers, json=payload)
    if resp.status_code != 200:
        print(f"Error Mutating: {resp.text}")
    else:
        print(f"Executed {len(mutations)} mutations.")

def simple_slugify(text):
    text = text.lower()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-')

def main():
    # 1. CLEANUP
    print("Fetching documents to delete...")
    companies = do_query('*[_type == "companyUser"]._id')
    models = do_query('*[_type == "houseModel"]._id')
    clicks = do_query('*[_type == "propertyClick"]._id')
    views = do_query('*[_type == "modelView"]._id')

    all_ids = companies + models + clicks + views
    print(f"Found {len(all_ids)} documents to delete.")

    if all_ids:
        # Delete in batches of 100
        for i in range(0, len(all_ids), 100):
            batch = all_ids[i:i+100]
            muts = [{"delete": {"id": _id}} for _id in batch]
            do_mutate(muts)

    # 2. IMPORT
    print("Reading CSV...")
    mutations = []
    with open("constructoras_chile.csv", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            company_name = row.get("name") or row.get("domain")
            if not company_name: continue
            
            slug = simple_slugify(company_name)
            email = row.get("email_corp") or f"info@{row.get('domain') or slug + '.cl'}"
            
            doc = {
                "_type": "companyUser",
                "_id": f"imported-{slug}",
                "company_name": company_name,
                "slug": {"_type": "slug", "current": slug},
                "description": row.get("description", "")[:500],
                "email": email.lower().strip(),
                "role": "company",
                "plan": "free",
                "is_active": True,
                "contact_phone": row.get("phone_corp", ""),
                "whatsapp_number": re.sub(r'\D', '', row.get("phone_corp", "")),
                "address": row.get("address", ""),
                "region": row.get("region", "Metropolitana"),
                "password": "no-password-set"
            }
            
            mutations.append({"createOrReplace": doc})
            
            if len(mutations) >= 50:
                do_mutate(mutations)
                mutations = []
                
    if mutations:
        do_mutate(mutations)

    print("Import finished.")

if __name__ == "__main__":
    main()
