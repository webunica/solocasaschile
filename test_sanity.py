import os
import sqlite3
from schemas.model import ModelSchema
from core.sanity_uploader import sync_models_to_sanity

def main():
    # Conectarse a la base local
    db_path = "outputs/database.sqlite"
    if not os.path.exists(db_path):
        print("No se encontró database.sqlite")
        return
        
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Extraer todo el catalogo histórico de SQLite
    cursor.execute("SELECT * FROM models")
    rows = cursor.fetchall()
    
    models = []
    for row in rows:
        data = dict(row)
        # Reconvertir strings a listas para Pydantic
        if data.get('delivery_modes'):
            data['delivery_modes'] = [m.strip() for m in data['delivery_modes'].split(',') if m.strip()]
        else:
            data['delivery_modes'] = []
            
        if data.get('image_urls'):
            data['image_urls'] = [u.strip() for u in data['image_urls'].split(',') if u.strip()]
        else:
            data['image_urls'] = []
            
        models.append(ModelSchema(**data))

    print(f"Subiendo {len(models)} modelos a Sanity...")
    sync_models_to_sanity(models)
    print("Prueba completada.")

if __name__ == "__main__":
    main()
