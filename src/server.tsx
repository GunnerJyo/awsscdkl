import { renderToString } from 'react-dom/server'
import { App } from './App'
import { event, speakers, safeUrl } from './content'
import { registryFor } from '../organizer/preview'
import { partnerGroups } from './partner-model'
import type { PartnerRecord } from './partner-model'

export function partnerAssets(preview = false) {
  return new Set(partnerGroups(registryFor(preview), preview)
    .flatMap(group => group.entries.flatMap(entry => [entry.logo,entry.logoSmall,entry.logoThumbnail].filter(Boolean))))
}

const pages:Record<string,[string,string]> = {
  '/': [event.title, "Keralam's first AWS Student Community Day brings student builders across Keralam together to learn about cloud technology, share projects and meet their communities."],
  '/about': ['About the event', 'Meet the student community behind the first edition in Keralam and discover the purpose of AWS Student Community Days.'],
  '/speakers': ['Speakers', 'Explore the speaker lineup and speaker profiles as the programme is announced.'],
  '/agenda': ['Agenda', 'Explore the event programme and find published sessions by day, room, track, speaker and format.'],
  '/partners': ['Organizers and partners', 'Find the published list of organizing communities and event partners.'],
  '/venue': ['Venue and travel', 'Find venue announcements, accessible arrival information and travel guidance.'],
  '/faq': ['Frequently asked questions', 'Read answers about attending, registration, the programme and venue.'],
  '/code-of-conduct': ['Code of conduct', 'Read the expectations for respectful participation at this student community event.'],
  '/privacy': ['Privacy', 'Learn how this event website handles browsing, external links and registration.']
}
export const routes = [...Object.keys(pages), ...speakers.map(s => '/speakers/'+s.id)]
export const origin = (() => {
  const url = safeUrl(event.siteUrl)
  return url ? new URL(url).origin : null
})()
export function escapeHtml(s:string) {
  return s.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!))
}
function jsonLD(data:object) {
  return '<script type="application/ld+json">'+JSON.stringify(data).replace(/</g,'\\u003c')+'</script>'
}
export function renderRoute(path:string, registry:PartnerRecord[] | undefined = undefined, preview = false) {
  const speaker = speakers.find(s => path==='/speakers/'+s.id)
  const isPage = routes.includes(path)
  const [label,description] = pages[path] ?? (speaker ? [speaker.name,speaker.bio || 'Speaker profile and published sessions.'] : ['Page not found','Return to the event homepage or browse the programme.'])
  const title = escapeHtml(path==='/' ? label : label+' | '+event.title)
  const desc=escapeHtml(description)
  const canonical = origin && isPage && !preview ? origin + path : null
  const image=escapeHtml((origin || '')+'/brand/social-preview.png')
  const name=escapeHtml(event.title)
  let head = '<title>'+title+'</title><meta name="description" content="'+desc+'"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+desc+'"><meta property="og:site_name" content="'+name+'"><meta property="og:type" content="website"><meta property="og:image" content="'+image+'"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="'+name+' with the Shared Gaze cultural emblem"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+title+'"><meta name="twitter:description" content="'+desc+'"><meta name="twitter:image" content="'+image+'">'
  head += '<link rel="preload" as="font" type="font/woff2" href="/brand/fonts/IBMPlexSans-core.woff2" crossorigin>'
  head += '<link rel="preload" as="font" type="font/woff2" href="/brand/fonts/IBMPlexMono-Regular-core.woff2" crossorigin>'
  if (path === '/') {
    head += '<link rel="preload" as="image" media="(width > 1100px)" href="/brand/shared-gaze-display.svg" fetchpriority="high">'
    head += '<link rel="preload" as="image" media="(width <= 1100px)" href="/brand/shared-gaze-standard.svg" fetchpriority="high">'
  }
  if (canonical) head += '<link rel="canonical" href="'+escapeHtml(canonical)+'"><meta property="og:url" content="'+escapeHtml(canonical)+'">'
  if (!isPage || preview) head += '<meta name="robots" content="noindex,nofollow">'
  if (path==='/' && canonical) {
    head += jsonLD({'@context':'https://schema.org','@type':'WebSite',name:event.title,url:canonical})
    if (event.startDate && event.venue?.name && event.venue.address && Number.isFinite(Date.parse(event.startDate))) {
      head += jsonLD({'@context':'https://schema.org','@type':'Event',name:event.title,startDate:event.startDate,...(event.endDate?{endDate:event.endDate}:{}),url:canonical,location:{'@type':'Place',name:event.venue.name,address:event.venue.address},description,image:origin+'/brand/social-preview.png'})
    }
  }
  const groups = path === '/' || path === '/partners' ? partnerGroups(registry ?? registryFor(preview), preview) : []
  return { html:renderToString(<App path={path} partnerGroups={groups} partnerPreview={preview}/>), head, status:isPage ? 200 : 404 }
}

