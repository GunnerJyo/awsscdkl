# Website refinement and organizer identity

**AWS Student Community Day Keralam 2027**  
22 November 2026 • Existing Builder White React, TypeScript and Vite website

[Local preview](http://127.0.0.1:4181/) · [Phone menu recording](screenshots/menu-revision/menu-390.mp4) · [Desktop menu recording](screenshots/menu-revision/menu-1440.mp4) · [Browser measurements](menu-qa.md)

## Organizer acknowledgment

The first section after the homepage hero and its geometric baseline identifies **AWS Student Builders Group at LBSCEK**, followed by **LBS College of Engineering, Kasaragod**. The official AWS mark sits in the header and Shared Gaze identifies the event. About includes the organizer record and chapter website. Partners and the organizer FAQ use the same data.

The local image `public/brand/organizer-lbscek.png` is a byte-for-byte copy of the organizer’s `Architype_Stedelijk__14_-removebg-preview.png`. It is a 500 × 500 RGBA PNG, 60,555 bytes, with transparent corners and central opening. SHA-256 is `89d634d5591efb39a581a000796649c9ba6f2d562a533851561937e4f27c993a`. The unaltered image is displayed at 56 × 56 px on phones and 72 × 72 px on desktop. [Phone acknowledgment](screenshots/menu-revision/organizer-390.png) · [Desktop acknowledgment](screenshots/menu-revision/organizer-1440.png)

The organizer specified the plural **Builders** for this event credit. AWS's directory lists the chapter as **AWS Student Builder Group at LBS College of Engineering** in Kasaragod. The chapter also uses “Student Builders Group” in its local materials. The broader program is **AWS Student Builder Groups**. [Official chapter website](https://awssbg.iedclbscek.in/) · [AWS directory](https://builder.aws.com/community/student-builder-groups) · [Chapter listing](https://www.meetup.com/aws-sbg-at-lbs-college-of-engineering) · [Chapter profile](https://linktr.ee/awslbs)

## Header, menu and footer

The Menu control is available on every page, on desktop and mobile. Its icon crosses over 220 ms. The white navigation panel opens with a 480 ms geometric wipe. Links rise into place with 40 ms between successive rows. Closing uses a 360 ms reverse wipe as each link retreats. The panel's actual CSS transition determines when focus and page interaction settle. A rapid second toggle reverses the transition from its current position. Keyboard focus moves to the first destination on open and returns to the control on dismissal. The background stays inert through the exit. Reduced-motion users get the final states immediately.

The desktop header goes from an 88 px full-width rail to a 64 px inset rail over 360 ms. Two stationary scroll thresholds control this transition in either direction. The cultural art, original AWS graphic, IBM Plex typography and brand palette are retained. The coordinated hero entrance, editorial and card reveals, FAQ and agenda transitions use native browser animation. The reference inspection includes live opening and closing observations on both supplied sites. [Interaction research](menu-reference.md)

The footer keeps the original event lockup, the exact 2026 copyright notice, a responsive edition of the approved signature strip, and **three links**: About, Code of Conduct and Privacy. A fourth Contact link is conditional on a configured destination. The AWS trademark attribution is on About. All nine routes and the Code of Conduct text remain available. [Previous footer](screenshots/menu-revision/before-footer-1440.png) · [Current desktop footer](screenshots/menu-revision/footer-new-1440.png) · [Current phone footer](screenshots/menu-revision/footer-new-390.png)

## Browser verification

The release passed 99 route-and-width checks and 19 automated accessibility audits. In the 390 px phone capture, the opening took 488 ms and closing took 370 ms. The desktop capture measured 487 and 369 ms. The three-link footer measured 171 px high at 390 px and 124 px at 1440 px. Menu reversal, focus restoration, ordinary navigation and no-JavaScript navigation were exercised separately.

The final local Lighthouse mobile medians were 98 for performance, 100 for accessibility and 100 for SEO, with a 2.33 s largest contentful paint, zero layout shift and zero blocking time. The prior release measured 99 for performance and a 2.11 s paint on the same lab profile. Desktop scored 100 in all three categories. Initial JavaScript went from 1,913 to 2,186 bytes with Brotli compression. Field data, physical-device testing and screen-reader sessions remain unmeasured.

## Files and recovery

| Location | Change |
| --- | --- |
| `src/App.tsx`, `src/navigation.ts`, `src/global.css`, `index.html` | Header rail, keyboard behavior, reversible panel, motion tokens, compact footer and no-JavaScript navigation |
| `src/Home.tsx`, `src/home.css` | Organizer acknowledgment, hero entrance, section and card interactions |
| `src/Pages.tsx`, `src/pages.css` | Organizer directory, trademark attribution, agenda and disclosure transitions |
| `src/content.ts`, `public/brand/organizer-lbscek.png` | Canonical chapter details and exact graphic |
| `tests/browser.mjs`, `docs/`, `README.md` | Browser tests, recordings, screenshots, references and handoff |
| `dist/` | Prerendered production output |

The work used the existing Codex chat workspace. Git reported that the directory is outside a repository. The pre-edit checkpoint matched the previous 199-file V2 ZIP by SHA-256, `063cee1cc82bc735035f6636b6d9663484b959c6eba76040cf77609a52634c2d`. The V2 package remains in `outputs/` alongside this revision. The preview is local and the event remains in pre-announcement.

TypeScript checking and Vite production prerendering passed. The project has no configured lint command. An external Oxlint 1.42.0 check ran 90 default rules on the TypeScript and JavaScript source, scripts, tests and Vite configuration. It found zero errors and two existing warnings, one for the control-character check in the URL validator and one for a redundant options spread in the social-image export script.

