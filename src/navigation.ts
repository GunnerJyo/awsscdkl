type MenuState = 'closed' | 'opening' | 'open' | 'closing'

/** Enhance the prerendered shell without hydrating the site-wide navigation. */
export function enableNavigation() {
  const header = document.querySelector<HTMLElement>('.site-header')
  const trigger = header?.querySelector<HTMLButtonElement>('.menu-trigger')
  const nav = header?.querySelector<HTMLElement>('#site-menu')
  const label = trigger?.querySelector<HTMLElement>('[data-label]')
  if (!header || !trigger || !nav || !label) return

  const controller = new AbortController()
  const { signal } = controller
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href]')]
  const guideLinks = [...links,...document.querySelectorAll<HTMLAnchorElement>('.rail-inner a[href]')]
  const outside = document.querySelectorAll<HTMLElement>('main, .site-rail, .site-footer, .skip-link, .quick-nav, .faq-shortcut, .site-identity')
  const root = document.documentElement
  let generation = 0
  let state: MenuState = 'closed'

  const setState = (next: MenuState) => {
    state = next
    nav.dataset.state = next
  }
  const lockPage = (lock: boolean) => {
    root.classList.toggle('menu-open', lock)
    for (const element of outside) element.inert = lock
  }
  const setTrigger = (expanded: boolean) => {
    trigger.setAttribute('aria-expanded', String(expanded))
    trigger.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu')
    label.textContent = expanded ? 'Close' : 'Menu'
  }
  const reset = () => {
    generation++
    setState('closed')
    setTrigger(false)
    nav.inert = true
    lockPage(false)
    nav.scrollTop = 0
  }

  // Follow the actual reversible CSS transition. A canceled, older transition
  // cannot finish a new gesture or navigate to a previously selected link.
  const afterWipe = (done: () => void) => {
    const id = ++generation
    const wipe = nav.getAnimations().find(animation =>
      'transitionProperty' in animation && animation.transitionProperty === 'clip-path')
    if (!wipe) { done(); return }
    void wipe.finished.catch(() => {}).then(() => { if (id === generation) done() })
  }
  const open = () => {
    lockPage(true)
    nav.inert = false
    setTrigger(true)
    setState('opening')
    links[0]?.focus({preventScroll:true})
    afterWipe(() => setState('open'))
  }
  const close = (onClosed?: () => void) => {
    setTrigger(false)
    trigger.focus({preventScroll:true})
    nav.inert = true
    setState('closing')
    afterWipe(() => {reset();onClosed?.()})
  }
  const updateLocation = () => {
    const activeSection = guideLinks.some(link => link.hash && link.pathname === location.pathname && link.hash === location.hash)
    for (const link of guideLinks) {
      const url = new URL(link.href)
      if (url.pathname === '/' && !url.hash && location.pathname === '/') {
        if (activeSection) link.removeAttribute('aria-current')
        else link.setAttribute('aria-current','page')
      }
      if (!url.hash) continue
      if (url.pathname === location.pathname && url.hash === location.hash) link.setAttribute('aria-current','location')
      else link.removeAttribute('aria-current')
    }
  }

  reset()
  updateLocation()
  trigger.addEventListener('click', () => {
    if (state === 'closed' || state === 'closing') open()
    else close()
  }, {signal})
  header.querySelector('.menu-shade')?.addEventListener('click', () => {
    if (state === 'open' || state === 'opening') close()
  }, {signal})
  nav.addEventListener('click', e => {
    const link = e.target instanceof Element && e.target.closest<HTMLAnchorElement>('a[href]')
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target || link.hasAttribute('download')) return
    const url = new URL(link.href)
    if (url.origin !== location.origin) {
      reset()
      return
    }
    e.preventDefault()
    const sameDocument = url.pathname === location.pathname && url.search === location.search && !!url.hash
    close(() => {
      location.assign(url.href)
      if (sameDocument) {
        const target = document.getElementById(url.hash.slice(1))
        if (target) {
          if (!target.hasAttribute('tabindex')) target.tabIndex = -1
          target.focus({preventScroll:true})
        }
      }
    })
  }, {signal})
  document.addEventListener('keydown', e => {
    if (state === 'closed') return
    if (e.key === 'Escape' && state !== 'closing') {e.preventDefault();close();return}
    if (e.key !== 'Tab') return
    const last = links[links.length - 1]
    if (state === 'closing') {e.preventDefault();return}
    if (e.shiftKey && document.activeElement === trigger) {
      e.preventDefault();last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();trigger.focus()
    }
  }, {signal})
  window.addEventListener('hashchange', updateLocation, {signal})
  window.addEventListener('pageshow', e => {if (e.persisted) {reset();updateLocation()}}, {signal})

  // Observe two stationary thresholds so the compact rail works in both
  // directions without polling scroll position or reacting to every pixel.
  const topBoundary = document.querySelector('#site-start')
  const compactObservers: IntersectionObserver[] = []
  const watchBoundary = (offset: number, update: (passed:boolean) => void) => {
    if (!topBoundary || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      update(!entry.isIntersecting && entry.boundingClientRect.bottom < -offset + 1)
    }, {rootMargin:offset+'px 0px 0px 0px'})
    observer.observe(topBoundary)
    compactObservers.push(observer)
  }
  header.classList.toggle('is-compact', window.scrollY > 64)
  watchBoundary(64, passed => {if (passed) header.classList.add('is-compact')})
  watchBoundary(16, passed => {if (!passed) header.classList.remove('is-compact')})

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let observer: IntersectionObserver | undefined
  const watchEntrances = () => {
    observer?.disconnect()
    if (motion.matches || !('IntersectionObserver' in window)) return
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('has-arrived')
        observer?.unobserve(entry.target)
      }
    }, {rootMargin:'0px 0px -2% 0px'})
    document.querySelectorAll('[data-reveal]:not(.has-arrived)').forEach(el => observer!.observe(el))
  }
  watchEntrances()
  motion.addEventListener('change', watchEntrances, {signal})
  if (import.meta.hot) import.meta.hot.dispose(() => {
    reset()
    controller.abort()
    compactObservers.forEach(o => o.disconnect())
    observer?.disconnect()
  })
}

