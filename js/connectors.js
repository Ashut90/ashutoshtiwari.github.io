/* connectors.js — gradient fiber-optic SVG lines + IntersectionObserver reveals */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* Per-card horizontal control-point offsets — gives each line a unique S-curve */
  var CP_OFFSETS = [-90, -45, 30, -60, 20, 70];

  function buildConnectors() {
    var section = document.querySelector('.nav-cards-section');
    var svg     = document.getElementById('nav-connector-svg');
    var cards   = section
      ? Array.prototype.slice.call(section.querySelectorAll('.nav-card'))
      : [];
    if (!svg || !cards.length) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var w = section.offsetWidth;
    var h = section.offsetHeight;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('width',  w);
    svg.setAttribute('height', h);

    /* ── Defs: glow filters + per-path gradients ── */
    var defs = document.createElementNS(NS, 'defs');
    var defsHTML =
      /* Tight glow for lines */
      '<filter id="cg1" x="-60%" y="-60%" width="220%" height="220%">' +
        '<feGaussianBlur stdDeviation="2" result="b"/>' +
        '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>' +
      /* Wide soft glow for shadow traces */
      '<filter id="cg2" x="-80%" y="-80%" width="360%" height="360%">' +
        '<feGaussianBlur stdDeviation="5" result="b"/>' +
        '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>';

    /* Placeholder gradient defs — coordinates filled per-path */
    for (var gi = 0; gi < cards.length; gi++) {
      defsHTML +=
        '<linearGradient id="cgrad-' + gi + '" gradientUnits="userSpaceOnUse">' +
          '<stop offset="0%"   stop-color="#00ffcc" stop-opacity="0.65"/>' +
          '<stop offset="100%" stop-color="#00ff41" stop-opacity="0.50"/>' +
        '</linearGradient>';
    }
    defs.innerHTML = defsHTML;
    svg.appendChild(defs);

    /* Origin: bottom-center of the section heading */
    var sRect   = section.getBoundingClientRect();
    var heading = section.querySelector('.nav-cards-heading');
    var hRect   = heading ? heading.getBoundingClientRect() : null;
    var originX = w / 2;
    var originY = hRect ? (hRect.bottom - sRect.top + 8) : 44;

    /* Origin glow dot */
    var odot = document.createElementNS(NS, 'circle');
    odot.setAttribute('cx', originX);
    odot.setAttribute('cy', originY);
    odot.setAttribute('r', '5');
    odot.setAttribute('fill', '#00ffcc');
    odot.setAttribute('filter', 'url(#cg2)');
    svg.appendChild(odot);

    /* One line per card */
    cards.forEach(function (card, i) {
      var cRect = card.getBoundingClientRect();
      var destX = cRect.left - sRect.left + cRect.width  / 2;
      var destY = cRect.top  - sRect.top  + 6;

      /* Update gradient coordinates */
      var grad = svg.querySelector('#cgrad-' + i);
      if (grad) {
        grad.setAttribute('x1', originX);
        grad.setAttribute('y1', originY);
        grad.setAttribute('x2', destX);
        grad.setAttribute('y2', destY);
      }

      /* Organic S-curve: cp1 bows sideways, cp2 approaches card from slightly above */
      var dx   = destX - originX;
      var dy   = destY - originY;
      var bow  = (CP_OFFSETS[i % CP_OFFSETS.length] || 0);
      var cp1x = originX + dx * 0.10 + bow;
      var cp1y = originY + dy * 0.50;
      var cp2x = destX   - dx * 0.08;
      var cp2y = destY   - dy * 0.28;

      var d =
        'M '  + f(originX) + ' ' + f(originY) +
        ' C ' + f(cp1x) + ' ' + f(cp1y) + ',' +
                f(cp2x) + ' ' + f(cp2y) + ',' +
                f(destX) + ' ' + f(destY);

      var delay = 0.15 + i * 0.17;

      /* Shadow trace (wide, low-opacity) */
      var shadow = document.createElementNS(NS, 'path');
      shadow.setAttribute('d', d);
      shadow.setAttribute('stroke', 'rgba(0,255,204,0.12)');
      shadow.setAttribute('stroke-width', '5');
      shadow.setAttribute('fill', 'none');
      shadow.setAttribute('filter', 'url(#cg2)');
      svg.appendChild(shadow);

      var sLen = shadow.getTotalLength();
      shadow.style.strokeDasharray  = sLen;
      shadow.style.strokeDashoffset = sLen;
      shadow.style.animation =
        'connectorDraw 1.1s cubic-bezier(0.38,0,0.18,1) forwards ' + delay + 's';

      /* Main gradient line */
      var line = document.createElementNS(NS, 'path');
      line.setAttribute('d', d);
      line.setAttribute('stroke', 'url(#cgrad-' + i + ')');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('fill', 'none');
      line.setAttribute('filter', 'url(#cg1)');
      svg.appendChild(line);

      var lLen = line.getTotalLength();
      line.style.strokeDasharray  = lLen;
      line.style.strokeDashoffset = lLen;
      line.style.animation =
        'connectorDraw 1.1s cubic-bezier(0.38,0,0.18,1) forwards ' + delay + 's';

      /* Card entry dot */
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', destX);
      dot.setAttribute('cy', destY);
      dot.setAttribute('r', '3.5');
      dot.setAttribute('fill', '#00ff41');
      dot.setAttribute('filter', 'url(#cg1)');
      dot.style.opacity   = '0';
      dot.style.animation =
        'connectorDotFade 0.4s ease forwards ' + (delay + 1.0) + 's';
      svg.appendChild(dot);
    });
  }

  function f(n) { return n.toFixed(1); }

  /* ── IntersectionObserver reveals for other sections ── */
  function setupRevealObserver() {
    if (!window.IntersectionObserver) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.remove('io-hidden');
          e.target.classList.add('io-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(
      '#about-section, #skills-section, #resume-section, #project-section, #contact-section'
    ).forEach(function (sec) {
      sec.querySelectorAll('.ftco-animate').forEach(function (el) {
        if (!el.classList.contains('ftco-animated')) {
          el.classList.add('io-hidden');
          io.observe(el);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(buildConnectors, 300);
    setupRevealObserver();
  });

  var _rt;
  window.addEventListener('resize', function () {
    clearTimeout(_rt);
    _rt = setTimeout(buildConnectors, 180);
  });

  window.buildNavConnectors = buildConnectors;
}());
