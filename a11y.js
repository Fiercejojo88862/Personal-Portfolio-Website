/* ============================================================
   a11y.js — accessibility control panel
   Self-contained companion to a11y.css. Shortcut: Alt + A
   Settings persist in localStorage ("jms-a11y").
   ============================================================ */
(function () {
  var KEY = 'jms-a11y';
  var root = document.documentElement;
  var DEFAULTS = { scale: 100, contrast: false, underline: false, readable: false, calm: false };
  var state = {
    scale: DEFAULTS.scale,
    contrast: DEFAULTS.contrast,
    underline: DEFAULTS.underline,
    readable: DEFAULTS.readable,
    calm: DEFAULTS.calm
  };

  var LABELS = {
    contrast: 'high contrast',
    underline: 'underlined links',
    readable: 'readable text',
    calm: 'paused animations'
  };

  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (saved && typeof saved === 'object') {
      if (typeof saved.scale === 'number') state.scale = Math.min(150, Math.max(90, saved.scale));
      ['contrast', 'underline', 'readable', 'calm'].forEach(function (k) {
        if (k in saved) state[k] = !!saved[k];
      });
    }
  } catch (e) { /* ignore bad storage */ }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function apply() {
    if (state.scale === 100) root.style.removeProperty('font-size');
    else root.style.fontSize = state.scale + '%';
    root.classList.toggle('a11y-contrast', state.contrast);
    root.classList.toggle('a11y-underline', state.underline);
    root.classList.toggle('a11y-readable', state.readable);
    root.classList.toggle('a11y-calm', state.calm);
  }

  apply();

  /* ---------- Live region for feedback ---------- */
  var live = document.createElement('p');
  live.className = 'sr-only';
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);
  function announce(msg) {
    live.textContent = '';
    setTimeout(function () { live.textContent = msg; }, 30);
  }

  /* ---------- Trigger button ---------- */
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'a11y-btn';
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Accessibility options (Alt + A)');
  btn.title = 'Accessibility options (Alt + A)';
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="4" r="2"/>' +
    '<path d="M4 8h16"/><path d="M12 8v6"/><path d="M8 21l4-7 4 7"/>' +
    '</svg>';
  document.body.appendChild(btn);

  function switchRow(id, title, desc) {
    return '<div class="a11y-row">' +
      '<div class="a11y-copy">' +
        '<span class="a11y-label" id="a11y-' + id + '-label">' + title + '</span>' +
        '<span class="a11y-desc" id="a11y-' + id + '-desc">' + desc + '</span>' +
      '</div>' +
      '<button type="button" class="a11y-switch" role="switch" aria-checked="false"' +
        ' data-a11y="' + id + '" aria-labelledby="a11y-' + id + '-label"' +
        ' aria-describedby="a11y-' + id + '-desc"></button>' +
    '</div>';
  }

  /* ---------- Panel ---------- */
  var overlay = document.createElement('div');
  overlay.className = 'a11y-overlay';
  overlay.hidden = true;
  overlay.innerHTML =
    '<div class="a11y-card" role="dialog" aria-modal="true" aria-labelledby="a11y-title" aria-describedby="a11y-desc">' +
      '<button type="button" class="a11y-close" aria-label="Close accessibility options">' +
        '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>' +
      '</button>' +
      '<h2 id="a11y-title">Accessibility</h2>' +
      '<p class="a11y-hint" id="a11y-desc">Adjust how this site looks and moves. Your choices are saved on this device.</p>' +

      '<div class="a11y-row">' +
        '<div class="a11y-copy">' +
          '<span class="a11y-label" id="a11y-size-label">Text size</span>' +
          '<span class="a11y-desc">Scales every piece of text on the site.</span>' +
        '</div>' +
        '<span class="a11y-stepper">' +
          '<button type="button" data-a11y="smaller" aria-label="Decrease text size" aria-describedby="a11y-size-label">A&minus;</button>' +
          '<output id="a11y-size" aria-live="polite">100%</output>' +
          '<button type="button" data-a11y="bigger" aria-label="Increase text size" aria-describedby="a11y-size-label">A+</button>' +
        '</span>' +
      '</div>' +

      switchRow('contrast', 'High contrast', 'Pure black background, white text, stronger borders.') +
      switchRow('underline', 'Underline links', 'Links stay obvious without relying on colour alone.') +
      switchRow('readable', 'Readable text', 'Clearer font with wider letter and line spacing.') +
      switchRow('calm', 'Pause animations', 'Stops movement, parallax, and auto-scrolling.') +

      '<button type="button" class="a11y-reset">Reset all settings</button>' +
    '</div>';
  document.body.appendChild(overlay);

  var card = overlay.querySelector('.a11y-card');
  var closeBtn = overlay.querySelector('.a11y-close');
  var resetBtn = overlay.querySelector('.a11y-reset');
  var sizeOut = overlay.querySelector('#a11y-size');
  var switches = {
    contrast: overlay.querySelector('[data-a11y="contrast"]'),
    underline: overlay.querySelector('[data-a11y="underline"]'),
    readable: overlay.querySelector('[data-a11y="readable"]'),
    calm: overlay.querySelector('[data-a11y="calm"]')
  };
  var lastFocus = null;

  function paint() {
    sizeOut.textContent = state.scale + '%';
    Object.keys(switches).forEach(function (k) {
      switches[k].setAttribute('aria-checked', String(state[k]));
    });
  }
  paint();

  function setScale(next) {
    state.scale = Math.min(150, Math.max(90, next));
    apply(); save(); paint();
    announce('Text size ' + state.scale + ' percent');
  }

  Object.keys(switches).forEach(function (k) {
    switches[k].addEventListener('click', function () {
      state[k] = !state[k];
      apply(); save(); paint();
      announce((state[k] ? 'On: ' : 'Off: ') + LABELS[k]);
    });
  });

  overlay.querySelector('[data-a11y="smaller"]').addEventListener('click', function () { setScale(state.scale - 10); });
  overlay.querySelector('[data-a11y="bigger"]').addEventListener('click', function () { setScale(state.scale + 10); });

  resetBtn.addEventListener('click', function () {
    Object.keys(DEFAULTS).forEach(function (k) { state[k] = DEFAULTS[k]; });
    apply(); save(); paint();
    announce('Accessibility settings reset');
  });

  /* ---------- Open / close ---------- */
  function open() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }
  function close() {
    overlay.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    (lastFocus || btn).focus();
  }
  function toggle() { overlay.hidden ? open() : close(); }

  btn.addEventListener('click', toggle);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

  /* ---------- Keyboard ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'a' || e.key === 'A')) {
      e.preventDefault();
      toggle();
      return;
    }
    if (e.key === 'Escape' && !overlay.hidden) { close(); return; }
    if (e.key === 'Tab' && !overlay.hidden) {
      var items = card.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Mention the shortcut in the site's help panel ---------- */
  function addShortcutHint() {
    var list = document.querySelector('.keys-card ul');
    if (!list || list.querySelector('[data-a11y-hint]')) return;
    var li = document.createElement('li');
    li.setAttribute('data-a11y-hint', '');
    li.innerHTML = '<kbd>Alt</kbd>+<kbd>A</kbd> Accessibility options';
    list.appendChild(li);
  }
  addShortcutHint();
  window.addEventListener('load', addShortcutHint);
})();
