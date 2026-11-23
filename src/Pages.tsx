import { useState, type ReactNode } from 'react'
import {
  event, faqs, organizingGroup, tracks, speakers, sessions, registration, safeUrl,
  publicImage, programmeSource, type Speaker
} from './content'
import { AgendaExplorer, SpeakerCards, Timeline, speakerPath } from './Programme'
import { PartnerShowcase } from './PartnerShowcase'
import type { PartnerGroup } from './partner-model'
import './pages.css'

const studentGroups = 'https://builder.aws.com/community/student-builder-groups'
const illustrations = {
  pookalam: ['pookalam', 'Pookalam'], chenda: ['chenda','Chenda'],
  kasavu: ['kasavu','Kasavu'], architecture: ['architecture','Architecture'],
  reed: ['reed','Reed'], palm: ['palm','Coconut palm']
} as const
type Art = keyof typeof illustrations

function ReturnLink({ href = '/', children = 'Event home' }: { href?:string; children?:ReactNode }) {
  return <a className="folio-back" href={href}><span aria-hidden="true">←</span>{children}</a>
}
function Intro({ title, lead, art }: { title:string; lead:string; art?:Art }) {
  return <header className={'folio-head' + (art ? ' folio-illustrated' : '')}>
    <div className="folio-head-copy"><ReturnLink/><h1>{title}</h1><p>{lead}</p></div>
    {art && <figure className={'folio-plate folio-plate-' + art}>
      <img src={'/brand/' + illustrations[art][0] + '.svg'} width="480" height="480" alt=""/>
      <figcaption>{illustrations[art][1]}</figcaption>
    </figure>}
  </header>
}
function TextLink({ href, children, external = false }: { href:string; children:ReactNode; external?:boolean }) {
  return <a className="folio-link" href={href}>{children} <span aria-hidden="true">{external ? '↗' : '→'}</span></a>
}
function StatusPanel({ title, children, href, label }: { title:string; children:ReactNode; href:string; label:string }) {
  return <section className="folio-status"><h2>{title}</h2><div><p>{children}</p><TextLink href={href}>{label}</TextLink></div></section>
}
function BodyRow({ title, children, id }: { title:string; children:ReactNode; id?:string }) {
  return <section className="folio-row" id={id}><h2 data-reveal>{title}</h2><div className="folio-prose">{children}</div></section>
}
function ContactLink() {
  const href = safeUrl(event.contactUrl)
  return href ? <TextLink href={href} external>Contact the organizing team</TextLink> : null
}
function Booking() {
  const r = registration()
  return <>{r.href ? <TextLink href={r.href} external>{r.label}</TextLink> : <p>{r.label}.</p>}
    {event.eligibility && <p>{event.eligibility}</p>}{event.registrationNotes && <p>{event.registrationNotes}</p>}</>
}
function About() {
  const social = event.socialLinks.filter(link => safeUrl(link.url))
  return <><Intro title="About the event" lead={event.distinction} art="pookalam"/>
    <BodyRow title="Built by students"><p className="folio-deck">{event.title} brings students from across Keralam together to share what they are building with the cloud.</p><p>Bring the questions behind a class project, a tool you are exploring, or an application you want to build.</p><p>AWS Student Community Days are one-day conferences organized by Student Builder Group leaders and their core teams. AWS describes its role in the wider programme as one of several sponsors.</p><TextLink href={programmeSource} external>Read about AWS Student Community Days</TextLink><p className="folio-fineprint">Amazon Web Services, AWS, and the AWS logo are trademarks of Amazon.com, Inc. or its affiliates.</p></BodyRow>
    <BodyRow title="Learning together"><p>Explore how cloud infrastructure, AI and developer tools work in practice. The topic guide is a starting point for discovery. Confirmed talks and their prerequisites will appear in the agenda.</p><TextLink href="/#tracks">Explore topic directions</TextLink></BodyRow>
    <BodyRow title="Organizing community" id="organizing-community"><p>Keralam’s gathering is part of the AWS Student Builder Groups community. These student-led campus groups host events and help people learn cloud skills through practical projects.</p>
      {event.organizers.map(o => <div key={o.name} className="folio-organizer">{o.name === organizingGroup.name && <img src={organizingGroup.logo} width="80" height="80" loading="lazy" alt=""/>}
        <div><small>{o.role}</small><h3>{o.name}</h3>{o.name === organizingGroup.name && <p>{organizingGroup.institution}</p>}
          {safeUrl(o.website) && <TextLink href={safeUrl(o.website)!} external>Community website</TextLink>}</div></div>)}
      <TextLink href={studentGroups} external>Find an AWS Student Builder Group</TextLink><ContactLink/></BodyRow>
    {social.length > 0 && <BodyRow title="Community channels"><ul>{social.map(link =>
      <li key={link.url}><TextLink href={safeUrl(link.url)!} external>{link.label}</TextLink></li>)}</ul></BodyRow>}
    <BodyRow title="Registration"><Booking/></BodyRow></>
}
function Speakers() {
  const [query, setQuery] = useState('')
  const needle = query.toLowerCase().trim()
  const shown = speakers.filter(p => {
    const appearances = sessions.filter(s => s.speakerIds.includes(p.id)).map(s => s.title)
    return [p.name,p.organization,p.topic,p.role,...appearances].join(' ').toLowerCase().includes(needle)
  })
  return <><Intro title="Speakers" lead="Meet the people behind the projects and ideas on the programme." art="chenda"/>
    {speakers.length ? <section className="folio-directory speaker-directory"><div className="speaker-finder"><h2>Speaker directory</h2>
      <label className="directory-field">Search speakers<input type="search" value={query} onChange={e => setQuery(e.target.value)}/></label>
      <div className="directory-status"><p role="status">{shown.length} {shown.length === 1 ? 'speaker' : 'speakers'}</p>
        {query && <button type="button" onClick={() => setQuery('')}>Clear search</button>}</div></div>
      {shown.length ? <SpeakerCards people={shown}/> : <p className="directory-zero">No speakers match your search.</p>}</section> :
      <StatusPanel title="Speakers to be announced" href="/agenda" label="Explore the programme">The first speaker announcements will appear here with each speaker’s background, topic and confirmed sessions.</StatusPanel>}</>
}
function Profile({ person }: { person:Speaker }) {
  const portrait = publicImage(person.portrait)
  const appearances = sessions.filter(s => s.speakerIds.includes(person.id)).sort((a,b) => Date.parse(a.start)-Date.parse(b.start))
  const links = (person.links ?? []).filter(l => safeUrl(l.url))
  return <><header className={'folio-head' + (portrait ? ' folio-illustrated' : '')}><div className="folio-head-copy">
    <ReturnLink href="/speakers">All speakers</ReturnLink><h1>{person.name}</h1>
    <p>{[person.role,person.organization].filter(Boolean).join(' · ')}</p></div>
    {portrait && <figure className="folio-person"><img src={portrait} alt="" width="480" height="384"/></figure>}</header>
    {person.bio && <BodyRow title="Biography"><p>{person.bio}</p></BodyRow>}
    {person.topic && <BodyRow title="Topic"><p>{person.topic}</p></BodyRow>}
    {links.length > 0 && <BodyRow title="Speaker links"><ul>{links.map(l => <li key={l.url}><TextLink href={safeUrl(l.url)!} external>{l.label}</TextLink></li>)}</ul></BodyRow>}
    <section className="folio-directory"><h2>Sessions</h2>{appearances.length ? <Timeline items={appearances}/> : <p>Session details are to be announced.</p>}</section></>
}
function Agenda() {
  return <><Intro title="Agenda" lead="Find a session by topic, speaker or format. Programme times use India Standard Time." art="kasavu"/>
    {sessions.length ? <section className="folio-directory"><h2>Find a session</h2><AgendaExplorer/></section> :
      <><StatusPanel title="Agenda coming soon" href="#proposed-tracks" label="Explore proposed tracks">Session times, speakers and room details will appear here when the programme is ready.</StatusPanel>
        <BodyRow title="Proposed tracks" id="proposed-tracks"><p>Topics under consideration for this edition.</p>
          <div className="folio-accordion">{tracks.map(t => <details key={t.id}><summary>{t.title}</summary><p>{t.description}</p></details>)}</div></BodyRow></>}</>
}
function Partners({ groups, preview }: { groups:PartnerGroup[]; preview:boolean }) {
  return <><div className="folio-partner-back"><ReturnLink/></div><PartnerShowcase groups={groups} preview={preview} standalone/>
    <div className="folio-credit"><h2>Event organizer</h2><TextLink href="/about#organizing-community">{organizingGroup.name}</TextLink></div>
    {safeUrl(event.contactUrl) && <BodyRow title="Partnership enquiries"><ContactLink/></BodyRow>}</>
}
function VenuePage() {
  const venue = event.venue
  return <><Intro title="Venue & travel" lead="Plan your journey to the event in Keralam." art="architecture"/>
    {venue ? <><BodyRow title={venue.name}><address>{venue.address}</address>{safeUrl(venue.mapUrl) && <TextLink href={safeUrl(venue.mapUrl)!} external>Open map</TextLink>}</BodyRow>
      {([['Directions',venue.directions],['Public transport',venue.transit],['Parking',venue.parking],['Accessibility',venue.accessibility],['Arrival and check-in',venue.arrival]] as const).map(([title,body]) =>
        body && <BodyRow key={title} title={title}><p>{body}</p></BodyRow>)}</> :
      <StatusPanel title="Venue to be announced" href="/faq" label="Read attendee questions">The organizing team will share the address, travel directions and available accessibility information once the venue is confirmed.</StatusPanel>}
    {safeUrl(event.contactUrl) && <BodyRow title="Visitor information"><ContactLink/></BodyRow>}</>
}
function FAQ() {
  const [query,setQuery] = useState('')
  const shown = faqs.filter(f => (f.question+' '+f.answer).toLowerCase().includes(query.toLowerCase().trim()))
  return <><Intro title="Frequently asked questions" lead="Practical answers about the programme, registration and attending the event."/>
    <section className="folio-faq"><div className="folio-faq-tools"><label className="directory-field">Search questions
      <input type="search" value={query} onChange={e => setQuery(e.target.value)}/></label>
      <div className="directory-status"><p role="status">{shown.length} {shown.length === 1 ? 'question' : 'questions'}</p>
        {query && <button type="button" onClick={() => setQuery('')}>Clear search</button>}</div></div>
      <div className="folio-accordion">{shown.map(f => <details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}
        {!shown.length && <p className="directory-zero">No questions match your search.</p>}</div></section>
    {safeUrl(event.contactUrl) && <BodyRow title="Contact the team"><ContactLink/></BodyRow>}</>
}

type ReadingSection = { id:string; title:string; text:string; link?:ReactNode }
function ReadingPage({ title, lead, sections }: { title:string; lead:string; sections:ReadingSection[] }) {
  return <><Intro title={title} lead={lead}/><div className="folio-reading">
    <nav className="folio-contents" aria-label="On this page"><h2>On this page</h2>
      <ul>{sections.map(s => <li key={s.id}><a href={'#'+s.id}>{s.title}</a></li>)}</ul></nav>
    <div>{sections.map(s => <section key={s.id} id={s.id} className="folio-chapter">
      <h2>{s.title}</h2><p>{s.text}</p>{s.link}</section>)}</div></div></>
}
function Conduct() {
  return <ReadingPage title="Code of Conduct" lead="Everyone taking part should have room to learn, build and ask questions safely." sections={[
    {id:'scope',title:'Where it applies',text:'This code covers attendees, speakers, organizers, volunteers and partners during sessions, breaks and event activities. It also applies in the event’s official online channels.'},
    {id:'respect',title:'Respect others',text:'Welcome newcomers, give people time to finish speaking and discuss ideas with courtesy. Ask before photographing or recording someone, sharing their work or posting their contact details. Honour a request to stop.'},
    {id:'behaviour',title:'Unacceptable behaviour',text:'Harassment, discrimination, threats, intimidation, unwanted physical contact and repeated disruption have no place here. This includes conduct directed at someone’s background, identity, disability or level of technical experience.'},
    {id:'reporting',title:'Raise a concern',text:'If something happens to you or you witness a problem, speak with an organizer or ask a volunteer at the registration desk to find one. You can ask to talk privately. Tell the team what happened, where it happened and what immediate help you need.',link:<ContactLink/>},
    {id:'response',title:'How organizers respond',text:'Organizers will listen, check what support is needed and respond in proportion to the situation. They may ask someone to change their behaviour, stop a disruption or leave an activity to protect other participants.',link:<TextLink href="https://aws.amazon.com/codeofconduct/" external>Read the AWS Code of Conduct</TextLink>}
  ]}/>
}
function Privacy() {
  return <ReadingPage title="Privacy" lead="How information is handled when you browse the public event website." sections={[
    {id:'browsing',title:'Browsing the site',text:'You can browse the programme and visitor guidance without an account. Search and filter text stays in this page while you use it. The website does not set tracking cookies or collect attendee details through a form.'},
    {id:'hosting',title:'Hosting and links',text:'A hosting provider may process ordinary connection information, such as an IP address and requested page, to deliver the website. Following an external link takes you to a service with its own privacy information.'},
    {id:'registration',title:'Registration',text:'When registration opens, the official booking link will identify the provider that handles signup. Review that provider’s privacy information before submitting personal details.'}
  ]}/>
}
export function SupportingPage({ path, partnerGroups = [], partnerPreview = false }: {
  path:string; partnerGroups?:PartnerGroup[]; partnerPreview?:boolean
}) {
  const clean = path.split('?')[0].replace(/\/+$/,'')
  const person = speakers.find(s => clean === speakerPath(s.id))
  const routes:Record<string,()=>ReactNode> = {
    '/about':About,'/speakers':Speakers,'/agenda':Agenda,'/partners':() => <Partners groups={partnerGroups} preview={partnerPreview}/>,
    '/venue':VenuePage,'/faq':FAQ,'/code-of-conduct':Conduct,'/privacy':Privacy
  }
  const Page = Object.hasOwn(routes,clean) ? routes[clean] : undefined
  return <div className="folio">{person ? <Profile person={person}/> : Page ? <Page/> : <Intro title="Page not found" lead="This page may have moved or its address may be incomplete."/>}</div>
}
