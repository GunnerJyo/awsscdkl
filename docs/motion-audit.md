# Builder White motion audit

On 22 November 2026, desktop Chrome at 1440 × 900 and a touch-emulated Chrome viewport at 390 × 844 opened the two organizer-supplied URLs. We compared settled frames, measured element bounds and computed styles, opened and closed the mobile menus, scrolled in both directions, and followed Schedule on the IEDC site. The figures below describe the references. Builder White timings are design targets.

## IEDC Summit 2025

| Observed behavior | What to use on this site |
| --- | --- |
| Desktop opens with a centered, transparent navigation group. At the top it measured about 804 × 72 px at y=4. After scrolling it formed a white, 90%-opaque panel about 900 × 56 px at y=20 with 16 px corners, shadow and a newly visible 40 px crest. The outer navigation remained fixed. The inner group declares a 500 ms transition with cubic-bezier(.4,0,.2,1). Scrolling partway back up preserved the compact state. | The visual change signals that the menu will follow the reader. Give the Builder White header a tighter inset, a simple rule and square modular accents. Keep both identities visible throughout. Use a scroll threshold with hysteresis to avoid repeated switching near the top. |
| The Speakers link changed from 0.6 opacity to 1 on hover. The photos CTA rose 2 px and darkened. A linked sponsor tile shifted its white background to a light gray, while its image held still. | Use a strong underline or square indicator on hover and keyboard focus. Restrict lift to pointer devices. Keep the current page visible at rest. |
| On the phone, a full-width fixed white bar measured 65 px. The menu expanded under the same controls to 449 px total and collapsed back to 65 px. The bar stayed at y=0 while scrolling down and up. Selecting Schedule opened the actual schedule route at scroll position zero on both tested sizes. | Anchor the menu controls, use a legible vertical link list with thumb-sized targets, and close with the toggle, Escape or a route selection. Maintain keyboard focus inside an open overlay and restore it when dismissed. |
| Hero layers register 800 ms fade-up animations. A photo layer registers an 800 ms scale entrance. The desktop composition puts type and image on different sides, while the phone places the illustration below the heading. A multicolored band separates the content from the dark institutional footer. A settled footer check reported no active descendant animations. | Separate the order of title, cultural face and modular ornaments. Preserve the whole face on narrow screens and keep the title readable from first paint. Give the patterned footer strip one short entrance. |

Desktop and mobile captures include the loaded hero, menu, scroll state and footer. [Original reference](https://iedcsummit25.vercel.app/) · [Desktop hero](references/iedc-1440-initial.jpg) · [Scrolled desktop header](references/iedc-1440-scroll.jpg) · [Phone hero](references/iedc-390-initial.jpg) · [Phone menu](references/iedc-390-menu.jpg) · [Footer](references/iedc-1440-footer.jpg)

## Huddle Global 2026 Creative

| Observed behavior | What to use on this site |
| --- | --- |
| A branded progress screen preceded the Creative hero. Large type, location and registration occupied the left side. A layered local illustration anchored the right. A horizontal event-statistics panel led into an illustrated story section. | Let readers see the event identity, illustration and current registration state on first paint. Sequence the small geometric accents after the content. The cultural image can carry the composition without a loading gate. |
| A fixed header and a distinct theme selector frame the desktop presentation. On the phone, the nav toggle measured 44 × 44 px. It opened a tall single-column panel under the 89 px header. The phone header gained a pale background after scrolling. | Keep identity and controls in consistent positions and increase header separation over content. Give the phone menu sufficient room for the entire route list and keep the controls usable at text zoom. |
| The story leads to audience groups, agenda, tracks, registration, gallery, partners and contact. Scrolling brings illustrated chapters in and out of view. Live styles registered 5 s float and 8 s tilt on a drone, 14 s and 20 s cloud drifts, and 5.5 s flag motion. | Carry a single motif between chapters. Give background pieces one brief assembly and reserve movement for section boundaries. Keep tracks, agenda and FAQ operable by touch and keyboard. |
| Hovering a full-programme link scaled it to 1.05. The illustrated Investor Connect card brightened to 1.04 while its layout held steady. | Reserve motion for actionable links. Move a small arrow or accent within the card and keep the reading surface steady. |
| At the end of the page the partnership actions sit ahead of a panoramic illustrated scene and compact legal strip. Phone stacks the actions and preserves the panoramic close. | Put the event identity, community links and navigation before the closing visual. Use the approved pixel strip and a clear legal line, with a static frame under reduced motion. |

The first Chrome desktop run timed out during loading. Retrying the same URL and waiting for the overlay to release pointer interaction produced the rendered hero and footer. [Creative reference](https://huddleglobal.co.in/creative) · [Progress screen](references/huddle-1440-initial.jpg) · [Settled desktop hero](references/huddle-1440-hero.jpg) · [Phone hero](references/huddle-390-hero.jpg) · [Phone menu](references/huddle-390-menu.jpg) · [Phone story](references/huddle-390-scroll.jpg) · [Desktop footer](references/huddle-1440-footer.jpg)

## Identity check

The supplied Figma version opened in Chrome. Its committee presentation board pairs a heavy, left-aligned English title with Shared Gaze in a lilac construction grid, surrounded by white space and the stepped color band. The approved local register maps the display emblem to node 6:165496 and the website hero to node 1:28692. [Figma version](https://www.figma.com/design/U1qcMrtSY8ZwL7mWuW2u4p/?version-id=2423975960691518630&node-id=1-34825) · [Browser capture](references/figma-1440-reference.jpg)

## Motion specification

| Interaction | Timing and movement budget | Touch, accessibility and rendering |
| --- | --- | --- |
| Navigation feedback | 120–220 ms for ink, underline or a small directional move. Compact-header transitions may run up to 320 ms. | Match focus and hover emphasis. Keep the header and open menu clear of focused content. Read scroll direction once per frame or on threshold crossings. |
| Hero sequence | A single 300–650 ms introductory pass. Stagger only the limited set of art and accent layers. | Reserve the image aspect ratio in HTML. Present the heading and primary action immediately. Preserve the framing on touch devices. |
| Section reveals and modular assembly | One 250–550 ms reveal per region. Limit translation to roughly 8–20 px. | Use IntersectionObserver, transform and opacity. Show content by default. The reduced-motion version goes directly to the settled frame. |
| Card, disclosure and page changes | 120–250 ms for an arrow, a pressed state or a small panel transition. | Touch activation works on the first tap. URL navigation, native controls, visible focus, filter counts and announcements retain their normal semantics. |
| Footer | One finite entrance for the decorative strip and a short stagger if columns enter together. | Keep the legal line, community links and back-to-top action reachable throughout. Limit motion to the local elements entering view. |

Screenshots in this directory document the reference inspection and belong with the project handoff. The public website uses the approved Builder White artwork.
