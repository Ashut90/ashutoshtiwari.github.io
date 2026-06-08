/* ===== MATRIX RAIN — dual-layer, full-viewport ===== */
(function () {
  'use strict';

  var canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var FS = 14;
  var cols, drops, speeds, bright;

  var KANA  = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  var NUM   = '0011001101011010001101';
  var CODE  = 'intvoidifelsewhile{}[]();define0xFF0x00GPIO_UART_SPI';
  var LATIN = 'ABCDEFGHIJKLMNabcdefghijklmn';
  var TOP   = NUM + 'アイウエオカキクケコサシ0110';   /* sparse, top half */
  var BOT   = KANA + NUM + CODE + LATIN;               /* dense, bottom half */

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols   = Math.floor(canvas.width / FS) + 2;
    drops  = [];
    speeds = [];
    bright = [];
    for (var i = 0; i < cols; i++) {
      drops[i]  = Math.floor(Math.random() * -(canvas.height / FS));
      speeds[i] = 0.30 + Math.random() * 0.90;
      bright[i] = Math.random() > 0.72; /* ~28 % of columns stay vivid */
    }
  }

  function tick() {
    /* Fade trail — slightly faster fade in bottom half */
    ctx.fillStyle = 'rgba(0,0,0,0.058)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var halfH = canvas.height * 0.52;

    for (var i = 0; i < cols; i++) {
      var y = drops[i] * FS;
      var x = i * FS;

      if (y > 0 && y < canvas.height) {
        var isTop = y < halfH;
        var pool  = isTop ? TOP : BOT;
        var c     = pool[Math.floor(Math.random() * pool.length)];
        var rnd   = Math.random();

        if (rnd > 0.985) {
          /* Bright white head-of-stream flash */
          ctx.fillStyle = '#ffffff';
        } else if (isTop) {
          /* Top half — vivid #00FF41 with varying brightness */
          var a = bright[i] ? 0.65 + Math.random() * 0.35 : 0.35 + Math.random() * 0.45;
          ctx.fillStyle = 'rgba(0,255,65,' + a + ')';
        } else {
          /* Bottom half — denser mix, occasional cyan accent */
          if (rnd > 0.80) {
            ctx.fillStyle = 'rgba(0,212,255,' + (0.2 + Math.random() * 0.38) + ')';
          } else {
            var g = 160 + Math.floor(Math.random() * 95);
            ctx.fillStyle = 'rgba(0,' + g + ',38,' + (0.22 + Math.random() * 0.52) + ')';
          }
        }

        ctx.font = 'bold ' + FS + 'px "Courier New",monospace';
        ctx.fillText(c, x, y);
      }

      if (y > canvas.height && Math.random() > 0.977) drops[i] = 0;
      drops[i] += speeds[i];
    }
  }

  resize();
  window.addEventListener('resize', resize);

  var _timer = setInterval(tick, 34);

  window._matrixStart = function () { if (!_timer) _timer = setInterval(tick, 34); };
  window._matrixStop  = function () { clearInterval(_timer); _timer = null; };
}());
