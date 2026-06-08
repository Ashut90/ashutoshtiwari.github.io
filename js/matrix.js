/* matrix.js — shared matrix rain + page fade transitions */
(function () {
  'use strict';

  var CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  window.initMatrix = function (opacity) {
    if (opacity === undefined) opacity = 1.0;

    var canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var FS = 14;
    var cols, drops, speeds, animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / FS);
      drops = [];
      speeds = [];
      for (var i = 0; i < cols; i++) {
        drops[i] = Math.random() * -(canvas.height / FS);
        speeds[i] = (2 + Math.random() * 4) / FS;
      }
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
      animId = requestAnimationFrame(draw);

      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = opacity;
      ctx.font = FS + 'px JetBrains Mono, Courier New, monospace';

      for (var i = 0; i < cols; i++) {
        var ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        var alpha = 0.3 + Math.random() * 0.7;
        ctx.fillStyle = 'rgba(0,255,65,' + alpha.toFixed(2) + ')';
        ctx.fillText(ch, i * FS, drops[i] * FS);
        drops[i] += speeds[i];
        if (drops[i] * FS > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.random() * -(canvas.height / FS / 2);
          speeds[i] = (2 + Math.random() * 4) / FS;
        }
      }
      ctx.globalAlpha = 1;
    }

    resize();
    window.addEventListener('resize', function () {
      cancelAnimationFrame(animId);
      resize();
    });
    draw();
  };

  /* Page fade on internal link clicks */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || a.target === '_blank') return;
      try {
        var url = new URL(a.href, location.href);
        if (url.hostname !== location.hostname) return;
      } catch (e) { return; }
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var dest = a.href;
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0';
        setTimeout(function () { location.href = dest; }, 310);
      });
    });
  });

}());
