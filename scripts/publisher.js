/**
 * Minha Decisão Certa - Automated Article Publisher
 * 
 * Rules:
 * 1. Persistent queue in artigos_agendados.json & data/publish-history.json
 * 2. ONLY publishes items where status === 'agendado' AND scheduledDate <= now (America/Sao_Paulo)
 * 3. Never publishes 'rascunho' without approval
 * 4. Never anticipates future scheduled dates
 * 5. Fetches real Shopee products via official Affiliate API (SHA256 signature)
 * 6. Atomically generates the HTML page, adds card to blog.html, and registers in sitemap.xml
 * 7. File lock prevents concurrent executions
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const QUEUE_FILE = path.join(ROOT_DIR, 'artigos_agendados.json');
const HISTORY_FILE = path.join(ROOT_DIR, 'data', 'publish-history.json');
const LOCK_FILE = path.join(ROOT_DIR, 'data', '.lock');
const BLOG_FILE = path.join(ROOT_DIR, 'blog.html');
const SITEMAP_FILE = path.join(ROOT_DIR, 'sitemap.xml');

// Load environment variables from .env.local if available
const envPath = path.join(ROOT_DIR, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (!process.env[key]) process.env[key] = value;
    }
  });
}

const SHOPEE_APP_ID = process.env.SHOPEE_APP_ID || "18312910009";
const SHOPEE_SECRET = process.env.SHOPEE_SECRET || "OFXWN5FVLGYYUHJZDKXBCZUJEXMROUGC";
const GRAPHQL_ENDPOINT = "https://open-api.affiliate.shopee.com.br/graphql";

function acquireLock() {
  if (fs.existsSync(LOCK_FILE)) {
    try {
      const stats = fs.statSync(LOCK_FILE);
      const age = Date.now() - stats.mtimeMs;
      if (age < 10 * 60 * 1000) return false;
      fs.unlinkSync(LOCK_FILE);
    } catch (e) {
      // Ignore
    }
  }

  try {
    fs.writeFileSync(LOCK_FILE, JSON.stringify({ pid: process.pid, time: new Date().toISOString() }), { flag: 'wx' });
    return true;
  } catch (err) {
    return false;
  }
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE);
  } catch (e) {}
}

function getSaoPauloNow(mockIsoDate) {
  return mockIsoDate ? new Date(mockIsoDate) : new Date();
}

function getTodayYMD(dateObj) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(dateObj);
}

function generateShopeeAuthHeader(payload) {
  const timestamp = Math.floor(Date.now() / 1000);
  const baseString = `${SHOPEE_APP_ID}${timestamp}${payload}${SHOPEE_SECRET}`;
  const signature = crypto.createHash('sha256').update(baseString).digest('hex');
  return `SHA256 Credential=${SHOPEE_APP_ID}, Timestamp=${timestamp}, Signature=${signature}`;
}

async function buscarProdutosShopee(termo) {
  if (!termo) return [];
  const query = `
  query {
    productOfferV2(keyword: "${termo}", page: 1, limit: 3, sortType: 1) {
      nodes {
        itemId
        productName
        price
        sales
        ratingStar
        imageUrl
        offerLink
      }
    }
  }`;

  try {
    const payload = JSON.stringify({ query });
    const authHeader = generateShopeeAuthHeader(payload);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: payload,
      signal: controller.signal
    });
    clearTimeout(timeout);

    const data = await res.json();
    return data?.data?.productOfferV2?.nodes || [];
  } catch (err) {
    console.warn(`[Shopee API] Erro ao buscar "${termo}":`, err.message);
    return [];
  }
}

function gerarHtmlArtigo(artigo, produtos, todayFormatted) {
  let produtosHtml = '';
  if (produtos && produtos.length > 0) {
    produtos.forEach((prod, i) => {
      const precoFormatado = Number(prod.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      produtosHtml += `
      <div class="product-item-card" style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:20px; margin-bottom:20px; display:grid; grid-template-columns:180px 1fr; gap:20px; align-items:center; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
          <div style="width:100%; height:160px; border-radius:10px; overflow:hidden; background:#f8fafc; display:flex; align-items:center; justify-content:center;">
              <img src="${prod.imageUrl}" alt="${prod.productName}" style="max-width:100%; max-height:100%; object-fit:contain;" loading="lazy">
          </div>
          <div>
              <div style="color:#f59e0b; font-weight:700; margin-bottom:6px; font-size:0.85rem;">
                  ★ ${prod.ratingStar || '4.9'} • <span style="color:#10b981; background:#ecfdf5; padding:2px 8px; border-radius:6px;">${prod.sales || '10+'}+ vendidos</span>
              </div>
              <h3 style="font-size:1.15rem; color:#1e293b; margin-bottom:8px; line-height:1.4;">${i + 1}. ${prod.productName}</h3>
              <div style="font-size:1.4rem; font-weight:800; color:#ee4d2d; margin-bottom:12px;">
                  ${precoFormatado}
              </div>
              <a href="${prod.offerLink}" target="_blank" rel="nofollow noopener noreferrer" style="background:linear-gradient(135deg, #ee4d2d 0%, #ff5722 100%); color:#fff; font-weight:700; padding:10px 20px; border-radius:8px; display:inline-flex; align-items:center; gap:8px; text-decoration:none; box-shadow:0 4px 12px rgba(238,77,45,0.25);">
                  Ver Oferta Oficial na Shopee ➔
              </a>
          </div>
      </div>`;
    });
  } else {
    produtosHtml = `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:24px; border-radius:12px; text-align:center;">
      <p style="color:#64748b; margin:0;">Os produtos e avaliações deste tema estão sendo atualizados com ofertas verificadas no catálogo oficial.</p>
    </div>`;
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${artigo.titulo} | Minha Decisão Certa</title>
    <meta name="description" content="Guia prático sobre ${artigo.categoria}: dicas reais para o dia a dia e achadinhos verificados com melhor custo-benefício.">
    <link rel="canonical" href="https://www.minhadecisaocerta.com.br/${artigo.slug}">
    
    <!-- OpenGraph & Twitter -->
    <meta property="og:title" content="${artigo.titulo}">
    <meta property="og:description" content="Guia prático com recomendações testadas e ofertas com frete grátis na Shopee.">
    <meta property="og:url" content="https://www.minhadecisaocerta.com.br/${artigo.slug}">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="summary_large_image">
    
    <!-- Estilos Globais -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #fdfbf7; color: #1e293b; margin: 0; padding: 0; }
        .article-container { max-width: 860px; margin: 40px auto; padding: 0 20px; }
        .article-header { text-align: center; margin-bottom: 35px; }
        .tag-pill { display: inline-block; background: ${artigo.cor || '#e07a5f'}; color: #fff; font-size: 0.8rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px; }
        .article-title { font-size: 2.2rem; font-weight: 800; color: #0f172a; line-height: 1.25; margin-bottom: 12px; }
        .article-meta { color: #64748b; font-size: 0.9rem; margin-bottom: 25px; }
        @media(max-width: 640px) {
            .product-item-card { grid-template-columns: 1fr !important; text-align: center; }
            .article-title { font-size: 1.6rem; }
        }
    </style>
</head>
<body>
    <header class="navbar" style="background:#fff; border-bottom:1px solid #f1f5f9; padding:15px 0;">
        <div class="container" style="max-width:1100px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; padding:0 20px;">
            <a href="index.html" style="font-weight:800; font-size:1.3rem; color:#0f172a; text-decoration:none;">Minha Decisão Certa</a>
            <nav>
                <a href="blog.html" style="color:#64748b; text-decoration:none; font-weight:600; margin-right:15px;">Blog</a>
                <a href="index.html#categorias" style="color:#64748b; text-decoration:none; font-weight:600;">Categorias</a>
            </nav>
        </div>
    </header>

    <main class="article-container">
        <header class="article-header">
            <span class="tag-pill">${artigo.categoria}</span>
            <h1 class="article-title">${artigo.titulo}</h1>
            <div class="article-meta">
                <span><i class="far fa-calendar-alt"></i> Publicado em ${todayFormatted}</span> • 
                <span><i class="far fa-clock"></i> Leitura de 4 min</span>
            </div>
        </header>

        <section style="background:#fff; border-radius:16px; padding:25px; border:1px solid #f1f5f9; margin-bottom:30px; line-height:1.7; color:#334155;">
            <p style="font-size:1.1rem; margin-top:0;">
                A rotina diária não precisa ser caótica nem exigir soluções caras. Com pequenos ajustes práticos e os acessórios certos, é possível poupar tempo, reduzir o cansaço e manter a harmonia no lar.
            </p>
            <p>
                Abaixo selecionamos os itens com melhores notas e avaliações reais de quem já comprou e aprovou no dia a dia.
            </p>
        </section>

        <section style="margin: 35px 0;">
            <h2 style="font-size:1.5rem; color:#0f172a; margin-bottom:20px;">Achadinhos Recomendados na Shopee</h2>
            ${produtosHtml}
        </section>

        <section style="background:#fff7f2; border-left:4px solid #e07a5f; padding:20px; border-radius:0 12px 12px 0; margin:35px 0;">
            <h3 style="color:#8c3b23; margin-top:0; margin-bottom:8px;">💡 Dica de Economia</h3>
            <p style="color:#475569; line-height:1.6; margin:0;">
                Lembre-se de resgatar os cupons de frete grátis e moedas disponíveis na aba de promoções do aplicativo Shopee antes de finalizar seu carrinho!
            </p>
        </section>

        <div style="text-align:center; margin-top:40px;">
            <a href="blog.html" style="color:#e07a5f; font-weight:700; text-decoration:none;">← Voltar para todos os artigos do Blog</a>
        </div>
    </main>

    <footer style="background:#0f172a; color:#94a3b8; text-align:center; padding:30px 20px; margin-top:60px; font-size:0.85rem;">
        <p>© 2026 Minha Decisão Certa. Como afiliados Shopee, recebemos comissão por compras qualificadas sem custo adicional para você.</p>
    </footer>
</body>
</html>`;
}

async function runPublisher(options = {}) {
  const { dryRun = false, mockNow = null, verbose = true } = options;

  if (!acquireLock()) {
    return { status: 'locked', message: 'Outro processo está publicando no momento.' };
  }

  try {
    const now = getSaoPauloNow(mockNow);
    const todayYMD = getTodayYMD(now);
    const todayFormatted = now.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    if (verbose) {
      console.log(`[MDC Publisher] Rodando em ${now.toISOString()} (Data SP: ${todayYMD})`);
      if (dryRun) console.log(`[MDC Publisher] MODO: DRY-RUN`);
    }

    if (!fs.existsSync(QUEUE_FILE)) {
      throw new Error(`Arquivo de fila não encontrado: ${QUEUE_FILE}`);
    }

    const artigos = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      try { history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8')); } catch (e) { history = []; }
    }

    // STRICT FILTER:
    // Only items where status === 'agendado' AND scheduledDate <= now (or data_publicacao <= todayYMD)
    const eligibleItems = artigos.filter(item => {
      if (item.status !== 'agendado') return false;
      const sched = item.scheduledDate ? new Date(item.scheduledDate) : new Date(`${item.data_publicacao}T10:00:00-03:00`);
      return sched <= now;
    });

    if (verbose) {
      console.log(`[MDC Publisher] Itens na fila: ${artigos.length} | Elegíveis e vencidos hoje: ${eligibleItems.length}`);
    }

    if (eligibleItems.length === 0) {
      return {
        status: 'idle',
        publishedCount: 0,
        publishedItems: [],
        message: 'Nenhum artigo agendado atingiu a data prevista de publicação.'
      };
    }

    // Sort chronologically
    eligibleItems.sort((a, b) => {
      const da = new Date(a.scheduledDate || a.data_publicacao);
      const db = new Date(b.scheduledDate || b.data_publicacao);
      return da - db;
    });

    const publishedItems = [];
    const errors = [];

    // Publish the due item
    for (const item of eligibleItems) {
      console.log(`[MDC Publisher] Publicando: "${item.titulo}" (${item.slug})`);

      try {
        if (dryRun) {
          console.log(`[MDC Publisher] [DRY RUN] Publicaria: ${item.slug}`);
          publishedItems.push({ id: item.id, slug: item.slug, dryRun: true });
          continue;
        }

        // 1. Fetch Shopee products
        console.log(`[MDC Publisher] Buscando Shopee para "${item.termo_shopee}"...`);
        const produtos = await buscarProdutosShopee(item.termo_shopee);
        console.log(`[MDC Publisher] Obtidos ${produtos.length} produtos oficiais da Shopee.`);

        // 2. Generate Article HTML
        const html = gerarHtmlArtigo(item, produtos, todayFormatted);
        const artigoPath = path.join(ROOT_DIR, item.slug);
        fs.writeFileSync(artigoPath, html, 'utf-8');
        console.log(`[MDC Publisher] HTML gerado: ${item.slug}`);

        // 3. Inject Card into blog.html (if not present)
        if (fs.existsSync(BLOG_FILE)) {
          let blogContent = fs.readFileSync(BLOG_FILE, 'utf-8');
          if (!blogContent.includes(`href="${item.slug}"`)) {
            const novoCard = `
      <!-- Article: ${item.titulo} -->
      <article class="glass blog-card" style="border: 1px solid rgba(224, 122, 95, 0.3); background: rgba(224, 122, 95, 0.04);">
        <div class="blog-img" style="display: flex; align-items: center; justify-content: center; font-size: 2rem; color: ${item.cor || '#e07a5f'}; padding: 1.5rem 0; background: rgba(224, 122, 95, 0.08); border-bottom: 1px solid rgba(255,255,255,0.05);">
          <i class="fas ${item.icone || 'fa-star'}"></i>
        </div>
        <div class="blog-info">
          <span style="color: ${item.cor || '#e07a5f'}; font-size: 0.8rem; font-weight: 700; letter-spacing: 1px;">${item.categoria.toUpperCase()}</span>
          <h2 style="margin: 0.5rem 0; font-size: 1.4rem;">${item.titulo}</h2>
          <p style="color: #a0a0a0; margin-bottom: 1.5rem; font-size: 0.95rem;">Confira a análise completa e as melhores ofertas verificadas com frete grátis na Shopee.</p>
          <a href="${item.slug}" style="color: ${item.cor || '#e07a5f'}; font-weight: 700; text-transform: uppercase; font-size: 0.85rem;">Ler Artigo Completo <i class="fas fa-arrow-right"></i></a>
        </div>
      </article>\n`;
            blogContent = blogContent.replace('<div class="blog-grid">', '<div class="blog-grid">' + novoCard);
            fs.writeFileSync(BLOG_FILE, blogContent, 'utf-8');
            console.log(`[MDC Publisher] Card adicionado em blog.html`);
          }
        }

        // 4. Update sitemap.xml
        if (fs.existsSync(SITEMAP_FILE)) {
          let sitemap = fs.readFileSync(SITEMAP_FILE, 'utf-8');
          const urlEntry = `https://www.minhadecisaocerta.com.br/${item.slug}`;
          if (!sitemap.includes(urlEntry)) {
            const newXml = `  <url>\n    <loc>${urlEntry}</loc>\n    <lastmod>${todayYMD}</lastmod>\n    <priority>0.8</priority>\n  </url>\n</urlset>`;
            sitemap = sitemap.replace('</urlset>', newXml);
            fs.writeFileSync(SITEMAP_FILE, sitemap, 'utf-8');
            console.log(`[MDC Publisher] URL adicionada ao sitemap.xml`);
          }
        }

        // 5. Update Status
        item.status = 'publicado';
        item.publishedAt = now.toISOString();

        history.push({
          id: item.id,
          slug: item.slug,
          titulo: item.titulo,
          publishedAt: now.toISOString(),
          status: 'success'
        });

        publishedItems.push({ id: item.id, slug: item.slug, titulo: item.titulo });

      } catch (err) {
        console.error(`[MDC Publisher] Erro ao publicar ${item.slug}:`, err.message);
        item.status = 'erro';
        item.lastError = err.message;

        history.push({
          id: item.id,
          slug: item.slug,
          attemptAt: now.toISOString(),
          status: 'error',
          error: err.message
        });

        errors.push({ id: item.id, error: err.message });
      }
    }

    if (!dryRun) {
      fs.writeFileSync(QUEUE_FILE, JSON.stringify(artigos, null, 2), 'utf-8');
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
    }

    return {
      status: 'completed',
      publishedCount: publishedItems.length,
      publishedItems,
      errorsCount: errors.length,
      errors
    };

  } finally {
    releaseLock();
  }
}

// CLI Execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = !args.includes('--silent');
  let mockNow = null;
  const mockIdx = args.indexOf('--now');
  if (mockIdx !== -1 && args[mockIdx + 1]) mockNow = args[mockIdx + 1];

  runPublisher({ dryRun, mockNow, verbose })
    .then(res => {
      console.log('\n[Resultado Publisher]:', JSON.stringify(res, null, 2));
      process.exit(res.errorsCount > 0 ? 1 : 0);
    })
    .catch(err => {
      console.error('\n[Erro Fatal Publisher]:', err);
      process.exit(1);
    });
}

module.exports = { runPublisher, acquireLock, releaseLock, buscarProdutosShopee };
