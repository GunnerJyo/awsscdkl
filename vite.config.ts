import { defineConfig } from 'vite'
import { readFile } from 'node:fs/promises'
export default defineConfig({
  esbuild:{jsx:'automatic'},
  plugins:[{
    name:'event-dev-pages',
    configureServer(server) {
      server.middlewares.use(async (req,res,next)=>{
        const url = new URL(req.url || '/', 'http://localhost')
        if (!req.headers.accept?.includes('text/html') || url.pathname.includes('.') || url.pathname.startsWith('/@')) return next()
        try {
          const template = await server.transformIndexHtml(url.pathname,await readFile('index.html','utf8'))
          const {renderRoute} = await server.ssrLoadModule('/src/server.tsx')
          const {html,head,status} = renderRoute(url.pathname.replace(/\/+$/, '') || '/')
          res.writeHead(status,{'Content-Type':'text/html; charset=utf-8'})
          res.end(template.replace('<!--event-head-->',()=>head).replace('<!--event-page-->',()=>html))
        } catch(error) {next(error)}
      })
    }
  }]
})

