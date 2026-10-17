const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function processarPasta(pastaImagens, titulo, descricao, link) {
    const caminhoPasta = path.resolve(pastaImagens);

    if (!fs.existsSync(caminhoPasta)) {
        console.error(`ERRO: A pasta '${caminhoPasta}' não foi encontrada.`);
        return;
    }

    const arquivos = fs.readdirSync(caminhoPasta);
    // Filtrar apenas arquivos de imagem comuns
    const imagens = arquivos.filter(arq => arq.match(/\.(jpg|jpeg|png|webp|gif)$/i));

    if (imagens.length === 0) {
        console.log(`Nenhuma imagem encontrada na pasta '${pastaImagens}'. Coloque suas fotos lá primeiro!`);
        return;
    }

    console.log(`Encontradas ${imagens.length} imagens. Iniciando navegador...`);

    const browser = await chromium.launchPersistentContext("sessao_pinterest", {
        headless: false,
        channel: 'chrome', // Usa o seu Google Chrome de verdade
        viewport: { width: 1280, height: 720 },
        args: ['--disable-blink-features=AutomationControlled'] // Ajuda a disfarçar o robô
    });

    const page = await browser.newPage();

    try {
        for (let i = 0; i < imagens.length; i++) {
            const nomeArquivo = imagens[i];
            const caminhoAbsoluto = path.join(caminhoPasta, nomeArquivo);
            console.log(`\n[${i + 1}/${imagens.length}] Postando imagem: ${nomeArquivo}`);

            try {
                // Tenta fazer o login automático se necessário
                await page.goto("https://br.pinterest.com/login/");
                const emailInput = page.locator('#email');
                if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
                    console.log("Realizando login automático...");
                    await emailInput.fill("rosangelastarosa@hotmail.com");
                    await page.locator('#password').fill("#gABRIEL1974]");
                    await page.locator('button[type="submit"]').click();
                    await page.waitForTimeout(5000); // Aguarda o login processar
                }

                await page.goto("https://br.pinterest.com/pin-builder/");
                const fileInputSelector = 'input[type="file"], input[aria-label="Upload de arquivo"], input[id^="media-upload-input-"]';
                await page.waitForSelector(fileInputSelector, { state: 'attached', timeout: 15000 });

                const fileInput = await page.$(fileInputSelector);
                await fileInput.setInputFiles(caminhoAbsoluto);

                await page.waitForTimeout(4000); // Aguarda imagem carregar visualmente

                // Preencher Título
                const tituloInput = await page.locator('textarea[placeholder*="título"], input[placeholder*="título"]').first();
                if (await tituloInput.isVisible()) {
                    await tituloInput.fill(titulo);
                }

                // Preencher Descrição
                const descInput = await page.locator('div[data-test-id="pin-description-editor"], textarea[placeholder*="sobre o que é o seu Pin"]').first();
                if (await descInput.isVisible()) {
                    await descInput.click();
                    await page.keyboard.type(descricao);
                }

                // Preencher Link
                const linkInput = await page.locator('textarea[placeholder*="link de destino"], input[placeholder*="link de destino"]').first();
                if (await linkInput.isVisible()) {
                    await linkInput.fill(link);
                }

                console.log("Clicando em Salvar (Publicar)...");
                // O botão de salvar
                const btnSalvar = await page.locator('button[data-test-id="board-dropdown-save-button"]').first();
                if (await btnSalvar.isVisible()) {
                    await btnSalvar.click();
                    console.log("Aguardando 10s para a publicação terminar...");
                    await page.waitForTimeout(10000);
                    console.log("✅ Publicado com sucesso!");
                } else {
                    console.log("❌ Botão de salvar não encontrado. Pulando esta imagem...");
                }

                // Pausa entre os posts para o Pinterest não achar que é spam e te bloquear (espera 25 segundos)
                if (i < imagens.length - 1) {
                    console.log("Aguardando 25 segundos antes do próximo post para evitar bloqueio por spam...");
                    await page.waitForTimeout(25000);
                }

            } catch (err) {
                console.error(`❌ Erro ao postar a imagem ${nomeArquivo}:`, err.message);
                await page.screenshot({ path: 'erro.png', fullPage: true });
            }
        }
        console.log("\n🎉 Todas as imagens da pasta foram processadas!");
    } catch (error) {
        console.error("Erro fatal no navegador:", error.message);
    } finally {
        await browser.close();
    }
}

// ==========================================================
// CONFIGURAÇÕES
// ==========================================================
// Você colocará todas as suas fotos dentro desta pasta:
const PASTA_IMAGENS = "minhas_fotos";

// Estes dados serão aplicados para TODAS as fotos da pasta:
const TITULO = "Jesus te ama";
const DESCRICAO = "Mensagem de fé e esperança.";
const LINK = "https://youtube.com/shorts/k36ipxQtAow";

// Criar a pasta automaticamente se não existir
if (!fs.existsSync(PASTA_IMAGENS)) {
    fs.mkdirSync(PASTA_IMAGENS);
    console.log(`\n=> Criei uma pasta chamada '${PASTA_IMAGENS}' para você!`);
    console.log(`=> Por favor, arraste todas as suas imagens para dentro dela e depois rode este script de novo.\n`);
} else {
    processarPasta(PASTA_IMAGENS, TITULO, DESCRICAO, LINK);
}
