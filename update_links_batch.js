const fs = require('fs');
let content = fs.readFileSync('bolsas.html', 'utf8');

// Replace Bolsa 6 with the correct link from the screenshot
const regex6 = /(<!-- Bolsa 6 -->[\s\S]*?)href="https:\/\/s\.shopee\.com\.br\/112HgK3LMo"/;
content = content.replace(regex6, '$1href="https://s.shopee.com.br/50YQRsRKnh"');

// Put the previous unknown link 1 into Bolsa 8
const regex8 = /(<!-- Bolsa 8 -->[\s\S]*?)href="https:\/\/s\.shopee\.com\.br\/qirT93nDK"/;
content = content.replace(regex8, '$1href="https://s.shopee.com.br/112HgK3LMo"');

// Put the previous unknown link 2 into Bolsa 10 (Wait, Bolsa 7 had it, let's keep it in 7 or move it)
// I put link 7 (1VyYHJzUPU) into Bolsa 7 earlier. Let's leave Bolsa 7 as is.

fs.writeFileSync('bolsas.html', content);
console.log('Bolsa 6 and 8 links updated!');
