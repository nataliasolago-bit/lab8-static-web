const http = require('http'), fs = require('fs');
http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    const p = http.request({ host: 'localhost', port: 7071, path: req.url, method: req.method }, r => {
      res.writeHead(r.statusCode, r.headers);
      r.pipe(res);
    });
    p.on('error', () => { res.writeHead(502); res.end('API no disponible'); });
    req.pipe(p);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync('index.html'));
  }
}).listen(4280, () => console.log('Sitio en puerto 4280'));
