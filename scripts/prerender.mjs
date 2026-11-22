import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { createServer } from 'vite'
import { brotliCompressSync, gzipSync, constants } from 'node:zlib'

async function precompress(directory) {
  for (const file of await readdir(directory,{withFileTypes:true})) {
    const path=join(directory,file.name)
    if (file.isDirectory()) await precompress(path)
    else if (/\.(html|css|js|svg|xml|txt)$/.test(path)) {
      const bytes=await readFile(path)
      if (bytes.length<1024) continue
      await Promise.all([
        writeFile(path+'.br',brotliCompressSync(bytes,{params:{[constants.BROTLI_PARAM_QUALITY]:9}})),
        writeFile(path+'.gz',gzipSync(bytes,{level:9}))
      ])
    }
  }
}

const server = await createServer({ configFile:false, appType:'custom', optimizeDeps:{noDiscovery:true}, server:{middlewareMode:true,hmr:false}, esbuild:{jsx:'automatic'} })
try {
  const { renderRoute, routes, origin, escapeHtml } = await server.ssrLoadModule('/src/server.tsx')
  let template = await readFile('dist/index.html','utf8')
  for (const match of template.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"]+)"[^>]*>/g)) {
    const css = await readFile(join('dist',match[1]),'utf8')
    template = template.replace(match[0],()=>'<style>'+css+'</style>')
  }
  for (const path of [...routes,'/404']) {
    const {html,head} = renderRoute(path)
    const target = path==='/404' ? 'dist/404.html' : join('dist',path,'index.html')
    await mkdir(dirname(target),{recursive:true})
    await writeFile(target,template.replace('<!--event-head-->',()=>head).replace('<!--event-page-->',()=>html))
  }
  await writeFile('dist/robots.txt','User-agent: *\nAllow: /\n'+(origin?'Sitemap: '+origin+'/sitemap.xml\n':''))
  if (origin) await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(path=>'<url><loc>'+escapeHtml(origin+path)+'</loc></url>').join('')+'</urlset>')
  await precompress('dist')
  console.log('Prerendered '+routes.length+' event routes and a 404 page with inline styles and precompressed resources.')
} finally {await server.close()}

