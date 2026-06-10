import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'demo/PCICCS.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'demo/PCICCS.crt')),
};

const PORT = process.env.PORT || 3443;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.wasm': 'application/wasm',
};

// URL 前缀 -> 文件系统目录的映射
const ROOT_MAP = [
    { prefix: '/build/', dir: path.resolve(__dirname, 'build') },
    { prefix: '/', dir: path.resolve(__dirname, 'demo') },
];

const server = https.createServer(options, (req, res) => {
    let url = req.url.split('?')[0]; // 去掉查询参数

    // 找到匹配的根目录
    let rootDir = null;
    let relativePath = url;

    for (const entry of ROOT_MAP) {
        if (url === entry.prefix.replace(/\/$/, '') || url.startsWith(entry.prefix)) {
            rootDir = entry.dir;
            relativePath = url.slice(entry.prefix.length - 1) || '/';
            break;
        }
    }

    if (!rootDir) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
    }

    // 默认指向 index.html
    if (relativePath === '/') {
        relativePath = '/index.html';
    }

    const filePath = path.join(rootDir, relativePath);

    // 防止路径穿越攻击
    if (!filePath.startsWith(rootDir)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Forbidden');
        return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('500 Internal Server Error');
            }
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`HTTPS server is running at:`);
    console.log(`  https://localhost:${PORT}`);
    console.log(`  https://127.0.0.1:${PORT}`);
});
