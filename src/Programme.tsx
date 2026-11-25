import { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import {
  clockLabel, dayLabel, durationMinutes, emptyFilters, filterSessions, publicImage, safeUrl,
  sessionDayKey, sessions, speakers, tracks, type Filters, type Session, type Speaker
} from './content'
import './programme.css'

export const speakerPath = (id: string) => '/speakers/' + encodeURIComponent(id)
const unique = (values: string[]) => [...new Set(values.filter(Boolean))].sort()

export function SpeakerCards({ people = speakers }: { people?: Speaker[] }) {
  return <div className="speaker-wall">{people.map(person => {
    const portrait = publicImage(person.portrait)
    const appearances = sessions.filter(s => s.speakerIds.includes(person.id))
    const links = (person.links ?? []).filter(link => safeUrl(link.url))
    return <article className="speaker-print" key={person.id}>
      {portrait && <a className="speaker-portrait" href={speakerPath(person.id)} tabIndex={-1} aria-hidden="true">
        <img loading="lazy" decoding="async" width="480" height="384" src={portrait} alt=""/>
      </a>}
      <h3><a href={speakerPath(person.id)}>{person.name}</a></h3>
      {(person.role || person.organization) && <p className="speaker-role">{[person.role, person.organization].filter(Boolean).join(' · ')}</p>}
      {appearances.length > 0 ? <ul className="speaker-topics" aria-label="Published sessions">
        {appearances.map(s => <li key={s.id}><span>{[s.type, tracks.find(t => t.id === s.trackId)?.title].filter(Boolean).join(' / ')}</span>
          <a href={'/agenda#session-' + s.id}>{s.title}</a></li>)}</ul> :
        person.topic && <p className="speaker-topic">{person.topic}</p>}
      {links.length > 0 && <ul className="speaker-social" aria-label={'Links for ' + person.name}>{links.map(link =>
        <li key={link.url}><a href={safeUrl(link.url)!}>{link.label} <span aria-hidden="true">↗</span></a></li>)}</ul>}
    </article>
  })}</div>
}

export function SessionCard({ session: s }: { session: Session }) {
  const people = speakers.filter(person => s.speakerIds.includes(person.id))
  const category = [s.type, tracks.find(t => t.id === s.trackId)?.title].filter(Boolean).join(' / ')
  return <article className="session-entry" id={'session-' + s.id}>
    <div className="session-hours">
      <strong><time dateTime={s.start}>{clockLabel(s.start)}</time><span>–</span><time dateTime={s.end}>{clockLabel(s.end)}</time></strong>
      {sessionDayKey(s.start) !== sessionDayKey(s.end) && <span>Ends {dayLabel(s.end)}</span>}
      <span>{durationMinutes(s)} min{s.room && ' · ' + s.room}</span>
    </div>
    <div className="session-copy">{category && <p className="session-category">{category}</p>}
      <h4>{s.title}</h4><p>{s.description}</p>
      {people.length > 0 && <ul aria-label="Session speakers">{people.map(p =>
        <li key={p.id}><a href={speakerPath(p.id)}>{p.name}</a></li>)}</ul>}
    </div>
  </article>
}

export function Timeline({ items }: { items: Session[] }) {
  const byDay = new Map<string,Session[]>()
  for (const item of items) {
    const day = sessionDayKey(item.start)
    const entries = byDay.get(day)
    if (entries) entries.push(item)
    else byDay.set(day,[item])
  }
  return <div className="session-days">{Array.from(byDay,([day, entries]) =>
    <section className="session-day" key={day}><h3>{dayLabel(entries[0].start)} <span>IST</span></h3>
      {entries.map(s => <SessionCard session={s} key={s.id}/>)}</section>)}</div>
}

type Option = { value:string; label:string }
function SelectFilter({ label, value, options, change, className = '' }: {
  label:string; value:string; options:Option[]; change:(value:string)=>void; className?:string
}) {
  return <label className={'directory-field ' + className}>{label}
    <select name={label.toLowerCase()} value={value} onChange={e => change(e.target.value)}>
      <option value="">All {label.toLowerCase()}</option>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select></label>
}

export function AgendaExplorer() {
  const [filters,setFilters] = useState<Filters>(emptyFilters)
  useEffect(() => {
    const track = new URLSearchParams(window.location.search).get('track')
    if (track && sessions.some(s => s.trackId === track) && tracks.some(t => t.id === track))
      setFilters(f => ({...f, track}))
  }, [])
  const change = (key:keyof Filters, value:string) => setFilters(f => ({...f, [key]:value}))
  const trackOptions = tracks.filter(t => sessions.some(s => s.trackId === t.id)).map(t => ({value:t.id,label:t.title}))
  const dayOptions = [...new Map(sessions.map(s => [sessionDayKey(s.start), dayLabel(s.start)])).entries()]
    .sort(([a],[b]) => a.localeCompare(b)).map(([value,label]) => ({value,label}))
  const rooms = unique(sessions.map(s => s.room ?? '')).map(value => ({value, label:value}))
  const formats = unique(sessions.map(s => s.type)).map(value => ({value, label:value}))
  const shown = filterSessions(sessions,filters)
  return <div className="agenda-explorer">
    {trackOptions.length > 0 && <fieldset className="agenda-tabs"><legend>Tracks</legend>
      {[{ value:'', label:'All tracks' }, ...trackOptions].map(option => <label key={option.value}>
        <input type="radio" name="session-track" value={option.value} checked={filters.track === option.value} onChange={() => change('track',option.value)}/>
        <span>{option.label}</span></label>)}</fieldset>}
    <div className="agenda-controls">
      <label className="directory-field directory-search">Search sessions or speakers
        <input type="search" value={filters.query} onChange={e => change('query',e.target.value)}/></label>
      {dayOptions.length > 1 && <SelectFilter label="Days" options={dayOptions} value={filters.day} change={v => change('day',v)}/>}
      {trackOptions.length > 0 && <SelectFilter className="track-select" label="Tracks" options={trackOptions} value={filters.track} change={v => change('track',v)}/>}
      {rooms.length > 1 && <SelectFilter label="Rooms" options={rooms} value={filters.room} change={v => change('room',v)}/>}
      {formats.length > 0 && <SelectFilter label="Formats" options={formats} value={filters.type} change={v => change('type',v)}/>}
    </div>
    <div className="directory-status"><p role="status">{shown.length} {shown.length === 1 ? 'session' : 'sessions'} · India Standard Time</p>
      {Object.values(filters).some(Boolean) && <Button variant="link" type="button" onClick={() => setFilters(emptyFilters)}>Clear filters</Button>}</div>
    {shown.length ? <Timeline items={shown}/> : <p className="directory-zero">No sessions match your selection. Try another track, speaker or format.</p>}
  </div>
}
