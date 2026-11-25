import { event, faqs, organizingGroup, registration, safeUrl, sessions, speakers, tracks } from './content'
import { PartnerShowcase } from './PartnerShowcase'
import type { PartnerGroup } from './partner-model'
import { AgendaExplorer, SpeakerCards } from './Programme'
import './home.css'

const experiences = [
  { title: 'Learn', detail: 'Get closer to the engineering decisions behind cloud applications.', art: 'chenda' },
  { title: 'Build', detail: 'Explore how a student project moves from an experiment to working software.', art: 'reed' },
  { title: 'Connect', detail: 'Trade notes with student builders and meet your local AWS community.', art: 'pookalam' },
  { title: 'Discover', detail: 'Follow new questions into AI, serverless systems and modern development.', art: 'palm' },
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" className="home-arrow" fill="none">
    <path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M3 12h17m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.7"/>
  </svg>
}

function EmblemPlate() {
  return <figure className="home-art">
    <div className="home-pixel-field">
      <svg className="home-pixel-grid" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs><pattern id="event-graph" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 20V0h20" fill="none" stroke="#d9d8e1" strokeWidth="1"/>
        </pattern></defs>
        <rect width="400" height="320" fill="#f6f6f9"/>
        <rect width="400" height="320" fill="url(#event-graph)"/>
        <g shapeRendering="crispEdges">
          <path fill="#e8d8ff" d="M0 0h140v20h-20v20h-20v20H80v20H60v20H40v20H20v20H0zM400 320H260v-20h20v-20h20v-20h20v-20h20v-20h20v-20h20v-20h20z"/>
          <path fill="#cba4fa" d="M0 0h100v20H80v20H60v20H40v20H20v20H0zM400 320H300v-20h20v-20h20v-20h20v-20h20v-20h20z"/>
          <path fill="#ad5cff" d="M0 0h40v20H20v20H0zM400 320h-40v-20h20v-20h20z"/>
          <path fill="#c9bcdf" d="M340 20h20v20h-20zM360 40h20v20h-20zM20 260h20v20H20zM40 280h20v20H40z"/>
        </g>
      </svg>
      <picture className="home-emblem">
        <source media="(max-width:1100px)" srcSet="/brand/shared-gaze-standard.svg" width="512" height="512"/>
        <img src="/brand/shared-gaze-display.svg" width="720" height="720" fetchPriority="high"
          alt="Shared Gaze combines a green Kathakali face and a vermilion Theyyam-inspired face."/>
      </picture>
    </div>
    <figcaption><span><strong>Shared Gaze</strong><span className="home-art-medium">Kathakali × Theyyam</span></span><span lang="ml">കേരളം</span></figcaption>
  </figure>
}

function EventHero() {
  const access = registration()
  const words = event.title.split(' ')
  return <section className="home-hero" aria-labelledby="event-heading">
    <div className="home-width home-hero-layout">
      <div className="home-hero-copy">
        <h1 id="event-heading"><span>{words.slice(0,2).join(' ')}</span>{' '}<span>{words.slice(2,4).join(' ')}</span>{' '}<span>{words.slice(4).join(' ')}</span></h1>
        <p className="hero-distinction"><span aria-hidden="true">&gt;</span> First in Keralam.</p>
        <p className="home-intro">A student-led gathering for cloud and AI builders across Keralam. Bring a project, a question or a story to share.</p>
        <div className="home-actions">
          <a className="home-button" href={access.href || '#registration'}>{access.href ? access.label : event.phase === 'post-event' ? 'Event recap' : 'Registration details'} <Arrow/></a>
          <a className="home-text-link" href="#agenda">View agenda <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <EmblemPlate/>
    </div>
    <div className="home-dateline"><dl className="home-width">
      <div><dt>Event date</dt><dd>{event.dateLabel || 'To be announced'}</dd></div>
      <div><dt>Venue</dt><dd><a href="/venue">{event.venue?.name || 'To be announced'} <Arrow diagonal/></a></dd></div>
      <div><dt>Registration</dt><dd><a href="#registration">{access.label} <Arrow/></a></dd></div>
    </dl></div>
  </section>
}

function Introduction() {
  return <section className="home-story home-width home-section" id="experience" aria-labelledby="experience-heading">
    <div className="home-story-lead" data-reveal>
      <h2 id="experience-heading">Built by students, for builders.</h2>
      <p>Keralam’s first AWS Student Community Day brings campus cloud communities into the same room to learn from the projects, questions and experiences of other students.</p>
      <a href="/about" className="home-text-link">About the event <Arrow/></a>
    </div>
    <div className="home-experiences"><h3>What to expect</h3>
      <ul>{experiences.map(item => <li key={item.title} data-reveal>
        <img src={'/brand/' + item.art + '.svg'} width="52" height="52" alt="" loading="lazy"/>
        <div><h4>{item.title}</h4><p>{item.detail}</p></div>
      </li>)}</ul>
    </div>
  </section>
}

