const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const API_ORIGIN = 'https://docsemef.onrender.com';
const ROOT = __dirname;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.pdf': 'application/pdf'
};

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };
}

function proxyApi(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders());
        res.end();
        return;
    }

    const target = new URL(req.url.replace(/^\/api/, '') || '/', API_ORIGIN);
    const headers = { ...req.headers, host: target.host };
    delete headers['connection'];

    const proxyReq = https.request({
        hostname: target.hostname,
        port: 443,
        path: target.pathname + target.search,
        method: req.method,
        headers
    }, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, {
            ...proxyRes.headers,
            ...corsHeaders()
        });
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (error) => {
        res.writeHead(502, { 'Content-Type': 'application/json', ...corsHeaders() });
        res.end(JSON.stringify({ message: `Falha ao contatar a API: ${error.message}` }));
    });

    req.pipe(proxyReq);
}

function servirArquivo(req, res) {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);

    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Arquivo não encontrado');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
    });
}

http.createServer((req, res) => {
    if (req.url.startsWith('/api')) {
        proxyApi(req, res);
        return;
    }
    servirArquivo(req, res);
}).listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT} (API via /api)`);
});
