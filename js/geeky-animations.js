/* ===== MATRIX RAIN - HERO SECTION ===== */
(function () {
  var canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var fontSize = 13;
  var cols, drops;

  function resize() {
    var wrap = canvas.parentElement;
    // .one-third is 60% wide; js-fullheight sets height = window.innerHeight
    canvas.width  = wrap.offsetWidth  || Math.round(window.innerWidth  * 0.6);
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
    // If dimensions are still 0, re-measure and bail this frame
    if (!canvas.width || !canvas.height) { resize(); return; }

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

      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.55;
    }
  }

  // Start immediately — tick() self-heals if dims are still 0
  resize();
  setInterval(tick, 38);

  // Re-measure after owl + js-fullheight finish
  window.addEventListener('load', function () { resize(); });
  window.addEventListener('resize', resize);
})();
