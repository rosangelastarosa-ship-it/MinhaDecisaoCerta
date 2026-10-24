const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// ==========================================================
// CONFIGURAÇÕES INDIVIDUAIS DOS PINS (SEO + LINKS)
// ==========================================================
const PINS_CONFIG = {
    "pin_cozinha_pratica.jpg": {
        titulo: "5 Achadinhos de Cozinha da Shopee que Parecem Caros mas Custam Menos de R$ 30",
        descricao: "Itens práticos que transformam a sua rotina na cozinha sem pesar no bolso! Mini processador USB, seladora portátil, dispenser 2 em 1 e muito mais. Clique para conferir as ofertas verificadas com frete grátis na Shopee! #achadinhosshopee #cozinhapratica #organizacaocasa #shopee #utilidadesdomesticas",
        link: "https://www.minhadecisaocerta.com.br/index.html#vitrine-cozinha"
    },
    "pin_robo_aspirador.jpg": {
        titulo: "Vale a Pena? Os 5 Melhores Robôs Aspiradores Baratos da Shopee (2026)",
        descricao: "Chega de sofrer com pelos de pet e poeira pela casa! Analisamos os 5 melhores robôs aspiradores da Shopee que realmente funcionam e cabem no bolso. Veja o comparativo sincero com cupons de frete grátis no Minha Decisão Certa! #roboaspirador #achadinhosshopee #shopeebrasil #limpeza #casalimpa #dicasdecasa",
        link: "https://www.minhadecisaocerta.com.br/artigo-robos-aspiradores.html"
    },
    "pin_eletronicos_shopee.jpg": {
        titulo: "10 Eletrônicos Baratos da Shopee que Parecem Caros em 2026",
        descricao: "Fones sem fio com cancelamento de ruído, smartwatch AMOLED, mini projetor de cinema e caixas de som à prova d'água! Selecionamos os 10 melhores gadgets virais da Shopee com avaliações 5 estrelas e frete grátis. Confira o comparativo no Minha Decisão Certa! #eletronicos #achadinhosshopee #gadgets #tecnologia #fonedeouvido #smartwatch #shopee",
        link: "https://www.minhadecisaocerta.com.br/eletronicos.html"
    }
};

const TITULO_PADRAO = "Achadinhos e Recomendações Sinceras | Minha Decisão Certa";
const DESCRICAO_PADRAO = "Confira análises completas, testes de produtos e cupons com frete grátis para fazer compras inteligentes na Shopee e internet. Acesse agora!";
const LINK_PADRAO = "https://www.minhadecisaocerta.com.br/";

