import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createSsrModules } from './ssr-modules.mjs'

const brand = new URL('../public/brand/', import.meta.url)
async function embed(name, type) {
  const bytes = await readFile(new URL(name, brand))
  return 'data:' + type + ';base64,' + bytes.toString('base64')
}
const [sans, mono, malayalam, eventLogo, border] = await Promise.all([
  embed('fonts/IBMPlexSans-core.woff2','font/woff2'),
  embed('fonts/IBMPlexMono-Regular-core.woff2','font/woff2'),
  embed('fonts/NotoSansMalayalam-Keralam.woff2','font/woff2'),
  embed('conference-logo.png','image/png'),
  embed('signature.svg','image/svg+xml'),
])
const modules = await createSsrModules()
try {
  const { event, organizingGroup } = await modules.ssrLoadModule('/src/content.ts')
  const browser = await chromium.launch(process.env.BROWSER_PATH ? {executablePath:process.env.BROWSER_PATH} : {channel:'chrome'})
  try {
    const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1})
    await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><style>
      @font-face{font-family:Plex;src:url(${sans});font-weight:100 700}
      @font-face{font-family:Mono;src:url(${mono});font-weight:400}
      @font-face{font-family:Malayalam;src:url(${malayalam});font-weight:500}
      *{box-sizing:border-box}body{width:1200px;height:630px;margin:0;background:white;color:#080808;font:400 20px/1.5 Plex;position:relative}
      header{display:flex;align-items:center;justify-content:space-between;height:80px;padding:0 44px;border-bottom:1px solid #dddde0}
      header span{font:500 23px/1.4 Malayalam;color:#5732cb}
      .distinction{font:400 19px/1.4 Mono;color:#5732cb;margin:0}
      main{height:450px;display:grid;grid-template-columns:minmax(0,1fr) 400px;gap:40px;padding:22px 44px;align-items:center}
      h1{font:700 83px/1.01 Plex;letter-spacing:-.045em;margin:0}h1 span{display:block}
      .logo-plate{margin:0;position:relative;display:grid;place-items:center;width:400px;height:400px;border:1px solid #dddde0}
      .logo-plate::before,.logo-plate::after{content:"";position:absolute;width:14px;height:14px;background:#dbd2ff}
      .logo-plate::before{top:-1px;left:-1px}.logo-plate::after{bottom:-1px;right:-1px}
      .event-logo{display:block;width:352px;height:352px;object-fit:contain}
      .credit{padding:14px 44px;margin:0;border-top:1px solid #dddde0;font:400 16px/1.5 Mono}
      footer{position:absolute;bottom:0;inset-inline:0;height:40px;background:url(${border}) center bottom/100% auto no-repeat}
    </style><header><p class="distinction"></p><span lang="ml">കേരളം</span></header>
    <main><h1><span></span><span></span><span></span></h1>
    <figure class="logo-plate"><img class="event-logo" src="${eventLogo}" alt=""></figure></main>
    <p class="credit"></p><footer></footer></html>`)
    await page.evaluate(async ({title,distinction,organizer}) => {
      const words=title.split(' ')
      const lines=[words.slice(0,2),words.slice(2,4),words.slice(4)]
      document.querySelectorAll('h1 > span').forEach((node,i) => {node.textContent=lines[i].join(' ')})
      document.querySelector('.distinction').textContent=distinction
      document.querySelector('.credit').textContent='Organized by ' + organizer
      await document.fonts.ready
      await Promise.all([...document.images].map(image=>image.decode()))
    },{title:event.title,distinction:event.distinction,organizer:organizingGroup.name})
    await page.screenshot({path:fileURLToPath(new URL('social-preview.png',brand))})
  } finally {await browser.close()}
} finally {await modules.close()}

