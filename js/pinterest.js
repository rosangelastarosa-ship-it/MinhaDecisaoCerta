document.addEventListener('DOMContentLoaded', () => {
    // Find all product images in cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const img = card.querySelector('.product-img');
        const title = card.querySelector('h2')?.innerText || 'Confira no Minha Decisão Certa';
        
        if (img) {
            // Create container
            const container = document.createElement('div');
            container.className = 'img-container';
            
            // Wrap image
            img.parentNode.insertBefore(container, img);
            container.appendChild(img);
            
            // Create Pinterest Button
            const pageUrl = encodeURIComponent(window.location.href);
            const mediaUrl = encodeURIComponent(window.location.origin + '/' + img.getAttribute('src'));
            const description = encodeURIComponent(title + ' - Visto no Minha Decisão Certa');
            
            const pinBtn = document.createElement('a');
            pinBtn.className = 'pin-it-btn';
            pinBtn.href = `https://www.pinterest.com/pin/create/button/?url=${pageUrl}&media=${mediaUrl}&description=${description}`;
            pinBtn.target = '_blank';
            pinBtn.rel = 'nofollow noreferrer';
            pinBtn.innerHTML = '<i class="fab fa-pinterest"></i> Salvar';
            
            container.appendChild(pinBtn);
        }
    });
});
