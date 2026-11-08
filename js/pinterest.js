document.addEventListener('DOMContentLoaded', () => {
    const pageUrl = window.location.href;
    const pageTitle = document.title || 'Minha Decisão Certa';
    
    // Obter imagem de destaque da página (og:image ou pinterest:image ou hero)
    let pageImage = '';
    const ogImgMeta = document.querySelector('meta[property="og:image"], meta[name="pinterest:image"]');
    if (ogImgMeta) {
        pageImage = ogImgMeta.getAttribute('content');
    }
    if (!pageImage) {
        const heroImg = document.querySelector('.article-hero img, .article-content img, .product-img, header img');
        if (heroImg) {
            const src = heroImg.getAttribute('src');
            pageImage = src.startsWith('http') ? src : window.location.origin + (src.startsWith('/') ? '' : '/') + src;
        }
    }
    if (!pageImage) {
        pageImage = window.location.origin + '/img/pinterest-bf-metade-do-dobro.jpg';
    }

    const encodedPageUrl = encodeURIComponent(pageUrl);
    const encodedMediaUrl = encodeURIComponent(pageImage);
    const encodedDesc = encodeURIComponent(pageTitle + ' • Minha Decisão Certa: Compre certo, sem arrependimentos.');

    const pinterestShareUrl = `https://www.pinterest.com/pin/create/button/?url=${encodedPageUrl}&media=${encodedMediaUrl}&description=${encodedDesc}`;

    // 1. Botão "Salvar no Pinterest" visível junto aos botões de compartilhar / no cabeçalho ou rodapé do artigo
    const articleContainer = document.querySelector('.article-content, .article-body, article, .guide-content');
    const existingShareBar = document.querySelector('.share-buttons, .social-share, .article-share, .hero-meta-bar');

    if (existingShareBar && !existingShareBar.querySelector('.btn-pinterest-share-main')) {
        const pinShareLink = document.createElement('a');
        pinShareLink.className = 'btn-pinterest-share-main';
        pinShareLink.href = pinterestShareUrl;
        pinShareLink.target = '_blank';
        pinShareLink.rel = 'nofollow noreferrer';
        pinShareLink.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; background: #e60023; color: #ffffff; padding: 6px 14px; border-radius: 100px; font-size: 0.85rem; font-weight: 700; text-decoration: none; box-shadow: 0 2px 8px rgba(230,0,35,0.25); margin: 6px 0; transition: transform 0.2s, background 0.2s;';
        pinShareLink.innerHTML = '<i class="fab fa-pinterest" style="font-size: 1rem;"></i> Salvar no Pinterest';
        pinShareLink.onmouseover = () => { pinShareLink.style.background = '#bd081c'; pinShareLink.style.transform = 'translateY(-1px)'; };
        pinShareLink.onmouseout = () => { pinShareLink.style.background = '#e60023'; pinShareLink.style.transform = 'translateY(0)'; };
        existingShareBar.appendChild(pinShareLink);
    } else if (articleContainer && !document.querySelector('.btn-pinterest-article-box')) {
        const pinBox = document.createElement('div');
        pinBox.className = 'btn-pinterest-article-box';
        pinBox.style.cssText = 'margin: 2rem 0; padding: 1rem 1.25rem; background: #fff5f5; border: 1px solid #fed7d7; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;';
        pinBox.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.5rem; color: #e60023;"><i class="fab fa-pinterest"></i></span>
                <div>
                    <strong style="color: #9b2c2c; font-size: 0.95rem; display: block;">Gostou deste guia?</strong>
                    <span style="color: #742a2a; font-size: 0.85rem;">Guarde no Pinterest para consultar sempre que precisar comprar certo!</span>
                </div>
            </div>
            <a href="${pinterestShareUrl}" target="_blank" rel="nofollow noreferrer" style="display: inline-flex; align-items: center; gap: 8px; background: #e60023; color: #ffffff; padding: 10px 18px; border-radius: 100px; font-weight: 800; font-size: 0.88rem; text-decoration: none; box-shadow: 0 4px 12px rgba(230,0,35,0.3); transition: transform 0.2s;">
                <i class="fab fa-pinterest"></i> Salvar no Pinterest
            </a>
        `;
        articleContainer.insertBefore(pinBox, articleContainer.firstChild);
    }

    // 2. Botão nos cards de produtos
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const img = card.querySelector('.product-img, img');
        const title = card.querySelector('h2, h3')?.innerText || pageTitle;
        
        if (img && !card.querySelector('.pin-it-btn')) {
            const container = document.createElement('div');
            container.className = 'img-container';
            container.style.position = 'relative';
            
            img.parentNode.insertBefore(container, img);
            container.appendChild(img);
            
            const cardImgSrc = img.getAttribute('src');
            const cardMedia = cardImgSrc ? (cardImgSrc.startsWith('http') ? cardImgSrc : window.location.origin + (cardImgSrc.startsWith('/') ? '' : '/') + cardImgSrc) : pageImage;
            
            const cardPinUrl = `https://www.pinterest.com/pin/create/button/?url=${encodedPageUrl}&media=${encodeURIComponent(cardMedia)}&description=${encodeURIComponent(title + ' • Visto no Minha Decisão Certa')}`;
            
            const pinBtn = document.createElement('a');
            pinBtn.className = 'pin-it-btn';
            pinBtn.href = cardPinUrl;
            pinBtn.target = '_blank';
            pinBtn.rel = 'nofollow noreferrer';
            pinBtn.innerHTML = '<i class="fab fa-pinterest"></i> Salvar';
            
            container.appendChild(pinBtn);
        }
    });
});
