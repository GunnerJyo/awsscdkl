import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createSsrModules } from '../scripts/ssr-modules.mjs'

const vite = await createSsrModules()
const { event, speakers, tracks, sessions, safeUrl, publicImage, registration, filterSessions, emptyFilters, sessionDayKey, clockLabel, durationMinutes } = await vite.ssrLoadModule('/src/content.ts')
const { partnerRegistry:partners } = await vite.ssrLoadModule('/organizer/partners.ts')
const { partnerGroups } = await vite.ssrLoadModule('/src/partner-model.ts')
after(() => vite.close())

test('published programme records have stable links and explicit event-local instants', () => {
  for (const records of [speakers, tracks, sessions]) {
    assert.equal(new Set(records.map(r => r.id)).size, records.length, 'IDs must be unique within each directory')
    for (const r of records) assert.match(r.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  }
  for (const session of sessions) {
    for (const instant of [session.start, session.end]) {
      assert.match(instant, /T\d{2}:\d{2}.*(?:Z|[+-]\d{2}:\d{2})$/)
      assert.ok(Number.isFinite(Date.parse(instant)), 'Session timestamps must be valid')
    }
    assert.ok(Date.parse(session.end) > Date.parse(session.start))
    if (session.trackId) assert.ok(tracks.some(t => t.id === session.trackId))
    for (const id of session.speakerIds) assert.ok(speakers.some(p => p.id === id))
  }
  const links = [...event.socialLinks, ...event.recap, ...speakers.flatMap(p => p.links ?? [])].map(l => l.url)
  links.push(...partners.flatMap(p => p.website ? [p.website] : []), ...event.organizers.flatMap(o => o.website ? [o.website] : []))
  for (const url of [event.registrationUrl,event.contactUrl,event.siteUrl,event.venue?.mapUrl,...links]) {
    if (url) assert.ok(safeUrl(url), 'Published destinations must be approved HTTPS URLs')
  }
})

test('registered destinations require HTTPS without credentials or hidden whitespace', () => {
  for (const value of ['javascript:alert(1)', 'http://example.org', '//example.org', 'https://user:pass@example.org', 'https://example.org/\nother', ' https://example.org']) {
    assert.equal(safeUrl(value), null)
  }
  assert.equal(safeUrl('https://example.org/book'), 'https://example.org/book')
  assert.equal(publicImage('/assets/avatar.png'), '/assets/avatar.png')
  for (const value of ['//example.org/a','https://example.org/a','/img/../a']) assert.equal(publicImage(value), undefined)
})

test('registration phases and independent sale status control the call to action', () => {
  const open = { ...event, phase: 'registration-open', registrationStatus: 'open', registrationUrl: 'https://example.org/book' }
  assert.equal(registration(open).href, open.registrationUrl)
  assert.match(registration({...open, registrationStatus: 'limited'}).label, /limited/)
  for (const phase of ['pre-announcement','registration-closed','post-event']) assert.equal(registration({...open, phase}).href,null)
  for (const status of ['sold-out','closed','opening-soon','unannounced']) assert.equal(registration({...open, registrationStatus: status}).href,null)
  assert.equal(registration({...open,registrationUrl:null}).href,null)
  assert.equal(registration({...open,registrationUrl:'data:text/plain,test'}).href,null)
  assert.equal(registration({...open,phase:'event-day'}).href,open.registrationUrl)
})

test('agenda combines search terms, rooms, dates and track IDs in event-local time', () => {
  const people=[{id:'test-person',name:'Test Contributor'}]
  const earlier={id:'early',title:'Private fixture',description:'Build a service',type:'Talk',room:'A',trackId:'cloud',start:'2027-01-01T19:00:00Z',end:'2027-01-01T19:40:00Z',speakerIds:['test-person']}
  const later={...earlier,id:'later',room:'B',title:'Different topic',trackId:'ai',start:'2027-01-03T10:00:00+05:30',end:'2027-01-03T10:30:00+05:30',speakerIds:[]}
  const choices=[later,earlier]
  assert.equal(sessionDayKey(earlier.start),'2027-01-02')
  assert.equal(clockLabel(earlier.start),'00:30')
  assert.equal(durationMinutes(earlier),40)
  assert.deepEqual(filterSessions(choices,emptyFilters,people).map(s=>s.id),['early','later'])
  assert.deepEqual(filterSessions(choices,{...emptyFilters,query:'contributor build',day:'2027-01-02',room:'A',track:'cloud',type:'Talk'},people).map(s=>s.id),['early'])
  assert.deepEqual(filterSessions(choices,{...emptyFilters,query:'contributor',room:'B'},people),[])
  assert.deepEqual(choices.map(s=>s.id),['later','early'])
})


const base = { id:'sample', name:'Sample group', category:'Community Partners', reviewGroup:'Community groups',
  sortOrder:1, status:'pending', edition:2027, approvedForDisplay:false, approvedForPrototype:true, logoProfile:'badge' }

test('prototype-only permission is distinct from role confirmation and edition-specific public display', () => {
  const waiting = [
    base, {...base,id:'b',status:'confirmed'}, {...base,id:'c',approvedForDisplay:true},
    {...base,id:'d',category:null,status:'confirmed',approvedForDisplay:true},
    {...base,id:'e',edition:2026,status:'confirmed',approvedForDisplay:true},
    {...base,id:'f',approvedForPrototype:false},
  ]
  assert.deepEqual(partnerGroups(waiting), [])
  assert.deepEqual(partnerGroups(waiting,true)[0].entries.map(e=>e.id), ['b','c','d','sample'])
})

test('approved current roles sort consistently and a combined role uses one entry', () => {
  const row = {...base,status:'confirmed',approvedForDisplay:true}
  const groups=partnerGroups([
    {...row, id:'combined', category:'Ecosystem & Venue Partner',sortOrder:40},
    {...row, id:'second',sortOrder:30}, {...row,id:'first',sortOrder:10}
  ])
  assert.deepEqual(groups.map(g=>g.heading),['Community Partners','Ecosystem & Venue Partner'])
  assert.deepEqual(groups.flatMap(g=>g.entries.map(e=>e.id)),['first','second','combined'])
})

test('historical credit requires edition-specific publication approval, prior year and approved context', () => {
  const history={...base,status:'historical', category:null, historicalYear:2026,
    historicalAcknowledgment:'Collaborated on planning in 2026.',approvedForDisplay:true}
  for (const change of [{approvedForDisplay:false},{edition:2026},{historicalYear:2027},{historicalYear:undefined},{historicalAcknowledgment:' '}]) {
    assert.deepEqual(partnerGroups([{...history,...change}]),[])
  }
  const [group]=partnerGroups([history])
  assert.equal(group.heading,'Historical collaborations')
  assert.equal(group.entries[0].historicalAcknowledgment,history.historicalAcknowledgment)
})

test('logo destinations use local filenames and web destinations accept validated HTTPS', () => {
  const [group]=partnerGroups([{...base,logo:'group.webp',logoSmall:'group-512.webp',logoThumbnail:'group-256.webp',website:'javascript:test'}],true)
  assert.equal(group.entries[0].logo,'/community-logos/group.webp')
  assert.equal(group.entries[0].logoSmall,'/community-logos/group-512.webp')
  assert.equal(group.entries[0].logoThumbnail,'/community-logos/group-256.webp')
  assert.equal(group.entries[0].website,undefined)
  assert.throws(()=>partnerGroups([{...base,logo:'../private.png'}],true),/Invalid logo/)
  assert.throws(()=>partnerGroups([{...base,logoThumbnail:'../private.webp'}],true),/Invalid logo/)
  assert.equal(partnerGroups([base],true)[0].entries[0].logo,undefined)
})

