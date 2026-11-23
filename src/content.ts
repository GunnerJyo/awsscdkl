export type Phase = 'pre-announcement' | 'registration-open' | 'registration-closed' | 'event-day' | 'post-event'
export type RegistrationStatus = 'unannounced' | 'opening-soon' | 'open' | 'limited' | 'sold-out' | 'closed'
export type Track = { id: string; title: string; description: string }
export type Link = { label: string; url: string }
export type Venue = {
  name: string; address: string; mapUrl?: string; directions?: string; transit?: string
  parking?: string; accessibility?: string; arrival?: string
}
export type Speaker = {
  id: string; name: string; role?: string; organization?: string; bio?: string
  portrait?: string; topic?: string; links?: Link[]
}
export type Session = {
  id: string; title: string; description: string; start: string; end: string
  type: string; room?: string; trackId?: string; speakerIds: string[]
}
export type EventInfo = {
  title: string; distinction: string; phase: Phase; registrationStatus: RegistrationStatus
  registrationUrl: string | null; dateLabel: string | null; startDate: string | null; endDate: string | null
  venue: Venue | null; siteUrl: string | null; contactUrl: string | null; socialLinks: Link[]
  organizers: { name: string; role: string; website?: string }[]
  eligibility: string | null; registrationNotes: string | null; announcements: string[]; recap: Link[]
  copyrightNotice: string | null
}

export const organizingGroup = {
  name: 'AWS Student Builders Group at LBSCEK',
  institution: 'LBS College of Engineering, Kasaragod',
  role: 'Event organizer',
  website: 'https://awssbg.iedclbscek.in/',
  logo: '/brand/organizer-lbscek.png',
}

export const event: EventInfo = {
  title: 'AWS Student Community Day Keralam 2027',
  distinction: "Keralam's First AWS Student Community Day",
  phase: 'pre-announcement', registrationStatus: 'unannounced', registrationUrl: null,
  dateLabel: null, startDate: null, endDate: null, venue: null, siteUrl: null,
  contactUrl: null, socialLinks: [], organizers: [organizingGroup], eligibility: null, registrationNotes: null,
  announcements: [], recap: [],
  copyrightNotice: '© 2026, Amazon Web Services, Inc. or its affiliates. All rights reserved.'
}
export const programmeSource = 'https://builder.aws.com/content/30YAgni22A4kIDUitLghmIPOlLJ/aws-student-community-days'
export const tracks: Track[] = [
  { id: 'cloud', title: 'Cloud & Infrastructure', description: 'How networks, compute and storage fit together to run an application.' },
  { id: 'ai', title: 'AI & Generative AI', description: 'Working with models, evaluating their outputs and building useful AI applications.' },
  { id: 'serverless', title: 'Serverless & Events', description: 'Designing services that respond to events and scale with demand.' },
  { id: 'devops', title: 'DevOps & Cloud Native', description: 'Releasing software, observing its behaviour and keeping services reliable.' },
  { id: 'security', title: 'Cloud Security', description: 'Protecting identities, managing permissions and making security part of everyday development.' },
  { id: 'community', title: 'Builder Stories & Community', description: 'Lessons from student projects, open-source contributions and local developer communities.' }
]
export const speakers: Speaker[] = []
export const sessions: Session[] = []
export const timeZone = 'Asia/Kolkata'

/** Approved destinations must be absolute HTTPS URLs without embedded credentials. */
export function safeUrl(value: string | null | undefined): string | null {
  if (!value || value.trim() !== value || /[\u0000-\u0020\\]/.test(value)) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null
  } catch { return null }
}

export function publicImage(value?: string): string | undefined {
  return value && /^\/(?!\/)[A-Za-z0-9/_.-]+$/.test(value) && !value.split('/').includes('..') ? value : undefined
}

