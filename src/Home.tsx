import { event, faqs, organizingGroup, registration, safeUrl, sessions, speakers, tracks } from './content'
import { PartnerShowcase } from './PartnerShowcase'
import type { PartnerGroup } from './partner-model'
import { AgendaExplorer, SpeakerCards } from './Programme'
import './home.css'

const experiences = [
  { title: 'Learn', detail: 'Get closer to the engineering decisions behind the cloud applications you use.', art: 'chenda' },
  { title: 'Build', detail: 'Explore how an idea moves from an early experiment to working software.', art: 'reed' },
  { title: 'Connect', detail: 'Find fellow student builders, trade notes and meet your local cloud community.', art: 'pookalam' },
  { title: 'Discover', detail: 'Follow new questions into AI, serverless systems and modern development.', art: 'palm' },
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg className="home-arrow" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M3 12h17m-7-7 7 7-7 7'} stroke="currentColor" strokeWidth="1.8" />
  </svg>
}
function EventHero() {
  const access = registration()
  const title = event.title.split(' ')
  return <section className="home-hero" aria-labelledby="event-heading">
    <div className="home-width home-hero-layout">
      <div className="home-hero-copy">
        <p className="home-kicker hero-distinction"><img src="/brand/step-connector.svg" alt="" width="24" height="14"/>{event.distinction}</p>
        <h1 id="event-heading"><span>{title.slice(0, 2).join(' ')}</span>{' '}<span>{title.slice(2, 4).join(' ')}</span>{' '}<span>{title.slice(4).join(' ')}</span></h1>
        <p className="home-intro">A student-led gathering for cloud and AI builders across Keralam. Bring a project, a question or a story to share.</p>
        <div className="home-actions">
          <a className="home-button" href={access.href || '#registration'}>{access.href ? access.label : event.phase === 'post-event' ? 'Event recap' : 'Registration details'} <Arrow/></a>
          <a className="home-text-link" href="#agenda">View agenda <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <figure className="home-art">
        <div className="home-print-art">
          <picture><source media="(max-width:700px)" srcSet="/brand/shared-gaze-standard.svg" width="512" height="512"/>
            <img src="/brand/shared-gaze-display.svg" width="720" height="720" fetchPriority="high" alt="Shared Gaze pairs a green Kathakali face with a vermilion Theyyam-inspired face."/></picture>
        </div>
        <figcaption><strong>Shared Gaze</strong><span>Kathakali × Theyyam</span></figcaption>
      </figure>
    </div>
    <div className="home-dateline"><dl className="home-width">
      <div><dt>Event date</dt><dd>{event.dateLabel || 'To be announced'}</dd></div>
      <div><dt>Venue</dt><dd><a href="/venue">{event.venue?.name || 'Venue to be announced'} <Arrow diagonal/></a></dd></div>
      <div><dt>Registration</dt><dd><a href="#registration">{access.label} <Arrow diagonal/></a></dd></div>
    </dl></div>
  </section>
}

function Introduction() {
  return <section className="home-width home-section home-introduction" aria-labelledby="intro-heading">
    <div className="home-story-title" data-reveal><p className="home-kicker">About the gathering</p>
      <h2 id="intro-heading">A new chapter for student builders in Keralam.</h2></div>
    <div className="home-story-body" data-reveal>
      <img src="/brand/mohiniyattam.svg" width="110" height="110" alt="Mohiniyattam dancer" loading="lazy"/>
      <p>Keralam’s first AWS Student Community Day brings campus cloud communities into the same room. Share what you’ve learned, hear how others build and find people to keep learning with.</p>
      <a className="home-text-link" href="/about">About the event <Arrow/></a>
    </div>
  </section>
}

function Experience() {
  return <section id="experience" className="home-experience" aria-labelledby="experience-heading"><div className="home-width home-section">
    <h2 id="experience-heading" data-reveal>What to expect<span>.</span></h2>
    <div className="home-experience-list">{experiences.map(item =>
      <article className="home-experience-item" data-reveal key={item.title}>
        <div className="home-experience-art"><img src={'/brand/' + item.art + '.svg'} alt="" width="82" height="82" loading="lazy"/></div>
        <h3>{item.title}</h3><p>{item.detail}</p>
      </article>
    )}</div>
  </div></section>
}

function SpeakerLineup() {
  return <section className="home-width home-section home-speakers" id="speakers" aria-labelledby="speakers-heading">
    <div className="home-section-heading" data-reveal><h2 id="speakers-heading">Speakers<span>.</span></h2>
      <a className="home-text-link" href="/speakers">Speaker directory <Arrow/></a></div>
    {speakers.length ? <SpeakerCards/> :
      <div className="home-speaker-notice" data-reveal>
        <div className="home-speaker-art" aria-hidden="true"><img src="/brand/chenda.svg" width="120" height="120" loading="lazy" alt=""/></div>
        <div><h3>Speakers to be announced</h3><p>The organizing team will introduce each speaker here, with their background and the ideas they’ll bring to the programme.</p></div>
      </div>}
  </section>
}

