import { partnerRegistry } from './partners'
import type { PartnerRecord } from '../src/partner-model'

// The optional registry is used only by the local server and prototype export.
const local = import.meta.glob<{ partnerRegistry: PartnerRecord[] }>('./partners.local.ts', { eager: true })
export function registryFor(preview: boolean): PartnerRecord[] {
  if (!preview) return partnerRegistry
  const publicIds = new Set(partnerRegistry.map(record => record.id))
  const extra = local['./partners.local.ts']?.partnerRegistry ?? []
  return [...partnerRegistry, ...extra.filter(record => !publicIds.has(record.id))]
}
