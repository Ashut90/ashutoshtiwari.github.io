/* about.js */
(function () {
  'use strict';

  var BOOT_LINES = [
    '<span class="bt-cmd">$ cat engineer.profile</span>',
    '<span class="bt-ok">[  OK  ]</span> <span class="bt-val">Ashutosh Tiwari &nbsp;&middot;&nbsp; Firmware Developer &nbsp;&middot;&nbsp; New Taipei, Taiwan</span>',
    '<span class="bt-ok">[  OK  ]</span> <span class="bt-muted">Status:</span> <span class="bt-val">Open to BSP / Embedded Linux opportunities</span>'
  ];

  document.addEventListener('DOMContentLoaded', function () {
    initMatrix(0.3);

    var prompt  = document.getElementById('about-prompt');
    var cols    = document.getElementById('about-cols');
    var asecs   = document.querySelectorAll('.asec');
    var statBox = document.getElementById('stat-boxes');

    /* ── 1. Boot lines appear one by one ── */
    BOOT_LINES.forEach(function (html, i) {
      var line = document.createElement('span');
      line.className = 'boot-line';
      line.innerHTML = html;
      prompt.appendChild(line);
      setTimeout(function () { line.classList.add('visible'); }, 80 + i * 180);
    });

    /* ── 2. Reveal columns after boot lines ── */
    var revealAt = 80 + BOOT_LINES.length * 180 + 120;
    setTimeout(function () {
      if (cols) cols.classList.add('visible');

      /* Stagger each section block */
      asecs.forEach(function (sec, i) {
        setTimeout(function () { sec.classList.add('visible'); }, i * 110);
      });

      /* Stat boxes appear after sections */
      setTimeout(function () {
        if (statBox) {
          statBox.classList.add('visible');
          animateCounters();
        }
      }, asecs.length * 110 + 100);

    }, revealAt);

    /* ── 3. Count-up for stat numbers ── */
    function animateCounters() {
      document.querySelectorAll('.stat-num[data-target]').forEach(function (el) {
        var target  = parseFloat(el.dataset.target);
        var decimal = parseInt(el.dataset.decimal || '0', 10);
        var suffix  = el.dataset.suffix || '';
        var start   = 0;
        var duration = 900;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
          var current = eased * target;
          el.textContent = (decimal > 0 ? current.toFixed(decimal) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }

  });

}());
