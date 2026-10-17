const fs = require('fs');
const path = require('path');

const dir = __dirname;
const baseUrl = 'https://www.minhadecisaocerta.com.br/';

const pages = [
  'celulares.html',
  'notebooks.html',
  'geladeiras.html',
  'airfryers.html',
  'bicicletas.html',
  'maquinas-de-lavar.html',
  'tvs.html'
];

function parsePrice(text) {
  const m = text.match(/R\$\s*([\d.]+,\d{2})/);
  if (!m) return null;
  return m[1].replace(/\./g, '').replace(',', '.');
}

function extractUrl(cardHtml) {
  let m = cardHtml.match(/onclick="window\.open\('([^']+)'/);
  if (m) return m[1];
  m = cardHtml.match(/onclick="window\.location\.href='([^']+)'/);
  if (m) return new URL(m[1], baseUrl).href;
  return null;
}

function extractReviewCount(text) {
  const m = text.match(/\(([\d.]+)\s*avalia/);
  if (!m) return null;
  return parseInt(m[1].replace(/\./g, ''), 10);
}

pages.forEach(file => {
  const filePath = path.join(dir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const pageTitle = h1Match ? h1Match[1].trim() : file;
  const pageUrl = baseUrl + file;

  const cardBlocks = html.match(/<article class="product-card">[\s\S]*?<\/article>/g) || [];

  const items = cardBlocks.map((card, idx) => {
    const imgMatch = card.match(/<img src="([^"]+)"/);
    const titleMatch = card.match(/class="product-title">([^<]+)</);
    const ratingMatch = card.match(/class="rating-score">([^<]+)</);
    const countMatch = card.match(/class="rating-count">([^<]+)</);
    const priceMatch = card.match(/class="price-range"[^>]*>([^<]+)</);

    if (!titleMatch) return null;

    const name = titleMatch[1].trim();
    const image = imgMatch ? new URL(imgMatch[1], baseUrl).href : undefined;
    const ratingValue = ratingMatch ? ratingMatch[1].trim() : null;
    const countText = countMatch ? countMatch[1].trim() : '';
    const reviewCount = extractReviewCount(countText);
    const priceText = priceMatch ? priceMatch[1].trim() : '';
    const price = parsePrice(priceText);
    const offerUrl = extractUrl(card);

    const product = {
      '@type': 'Product',
      name: name
    };
    if (image) product.image = image;
    if (offerUrl) product.url = offerUrl;

    if (ratingValue) {
      if (reviewCount) {
        product.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: ratingValue,
          bestRating: '5',
          reviewCount: reviewCount
        };
      } else if (/Nota\s+([\d.]+)\/10/.test(countText)) {
        const notaMatch = countText.match(/Nota\s+([\d.]+)\/10/);
        product.review = {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: notaMatch[1],
            bestRating: '10'
          },
          author: {
            '@type': 'Organization',
            name: 'Minha Decisão Certa'
          }
        };
      }
    }

    if (price) {
      product.offers = {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: price,
        availability: 'https://schema.org/InStock',
        url: offerUrl || pageUrl
      };
    }

    return {
      '@type': 'ListItem',
      position: idx + 1,
      item: product
    };
  }).filter(Boolean);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    url: pageUrl,
    itemListElement: items
  };

  const scriptTag = `<script type="application/ld+json" data-schema="product-list">\n${JSON.stringify(schema, null, 2)}\n</script>\n`;

  if (html.includes('data-schema="product-list"')) {
    html = html.replace(/<script type="application\/ld\+json" data-schema="product-list">[\s\S]*?<\/script>\n?/, scriptTag);
  } else {
    html = html.replace('</head>', scriptTag + '</head>');
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`${file}: ${items.length} products in schema`);
});
