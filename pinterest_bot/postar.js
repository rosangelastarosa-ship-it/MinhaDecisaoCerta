const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// ==========================================================
// CONFIGURAÇÕES INDIVIDUAIS DOS PINS (SEO + LINKS)
// ==========================================================
const PINS_CONFIG = {
    "pin_robo_aspirador.jpg": {
        titulo: "Vale a Pena? Os 5 Melhores Robôs Aspiradores Baratos da Shopee (2026)",
        descricao: "Chega de sofrer com pelos de pet e poeira pela casa! Analisamos os 5 melhores robôs aspiradores da Shopee que realmente funcionam e cabem no bolso. Veja o comparativo sincero com cupons de frete grátis no Minha Decisão Certa! #roboaspirador #achadinhosshopee #shopeebrasil #limpeza #casalimpa #dicasdecasa",
        link: "https://www.minhadecisaocerta.com.br/artigo-robos-aspiradores.html"
    },
    "pin_cozinha_pratica.jpg": {
        titulo: "5 Achadinhos de Cozinha da Shopee que Parecem Caros mas Custam Menos de R$ 30",
        descricao: "Itens práticos que transformam a sua rotina na cozinha sem pesar no bolso! Mini processador USB, seladora portátil, dispenser 2 em 1 e muito mais. Clique para conferir as ofertas verificadas com frete grátis na Shopee! #achadinhosshopee #cozinhapratica #organizacaocasa #shopee #utilidadesdomesticas",
        link: "https://www.minhadecisaocerta.com.br/index.html#vitrine-cozinha"
    }
};

const TITULO_PADRAO = "Achadinhos e Recomendações Sinceras | Minha Decisão Certa";
const DESCRICAO_PADRAO = "Confira análises completas, testes de produtos e cupons com frete grátis para fazer compras inteligentes na Shopee e internet. Acesse agora!";
const LINK_PADRAO = "https://www.minhadecisaocerta.com.br/";

