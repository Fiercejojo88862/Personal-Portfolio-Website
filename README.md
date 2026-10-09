# Portfolio Website — Joseph Michael Shaker

Personal portfolio for Software and Data Engineering Technology undergrad (Newark, NJ).
Static HTML/CSS/JS. No build step. Deploys to GitHub Pages + Vercel as-is.

## Features
- Home, About, Projects, Skills, Contact sections (semantic HTML5)
- Responsive CSS + media queries (desktop / tablet / phone)
- Hamburger nav, JS project carousel with keyboard support, typed hero effect
- Contact form with client-side validation
- Accessibility: skip link, alt text, focus styles, contrast, reduced-motion support

## View locally
```bash
cd portfolio-website
python3 -m http.server 8000
# open http://localhost:8000
```
Or open `index.html` directly in a browser.

## Deploy
- **GitHub:** push this folder to repo `portfolio-website`, enable Pages (branch main, root `/`).
- **Vercel:** New Project → import repo → root `/` → Deploy (no build command).

## Notes
- Project images are inline SVGs in `assets/` (no external deps).
- Contact form validates client-side only; connect Formspree for real delivery.
