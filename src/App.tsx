import Home from './Home'
import { SupportingPage } from './Pages'
import { event, registration, safeUrl, speakers, sessions } from './content'
import type { PartnerGroup } from './partner-model'
import './global.css'

type MenuLink = readonly [label: string, href: string]
const programme: MenuLink[] = [
  ['About', '/about'], ['Experience', '/#experience'], ['Tracks', '/#tracks'],
  ['Speakers', '/speakers'], ['Agenda', '/agenda'],
]
const attendee: MenuLink[] = [
  ['Partners', '/partners'], ['Venue', '/venue'], ['Event FAQ', '/faq'],
  ['Code of Conduct', '/code-of-conduct'], ['Privacy', '/privacy'],
]
const shortcuts = [programme[0], programme[1], programme[3], programme[4], attendee[0]]

function EventLogo() {
  return <img className="event-lockup" src="/brand/primary.png" width="635" height="180" alt={event.title} />
}

function current(path: string, href: string) {
  return path === href || (href === '/speakers' && path.startsWith('/speakers/')) ? 'page' : undefined
}

function MenuGroup({title, links, path}: {title: string; links: MenuLink[]; path: string}) {
  return <div className="menu-group">
    <p className="menu-group-title">{title}</p>
    <ul aria-label={title}>{links.map(([label, href]) =>
      <li className="menu-item" key={href}>
        <a href={href} aria-current={current(path, href)}>{label}<span aria-hidden="true">↗</span></a>
      </li>
    )}</ul>
  </div>
}

function SiteHeader({path}: {path: string}) {
  const access = registration()
  const visit: MenuLink[] = access.href ? [...attendee, ['Register', access.href]] : attendee
  return <header className="site-header">
    <div className="menu-shade" aria-hidden="true"></div>
    <div className="site-header-bar">
      <div className="site-header-inner">
        <a className="site-identity" href="/" aria-label={event.title + ' home'}><EventLogo/></a>
        <nav className="quick-nav" aria-label="Event shortcuts">
          {shortcuts.map(([label, href]) => <a key={href} href={href} aria-current={current(path, href)}>{label}</a>)}
          {access.href && <a className="registration-link" href={access.href}>Register <span aria-hidden="true">↗</span></a>}
        </nav>
        <div className="header-affiliation">
          <img className="aws-mark" src="/brand/aws-logo-rgb.png" width="1254" height="750" alt="Amazon Web Services" />
        </div>
        <button className="menu-trigger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-menu">
          <span data-label>Menu</span><span className="menu-glyph" aria-hidden="true"></span>
        </button>
      </div>
      <nav aria-label="Main" id="site-menu" className="site-nav" data-state="closed">
        <div className="menu-interior">
          <MenuGroup title="The conference" links={programme} path={path}/>
          <MenuGroup title="Attendee guide" links={visit} path={path}/>
        </div>
        <div className="menu-accent"><img src="/brand/wide-signature.svg" width="2400" height="48" alt=""/></div>
      </nav>
    </div>
  </header>
}

function SiteFooter() {
  const contact = safeUrl(event.contactUrl)
  return <footer className="site-footer" data-reveal="">
    <div className="site-footer-inner">
      <EventLogo/>
      <nav className="footer-links" aria-label="Event information">
        <a href="/about">About</a><a href="/code-of-conduct">Code of Conduct</a><a href="/privacy">Privacy</a>
        {contact && <a href={contact}>Contact</a>}
      </nav>
      {event.copyrightNotice && <p className="footer-credit">{event.copyrightNotice}</p>}
    </div>
    <picture className="footer-strip-wrap">
      <source media="(min-width:701px)" srcSet="/brand/wide-signature.svg" width="2400" height="48"/>
      <img className="site-footer-strip" src="/brand/signature.svg" alt="" width="1280" height="90" loading="lazy"/>
    </picture>
  </footer>
}

type AppProps = {path: string; partnerGroups: PartnerGroup[]; partnerPreview?: boolean}

export function App({path, partnerGroups, partnerPreview = false}: AppProps) {
  const interactive = path === '/faq' || (path === '/agenda' && sessions.length > 0) || (path === '/speakers' && speakers.length > 0)
  return <>
    <div id="site-start" tabIndex={-1}></div>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <SiteHeader path={path}/>
    <main id="main-content" tabIndex={-1} data-interactive={interactive || undefined}>
      {path === '/' ? <Home partnerGroups={partnerGroups} partnerPreview={partnerPreview}/> :
        <SupportingPage path={path} partnerGroups={partnerGroups} partnerPreview={partnerPreview}/>}
    </main>
    <SiteFooter/>
  </>
}

