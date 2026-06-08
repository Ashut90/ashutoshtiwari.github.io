/* connectors.js — animated SVG lines, IntersectionObserver reveals */
(function () {
  'use strict';

  var NS  = 'http://www.w3.org/2000/svg';
  var STROKE  = 'rgba(0,212,255,0.38)';
  var DOT_CLR = '#00d4ff';

  /* ── SVG CONNECTOR LINES ─────────────────────────── */

  function buildConnectors() {
    var section = document.querySelector('.nav-cards-section');
    var svg     = document.getElementById('nav-connector-svg');
    var cards   = section ? Array.prototype.slice.call(section.querySelectorAll('.nav-card')) : [];
    if (!svg || !cards.length) return;

    /* Clear previous contents */
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var w = section.offsetWidth;
    var h = section.offsetHeight;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('width',  w);
    svg.setAttribute('height', h);

    /* Glow filter */
    var defs = document.createElementNS(NS, 'defs');
    defs.innerHTML =
      '<filter id="conn-glow" x="-60%" y="-60%" width="220%" height="220%">' +
        '<feGaussianBlur stdDeviation="2.5" result="blur"/>' +
        '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>';
    svg.appendChild(defs);

    var sRect    = section.getBoundingClientRect();
    var heading  = section.querySelector('.nav-cards-heading');
    var hRect    = heading ? heading.getBoundingClientRect() : null;
    var originX  = w / 2;
    var originY  = hRect ? (hRect.bottom - sRect.top + 10) : 72;

    /* Central origin dot */
    var odot = document.createElementNS(NS, 'circle');
    odot.setAttribute('cx', originX);
    odot.setAttribute('cy', originY);
    odot.setAttribute('r', '4.5');
    odot.setAttribute('fill', DOT_CLR);
    odot.setAttribute('filter', 'url(#conn-glow)');
    svg.appendChild(odot);

    /* One path per card */
    cards.forEach(function (card, i) {
      var cRect = card.getBoundingClientRect();
      var destX = cRect.left - sRect.left + cRect.width  / 2;
      var destY = cRect.top  - sRect.top;

      /* Cubic bezier: gentle S-curve from origin down to card top */
      var dx   = destX - originX;
      var dy   = destY - originY;
      var cp1x = originX + dx * 0.12;
      var cp1y = originY + dy * 0.55;
      var cp2x = destX   - dx * 0.08;
      var cp2y = destY   - 32;

      var d = 'M ' + originX + ' ' + originY +
              ' C ' + cp1x + ' ' + cp1y + ','
                    + cp2x + ' ' + cp2y + ','
                    + destX + ' ' + destY;

      var path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('stroke', STROKE);
      path.setAttribute('stroke-width', '1.3');
      path.setAttribute('fill', 'none');
      path.setAttribute('filter', 'url(#conn-glow)');
      svg.appendChild(path);

      /* Measure after appending so getTotalLength works */
      var len = path.getTotalLength();
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;
      path.style.animation =
        'connectorDraw 0.9s ease forwards ' + (0.25 + i * 0.16) + 's';

      /* Card entry dot */
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', destX);
      dot.setAttribute('cy', destY);
      dot.setAttribute('r', '3');
      dot.setAttribute('fill', DOT_CLR);
      dot.setAttribute('filter', 'url(#conn-glow)');
      dot.style.opacity   = '0';
      dot.style.animation =
        'connectorDotFade 0.35s ease forwards ' + (0.25 + i * 0.16 + 0.8) + 's';
      svg.appendChild(dot);
    });
  }

  /* Rebuild connectors when home section becomes visible again */
  function hookSpa() {
    if (!window.__spaShowView) return;
    var orig = window.__spaShowView;
    window.__spaShowView = function (key, updateHash) {
      orig(key, updateHash);
      if (key === 'home') setTimeout(buildConnectors, 120);
    };
  }

  /* ── INTERSECTIONOBSERVER REVEALS ───────────────── */

  function setupRevealObserver() {
    if (!window.IntersectionObserver) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('io-hidden');
          entry.target.classList.add('io-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    /* Observe scrollable-section content below the initial fold */
    var scrollableSections = document.querySelectorAll(
      '#about-section, #skills-section, #resume-section, #project-section, #contact-section'
    );
    scrollableSections.forEach(function (sec) {
      sec.querySelectorAll('.ftco-animate').forEach(function (el) {
        /* Only add io-hidden to elements not yet animated by spa.js */
        if (!el.classList.contains('ftco-animated')) {
          el.classList.add('io-hidden');
          observer.observe(el);
        }
      });
    });
  }

  /* ── INIT ────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    /* Build connectors after a short delay to ensure grid layout */
    setTimeout(buildConnectors, 280);
    setupRevealObserver();
  });

  /* Rebuild on window resize */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildConnectors, 160);
  });

}());
