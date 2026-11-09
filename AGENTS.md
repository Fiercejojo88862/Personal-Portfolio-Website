# AGENTS.md

Guidance for AI coding agents (Codex, Claude, OpenCode, Gemini) working in this repository.

## What this project is

A personal portfolio website for Joseph Michael Shaker, a Software and Data Engineering
Technology undergraduate in Newark, NJ.

- Pure static site: semantic HTML5, hand-written CSS, vanilla JavaScript.
- No framework, no bundler, no `node_modules`, no build step.
- Deployed with GitHub Pages from the `main` branch root:
  https://fiercejojo88862.github.io/Personal-Portfolio-Website/index.html
- Everything in the repo is served publicly. Never commit API keys, tokens, or
  private data.

## File map

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, stats, garage telemetry widget, terminal, featured work, CTAs |
| `about.html` | Background, story, principles, everyday kit, hobbies |
| `projects.html` | Project carousel, GitHub repo cards, build notes |
| `skills.html` | Languages, tools, practices, learning roadmap |
| `contact.html` | Contact details and client-validated contact form |
| `project-lock-studio.html` | Case study: Omarchy Lock Studio |
| `project-homelab.html` | Case study: Docker media homelab |
| `project-lubelogger.html` | Case study: LubeLogger |
| `project-siri.html` | Case study: Siri of Omarchy offline voice assistant |
| `project-visualiser.html` | Case study: Visualiser by Fiercejojo88862 |
| `player.html` | Hidden YouTube embed used by the terminal easter eggs (`noindex`) |
| `styles.css` | Base layout, components, responsive breakpoints |
| `motion.css` / `motion.js` | Entrance animations, aurora, tilt, cursor glow |
| `a11y.css` / `a11y.js` | Accessibility preference panel (text size, contrast, underline, motion) |
| `terminal.css` / `terminal.js` | In-browser fake shell widget |
| `player.css` | Styles for the standalone `player.html` embed |
| `script.js` | Nav, carousel, form validation, telemetry/hit counter, shortcuts |
| `assets/` | Headshot, project screenshots, logo, OG cover |
| `TESTING.md` | Test plan and results |
| `REPORT.md` | Course submission report |

## Design system

**Palette** (declared once in `:root` in `styles.css`; never hardcode these values)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#000000` | Page background |
| `--bg2` | `#070b07` | Alternating section band |
| `--card` | `#0e130e` | Cards, panels, terminal window |
| `--border` | `#1e2e22` | 1px card and input borders |
| `--text` | `#e9f5ec` | Body copy |
| `--muted` | `#9db8a4` | Secondary copy, captions, metadata |
| `--accent` | `#22c55e` | Primary buttons, active nav pill, gauges |
| `--accent-dark` | `#16a34a` | Borders and hover states |
| `--accent-bright` | `#4ade80` | Links, eyebrows, small accents |

Every text/background pair clears WCAG AA (lowest measured ratio is 6.4:1).

**Typography.** System UI stack for body copy (`ui-sans-serif`, `Segoe UI`, `system-ui`)
with a monospace stack for the terminal, stats, and gauge readouts. Fluid headings use
`clamp()`; the hero h1 is `clamp(2rem, 5vw, 3.25rem)` and page titles are 2rem,
dropping to 1.6rem under 640px. Headings are `#fff`; body text is `--text`.

**Layout.** Single-column flow capped at `--max` (1080px) with 14px card radius.
Sections alternate `--bg` and `--bg2`; content blocks use CSS Grid, collapsing to one
column at the phone breakpoint. Cards share the same shell: `--card` fill, 1px border,
14px radius, and a subtle accent glow on hover.

**Motion.** Entrance fades and a card tilt live in `motion.css` and only run under
`prefers-reduced-motion: no-preference`. The accessibility panel's "pause motion"
switch disables them at runtime by adding `a11y-calm` to `<html>`; JS must check that
class before animating anything scroll-driven.

**Breakpoints.** 900px (repo grid), 760px (nav collapses to hamburger, two-column
blocks stack), 620px (single column), with a 640px heading scale step.

## Run locally

```bash
cd portfolio-website
python3 -m http.server 8000     # then open http://localhost:8000
```

Opening `index.html` directly with `file://` mostly works, but the terminal,
telemetry counter, and relative fetches behave best over HTTP.

## Conventions to preserve

- **Semantic HTML.** One `<h1>` per page (the page title), then `<h2>` sections,
  then `<h3>` cards. Do not skip levels. Cards that sit directly under a page
  `<h1>` use `<h2 class="h-compact">` so they keep the small card scale.
- **Every page keeps the same primary nav:** Home, About, Projects, Skills,
  Contact. Adding a page means adding it to the nav on all pages and to the
  footer.
- **Accessibility is a feature, not an afterthought.** Keep the skip link, alt
  text on every image, visible `:focus-visible` rings, `prefers-reduced-motion`
  handling, labelled form fields, and the Alt+A preferences panel working.
- **Progressive enhancement.** The page must stay readable with JavaScript
  disabled; widgets (telemetry, terminal, a11y panel) only add to it.
- **Copy style.** First person, plain English, no em dashes, no placeholder
  text, no lorem ipsum, no "TODO". Real projects and real numbers only.
- **No external JS libraries.** Vanilla JS only; fonts and images are local.
- **CSS:** custom properties live in `:root` in `styles.css`; keep the existing
  breakpoints (900px, 760px, 620px) and add media queries rather than rewriting.

## Known pitfalls

- **Telemetry hits the network.** `script.js` calls the free counter at
  `abacus.jasoncameron.dev` (namespace `fiercejojo88862-portfolio`). Do not
  point it at a paid service or add tracking or cookies.
- **Email is obfuscated on purpose.** `contact.html` renders
  `josephshaker2020[at]aol[dot]com` and builds the `mailto:` link only on
  click. Keep it that way; do not hardcode a plain mailto.
- **The terminal has real commands and easter eggs** (`help`, `about`,
  `projects`, `contact`, `clear`, `cat cat`). Changing command names breaks the
  demo; if you add one, document it in `help` and in `TESTING.md`.
- **`player.html` is intentionally outside the nav** and carries `noindex`. Do
  not link it from the main pages.
- **Git history is graded.** Make small, real commits with descriptive
  messages. Never force-push or squash the history.

## Before you finish a change

1. Open each touched page locally and check desktop and phone widths.
2. Tab through the page: skip link, nav, buttons, form fields must all be
   reachable and visibly focused.
3. Run the checks in `TESTING.md` and update results if behaviour changed.
4. Confirm no console errors in the browser dev tools.
5. Commit with a message that says what changed and why, then push to `main`.
