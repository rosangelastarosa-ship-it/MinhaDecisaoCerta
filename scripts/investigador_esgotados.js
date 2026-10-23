/**
 * 🕵️ ROBÔ INVESTIGADOR DE PRODUTOS ESGOTADOS & LINKS EXPIRADOS
 * Minha Decisão Certa - Shopee Affiliate Monitor
 * 
 * Funcionalidades:
 * 1. Rastrea todos os links de afiliados em todas as páginas do site
 * 2. Testa redirecionamento real até a Shopee
 * 3. Identifica produtos que caem em https://shope.ee/error_page ou páginas de produto indisponível
 * 4. Gera relatório visual no terminal e salva 'relatorio_esgotados.json'
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const SHOPEE_APP_ID = process.env.SHOPEE_APP_ID || "18312910009";
const SHOPEE_SECRET = process.env.SHOPEE_SECRET || "OFXWN5FVLGYYUHJZDKXBCZUJEXMROUGC";

// Cores para o terminal
const CORES = {
    reset: "\x1b[0m",
    verde: "\x1b[32m",
    vermelho: "\x1b[31m",
    amarelo: "\x1b[33m",
    azul: "\x1b[36m",
    negrito: "\x1b[1m"
};

// 1. Coleta todos os links de afiliados e onde estão localizados
function coletarLinksDoSite() {
    const htmlFiles = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html') && f !== 'index_antigo.html');
    const linksMap = new Map(); // url -> Array<{ file, line, title }>

    htmlFiles.forEach(file => {
        const filePath = path.join(ROOT_DIR, file);
        const lines = fs.readFileSync(filePath, 'utf8').split('\n');

        lines.forEach((lineText, index) => {
            const regex = /(https:\/\/(?:s\.shopee\.com\.br|shope\.ee|shopee\.com\.br\/[^\s"'<>]+)[^\s"'<>]*)/g;
            let match;
            while ((match = regex.exec(lineText)) !== null) {
                const url = match[1];
                if (!linksMap.has(url)) {
                    linksMap.set(url, []);
                }
                linksMap.get(url).push({
                    file,
                    line: index + 1
                });
            }
        });
    });

    return linksMap;
}

// 2. Resolve o redirecionamento do link da Shopee
function testarLink(url) {
    return new Promise((resolve) => {
        try {
            const req = https.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Accept-Language': 'pt-BR,pt;q=0.9'
                }
            }, (res) => {
                const location = res.headers.location || null;
                const statusCode = res.statusCode;

                let isErrorPage = false;
                let isDead = false;
                let finalDestination = location || url;

                if (location) {
                    if (location.includes('shope.ee/error_page') || 
                        location.includes('error_page') || 
                        location.includes('action_type=error')) {
                        isErrorPage = true;
                        isDead = true;
                    }
                }

                if (statusCode >= 400) {
                    isDead = true;
                }

                resolve({
                    url,
                    statusCode,
                    location,
                    finalDestination,
                    isErrorPage,
                    isDead
                });
            });

            req.on('error', (err) => {
                resolve({
                    url,
                    statusCode: 'ERRO',
                    error: err.message,
                    isDead: true,
                    isErrorPage: false
                });
            });

            req.setTimeout(9000, () => {
                req.destroy();
                resolve({
                    url,
                    statusCode: 'TIMEOUT',
                    isDead: true,
                    isErrorPage: false
                });
            });
        } catch (e) {
            resolve({
                url,
                statusCode: 'EXCECAO',
                error: e.message,
                isDead: true,
                isErrorPage: false
            });
        }
    });
}

async function iniciarInvestigacao() {
    console.log(`\n${CORES.negrito}${CORES.azul}================================================================${CORES.reset}`);
    console.log(`${CORES.negrito}${CORES.azul}      🕵️  ROBÔ INVESTIGADOR DE PRODUTOS ESGOTADOS - SHOPEE     ${CORES.reset}`);
    console.log(`${CORES.negrito}${CORES.azul}================================================================${CORES.reset}\n`);

    const linksMap = coletarLinksDoSite();
    const urls = Array.from(linksMap.keys());

    console.log(`📡 Localizados ${CORES.negrito}${urls.length}${CORES.reset} links de afiliados no site para investigar.\n`);

    const resultados = [];
    const esgotados = [];
    const ativos = [];

    // Processamento em lotes de 6 conexões simultâneas para não sobrecarregar
    const tamanhoLote = 6;
    for (let i = 0; i < urls.length; i += tamanhoLote) {
        const lote = urls.slice(i, i + tamanhoLote);
        const respostas = await Promise.all(lote.map(testarLink));

        respostas.forEach(res => {
            const ocorrencias = linksMap.get(res.url) || [];
            res.ocorrencias = ocorrencias;

            if (res.isErrorPage || res.isDead) {
                esgotados.push(res);
                console.log(`${CORES.vermelho}❌ [ESGOTADO/ERRO]${CORES.reset} ${res.url}`);
                ocorrencias.forEach(o => {
                    console.log(`   ↳ Arquivo: ${o.file}:${o.line}`);
                });
                if (res.isErrorPage) {
                    console.log(`   ↳ Redirecionou para página de erro da Shopee: ${res.location}`);
                }
            } else {
                ativos.push(res);
            }
            resultados.push(res);
        });

        process.stdout.write(`Progresso: ${resultados.length}/${urls.length} links investigados...\r`);
    }

    console.log(`\n\n${CORES.negrito}==================== RESUMO DA INVESTIGAÇÃO ====================${CORES.reset}`);
    console.log(`${CORES.verde}✅ Produtos Ativos & Com Estoque: ${ativos.length}${CORES.reset}`);
    console.log(`${CORES.vermelho}❌ Produtos Esgotados / Expirados: ${esgotados.length}${CORES.reset}`);

    // Salvar relatório JSON
    const relatorioPath = path.join(ROOT_DIR, 'relatorio_esgotados.json');
    const relatorio = {
        data_verificacao: new Date().toISOString(),
        total_links: urls.length,
        total_ativos: ativos.length,
        total_esgotados: esgotados.length,
        produtos_esgotados: esgotados.map(e => ({
            link: e.url,
            destino_redirecionamento: e.location,
            arquivos_afetados: e.ocorrencias
        }))
    };

    fs.writeFileSync(relatorioPath, JSON.stringify(relatorio, null, 2), 'utf8');
    console.log(`\n📄 Relatório salvo com sucesso em: ${CORES.azul}relatorio_esgotados.json${CORES.reset}\n`);

    if (esgotados.length === 0) {
        console.log(`${CORES.verde}${CORES.negrito}🎉 Parabéns! Todos os produtos do site estão com links ativos e funcionando!${CORES.reset}\n`);
    } else {
        console.log(`${CORES.amarelo}${CORES.negrito}⚠️ DICA: Substitua os links esgotados listados acima por novas ofertas ativas.${CORES.reset}\n`);
    }
}

iniciarInvestigacao();