function Tracks() {
  return <section id="tracks" className="home-track-band" aria-labelledby="track-heading"><div className="home-width home-section home-tracks">
    <div className="home-track-lead" data-reveal>
      <h2 id="track-heading">Proposed tracks</h2>
      <p>Open a topic for a closer look. Confirmed sessions will appear in the event agenda.</p>
      <img className="home-track-flower" src="/brand/pookalam.svg" width="72" height="72" alt="" loading="lazy"/>
    </div>
    <div className="home-track-list">{tracks.map(track =>
      <details key={track.id} className="home-track"><summary>{track.title}<span className="home-toggle" aria-hidden="true"/></summary>
        <div className="home-answer"><p>{track.description}</p>{sessions.some(s=>s.trackId === track.id) &&
          <a href={'/agenda?track=' + encodeURIComponent(track.id)} className="home-text-link">Browse sessions <Arrow/></a>}</div>
      </details>)}</div>
  </div></section>
}

function Programme() {
  const populated = speakers.length > 0 || sessions.length > 0
  return <div className={'home-width home-programme home-section' + (populated ? ' home-programme-populated' : '')}>
    <section id="speakers" className="home-programme-panel" aria-labelledby="speakers-heading">
      <img className="home-programme-art" src="/brand/chenda.svg" width="52" height="52" alt="" loading="lazy"/>
      <h2 id="speakers-heading">Speakers</h2>
      {speakers.length ? <SpeakerCards/> : <div className="home-pending"><h3>Speakers to be announced</h3>
        <p>Meet the builders behind the programme as their talks and profiles are confirmed.</p></div>}
      <a className="home-text-link" href="/speakers">Speaker directory <Arrow/></a>
    </section>
    <section id="agenda" className="home-programme-panel" aria-labelledby="agenda-heading">
      <img className="home-programme-art" src="/brand/kasavu.svg" width="52" height="52" alt="" loading="lazy"/>
      <h2 id="agenda-heading">Agenda</h2>
      {sessions.length ? <div data-agenda-island=""><AgendaExplorer/></div> : <div className="home-pending"><h3>Agenda coming soon</h3>
        <p>Browse session times, rooms and speakers here once the schedule is published. All times use India Standard Time.</p></div>}
      <a className="home-text-link" href="/agenda">Full agenda <Arrow/></a>
    </section>
  </div>
}

function Organizer() {
  return <section className="home-organizer" id="organizer" aria-labelledby="organizer-heading"><div className="home-width home-organizer-inner">
    <img src={organizingGroup.logo} srcSet={organizingGroup.logoSrcSet}
      sizes="(max-width: 700px) 62px, clamp(60px, 6vw, 90px)" width="84" height="84" alt="" loading="lazy"/>
    <div><p className="home-kicker">Organized by</p><h2 id="organizer-heading">{organizingGroup.name}</h2><p>{organizingGroup.institution}</p></div>
    <a className="home-text-link" href="/about#organizing-community">Meet the organizers <Arrow/></a>
  </div></section>
}

function Registration() {
  const access = registration()
  const after = event.phase === 'post-event'
  let detail = 'The organizing team will share booking details here when they’re available.'
  if (after) detail = 'Explore the programme and published resources from this edition.'
  else if (access.href) detail = 'Visit the official registration provider for pass details and booking.'
  else if (event.registrationStatus === 'sold-out' || event.registrationStatus === 'closed' || event.phase === 'registration-closed') {
    detail = 'Find visitor information and answers to common attendee questions.'
  }
  return <section className="home-registration" id="registration" aria-labelledby="registration-heading"><div className="home-width home-registration-grid">
    <div className="home-tile-art" aria-hidden="true"><img src="/brand/mohiniyattam.svg" width="150" height="150" alt="" loading="lazy"/></div>
    <div><h2 id="registration-heading">{access.label}</h2>
      <p>{event.registrationNotes || detail}</p>{event.eligibility && <p>{event.eligibility}</p>}
      {event.recap.filter(l=>safeUrl(l.url)).map(l=><p key={l.url}><a className="home-text-link" href={l.url}>{l.label} <Arrow/></a></p>)}</div>
    <a className="home-button" href={access.href || (after ? '/agenda' : '/faq')}>{access.href ? 'Official registration' : after ? 'View programme' : 'Attendee FAQs'} <Arrow/></a>
  </div></section>
}

function AttendeeFaq() {
  return <section id="faq" className="home-width home-section home-faq" aria-labelledby="faq-heading">
    <div className="home-faq-lead" data-reveal><h2 id="faq-heading">Frequently asked questions</h2>
      <a className="home-text-link" href="/faq">Search all FAQs <Arrow/></a></div>
    <div className="home-faq-list">{faqs.slice(0,4).map(faq=>
      <details key={faq.question}><summary>{faq.question}<span aria-hidden="true" className="home-toggle"/></summary>
        <div className="home-answer"><p>{faq.answer}</p></div></details>)}</div>
  </section>
}

export default function Home({partnerGroups = [], partnerPreview = false}: {partnerGroups?: PartnerGroup[]; partnerPreview?: boolean}) {
  return <div className="home-page"><EventHero/>
    {event.announcements.length > 0 && <section className="home-width home-updates"><h2>Event updates</h2><ul>{event.announcements.map(a=><li key={a}>{a}</li>)}</ul></section>}
    <Introduction/><Tracks/><Programme/><Organizer/><PartnerShowcase groups={partnerGroups} preview={partnerPreview}/><Registration/><AttendeeFaq/>
  </div>
}
