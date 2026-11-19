// Dev only: exposes a locally running Supabase Auth (GoTrue) server at the path supabase-js
// expects (http://localhost:54321/auth/v1/...). See scripts/local-auth/README.md.
import http from 'node:http';

const TARGET = process.env.GOTRUE_URL ?? 'http://127.0.0.1:9999';

const cors = (req) => ({
  'access-control-allow-origin': req.headers.origin ?? '*',
  'access-control-allow-credentials': 'true',
  'access-control-allow-headers': req.headers['access-control-request-headers'] ?? '*',
  'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
});

http
  .createServer((req, res) => {
    if (!req.url?.startsWith('/auth/v1')) return res.writeHead(404).end();
    if (req.method === 'OPTIONS') return res.writeHead(204, cors(req)).end();
    const url = new URL(req.url.replace(/^\/auth\/v1/, '') || '/', TARGET);
    const upstream = http.request(url, { method: req.method, headers: { ...req.headers, host: url.host } }, (r) => {
      res.writeHead(r.statusCode ?? 502, { ...r.headers, ...cors(req) });
      r.pipe(res);
    });
    upstream.on('error', () => {
      if (!res.headersSent) res.writeHead(502, cors(req));
      res.end();
    });
    req.pipe(upstream);
  })
  .listen(54321, () => console.log('Local Supabase Auth at http://localhost:54321/auth/v1'));
