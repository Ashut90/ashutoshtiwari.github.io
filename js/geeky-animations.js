/* ===== MATRIX RAIN - HERO SECTION ===== */
(function () {
  var canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var fontSize = 13;
  var cols, drops;

  function resize() {
    // Use window dimensions directly — avoids owl carousel's display:none zero-width problem
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / fontSize);
    drops = [];
    for (var i = 0; i < cols; i++) {
      drops[i] = Math.floor(Math.random() * -80);
    }
  }

  var chars = '01アイウエオカキクケコサシスセソタチツテトNABCDEFintvoidifelsewhile' +
              'forcludedefinereturn#include<>sizeof(){}[];=+-*&|0xFF0x00GPIO_UART_SPI';

  function tick() {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < drops.length; i++) {
      var c  = chars[Math.floor(Math.random() * chars.length)];
      var x  = i * fontSize;
      var y  = drops[i] * fontSize;

      if (y > 0 && y < canvas.height) {
        ctx.fillStyle = (Math.random() > 0.96)
          ? '#ffffff'
          : 'rgba(0,' + (180 + Math.floor(Math.random() * 75)) + ',50,' + (0.6 + Math.random() * 0.4) + ')';
        ctx.font = 'bold ' + fontSize + 'px "Courier New",monospace';
        ctx.fillText(c, x, y);
      }

      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.55;
    }
  }

  resize();
  setInterval(tick, 38);
  window.addEventListener('resize', resize);
})();
