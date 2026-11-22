# AWS Student Community Day Keralam 2027 • Website V2

**Local production preview** [Event website](http://127.0.0.1:4181/) · [Code of Conduct](http://127.0.0.1:4181/code-of-conduct)  
**Design evidence** [Mobile before and after](screenshots/compare-mobile.png) · [Desktop before and after](screenshots/compare-desktop.png) · [Header and scroll demonstration](screenshots/header-scroll-demo.mp4)  
**Verification** [Browser results and performance](qa.md) · [Reference inspection](motion-audit.md) · [AWS mark and illustration sources](brand.md)

## Revision delivered on 22 November 2026

The original React, TypeScript and Vite application was revised in the existing Codex chat workspace. Git reported that the directory is outside a repository. A byte-verified ZIP checkpoint of the original source, public assets, production build and documentation was created before edits. Its SHA-256 is `9f572ca2c1bc13c6cb6627857a9e8bebeeb91840bf719a525da01164e329c64e`. In the workspace the original package is `outputs/AWS-Student-Community-Day-Keralam-2027-Website.zip`. The upgraded package has the suffix `-Website-V2.zip`.

| Area | Delivered behavior |
| --- | --- |
| Header and navigation | The white desktop rail compacts from 88 to 68 px. The mobile rail uses a 64 px starting height on small phones. Both retain the full event lockup and a separate official AWS mark. Page and selected section links have distinct active states. |
| Mobile menu | The disclosure opens beneath the stable controls. Background content becomes inert and scrolling locks until dismissal. The menu supports touch, keyboard focus cycling, Escape, outside dismissal and same-page section links. A static navigation list is available when JavaScript is disabled. |
| Home and artwork | The story opens with the full title, first-edition statement, AWS Student Builder Groups affiliation, event CTA and registration status. At 390 px, the intact Shared Gaze panel measures 187 × 199 px, compared with 350 × 373 px previously. The caption is beside the artwork on phones. The Mohiniyattam and architecture masters bring cultural illustration into the editorial and venue sections. |
| Motion | Native CSS and one intersection observer handle finite hero entrances, section reveals, geometric strip movement, link and card feedback. Shared timing tokens are 150, 260 and 520 ms. Browsers with cross-document view transitions get a 130 ms route change. Reduced-motion mode shows the settled states immediately. |
| Programme and visitor pages | The public agenda offers expandable proposed topics while the schedule is pending. Populated agendas retain search and filters, and populated speaker profiles retain session links. FAQs keep native disclosure semantics. Mobile form and editorial layouts were revised. |
| Footer | The original Shared Gaze symbol and signature strip frame the event identity, a separate AWS identity area, programme navigation, attendee guidance, AWS Builder Center, AWS Student Builder Groups, policies and back-to-top. Configured contacts, organizer names and social accounts appear when supplied. |
| Conduct and copyright | The event policy covers in-person and official online activities, expected conduct, unwelcome behaviour, reporting at the registration desk and organizer responses. The footer and mobile menu link to the policy. All pages display the organizer-supplied line **© 2026, Amazon Web Services, Inc. or its affiliates. All rights reserved.** |

## Verification

The final browser suite covered all nine pages at eleven sizes from 320 to 1920 px. All 99 route/width combinations passed. Nineteen axe audits, including the open mobile menu, reported zero violations. The tablet overflow found during testing was also rechecked in Edge across all nine pages at twelve widths from 700 to 951 px. A separate 320 px browser run with JavaScript disabled verified both policy links and the exact footer notice across all nine routes and the custom 404.

The final local Lighthouse mobile medians were 99 for performance, 100 for accessibility and 100 for SEO, with 2.11 s largest contentful paint, zero layout shift and zero blocking time. The desktop run scored 100 in all three categories. Initial homepage JavaScript is 1,913 bytes using Brotli compression. The [QA report](qa.md) describes the lab conditions and individual measurements.

## Source changes

| Files | Responsibility |
| --- | --- |
| `src/App.tsx`, `src/navigation.ts`, `src/global.css`, `index.html` | Shared identities, menu, header, footer, reduced motion and progressive navigation |
| `src/Home.tsx`, `src/home.css` | Hero, cultural editorial layout, responsive figure and section interactions |
| `src/Pages.tsx`, `src/pages.css` | Community information, illustrated inner pages, agenda, filtering, disclosures and policy |
| `src/content.ts` | Organizer-supplied copyright |
| `public/brand/aws-logo-rgb.png`, `shared-gaze-standard.svg`, `mohiniyattam.svg`, `architecture.svg` | First-party AWS image and unchanged local V6 masters |
| `tests/browser.mjs`, `README.md`, `docs/` | Expanded browser tests, evidence, source records and handoff |

The editable source and lockfile accompany the prerendered production site in `dist/`. Run `npm ci`, `npm test`, `npm run build` and `npm run preview` from the project directory to reproduce it. The preview command defaults to 4173 unless `PORT` is set.

The edition remains in pre-announcement. Specific sessions, speakers, venue, registration destination, named partners and contact details depend on the organizing team's confirmed data. The exact AWS logo file and the organizer's instruction to display it are documented in the [brand record](brand.md). The site is served locally.

