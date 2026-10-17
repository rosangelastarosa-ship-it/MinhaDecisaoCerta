const fs = require('fs');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix navigation links to point to the correct HTML files
    content = content.replace(/href="https:\/\/minhadecisaocerta\.com\.br\/notebooks"/g, 'href="index.html"');
    content = content.replace(/href="https:\/\/minhadecisaocerta\.com\.br\/geladeiras"/g, 'href="geladeiras.html"');
    content = content.replace(/href="https:\/\/minhadecisaocerta\.com\.br\/air-fryers"/g, 'href="airfryers.html"');
    content = content.replace(/href="https:\/\/minhadecisaocerta\.com\.br\/bicicletas"/g, 'href="bicicletas.html"');
    content = content.replace(/href="https:\/\/minhadecisaocerta\.com\.br\/maquinas"/g, 'href="maquinas-de-lavar.html"');
    content = content.replace(/href="https:\/\/minhadecisaocerta\.com\.br\/celulares"/g, 'href="celulares.html"');
    content = content.replace(/href="https:\/\/minhadecisaocerta\.com\.br\/tvs"/g, 'href="tvs.html"');
    
    // Remove dead script.js
    content = content.replace(/<script src="script\.js"><\/script>/g, '');
    
    fs.writeFileSync(file, content);
});
console.log('Links arrumados!');
