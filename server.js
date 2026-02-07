const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;
const SESSIONS_DIR = path.join(__dirname, 'sessions');
const MASTER_RESPONSES_FILE = path.join(__dirname, 'all_responses.json');

// Ensure sessions directory exists
if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR);
}

// Initialize master responses file if it doesn't exist
if (!fs.existsSync(MASTER_RESPONSES_FILE)) {
    fs.writeFileSync(MASTER_RESPONSES_FILE, JSON.stringify({ responses: [], lastUpdated: new Date().toISOString() }, null, 2));
}

function readJSONSafe(p) {
    try {
        return JSON.parse(fs.readFileSync(p, 'utf-8'));
    } catch (e) {
        return { responses: [], lastUpdated: null };
    }
}

function updateMasterResponses(data) {
    const masterData = readJSONSafe(MASTER_RESPONSES_FILE);
    const existingIndex = masterData.responses.findIndex(r => r.sessionId === data.sessionId);
    if (existingIndex !== -1) {
        masterData.responses[existingIndex] = data;
    } else {
        masterData.responses.push(data);
    }
    masterData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(MASTER_RESPONSES_FILE, JSON.stringify(masterData, null, 2));
}

function isNeutralOnly(responses) {
    // Consider values that are exactly 'Neutral' (case-insensitive) as neutral
    const vals = Object.values(responses || {});
    if (vals.length === 0) return false;
    return vals.every(v => typeof v === 'string' && v.trim().toLowerCase() === 'neutral');
}

const server = http.createServer((req, res) => {
    // POST /submit - receive completed survey and store it server-side
    if (req.url === '/submit') {
        // handle CORS preflight
        if (req.method === 'OPTIONS') {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            res.end();
            return;
        }

        if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (!data.sessionId || !data.timestamp || !data.responses) {
                    res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.end(JSON.stringify({ error: 'Invalid payload' }));
                    return;
                }

                // Reject responses that are neutral for every answer (quality control)
                if (isNeutralOnly(data.responses)) {
                    res.writeHead(422, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.end(JSON.stringify({ error: 'Insufficient quality (neutral-only)' }));
                    return;
                }

                // Save individual session file
                const sessionPath = path.join(SESSIONS_DIR, `${data.sessionId}.json`);
                fs.writeFileSync(sessionPath, JSON.stringify(data, null, 2));

                // Update master responses file
                updateMasterResponses(data);

                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ ok: true }));
                console.log(`✅ Saved response ${data.sessionId.slice(0,6)}  Total: ${readJSONSafe(MASTER_RESPONSES_FILE).responses.length}`);
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ error: 'Server error' }));
                console.error('Server error handling /submit:', err.message);
            }
        });
        return;
        }
    }

    // Do not expose master responses or sessions folder
    if (req.url === '/all_responses.json' || req.url.startsWith('/sessions')) {
        res.writeHead(404);
        res.end('Not found');
        return;
    }

    // Serve static files from this directory
    let file = req.url === '/' ? '/index.html' : req.url;
    // sanitize
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
        const ext = path.extname(filePath);
        let contentType = 'text/html';
        if (ext === '.js') contentType = 'application/javascript';
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.json') contentType = 'application/json';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => console.log(`🌐 Server running on http://localhost:${PORT}`));
