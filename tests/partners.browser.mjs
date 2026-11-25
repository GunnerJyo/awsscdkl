import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createSsrModules } from '../scripts/ssr-modules.mjs'

// Use the real SSR entry points with synthetic data. These responses exist
// only inside this browser context and never alter the registry or dist.
const origin = process.env.TEST_URL || 'http://127.0.0.1:4173'
const windowsEdge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const executablePath = process.env.BROWSER_PATH || (existsSync(windowsEdge) ? windowsEdge : undefined)
const defaults = {
  category:'Community Partners', reviewGroup:'Community groups', edition:2027, sortOrder:10,
  logoProfile:'badge', status:'confirmed', approvedForDisplay:true, approvedForPrototype:false
}
const record = (id, name, changes = {}) => ({...defaults,id,name,...changes})
const history = 'Participation belongs to the earlier 2026 planning period.'
const registry = [
  record('later','Fixture Chapter Two',{sortOrder:20,website:'https://example.test/chapter'}),
  record('first','Fixture Chapter One'),
  record('prior','Fixture Historical Group',{
    sortOrder:30,status:'historical',historicalYear:2026,historicalAcknowledgment:history
  }),
  record('both','Fixture Regional Institution',{sortOrder:40,category:'Ecosystem & Venue Partner'}),
  record('pending','Pending Fixture',{status:'pending'}),
  record('unapproved','Unapproved Fixture',{approvedForDisplay:false}),
  record('wrong-year','Earlier Edition Fixture',{edition:2026}),
  record('missing-role','Unassigned Role Fixture',{category:null}),
  record('vague-history','Unapproved History Fixture',{status:'historical',historicalYear:2026}),
]
const unpublished = registry.slice(4).map(r=>r.name)
const modules = await createSsrModules()
let browser
try {
  const {renderRoute} = await modules.ssrLoadModule('/src/server.tsx')
  const css = (await readdir('dist/assets')).find(name=>name.endsWith('.css'))
  assert.ok(css,'Build the site before running browser tests')
  browser = await chromium.launch({executablePath,headless:true})
  const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'})
  for(const pathname of ['/','/partners']){
    const url=origin+pathname
    const view=renderRoute(pathname,registry,false)
    assert.equal(view.status,200)
    await page.route(url, route=>route.fulfill({
      contentType:'text/html',
      body:'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/assets/'+css+'"></head><body>'+view.html+'</body></html>'
    }))
    await page.goto(url,{waitUntil:'networkidle'})
    const showcase=page.locator(pathname==='/'?'#community-partners':'#partner-directory')
    const groups=showcase.locator('.partner-group')
    assert.equal(await groups.count(),3)
    assert.deepEqual(await groups.nth(0).locator('.partner-name').allTextContents(),['Fixture Chapter One','Fixture Chapter Two ↗'])
    const historicGroup=groups.filter({has:page.getByRole('heading',{name:'Historical collaborations'})})
    assert.match(await historicGroup.innerText(),/Fixture Historical Group/)
    assert.ok((await historicGroup.innerText()).includes(history))
    assert.equal(await showcase.getByText('Fixture Regional Institution',{exact:true}).count(),1)
    assert.equal(await showcase.getByRole('heading',{name:'Ecosystem & Venue Partner',exact:true}).count(),1)
    for (const omitted of unpublished) assert.ok(!(await showcase.innerText()).includes(omitted))
    const linked=showcase.getByRole('link',{name:/Fixture Chapter Two/})
    assert.equal(await linked.getAttribute('href'),'https://example.test/chapter')
    assert.equal(await showcase.locator('a').count(),1)
    assert.equal(await showcase.locator('img').count(),0)
    await linked.focus()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Shift+Tab')
    assert.ok(await linked.evaluate(a=>document.activeElement===a && getComputedStyle(a).outlineStyle!=='none'))
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
    await page.unroute(url)
  }
  console.log('Confirmed and historical publication, role combination, sorting, exclusions, valid links and keyboard focus passed on home and /partners.')
} finally {
  await browser?.close()
  await modules.close()
}
