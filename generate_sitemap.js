const fs = require('fs');
const path = require('path');

const directory = __dirname;
const baseUrl = "https://www.minhadecisaocerta.com.br/";

const excluded = ['index_antigo.html'];
const files = fs.readdirSync(directory);
const htmlFiles = files.filter(f => f.endsWith('.html') && !f.startsWith('google') && !excluded.includes(f));

let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemapContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

const today = new Date().toISOString().split('T')[0];

htmlFiles.forEach(file => {
    let priority = "0.7";
    if (file === 'index.html') priority = "1.0";
    else if (file.startsWith('categorias') || file.startsWith('blog')) priority = "0.9";
    else if (file.startsWith('review') || file.startsWith('artigo')) priority = "0.8";

    const url = file === 'index.html' ? baseUrl : `${baseUrl}${file}`;
    sitemapContent += `  <url>\n`;
    sitemapContent += `    <loc>${url}</loc>\n`;
    sitemapContent += `    <lastmod>${today}</lastmod>\n`;
    sitemapContent += `    <priority>${priority}</priority>\n`;
    sitemapContent += `  </url>\n`;
});

sitemapContent += '</urlset>';

fs.writeFileSync(path.join(directory, 'sitemap.xml'), sitemapContent, 'utf8');
console.log(`Generated sitemap with ${htmlFiles.length} URLs using domain ${baseUrl}`);
