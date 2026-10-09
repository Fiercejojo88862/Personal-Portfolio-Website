// Mobile nav
const toggle = document.getElementById('nav-toggle');
const nav = document.getElementById('site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// Active link for current page (active class is also set in HTML)
const links = [...document.querySelectorAll('.nav-link')];
const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
links.forEach(l => {
  const href = (l.getAttribute('href') || '').toLowerCase();
  l.classList.toggle('active', href === current || (current === '' && href === 'index.html'));
});

// Typed effect (home page only)
const roles = ['Software + Data Engineering Student', 'C++ • Node.js • Python', 'Linux / Docker Homelab Builder', 'Responsive Web Developer'];
const typedEl = document.getElementById('typed');
if (typedEl) {
  let ri = 0, ci = 0, deleting = false;
  function typeLoop() {
    const word = roles[ri];
    typedEl.textContent = word.slice(0, ci);
    if (!deleting && ci < word.length) ci++;
    else if (!deleting) { deleting = true; return setTimeout(typeLoop, 1200); }
    else if (ci > 0) ci--;
    else { deleting = false; ri = (ri + 1) % roles.length; }
    setTimeout(typeLoop, deleting ? 35 : 70);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) typeLoop();
  else typedEl.textContent = roles[0];
}

// Carousel (projects page only)
const track = document.getElementById('carousel-track');
const dotsWrap = document.getElementById('carousel-dots');
if (track && dotsWrap) {
  const slides = [...track.children];
  let index = 0, timer;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.setAttribute('aria-selected', String(i === 0));
    d.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(d);
  });
  const dots = [...dotsWrap.children];

  function goTo(i, manual = false) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.setAttribute('aria-selected', String(di === index)));
    if (manual) restart();
  }
  function restart() { clearInterval(timer); timer = setInterval(() => goTo(index + 1), 6000); }
  document.getElementById('prev-btn').addEventListener('click', () => goTo(index - 1, true));
  document.getElementById('next-btn').addEventListener('click', () => goTo(index + 1, true));
  document.getElementById('carousel').addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(index - 1, true);
    if (e.key === 'ArrowRight') goTo(index + 1, true);
  });
  function slideFromHash() {
    const m = window.location.hash.match(/project-(\d+)/);
    if (m) {
      const i = parseInt(m[1], 10) - 1;
      if (i >= 0 && i < slides.length) goTo(i);
    }
  }
  slideFromHash();
  window.addEventListener('hashchange', slideFromHash);
  restart();
}

// Scroll progress bar + parallax (Apple-style), skipped for reduced motion
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
  const scrubEls = [...document.querySelectorAll('[data-scrub-scale]')];
  const header = document.querySelector('.site-header');
  let ticking = false;
  function expo(p) { return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); }
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      el.style.transform = `translateY(${window.scrollY * speed}px)`;
    });
    const vh = window.innerHeight;
    scrubEls.forEach(el => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));
      const e = expo(p);
      el.style.transform = `scale(${(0.88 + 0.12 * e).toFixed(3)})`;
      el.style.opacity = (0.25 + 0.75 * e).toFixed(3);
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
}

// Skill bars fill when scrolled into view
const barIO = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); barIO.unobserve(e.target); } });
}, { threshold: 0.4 });
document.querySelectorAll('.skill-list li').forEach(el => barIO.observe(el));

// Animated counters (stats band on home page)
const counters = [...document.querySelectorAll('[data-count]')];
if (counters.length) {
  const render = el => { el.textContent = el.dataset.count + (el.dataset.suffix || ''); };
  if (reduceMotion) { counters.forEach(render); }
  else {
    const countIO = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        countIO.unobserve(el);
        const target = parseInt(el.dataset.count, 10) || 0;
        const suffix = el.dataset.suffix || '';
        const start = performance.now(), dur = 1200;
        (function tick(t) {
          const p = Math.min(1, (t - start) / dur);
          el.textContent = Math.round(target * (1 - Math.pow(2, -10 * p))) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countIO.observe(el));
  }
}

// Scroll reveal
const revealIO = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealIO.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('section .container').forEach(el => { el.classList.add('reveal'); revealIO.observe(el); });

// Form validation (contact page only)
const form = document.getElementById('contact-form');
if (form) {
  const status = document.getElementById('form-status');
  function setErr(id, msg) { document.getElementById(id).textContent = msg; }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    let ok = true;
    setErr('name-error', ''); setErr('email-error', ''); setErr('message-error', '');
    if (name.length < 2) { setErr('name-error', 'Enter your name (2+ characters).'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('email-error', 'Enter a valid email address.'); ok = false; }
    if (message.length < 10) { setErr('message-error', 'Message must be at least 10 characters.'); ok = false; }
    if (!ok) { status.textContent = 'Please fix the errors above.'; return; }
    status.textContent = `Thanks ${name}! Your message was validated — wire this form to Formspree to receive emails.`;
    form.reset();
  });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
