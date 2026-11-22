import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const base = process.env.TEST_URL || 'http://127.0.0.1:4173'
const title = 'AWS Student Community Day Keralam 2027'
const widths = [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920]
const routes = ['/', '/about', '/speakers', '/agenda', '/partners', '/venue', '/faq', '/code-of-conduct', '/privacy']
const screenshots = process.env.UPDATE_SCREENSHOTS === '1'
const captureDir = resolve(process.env.CAPTURE_DIR || 'docs/screenshots')
const axePath = process.env.AXE_SCRIPT
const executablePath = process.env.BROWSER_PATH || (process.platform === 'win32' && existsSync('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe') ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' : undefined)
const browser = await chromium.launch({ executablePath, headless: true, args: ['--disable-background-networking'] })
const context = await browser.newContext({ reducedMotion: 'reduce' })
const page = await context.newPage()
const errors = []
const audit = { views: 0, accessibility: [], localLinks: [], screenshots: [] }
page.on('pageerror', error => errors.push(String(error)))
if (screenshots) await mkdir(captureDir, { recursive: true })

async function go(url) {
  const response = await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  // Same-document fragment navigation does not create an HTTP response.
  return response?.status()
}
async function shot(name, fullPage = false) {
  if (!screenshots) return
  await page.screenshot({ path: resolve(captureDir, name + '.png'), fullPage, animations: 'disabled' })
  audit.screenshots.push(name)
}
async function checkAccessibility(route, width) {
  if (!axePath) return
  await page.evaluate(await readFile(axePath, 'utf8'))
  const result = await page.evaluate(() => window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    resultTypes: ['violations']
  }))
  audit.accessibility.push({route, width, violations: result.violations.map(v => ({ rule:v.id, impact:v.impact, targets:v.nodes.map(n => n.target) }))})
}
async function checkRoutes() {
  const links = new Set()
  const titles = new Set()
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : width < 1000 ? 1024 : 900 })
    for (const route of routes) {
      assert.equal(await go(base + route), 200, route)
      const state = await page.evaluate(() => ({
        pageWidth: document.documentElement.scrollWidth,
        h1: document.querySelectorAll('h1').length,
        title: document.title,
        description: document.querySelector('meta[name=description]')?.content,
        links: [...document.querySelectorAll('a[href]')].map(a => a.href),
        missingAlt: document.querySelectorAll('img:not([alt])').length,
        broken: [...document.images].filter(i => i.complete && i.currentSrc && !i.naturalWidth).map(i => i.src)
      }))
      assert.ok(state.pageWidth <= width, route + ' overflows at ' + width + ' by ' + (state.pageWidth-width))
      assert.equal(state.h1, 1, route)
      assert.ok(state.title.includes(title) && state.description, route + ' metadata')
      titles.add(state.title)
      assert.deepEqual(state.broken, [], route)
      assert.equal(state.missingAlt, 0, route)
      assert.ok(await page.locator('footer').getByText('© 2026, Amazon Web Services, Inc. or its affiliates. All rights reserved.',{exact:true}).isVisible(),route+' copyright')
      assert.ok(await page.locator('footer a[href="/code-of-conduct"]').isVisible(),route+' footer conduct link')
      assert.ok(await page.locator('footer a[href]').count() <= 4,route+' footer link count')
      assert.ok(await page.locator('header .menu-trigger').isVisible(),route+' main menu trigger')
      assert.ok(await page.locator('header .aws-mark').isVisible(),route+' AWS mark')
      for (const link of state.links) if (new URL(link).origin === new URL(base).origin) links.add(link)
      if (route === '/') await shot('home-' + width)
      if (width === 1440 && route === '/') await shot('home-full', true)
      if (width === 390 && route === '/') await shot('home-full-mobile', true)
      if (width === 390 && route === '/faq') await shot('faq-mobile', true)
      if (width === 1440 && route === '/about') await shot('about-desktop', true)
      if (width === 390 || width === 1440) await checkAccessibility(route, width)
      audit.views++
    }
  }
  assert.equal(titles.size,routes.length,'Each tested route needs its own title')
  for (const link of links) {
    const target = new URL(link)
    if (target.hash) {
      await go(link)
      assert.ok(await page.locator('[id]').evaluateAll((nodes, id) => nodes.some(n => n.id === id), decodeURIComponent(target.hash.slice(1))), 'Missing anchor ' + link)
    } else {
      assert.equal((await context.request.get(link)).status(),200,link)
    }
    audit.localLinks.push(target.pathname + target.hash)
  }
  assert.equal(await go(base + '/unlisted-qa-route'), 404)
}
async function checkInteractions() {
  await page.setViewportSize({ width: 390, height: 844 })
  await go(base + '/')
  await page.keyboard.press('Tab')
  assert.equal(await page.locator(':focus').getAttribute('href'),'#main-content')
  assert.ok(await page.locator(':focus').evaluate(n => n.getBoundingClientRect().top >= 0 && getComputedStyle(n).outlineStyle !== 'none'), 'Skip link must have visible keyboard focus')
  await page.keyboard.press('Enter')
  assert.equal(await page.locator(':focus').getAttribute('id'),'main-content')
  const menu = page.getByRole('button', {name:/menu/i})
  await menu.focus()
  await page.keyboard.press('Enter')
  assert.equal(await menu.getAttribute('aria-expanded'),'true')
  assert.ok(await page.locator('#site-menu a[href="/code-of-conduct"]').isVisible(),'Menu conduct link')
  await page.waitForFunction(()=>document.activeElement===document.querySelector('#site-menu a[href]'))
  await checkAccessibility('/ (open menu)',390)
  await page.keyboard.press('Tab')
  assert.ok(await page.locator('#site-menu :focus').count())
  await page.keyboard.press('Escape')
  assert.equal(await menu.getAttribute('aria-expanded'),'false')
  assert.ok(await menu.evaluate(b => b === document.activeElement))
  await menu.click()
  await page.locator('#site-menu').getByRole('link', {name:'Agenda',exact:true}).click()
  await page.getByRole('heading', {name:'Agenda',exact:true}).waitFor()
  await go(base + '/#tracks')
  for (const track of await page.locator('#tracks details').all()) {
    await track.locator('summary').click()
    assert.ok(await track.evaluate(element => element.open))
    await track.locator('summary').click()
  }
  await go(base + '/faq')
  const summary = page.locator('summary').first()
  await summary.focus()
  await page.keyboard.press('Enter')
  assert.ok(await summary.evaluate(n => n.closest('details').open))
  await page.keyboard.press('Space')
  assert.equal(await summary.evaluate(n => n.closest('details').open),false)
  const search = page.getByRole('searchbox').first()
  await search.fill('unmatchable-qa-text')
  await page.getByRole('button',{name:'Clear search'}).click()
  assert.ok(await page.locator('details').count() > 1)
  await go(base + '/agenda')
  const proposed = page.locator('main details').first()
  if (await proposed.count()) {
    await proposed.locator('summary').click()
    assert.ok(await proposed.evaluate(node=>node.open),'Agenda proposed-track disclosure should open')
    await shot('agenda-mobile')
  }
}
async function checkMenuMotion() {
  await page.emulateMedia({reducedMotion:'no-preference'})
  for (const width of [390,1440]) {
    await page.setViewportSize({width,height:844})
    await go(base+'/')
    const result=await page.evaluate(async()=>{
      const trigger=document.querySelector('.menu-trigger')
      const panel=document.querySelector('#site-menu')
      async function measure(finalState) {
        trigger.click()
        const clips=new Set()
        const start=performance.now()
        do {
          await new Promise(requestAnimationFrame)
          clips.add(getComputedStyle(panel).clipPath)
          if (performance.now()-start>2000) throw Error('Menu did not settle at '+finalState)
        } while(panel.dataset.state!==finalState)
        return {frames:clips.size,focus:document.activeElement,expanded:trigger.getAttribute('aria-expanded')}
      }
      const opened=await measure('open')
      const closed=await measure('closed')
      return {openFrames:opened.frames,closeFrames:closed.frames,entered:opened.focus===panel.querySelector('a'),
        restored:closed.focus===trigger,opened:opened.expanded,closed:closed.expanded}
    })
    assert.ok(result.openFrames>2 && result.closeFrames>2,'Visible opening and closing at '+width)
    assert.ok(result.entered && result.restored,'Keyboard focus follows menu state at '+width)
    assert.equal(result.opened,'true')
    assert.equal(result.closed,'false')
  }
  await page.emulateMedia({reducedMotion:'reduce'})
}
// Inject test-only records in a loopback Vite server. Public source and output stay untouched.
async function checkPublishedContent() {
  const server = await createServer({ logLevel: 'error', server: {host:'127.0.0.1',port:0}, plugins:[{
    name:'private-qa-records', enforce:'pre', transform(code,id) {
      if (!id.replaceAll('\\','/').endsWith('/src/content.ts')) return
      const setup = `
        Object.assign(event,{phase:'registration-open', registrationStatus:'open', registrationUrl:'https://registration.example.test/book'})
        speakers.splice(0,speakers.length,{id:'qa-person',name:'QA speaker',bio:'Private test record'})
        sessions.splice(0,sessions.length,
          {id:'qa-one',title:'QA infrastructure',description:'Private first session',start:'2027-01-01T19:00:00Z',end:'2027-01-01T19:30:00Z',type:'Talk',room:'Test room A',trackId:'cloud',speakerIds:['qa-person']},
          {id:'qa-two',title:'QA models',description:'Private second session',start:'2027-01-03T02:00:00Z',end:'2027-01-03T03:00:00Z',type:'Workshop',room:'Test room B',trackId:'ai',speakerIds:[]}
        )
      `
      return code.replace('const enrolment = registration()',setup + '\nconst enrolment = registration()')
    }
  }] })
  try {
    await server.listen()
    const host = server.resolvedUrls.local[0].replace(/\/$/,'')
    await page.setViewportSize({width:390,height:844})
    await go(host + '/agenda')
    const count = () => page.locator('main article').count()
    assert.equal(await count(),2)
    assert.equal(await page.locator('a[href="https://registration.example.test/book"]').count() > 0,true)
    for (const [label,value] of [['Days','2027-01-02'],['Rooms','Test room A'],['Tracks','cloud'],['Formats','Talk']]) {
      await page.getByRole('combobox',{name:new RegExp('^' + label)}).selectOption(value)
      assert.equal(await count(),1)
      assert.ok((await page.locator('main article').innerText()).includes('00:30'))
      if (label==='Tracks') {
        const track = page.getByRole('combobox',{name:/^Tracks/})
        for (const width of [320,360,390,430,480]) {
          await page.setViewportSize({width,height:844})
          assert.ok(await track.evaluate(input=>{
            const style=getComputedStyle(input)
            const canvas=document.createElement('canvas').getContext('2d')
            canvas.font=style.fontSize+' '+style.fontFamily
            const available=input.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-24
            return canvas.measureText(input.selectedOptions[0].text).width<=available
          }), 'Selected track text should fit at '+width)
        }
        await page.setViewportSize({width:390,height:844})
        await page.getByRole('combobox',{name:/^Days/}).evaluate(input=>{
          const firstLabel=input.closest('label')
          window.scrollTo({top:firstLabel.getBoundingClientRect().top+scrollY-82,behavior:'instant'})
        })
        await shot('agenda-filter-private-fixture')
      }
      await page.getByRole('button',{name:'Clear filters'}).click()
    }
    const search=page.getByRole('searchbox')
    await search.fill('QA speaker')
    assert.equal(await count(),1)
    await search.fill('unmatchable-qa-text')
    assert.equal(await count(),0)
    await page.getByRole('button',{name:'Clear filters'}).click()
    assert.equal(await count(),2)
    await go(host+'/speakers')
    await page.getByRole('searchbox').fill('QA speaker')
    await page.getByRole('link',{name:'QA speaker',exact:true}).first().click()
    await page.getByRole('heading',{name:'QA speaker',exact:true}).waitFor()
    assert.ok((await page.locator('main').innerText()).includes('QA infrastructure'))
  } finally { await server.close() }
}
try {
  if (process.env.PROGRAMME_ONLY !== '1') {
    await checkRoutes()
    await checkInteractions()
    await checkMenuMotion()
  }
  await checkPublishedContent()
  assert.deepEqual(errors,[])
  if (process.env.QA_RESULT) await writeFile(process.env.QA_RESULT, JSON.stringify(audit,null,2))
  assert.deepEqual(audit.accessibility.filter(row => row.violations.length),[])
  if (process.env.PROGRAMME_ONLY === '1') {
    console.log('Passed private agenda, registration and speaker-profile fixtures, including track label fit at five phone widths.')
  } else {
    console.log('Passed',audit.views,'route/width checks,',audit.localLinks.length,'local destinations, keyboard controls, FAQ and private programme fixtures.')
  }
} finally { await browser.close() }

