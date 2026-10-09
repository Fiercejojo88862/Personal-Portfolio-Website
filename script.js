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
  restart();
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
