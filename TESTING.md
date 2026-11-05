# TESTING.md

Test plan and results for the portfolio website.

- **Site under test:** https://fiercejojo88862.github.io/Personal-Portfolio-Website/index.html
- **Repository:** https://github.com/Fiercejojo88862/Personal-Portfolio-Website
- **Environment:** live GitHub Pages site, tested in Firefox (desktop, 1440x900) and
  Firefox responsive mode (390x844, iPhone 13 Pro profile). macOS/Windows not
  used. Checks also repeated locally with `python3 -m http.server 8000`.
- **Last run:** 2026-11-04

Status codes: **PASS**, **FAIL**, **N/A**.

## 1. Links, structure and content

| ID | Test | How it was checked | Expected | Result |
| --- | --- | --- | --- | --- |
| L1 | Home page loads | Open the live URL | Page renders, hero and telemetry visible | PASS |
| L2 | All five required pages return HTTP 200 | `curl -o /dev/null -w "%{http_code}"` on index, about, projects, skills, contact | 200 for each | PASS (200, 200, 200, 200, 200) |
| L3 | Case-study pages return HTTP 200 | Same check on the three `project-*.html` pages | 200 for each | PASS (200, 200, 200) |
| L4 | Every page links all five pages from the main nav | Compared nav markup on all pages | Identical nav: Home, About, Projects, Skills, Contact | PASS |
| L5 | No broken local links or missing assets | Script parsed every `href`/`src` in `*.html`, confirmed each local target exists | Zero missing files | PASS |
| L6 | Every image has `alt` text | Script counted `<img>` tags without `alt=` (30 images total) | Zero missing | PASS (0 of 30) |
| L7 | No duplicate `id` attributes | Script counted repeated ids per page | None | PASS |
| L8 | Real content, no placeholders | Manual read of every page | No lorem ipsum, TODO, or "coming soon" | PASS |
| L9 | Page titles and canonical/OG metadata present | View source on each page | Unique `<title>`, canonical, OG, Twitter, JSON-LD | PASS |
| L10 | No inline styles; one external stylesheet per page | `grep -c 'style="' *.html` plus a search for `<style>` blocks | Zero inline style attributes and zero inline `<style>` blocks | PASS (0 in all 9 pages) |
| L11 | Colours and fonts come from one place | Inspect `:root` in `styles.css` | Every page uses the same tokens, no per-page palette | PASS |
| L12 | At least three projects with description, image, and link | Read `projects.html` and the three case studies | Each has a screenshot, a written description, and outbound links | PASS |

## 2. Responsive layout

| ID | Test | How it was checked | Expected | Result |
| --- | --- | --- | --- | --- |
| R1 | Desktop layout 1440x900 | Firefox desktop | Grids multi-column, no horizontal scroll | PASS |
| R2 | Laptop width 1280x800 | Resized window | Same layout, no overlap | PASS |
| R3 | Tablet width 820x1180 | Responsive mode | Two-column blocks stack, nav collapses | PASS |
| R4 | Phone width 390x844 | Responsive mode | Single column, hamburger nav, no horizontal scroll | PASS |
| R5 | Narrow phone 320x568 | Responsive mode | Content readable, telemetry gauge scales down, no horizontal scroll | PASS |
| R6 | Images scale, never overflow | Responsive mode | All images fit their container | PASS |
| R7 | Nav menu opens and closes on phone | Tap hamburger, tap a link, tap hamburger again | Opens, navigates, closes | PASS |
| R8 | No layout shift from fonts/images | Reload at each width | Stable layout, no jump | PASS |
| R9 | No sideways scrolling at any width | Check `document.documentElement.scrollWidth > clientWidth` at 320, 390, 768, 1024, 1440 | Equal or narrower at every width | PASS |

## 3. Keyboard and accessibility

| ID | Test | How it was checked | Expected | Result |
| --- | --- | --- | --- | --- |
| A1 | Skip link works | Load page, press Tab once, press Enter | Focus jumps to main content, link visible on focus | PASS |
| A2 | Tab order follows visual order | Tab through full page | Nav, hero CTAs, cards, form, footer in order | PASS |
| A3 | Focus is always visible | Tab through every interactive element | Visible focus ring on each | PASS |
| A4 | Keyboard-only navigation of every page | Tab + Enter only, no mouse | All five pages reachable and usable | PASS |
| A5 | Heading order is valid | Script extracted heading sequence per page | Exactly one `<h1>`, no skipped levels | PASS |
| A6 | Keyboard shortcuts work | Press `1`-`5`, `/`, `?`, `Alt+A` | 1-5 open pages, `/` focuses search/terminal, `?` opens help, Alt+A opens a11y panel | PASS |
| A7 | Accessibility panel toggles | Open Alt+A, toggle text size, contrast, underlines, readable text, pause motion | Each toggle applies immediately and persists on reload | PASS |
| A8 | Reduced motion respected | Set OS "reduce motion", reload | Entrance animations and cursor glow disabled | PASS |
| A9 | Form fields are labelled | Inspect contact form, use screen reader | Every input has a label, errors announced via `role="status"` | PASS |
| A10 | Contrast meets WCAG AA | Checked body text, muted text, buttons | Body and UI text at or above 4.5:1 | PASS |
| A11 | Landmarks present | Inspect page | `header`, `nav`, `main`, `footer`, one `main` per page | PASS |
| A12 | `player.html` (`noindex` embed) | Load the page | Standalone player, hidden `<h1>`, not in nav | PASS (out of nav scope) |

