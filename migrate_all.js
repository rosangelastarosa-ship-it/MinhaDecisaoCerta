const fs = require('fs');

const baseHtml = fs.readFileSync('index.html', 'utf8');
const templateParts = baseHtml.split(/<div class="products-grid" id="products-container">[\s\S]*?<\/section>/);
const headerPart = templateParts[0] + '<div class="products-grid" id="products-container">\n';
const footerPart = '\n            </div>\n    </section>' + templateParts[1];

const categories = [
    { file: 'geladeiras.html', title: 'Melhores Geladeiras' },
    { file: 'celulares.html', title: 'Melhores Celulares' },
    { file: 'tvs.html', title: 'Melhores TVs' },
    { file: 'airfryers.html', title: 'Melhores Air Fryers' },
    { file: 'bicicletas.html', title: 'Melhores Bicicletas' },
    { file: 'maquinas-de-lavar.html', title: 'Melhores Máquinas de Lavar' },
    { file: 'bolsas.html', title: 'Melhores Bolsas' }
];

categories.forEach(cat => {
    if (!fs.existsSync(cat.file)) return;
    
    console.log(`Migrando ${cat.file}...`);
    const oldHtml = fs.readFileSync(cat.file, 'utf8');
    
    const productRegex = /<article class="glass product-card">([\s\S]*?)<\/article>/g;
    let matches;
    let newProductsHtml = '';

    while ((matches = productRegex.exec(oldHtml)) !== null) {
        const cardContent = matches[1];
        
        const nameMatch = cardContent.match(/<h2>(.*?)<\/h2>/);
        const imgMatch = cardContent.match(/<img src="(.*?)" alt="(.*?)"/);
        const scoreMatch = cardContent.match(/<span class="rating-value">(.*?)<\/span>/);
        const countMatch = cardContent.match(/<span class="review-count">\((.*?)\)<\/span>/);
        const priceMatch = cardContent.match(/<div class="price">(.*?)<\/div>/);
        const linkMatch = cardContent.match(/<a href="(.*?)" target="_blank".*?>/);
        const specMatch = cardContent.match(/<div class="product-specs">([\s\S]*?)<\/div>/);
        const descMatch = cardContent.match(/<\/div>\s*<p>(.*?)<\/p>/);

        const name = nameMatch ? nameMatch[1] : 'Produto';
        const imgSrc = imgMatch ? imgMatch[1] : '';
        const imgAlt = imgMatch ? imgMatch[2] : '';
        const score = scoreMatch ? scoreMatch[1] : '4.5';
        const count = countMatch ? countMatch[1].replace(' avaliações', '') : '100';
        const price = priceMatch ? priceMatch[1] : 'Ver Oferta';
        const link = linkMatch ? linkMatch[1] : '#';
        const desc = descMatch ? descMatch[1] : '';
        
        let prosHtml = '';
        if (specMatch) {
            const specsRegex = /<div class="spec-item">.*?<\/i>\s*(.*?)<\/div>/g;
            let specItem;
            while ((specItem = specsRegex.exec(specMatch[1])) !== null) {
                prosHtml += `
                                <li class="pro-item">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                                    <span>${specItem[1]}</span>
                                </li>`;
            }
        }

        newProductsHtml += `
                    <article class="product-card">
                        <div class="card-img-wrapper">
                            <img src="${imgSrc}" alt="${imgAlt}" onerror="this.onerror=null; this.src='https://placehold.co/200x150/f1f5f9/0f172a?text=Imagem';">
                        </div>
                        <div class="card-body">
                            <div class="rating-container">
                                <div class="stars">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fbbf24" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fbbf24" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fbbf24" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fbbf24" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fbbf24" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                </div>
                                <span class="rating-score">${score}</span>
                                <span class="rating-count">(${count} avaliações)</span>
                            </div>
                            <h3 class="product-title">${name}</h3>
                            <p style="font-size: 0.85rem; color: #555; margin: 10px 0;">${desc}</p>
                            <ul class="pros-cons-summary">
    ${prosHtml}
                            </ul>
                            <div class="price-section">
                                <div class="price-box">
                                    <span class="price-label">OFERTA SHOPEE</span>
                                    <span class="price-range" style="color: #ee4d2d; font-weight: bold;">${price}</span>
                                </div>
                                <button class="card-cta-btn" onclick="window.open('${link}', '_blank')" style="background-color: #ee4d2d; border: none;">
                                    Ver Oferta
                                </button>
                            </div>
                        </div>
                    </article>`;
    }
    
    let customHeader = headerPart;
    customHeader = customHeader.replace(/<title>.*?<\/title>/, `<title>${cat.title} | Minha Decisão Certa</title>`);
    customHeader = customHeader.replace(/<h1>.*?<\/h1>/, `<h1>${cat.title}</h1>`);
    
    // Remove specific banners that are for index only, like "Sérum Retinol Promo Banner"
    customHeader = customHeader.replace(/<!-- ✨ Celimax Retinal Promo Banner \(FRONT PAGE HIGHLIGHT\) -->[\s\S]*?<\/section>/, '');
    customHeader = customHeader.replace(/<!-- Categories Grid Section -->[\s\S]*?<\/section>/, '');
    customHeader = customHeader.replace(/<!-- Bloco 3: Mais Pesquisados \(Shortcut Filters\) -->[\s\S]*?<\/section>/, '');
    
    const updatedHtml = customHeader + newProductsHtml + footerPart;
    fs.writeFileSync(cat.file, updatedHtml);
    console.log(`- ${cat.file} migrado!`);
});
console.log('Todas as categorias migradas com sucesso!');
