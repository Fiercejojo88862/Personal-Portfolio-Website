/* ============================================================
   motion.js — extra motion + effects layer for the portfolio
   Self-contained companion to motion.css. Delete both files and
   their tags to revert to the previous behaviour.
   ============================================================ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var root = document.documentElement;

  // Flag styles that hide things, only when JS is alive
  root.classList.add('fx-ready');

  // Safety net: never leave content hidden if anything below throws
  window.addEventListener('error', function () { root.classList.remove('fx-ready'); });

  if (reduce) return;

  function raf(fn) { return window.requestAnimationFrame(fn); }

  /* ---------- Hero title: word-by-word rise ---------- */
  (function splitTitle() {
    var h1 = document.querySelector('.hero h1');
    if (!h1) return;
    var text = h1.textContent.trim();
    if (!text) return;
    h1.setAttribute('aria-label', text);
    h1.textContent = '';
    text.split(/\s+/).forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'fx-word';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--i', i);
      span.textContent = word;
      h1.appendChild(span);
      if (i < text.split(/\s+/).length - 1) h1.appendChild(document.createTextNode(' '));
    });
  })();

  /* ---------- Cursor glow ---------- */
  if (fine) {
    var glow = document.createElement('div');
    glow.className = 'fx-cursor';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var cx = tx, cy = ty, active = false, looping = false;

    function moveGlow() {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      glow.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) raf(moveGlow);
      else looping = false;
    }
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!active) { active = true; glow.classList.add('on'); }
      if (!looping) { looping = true; raf(moveGlow); }
    }, { passive: true });
    window.addEventListener('pointerleave', function () { glow.classList.remove('on'); });
    document.addEventListener('mouseleave', function () { glow.classList.remove('on'); });
  }

  /* ---------- Staggered groups ---------- */
  var groups = document.querySelectorAll(
    '.feature-grid, .card-grid, .repo-grid, .stats-band, .skills-grid, .steps, .faq, .timeline, .chips'
  );
  groups.forEach(function (group) {
    group.classList.add('fx-stagger');
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--i', i);
    });
  });

  if (!('IntersectionObserver' in window)) {
    groups.forEach(function (g) { g.classList.add('fx-in'); });
    return;
  }

  var groupIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var group = entry.target;
      group.classList.add('fx-in');
      groupIO.unobserve(group);
      // let the last staggered child finish, then clear delays for snappy hovers
      var span = group.children.length * 80 + 800;
      setTimeout(function () { group.classList.add('fx-done'); }, span);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  groups.forEach(function (g) { groupIO.observe(g); });

  // Timeline items draw their accent line on entry
  var itemIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var i = parseInt(el.dataset.fxIndex || '0', 10);
      itemIO.unobserve(el);
      setTimeout(function () { el.classList.add('fx-draw'); }, i * 90);
    });
  }, { threshold: 0.35 });
  document.querySelectorAll('.timeline-item').forEach(function (el, i) {
    el.dataset.fxIndex = i;
    itemIO.observe(el);
  });

  /* ---------- 3D tilt + glare ---------- */
  if (fine) {
    var tiltEls = document.querySelectorAll('.feature-card, .mini-card, .repo-card, .info-card, .skill-group, .step');
    var MAX = 7;

    tiltEls.forEach(function (card) {
      card.classList.add('fx-tilt');

      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--fx-ry', ((px - 0.5) * MAX * 2).toFixed(2) + 'deg');
        card.style.setProperty('--fx-rx', ((0.5 - py) * MAX * 2).toFixed(2) + 'deg');
        card.style.setProperty('--fx-gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--fx-gy', (py * 100).toFixed(1) + '%');
        card.classList.add('fx-tilting');
      });

      card.addEventListener('pointerleave', function () {
        card.classList.remove('fx-tilting');
        card.style.setProperty('--fx-rx', '0deg');
        card.style.setProperty('--fx-ry', '0deg');
      });
    });
  }
})();