## 4. JavaScript features

| ID | Test | How it was checked | Expected | Result |
| --- | --- | --- | --- | --- |
| J1 | Hamburger nav toggle | Click at phone width | Menu opens/closes, `aria-expanded` updates | PASS |
| J2 | Typed hero effect | Reload home | Text types in once, does not block reading | PASS |
| J3 | Project carousel | Use prev/next on Projects | Slides change, keyboard arrows work | PASS |
| J4 | Telemetry odometer | Reload home twice | Digits roll, total visits increments once per session | PASS |
| J5 | Speedometer responds to scroll | Scroll home page | Needle rises with scroll, coasts back to 0 after ~450ms | PASS |
| J6 | Fuel gauge reflects pages explored | Visit 3 of 5 pages | Fuel percentage rises and persists | PASS |
| J7 | Terminal commands | Type `help`, `about`, `projects`, `skills`, `contact`, `clear` | Each returns the expected output, `clear` wipes the screen | PASS |
| J8 | Terminal easter eggs | Type `cat cat` | Opens the `player.html` embed | PASS |
| J9 | Contact form validation | Submit empty; submit bad email; submit valid values | Inline errors, no page reload, success message | PASS |
| J10 | Email obfuscation | Click the email address | `mailto:` link built on click only, address never plain in source | PASS |
| J11 | No console errors | Dev tools console on every page | Zero errors | PASS |
| J12 | Site works with JS disabled | Disable JS, reload | Content, nav links, and form fields still readable | PASS |

## 5. Deployment

| ID | Test | How it was checked | Expected | Result |
| --- | --- | --- | --- | --- |
| D1 | GitHub Pages serves `main` root | Load live URL | Live site matches latest commit | PASS |
| D2 | HTTPS works with no mixed content | Load live URL over HTTPS | No insecure requests | PASS |
| D3 | Custom error page / missing path | Load a non-existent path | GitHub 404, no broken layout | PASS |
| D4 | Social preview image | Paste link into a chat client | `assets/og-cover.png` preview appears | PASS |

## 6. Lighthouse accessibility audit

Run in Chrome or Edge: open the live page, DevTools (`F12`) -> Lighthouse tab ->
Categories: Accessibility only, Device: Mobile -> Analyze page. Repeat for all five
main pages and record the scores here.

| Page | Accessibility score | Date |
| --- | --- | --- |
| `index.html` |  |  |
| `about.html` |  |  |
| `projects.html` |  |  |
| `skills.html` |  |  |
| `contact.html` |  |  |

Supporting evidence already measured manually: one `<h1>` and a valid heading order on
every page, alt text on all 30 images, labelled form fields, landmarks, visible focus
rings, and every text/background pair at or above WCAG AA (lowest ratio 6.4:1).

## How to re-run

1. **Automated link/asset/alt/heading audit**

   ```bash
   cd portfolio-website
   python3 - <<'EOF'
   import re, pathlib
   for f in sorted(pathlib.Path('.').glob('*.html')):
       s = f.read_text()
       imgs = re.findall(r'<img[^>]*>', s)
       noalt = [i for i in imgs if 'alt=' not in i]
       hs = re.findall(r'<h([1-6])', s)
       print(f"{f.name:28} imgs={len(imgs):2} noalt={len(noalt)} h1={hs.count('1')} order={''.join(hs)}")
   EOF
   ```

2. **Live status codes**

   ```bash
   for p in index about projects skills contact project-lock-studio project-homelab project-lubelogger; do
     printf "%s " "$p"
     curl -s -o /dev/null -w "%{http_code}\n" \
       "https://fiercejojo88862.github.io/Personal-Portfolio-Website/$p.html"
   done
   ```

3. **Manual passes** — keyboard-only walkthrough, responsive check at the widths in
   section 2, and one full read of each page for content quality.

## Known limitations

- The contact form validates on the client only; it does not send mail (no
  backend by design). The page states this and points to email.
- The visit counter depends on a free third-party service
  (`abacus.jasoncameron.dev`). If that service is down the odometer shows `--`
  and the rest of the page is unaffected.
- `player.html` is a hidden embed for terminal easter eggs; it is intentionally
  excluded from the nav and from `noindex`-indexed search results.
