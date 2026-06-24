const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8891;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const WEB_ROOT = path.join(__dirname);

const server = http.createServer((req, res) => {
  let filePath = path.join(WEB_ROOT, req.url === '/' ? 'index.html' : req.url);
  
  console.log(`[${req.method}] ${req.url}`);
  
  // Try to serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Try adding .html if file not found
      fs.readFile(filePath + '.html', (err2, content2) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          console.log('  404 Not Found');
        } else {
          const ext = '.html';
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content2, 'utf-8');
          console.log('  200 OK');
        }
      });
    } else {
      const ext = String(path.extname(filePath)).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
      console.log('  200 OK');
    }
  });
});

server.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop');
});
