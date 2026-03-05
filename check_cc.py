import sqlite3
import re

conn = sqlite3.connect('outputs/database.sqlite')
cursor = conn.cursor()

cursor.execute("SELECT rowid, model_name, model_url, image_urls FROM models WHERE company_name='Casas Chile SpA'")
rows = cursor.fetchall()

def is_valid_image(url):
    url_lower = url.lower()
    bad_words = ['logo', 'icon', 'webpay', 'sofa', 'bed', 'measurement', 'facebook', 'svg', 'data:', 'cama', 'bano', 'cocina', 'plano', 'sence', 'tucasafacil-1', 'acc_puerta', 'termopanel', 'amianto', 'descarga', 'account', 'pantalla']
    if any(bw in url_lower for bw in bad_words):
        return False
        
    url_no_query = url_lower.split('?')[0]
    if url_no_query.endswith('.png') or url_no_query.endswith('.svg'):
        return False
        
    # Exclude strict numeric filenames like 1492896_01.jpeg or 136301_01.jpeg
    if re.search(r'/\d+_\d+\.jpe?g$', url_lower):
        return False
        
    return True

for row_id, name, url, image in rows:
    print(f"{name} ({url}): {image if is_valid_image(image) else 'INVALID'}")
