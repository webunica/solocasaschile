import requests, json, re
from bs4 import BeautifulSoup

urls = [
    'https://casaschilespa.cl/rapel-38m%c2%b2-express/',
    'https://casaschilespa.cl/los-molles-30m%c2%b2-terraza/',
    'https://casaschilespa.cl/caburga-26m%c2%b2-terraza/'
]
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

results = {}
for u in urls:
    try:
        html = requests.get(u, headers=headers).text
        soup = BeautifulSoup(html, 'html.parser')
        
        # 1. img tags
        img_srcs = [i.get('src') for i in soup.find_all('img') if i.get('src') and 'wp-content' in i.get('src')]
        # look for data-src
        data_srcs = [i.get('data-src') for i in soup.find_all('img') if i.get('data-src') and 'wp-content' in i.get('data-src')]
        
        # 3. background images
        bg_imgs = []
        for div in soup.find_all(style=True):
            if 'background-image' in div['style']:
                match = re.search(r'url\([\'"]?(.*?(?:jpg|jpeg|webp))[\'"]?\)', div['style'])
                if match: bg_imgs.append(match.group(1))
                
        # 4. Elementor data-settings backgrounds regex
        elementor_bg = re.findall(r'"background_image":{"url":"(.*?)"', html)
        if not elementor_bg:
            elementor_bg = re.findall(r'"url"\s*:\s*"(.*?jpg|.*?jpeg|.*?webp)"', html)
            
        results[u] = {
            "img_srcs": img_srcs,
            "data_srcs": data_srcs,
            "bg_imgs": bg_imgs,
            "elementor_bg": elementor_bg
        }
    except Exception as e:
        results[u] = str(e)

with open('dump4.json', 'w') as f:
    json.dump(results, f, indent=2)