export function registration(info: EventInfo = event): { label: string; href: string | null } {
  const status = info.registrationStatus
  if (info.phase === 'post-event') return { label: 'Event concluded', href: null }
  if (status === 'sold-out') return { label: 'Registration sold out', href: null }
  if (info.phase === 'registration-closed' || status === 'closed') return { label: 'Registration closed', href: null }
  if ((info.phase === 'registration-open' || info.phase === 'event-day') && (status === 'open' || status === 'limited')) {
    const href = safeUrl(info.registrationUrl)
    if (href) return { label: status === 'limited' ? 'Register · limited availability' : 'Register now', href }
  }
  return { label: status === 'opening-soon' ? 'Registration opening soon' : 'Registration to be announced', href: null }
}

const enrolment = registration()
export const faqs: { question: string; answer: string }[] = [
  { question: 'What is an AWS Student Community Day?', answer: 'A one-day conference organized by student community leaders. Students from different institutions come together to learn about cloud technology, share projects and meet other builders.' },
  { question: 'Who can attend?', answer: event.eligibility ?? 'The AWS programme is open to learners aged 18 and over across higher education institutions. The organizing team will publish local registration requirements before booking opens.' },
  { question: 'Do I need previous AWS experience?', answer: 'You can explore the event and its topics at any level. Check the description of each published session for prerequisites.' },
  { question: 'How do I register?', answer: enrolment.href ? 'Use the registration link on this website to visit the official registration provider.' : enrolment.label + '. This website will carry the official booking details.' },
  { question: 'What does registration include?', answer: event.registrationNotes ?? 'The organizing team has yet to confirm fees, refreshments, merchandise or other pass benefits. Check the published pass details before booking.' },
  { question: 'Where can I find sessions and workshops?', answer: sessions.length ? 'Browse the agenda and filter by session format, topic or speaker.' : 'The agenda will list confirmed sessions and identify any workshops, prerequisites and separate sign-ups.' },
  { question: 'Where is the event taking place?', answer: event.venue ? event.venue.name + ', ' + event.venue.address + '.' : 'The venue has yet to be announced. The venue page will carry the confirmed address and travel information.' },
  { question: 'Who organizes the event?', answer: event.organizers.length ? event.organizers.map(o => o.name + ' (' + o.role + ')').join(', ') + '.' : 'AWS Student Community Days are organized by local student community leaders and their core teams. The named organizing groups for this edition will be published when confirmed.' },
  { question: 'How can I contact the team?', answer: safeUrl(event.contactUrl) ? 'The official contact link is listed in the visitor information.' : 'The team will publish an official contact channel here when it is available.' }
]

const dayKeyFormat = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
const dayFormat = new Intl.DateTimeFormat('en-GB', { timeZone, weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
const clockFormat = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false })

export function sessionDayKey(iso: string) {
  const parts = dayKeyFormat.formatToParts(new Date(iso))
  return ['year', 'month', 'day'].map(key => parts.find(p => p.type === key)?.value).join('-')
}
export const dayLabel = (iso: string) => dayFormat.format(new Date(iso))
export const clockLabel = (iso: string) => clockFormat.format(new Date(iso))
export const durationMinutes = (s: Session) => Math.round((Date.parse(s.end) - Date.parse(s.start)) / 60000)
export type Filters = { query: string; day: string; track: string; room: string; type: string }
export const emptyFilters: Filters = { query: '', day: '', track: '', room: '', type: '' }
export function filterSessions(list: Session[], f: Filters, people: Speaker[] = speakers) {
  const words = f.query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  return list.filter(s => {
    if (f.day && sessionDayKey(s.start) !== f.day || f.track && s.trackId !== f.track || f.room && s.room !== f.room || f.type && s.type !== f.type) return false
    const names = people.filter(p => s.speakerIds.includes(p.id)).map(p => p.name)
    const text = [s.title, s.description, s.room, s.type, tracks.find(t => t.id === s.trackId)?.title, ...names].join(' ').toLowerCase()
    return words.every(word => text.includes(word))
  }).sort((a,b) => Date.parse(a.start) - Date.parse(b.start) || a.title.localeCompare(b.title))
}

