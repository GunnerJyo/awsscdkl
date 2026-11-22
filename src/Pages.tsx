import { useEffect, useState, type ReactNode } from 'react'
import {
  event, faqs, tracks, speakers, sessions, partners, registration, safeUrl, publicImage,
  programmeSource, filterSessions, emptyFilters, sessionDayKey, dayLabel, clockLabel, durationMinutes,
  type Speaker, type Session, type Filters
} from './content'
import './pages.css'

const speakerPath = (id: string) => '/speakers/' + encodeURIComponent(id)
const unique = (values: string[]) => [...new Set(values.filter(Boolean))].sort()
const relativeArt = { chenda: '/brand/chenda.svg', kasavu: '/brand/kasavu.svg', pookalam: '/brand/pookalam.svg', architecture: '/brand/architecture.svg' }
const studentGroups = 'https://builder.aws.com/community/student-builder-groups'

function Intro({ title, lead, art }: { title: string; lead: string; art?: keyof typeof relativeArt }) {
  return <header className={'sub-intro' + (art ? ' sub-illustrated' : '')}>
    <div><a className="sub-back" href="/">Home</a><h1>{title}</h1><p>{lead}</p></div>
    {art && <div className="sub-motif" aria-hidden="true"><img src={relativeArt[art]} alt="" width="160" height="160" /></div>}
  </header>
}
function Empty({ title, children, href, label }: { title: string; children: ReactNode; href: string; label: string }) {
  return <section className="sub-empty"><h2>{title}</h2><div><p>{children}</p><a className="sub-link" href={href}>{label} <span aria-hidden="true">→</span></a></div></section>
}
function BodyRow({ title, children }: { title: string; children: ReactNode }) {
  return <section className="sub-row"><h2 data-reveal>{title}</h2><div className="sub-prose">{children}</div></section>
}
function ContactLink() {
  const href = safeUrl(event.contactUrl)
  return href ? <a className="sub-link" href={href}>Contact the organizing team <span aria-hidden="true">↗</span></a> : null
}
function Booking() {
  const r = registration()
  return <>{r.href ? <a className="sub-link" href={r.href}>{r.label} <span aria-hidden="true">↗</span></a> : <p>{r.label}.</p>}
    {event.eligibility && <p>{event.eligibility}</p>}{event.registrationNotes && <p>{event.registrationNotes}</p>}</>
}
function About() {
  return <><Intro title="About the event" lead={event.distinction} art="pookalam" />
    <BodyRow title="Built by students"><p>{event.title} brings students from across Keralam together to share what they are building with the cloud. Bring the questions behind a class project, a tool you are exploring, or an application you want to build.</p><p>AWS Student Community Days are one-day conferences organized by Student Builder Group leaders and their core teams. AWS describes its role in the wider programme as one of several sponsors.</p><a className="sub-link" href={programmeSource}>Read about AWS Student Community Days <span aria-hidden="true">↗</span></a></BodyRow>
    <BodyRow title="Learning together"><p>Explore how cloud infrastructure, AI and developer tools work in practice. The topic guide is a starting point for discovery. Confirmed talks and their prerequisites will appear in the agenda.</p><a className="sub-link" href="/#tracks">Explore topic directions <span aria-hidden="true">→</span></a></BodyRow>
    <BodyRow title="Organizing community"><p>Keralam’s gathering is part of the AWS Student Builder Groups community. These student-led campus groups host events and help people learn cloud skills through practical projects.</p>{event.organizers.length ? <ul>{event.organizers.map(o => <li key={o.name}><strong>{o.name}</strong> · {o.role}{safeUrl(o.website) && <> · <a href={safeUrl(o.website)!}>Community website</a></>}</li>)}</ul> : <p>The organizing groups for this edition will be named here once confirmed.</p>}<a className="sub-link" href={studentGroups}>Find an AWS Student Builder Group <span aria-hidden="true">↗</span></a><ContactLink /></BodyRow>
    <BodyRow title="Registration"><Booking /></BodyRow></>
}
function SpeakerTile({ person }: { person: Speaker }) {
  const portrait = publicImage(person.portrait)
  return <article className="sub-speaker">{portrait && <img loading="lazy" width="400" height="400" src={portrait} alt="" />}
    <h2><a href={speakerPath(person.id)}>{person.name}</a></h2>
    {(person.role || person.organization) && <p>{[person.role, person.organization].filter(Boolean).join(' · ')}</p>}
    {person.topic && <p>{person.topic}</p>}</article>
}
function Speakers() {
  const [query, setQuery] = useState('')
  const shown = speakers.filter(p => [p.name,p.organization,p.topic,p.role].join(' ').toLowerCase().includes(query.toLowerCase().trim()))
  return <><Intro title="Speakers" lead="Meet the people sharing their projects, ideas and engineering experience." art="chenda"/>
    {speakers.length ? <section className="sub-results"><label className="sub-input">Search speakers<input type="search" value={query} onChange={e => setQuery(e.target.value)} /></label>
      <p className="sub-count" role="status">{shown.length} {shown.length === 1 ? 'speaker' : 'speakers'}</p>
      {shown.length ? <div className="sub-people">{shown.map(p => <SpeakerTile key={p.id} person={p} />)}</div> : <p>No speakers match this search. <button type="button" className="sub-action" onClick={() => setQuery('')}>Clear search</button></p>}</section> :
      <Empty title="Speakers to be announced" href="/agenda" label="Visit the agenda">Confirmed profiles will appear here with their session topics, backgrounds and links.</Empty>}</>
}
function SessionCard({ session: s }: { session: Session }) {
  const people = s.speakerIds.map(id => speakers.find(p => p.id === id)).filter((p): p is Speaker => Boolean(p))
  const track = tracks.find(t => t.id === s.trackId)
  return <article className="sub-session" id={'session-' + s.id}>
    <div className="sub-time"><span>{dayLabel(s.start)}</span><b><time dateTime={s.start}>{clockLabel(s.start)}</time>–<time dateTime={s.end}>{clockLabel(s.end)}</time></b>{sessionDayKey(s.start) !== sessionDayKey(s.end) && <span>Ends {dayLabel(s.end)}</span>}<span>{durationMinutes(s)} min · IST</span></div>
    <div><p className="sub-meta">{[s.type,track?.title,s.room].filter(Boolean).join(' / ')}</p><h3>{s.title}</h3><p>{s.description}</p>
    {people.length > 0 && <ul className="sub-inline" aria-label="Session speakers">{people.map(p => <li key={p.id}><a href={speakerPath(p.id)}>{p.name}</a></li>)}</ul>}</div>
  </article>
}
function Profile({ person }: { person: Speaker }) {
  const portrait = publicImage(person.portrait)
  const appearances = sessions.filter(s => s.speakerIds.includes(person.id)).sort((a,b) => Date.parse(a.start)-Date.parse(b.start))
  const links = (person.links ?? []).filter(l => safeUrl(l.url))
  return <><header className="sub-intro sub-profile"><div><a className="sub-back" href="/speakers">All speakers</a><h1>{person.name}</h1><p>{[person.role,person.organization].filter(Boolean).join(' · ')}</p></div>{portrait && <img src={portrait} alt="" width="280" height="280" />}</header>
    {person.bio && <BodyRow title="Biography"><p>{person.bio}</p></BodyRow>}
    {person.topic && <BodyRow title="Topic"><p>{person.topic}</p></BodyRow>}
    {links.length > 0 && <BodyRow title="Speaker links"><ul>{links.map(l => <li key={l.url}><a href={safeUrl(l.url)!}>{l.label}</a></li>)}</ul></BodyRow>}
    <section className="sub-results"><h2>Sessions</h2>{appearances.length ? appearances.map(s => <SessionCard key={s.id} session={s} />) : <p>Session details are to be announced.</p>}</section></>
}
function Filter({ label, value, options, change }: { label:string; value:string; options:{value:string; label:string}[]; change:(v:string)=>void }) {
  return <label className="sub-input">{label}<select name={label.toLowerCase()} data-selected={value ? 'true' : undefined} value={value} onChange={e=>change(e.target.value)}><option value="">All {label.toLowerCase()}</option>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>
}
function ProposedTracks() {
  return <section className="sub-row sub-proposals" aria-labelledby="proposed-tracks">
    <div><h2 id="proposed-tracks" data-reveal>Proposed tracks</h2><p>Explore the topics under consideration for this edition.</p></div>
    <div className="sub-disclosures">
      {tracks.map(track => <details key={track.id}><summary>{track.title}</summary><p>{track.description}</p></details>)}
    </div>
  </section>
}
function Agenda() {
  const [filters,setFilters] = useState<Filters>(emptyFilters)
  useEffect(() => {
    const track = new URLSearchParams(window.location.search).get('track')
    if (track && tracks.some(t => t.id === track) && sessions.some(s => s.trackId === track)) {
      setFilters(current => ({...current, track}))
    }
  }, [])
  const change = (key: keyof Filters, value:string) => setFilters(f=>({...f,[key]:value}))
  const shown = filterSessions(sessions, filters)
  const days = [...new Map(sessions.map(s=>[sessionDayKey(s.start),dayLabel(s.start)])).entries()].sort(([a],[b])=>a.localeCompare(b))
  const rooms = unique(sessions.map(s=>s.room ?? ''))
  const types = unique(sessions.map(s=>s.type))
  const usedTracks = tracks.filter(t=>sessions.some(s=>s.trackId===t.id))
  return <><Intro title="Agenda" lead="Plan your day around the ideas, sessions and people you want to learn from." art="kasavu" />
    {!sessions.length ? <><Empty title="Agenda coming soon" href="#proposed-tracks" label="Explore proposed tracks">The organizing team will publish session times, speakers and room details together. All programme times will use India Standard Time.</Empty><ProposedTracks/></> :
      <section className="sub-results" aria-label="Session directory"><h2>Find a session</h2><div className="sub-filters">
        <label className="sub-input">Search sessions or speakers<input type="search" value={filters.query} onChange={e=>change('query',e.target.value)} /></label>
        {days.length > 1 && <Filter label="Days" value={filters.day} options={days.map(([value,label])=>({value,label}))} change={v=>change('day',v)}/>}
        {usedTracks.length > 0 && <Filter label="Tracks" value={filters.track} options={usedTracks.map(t=>({value:t.id,label:t.title}))} change={v=>change('track',v)}/>}
        {rooms.length > 1 && <Filter label="Rooms" value={filters.room} options={rooms.map(value=>({value,label:value}))} change={v=>change('room',v)}/>}
        {types.length > 0 && <Filter label="Formats" value={filters.type} options={types.map(value=>({value,label:value}))} change={v=>change('type',v)}/>}</div>
        <div className="sub-filter-summary"><p className="sub-count" role="status">{shown.length} {shown.length === 1 ? 'session' : 'sessions'} · India Standard Time</p>{Object.values(filters).some(Boolean) && <button type="button" className="sub-action" onClick={()=>setFilters(emptyFilters)}>Clear filters</button>}</div>
        {shown.length ? shown.map(s=><SessionCard key={s.id} session={s}/>) : <p>No sessions match your selection. Try a different topic, speaker or format.</p>}</section>}</>
}
function Partners() {
  const groups = unique(partners.map(p=>p.category))
  return <><Intro title="Partners" lead="The organizations and communities supporting this student-led gathering." art="pookalam" />
    {groups.length ? groups.map(g=><BodyRow key={g} title={g}><ul className="sub-partners">{partners.filter(p=>p.category===g).map(p=><li key={p.name}>{publicImage(p.logo) && <img src={publicImage(p.logo)} alt="" width="120" height="64" loading="lazy" />}{safeUrl(p.website) ? <a href={safeUrl(p.website)!}>{p.name}</a>:p.name}</li>)}</ul></BodyRow>) :
    <Empty title="Partners to be announced" href="/about" label="About the organizing community">Confirmed partners will be listed here with their approved roles.</Empty>}
    {safeUrl(event.contactUrl) && <BodyRow title="Partnership enquiries"><ContactLink /></BodyRow>}</>
}
function VenuePage() {
  const venue = event.venue
  return <><Intro title="Venue & travel" lead="Find the travel and arrival details for your visit." art="architecture" />
    {venue ? <><BodyRow title={venue.name}><address>{venue.address}</address>{safeUrl(venue.mapUrl) && <a className="sub-link" href={safeUrl(venue.mapUrl)!}>Open map <span aria-hidden="true">↗</span></a>}</BodyRow>
    {([['Directions',venue.directions],['Public transport',venue.transit],['Parking',venue.parking],['Accessibility',venue.accessibility],['Arrival and check-in',venue.arrival]] as const).map(([title,body])=>body && <BodyRow key={title} title={title}><p>{body}</p></BodyRow>)}</> :
    <Empty title="Venue to be announced" href="/faq" label="Read attendee questions">The address, directions and available accessibility information will appear here when the venue is confirmed.</Empty>}
    {safeUrl(event.contactUrl) && <BodyRow title="Visitor information"><ContactLink /></BodyRow>}</>
}
function FAQ() {
  const [query,setQuery]=useState('')
  const shown=faqs.filter(f=>(f.question+' '+f.answer).toLowerCase().includes(query.toLowerCase().trim()))
  return <><Intro title="Frequently asked questions" lead="Answers about attending, registration and the programme." />
    <section className="sub-faq"><div><label className="sub-input">Search questions<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><span role="status" className="sub-count">{shown.length} {shown.length===1?'question':'questions'}</span></div>
    <div className="sub-disclosures">{shown.map(f=><details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}{!shown.length && <p>No questions match your search. <button className="sub-action" onClick={()=>setQuery('')} type="button">Clear search</button></p>}</div></section>
    {safeUrl(event.contactUrl) && <BodyRow title="Contact the team"><ContactLink /></BodyRow>}</>
}
function Conduct() {
  return <><Intro title="Code of Conduct" lead="Everyone taking part should have room to learn, build and ask questions safely."/>
    <BodyRow title="Where it applies"><p>This code covers attendees, speakers, organizers, volunteers and partners during sessions, breaks and event activities. It also applies in the event’s official online channels.</p></BodyRow>
    <BodyRow title="Respect others"><p>Welcome newcomers, give people time to finish speaking and discuss ideas with courtesy. Ask before photographing or recording someone, sharing their work or posting their contact details. Honour a request to stop.</p></BodyRow>
    <BodyRow title="Unacceptable behaviour"><p>Harassment, discrimination, threats, intimidation, unwanted physical contact and repeated disruption have no place here. This includes conduct directed at someone’s background, identity, disability or level of technical experience.</p></BodyRow>
    <BodyRow title="Raise a concern"><p>If something happens to you or you witness a problem, speak with an organizer or ask a volunteer at the registration desk to find one. You can ask to talk privately. Tell the team what happened, where it happened and what immediate help you need.</p><ContactLink /></BodyRow>
    <BodyRow title="How organizers respond"><p>Organizers will listen, check what support is needed and respond in proportion to the situation. They may ask someone to change their behaviour, stop a disruption or leave an activity to protect other participants.</p><a className="sub-link" href="https://aws.amazon.com/codeofconduct/">Read the AWS Code of Conduct <span aria-hidden="true">↗</span></a></BodyRow></>
}
function Privacy() {
  return <><Intro title="Privacy" lead="How information is handled when you browse the public event website."/>
    <BodyRow title="Browsing the site"><p>You can browse the programme and visitor guidance without an account. Search and filter text stays in this page while you use it. The website does not set tracking cookies or collect attendee details through a form.</p></BodyRow>
    <BodyRow title="Hosting and links"><p>A hosting provider may process ordinary connection information, such as an IP address and requested page, to deliver the website. Following an external link takes you to a service with its own privacy information.</p></BodyRow>
    <BodyRow title="Registration"><p>When registration opens, the official booking link will identify the provider that handles signup. Review that provider’s privacy information before submitting personal details.</p></BodyRow></>
}
export function SupportingPage({ path }: { path:string }) {
  const clean=path.split('?')[0].replace(/\/+$/,'')
  const match=speakers.find(s=>clean===speakerPath(s.id))
  const pages: Record<string,()=>ReactNode>={'/about':About,'/speakers':Speakers,'/agenda':Agenda,'/partners':Partners,'/venue':VenuePage,'/faq':FAQ,'/code-of-conduct':Conduct,'/privacy':Privacy}
  const Page = Object.hasOwn(pages,clean) ? pages[clean] : undefined
  return <div className="sub-wrap">{match ? <Profile person={match}/> : Page ? <Page/> : <><Intro title="Page not found" lead="This page may have moved or its address may be incomplete."/><a className="sub-link" href="/">Return to the event homepage <span aria-hidden="true">→</span></a></>}</div>
}

