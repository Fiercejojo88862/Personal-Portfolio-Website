/* ============================================================
   terminal.js — interactive shell widget for the portfolio
   Pure client-side. Mounts into #terminal-mount.
   Self-contained: remove this file + its tags to revert.
   ============================================================ */
(function () {
  var mount = document.getElementById('terminal-mount');
  if (!mount) return;

  /* ---------------- Content the shell can read ---------------- */
  var FILES = {
    'about.txt': [
      'Joseph Michael Shaker - 20',
      'Software and Data Engineering Technology, NJIT',
      'Major approved June 2026. Commutes to Newark, NJ from Aberdeen.',
      '',
      'Builds: responsive web front-ends, Python tooling, C++ coursework,',
      'and a self-hosted Docker media homelab on Arch Linux.'
    ],
    'skills.txt': [
      'Languages   HTML/CSS, JavaScript, Node.js, C++, Python',
      'Systems     Arch / Omarchy (Hyprland), Docker Compose, Linux permissions',
      'Tools       Git and GitHub, GitHub Pages, SolidWorks, video editing',
      'Practices   Responsive design, semantic HTML, accessibility, homelab debugging'
    ],
    'contact.txt': [
      'email     josephshaker2020 [at] aol [dot] com',
      'github    github.com/Fiercejojo88862',
      'linkedin  linkedin.com/in/joseph-shaker-548a49247',
      'location  Aberdeen / Newark, NJ (Eastern Time)'
    ],
    'README.md': [
      '# Personal portfolio',
      'Semantic HTML, one stylesheet, vanilla JS. No build step, no framework.',
      'Deployed on GitHub Pages. Terminal widget included for fun.'
    ]
  };

  var PROJECTS = {
    'lock-studio': {
      file: 'project-lock-studio.html',
      desc: 'Omarchy Lock Studio - Python web app that themes the Omarchy lock screen without breaking PAM login.'
    },
    'homelab': {
      file: 'project-homelab.html',
      desc: 'Docker Media Homelab - five self-hosted services (Jellyfin, Radarr, qBittorrent, Prowlarr, LubeLogger) on Arch Linux.'
    },
    'lubelogger': {
      file: 'project-lubelogger.html',
      desc: 'LubeLogger - self-hosted maintenance tracker for fuel, services, costs, and reminders.'
    }
  };

  var EMAIL = 'josephshaker2020' + '[at]' + 'aol' + '[dot]' + 'com';

  /* ---------------- Build the window ---------------- */
  var term = document.createElement('div');
  term.className = 'term';
  term.innerHTML =
    '<div class="term-bar">' +
      '<span class="term-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<span class="term-title">joseph@portfolio: ~</span>' +
      '<span class="term-tag">bash</span>' +
    '</div>' +
    '<div class="term-body">' +
      '<div class="term-out" id="term-out" role="log" aria-live="polite" aria-label="Terminal output"></div>' +
      '<form class="term-form" id="term-form">' +
        '<label class="sr-only" for="term-input">Type a terminal command</label>' +
        '<span class="term-prompt" aria-hidden="true">joseph@portfolio:~$</span>' +
        '<input class="term-input" id="term-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="try: help" />' +
      '</form>' +
    '</div>';
  mount.appendChild(term);

  var hint = document.createElement('p');
  hint.className = 'term-hint';
  hint.innerHTML = 'Try <kbd>ls</kbd>, <kbd>cat about.txt</kbd>, <kbd>fetch --stats</kbd>, or <kbd>help</kbd>. ' +
    'Press <kbd>Alt</kbd>+<kbd>T</kbd> to jump here from anywhere.';
  mount.appendChild(hint);

  var out = term.querySelector('#term-out');
  var form = term.querySelector('#term-form');
  var input = term.querySelector('#term-input');
  var body = term.querySelector('.term-body');
  var promptEl = term.querySelector('.term-prompt');
  var titleEl = term.querySelector('.term-title');

  /* ---------------- Output helpers ---------------- */
  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function line(text, cls) {
    var el = document.createElement('div');
    el.className = 'term-line' + (cls ? ' ' + cls : '');
    el.textContent = text;
    out.appendChild(el);
    return el;
  }

  function lines(list, cls) {
    list.forEach(function (t) { line(t, cls); });
  }

  function link(label, href, cls) {
    var el = document.createElement('div');
    el.className = 'term-line' + (cls ? ' ' + cls : '');
    var a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    el.appendChild(a);
    out.appendChild(el);
    return el;
  }

  function echoCommand(raw) {
    var el = document.createElement('div');
    el.className = 'term-line cmd';
    var ps = document.createElement('span');
    ps.className = 'term-ps1';
    ps.textContent = promptText;
    el.appendChild(ps);
    el.appendChild(document.createTextNode(raw));
    out.appendChild(el);
  }

  /* ---------------- Shell state ---------------- */
  var cwd = '~';
  var history = [];
  var hIndex = 0;
  var promptText = 'joseph@portfolio:~$ ';

  function setPrompt() {
    promptText = cwd === '~/projects'
      ? 'joseph@portfolio:~/projects$ '
      : 'joseph@portfolio:~$ ';
    promptEl.textContent = promptText;
    titleEl.textContent = 'joseph@portfolio: ' + cwd;
  }
  setPrompt();

  var COMMANDS = ['help', 'ls', 'cat', 'cd', 'open', 'whoami', 'neofetch', 'fetch',
    'curl', 'date', 'echo', 'history', 'clear', 'theme', 'sudo', 'exit', 'pwd'];

  /* ---------------- Command implementations ---------------- */
  function cmdHelp() {
    lines([
      'Available commands',
      '  help              show this list',
      '  ls [dir]          list files, or projects/',
      '  cat <file>        read about.txt, skills.txt, contact.txt, README.md',
      '  cd <dir>          enter projects/ (cd .. or cd ~ to leave)',
      '  open <project>    open a case study: lock-studio | homelab | lubelogger',
      '  whoami            who built this site',
      '  neofetch          system summary',
      '  fetch --stats     live visit counter (serverless API)',
      '  curl contact      contact details',
      '  date              current date and time',
      '  echo <text>       print text back',
      '  history           commands you have run',
      '  clear             clear the screen',
      '  theme matrix      green-on-black mode (theme default to undo)',
      '  sudo <cmd>        try it',
      '  exit              leave the terminal',
      '',
      'Not every command is listed. Keep poking.'
    ], 'out');
  }

  function cmdLs(arg) {
    var target = (arg || '').replace(/\/+$/, '');
    if (cwd === '~/projects' && !target) {
      line('lock-studio/   homelab/   lubelogger/', 'out');
      line('Use: cat <name> for a summary, open <name> to visit.', 'muted');
      return;
    }
    if (target === 'projects' || target === 'projects/') {
      line('lock-studio/   homelab/   lubelogger/', 'out');
      line('Use: cd projects, then ls', 'muted');
      return;
    }
    if (target) { line('ls: ' + target + ': No such directory', 'err'); return; }
    line('about.txt   skills.txt   contact.txt   README.md   projects/', 'out');
  }

  function cmdCat(arg) {
    if (!arg) { line('cat: missing file operand. Try: cat about.txt', 'err'); return; }
    var name = arg.replace(/^\.\//, '');

    if (name.toLowerCase() === 'cat') {
      line('meow.', 'ok');
      line('cat: cat is not a file. opening the original nyan cat instead...', 'muted');
      if (!openPlayer('2yJgwwDcgV8', 'nyan-cat', 'nyan nyan nyan', 'Nyan Cat! [Official]', 1)) {
        line('popup blocked - open player.html?v=2yJgwwDcgV8 manually.', 'err');
      }
      return;
    }

    if (cwd === '~/projects' && PROJECTS[name]) {
      line(PROJECTS[name].desc, 'out');
      line('open ' + name + '  ->  opens the full case study', 'muted');
      return;
    }
    if (FILES[name]) { lines(FILES[name], 'out'); return; }
    if (name === 'projects' || name === 'projects/') { cmdLs('projects'); return; }
    line('cat: ' + arg + ': No such file. Try: ls', 'err');
  }

  function cmdCd(arg) {
    var target = (arg || '').replace(/\/+$/, '');
    if (!target || target === '~' || target === '/home/joseph') { cwd = '~'; setPrompt(); line('Back in ~', 'muted'); return; }
    if (target === '..') {
      cwd = '~';
      setPrompt();
      line('Back in ~', 'muted');
      return;
    }
    if (target === 'projects' || target === '~/projects') {
      cwd = '~/projects';
      setPrompt();
      line('Entered projects/', 'muted');
      line('lock-studio/   homelab/   lubelogger/', 'out');
      return;
    }
    line('cd: ' + arg + ': No such directory', 'err');
  }

  function cmdOpen(arg) {
    var key = (arg || '').replace(/\.md$/, '').replace(/\/+$/, '');
    if (!key) { line('open: which project? lock-studio | homelab | lubelogger', 'err'); return; }
    if (!PROJECTS[key]) { line('open: ' + arg + ': unknown project', 'err'); return; }
    line('Opening ' + key + ' ...', 'ok');
    window.location.href = PROJECTS[key].file;
  }

  function cmdWhoami() {
    lines([
      'Joseph Michael Shaker',
      'Software and Data Engineering Technology student, NJIT',
      'Aberdeen / Newark, NJ - builds web front-ends, Python tools, and a Docker homelab.'
    ], 'out');
  }

  function cmdNeofetch() {
    var rows = [
      ['OS', 'Arch Linux (Omarchy) / Windows 11 dual boot'],
      ['WM', 'Hyprland (Lua-configured)'],
      ['Shell', 'bash + this fake one'],
      ['Editor', 'whatever is open'],
      ['Stack', 'HTML/CSS/JS, Node.js, C++, Python, Docker'],
      ['Site', 'static, no build step, GitHub Pages']
    ];
    line('        _        joseph@portfolio', 'ok');
    line('       (o)       ----------------', 'ok');
    rows.forEach(function (r) {
      line('      / | \\      ' + r[0] + ': ' + r[1], 'out');
    });
  }

  function cmdFetch(arg) {
    if (arg !== '--stats') {
      line('fetch: try "fetch --stats"', 'err');
      return;
    }
    line('GET https://abacus.jasoncameron.dev/get/fiercejojo88862-portfolio/site', 'muted');
    fetch('https://abacus.jasoncameron.dev/get/fiercejojo88862-portfolio/site', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        line('200 OK  total visits: ' + Number(d.value || 0).toLocaleString(), 'ok');
        scrollDown();
      })
      .catch(function () {
        line('503 - counter offline right now. The odometer on this page uses the same API.', 'err');
        scrollDown();
      });
  }

  function cmdCurl(arg) {
    if (arg !== 'contact') { line('curl: try "curl contact"', 'err'); return; }
    line('contact.txt', 'muted');
    line('email     ' + EMAIL, 'out');
    link('github    github.com/Fiercejojo88862', 'https://github.com/Fiercejojo88862', 'out');
    link('linkedin  linkedin.com/in/joseph-shaker-548a49247', 'https://www.linkedin.com/in/joseph-shaker-548a49247', 'out');
    line('location  Aberdeen / Newark, NJ (Eastern Time)', 'out');
    link('contact page  ->  contact.html', 'contact.html', 'out');
  }

  function cmdTheme(arg) {
    var mode = (arg || '').toLowerCase();
    if (mode === 'matrix') {
      term.classList.add('matrix');
      line('theme: matrix engaged. Wake up, Neo.', 'ok');
      return;
    }
    if (mode === 'default' || mode === 'reset') {
      term.classList.remove('matrix');
      line('theme: back to default.', 'muted');
      return;
    }
    line('theme: use "theme matrix" or "theme default"', 'err');
  }

  function cmdSudo(arg) {
    line('joseph is not in the sudoers file. This incident has been reported.', 'err');
    if (arg) line('(nice try with: sudo ' + arg + ')', 'muted');
  }

  function cmdExit() {
    line('There is no exit. Only a contact form.', 'muted');
    link('contact.html', 'contact.html', 'out');
  }

  function cmdHistory() {
    if (!history.length) { line('history: empty', 'muted'); return; }
    history.forEach(function (h, i) { line('  ' + String(i + 1).padStart(3, ' ') + '  ' + h, 'out'); });
  }

  /* ---------------- Easter eggs ---------------- */
  function rickroll() {
    line('Never gonna give you up...', 'ok');
    line('autoplaying in a new tab. You were warned.', 'muted');
    if (!openPlayer('dQw4w9WgXcQ', 'rickroll', 'you were warned', 'Never gonna give you up')) {
      line('popup blocked - open player.html, or allow popups for this site.', 'err');
    }
  }

  function openPlayer(videoId, name, note, title, start) {
    var url = 'player.html?v=' + encodeURIComponent(videoId) +
      '&name=' + encodeURIComponent(name || 'rickroll') +
      '&note=' + encodeURIComponent(note || '') +
      '&title=' + encodeURIComponent(title || '');
    if (start) url += '&t=' + encodeURIComponent(start);
    var win = window.open(url, '_blank');
    if (win) {
      try { win.opener = null; } catch (e) {}
      return true;
    }
    return false;
  }

  function coffee() {
    line('      ( (', 'ok');
    line('       ) )', 'ok');
    line('    ........', 'ok');
    line('    |      |]', 'ok');
    line('    \\      /', 'ok');
    line('     `----\'', 'ok');
    line('Brewing... done. Productivity +1.', 'muted');
  }

  /* ---------------- Dispatch ---------------- */
  function run(raw) {
    var trimmed = raw.trim();
    if (!trimmed) return;

    echoCommand(trimmed);
    history.push(trimmed);
    hIndex = history.length;

    var parts = trimmed.split(/\s+/);
    var name = parts[0].toLowerCase();
    var arg = parts.slice(1).join(' ');

    switch (name) {
      case 'help': cmdHelp(); break;
      case 'ls': cmdLs(arg); break;
      case 'cat': cmdCat(arg); break;
      case 'cd': cmdCd(arg); break;
      case 'open': cmdOpen(arg); break;
      case 'whoami': cmdWhoami(); break;
      case 'neofetch': cmdNeofetch(); break;
      case 'fetch': cmdFetch(arg); break;
      case 'curl': cmdCurl(arg); break;
      case 'pwd': line(cwd === '~' ? '/home/joseph' : '/home/joseph/projects', 'out'); break;
      case 'date': line(new Date().toString(), 'out'); break;
      case 'echo': line(arg, 'out'); break;
      case 'history': cmdHistory(); break;
      case 'clear':
        out.textContent = '';
        break;
      case 'theme': cmdTheme(arg); break;
      case 'sudo': cmdSudo(arg); break;
      case 'exit': cmdExit(); break;
      case 'rickroll': rickroll(); break;
      case 'coffee': coffee(); break;
      case 'matrix':
        term.classList.add('matrix');
        line('Wake up, Neo... the matrix has you. (theme matrix also works)', 'ok');
        break;
      default:
        line(name + ': command not found. Try "help".', 'err');
    }
    scrollDown();
  }

  /* ---------------- Input handling ---------------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = input.value;
    input.value = '';
    run(value);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex] || '';
      input.setSelectionRange(input.value.length, input.value.length);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!history.length) return;
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] || '';
      return;
    }
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.textContent = '';
      return;
    }
    if (e.key === 'Tab') {
      if (complete()) e.preventDefault();
    }
  });

  function complete() {
    var value = input.value;
    var tokens = value.split(/\s+/);
    var partial = tokens[tokens.length - 1].toLowerCase();
    if (!partial) return false;

    var pool;
    if (tokens.length === 1) {
      pool = COMMANDS;
    } else if (['cat', 'open', 'ls'].indexOf(tokens[0].toLowerCase()) > -1) {
      pool = cwd === '~/projects'
        ? Object.keys(PROJECTS)
        : Object.keys(FILES).concat(['projects']);
    } else {
      return false;
    }

    var matches = pool.filter(function (c) { return c.indexOf(partial) === 0; });
    if (!matches.length) return false;
    if (matches.length === 1) {
      tokens[tokens.length - 1] = matches[0];
      input.value = tokens.join(' ');
    } else {
      line(matches.join('   '), 'muted');
      scrollDown();
    }
    return true;
  }

  /* ---------------- Focus helpers ---------------- */
  body.addEventListener('click', function (e) {
    var sel = window.getSelection();
    if (sel && String(sel).length) return;      // don't steal a text selection
    if (e.target === input) return;
    input.focus();
  });

  document.addEventListener('keydown', function (e) {
    if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      input.focus();
      scrollDown();
    }
  });

  /* ---------------- Boot ---------------- */
  lines([
    'JosephOS 1.0  -  portfolio shell',
    'Type "help" for commands, "ls" to look around.'
  ], 'muted');
  line('', 'gap');
})();
