const fs = require('fs');
const path = require('path');
const https = require('https');

const tvImages = [
    { name: 'lg_43_4k.png', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&q=80' },
    { name: 'lg_oled_c5.png', url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&q=80' },
    { name: 'samsung_oled_s85.png', url: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500&q=80' },
    { name: 'tcl_55_qled.png', url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&q=80' },
    { name: 'samsung_the_frame.png', url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80' },
    { name: 'philips_ambilight_65.png', url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&q=80' },
    { name: 'samsung_43_fhd.png', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80' },
    { name: 'hisense_43_ai.png', url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&q=80' },
    { name: 'samsung_q60d.png', url: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500&q=80' }
];

function downloadImage(item) {
    return new Promise((resolve, reject) => {
        const destPath = path.join(__dirname, '..', 'img', item.name);
        
        function fetchUrl(targetUrl, redirects = 0) {
            if (redirects > 5) return reject(new Error('Too many redirects'));
            https.get(targetUrl, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    return fetchUrl(res.headers.location, redirects + 1);
                }
                if (res.statusCode !== 200) {
                    return reject(new Error(`Failed to download ${item.name}: Status ${res.statusCode}`));
                }
                const fileStream = fs.createWriteStream(destPath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Saved: ${item.name}`);
                    resolve();
                });
            }).on('error', reject);
        }
        
        fetchUrl(item.url);
    });
}

async function run() {
    console.log('Downloading TV images...');
    for (const item of tvImages) {
        try {
            await downloadImage(item);
        } catch (err) {
            console.error(`Error downloading ${item.name}:`, err.message);
        }
    }
    console.log('Finished downloading all TV images.');
}

run();
