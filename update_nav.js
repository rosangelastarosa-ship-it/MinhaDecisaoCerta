const fs = require('fs');
const path = __dirname;

const newNav = `<nav class="nav-links">
        <a href="notebooks.html">Notebooks</a>
        <a href="geladeiras.html">Geladeiras</a>
        <a href="airfryers.html">Air Fryers</a>
        <a href="bicicletas.html">Bicicletas</a>
        <a href="maquinas-de-lavar.html">Máquinas</a>
        <a href="celulares.html">Celulares</a>
        <a href="tvs.html">TVs</a>
        <a href="vitrine-bolsas/index.html" style="color: #ec4899; font-weight: bold;">Bolsas CH (Novo)</a>
        <a href="artigo-veo-ai.html" style="color: #ef4444; font-weight: bold;">VEO AI</a>
        <a href="video-romantico.html" style="color: #f472b6; font-weight: bold;">Vídeo de Amor</a>
        <a href="artigo-gemini.html" style="color: var(--primary); font-weight: bold;">Guia Gemini</a>
        <a href="artigo-animacao-2d.html" style="color: #3b82f6; font-weight: bold;">Animação 2D</a>
        <a href="blog.html">Blog</a>
        <a href="categorias.html">Mais</a>
        <div class="search-trigger"><i class="fas fa-search"></i><span>Buscar...</span></div>
      </nav>`;

const searchScript = `<script src="js/search.js"></script>`;

const files = fs.readdirSync(path).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path + '/' + file;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the old nav block with the new unified one
  content = content.replace(/<nav class="nav-links">[\s\S]*?<\/nav>/, newNav);

  // Inject scripts if not present
  if (!content.includes('js/search.js')) {
    content = content.replace('</body>', `<script src="js/search.js"></script>\n</body>`);
  }
  if (!content.includes('js/pinterest.js')) {
    content = content.replace('</body>', `<script src="js/pinterest.js"></script>\n</body>`);
  }
  if (!content.includes('js/chatbot.js')) {
    content = content.replace('</body>', `<script src="js/chatbot.js"></script>\n</body>`);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + file);
});