async function fecharPopups(page) {
    try {
        const entendiBtn = page.locator('button:has-text("Entendi")');
        if (await entendiBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log("ℹ️ Fechando pop-up informativo ('Entendi')...");
            await entendiBtn.click().catch(() => {});
            await page.waitForTimeout(1000);
        }
    } catch (e) {}
}

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
        console.log(`Nenhuma imagem encontrada na pasta '${caminhoPasta}'.`);
        return;
    }

    console.log(`====================================================`);
    console.log(`   ROBÔ PINTEREST - MINHA DECISÃO CERTA`);
    console.log(`====================================================`);
    console.log(`Total de imagens na fila: ${imagens.length}`);
    console.log(`Pasta da sessão: ${pastaSessao}\n`);

    const browser = await chromium.launchPersistentContext(pastaSessao, {
        headless: false,
        channel: 'chrome',
        viewport: { width: 1440, height: 900 },
        args: ['--disable-blink-features=AutomationControlled']
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
            console.log(`[${i + 1}/${imagens.length}] Preparando: ${nomeArquivo}`);
            console.log(`📌 Título: ${config.titulo}`);
            console.log(`🔗 Link: ${config.link}`);
            console.log(`----------------------------------------------------`);

            try {
                // Abrir a tela de criação do Pin
                await page.goto("https://br.pinterest.com/pin-builder/", { waitUntil: 'domcontentloaded', timeout: 35000 });
                await page.waitForTimeout(3000);

                // Fechar popup se estiver na frente
                await fecharPopups(page);

                // Se pediu login
                if (page.url().includes("/login")) {
                    console.log("Tela de login detectada. Tentando preenchimento...");
                    const emailInput = page.locator('#email');
                    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
                        await emailInput.fill("rosangelastarosa@hotmail.com");
                        await page.locator('#password').fill("#gABRIEL1974]");
                        await page.locator('button[type="submit"]').click();
                        await page.waitForTimeout(6000);
                        await page.goto("https://br.pinterest.com/pin-builder/");
                    }
                }

                // Upload da imagem
                const fileInputSelector = 'input[type="file"], input[aria-label="Upload de arquivo"], input[id^="media-upload-input-"]';
                await page.waitForSelector(fileInputSelector, { state: 'attached', timeout: 25000 });
                const fileInput = await page.$(fileInputSelector);
                console.log("Enviando arquivo de imagem...");
                await fileInput.setInputFiles(caminhoAbsoluto);

                // Aguarda o upload e o fechamento de qualquer tooltip novo
                await page.waitForTimeout(4000);
                await fecharPopups(page);

                // Preencher Título
                console.log("Preenchendo Título...");
                const tituloInput = page.locator('textarea[placeholder*="título"], input[placeholder*="título"]').first();
                if (await tituloInput.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await tituloInput.fill(config.titulo);
                    console.log("✓ Título preenchido com sucesso");
                }

                // Preencher Descrição
                console.log("Preenchendo Descrição...");
                const descInput = page.locator('div[data-test-id="pin-description-editor"], textarea[placeholder*="sobre o que é o seu Pin"], div[contenteditable="true"]').first();
                if (await descInput.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await descInput.click();
                    await page.keyboard.type(config.descricao);
                    console.log("✓ Descrição preenchida com sucesso");
                }

                // Preencher Link de Destino
                console.log("Preenchendo Link de Destino...");
                const linkInput = page.locator('textarea[placeholder*="link de destino"], input[placeholder*="link de destino"]').first();
                if (await linkInput.isVisible({ timeout: 5000 }).catch(() => false)) {
                    await linkInput.fill(config.link);
                    console.log("✓ Link preenchido com sucesso");
                }

                await page.waitForTimeout(2000);

                // Clicar no botão Publicar
                // No Pinterest, o botão de publicar é: [data-test-id="board-dropdown-save-button"]
                console.log("Localizando botão 'Publicar'...");
                const btnPublicar = page.locator('[data-test-id="board-dropdown-save-button"], div.box_k:has-text("Publicar"), button:has-text("Publicar")').first();

                if (await btnPublicar.isVisible({ timeout: 8000 }).catch(() => false)) {
                    console.log("Clicando em Publicar...");
                    await btnPublicar.click();
                    console.log("Aguardando 12 segundos para a conclusão da publicação...");
                    await page.waitForTimeout(12000);
                    console.log(`✅ [SUCESSO] ${nomeArquivo} publicado com sucesso no Pinterest!`);
                } else {
                    console.log("⚠️ Botão de salvar não encontrado diretamente. Tentando clique forçado...");
                    await page.evaluate(() => {
                        const el = document.querySelector('[data-test-id="board-dropdown-save-button"]');
                        if (el) el.click();
                    });
                    await page.waitForTimeout(10000);
                    console.log(`✅ [SUCESSO] Tentativa de publicação disparada para ${nomeArquivo}!`);
                }

                // Pausa de segurança anti-spam entre cada publicação
                if (i < imagens.length - 1) {
                    console.log("⏳ Aguardando 25 segundos antes do próximo post (proteção anti-spam da conta)...");
                    await page.waitForTimeout(25000);
                }

            } catch (err) {
                console.error(`❌ Erro no processamento de ${nomeArquivo}:`, err.message);
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
processarPasta(PASTA_IMAGENS);
