import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { readFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  esbuild:{jsx:'automatic'},
  resolve:{alias:{'@':fileURLToPath(new URL('./src', import.meta.url))}},
  plugins:[tailwindcss(),{
    name:'event-dev-pages',
    configureServer(server) {
      server.middlewares.use(async (req,res,next)=>{
        const url = new URL(req.url || '/', 'http://localhost')
        const localPreview = ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(req.socket.remoteAddress ?? '')
        try {
          if (url.pathname.startsWith('/community-logos/')) {
            const { partnerAssets } = await server.ssrLoadModule('/src/server.tsx')
            if (!partnerAssets(localPreview).has(url.pathname)) {
              res.writeHead(404).end()
              return
            }
            const file = basename(url.pathname)
            const data = await readFile(join('organizer','marks',file))
            const mime = {'.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'}[extname(file)]
            res.writeHead(200,{'Content-Type':mime ?? 'application/octet-stream','Cache-Control':'no-store'}).end(data)
            return
          }
          if (!req.headers.accept?.includes('text/html') || url.pathname.includes('.') || url.pathname.startsWith('/@')) return next()
          const template = await server.transformIndexHtml(url.pathname,await readFile('index.html','utf8'))
          const {renderRoute} = await server.ssrLoadModule('/src/server.tsx')
          const {html,head,status} = renderRoute(url.pathname.replace(/\/+$/,'') || '/', undefined, localPreview)
          res.writeHead(status,{'Content-Type':'text/html; charset=utf-8'})
          res.end(template.replace('<!--event-head-->',()=>head).replace('<!--event-page-->',()=>html))
        } catch(error) {next(error)}
      })
    }
  }]
})

