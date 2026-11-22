# AWS Student Community Day Keralam 2027

This public conference website uses the Shared Gaze artwork, IBM Plex type and geometric footer from the finalized Builder White identity. It lives in the existing branched Codex chat’s workspace under `website/`. The enclosing design workspace has no Git checkout.

## Run locally

Use Node.js 22.12 or newer and npm. Open a terminal in this directory.

```sh
npm ci
npm run dev
```

Vite prints the local development URL. React renders each route to HTML. The responsive menu uses a small browser script. Only the searchable FAQ and published speaker or agenda directories load React in the browser. The homepage and pending programme pages work from the rendered HTML.

## Build and check the production site

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

The preview server defaults to `http://127.0.0.1:4173`. Set `PORT` to select another port. To run the browser tests with the preview running, open a second terminal in this directory.

```sh
npx playwright install chromium
npm run test:browser
```

`TEST_URL` overrides the preview URL. For a system browser set `BROWSER_PATH` to an installed Chromium-based browser. The browser tests exercise populated programme fixtures on a separate loopback server. See the [current browser verification and recordings](docs/menu-qa.md).

## Routes and publishing

The nine public routes are `/`, `/about`, `/speakers`, `/agenda`, `/partners`, `/venue`, `/faq`, `/code-of-conduct` and `/privacy`. Each confirmed speaker with a published record also gets a static `/speakers/<id>/` page. Homepage links lead directly to the experience, proposed topics, registration status and attendee guidance. The schedule uses local event time in Asia/Kolkata.

`npm run build` produces a complete static website in `dist/`. Serve that directory at the root of an HTTPS domain with directory-index support. Configure the host’s missing-page handler to serve `404.html` with HTTP 404. An SPA fallback would return the homepage for unknown URLs. The local production server demonstrates the MIME types, security headers and cache behavior. Copy the security and cache policies from `scripts/serve.mjs` into the selected host’s configuration. Cache fingerprinted files in `/assets/` indefinitely, revalidate HTML, and give the named brand artwork a short cache lifetime.

The build inlines the first-render stylesheet and creates Brotli and gzip copies of compressible assets. Configure the static host to negotiate compression and set `Vary: Accept-Encoding`, or enable its automatic CDN compression. The supplied preview server negotiates the precompressed files.

Set the organizer-approved public origin in `src/content.ts` and rebuild before launch. This enables absolute canonical and social URLs and generates `sitemap.xml` and its robots entry. Without a domain, the build includes route titles, descriptions, robots.txt and a 1200 × 630 share image. Event structured data requires the confirmed date, venue and origin. Publication and DNS setup belong to the selected hosting environment.

## Updating the event

The release starts in pre-announcement. The homepage identifies **AWS Student Builders Group at LBSCEK** as the organizer. The chapter record, college, image and website are maintained in `src/content.ts`. The organizer supplied the distinction **Keralam's First AWS Student Community Day** and the footer copyright. Dates, venue, registration, lineup, partners and contact destinations await confirmation. [Content guide](docs/content.md)

## Files

| Location | Responsibility |
| --- | --- |
| `src/App.tsx`, `src/navigation.ts`, `src/global.css`, `src/fonts.css` | Header, accessible mobile navigation, skip link, common layout, footer, fonts and tokens |
| `src/Home.tsx`, `src/home.css` | Homepage, cultural hero, experience, topics, announcements and visitor guidance |
| `src/Pages.tsx`, `src/pages.css` | Speaker profiles, agenda filters and search, visitor and community pages |
| `src/content.ts` | Shared typed public event data, registration rules, session filtering and formatting |
| `public/brand/` | V6 artwork, licensed web fonts and social preview |
| `src/client.tsx`, `src/hydrate.tsx`, `src/server.tsx`, `index.html`, `vite.config.ts` | Selective React hydration, HTML rendering, per-page metadata and development middleware |
| `scripts/` | Static build, local production serving and optional sharing-image rendering |
| `tests/` | Data integrity and state tests, browser and responsive checks |
| `package.json`, `package-lock.json`, `tsconfig.json` | Reproducible dependencies, commands and TypeScript configuration |
| `docs/` | Source references, organizer instructions, QA and browser screenshots |

[Current website handoff](docs/menu-refinement.md) · [Menu interaction research](docs/menu-reference.md) · [Brand assets and Figma references](docs/brand.md) · [Current verification](docs/menu-qa.md) · [Previous V2 handoff](docs/website-v2.md)

