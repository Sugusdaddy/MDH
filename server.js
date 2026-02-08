const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const CANVAS_SIZE = 100;
const DATA_FILE = path.join(__dirname, 'canvas-data.json');

// Initialize or load canvas data
let canvasData = {
    pixels: new Array(CANVAS_SIZE * CANVAS_SIZE).fill('#0a0a0f'),
    history: [],
    stats: {
        pixelsPainted: 0,
        tokensBurned: 0,
        uniqueWallets: []
    }
};

// Load existing data
if (fs.existsSync(DATA_FILE)) {
    try {
        canvasData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        console.log('Loaded existing canvas data');
    } catch (err) {
        console.error('Failed to load canvas data:', err);
    }
}

// Save data periodically
function saveData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(canvasData, null, 2));
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API endpoints
    if (req.url === '/api/canvas' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(canvasData));
        return;
    }

    if (req.url === '/api/pixel' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { x, y, color, wallet, txSignature } = JSON.parse(body);
                
                // Validate
                if (x < 0 || x >= CANVAS_SIZE || y < 0 || y >= CANVAS_SIZE) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid coordinates' }));
                    return;
                }

                // Update canvas
                const index = y * CANVAS_SIZE + x;
                canvasData.pixels[index] = color;
                
                // Record history
                canvasData.history.push({
                    x, y, color, wallet, txSignature,
                    timestamp: Date.now()
                });

                // Keep last 1000 entries
                if (canvasData.history.length > 1000) {
                    canvasData.history = canvasData.history.slice(-1000);
                }

                // Update stats
                canvasData.stats.pixelsPainted++;
                canvasData.stats.tokensBurned = canvasData.stats.pixelsPainted * 10000;
                if (!canvasData.stats.uniqueWallets.includes(wallet)) {
                    canvasData.stats.uniqueWallets.push(wallet);
                }

                saveData();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));

            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
        return;
    }

    // Serve static files
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, 'public', filePath);

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('Not Found');
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`
  MDH — Million Dollar Homepage
  ─────────────────────────────
  http://localhost:${PORT}
  
  Canvas: ${CANVAS_SIZE}×${CANVAS_SIZE}
  Cost: 10,000 $GUARDIAN / pixel
    `);
});
