import os
from datetime import datetime

directory = r"C:\Users\Rosangela\Documents\MinhaDecisaoCerta-V2"
base_url = "https://minhadecisaoacerta.com.br/"

# List all html files except google verification
html_files = [f for f in os.listdir(directory) if f.endswith('.html') and not f.startswith('google')]

sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

today = datetime.today().strftime('%Y-%m-%d')

for file in html_files:
    # Set priority based on file type
    if file == 'index.html':
        priority = "1.0"
    elif file.startswith('categorias') or file.startswith('blog'):
        priority = "0.9"
    elif file.startswith('review') or file.startswith('artigo'):
        priority = "0.8"
    else:
        priority = "0.7"
        
    url = f"{base_url}{file}"
    sitemap_content += f"  <url>\n"
    sitemap_content += f"    <loc>{url}</loc>\n"
    sitemap_content += f"    <lastmod>{today}</lastmod>\n"
    sitemap_content += f"    <priority>{priority}</priority>\n"
    sitemap_content += f"  </url>\n"

sitemap_content += '</urlset>'

with open(os.path.join(directory, 'sitemap.xml'), 'w', encoding='utf-8') as f:
    f.write(sitemap_content)

print(f"Generated sitemap with {len(html_files)} URLs.")
