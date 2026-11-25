import { copyFile, readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { createSsrModules } from './ssr-modules.mjs'
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

const preview = process.argv.includes('--prototype')
const output = preview ? 'dist-prototype' : 'dist'
const server = await createSsrModules()
try {
  const { renderRoute, routes, origin, escapeHtml, partnerAssets } = await server.ssrLoadModule('/src/server.tsx')
  let template = await readFile(join(output,'index.html'),'utf8')
  for (const match of template.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"]+)"[^>]*>/g)) {
    const css = await readFile(join(output,match[1]),'utf8')
    template = template.replace(match[0],()=>'<style>'+css+'</style>')
  }
  for (const path of [...routes,'/404']) {
    const {html,head} = renderRoute(path, undefined, preview)
    const target = path==='/404' ? join(output,'404.html') : join(output,path,'index.html')
    await mkdir(dirname(target),{recursive:true})
    await writeFile(target,template.replace('<!--event-head-->',()=>head).replace('<!--event-page-->',()=>html))
  }
  for (const url of partnerAssets(preview)) {
    const folder = join(output,'community-logos')
    await mkdir(folder,{recursive:true})
    await copyFile(join('organizer','marks',basename(url)), join(folder,basename(url)))
  }
  await writeFile(join(output,'robots.txt'),preview ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n'+(origin?'Sitemap: '+origin+'/sitemap.xml\n':''))
  if (origin && !preview) await writeFile(join(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(path=>'<url><loc>'+escapeHtml(origin+path)+'</loc></url>').join('')+'</urlset>')
  await precompress(output)
  console.log('Prerendered '+routes.length+' event routes and a 404 page with inline styles and precompressed resources.')
} finally {await server.close()}

