const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    if (!c.includes('js/main.js')) {
        c = c.replace('</body>', '<script src="js/main.js"></script>\n</body>');
        fs.writeFileSync(f, c);
    }
});
console.log('Added main.js to all HTML files.');
