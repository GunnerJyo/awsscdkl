import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'
const dir=new URL('../public/brand/',import.meta.url)
const data=async(name,type)=>'data:'+type+';base64,'+(await readFile(new URL(name,dir))).toString('base64')
const browser=await chromium.launch({...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})})
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1})
 const font=await data('fonts/IBMPlexSans.woff2','font/woff2')
 const mono=await data('fonts/IBMPlexMono-Medium.woff2','font/woff2')
 const panel=await data('hero-panel.svg','image/svg+xml')
 const strip=await data('signature.svg','image/svg+xml')
 await page.setContent(`<style>
 @font-face{font-family:Plex;src:url(${font});font-weight:100 700}@font-face{font-family:Mono;src:url(${mono})}*{box-sizing:border-box}body{width:1200px;height:630px;margin:0;color:#15192D;background:white;font-family:Plex}
 header{margin:0 48px;padding:30px 0 20px;border-bottom:1px solid #DCE1EB;font:500 18px Mono;color:#5732CB}main{display:flex;align-items:center;justify-content:space-between;padding:28px 48px}h1{font:700 79px/.98 Plex;letter-spacing:-3px;margin:0}p{font-size:25px;margin:22px 0 0}.panel{width:406px;height:406px;object-fit:contain}.strip{position:absolute;bottom:0;width:1200px}
 </style><header>STUDENT BUILDER CONFERENCE</header><main><section><h1>AWS Student<br>Community Day<br>Keralam 2027</h1><p>Keralam's First AWS Student Community Day</p></section><img class="panel" src="${panel}" /></main><img class="strip" src="${strip}" />`)
 await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(i=>i.decode()))})
 await page.screenshot({path:new URL('social-preview.png',dir).pathname.replace(/^\/(\w:)/,'$1')})
}finally{await browser.close()}

