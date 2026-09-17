const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

function carregarEnv() {
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) return;
    for (const linha of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
        const texto = linha.trim();
        if (!texto || texto.startsWith('#')) continue;
        const separador = texto.indexOf('=');
        if (separador === -1) continue;
        const chave = texto.slice(0, separador).trim();
        const valor = texto.slice(separador + 1).trim().replace(/^["']|["']$/g, '');
        if (chave && process.env[chave] === undefined) {
            process.env[chave] = valor;
        }
    }
}

carregarEnv();

const PORT = 8000;
const API_ORIGIN = (process.env.API_ORIGIN || '').replace(/\/$/, '');
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

    if (!API_ORIGIN) {
        res.writeHead(500, { 'Content-Type': 'application/json', ...corsHeaders() });
        res.end(JSON.stringify({
            message: 'API_ORIGIN não configurada. Copie .env.example para .env e informe a URL da API.'
        }));
        return;
    }

    const target = new URL(req.url.replace(/^\/api/, '') || '/', API_ORIGIN);
    const headers = { ...req.headers, host: target.host };
    delete headers['connection'];
    const cliente = target.protocol === 'http:' ? http : https;

    const proxyReq = cliente.request({
        hostname: target.hostname,
        port: target.port || (target.protocol === 'http:' ? 80 : 443),
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
    const apiInfo = API_ORIGIN ? 'API via /api' : 'defina API_ORIGIN no .env';
    console.log(`Servidor em http://localhost:${PORT} (${apiInfo})`);
});
