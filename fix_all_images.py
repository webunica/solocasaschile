import sqlite3
import requests
from bs4 import BeautifulSoup
import re
import time

conn = sqlite3.connect('outputs/database.sqlite')
cursor = conn.cursor()

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

cursor.execute("SELECT rowid, model_url, company_name, image_urls FROM models")
rows = cursor.fetchall()

def is_valid_image(url):
    if not url: return False
    url_lower = url.lower()
    
    bad_words = [
        'logo', 'icon', 'webpay', 'sofa', 'bed', 'measurement', 'facebook', 'svg', 
        'data:', 'cama', 'bano', 'cocina', 'plano', 'sence', 'tucasafacil-1', 
        'account', 'pantalla', 'acc_puerta', 'termopanel', 'amianto', 'descarga', 'interior',
        'ventana', 'puerta'
    ]
    if any(bw in url_lower for bw in bad_words):
        return False
        
    url_no_query = url_lower.split('?')[0]
    if url_no_query.endswith('.png') or url_no_query.endswith('.svg'):  
        return False
        
    # Excluye fotos especificas de puertas/puertas-blancas numeradas
    import re
    if re.search(r'/\d+_\d+\.jpe?g$', url_lower): 
        return False
        
    return True

for row_id, url, company, current_image in rows:
    # Si la imagen ya es válida y no es vacía, saltar
    if current_image and current_image.strip() and is_valid_image(current_image):
        continue
        
    try:
        res = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, 'html.parser')
        image_url = None
        
        if "Box Panel" in company:
            img_tag = soup.select_one('.woocommerce-product-gallery__image img')
            if img_tag and img_tag.get('data-src'):
                 image_url = img_tag['data-src']
            elif img_tag and img_tag.get('src'):
                 image_url = img_tag['src']
            else:
                 imgs = [img.get('src') for img in soup.find_all('img') if img.get('src') and 'wp-content/uploads' in img.get('src')]
                 if imgs: image_url = imgs[0]
                 
        else: # Metalkit, Casas Chile, Tu Casa Facil
            # Find all img tags in wp-content
            img_tags = [img.get('src') for img in soup.find_all('img') if img.get('src') and 'wp-content' in img.get('src')]
            valid_imgs = [img for img in img_tags if is_valid_image(img)]
            
            if valid_imgs:
                image_url = valid_imgs[0]
            else:
                # Try Background Divs
                bg_divs = soup.find_all('div', style=True)
                for div in bg_divs:
                    if 'background-image' in div['style'] and 'wp-content' in div['style']:
                        match = re.search(r'url\([\'"]?(.*?(?:jpg|jpeg|webp))[\'"]?\)', div['style'])
                        if match and is_valid_image(match.group(1)):
                            image_url = match.group(1)
                            break
                            
                # Try Elementor JSON 
                if not image_url and "Casas Chile" in company:
                    elementor_bgs = re.findall(r'"url"\s*:\s*"(.*?(?:jpg|jpeg|webp))"', res.text)
                    valid_elementors = [img.replace('\\/', '/') for img in elementor_bgs if is_valid_image(img)]
                    if valid_elementors:
                        image_url = valid_elementors[0]
                            
        if image_url:
            if image_url.startswith('//'):
                image_url = 'https:' + image_url
            cursor.execute("UPDATE models SET image_urls = ? WHERE rowid = ?", (image_url, row_id))
            print(f"Updated {company} #{row_id}: {image_url}")
        else:
            # Si no encontró NINGUNA imagen válida pero la actual era inválida (una puerta), borrarla
            if not current_image or not is_valid_image(current_image):
                 cursor.execute("UPDATE models SET image_urls = '' WHERE rowid = ?", (row_id,))
                 print(f"Cleared invalid image for {company} #{row_id}")

            
        time.sleep(0.5) # Be nice to servers
            
    except Exception as e:
        print(f"Error on {url}: {e}")

conn.commit()
conn.close()
print("Done fixing all images!")
