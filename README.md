# Portfolio Website — Joseph Michael Shaker

Personal portfolio for Software and Data Engineering Technology undergrad (Newark, NJ).
Static HTML/CSS/JS. No build step. Deploys to GitHub Pages.

## Features
- Home, About, Projects, Skills, Contact sections (semantic HTML5)
- Responsive CSS + media queries (desktop / tablet / phone)
- Hamburger nav, JS project carousel with keyboard support, typed hero effect
- Contact form with client-side validation
- Accessibility: skip link, alt text, focus styles, contrast, reduced-motion support

## View locally
```bash
cd portfolio-websiteResponsive Web Developer|

Software and Data Engineering Technology undergrad in Newark, NJ. I build Linux tools, web apps, and homelab systems — C++, Node.js, Docker, and modern HTML/CSS/JS.
View Projects
Contact Me

    📍 Aberdeen, NJ
    🎓 Software & Data Engineering Tech
    🐧 Omarchy / Hyprland on Arch

Headshot photo of Joseph Michael Shaker

Joseph M. Shaker

Software + Data Engineering
C++Node.jsDockerLinux
About Me

I'm Joseph, 20, a Software and Data Engineering Technology undergraduate commuting to university in Newark, NJ. I work across software and systems: web front-ends, Python tooling, C++, and a Docker homelab.

Education: B.S. Software and Data Engineering Technology (major approved June 2026). Fall 2026 courses set with advisor Ms. Reyes.

Interests: Linux desktop customization (Omarchy/Hyprland), self-hosted media (Jellyfin stack), CAD in SolidWorks, DIY auto repair (Mercedes GL450), and gym training at Crunch Fitness Aberdeen.
2026Built omarchy-lock-studio (Python web customizer for lock screen)
2024Deployed Docker media stack: Jellyfin, Radarr, qBittorrent, Prowlarr
2023Built Squarespace fleet-booking widget (HTML/CSS)
Quick facts

    Laptop: ASUS Vivobook S16, 32GB / 1TB
    OS: Windows 11 + Arch/CachyOS (Omarchy)
    Phone: iPhone 13 Pro

Get in touch
Projects

Three featured builds. Use the carousel controls or keyboard arrows.
Screenshot of the omarchy lock screen customizer app
omarchy-lock-studio

Python web app (127.0.0.1:8731) to customize the Omarchy lock screen: clock, profile + welcome line, dev quotes, MPRIS media, background picker with auto-upscale, theme text color, backup/restore. Generates LockView.qml preserving PAM auth.

Python · QML · HTML/CSS/JS · Linux

GitHub profile →
Screenshot of Docker homelab containers dashboard
Docker Media Homelab

Self-hosted media stack with Jellyfin, Radarr, qBittorrent, and Prowlarr. Solved volume permissions, indexer API integration, and container networking on Arch Linux.

Docker Compose · Linux · Networking

GitHub profile →
Screenshot of LubeLogger vehicle maintenance tracker
LubeLogger — Vehicle Maintenance

Self-hosted vehicle maintenance tracking (LubeLogger): service records, costs, and reminders.

Self-hosted · Docker · HTML/CSS

GitHub profile →
Mockup of this portfolio website on laptop and phone screens
This Portfolio (HTML/CSS/JS)

Semantic HTML5, responsive CSS with media queries, accessible hamburger nav, JS carousel, validated contact form, and scroll-reveal animations. Deployed to GitHub Pages and the NJIT student server.

Semantic HTML · CSS · Vanilla JS

Back to top →
‹ Prev

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
