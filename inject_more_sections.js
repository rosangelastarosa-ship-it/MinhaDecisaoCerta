const fs = require('fs');

function extractTopProducts(htmlContent, limit = 4) {
    const regex = /<article class="product-card">[\s\S]*?<\/article>/g;
    let match;
    const products = [];
    while ((match = regex.exec(htmlContent)) !== null && products.length < limit) {
        products.push(match[0]);
    }
    return products.join('\n');
}

function createSection(id, title, productsHtml, linkUrl) {
    return `
    <!-- ${title} Section -->
    <section class="section reveal" id="${id}" aria-labelledby="${id}-title">
        <div class="container">
            <div class="section-header">
                <div>
                    <h2 class="section-title" id="${id}-title">${title}</h2>
                    <p class="section-subtitle">Escolhas testadas por especialistas com melhores avaliações</p>
                </div>
            </div>
            <div class="products-grid">
${productsHtml}
            </div>
            <div style="text-align: center; margin-top: 40px;">
                <a href="${linkUrl}" class="btn" style="padding: 15px 30px; font-size: 1.1rem; border-radius: 50px;">Ver mais ${title.replace(/.*? /, '')} <i class="fas fa-arrow-right" style="margin-left: 10px;"></i></a>
            </div>
        </div>
    </section>
`;
}

async function main() {
    let indexHtml = fs.readFileSync('index.html', 'utf8');
    
    const airfryersHtml = fs.readFileSync('airfryers.html', 'utf8');
    const bicicletasHtml = fs.readFileSync('bicicletas.html', 'utf8');
    
    const airfryersProducts = extractTopProducts(airfryersHtml, 4);
    const bicicletasProducts = extractTopProducts(bicicletasHtml, 4);
    
    const airfryersSection = createSection('produtos-airfryers', '🍟 Melhores Air Fryers', airfryersProducts, 'airfryers.html');
    const bicicletasSection = createSection('produtos-bicicletas', '🚲 Melhores Bicicletas', bicicletasProducts, 'bicicletas.html');
    
    const newSectionsHtml = airfryersSection + bicicletasSection;
    
    const insertPoint = '<!-- Rankings Comparison (Horizontal Rank Cards) -->';
    if (indexHtml.includes(insertPoint)) {
        indexHtml = indexHtml.replace(insertPoint, newSectionsHtml + '\n    ' + insertPoint);
        fs.writeFileSync('index.html', indexHtml);
        console.log('index.html updated successfully with Air Fryers and Bicicletas!');
    } else {
        console.error('Could not find insert point in index.html!');
    }
}

main();
