import http from 'node:http'
import {readFile,stat} from 'node:fs/promises'
import {resolve,extname,sep} from 'node:path'
const root=resolve('dist')
const port=Number(process.env.PORT || 4173)
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.jpg':'image/jpeg','.webp':'image/webp'}
const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'"}
await stat(resolve(root,'index.html'))
http.createServer(async (req,res)=>{
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{...headers,Allow:'GET, HEAD'}).end();return}
  let pathname
  try {pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)} catch {res.writeHead(400,headers).end();return}
  let file=resolve(root,'.'+pathname)
  if (pathname.includes('\\') || pathname.includes('\0') || !(file===root || file.startsWith(root+sep))) {res.writeHead(400,headers).end();return}
  let status=200
  try {if ((await stat(file)).isDirectory()) file=resolve(file,'index.html');await stat(file)}
  catch {status=404;file=resolve(root,'404.html')}
  try {
    const accepted = new Set((req.headers['accept-encoding'] || '').split(',').map(s=>s.trim()).filter(s=>!/(?:^|;)\s*q=0(?:\.0*)?(?:;|$)/i.test(s)).map(s=>s.split(';')[0].trim()))
    let encoding, body
    for (const [name,suffix] of [['br','.br'],['gzip','.gz']]) {
      if (!accepted.has(name)) continue
      try {body = await readFile(file+suffix);encoding = name;break} catch(error) {if(error.code!=='ENOENT') throw error}
    }
    body ??= await readFile(file)
    res.writeHead(status,{...headers,'Content-Type':types[extname(file)] || 'application/octet-stream','Content-Length':body.length,Vary:'Accept-Encoding',...(encoding?{'Content-Encoding':encoding}:{}),'Cache-Control':status===404?'no-store':pathname.startsWith('/assets/')?'public, max-age=31536000, immutable':file.endsWith('.html')?'no-cache':'public, max-age=3600'}).end(req.method==='HEAD'?undefined:body)
  } catch {res.writeHead(500,headers).end()}
}).listen(port,process.env.HOST || '127.0.0.1',()=>console.log('Event site: http://127.0.0.1:'+port))

