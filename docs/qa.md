# Website verification

AWS Student Community Day Keralam 2027 was tested on 22 November 2026 against the local production build. All nine routes passed at eleven widths. Chrome captured the original site at 390 and 1440 pixels before the revision. At 390 pixels, the approved hero artwork went from 350 to 187 pixels wide. The revised call to action ends 398 pixels from the top, followed by registration status and the complete illustration. [Mobile comparison](screenshots/compare-mobile.png) · [Desktop comparison](screenshots/compare-desktop.png)

## Navigation, content and accessibility

| Check | Measured result |
| --- | --- |
| Responsive routes | 99 of 99 combinations passed at widths of 320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440 and 1920 px. Each returned HTTP 200, a unique page title, a description, one main heading, valid image sources and a layout within the viewport. |
| Tablet correction | A 5 px overflow on About at 768 px led to a fluid width for the supporting-page illustration. A separate Edge run checked all nine pages at twelve adjacent tablet widths. All 108 checks passed. |
| Policy and footer | The exact 2026 AWS copyright notice and a visible Code of Conduct link were verified across the 99 views. The open mobile menu also exposes the Code of Conduct. |
| Navigation and metadata | All 31 discovered local destinations and anchor targets resolved. The server returned 404 for an unknown route. Browser tests recorded zero page errors. |
| Mobile drawer | Nine viewport configurations included 320 × 480 and landscape at 667 × 375 and 844 × 390. Opening, keyboard focus, scroll locking and Escape focus restoration passed in each. Keyboard activation of Agenda navigated to the correct page. |
| Content and forms | All four content tests passed. FAQ search, clearing, native disclosures and public proposed tracks worked. A private Vite fixture tested registration, a speaker profile, and agenda search plus day, room, topic and format filters. The day and track controls span the phone filter group. The selected Cloud & Infrastructure label fit at 320, 360, 390, 430 and 480 px. The programme correctly grouped a UTC-midnight case by its date in India. |
| Automated accessibility | axe-core 4.10.3 ran WCAG A/AA rule tags through 2.2 on all nine routes at 390 and 1440 px and on the open drawer. All 19 audits returned zero rule violations. Keyboard tests also verified the skip link, visible outline, native Enter/Space controls and menu focus restoration. |
| Reduced motion and fallback | With reduced motion, scrolling left zero hidden editorial elements and zero active animations longer than 5 ms. With JavaScript disabled, the title, hero action and footer navigation remained accessible. |
| Visual inspection | The mobile and desktop hero, drawer, footer, Agenda interaction and full-length views of every supporting route were inspected in Chromium-based browsers. |

## Motion and performance

The sticky desktop bar measures 88 px at the top and 68 px after scrolling. Chrome recorded actual starts and ends for hero, caption, section and signature-strip entrances. A one-second smooth-scroll sample at 390 px produced 145 animation-frame intervals. The median was 6.9 ms and the longest was 7.1 ms on the test host. The Event Timing API reported a maximum of 16 ms across the qualifying events during 19 menu, disclosure and search interactions. [Header and scroll demonstration](screenshots/header-scroll-demo.mp4)

| Cold homepage profile | Performance | Accessibility | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile, median of three | 99 | 100 | 100 | 2.11 s | 0 | 0 ms |
| Desktop, one navigation | 100 | 100 | 100 | 0.13 s | 0.000013 | 0 ms |

Lighthouse 12.8.2 ran in headless Chrome 157 through an HTTPS loopback proxy serving the production output. Mobile used Lighthouse's default simulated profile. Desktop used 1440 × 900 and the host CPU and connection. Mobile LCP readings were 2.113, 1.957 and 2.107 seconds. The previous handoff reported 1.88 seconds with the same mobile profile. The initial JavaScript bundle increased from 1,305 to 1,913 bytes with Brotli compression. The React bundle is still deferred to routes with live interactive content.

These measurements describe this local test environment. Real-device Safari and Android hardware, assistive-technology sessions, public-host performance and field INP remain unmeasured.

## Browser captures

| View | Evidence |
| --- | --- |
| Homepage | [Initial desktop](screenshots/hero-desktop.png) · [320 px](screenshots/hero-320.png) · [390 px](screenshots/hero-390.png) · [Corrected artwork](screenshots/hero-art-390.png) |
| Navigation and motion | [Open menu](screenshots/menu-open-390.png) · [Compact desktop header](screenshots/header-scrolled.png) · [AWS placement](screenshots/header-identity.png) · [Experience section](screenshots/experience-section.png) · [Browser recording](screenshots/header-scroll-demo.mp4) |
| Agenda | [Public mobile disclosure](screenshots/agenda-mobile.png) · [Track filter with private test records](screenshots/agenda-filter-private-fixture.png) |
| Footer and complete pages | [Desktop footer](screenshots/footer-desktop.png) · [Full desktop](screenshots/home-full.png) · [Full mobile](screenshots/home-full-mobile.png) · [Mobile FAQ](screenshots/faq-mobile.png) · [Desktop About](screenshots/about-desktop.png) |
| Previous design | [Before desktop](screenshots/before/home-1440.png) · [Before mobile](screenshots/before/home-390.png) · [Before footer](screenshots/before/footer-1440.png) |

## Reproduce the core checks

From the website directory, run `npm ci`, `npm test`, `npm run build` and `npm run preview`. In another terminal run `npm run test:browser`. The preview and suite default to port 4173. Set `TEST_URL` to another running origin when needed.

Install Chromium with `npx playwright install chromium` or set `BROWSER_PATH` to a local Chromium-based browser. Point `AXE_SCRIPT` at an installed axe-core script to enable the rules above. `UPDATE_SCREENSHOTS=1` refreshes core captures and `QA_RESULT` selects a JSON results file. `PROGRAMME_ONLY=1` runs the agenda, speaker and registration fixtures and the five mobile select-width checks independently. Private programme fixtures run on a separate loopback Vite server for the duration of the suite.