async function processarPasta(pastaImagens) {
    const caminhoPasta = path.isAbsolute(pastaImagens) ? pastaImagens : path.resolve(__dirname, pastaImagens);
    const pastaSessao = path.resolve(__dirname, "sessao_pinterest");

    if (!fs.existsSync(caminhoPasta)) {
        console.error(`ERRO: A pasta '${caminhoPasta}' não foi encontrada.`);
        return;
    }

    const arquivos = fs.readdirSync(caminhoPasta);
    // Filtrar apenas arquivos de imagem comuns
    const imagens = arquivos.filter(arq => arq.match(/\.(jpg|jpeg|png|webp|gif)$/i));

    if (imagens.length === 0) {
        console.log(`Nenhuma imagem encontrada na pasta '${caminhoPasta}'. Coloque suas fotos lá primeiro!`);
        return;
    }

    console.log(`====================================================`);
    console.log(`   ROBÔ PINTEREST - MINHA DECISÃO CERTA`);
    console.log(`====================================================`);
    console.log(`Encontradas ${imagens.length} imagens para processar.`);
    console.log(`Pasta da sessão: ${pastaSessao}`);
    console.log(`Iniciando navegador Chrome...\n`);

    const browser = await chromium.launchPersistentContext(pastaSessao, {
        headless: false,
        channel: 'chrome', // Usa o seu Google Chrome instalado
        viewport: { width: 1280, height: 800 },
        args: ['--disable-blink-features=AutomationControlled'] // Disfarce de automação
    });

    const page = await browser.newPage();

    try {
        for (let i = 0; i < imagens.length; i++) {
            const nomeArquivo = imagens[i];
            const caminhoAbsoluto = path.join(caminhoPasta, nomeArquivo);

            const config = PINS_CONFIG[nomeArquivo] || {
                titulo: TITULO_PADRAO,
                descricao: DESCRICAO_PADRAO,
                link: LINK_PADRAO
            };

            console.log(`\n----------------------------------------------------`);
            console.log(`[${i + 1}/${imagens.length}] Processando: ${nomeArquivo}`);
            console.log(`📌 Título: ${config.titulo}`);
            console.log(`🔗 Link: ${config.link}`);
            console.log(`----------------------------------------------------`);

            try {
                // Tenta verificar se precisa logar
                await page.goto("https://br.pinterest.com/pin-builder/", { waitUntil: 'domcontentloaded', timeout: 30000 });
                await page.waitForTimeout(2000);

                // Se redirecionar para a página de login
                if (page.url().includes("/login")) {
                    console.log("Detectada tela de login. Tentando autenticação automática...");
                    const emailInput = page.locator('#email');
                    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
                        await emailInput.fill("rosangelastarosa@hotmail.com");
                        await page.locator('#password').fill("#gABRIEL1974]");
                        await page.locator('button[type="submit"]').click();
                        await page.waitForTimeout(6000);
                        await page.goto("https://br.pinterest.com/pin-builder/");
                    }
                }

                const fileInputSelector = 'input[type="file"], input[aria-label="Upload de arquivo"], input[id^="media-upload-input-"]';
                await page.waitForSelector(fileInputSelector, { state: 'attached', timeout: 20000 });

                const fileInput = await page.$(fileInputSelector);
                await fileInput.setInputFiles(caminhoAbsoluto);

                await page.waitForTimeout(4000); // Aguarda imagem carregar no canvas

                // Preencher Título
                const tituloInput = await page.locator('textarea[placeholder*="título"], input[placeholder*="título"]').first();
                if (await tituloInput.isVisible({ timeout: 4000 }).catch(() => false)) {
                    await tituloInput.fill(config.titulo);
                    console.log("✓ Título preenchido");
                }

                // Preencher Descrição
                const descInput = await page.locator('div[data-test-id="pin-description-editor"], textarea[placeholder*="sobre o que é o seu Pin"], div[contenteditable="true"]').first();
                if (await descInput.isVisible({ timeout: 4000 }).catch(() => false)) {
                    await descInput.click();
                    await page.keyboard.type(config.descricao);
                    console.log("✓ Descrição preenchida");
                }

                // Preencher Link
                const linkInput = await page.locator('textarea[placeholder*="link de destino"], input[placeholder*="link de destino"]').first();
                if (await linkInput.isVisible({ timeout: 4000 }).catch(() => false)) {
                    await linkInput.fill(config.link);
                    console.log("✓ Link de destino preenchido");
                }

                console.log("Clicando em Salvar / Publicar...");
                const btnSalvar = await page.locator('button[data-test-id="board-dropdown-save-button"], button:has-text("Publicar"), button:has-text("Salvar")').first();
                if (await btnSalvar.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await btnSalvar.click();
                    console.log("Aguardando 10 segundos para a publicação finalizar...");
                    await page.waitForTimeout(10000);
                    console.log(`✅ [OK] ${nomeArquivo} publicado com sucesso!`);
                } else {
                    console.log("⚠️ Botão de salvar não encontrado diretamente. Verifique se o Pin requer seleção de pasta.");
                }

                // Pausa anti-spam se houver mais de uma imagem
                if (i < imagens.length - 1) {
                    console.log("Aguardando 25 segundos antes do próximo post para proteger sua conta contra bloqueios...");
                    await page.waitForTimeout(25000);
                }

            } catch (err) {
                console.error(`❌ Erro ao postar ${nomeArquivo}:`, err.message);
                const erroPrint = path.resolve(__dirname, `erro_${nomeArquivo}.png`);
                await page.screenshot({ path: erroPrint, fullPage: true }).catch(() => {});
            }
        }
        console.log("\n🎉 Todas as imagens da pasta foram processadas pelo robô!");
    } catch (error) {
        console.error("Erro fatal no robô do Pinterest:", error.message);
    } finally {
        await browser.close();
    }
}

// ==========================================================
// EXECUÇÃO
// ==========================================================
const PASTA_IMAGENS = "minhas_fotos";
const caminhoPasta = path.resolve(__dirname, PASTA_IMAGENS);

if (!fs.existsSync(caminhoPasta)) {
    fs.mkdirSync(caminhoPasta, { recursive: true });
    console.log(`\n=> Criei a pasta '${caminhoPasta}' para você!`);
}

processarPasta(PASTA_IMAGENS);
