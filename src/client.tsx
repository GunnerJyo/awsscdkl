import './global.css'
import './home.css'
import './pages.css'
import './programme.css'
import './partners.css'
import { enableNavigation } from './navigation'

enableNavigation()

const directory = document.querySelector<HTMLElement>('main[data-interactive="true"]')
const agenda = document.querySelector<HTMLElement>('[data-agenda-island]')
if (directory || agenda) {
  void import('./hydrate').then(({ hydrateDirectory, hydrateAgenda }) => {
    if (directory) hydrateDirectory(directory, location.pathname.replace(/\/+$/, '') || '/')
    else if (agenda) hydrateAgenda(agenda)
  })
}