function Tracks() {
  return <section id="tracks" className="home-track-section" aria-labelledby="track-heading"><div className="home-width home-section home-tracks">
    <div className="home-track-intro" data-reveal><p className="home-kicker">Proposed themes</p><h2 id="track-heading">Event tracks<span>.</span></h2>
      <p>Explore the topics under consideration. Confirmed sessions will appear in the agenda.</p></div>
    <div className="home-track-list">{tracks.map(track =>
      <details key={track.id} className="home-track">
        <summary>{track.title}<span className="home-toggle" aria-hidden="true"/></summary>
        <div className="home-answer"><p>{track.description}</p>{sessions.some(s => s.trackId === track.id) &&
          <a className="home-text-link" href={'/agenda?track=' + encodeURIComponent(track.id)}>Browse sessions <Arrow/></a>}</div>
      </details>
    )}</div>
  </div></section>
}

function Agenda() {
  return <section id="agenda" className="home-width home-section home-agenda" aria-labelledby="agenda-heading">
    <div className="home-section-heading" data-reveal><h2 id="agenda-heading">Event agenda<span>.</span></h2>
      <a className="home-text-link" href="/agenda">Full agenda <Arrow/></a></div>
    {sessions.length ? <div data-agenda-island=""><AgendaExplorer/></div> :
      <div className="home-agenda-pending" data-reveal><div className="home-agenda-clock"><span>Programme time</span><b>IST</b><span>UTC +05:30</span></div>
        <div><h3>Agenda coming soon</h3><p>Session times, speakers and room details will appear here when the programme is announced.</p>
          <a href="#tracks" className="home-text-link">Explore the proposed tracks <Arrow/></a></div></div>}
  </section>
}

function Organizer() {
  return <section className="home-organizer" id="organizer" aria-labelledby="organizer-heading"><div className="home-width home-organizer-inner">
    <img src={organizingGroup.logo} alt="" width="84" height="84" loading="lazy"/>
    <div><p className="home-kicker">Organized by</p><h2 id="organizer-heading">{organizingGroup.name}</h2><p>{organizingGroup.institution}</p></div>
    <div><p>The student community bringing this edition together in Keralam.</p>
      <a className="home-text-link" href="/about#organizing-community">Meet the organizers <Arrow/></a></div>
  </div></section>
}

function Registration() {
  const access = registration()
  const after = event.phase === 'post-event'
  const detail = event.registrationNotes || (after ? 'Explore the programme and published resources from this edition.' : access.href ? 'Visit the official registration provider to see pass details and complete your booking.' : event.registrationStatus === 'closed' || event.phase === 'registration-closed' || event.registrationStatus === 'sold-out' ? 'Find visitor information and answers to common attendee questions.' : 'The organizing team will share booking details here when they’re available.')
  return <section className="home-width home-section home-registration" id="registration" aria-labelledby="registration-heading">
    <div className="home-pass" data-reveal><div className="home-pass-copy"><p className="home-kicker">{after ? 'After the event' : 'Event registration'}</p>
      <h2 id="registration-heading">{access.label}</h2><p>{detail}</p>
      {event.eligibility && <p>{event.eligibility}</p>}
      {event.recap.filter(l=>safeUrl(l.url)).map(l=><p key={l.url}><a className="home-text-link" href={l.url}>{l.label} <Arrow/></a></p>)}
      <a className="home-button" href={access.href || (after ? '/agenda' : '/faq')}>{access.href ? 'Official registration' : after ? 'View programme' : 'Attendee FAQs'} <Arrow/></a></div>
      <div className="home-pass-stub" aria-hidden="true"><img alt="" src="/brand/kasavu.svg" width="112" height="112" loading="lazy"/></div>
    </div>
  </section>
}

function AttendeeFaq() {
  return <section className="home-faq-band" id="faq" aria-labelledby="faq-heading"><div className="home-width home-section home-faq">
    <div data-reveal><p className="home-kicker">Attendee guide</p><h2 id="faq-heading">Frequently asked questions<span>.</span></h2>
      <a className="home-text-link" href="/faq">Search all FAQs <Arrow/></a></div>
    <div className="home-faq-list">{faqs.slice(0, 4).map(faq =>
      <details key={faq.question}><summary>{faq.question}<span className="home-toggle" aria-hidden="true"/></summary>
        <div className="home-answer"><p>{faq.answer}</p></div></details>)}</div>
  </div></section>
}

export default function Home({partnerGroups = [], partnerPreview = false}: {partnerGroups?: PartnerGroup[]; partnerPreview?: boolean}) {
  return <div className="home-page"><EventHero/>
    {event.announcements.length > 0 && <section className="home-width home-updates"><h2>Event updates</h2><ul>{event.announcements.map(a=><li key={a}>{a}</li>)}</ul></section>}
    <Introduction/><Experience/><SpeakerLineup/><Tracks/><Agenda/><Organizer/><Registration/>
    <PartnerShowcase groups={partnerGroups} preview={partnerPreview}/><AttendeeFaq/>
  </div>
}
