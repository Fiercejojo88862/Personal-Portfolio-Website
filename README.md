# Portfolio Website: Joseph M Shaker

Personal portfolio for a Software and Data Engineering Technology undergraduate in
Newark, NJ. Static HTML, CSS, and vanilla JavaScript. No build step, no framework.

- **Live website:** https://fiercejojo88862.github.io/Personal-Portfolio-Website/index.html
- **Repository:** https://github.com/Fiercejojo88862/Personal-Portfolio-Website

## Project description

A five-page portfolio documenting my path through software and data engineering:
coursework, Python tooling, a self-hosted Docker media stack, and web front-ends I
have built. The site is hand-written on purpose: no framework and no bundler, so
every layout, interaction, and accessibility decision is visible in the source.

Pages:

| Page | Contents |
| --- | --- |
| `index.html` | Hero, stats, garage telemetry widget, interactive terminal, featured work |
| `about.html` | Background, story, principles, everyday kit, hobbies |
| `projects.html` | Project carousel, GitHub repository cards, build notes and gotchas |
| `skills.html` | Languages, tools, practices, learning roadmap |
| `contact.html` | Contact details and a client-validated contact form |
| `project-lock-studio.html` | Case study: Omarchy Lock Studio |
| `project-homelab.html` | Case study: Docker media homelab |
| `project-lubelogger.html` | Case study: LubeLogger |
| `project-siri.html` | Case study: Siri of Omarchy, offline voice assistant |
| `project-visualiser.html` | Case study: Visualiser by Fiercejojo88862 |

## Features

- Semantic HTML5 landmarks and a valid heading outline on every page.
- Responsive CSS with breakpoints for desktop, tablet, and phone.
- Hamburger navigation, keyboard shortcuts (`1`-`5`, `/`, `?`), and a project
  carousel with keyboard support.
- Car-style telemetry: odometer counts visits, speedometer follows scroll depth,
  tachometer counts pages seen, fuel gauge shows how much of the site you explored.
- In-browser terminal with real commands and easter eggs.
- Accessibility: skip link, alt text, visible focus rings, reduced-motion support,
  and an Alt+A preferences panel (text size, contrast, link underlines, readable
  text, pause motion).
- Contact form with client-side validation and an obfuscated email address.
- Open Graph, Twitter Card, and JSON-LD metadata with a 1200x630 preview image.

## View locally

```bash
git clone https://github.com/Fiercejojo88862/Personal-Portfolio-Website.git
cd Personal-Portfolio-Website
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly also works, but the terminal, telemetry counter, and
the `file://` fetch path behave best over HTTP. Any static server is fine
(`php -S localhost:8000`, `npx serve`, VS Code Live Server).

## Deploy

GitHub Pages serves the `main` branch root. To publish: commit and push to `main`.

```
Settings -> Pages -> Source: Deploy from a branch -> main -> / (root) -> Save
```

## Documentation

- [`AGENTS.md`](AGENTS.md): repository guide for AI coding agents, file map,
  conventions, and known pitfalls.
- [`TESTING.md`](TESTING.md): test plan (links, responsive layout, keyboard and
  accessibility, JavaScript, deployment) with recorded results.
- [`REPORT.md`](REPORT.md): submission report covering features, challenges, the
  Codex mistake I caught and fixed, and device screenshots.

## Site telemetry (visitor counter)

- `index.html#telemetry` shows a car-style instrument cluster: odometer = total
  visits, speedometer = scroll depth, tachometer = pages seen this session,
  fuel = share of the five main pages explored.
- Counts come from [abacus.jasoncameron.dev](https://abacus.jasoncameron.dev), a
  free serverless hit counter (no cookies, no account). Namespace:
  `fiercejojo88862-portfolio`; keys: `site` and `page-<slug>`.
- Total visits increment once per browser session. Inspect with:
  `curl https://abacus.jasoncameron.dev/get/fiercejojo88862-portfolio/site`
- To swap counters, edit the `TELEMETRY` object at the bottom of `script.js`.
- If the service is unreachable the odometer shows `--` and the rest of the page
  is unaffected.

## Social preview / SEO

- `assets/og-cover.png` (1200x630) is the link preview image.
- Every page carries canonical, Open Graph, Twitter Card, and JSON-LD `Person`
  metadata.

## Notes and acknowledgments

- All images are local files in `assets/`; no external fonts, icon packs, or CDN
  dependencies.
- The contact form validates in the browser only and does not send mail. Real
  contact goes through the email address on the contact page.
- Reference docs used while building: [MDN Web Docs](https://developer.mozilla.org/),
  [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/),
  [Jellyfin documentation](https://jellyfin.org/docs/), and the
  [Omarchy](https://github.com/basecamp/omarchy) project.
- Built with AI coding assistance (Codex and OpenCode). Commits are my own and
  each change was reviewed in the browser before it was pushed.
