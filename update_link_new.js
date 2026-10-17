const fs = require('fs');
let content = fs.readFileSync('bolsas.html', 'utf8');

// Replace Bolsa 2 link
const regex2 = /(<!-- Bolsa 2 -->[\s\S]*?)href="https:\/\/s\.shopee\.com\.br\/qirTI09rh"/;
content = content.replace(regex2, '$1href="https://s.shopee.com.br/1VyYGpu4tp"');

// Put the unknown link (qirTI09rh) into Bolsa 3 since we probably skipped it
const regex3 = /(<!-- Bolsa 3 -->[\s\S]*?)href="https:\/\/s\.shopee\.com\.br\/qirT93nDK"/;
content = content.replace(regex3, '$1href="https://s.shopee.com.br/qirTI09rh"');

fs.writeFileSync('bolsas.html', content);
console.log('Bolsa 2 and 3 links updated!');
