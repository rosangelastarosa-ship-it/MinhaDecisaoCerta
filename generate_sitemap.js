/**
 * Gerador de Sitemap XML Avançado para Minha Decisão Certa
 * Otimizado para SEO técnico, Google Search Console e Bing Webmaster.
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = "https://www.minhadecisaocerta.com.br/";
const ROOT_DIR = __dirname;

// Arquivos que NUNCA devem ir para o sitemap (rascunhos, backups, testes, verificação)
const EXCLUDED_FILES = new Set([
    'google20adc17a6599e039.html',
    'index_antigo.html',
    'cartao-amazon-baixado.html',
    'massageador-portatil.html',
    'video-romantico.html',
    'rotina-sono-bebe-lp.html'
]);

// Configurações de prioridade e frequência por tipo de página
function getPageConfig(fileName) {
    if (fileName === 'index.html') {
        return { priority: '1.0', changefreq: 'daily' };
    }

    // Categorias principais e hubs de alta conversão
    const highTrafficHubs = [
        'eletronicos.html',
        'achadinhos.html',
        'celulares.html',
        'notebooks.html',
        'tvs.html',
        'airfryers.html',
        'geladeiras.html',
        'maquinas-de-lavar.html',
        'bicicletas.html',
        'bolsas.html',
        'categorias.html',
        'blog.html'
    ];
    if (highTrafficHubs.includes(fileName)) {
        return { priority: '0.9', changefreq: 'weekly' };
    }

    // Artigos de blog e guias de compra
    if (fileName.startsWith('artigo-') || fileName.startsWith('guia-') || fileName.startsWith('top-') || fileName.startsWith('receitas-') || fileName === 'copos-transicao-antivazamento.html' || fileName === 'rotina-sono-bebe.html') {
        return { priority: '0.8', changefreq: 'weekly' };
    }

    // Reviews individuais de produtos
    if (fileName.startsWith('review')) {
        return { priority: '0.7', changefreq: 'monthly' };
    }

    // Institucionais, metodologia e transparência
    if (fileName === 'como-testamos.html') {
        return { priority: '0.8', changefreq: 'monthly' };
    }
    if (fileName === 'divulgacao-afiliados.html') {
        return { priority: '0.7', changefreq: 'monthly' };
    }
    const institutional = ['sobre.html', 'contato.html', 'privacidade.html', 'termos.html'];
    if (institutional.includes(fileName)) {
        return { priority: '0.6', changefreq: 'monthly' };
    }

    // Padrão para demais páginas de conteúdo
    return { priority: '0.7', changefreq: 'monthly' };
}

function generateSitemap() {
    const files = fs.readdirSync(ROOT_DIR);
    const htmlFiles = files.filter(f => f.endsWith('.html') && !EXCLUDED_FILES.has(f));

    console.log(`Encontrados ${htmlFiles.length} arquivos HTML elegíveis para o sitemap.`);

    // Ordenar: primeiro index, depois por prioridade decrescente e nome
    htmlFiles.sort((a, b) => {
        if (a === 'index.html') return -1;
        if (b === 'index.html') return 1;
        const configA = getPageConfig(a);
        const configB = getPageConfig(b);
        if (configB.priority !== configA.priority) {
            return parseFloat(configB.priority) - parseFloat(configA.priority);
        }
        return a.localeCompare(b);
    });

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
    xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
    xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

    const today = new Date().toISOString().split('T')[0];

    htmlFiles.forEach(file => {
        const stats = fs.statSync(path.join(ROOT_DIR, file));
        const fileDate = stats.mtime.toISOString().split('T')[0];
        // Se o arquivo foi modificado hoje ou é recente, usa a data do arquivo
        const lastmod = fileDate;

        const config = getPageConfig(file);
        const loc = file === 'index.html' ? BASE_URL : `${BASE_URL}${file}`;

        xml += '  <url>\n';
        xml += `    <loc>${loc}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>${config.changefreq}</changefreq>\n`;
        xml += `    <priority>${config.priority}</priority>\n`;
        xml += '  </url>\n';
    });

    xml += '</urlset>\n';

    const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    console.log(`✅ sitemap.xml gerado com sucesso com ${htmlFiles.length} páginas indexáveis!`);
}

generateSitemap();
