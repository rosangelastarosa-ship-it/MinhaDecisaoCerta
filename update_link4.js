const fs = require('fs');
let content = fs.readFileSync('bolsas.html', 'utf8');

const regex = /(<!-- Bolsa 4 -->[\s\S]*?)href="https:\/\/s\.shopee\.com\.br\/qirT93nDK"/;
content = content.replace(regex, '$1href="https://s.shopee.com.br/9zx6OIs1Gd"');

fs.writeFileSync('bolsas.html', content);
console.log('Bolsa 4 link updated!');
