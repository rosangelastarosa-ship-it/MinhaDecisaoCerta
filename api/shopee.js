/**
 * Serverless Function para Vercel: /api/shopee
 * 
 * Busca ofertas ao vivo e gera links de afiliado via Open API da Shopee (GraphQL).
 * As credenciais NUNCA são expostas ao cliente e são lidas de process.env.SHOPEE_APP_ID e process.env.SHOPEE_SECRET.
 * Se as variáveis não estiverem configuradas, retorna { configured: false, offers: [] } sem quebrar a página.
 */

const crypto = require('crypto');

const GRAPHQL_ENDPOINT = 'https://open-api.affiliate.shopee.com.br/graphql';

module.exports = async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const appId = (process.env.SHOPEE_APP_ID || '').replace(/[^\x20-\x7E]/g, '').trim();
  const secret = (process.env.SHOPEE_SECRET || '').replace(/[^\x20-\x7E]/g, '').trim();

  // Sem as variáveis configuradas, avisa honestamente sem quebrar a página
  if (!appId || !secret || appId === 'SEU_APP_ID_AQUI' || secret === 'SEU_SECRET_KEY_AQUI') {
    return res.status(200).json({
      configured: false,
      offers: [],
      message: 'API da Shopee não configurada: defina SHOPEE_APP_ID e SHOPEE_SECRET nas variáveis de ambiente da Vercel.'
    });
  }

  const keyword = (req.query.keyword || '').trim();
  if (!keyword) {
    return res.status(200).json({
      configured: true,
      offers: [],
      message: 'Nenhuma palavra-chave informada.'
    });
  }

  try {
    const payload = JSON.stringify({
      query: `query SearchOffers($keyword: String!) {
        productOfferV2(keyword: $keyword, page: 1, limit: 20) {
          nodes {
            itemId
            productName
            priceMin
            priceMax
            offerLink
            imageUrl
          }
        }
      }`,
      variables: { keyword }
    });

    const timestamp = Math.floor(Date.now() / 1000);
    const baseString = `${appId}${timestamp}${payload}${secret}`;
    const signature = crypto.createHash('sha256').update(baseString).digest('hex');
    const authHeader = `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`;

    const apiRes = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: payload
    });

    const data = await apiRes.json();
    let nodes = (data && data.data && data.data.productOfferV2 && data.data.productOfferV2.nodes) || [];

    // Filtro rigoroso contra acessórios (teclados, fontes, cabos, capinhas, etc.)
    const ACCESSORY_WORDS = [
      'teclado', 'teclados',
      'capa', 'capas', 'capinha', 'capinhas', 'case', 'cases', 'pasta', 'maleta',
      'pelicula', 'peliculas', 'protetor', 'protetora',
      'carregador', 'carregadores',
      'cabo', 'cabos', 'flat',
      'adaptador', 'adaptadores', 'plug', 'hub', 'dock',
      'suporte', 'suportes',
      'fonte', 'fontes',
      'bateria', 'baterias',
      'mouse', 'mouses', 'mousepad',
      'fone', 'fones', 'headset', 'headphone',
      'cooler', 'coolers', 'cooler pad', 'base refrigerada',
      'adesivo', 'adesivos', 'skin', 'skins',
      'display', 'touch', 'tela display', 'peca', 'pecas', 'modulo', 'placa', 'flex',
      'cesto', 'grelha', 'tapete', 'forma', 'papel', 'resistencia', 'alca', 'controle'
    ];
    const minPriceReq = Number(req.query.minPrice) || 0;
    nodes = nodes.filter(n => {
      const hay = (n.productName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (ACCESSORY_WORDS.some(w => hay.includes(w))) return false;
      const price = Number(n.priceMin) > 100000 ? Number(n.priceMin) / 100 : Number(n.priceMin);
      if (price <= 0) return false;
      if (minPriceReq > 0 && price < minPriceReq) return false;
      return true;
    }).slice(0, 5); // Foca nos 5 melhores itens válidos

    // Gera shortlink de afiliado para cada oferta encontrada
    for (let node of nodes) {
      if (node.offerLink) {
        try {
          const shortPayload = JSON.stringify({
            query: `mutation GenShort($originUrl: String!) {
              generateShortLink(input: { originUrl: $originUrl }) {
                shortLink
              }
            }`,
            variables: { originUrl: node.offerLink }
          });
          const shortTimestamp = Math.floor(Date.now() / 1000);
          const shortBase = `${appId}${shortTimestamp}${shortPayload}${secret}`;
          const shortSig = crypto.createHash('sha256').update(shortBase).digest('hex');
          const shortAuth = `SHA256 Credential=${appId}, Timestamp=${shortTimestamp}, Signature=${shortSig}`;

          const shortRes = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': shortAuth
            },
            body: shortPayload
          });
          const shortData = await shortRes.json();
          if (shortData && shortData.data && shortData.data.generateShortLink && shortData.data.generateShortLink.shortLink) {
            node.offerLink = shortData.data.generateShortLink.shortLink;
          }
        } catch (e) {
          // Mantém o link original se falhar a criação do shortlink
        }
      }
    }

    return res.status(200).json({
      configured: true,
      offers: nodes
    });
  } catch (err) {
    return res.status(200).json({
      configured: false,
      offers: [],
      error: err.message,
      message: 'Falha ao consultar a API da Shopee — mantendo preços curados do guia.'
    });
  }
};

