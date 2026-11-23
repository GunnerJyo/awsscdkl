import type { PartnerEntry, PartnerGroup } from './partner-model'
import { publicImage, safeUrl } from './content'
import './partners.css'

type Props = { groups: PartnerGroup[]; preview?: boolean; standalone?: boolean }

function PartnerIdentity({ entry }: { entry: PartnerEntry }) {
  const logo = publicImage(entry.logo)
  const small = publicImage(entry.logoSmall)
  const website = safeUrl(entry.website)
  const sources = small && logo && entry.logoWidth ? small + ' 512w, ' + logo + ' ' + entry.logoWidth + 'w' : undefined
  const mark = logo ? <img src={logo} srcSet={sources} sizes={sources ? '(max-width: 500px) 124px, 160px' : undefined}
    width={entry.logoWidth} height={entry.logoHeight} alt="" loading="lazy" decoding="async" /> : null
  const identity = <>
    {mark && <span className={'partner-mark partner-mark-' + entry.logoProfile}>{mark}</span>}
    <span className="partner-name">{entry.name}{website && <span aria-hidden="true" className="partner-link-arrow"> ↗</span>}</span>
  </>
  return <li className={'partner-entry' + (mark ? '' : ' partner-entry-text')} data-reveal>
    {website ? <a className="partner-identity" href={website}>{identity}</a> : <div className="partner-identity">{identity}</div>}
    {entry.historicalAcknowledgment && <p className="partner-history">{entry.historicalAcknowledgment}</p>}
  </li>
}

export function PartnerShowcase({ groups, preview = false, standalone = false }: Props) {
  const visible = groups.filter(group => group.entries.length)
  const awaitingConfirmation = preview && visible.some(group => group.entries.some(entry => entry.status === 'pending'))
  const Heading = standalone ? 'h1' : 'h2'
  const id = standalone ? 'partner-directory' : 'community-partners'
  return <section className={'partner-showcase ' + (standalone ? 'partner-standalone' : 'partner-home')} id={id} aria-labelledby={id + '-heading'}>
    <header className="partner-heading">
      <Heading id={id + '-heading'} data-reveal>Our Partners &amp; Community</Heading>
      {awaitingConfirmation ? <p className="partner-announcement">2027 participation and roles are awaiting confirmation.</p> :
        !visible.length && <p className="partner-announcement">We’ll announce the communities and organizations taking part in 2027 as their roles are confirmed.</p>}
    </header>
    {visible.map(group => <div className="partner-group" key={group.heading}>
      {standalone ? <h2 className="partner-category" data-reveal>{group.heading}</h2> : <h3 className="partner-category" data-reveal>{group.heading}</h3>}
      <ul className="partner-grid">{group.entries.map(entry => <PartnerIdentity key={entry.id} entry={entry}/>)}</ul>
    </div>)}
  </section>
}
