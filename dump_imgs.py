import requests, json
from bs4 import BeautifulSoup

url1 = 'https://casaschilespa.cl/modelo_rapel_38m2/'
res1 = requests.get(url1)
soup1 = BeautifulSoup(res1.content, 'html.parser')
imgs1 = [img.get('src') for img in soup1.find_all('img') if img.get('src')]

url2 = 'https://casaschilespa.cl/modelo_los_molles_30m2/'
res2 = requests.get(url2)
soup2 = BeautifulSoup(res2.content, 'html.parser')
imgs2 = [img.get('src') for img in soup2.find_all('img') if img.get('src')]

url3 = 'https://casaschilespa.cl/caburga-26m2/'
res3 = requests.get(url3)
soup3 = BeautifulSoup(res3.content, 'html.parser')
imgs3 = [img.get('src') for img in soup3.find_all('img') if img.get('src')]

with open('temp_img_dump.json', 'w') as f:
    json.dump({ "rapel": imgs1, "los_molles": imgs2, "caburga": imgs3 }, f, indent=2)
