const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;
const RESPONSES_FILE = path.join(__dirname, 'responses_data.json');

// Initialize responses file if it doesn't exist
if (!fs.existsSync(RESPONSES_FILE)) {
    fs.writeFileSync(RESPONSES_FILE, JSON.stringify({ responses: [], lastUpdated: new Date().toISOString() }, null, 2));
}

function readResponses() {
    try {
        return JSON.parse(fs.readFileSync(RESPONSES_FILE, 'utf-8'));
    } catch (e) {
        return { responses: [], lastUpdated: null };
    }
}

function saveResponse(data) {
    try {
        const current = readResponses();
        const existingIndex = current.responses.findIndex(r => r.sessionId === data.sessionId);
        if (existingIndex !== -1) {
            current.responses[existingIndex] = data;
        } else {
            current.responses.push(data);
        }
        current.lastUpdated = new Date().toISOString();
        fs.writeFileSync(RESPONSES_FILE, JSON.stringify(current, null, 2));
        return true;
    } catch (err) {
        console.error('Error saving response:', err.message);
        return false;
    }
}

function isNeutralOnly(responses) {
    const values = Object.values(responses || {});
    if (values.length === 0) return false;
    return values.every(v => {
        const str = String(v).toLowerCase().trim();
        return str === 'neutral' || str === 'none' || str === '';
    });
}

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle form submission
    if (req.method === 'POST' && req.url === '/submit') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { sessionId, timestamp, responses } = data;

                if (!sessionId || !timestamp || !responses) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Missing required fields' }));
                    return;
                }

                // Validate: reject all-neutral responses
                if (isNeutralOnly(responses)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        error: 'Please answer with more than just "Neutral" responses'
                    }));
                    console.log(`⚠️  Rejected neutral-only response from: ${sessionId.slice(0, 6)}...`);
                    return;
                }

                // Save response
                const success = saveResponse(data);

                if (success) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        sessionId,
                        message: 'Response saved successfully'
                    }));
                    const count = readResponses().responses.length;
                    console.log(`✅ Saved response from session: ${sessionId.slice(0, 6)}... (Total: ${count})`);
                } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to save response' }));
                }
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Server error' }));
                console.error('Error processing submission:', err.message);
            }
        });
        return;
    }

    // API endpoint: get all responses
    if (req.method === 'GET' && req.url === '/api/responses') {
        const data = readResponses();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return;
    }

    // Block direct access to data file
    if (req.url === '/responses_data.json') {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    // Serve static files
    let file = req.url === '/' ? '/index.html' : req.url;
    file = decodeURIComponent(file.split('?')[0]);
    const filePath = path.join(__dirname, file);

    // Prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }

        // Determine content type
        const ext = path.extname(filePath);
        let contentType = 'text/html';
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.js') contentType = 'application/javascript';
        if (ext === '.json') contentType = 'application/json';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║       Survey Backend Server (JSON)         ║
╠════════════════════════════════════════════╣
║ 🚀 Server running on http://localhost:${PORT}  ║
║ 📊 Data file: responses_data.json          ║
║ 🌐 API: http://localhost:${PORT}/api/responses │
║ 📝 Submit: POST http://localhost:${PORT}/submit ║
╚════════════════════════════════════════════╝
    `);
});

process.on('SIGINT', () => {
    console.log('\n📴 Shutting down gracefully...');
    process.exit(0);
});
