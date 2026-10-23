const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const topBarHtml = `<div class="top-bar" id="top-announcement-bar">
    Curadoria independente de compras. Testamos o que realmente vale o seu dinheiro. <span>✓ 100% Imparcial</span>
</div>`;

function getCategoryNav(fileName) {
    let activeId = 'cat-all';
    if (fileName === 'index.html') activeId = 'cat-all';
    else if (fileName.includes('notebook') || fileName.includes('macbook') || fileName.includes('dell') || fileName.includes('asus') || fileName.includes('lenovo') || fileName.includes('vaio')) activeId = 'cat-notebook';
    else if (fileName.includes('celular') || fileName.includes('smartphone')) activeId = 'cat-celular';
    else if (fileName.includes('tv')) activeId = 'cat-tvs';
    else if (fileName.includes('airfryer')) activeId = 'cat-airfryer';
    else if (fileName.includes('geladeira')) activeId = 'cat-geladeiras';
    else if (fileName.includes('maquina') || fileName.includes('lavadora')) activeId = 'cat-maquinas';
    else if (fileName.includes('bicicleta')) activeId = 'cat-bicicletas';
    else if (fileName.includes('achadinho')) activeId = 'cat-achadinhos';
    else if (fileName.includes('categoria')) activeId = 'cat-mais';

    return `<nav class="category-nav-bar" id="category-navigation" aria-label="Categorias de produtos">
        <div class="category-nav-links">
            <a href="index.html" class="category-link ${activeId === 'cat-all' ? 'active' : ''}" id="cat-all">Início</a>
            <a href="notebooks.html" class="category-link ${activeId === 'cat-notebook' ? 'active' : ''}" id="cat-notebook">Notebooks</a>
            <a href="celulares.html" class="category-link ${activeId === 'cat-celular' ? 'active' : ''}" id="cat-celular">Smartphones</a>
            <a href="tvs.html" class="category-link ${activeId === 'cat-tvs' ? 'active' : ''}" id="cat-tvs">Smart TVs</a>
            <a href="airfryers.html" class="category-link ${activeId === 'cat-airfryer' ? 'active' : ''}" id="cat-airfryer">Air Fryers</a>
            <a href="geladeiras.html" class="category-link ${activeId === 'cat-geladeiras' ? 'active' : ''}" id="cat-geladeiras">Geladeiras</a>
            <a href="maquinas-de-lavar.html" class="category-link ${activeId === 'cat-maquinas' ? 'active' : ''}" id="cat-maquinas">Máquinas de Lavar</a>
            <a href="bicicletas.html" class="category-link ${activeId === 'cat-bicicletas' ? 'active' : ''}" id="cat-bicicletas">Bicicletas</a>
            <a href="achadinhos.html" class="category-link ${activeId === 'cat-achadinhos' ? 'active' : ''}" id="cat-achadinhos">Achadinhos</a>
            <a href="categorias.html" class="category-link ${activeId === 'cat-mais' ? 'active' : ''}" id="cat-mais" style="color: var(--primary-color); font-weight: 700;">+ Todas as Categorias</a>
        </div>
    </nav>`;
}

const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && f !== 'index_antigo.html');

let updatedCount = 0;

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Atualizar top bar
    if (html.includes('id="top-announcement-bar"')) {
        const topBarRegex = /<div class="top-bar" id="top-announcement-bar">[\s\S]*?<\/div>/;
        if (topBarRegex.test(html)) {
            html = html.replace(topBarRegex, topBarHtml);
            changed = true;
        }
    }

    // 2. Atualizar category nav
    if (html.includes('id="category-navigation"')) {
        const navRegex = /<nav class="category-nav-bar" id="category-navigation"[^>]*>[\s\S]*?<\/nav>/;
        if (navRegex.test(html)) {
            html = html.replace(navRegex, getCategoryNav(file));
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf8');
        updatedCount++;
        console.log(`Updated: ${file}`);
    }
});

console.log(`Finished! Total files modernized: ${updatedCount}`);
