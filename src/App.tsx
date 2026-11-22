import Home from './Home'
import { SupportingPage } from './Pages'
import { event, registration, safeUrl, speakers, sessions } from './content'
import './global.css'

const primary = [
  ['About', '/about'], ['Tracks', '/#tracks'], ['Speakers', '/speakers'],
  ['Agenda', '/agenda'], ['Partners', '/partners'],
] as const
const communityUrl = 'https://builder.aws.com/community/student-builder-groups'

function Identity() {
  return <a className="site-identity" href="/" aria-label={event.title + ' home'}>
    <img src="/brand/primary.png" width="635" height="180" alt={event.title} />
  </a>
}

function AwsMark() {
  return <img className="aws-mark" src="/brand/aws-logo-rgb.png" width="1254" height="750" alt="Amazon Web Services" />
}

function SiteHeader({path}:{path:string}) {
  const access = registration()
  const active = (href:string) => path === href || (href === '/speakers' && path.startsWith('/speakers/'))
  return <header className="site-header">
    <div className="menu-shade" aria-hidden="true"></div>
    <div className="site-header-bar"><div className="site-header-inner">
      <Identity/>
      <button className="menu-trigger" type="button" aria-expanded="false" aria-controls="site-menu">
        <span data-label>Menu</span><span className="menu-glyph" aria-hidden="true"></span>
      </button>
      <nav aria-label="Main" id="site-menu" className="site-nav">
        <div className="site-nav-links">
          {primary.map(([label,href]) => <a key={href} href={href} aria-current={active(href) ? 'page' : undefined}>{label}</a>)}
          <a href="/venue" className="site-mobile-link" aria-current={active('/venue') ? 'page' : undefined}>Venue</a>
          <a href="/#experience" className="site-mobile-link">Experience</a>
          <a href="/code-of-conduct" className="site-mobile-link" aria-current={active('/code-of-conduct') ? 'page' : undefined}>Code of Conduct</a>
        </div>
        <a className="site-nav-action" href={access.href || '/faq'} aria-current={!access.href && path === '/faq' ? 'page' : undefined}>
          {access.href ? 'Register' : 'Event FAQ'} <span aria-hidden="true">{access.href ? '↗' : '→'}</span>
        </a>
        <img className="menu-strip" src="/brand/signature.svg" width="1280" height="90" alt="" />
      </nav>
      <div className="header-affiliation"><AwsMark/></div>
    </div></div>
  </header>
}

function SiteFooter() {
  return <footer className="site-footer">
    <div className="site-footer-inner">
      <div className="footer-mast" data-reveal="">
        <div className="footer-event">
          <img className="footer-emblem" src="/brand/shared-gaze-standard.svg" width="512" height="512" loading="lazy" alt=""/>
          <a href="/" className="footer-event-name">{event.title}</a>
        </div>
        <div className="footer-affiliation"><AwsMark/><span>AWS Student Builder Groups<br/>community event</span></div>
      </div>
      <div className="footer-directory" data-reveal="">
        <nav aria-label="Explore event"><h2>Programme</h2>
          <a href="/about">About the event</a><a href="/#experience">Experience</a><a href="/#tracks">Tracks</a><a href="/speakers">Speakers</a><a href="/agenda">Agenda</a>
        </nav>
        <nav aria-label="Visitor information"><h2>Attendee guide</h2>
          <a href="/venue">Venue &amp; travel</a><a href="/#registration">Registration</a><a href="/faq">Frequently asked questions</a><a href="/code-of-conduct">Code of Conduct</a><a href="/privacy">Privacy</a>
        </nav>
        <nav aria-label="Community"><h2>Community</h2>
          <a href="/partners">Organizers &amp; partners</a>
          <a href="https://builder.aws.com/">AWS Builder Center <span aria-hidden="true">↗</span></a>
          <a href={communityUrl}>AWS Student Builder Groups <span aria-hidden="true">↗</span></a>
          {safeUrl(event.contactUrl) && <a href={event.contactUrl!}>Contact the team</a>}
          {event.socialLinks.filter(v=>safeUrl(v.url)).map(v=><a key={v.url} href={v.url}>{v.label}</a>)}
        </nav>
        <a className="back-to-top" href="#site-start">Back to top <span aria-hidden="true">↑</span></a>
      </div>
      <div className="footer-credit">
        {event.organizers.length > 0 && <p>Organized by {event.organizers.map(o=>o.name).join(' · ')}.</p>}
        {event.copyrightNotice && <p>{event.copyrightNotice}</p>}
        <p>Amazon Web Services, AWS, and the AWS logo are trademarks of Amazon.com, Inc. or its affiliates.</p>
      </div>
    </div>
    <div className="footer-strip-wrap" data-reveal=""><img className="site-footer-strip" src="/brand/signature.svg" alt="" width="1280" height="90" loading="lazy"/></div>
  </footer>
}

export function App({path}:{path:string}) {
  return <><div id="site-start" tabIndex={-1}></div><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader path={path}/>
    <main id="main-content" tabIndex={-1} data-interactive={path==='/faq' || (path==='/agenda' && sessions.length>0) || (path==='/speakers' && speakers.length>0) ? 'true' : undefined}>{path==='/' ? <Home/> : <SupportingPage path={path}/>}</main>
    <SiteFooter/></>
}

