import { hydrateRoot } from 'react-dom/client'
import { SupportingPage } from './Pages'

export function hydrateProgramme(main:HTMLElement, path:string) {
  hydrateRoot(main,<SupportingPage path={path}/>)
}

