# Builder White website implementation

## Current conference identity

The organizer supplied the standalone emblem for **AWS Student Community Day Keralam 2027** as a 1254 × 1254 transparent PNG. The website master is an exact copy of “Kerala Emblem on Transparent Background.png”. Its SHA-256 is `5162d350fe5ecd97d05c46d776dbeda31a0762de50770859767ac6db8033fcb0`. [Download the conference logo](../public/brand/conference-logo.png)

Use the complete emblem in the header, footer, homepage hero, browser icon and link preview. Match each rendition to its display size while preserving the artwork's colours, transparency and proportions. Set the event name separately in IBM Plex Sans. Place the official AWS mark, the organizing group's mark and partner marks in their own attribution areas.

The matching master in the conference brand kit is `current-logo/conference-logo.png`. Use it for credentials, signage, merchandise and conference communications.

## Earlier Shared Gaze implementation

The V6 source files, placement notes and measurements below document the previous release.

**Event:** AWS Student Community Day Keralam 2027  
**Identity:** Shared Gaze, Cultural Fusion V6  
**Edition inspected:** 21 November 2026  
**Asset root:** `outputs/aws-scd-keralam-2027-builder-white/`. All paths below are relative to this directory.

The reopened V6 checkpoint in the original Figma project records that edition. Its active-frame register pairs each local source with a native node. [V6 checkpoint](https://www.figma.com/design/U1qcMrtSY8ZwL7mWuW2u4p/?version-id=2423975960691518630&node-id=1-34825) · [Website hero frame](https://www.figma.com/design/U1qcMrtSY8ZwL7mWuW2u4p/?node-id=1-28692)

### V6 asset selection

| Website placement | Source |
| --- | --- |
| Header and wordmark | `final-identity/01-primary.svg`, `02-horizontal.svg`, `03-vertical.svg`, `05-full-wordmark.svg`, `06-compact-wordmark.svg` in the same directory |
| Display illustration, at least 256 px | `final-identity/17-hero-emblem.svg` |
| Standard symbol, 64–255 px | `final-identity/04-symbol.svg` |
| Micro, 32–63 px | `final-identity/11-small-size.svg` |
| Avatar and reverse | `final-identity/07-avatar.svg`, `08-light.svg`, `09-dark.svg`, `19-white-one-ink.svg` |
| Responsive hero composition | `social-media/22-website-hero.svg`, 1440 × 650. The matching rendered reference is `exports/png/social-media/22-website-hero.png`. |
| Geometric strip | `footer-strips/09-signature.svg` for the hero and major transitions. Use the standard (01), compact (02), expanded (03), ultra-minimal (04), monochrome (05), corner (06), vertical (07) and border (08) variants in the same directory where appropriate. |
| Cultural modules | `cultural-art/{subject}/{treatment}.svg`. Subjects include kathakali, theyyam, mohiniyattam, kalari, chenda, kasavu, palm, mural, architecture, pookalam, reed and mirror. Treatments are 01-hero, 02-motif, 03-pattern, 04-monochrome, 05-light and 06-social. |
| Reference applications | `social-media/01-announcement.svg`, `social-media/06-speaker.svg`, `stage-and-venue/01-main-led.svg`, `badges/organizer-standard-front.svg`, `lanyards/organizer-20mm-face.svg`, `brand-guidelines/brand-standards.pdf` |

Allow exterior clear space of one quarter of the visible symbol width around the lockup. Keep the emblem upright. Use a light field for the full-colour face and the white one-ink reverse at 32–48 px on Builder Ink. For stacked type, preserve the title as a single unit with equal type size, weight and colour. Use the canonical two- or three-line breaks.

### V6 web rendering

The 1440 px hero uses a white reading field on the left and a pale grid carrying the portrait on the right. Cyan and coral corner blocks and a signature strip complete the composition. The self-contained portrait panel is the top-level group translated to (941, 54). The original date and registration line contains template fields. Implement that region as live HTML tied to confirmed event data. Keep the primary event name as an accessible heading. The organizer-supplied distinction “Keralam's First AWS Student Community Day” is a separate line.

The responsive emblems, cultural motifs and footer masters are self-contained vector shapes. Graphic lockups with typography contain live SVG text and depend on IBM Plex. Use the original inline SVG with the page's self-hosted fonts, or use the matching transparent PNG from `exports/png/final-identity/`. An external SVG loaded as an image has a separate font context. Preserve each asset's viewBox, set intrinsic image dimensions and keep purely decorative strips out of the accessibility tree.

### V6 website tokens

| Use | Source values |
| --- | --- |
| Surfaces and type | White #FFFFFF, Surface #F6F8FB, Ink #15192D, Muted #505B70, Grid #DCE1EB |
| Interaction and supporting fields | Violet #5732CB, Lavender #DBD2FF, Pale #F1EEFF, Cyan #76DCEB, Coral #FF826D |
| Layout | 8 px base grid, 1 px border, 24 px gutter, twelve landscape columns. Spacing scale 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px. The 1080 px portrait reference uses six columns and a 56 px live margin. |
| Display and reading | IBM Plex Sans. Hero reference 700 / 128 px size / 126 px line height / −5 px tracking. Main headline reference 700 / 87 / 90 / −3.5. Adapt size to viewport while preserving proportions. |
| Labels and timing | IBM Plex Mono. Section label reference 600 / 18 / 24 / +0.8 px tracking. Date and time 500 / 24 / 33. |

Use `brand-tokens/colors.json`, `spacing.json`, `typography.json`, `contrast.json` and `illustration.json` as the source of values. The performance palette belongs to the original artwork. Use Ink or another verified foreground on pale accents. Preserve the thin grid, square corners and clear interval between the two footer banks.

The website self-hosts the supplied IBM Plex Sans and Mono fonts in `public/brand/fonts/`, with both SIL Open Font Licenses. The basic English Sans WOFF2 is 32,184 bytes, retains the 100–700 weight axis and uses the original default 100% width. The Regular, Medium and SemiBold Mono core files are 9,604, 9,744 and 10,568 bytes. A page using all four core files transfers 62,100 bytes of font data. HTML preloads the Sans core. The complementary ranges in `src/fonts.css` select the original extended-Latin webfonts when a name or phrase contains additional characters. Social-image generation can use the full Latin files directly.

The website header uses `/brand/primary.png`, a transparent pixel-identical copy of the published three-line lockup. The home-page illustration is the intact group from `social-media/22-website-hero.svg`, isolated with its existing parent coordinates into `/brand/hero-panel.svg`. Its outer grid, corner blocks, marks and original vector paths are preserved. The desktop divider in `/brand/wide-signature.svg` extracts the complete 2400 × 48 signature group in `footer-strips/formats/wide-banner.svg`. Narrow screens use the native 1280 × 90 signature, preserving square cells at both sizes. Cultural spot illustrations in the experience section are the published hero masters for chenda, screw-pine weaving, pookalam and palm. Inner pages also use the kasavu master. The technical-topic list uses live descriptions from the central event configuration.

### V2 release provenance

The original emblem belongs to the event identity. The organizer supplied the event name and first-edition wording. For website V2 the organizer specifically requested use of the official AWS mark in the header and footer and supplied the footer copyright line. The V6 handoff also records a request for informed local review of the Theyyam-inspired imagery before public circulation.

The separate AWS graphic in both placements is the original 1254 × 750 transparent PNG from Amazon's US Press Center. The local file is `public/brand/aws-logo-rgb.png`, 36,212 bytes, SHA-256 `0762717e921e1cf1813b7e28d3097b24e564357f7d30d416b3aa2aafcb18f9d3`. Both placements display the original image on white at intrinsic proportions with exterior space. The organizing brief supplies the event-use authorization context. The workspace contains no separate AWS approval letter or event-specific Student Builder Groups graphic. Program affiliation appears as text linked to AWS's own program description. [Press listing](https://press.aboutamazon.com/logos?p=3) · [Original logo](https://assets.aboutamazon.com/ff/9f/c88d0578474381e7ee1b6d337d23/aws-logo-rgb.png) · [AWS trademark guidelines](https://aws.amazon.com/trademark-guidelines/)

The footer emblem is a byte-for-byte copy of `final-identity/04-symbol.svg`. The Mohiniyattam and architecture illustrations come from the respective `01-hero.svg` files under `cultural-art/`. The responsive mobile hero uses the same Shared Gaze panel as the desktop layout. Its caption sits beside the portrait below the call to action.

The local records are `figma/active-source-frames.csv`, `figma/verification.md`, `research/asset-provenance.md`, `keralam-identity/cultural-research.md` and `brand-guidelines/using-builder-white.md`.

### Earlier website placement

That release used the original AWS press graphic in its header and the primary event lockup and responsive signature strip in its compact footer. The organizer’s pink emblem appeared in its own acknowledgment. [Organizer handoff](menu-refinement.md)
