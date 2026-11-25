import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createSsrModules } from './ssr-modules.mjs'

const brand = new URL('../public/brand/', import.meta.url)
async function embed(name, type) {
  const bytes = await readFile(new URL(name, brand))
  return 'data:' + type + ';base64,' + bytes.toString('base64')
}
const [sans, mono, malayalam, eventLogo, plate, border] = await Promise.all([
  embed('fonts/IBMPlexSans-core.woff2','font/woff2'),
  embed('fonts/IBMPlexMono-Regular-core.woff2','font/woff2'),
  embed('fonts/NotoSansMalayalam-Keralam.woff2','font/woff2'),
  embed('primary.png','image/png'), embed('hero-panel.svg','image/svg+xml'), embed('signature.svg','image/svg+xml'),
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
      header img{width:168px;height:auto}header span{font:500 23px/1.4 Malayalam;color:#5732cb}
      main{height:450px;display:grid;grid-template-columns:1.55fr 1fr;gap:40px;padding:26px 44px;align-items:center}
      .distinction{font:400 22px/1.3 Mono;color:#5732cb;margin:0 0 20px}
      h1{font:700 69px/.99 Plex;letter-spacing:-.045em;margin:0}h1 span{display:block}
      .plate{justify-self:center;height:386px;width:auto}
      .credit{padding:14px 44px;margin:0;border-top:1px solid #dddde0;font:400 16px/1.5 Mono}
      footer{position:absolute;bottom:0;inset-inline:0;height:40px;background:url(${border}) center bottom/100% auto no-repeat}
    </style><header><img alt="" src="${eventLogo}"><span lang="ml">കേരളം</span></header>
    <main><section><p class="distinction"></p><h1><span></span><span></span><span></span></h1></section>
    <img class="plate" src="${plate}" alt=""></main><p class="credit"></p><footer></footer></html>`)
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

