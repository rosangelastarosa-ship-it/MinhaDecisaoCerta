const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && f !== 'index_antigo.html');

let fixedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Corrigir imagens quebradas do assets/ para img/
    if (html.includes('assets/macbook_air.png')) {
        html = html.replace(/assets\/macbook_air\.png/g, 'img/macbook_air.png');
        changed = true;
    }
    if (html.includes('assets/iphone_15_pro.png')) {
        html = html.replace(/assets\/iphone_15_pro\.png/g, 'img/iphone_15.png');
        changed = true;
    }

    // 2. Corrigir links para planejador-sandbox.html (que não existe)
    if (html.includes('planejador-sandbox.html')) {
        html = html.replace(/href=["']planejador-sandbox\.html["']/g, 'href="categorias.html"');
        html = html.replace(/🛠️ Planejador Sandbox/g, 'Todas as Categorias');
        changed = true;
    }

    // 3. Corrigir link da Samsung Q60D em tvs.html
    if (file === 'tvs.html') {
        if (html.includes(`onclick="window.open('#', '_blank')"`)) {
            html = html.replace(`onclick="window.open('#', '_blank')"`, `onclick="window.open('https://s.shopee.com.br/10zTwRPgvY', '_blank')"`);
            changed = true;
        }
    }

    // 4. Corrigir link do Acer Aspire 5 na index.html para apontar diretamente para review.html
    if (file === 'index.html') {
        const oldAspire = `<a href="notebooks.html" class="review-btn">Ver Comparativo Completo</a>`;
        const newAspire = `<a href="review.html" class="review-btn">Ver Review Completo</a>`;
        if (html.includes(oldAspire)) {
            html = html.replace(oldAspire, newAspire);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf8');
        fixedCount++;
        console.log(`Corrigido: ${file}`);
    }
});

console.log(`\nPronto! Total de arquivos corrigidos: ${fixedCount}`);
