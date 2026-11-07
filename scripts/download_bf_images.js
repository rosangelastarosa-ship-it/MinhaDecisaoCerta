const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.join(__dirname, '..', 'img', 'black-friday');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const images = [
    { name: 'banner-bf-hub.jpg', url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80' },
    { name: 'banner-bf-smart-tvs.jpg', url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=1200&q=80' },
    { name: 'banner-bf-air-fryers.jpg', url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=1200&q=80' },
    { name: 'tv-samsung-crystal-uhd.jpg', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80' },
    { name: 'tv-toshiba-50c350ns.jpg', url: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&q=80' },
    { name: 'tv-aoc-roku-50u7045.jpg', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' },
    { name: 'tv-philco-p50vik.jpg', url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80' },
    { name: 'tv-samsung-miniled-m75h.jpg', url: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600&q=80' },
    { name: 'airfryer-mondial-afn50.jpg', url: 'https://images.unsplash.com/photo-1584622614875-2f90081e56f1?w=600&q=80' },
    { name: 'airfryer-electrolux-eaf30.jpg', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80' },
    { name: 'airfryer-oster-ofrt520.jpg', url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&q=80' },
    { name: 'airfryer-philips-walita-ri9252.jpg', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80' },
    { name: 'airfryer-electrolux-eaf50.jpg', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80' }
];

function downloadImage(item) {
    return new Promise((resolve) => {
        const destPath = path.join(targetDir, item.name);
        function fetchUrl(targetUrl, redirects = 0) {
            if (redirects > 5) {
                console.log('Redirect limit reached for ' + item.name);
                return resolve();
            }
            https.get(targetUrl, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    return fetchUrl(res.headers.location, redirects + 1);
                }
                if (res.statusCode !== 200) {
                    console.log('Skipping ' + item.name + ' - status ' + res.statusCode);
                    return resolve();
                }
                const fileStream = fs.createWriteStream(destPath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log('Saved: ' + item.name);
                    resolve();
                });
            }).on('error', (err) => {
                console.log('Error downloading ' + item.name + ': ' + err.message);
                resolve();
            });
        }
        fetchUrl(item.url);
    });
}

async function run() {
    console.log('Downloading Black Friday assets...');
    for (const item of images) {
        await downloadImage(item);
    }
    console.log('Asset preparation complete.');
}

run();
