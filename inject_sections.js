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
    
    // Replace "Curadoria Recomendada" with "💻 Melhores Notebooks"
    indexHtml = indexHtml.replace(
        /<h2 class="section-title" id="vitrine-title">Curadoria Recomendada<\/h2>/g, 
        '<h2 class="section-title" id="vitrine-title">💻 Melhores Notebooks</h2>'
    );
    
    const celularesHtml = fs.readFileSync('celulares.html', 'utf8');
    const geladeirasHtml = fs.readFileSync('geladeiras.html', 'utf8');
    const maquinasHtml = fs.readFileSync('maquinas-de-lavar.html', 'utf8');
    
    const celularesProducts = extractTopProducts(celularesHtml, 4);
    const geladeirasProducts = extractTopProducts(geladeirasHtml, 4);
    const maquinasProducts = extractTopProducts(maquinasHtml, 4);
    
    const celularesSection = createSection('produtos-celulares', '📱 Melhores Celulares', celularesProducts, 'celulares.html');
    const geladeirasSection = createSection('produtos-geladeiras', '🧊 Melhores Geladeiras', geladeirasProducts, 'geladeiras.html');
    const maquinasSection = createSection('produtos-maquinas', '⚙️ Melhores Máquinas de Lavar', maquinasProducts, 'maquinas-de-lavar.html');
    
    const newSectionsHtml = celularesSection + geladeirasSection + maquinasSection;
    
    // Insert new sections after the first section ending (line 672, after '</div></div></section>')
    // To be safe, we will find `<!-- Rankings Comparison (Horizontal Rank Cards) -->` and insert BEFORE it
    
    const insertPoint = '<!-- Rankings Comparison (Horizontal Rank Cards) -->';
    if (indexHtml.includes(insertPoint)) {
        indexHtml = indexHtml.replace(insertPoint, newSectionsHtml + '\n    ' + insertPoint);
        fs.writeFileSync('index.html', indexHtml);
        console.log('index.html updated successfully with new sections!');
    } else {
        console.error('Could not find insert point in index.html!');
    }
}

main();
