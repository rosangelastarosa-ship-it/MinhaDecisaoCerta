const fs = require('fs');
let content = fs.readFileSync('bolsas.html', 'utf8');
content = content.replace(/href="#"/g, 'href="https://s.shopee.com.br/qirT93nDK"');
fs.writeFileSync('bolsas.html', content);
console.log('Links updated!');
