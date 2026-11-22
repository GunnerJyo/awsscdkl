/** Enhance the prerendered shell without loading React on informational pages. */
export function enableNavigation() {
  const header = document.querySelector<HTMLElement>('.site-header')
  const trigger = header?.querySelector<HTMLButtonElement>('.menu-trigger')
  const nav = header?.querySelector<HTMLElement>('#site-menu')
  const label = trigger?.querySelector<HTMLElement>('[data-label]')
  if (!header || !trigger || !nav || !label) return

  const controller = new AbortController()
  const { signal } = controller
  const mobile = window.matchMedia('(max-width:950px)')
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href]'))
  const background = document.querySelectorAll<HTMLElement>('main, .site-footer, .skip-link')
  let opened = false

  function setOpen(next:boolean, restoreFocus = false) {
    opened = next
    trigger!.setAttribute('aria-expanded', String(next))
    // A stable, descriptive accessible name also distinguishes the close action.
    trigger!.setAttribute('aria-label', next ? 'Close menu' : 'Open menu')
    label!.textContent = next ? 'Close' : 'Menu'
    if (restoreFocus) trigger!.focus({preventScroll:true})
    nav!.inert = mobile.matches && !next
    nav!.classList.toggle('is-open', next)
    document.documentElement.classList.toggle('menu-open', next)
    background.forEach(el => {el.inert = next})
  }
  function updateLocation() {
    for (const link of links) {
      const url = new URL(link.href)
      if (!url.hash) continue
      if (url.pathname === location.pathname && url.hash === location.hash) {
        link.setAttribute('aria-current','location')
      } else {
        link.removeAttribute('aria-current')
      }
    }
  }
  setOpen(false)
  updateLocation()
  trigger.addEventListener('click', () => setOpen(!opened), {signal})
  header.querySelector('.menu-shade')?.addEventListener('click', () => setOpen(false, true), {signal})
  nav.addEventListener('click', e => {
    const link = e.target instanceof Element && e.target.closest<HTMLAnchorElement>('a')
    if (!opened || !link || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    setOpen(false, true)
    const url = new URL(link.href)
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
      const target = document.getElementById(url.hash.slice(1))
      if (target) {
        if (!target.hasAttribute('tabindex')) target.tabIndex = -1
        target.focus({preventScroll:true})
      }
    }
  }, {signal})
  document.addEventListener('keydown', e => {
    if (!opened) return
    if (e.key === 'Escape') {e.preventDefault();setOpen(false, true);return}
    if (e.key !== 'Tab') return
    const first = trigger
    const last = links[links.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();first.focus()
    }
  }, {signal})
  mobile.addEventListener('change', () => {
    const focusWasInside = nav.contains(document.activeElement)
    setOpen(false, mobile.matches && focusWasInside)
  }, {signal})
  window.addEventListener('hashchange', updateLocation, {signal})
  window.addEventListener('pageshow', () => {setOpen(false);updateLocation()}, {signal})

  // Hysteresis keeps small trackpad reversals from repeatedly toggling the rail.
  let compact = false
  function updateHeader() {
    const next = compact ? window.scrollY > 16 : window.scrollY > 64
    if (next !== compact) {
      compact = next
      header!.classList.toggle('is-compact', compact)
    }
  }
  updateHeader()
  window.addEventListener('scroll', updateHeader, {passive:true, signal})

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let observer: IntersectionObserver | undefined
  function watchEntrances() {
    observer?.disconnect()
    if (motion.matches || !('IntersectionObserver' in window)) return
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('has-arrived')
        observer?.unobserve(entry.target)
      }
    }, {rootMargin:'0px 0px -2% 0px', threshold:0})
    document.querySelectorAll('[data-reveal]:not(.has-arrived)').forEach(el => observer!.observe(el))
  }
  watchEntrances()
  motion.addEventListener('change', watchEntrances, {signal})
  if (import.meta.hot) import.meta.hot.dispose(() => {
    setOpen(false)
    controller.abort()
    observer?.disconnect()
  })
}

