const fs = require('fs');
const path = require('path');

const directory = __dirname;
const files = fs.readdirSync(directory);
const htmlFiles = files.filter(f => f.endsWith('.html'));

let brokenLinksFound = false;

console.log("🔍 Procurando links quebrados internos (páginas, imagens, CSS, etc)...\n");

htmlFiles.forEach(file => {
    const filePath = path.join(directory, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Captura atributos href e src
    const regex = /(?:href|src)=["']([^"']+)["']/g;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        let link = match[1];
        
        // Ignora links externos e âncoras locais, base64 etc.
        if (link.startsWith('http') || link.startsWith('//') || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('data:')) {
            continue;
        }
        
        // Remove hash e query parameters para verificar o arquivo em si
        link = link.split('#')[0].split('?')[0];
        
        if (link === '') continue;

        // Trata caminhos absolutos e relativos
        let targetPath;
        if (link.startsWith('/')) {
            targetPath = path.join(directory, link.substring(1));
        } else {
            targetPath = path.join(directory, link);
        }
        
        if (!fs.existsSync(targetPath)) {
            console.log(`[!] Link quebrado em: ${file}`);
            console.log(`    -> Aponta para: ${match[1]}`);
            brokenLinksFound = true;
        }
    }
});

console.log("");
if (!brokenLinksFound) {
    console.log("✅ Nenhum link interno quebrado foi encontrado nas suas páginas!");
    console.log("Isso significa que os erros 404 no Google Search Console são referentes a páginas antigas que você provavelmente já apagou. Com o tempo o Google irá esquecê-las.");
} else {
    console.log("❌ Corrija os links acima nos seus arquivos HTML para evitar erros 404!");
}
