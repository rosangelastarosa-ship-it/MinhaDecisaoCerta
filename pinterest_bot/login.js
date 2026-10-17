const { chromium } = require('playwright');

async function login() {
    console.log("Iniciando navegador...");
    // Cria um diretório local chamado "sessao_pinterest" para guardar os cookies
    const browser = await chromium.launchPersistentContext("sessao_pinterest", {
        headless: false, // Precisa ser false para você ver a tela de login
        viewport: { width: 1280, height: 720 }
    });
    
    const page = await browser.newPage();
    await page.goto("https://br.pinterest.com/login/");
    
    console.log("\n==================================================");
    console.log("Faça o login manualmente no navegador que acabou de abrir.");
    console.log("Quando terminar o login e ver a página inicial do Pinterest, FECHE A JANELA DO NAVEGADOR.");
    console.log("==================================================\n");
    
    // O script ficará pausado até que você feche a página (evento "close")
    await new Promise(resolve => page.on("close", resolve));
    
    console.log("Sessão salva com sucesso! Agora o robô já pode postar sem precisar logar de novo.");
    await browser.close();
}

login().catch(console.error);
