import { event, faqs, organizingGroup, partners, registration, safeUrl, sessions, speakers, tracks } from './content'
import './home.css'

const experiences = [
  { title: 'Learn', detail: 'Hear how developers approach the decisions behind cloud applications.', art: 'chenda' },
  { title: 'Build', detail: 'Explore the tools and techniques that turn a student project into working software.', art: 'reed' },
  { title: 'Connect', detail: 'Meet other builders and find communities to keep learning with after the event.', art: 'pookalam' },
  { title: 'Explore', detail: 'Discover ideas across cloud infrastructure, artificial intelligence and developer tools.', art: 'palm' },
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" className="home-arrow">
    <path d={diagonal ? 'M5 19 19 5M6 5h13v13' : 'M3 12h17m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
  </svg>
}
function Topic({ text }: { text: string }) {
  return <p className="home-eyebrow">{text}</p>
}
function EventHero() {
  const access = registration()
  const after = event.phase === 'post-event'
  const [lead, programme, location] = [
    event.title.split(' ').slice(0, 2).join(' '),
    event.title.split(' ').slice(2, 4).join(' '),
    event.title.split(' ').slice(4).join(' '),
  ]
  return <section className="home-hero" aria-labelledby="event-heading">
    <div className="home-hero-layout home-width">
      <div className="home-hero-copy">
        <Topic text={event.distinction} />
        <h1 id="event-heading"><span>{lead}</span>{' '}<span>{programme}</span>{' '}<span>{location}</span></h1>
        <p className="home-intro">Meet Keralam’s AWS Student Builder Groups community for a day of cloud projects, shared ideas and conversations with fellow builders.</p>
        {(event.dateLabel || event.venue) && <p className="home-event-details">{[event.dateLabel,event.venue?.name].filter(Boolean).join(' · ')}</p>}
        <div className="home-actions">
          <a className="home-button" href={access.href || (after ? '#registration' : '#experience')}>{access.href ? access.label : after ? 'Event recap' : 'Explore the event'} <Arrow/></a>
          <a className="home-text-link" href={after ? '/agenda' : '#tracks'}>{after ? 'Browse the agenda' : 'View tracks'} <span aria-hidden="true">↓</span></a>
        </div>
        {!access.href && <p className="home-status"><span aria-hidden="true" />{access.label}</p>}
      </div>
      <figure className="home-art">
        <img src="/brand/hero-panel.svg" width="451" height="480" fetchPriority="high" alt="Shared Gaze, a green Kathakali face and a vermilion Theyyam-inspired face sharing one sightline" />
        <figcaption><strong>Shared Gaze</strong><span>Kathakali × Theyyam</span></figcaption>
      </figure>
    </div>
    <div className="home-hero-divider" aria-hidden="true">
      {['left', 'right'].map(side => <picture key={side} className={'home-strip-bank home-strip-' + side}>
        <source media="(max-width:700px)" srcSet="/brand/signature.svg"/>
        <img className="home-hero-strip" src="/brand/wide-signature.svg" width="2400" height="48" alt=""/>
      </picture>)}
    </div>
  </section>
}

function Organizer() {
  return <section className="home-width home-organizer" aria-labelledby="organizer-name">
    <p className="home-organizer-label">Organized by</p>
    <div className="home-organizer-identity">
      <img src={organizingGroup.logo} alt="" width="64" height="64" loading="lazy"/>
      <div><h2 id="organizer-name">{organizingGroup.name}</h2><p>{organizingGroup.institution}</p></div>
    </div>
  </section>
}
function FirstEdition() {
  return <section className="home-width home-section home-editorial" aria-labelledby="first-edition">
    <div className="home-editorial-title" data-reveal><Topic text="The first edition"/><h2 id="first-edition">A first for Keralam.<br/>Built by community.</h2></div>
    <figure className="home-editorial-art" data-reveal>
      <img src="/brand/mohiniyattam.svg" alt="A Mohiniyattam dancer in a cream and gold costume" width="480" height="480" loading="lazy"/>
    </figure>
    <div className="home-editorial-body" data-reveal>
      <p>One day for Keralam’s campus cloud communities to learn from one another.</p>
      <p>Bring the question behind your latest build. Meet students tackling similar problems, hear from practitioners and find a community to keep building with.</p>
      <a className="home-rule-link" href="/about">About the gathering <Arrow/></a>
    </div>
  </section>
}
function Experience() {
  return <section id="experience" className="home-experience" aria-labelledby="experience-heading"><div className="home-width home-section">
    <div data-reveal><Topic text="The experience"/><h2 id="experience-heading">What brings us together.</h2></div>
    <div className="home-experience-list">{experiences.map(item=>
      <div className="home-experience-item" data-reveal key={item.title}>
        <img src={'/brand/'+item.art+'.svg'} alt="" loading="lazy" width="84" height="84"/>
        <h3>{item.title}</h3><p>{item.detail}</p>
      </div>
    )}</div>
  </div></section>
}
function Tracks() {
  return <section id="tracks" className="home-width home-section home-tracks" aria-labelledby="track-heading">
    <div className="home-track-intro" data-reveal><Topic text="Technical tracks"/><h2 id="track-heading">Find your <br/>next topic.</h2>
      <p>Explore the proposed themes. Confirmed sessions and their tracks will appear in the programme.</p>
      <a className="home-rule-link" href="/agenda">View the agenda <Arrow/></a>
    </div>
    <div className="home-track-list">{tracks.map((track,index)=>
      <details key={track.id} className="home-track">
        <summary><span className="home-track-number">{String(index+1).padStart(2,'0')}</span><span>{track.title}</span><span className="home-toggle" aria-hidden="true"/></summary>
        <div className="home-track-description"><p>{track.description}</p>{sessions.some(s=>s.trackId===track.id)&&<a className="home-rule-link" href={'/agenda?track='+encodeURIComponent(track.id)}>Browse sessions <Arrow/></a>}</div>
      </details>
    )}</div>
  </section>
}

function Programme() {
  return <section className="home-programme" aria-labelledby="programme-heading"><div className="home-width home-section">
    <div data-reveal><Topic text="The programme"/><h2 id="programme-heading">People &amp; sessions.</h2></div>
    <div className="home-programme-links">
      <a href="/speakers" data-reveal><span>{speakers.length ? 'Meet the speakers' : 'Speakers to be announced'}</span><Arrow diagonal/></a>
      <a href="/agenda" data-reveal><span>{sessions.length ? 'Browse the agenda' : 'Agenda coming soon'}</span><Arrow diagonal/></a>
    </div>
  </div></section>
}
function VisitorGuide() {
  return <section className="home-width home-section home-visit" aria-labelledby="visit-heading">
    <div data-reveal><Topic text="Attendee guide"/><h2 id="visit-heading">Plan your visit.</h2></div>
    <div className="home-visit-list">
      <article><h3>Venue &amp; travel</h3><p>{event.venue ? event.venue.name+' · '+event.venue.address : 'Venue to be announced. Directions and arrival information will be available once the venue is confirmed.'}</p><a className="home-rule-link" href="/venue">Visitor information <Arrow/></a></article>
      <article><h3>Organizers &amp; partners</h3><p>{partners.length ? 'Meet the partners supporting this edition.' : 'Partners for this edition will be announced here.'}</p><a className="home-rule-link" href="/partners">Community &amp; partners <Arrow/></a></article>
    </div>
  </section>
}
function AttendeeFaq() {
  return <section className="home-width home-section home-faq" aria-labelledby="faq-heading">
    <div><Topic text="Attendee questions"/><h2 id="faq-heading">Before you go.</h2><a className="home-rule-link" href="/faq">All FAQs <Arrow/></a></div>
    <div>{faqs.slice(0,3).map(faq=><details key={faq.question}><summary>{faq.question}<span className="home-toggle" aria-hidden="true"/></summary><p>{faq.answer}</p></details>)}</div>
  </section>
}
function Registration() {
  const access=registration()
  const after=event.phase==='post-event'
  return <section className="home-width home-registration" id="registration" aria-labelledby="registration-heading">
    <div className="home-registration-copy" data-reveal><Topic text={after?'After the event':'Registration'}/><h2 id="registration-heading">{access.label}</h2>
      <p>{event.registrationNotes || (after ? 'Find published resources and programme information for this edition.' : 'Official pass details and attendee guidance will be published by the organizing team.')}</p>
      {event.eligibility && <p>{event.eligibility}</p>}
      {event.recap.filter(l=>safeUrl(l.url)).map(l=><p key={l.url}><a className="home-rule-link" href={l.url}>{l.label} <Arrow/></a></p>)}
    </div>
    <a className="home-button" href={access.href || (after ? '/agenda' : '/faq')}>{access.href ? 'Official registration' : after ? 'View programme' : 'Attendee FAQs'} <Arrow/></a>
  </section>
}
export default function Home() {
  return <div className="home-page"><EventHero/><Organizer/>
    {event.announcements.length>0 && <section className="home-width home-section"><h2>Event updates</h2><ul>{event.announcements.map(a=><li key={a}>{a}</li>)}</ul></section>}
    <FirstEdition/><Experience/><Tracks/><Programme/><VisitorGuide/><AttendeeFaq/><Registration/>
  </div>
}
