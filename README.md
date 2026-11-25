# AWS Student Community Day Keralam 2027

<a href="public/brand/conference-logo.png"><img src="public/brand/conference-logo-256.webp" width="128" height="128" alt="Download the full-resolution conference logo"></a>

A modern, responsive conference website prototype built with **React, TypeScript, and Vite**.

This project explores event website design, interactive navigation, motion effects, responsive layouts, and reusable UI components.

**Status:** Experimental / Test Project

> **Disclaimer:** This repository is a personal development and UI/UX experimentation project. It is not an official event website, registration platform, or production deployment.

## Features

- Responsive desktop and mobile layouts
- Animated navigation and mobile menu
- Smooth transitions and interactive UI elements
- Modular, block-based design system
- Reusable React components
- Speaker and agenda layouts
- Searchable FAQ
- Event information and partner sections
- Accessibility-focused navigation
- SEO metadata and static HTML generation
- Optimized assets and performance

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| TypeScript | Type-safe development |
| Vite 7 | Development and build tooling |
| CSS | Styling and responsive design |
| Playwright | Browser testing |
| Node.js | Build scripts and tooling |

## Getting Started

### Prerequisites

- Node.js 22.12 or later
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/GunnerJyo/awsscdkl.git
cd awsscdkl
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## Build

Create an optimized production build:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

The generated static files are available in the `dist/` directory.

## Testing

Run type checks:

```bash
npm run typecheck
```

Run unit tests:

```bash
npm test
```

Run browser tests:

```bash
npx playwright install chromium
npm run test:browser
```

## Project Structure

```text
.
├── public/
│   └── brand/       # Visual assets and fonts
├── src/             # Components, pages and styles
├── scripts/         # Build and server utilities
├── tests/           # Automated tests
├── docs/            # Development documentation
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Development Notes

This project is intended for experimenting with frontend architecture, visual design systems, responsive layouts, and website interactions.

Some pages may contain demonstration content, incomplete sections, or information that has not been configured for a live event.

Registration, payment processing, and event management services are not provided by this repository.

## Project Status

**Prototype — Under Development**

The website is being used for design experimentation, frontend development, and testing. Features and layouts may change during development.

## Author

**GunnerJyo**

GitHub: [@GunnerJyo](https://github.com/GunnerJyo)

---

*Built for learning, experimentation, and frontend development.*
