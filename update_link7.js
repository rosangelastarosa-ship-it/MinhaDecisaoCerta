const fs = require('fs');
let content = fs.readFileSync('bolsas.html', 'utf8');

const regex = /(<!-- Bolsa 7 -->[\s\S]*?)href="https:\/\/s\.shopee\.com\.br\/qirT93nDK"/;
content = content.replace(regex, '$1href="https://s.shopee.com.br/1VyYHJzUPU"');

fs.writeFileSync('bolsas.html', content);
console.log('Bolsa 7 link updated!');
