import { safeUrl } from './content'

export const partnerEdition = 2027
export type PartnerEntry = {
  id: string
  name: string
  logo?: string
  logoSmall?: string
  logoWidth?: number
  logoHeight?: number
  logoProfile: 'badge' | 'padded-badge' | 'wordmark'
  website?: string
  status: 'pending' | 'confirmed' | 'historical'
  approvedForDisplay: boolean
  edition: number
  historicalAcknowledgment?: string
}
export type PartnerRecord = PartnerEntry & {
  category: string | null
  reviewGroup: string
  sortOrder: number
  approvedForPrototype: boolean
  historicalYear?: number
}
export type PartnerGroup = { heading: string; entries: PartnerEntry[] }

export function publicPartner(record: PartnerRecord, edition = partnerEdition) {
  if (record.edition !== edition || !record.approvedForDisplay) return false
  if (record.status === 'confirmed') return !!record.category?.trim()
  return record.status === 'historical' && Number.isInteger(record.historicalYear)
    && record.historicalYear! < edition && !!record.historicalAcknowledgment?.trim()
}

// Store a filename in the registry. HTML only ever receives local image URLs.
export function partnerGroups(records: PartnerRecord[], preview = false, edition = partnerEdition): PartnerGroup[] {
  const groups = new Map<string, PartnerEntry[]>()
  const ordered = [...records].sort((a,b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
  for (const record of ordered) {
    const published = publicPartner(record, edition)
    if (!published && !(preview && record.approvedForPrototype && record.edition === edition)) continue
    let heading = record.reviewGroup
    if (published) heading = record.status === 'historical' ? 'Historical collaborations' : record.category!.trim()
    for (const filename of [record.logo, record.logoSmall]) {
      if (filename && !/^[a-z0-9][a-z0-9-]*\.(?:webp|png|svg)$/.test(filename)) {
        throw new Error('Invalid logo filename for ' + record.id)
      }
    }
    const entry: PartnerEntry = {
      id:record.id, name:record.name, logoProfile:record.logoProfile, status:record.status,
      edition:record.edition, approvedForDisplay:record.approvedForDisplay,
      logo:record.logo ? '/community-logos/'+record.logo : undefined,
      logoSmall:record.logoSmall ? '/community-logos/'+record.logoSmall : undefined,
      logoWidth:record.logoWidth, logoHeight:record.logoHeight,
      website:safeUrl(record.website) ?? undefined,
      historicalAcknowledgment:record.status === 'historical' ? record.historicalAcknowledgment : undefined,
    }
    const list = groups.get(heading)
    if (list) list.push(entry)
    else groups.set(heading,[entry])
  }
  return [...groups].map(([heading,entries]) => ({heading,entries}))
}
