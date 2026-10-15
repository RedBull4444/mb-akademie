// Mini-Server nur zum Testen: /tests/* aus tests/, alles andere aus public/
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.ttf':'font/ttf','.woff2':'font/woff2','.webp':'image/webp'};
http.createServer((req,res)=>{
  let u = decodeURIComponent(req.url.split('?')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = u.startsWith('/tests/') ? path.join(root,u) : path.join(root,'public',u);
  fs.readFile(f,(e,b)=>{ if(e){res.writeHead(404);res.end('nf');return;} res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'}); res.end(b); });
}).listen(8899,()=>console.log('http://localhost:8899'));
