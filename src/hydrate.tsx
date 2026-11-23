import { hydrateRoot } from 'react-dom/client'
import { SupportingPage } from './Pages'
import { AgendaExplorer } from './Programme'

export function hydrateDirectory(container: HTMLElement, path: string) {
  hydrateRoot(container, <SupportingPage path={path}/>)
}

export function hydrateAgenda(container: HTMLElement) {
  hydrateRoot(container, <AgendaExplorer/>)
}
