const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/href="styles\.css"/g, 'href="css/style.css"');
    c = c.replace(/href="style\.css"/g, 'href="css/style.css"');
    fs.writeFileSync(f, c);
});
console.log('Fixed CSS links.');
