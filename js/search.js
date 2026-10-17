const searchIndex = [
  { title: "Notebooks", url: "index.html", desc: "Melhores notebooks custo-benefício 2026", icon: "fa-laptop", tags: "pc, computador, laptop, asus, dell, samsung" },
  { title: "Vídeo Romântico", url: "video-romantico.html", desc: "Crie um vídeo cinematográfico para o seu amor", icon: "fa-heart", tags: "namorados, video, presente, amor" },
  { title: "VEO AI Free", url: "artigo-veo-ai.html", desc: "Crie Shorts virais automaticamente com IA", icon: "fa-video", tags: "shorts, youtube, viral, ia, video" },
  { title: "Google Gemini", url: "artigo-gemini.html", desc: "Produtividade no trabalho e faculdade", icon: "fa-robot", tags: "ia, google, assistente, estudos, produtividade" },
  { title: "Animação 2D", url: "artigo-animacao-2d.html", desc: "Crie vídeos animados com Python e IA", icon: "fa-clapperboard", tags: "youtube, automação, video, python" },
  { title: "Geladeiras", url: "geladeiras.html", desc: "Reviews de geladeiras Frost Free e Inverter", icon: "fa-snowflake", tags: "refrigerador, brastemp, consul, electrolux" },
  { title: "Air Fryers", url: "airfryers.html", desc: "As melhores fritadeiras sem óleo", icon: "fa-fire-burner", tags: "fritadeira, mondial, cadence, britania" },
  { title: "Bicicletas", url: "bicicletas.html", desc: "MTB, Urbanas e Custo-Benefício Shopee", icon: "fa-bicycle", tags: "bike, caloi, oggi, ksw, trilha" },
  { title: "Máquinas de Lavar", url: "maquinas-de-lavar.html", desc: "Lavadoras e Lava e Seca eficientes", icon: "fa-soap", tags: "lavanderia, lavadora, brastemp, consul, lg" },
  { title: "Receitas Air Fryer", url: "receitas-airfryer.html", desc: "10 receitas fáceis para sua fritadeira", icon: "fa-utensils", tags: "comida, saudavel, bônus" },
  { title: "Cardápios Flexíveis", url: "cardapios-flexiveis.html", desc: "Guia completo com 170 cardápios", icon: "fa-leaf", tags: "dieta, emagrecer, receitas, nutritivo" },
  { title: "Blog", url: "blog.html", desc: "Artigos e dicas de compra", icon: "fa-blog", tags: "noticias, dicas, reviews" },
  { title: "Dia das Mães", url: "cartao-dia-das-maes.html", desc: "Crie seu cartão personalizado", icon: "fa-heart", tags: "presente, cartao, mae, amor" },
  { title: "Sobre Nós", url: "sobre.html", desc: "Conheça o Minha Decisão Certa", icon: "fa-info-circle", tags: "quem somos, contato" }
];

document.addEventListener('DOMContentLoaded', () => {
  // Add Search HTML to Body
  const searchModalHTML = `
    <div class="search-modal" id="search-modal">
      <button class="close-search" id="close-search"><i class="fas fa-times"></i></button>
      <div class="search-container">
        <div class="search-input-wrapper">
          <i class="fas fa-search"></i>
          <input type="text" id="global-search-input" placeholder="O que você está procurando?" autocomplete="off">
        </div>
        <div class="search-results" id="search-results">
          <!-- Results will appear here -->
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', searchModalHTML);

  const searchTriggers = document.querySelectorAll('.search-trigger, #nav-search-bar, .hero-search');
  const searchModal = document.getElementById('search-modal');
  const closeSearch = document.getElementById('close-search');
  const searchInput = document.getElementById('global-search-input');
  const searchResults = document.getElementById('search-results');

  // Open Search
  searchTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal.classList.add('active');
      setTimeout(() => searchInput.focus(), 100);
      document.body.style.overflow = 'hidden';
    });
  });

  // Close Search
  const closeSearchModal = () => {
    searchModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    searchInput.value = '';
    searchResults.innerHTML = '';
  };

  closeSearch.addEventListener('click', closeSearchModal);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      closeSearchModal();
    }
  });

  // Search Logic
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    const filtered = searchIndex.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.desc.toLowerCase().includes(query) || 
      item.tags.toLowerCase().includes(query)
    );

    displayResults(filtered);
  });

  function displayResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<p style="text-align: center; color: #888;">Nenhum resultado encontrado...</p>';
      return;
    }

    searchResults.innerHTML = results.map(item => `
      <a href="${item.url}" class="search-item">
        <i class="fas ${item.icon}"></i>
        <div class="search-item-info">
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
        </div>
      </a>
    `).join('');
  }
});
