/* projects.js — card grid + neon connector + detail panel */
(function () {
  'use strict';

  var DATA = {
    'eaedk': {
      hash:    'b236994',
      name:    'EAEDK',
      license: 'v4.1.0',
      image:   null,
      desc:    'Local-first firmware mentor and validation engine. Deterministic engines — 23 pure validation rules, a risk engine, and semantic-intent costing — run fully offline with zero LLM and zero GPU. An optional local LLM (deepseek-r1:8b via Ollama) sits outside the trust boundary and may only explain data the engines have already verified, making hallucinated hardware facts structurally impossible. Ships with 14 built-in boards, an 8-page web UI with streaming chat, boot-log crash triage, datasheet PDF ingestion, and real build-file export (CMake + linker script).',
      metrics: [
        'Stack: Python · FastAPI · SQLite',
        '14 boards · 23 validation rules',
        'LLM: Ollama · deepseek-r1:8b (opt-in)',
        'Offline: all checks, zero GPU needed',
        '380 tests green · eval 20/20',
        'Web UI: 8 pages · streaming chat'
      ],
      github:  'https://github.com/Ashut90/eaedk'
    },
    'pdf-tutor': {
      hash:    'c1a8f33',
      name:    'PDF Tutor',
      license: 'MIT',
      image:   'https://raw.githubusercontent.com/Ashut90/pdf-tutor/main/assets/screenshot-main.png',
      desc:    'Desktop app that turns any technical PDF into an interactive study session using the VARK learning model. Reads the table of contents, picks a chapter, then explains it via Visual (mindmaps / flowcharts), Auditory (TTS read-aloud), Read/Write (structured notes + Anki flashcards), or Kinesthetic (runnable terminal commands). Runs fully offline via Ollama; also supports Gemini, Groq, and OpenRouter.',
      metrics: [
        'Language: Python / Tkinter',
        'AI: Ollama · Gemini · Groq · OpenRouter',
        'Modes: Visual · Auditory · R/W · Kinesthetic',
        'Export: Anki · Markdown · HTML mindmap',
        'License: MIT · CI: GitHub Actions'
      ],
      github:  'https://github.com/Ashut90/pdf-tutor'
    },
    'yt-dubber': {
      hash:    'd4c7b21',
      name:    'YouTube Dubber',
      license: 'GPL-3.0',
      image:   'https://raw.githubusercontent.com/Ashut90/youtube-dubber/main/assets/ui-preview.svg',
      desc:    'Dubs any YouTube video into 21 languages with a natural neural voice. Electron frontend + Python backend: yt-dlp fetches captions, Groq Whisper transcribes, LLaMA 3.1/3.3 translates with Hinglish-style casual phrasing for Indian languages, edge-TTS synthesizes, and mpv plays in sync. Segments are disk-cached so re-runs are instant. Also ships as a pip package and includes a Live Dub mode that translates any system audio in real time (~3–5 s lag, Linux).',
      metrics: [
        'Stack: Python · Electron · mpv',
        'Pipeline: Whisper → LLaMA 3.3 → edge-TTS',
        '21 languages · Hinglish-optimised',
        'pip install youtube-dubber',
        'Live Dub: real-time system audio (Linux)',
        'License: GPL-3.0'
      ],
      github:  'https://github.com/Ashut90/youtube-dubber'
    },
    'mongo-pkg': {
      hash:    'f2a1d09',
      name:    'MongoDB Connector Pkg',
      license: 'PyPI',
      image:   null,
      desc:    'pip-installable Python package (mymongoo-automate) that wraps MongoDB Atlas CRUD into a single CI/CD-friendly class. One mongo_operation object handles insert, find, update, and delete with no boilerplate connection management. Packaged with pyproject.toml, tested across Python versions via tox with pytest/unittest, and linted with flake8, pylint, and pycodestyle for production-grade code quality.',
      metrics: [
        'Language: Python',
        'DB: MongoDB Atlas',
        'Install: pip install mymongoo-automate',
        'Testing: pytest · tox · unittest',
        'Linting: flake8 · pylint · pycodestyle'
      ],
      github:  'https://github.com/Ashut90/mongodb_connectorpkg'
    }
  };

  var activeId     = null;
  var connPath     = null;
  var connDot      = null;
  var pulseRaf     = null;

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildHTML(p) {
    var img = '';
    if (p.image) {
      img = '<div class="pdc-img-wrap">' +
            '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + ' preview" ' +
            'loading="lazy" onerror="this.parentElement.style.display=\'none\'">' +
            '</div>';
    }
    var chips = p.metrics.map(function (m) {
      return '<span class="pdc-metric">' + esc(m) + '</span>';
    }).join('');
    return img +
      '<div class="pdc-body">' +
        '<div class="pdc-header">' +
          '<span class="pdc-hash">' + esc(p.hash) + '</span>' +
          '<span class="pdc-name">' + esc(p.name) + '</span>' +
          '<span class="pdc-license">' + esc(p.license) + '</span>' +
        '</div>' +
        '<p class="pdc-desc">' + esc(p.desc) + '</p>' +
        '<div class="pdc-metrics">' + chips + '</div>' +
        '<a class="pdc-link" href="' + esc(p.github) + '" target="_blank" rel="noopener">' +
          '&#x2197; View on GitHub' +
        '</a>' +
      '</div>';
  }

  function clearConnector() {
    if (pulseRaf) { cancelAnimationFrame(pulseRaf); pulseRaf = null; }
    if (connPath) { connPath.remove(); connPath = null; }
    if (connDot)  { connDot.remove();  connDot  = null; }
  }

  function drawConnector(cardEl, panelEl) {
    var svg = document.getElementById('proj-conn-svg');
    if (!svg) return;
    clearConnector();

    var cr = cardEl.getBoundingClientRect();
    var pr = panelEl.getBoundingClientRect();

    var ox = cr.right;
    var oy = cr.top + cr.height / 2;
    var dx = pr.left;
    var dy = pr.top + Math.min(pr.height * 0.28, 110);
    var cp = (dx - ox) * 0.52;

    var d = 'M' + ox + ',' + oy +
            ' C' + (ox + cp) + ',' + oy +
            ' ' + (dx - cp) + ',' + dy +
            ' ' + dx + ',' + dy;

    /* Origin pulse dot */
    var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', ox);
    dot.setAttribute('cy', oy);
    dot.setAttribute('r', '3.5');
    dot.setAttribute('fill', '#00FFCC');
    dot.style.opacity = '0.9';
    svg.appendChild(dot);
    connDot = dot;

    /* Connector path */
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'url(#pconn-grad)');
    path.setAttribute('stroke-width', '1.6');
    path.setAttribute('stroke-linecap', 'round');
    path.style.opacity = '0.9';
    svg.appendChild(path);
    connPath = path;

    /* Draw-on animation via stroke-dashoffset */
    var len = path.getTotalLength();
    path.style.strokeDasharray  = len;
    path.style.strokeDashoffset = len;
    path.style.transition = 'stroke-dashoffset 0.55s ease';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        path.style.strokeDashoffset = '0';
      });
    });

    /* Pulse loop after draw-on finishes */
    setTimeout(function () {
      if (connPath !== path) return;
      var op = 0.9, dir = -1;
      function pulse() {
        if (connPath !== path) return;
        op += dir * 0.011;
        if (op <= 0.28) dir = 1;
        if (op >= 0.94) dir = -1;
        path.style.opacity = op;
        if (connDot) {
          connDot.style.opacity = (0.4 + ((op - 0.28) / 0.66) * 0.55).toFixed(3);
        }
        pulseRaf = requestAnimationFrame(pulse);
      }
      pulseRaf = requestAnimationFrame(pulse);
    }, 660);
  }

  function selectProject(id) {
    var proj = DATA[id];
    if (!proj) return;
    activeId = id;

    /* Highlight active card */
    document.querySelectorAll('.proj-sq-card').forEach(function (c) {
      c.classList.toggle('active', c.dataset.id === id);
    });

    /* Swap detail content */
    var empty   = document.getElementById('proj-detail-empty');
    var content = document.getElementById('proj-detail-content');
    var panel   = document.getElementById('proj-detail-panel');

    if (empty)   empty.style.display   = 'none';
    if (content) {
      content.style.animation = 'none';
      content.style.display   = 'none';
      content.innerHTML = buildHTML(proj);
      void content.offsetWidth;          /* force reflow to replay animation */
      content.style.animation = '';
      content.style.display   = 'block';
    }
    if (panel) panel.classList.add('has-content');

    /* Draw neon connector on next frame so panel has new size */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var cardEl  = document.getElementById('psc-' + id);
        var panelEl = document.getElementById('proj-detail-panel');
        if (cardEl && panelEl) drawConnector(cardEl, panelEl);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMatrix(0.35);

    /* Stagger card entrance */
    document.querySelectorAll('.proj-sq-card').forEach(function (card, i) {
      setTimeout(function () { card.style.opacity = '1'; }, 200 + i * 150);
    });

    /* Card click handlers */
    document.querySelectorAll('.proj-sq-card').forEach(function (card) {
      card.addEventListener('click', function () { selectProject(card.dataset.id); });
    });

    /* Auto-select first card after entrance animation */
    setTimeout(function () { selectProject('eaedk'); }, 750);

    /* Redraw connector after window resize */
    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () {
        if (!activeId) return;
        var cardEl  = document.getElementById('psc-' + activeId);
        var panelEl = document.getElementById('proj-detail-panel');
        if (cardEl && panelEl) drawConnector(cardEl, panelEl);
      }, 180);
    });
  });

}());
