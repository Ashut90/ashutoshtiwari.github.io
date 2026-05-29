/* ===== MATRIX RAIN - HERO SECTION ===== */
(function () {
  var canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var fontSize = 13;
  var cols, drops;
  var started = false;

  function resize() {
    var wrap = canvas.parentElement;
    // js-fullheight sets height = window.innerHeight via jQuery; use that as fallback
    canvas.width = wrap.offsetWidth || Math.round(window.innerWidth * 0.6);
    canvas.height = wrap.offsetHeight || window.innerHeight;
    initDrops();
  }

  function initDrops() {
    cols = Math.floor(canvas.width / fontSize);
    drops = [];
    for (var i = 0; i < cols; i++) {
      drops[i] = Math.floor(Math.random() * -60);
    }
  }

  var chars = '01アイウエオカキクケコサシスセソタチツテトNABCDEFintvoidifelsewhile' +
              'forcludedefinereturn#include<>sizeof(){}[];=+-*&|0xFF0x00GPIO_UART_SPI';

  function tick() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < drops.length; i++) {
      var c = chars[Math.floor(Math.random() * chars.length)];
      var x = i * fontSize;
      var y = drops[i] * fontSize;

      if (y > 0 && y < canvas.height) {
        if (Math.random() > 0.96) {
          ctx.fillStyle = '#ffffff';
        } else {
          var g = 180 + Math.floor(Math.random() * 75);
          ctx.fillStyle = 'rgba(0,' + g + ',50,' + (0.6 + Math.random() * 0.4) + ')';
        }
        ctx.font = 'bold ' + fontSize + 'px "Courier New", monospace';
        ctx.fillText(c, x, y);
      }

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.55;
    }
  }

  function start() {
    if (started) return;
    started = true;
    resize();
    setInterval(tick, 38);
  }

  // Wait until js-fullheight (jQuery ready) has set the parent height, then start
  window.addEventListener('load', function () {
    setTimeout(start, 100);
  });
  window.addEventListener('resize', resize);
})();
