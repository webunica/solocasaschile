import sqlite3
import requests
from bs4 import BeautifulSoup
import re

conn = sqlite3.connect('outputs/database.sqlite')
cursor = conn.cursor()

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

def fix_casas_chile():
    cursor.execute("SELECT id, model_url FROM models WHERE company_name LIKE '%Casas Chile%' AND (image_urls IS NULL OR image_urls='' OR image_urls LIKE '%measurement%')")
    rows = cursor.fetchall()
    for row_id, url in rows:
        try:
            res = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(res.text, 'html.parser')
            imgs = [img.get('src') for img in soup.find_all('img') if img.get('src')]
            # ignore logos, icons, fb, webpay, and png
            filtered = [
                src for src in imgs 
                if not any(x in src.lower() for x in ['logo', 'webpay', 'icon', 'sofa', 'bed', 'measurement', 'facebook', 'svg', 'data:', '.png'])
                and 'wp-content' in src
            ]
            
            if filtered:
                image_url = filtered[0]
                cursor.execute("UPDATE models SET image_urls = ? WHERE id = ?", (image_url, row_id))
                print(f"Updated Casas Chile: {image_url}")
            else:
                # Try background style
                bg_divs = soup.find_all('div', style=True)
                for div in bg_divs:
                    if 'background-image' in div['style'] and 'wp-content' in div['style']:
                        match = re.search(r'url\([\'"]?(.*?(?:jpg|jpeg|webp))[\'"]?\)', div['style'])
                        if match:
                            image_url = match.group(1)
                            cursor.execute("UPDATE models SET image_urls = ? WHERE id = ?", (image_url, row_id))
                            print(f"Updated Casas Chile (BG): {image_url}")
                            break
        except Exception as e:
            print(f"Error on {url}: {e}")

def fix_boxpanel():
    cursor.execute("SELECT id, model_url FROM models WHERE company_name LIKE '%Box Panel%' AND (image_urls IS NULL OR image_urls='')")
    rows = cursor.fetchall()
    for row_id, url in rows:
        try:
            res = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(res.text, 'html.parser')
            # WooCommerce gallery
            img_tag = soup.select_one('.woocommerce-product-gallery__image img')
            image_url = None
            if img_tag and img_tag.get('data-src'):
                image_url = img_tag['data-src']
            elif img_tag and img_tag.get('src'):
                image_url = img_tag['src']
            else:
                 imgs = [img.get('src') for img in soup.find_all('img') if img.get('src') and 'wp-content/uploads' in img.get('src', '')]
                 if imgs: image_url = imgs[0]
                 
            if image_url:
                cursor.execute("UPDATE models SET image_urls = ? WHERE id = ?", (image_url, row_id))
                print(f"Updated BoxPanel: {image_url}")
        except Exception as e:
            print(f"Error on {url}: {e}")

print("Fixing Casas Chile images...")
fix_casas_chile()
print("Fixing BoxPanel images...")
fix_boxpanel()

conn.commit()
conn.close()
print("Done filling missing images!")
