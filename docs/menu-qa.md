# Header, menu and footer verification

Verified the 22 November 2026 production build in Chrome. Both directions of the menu wipe were recorded at desktop and phone sizes. Measurements below run from the input event to the first sampled frame in the settled state. The phone recording used touch input and Chrome mobile emulation. [Desktop recording](screenshots/menu-revision/menu-1440.mp4) · [Phone recording](screenshots/menu-revision/menu-390.mp4)

| Viewport | Open | Close | Distinct panel shapes during open / close | Header at top → scrolled → top |
| --- | ---: | ---: | ---: | --- |
| 1440 × 900 | 487 ms | 369 ms | 70 / 52 | 88 → 64 → 88 px |
| 390 × 844 | 488 ms | 370 ms | 69 / 52 | 64 → 54 → 64 px |

Both hamburger strokes transitioned in each direction. The first and last rows started their entrances about 160 ms apart and their exits about 34–35 ms apart. The first row reached 40 distinct opacity samples on entrance and 24 on exit. Midpoint stills were selected from actual captured frames near half of the panel's geometric reveal. Each H.264 demonstration runs 2.77 seconds at 30 frames per second.

| State | Desktop | Phone |
| --- | --- | --- |
| Closed | [At page top](screenshots/menu-revision/menu-closed-1440.png) | [At page top](screenshots/menu-revision/menu-closed-390.png) |
| Opening | [Opening frame](screenshots/menu-revision/menu-opening-1440.png) | [Opening frame](screenshots/menu-revision/menu-opening-390.png) |
| Open | [Full navigation](screenshots/menu-revision/menu-open-1440.png) | [Full navigation](screenshots/menu-revision/menu-open-390.png) |
| Closing | [Closing frame](screenshots/menu-revision/menu-closing-1440.png) | [Closing frame](screenshots/menu-revision/menu-closing-390.png) |
| Scrolled | [Compact desktop header](screenshots/menu-revision/header-scrolled-1440.png) | [Compact phone header](screenshots/menu-revision/header-scrolled-390.png) |

## Footer and organizer

The old three-column directory had 15 links. The final footer contains three links, About, Code of Conduct and Privacy, alongside the event lockup, verified copyright wording and approved geometric strip. At 1440 px its height fell from 758 to 124 px. At 390 px it fell from 888 to 171 px. The separate official AWS mark stays visible in the header. [Footer comparison](screenshots/menu-revision/footer-comparison.png) · [Final desktop footer](screenshots/menu-revision/footer-detail-1440.png) · [Final phone footer](screenshots/menu-revision/footer-detail-390.png)

Chrome rendered the pink organizer mark beside the exact group name and college. The homepage identifies AWS Student Builders Group at LBSCEK as the organizing group and LBS College of Engineering, Kasaragod as the institution. [Desktop organizer credit](screenshots/menu-revision/organizer-desktop.png) · [Phone organizer credit](screenshots/menu-revision/organizer-mobile.png)

## Interactions and accessibility

- All nine pages returned HTTP 200, valid images, unique titles, descriptions and a single main heading across eleven widths from 320 to 1920 px. All 99 route/width combinations and 22 discovered internal destinations passed. Unknown routes returned HTTP 404.
- The menu was opened, closed, rapidly reversed four times and opened again at widths of 320, 360, 375, 390, 414, 430, 768, 1024 and 1440 px, plus 667 × 375 landscape. Focus entered About, the last link remained reachable and Tab and Shift+Tab cycled between the panel and its trigger. Escape returned focus to the trigger. Background content became inert and scrolling resumed at the original position after a close.
- Menu navigation reached a same-page fragment and the Agenda route. The footer's Code of Conduct link navigated correctly at 390 and 1440 px. With JavaScript disabled, the navigation reached Venue at 320 and 1440 px. With reduced motion, the menu reported zero active animation duration and focused the first link.
- Nineteen axe-core 4.10.3 audits returned zero violations using WCAG A/AA tags through 2.2. These covered every route at 390 and 1440 px and the open drawer at 390 px. Browser tests also exercised keyboard skip navigation, track and FAQ disclosures, FAQ search and recovery, and the visible copyright across every route. Private Vite fixtures exercised registration, speaker profiles, agenda search and all four schedule filters.
- Live browser animation events verified the hero entrances, geometric strip, editorial content, four experience-card rules and the footer strip. [Hero entrance](screenshots/menu-revision/hero-entrance.png) · [Editorial section](screenshots/menu-revision/editorial-reveal.png) · [Experience cards](screenshots/menu-revision/card-group-reveal.png)

## Production performance

| Lighthouse 12.8.2 in Chrome 157 | Performance | Accessibility | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile, median of three cold runs | 98 | 100 | 100 | 2.33 s | 0 | 0 ms |
| Desktop, one cold run | 100 | 100 | 100 | 0.14 s | 0.000236 | 0 ms |

Mobile LCP readings were 2.492, 2.259 and 2.334 seconds. Shared Gaze was the mobile LCP element. The prior release measured 99 mobile performance and 2.11 s LCP. The initial script increased from 1,913 to 2,186 bytes with Brotli compression. The final assets were `index-CldnIfGL.js` and `index-DlO3kvYB.css`.

Lighthouse used the production preview behind a localhost HTTPS proxy with the default simulated mobile profile. Desktop used the available connection at 1440 × 900. These are local laboratory measurements. Physical phone hardware, screen-reader sessions and field web vitals remain unmeasured.

To rerun the core suite, build and serve the website, then run `npm run test:browser` with `TEST_URL` set to the preview origin and `AXE_SCRIPT` set to an installed axe-core script. It includes real opening/closing frame sampling at 390 and 1440 px. The dedicated recordings and in-flight stills accompany this report.

