import './global.css'
import './home.css'
import './pages.css'
import { enableNavigation } from './navigation'

enableNavigation()
const main=document.querySelector<HTMLElement>('main[data-interactive="true"]')
if (main) {
  const path=window.location.pathname.replace(/\/+$/,'') || '/'
  void import('./hydrate').then(({hydrateProgramme})=>hydrateProgramme(main,path))
}
