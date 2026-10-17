/**
 * Shopee Affiliate API Sync Script - Minha Decisão Certa
 * 
 * Consulta a Open API da Shopee Afiliados (GraphQL), busca as ofertas mais vendidas
 * para Maternidade & Bebê e produtos em destaque, gerando links oficiais de afiliado.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Tenta carregar variáveis do .env.local se existir
const envPath = path.join(__dirname, '.env.local');
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

// Credenciais da Shopee Open API (Portal Afiliados)
const SHOPEE_APP_ID = process.env.SHOPEE_APP_ID || "18312910009";
const SHOPEE_SECRET = process.env.SHOPEE_SECRET || "OFXWN5FVLGYYUHJZDKXBCZUJEXMROUGC";
const GRAPHQL_ENDPOINT = "https://open-api.affiliate.shopee.com.br/graphql";

function generateShopeeAuthHeader(payload) {
    const timestamp = Math.floor(Date.now() / 1000);
    const baseString = `${SHOPEE_APP_ID}${timestamp}${payload}${SHOPEE_SECRET}`;
    const signature = crypto.createHash('sha256').update(baseString).digest('hex');

    return `SHA256 Credential=${SHOPEE_APP_ID}, Timestamp=${timestamp}, Signature=${signature}`;
}

async function queryShopee(query) {
    const payload = JSON.stringify({ query });
    const authHeader = generateShopeeAuthHeader(payload);

    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        },
        body: payload
    });

    return await response.json();
}

async function sincronizarProdutosShopee() {
    console.log("=== Sincronizador Automático Shopee Afiliados ===");

    if (SHOPEE_APP_ID === "SEU_APP_ID_AQUI" || SHOPEE_SECRET === "SEU_SECRET_KEY_AQUI") {
        console.log("\n⚠️ ATENÇÃO: As chaves da Shopee ainda não foram inseridas.");
        console.log("👉 Para a API buscar as ofertas e gerar os seus links automaticamente:");
        console.log("1. Pegue o seu App ID e Secret no portal: https://affiliate.shopee.com.br/open_api");
        console.log("2. Cole-os no .env.local ou passe aqui no chat.");
        console.log("3. O script puxará as fotos oficiais, menores preços e gerará seus links na hora!\n");
        return;
    }

    console.log("🚀 Conectando à Open API da Shopee...");

    // Termos de busca da campanha de maternidade & sono
    const maternityKeywords = [
        { term: "ruido branco bebe", key: "ruido-branco", tag: "🌙 Salva Madrugadas" },
        { term: "luminaria touch silicone", key: "luminaria-touch", tag: "💡 Amamentação Noturna" },
        { term: "copo 360 antivazamento", key: "copo-transicao", tag: "💧 Zero Vazamentos" },
        { term: "kit silicone introducao alimentar", key: "kit-silicone", tag: "🥣 Praticidade BLW" },
        { term: "mochila maternidade multifuncional", key: "mochila-maternidade", tag: "🎒 Essencial Passeios" }
    ];

    const linksMapeados = {};

    try {
        console.log("🔍 Buscando ofertas verificadas de Maternidade na Shopee...");

        for (const item of maternityKeywords) {
            const query = `
            query {
                productOfferV2(keyword: "${item.term}", page: 1, limit: 3, sortType: 1) {
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

            const res = await queryShopee(query);
            console.log(`[${item.key}] Resposta Shopee:`, JSON.stringify(res));
            const nodes = res?.data?.productOfferV2?.nodes || [];

            if (nodes.length > 0) {
                const top = nodes[0];
                linksMapeados[item.key] = top.offerLink;
                console.log(`✅ [${item.key}]: "${top.productName.slice(0, 40)}..." -> Preço: R$ ${top.price} | Link: ${top.offerLink}`);
            }
        }

        // Atualizar links nos arquivos HTML automaticamente se encontrados
        if (Object.keys(linksMapeados).length > 0) {
            atualizarLinksNosArquivos(linksMapeados);
        }

    } catch (err) {
        console.error("Erro ao sincronizar com a Shopee:", err.message);
    }
}

function atualizarLinksNosArquivos(links) {
    console.log("📝 Atualizando links de afiliado nos arquivos do site...");

    const arquivos = [
        path.join(__dirname, 'rotina-sono-bebe.html'),
        path.join(__dirname, 'guia-sono-bebe', 'index.html'),
        path.join(__dirname, 'rotina-sono-bebe-lp.html')
    ];

    arquivos.forEach(filePath => {
        if (!fs.existsSync(filePath)) return;
        let content = fs.readFileSync(filePath, 'utf-8');

        if (links['ruido-branco']) {
            content = content.replace(/https:\/\/s\.shopee\.com\.br\/afiliado-ruido-branco/g, links['ruido-branco']);
        }
        if (links['luminaria-touch']) {
            content = content.replace(/https:\/\/s\.shopee\.com\.br\/afiliado-luminaria-touch/g, links['luminaria-touch']);
        }
        if (links['copo-transicao']) {
            content = content.replace(/https:\/\/s\.shopee\.com\.br\/afiliado-copo-transicao/g, links['copo-transicao']);
        }
        if (links['kit-silicone']) {
            content = content.replace(/https:\/\/s\.shopee\.com\.br\/afiliado-kit-alimentacao/g, links['kit-silicone']);
        }

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✨ Links atualizados em: ${path.basename(filePath)}`);
    });

    console.log("🎉 Sucesso total! Todos os botões do site agora usam os seus links oficiais da API!");
}

sincronizarProdutosShopee();
