/* connectors.js — SVG connector lines from floating monitor to cards */
(function () {
  'use strict';

  var svg, paths, pulseRafs;

  function getCenter(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function getTopCenter(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top };
  }

  function cubicPath(ox, oy, dx, dy, index) {
    /* Organic sweeping curves: fan out from monitor to each card */
    var mx = (ox + dx) / 2;
    var spread = (ox - dx) * 0.5 + (index - 2.5) * 40;
    var cp1x = ox - spread * 0.3;
    var cp1y = oy + (dy - oy) * 0.35;
    var cp2x = dx + spread * 0.1;
    var cp2y = dy - (dy - oy) * 0.25;
    return 'M ' + ox + ',' + oy +
           ' C ' + cp1x + ',' + cp1y +
           ' ' + cp2x + ',' + cp2y +
           ' ' + dx + ',' + dy;
  }

  function pulsePath(path) {
    var start = null;
    function animate(ts) {
      if (!start) start = ts;
      var t = ((ts - start) % 4000) / 4000;
      var op = 0.3 + 0.4 * Math.abs(Math.sin(t * Math.PI));
      path.setAttribute('opacity', op.toFixed(3));
      path._raf = requestAnimationFrame(animate);
    }
    path._raf = requestAnimationFrame(animate);
  }

  function buildConnectors() {
    svg = document.getElementById('connectors');
    if (!svg) return;

    var monitor = document.getElementById('monitor-anchor');
    var cards = document.querySelectorAll('.term-card');
    if (!monitor || !cards.length) return;

    /* Cancel previous pulses */
    if (paths) {
      paths.forEach(function (p) {
        if (p._raf) cancelAnimationFrame(p._raf);
        if (p.parentNode) p.parentNode.removeChild(p);
      });
    }
    paths = [];

    var orig = getCenter(monitor);

    cards.forEach(function (card, i) {
      var dest = getTopCenter(card);
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', cubicPath(orig.x, orig.y, dest.x, dest.y, i));
      path.setAttribute('stroke', 'url(#connector-grad)');
      path.setAttribute('stroke-width', '1.2');
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', '0');
      svg.appendChild(path);
      paths.push(path);

      /* Draw-on animation */
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;

      (function (p, delay) {
        setTimeout(function () {
          p.style.transition = 'stroke-dashoffset 2s ease-in-out';
          p.style.strokeDashoffset = '0';
          p.setAttribute('opacity', '0.5');
          setTimeout(function () {
            p.style.transition = '';
            pulsePath(p);
          }, 2100);
        }, delay);
      })(path, 600 + i * 200);

      /* Hover: highlight line when card is hovered */
      card.addEventListener('mouseenter', function () {
        if (!paths[i]) return;
        if (paths[i]._raf) cancelAnimationFrame(paths[i]._raf);
        paths[i].setAttribute('opacity', '1');
        paths[i].setAttribute('stroke-width', '2');
      });
      card.addEventListener('mouseleave', function () {
        if (!paths[i]) return;
        paths[i].setAttribute('stroke-width', '1.2');
        pulsePath(paths[i]);
      });
    });
  }

  var debounceTimer;
  function debuildConnectors() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(buildConnectors, 150);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(buildConnectors, 200);
  });

  window.addEventListener('resize', debuildConnectors);

}());
