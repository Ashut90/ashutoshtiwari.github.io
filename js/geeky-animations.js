/* ===== MATRIX RAIN - HERO SECTION ===== */
(function () {
  var canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var fontSize = 13;
  var cols, drops;

  function resize() {
    var wrap = canvas.parentElement;
    canvas.width = wrap.offsetWidth || window.innerWidth * 0.6;
    canvas.height = wrap.offsetHeight || 750;
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

  resize();
  window.addEventListener('resize', resize);
  setInterval(tick, 38);
})();


/* ===== CIRCUIT BOARD - ABOUT SECTION ===== */
(function () {
  var canvas = document.getElementById('circuitCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var GRID = 18;
  var BG = '#050d1a';
  var TRACE_CLR = '#0d3f5f';
  var NODE_CLR = '#00d4ff';

  var traces = [];
  var pulses = [];

  function setup() {
    canvas.width = canvas.offsetWidth || 200;
    canvas.height = canvas.offsetHeight || 180;
    buildTraces();
    pulses = [];
    for (var i = 0; i < 5; i++) spawnPulse();
  }

  function buildTraces() {
    traces = [];
    var W = canvas.width, H = canvas.height;
    var rows = Math.floor(H / GRID);
    var cols = Math.floor(W / GRID);
    for (var r = 2; r < rows; r += 2) {
      traces.push({ x1: 0, y1: r * GRID, x2: W, y2: r * GRID });
    }
    for (var c = 2; c < cols; c += 2) {
      traces.push({ x1: c * GRID, y1: 0, x2: c * GRID, y2: H });
    }
  }

  function spawnPulse() {
    if (!traces.length) return;
    var t = traces[Math.floor(Math.random() * traces.length)];
    pulses.push({ trace: t, prog: 0, speed: 0.009 + Math.random() * 0.014 });
  }

  function render() {
    var W = canvas.width, H = canvas.height;
    var cx = W / 2, cy = H / 2;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    /* Traces */
    ctx.strokeStyle = TRACE_CLR;
    ctx.lineWidth = 1;
    traces.forEach(function (tr) {
      ctx.beginPath();
      ctx.moveTo(tr.x1, tr.y1);
      ctx.lineTo(tr.x2, tr.y2);
      ctx.stroke();
    });

    /* Intersection nodes */
    var rows = Math.floor(H / GRID);
    var cols = Math.floor(W / GRID);
    for (var r = 2; r < rows; r += 2) {
      for (var c = 2; c < cols; c += 2) {
        ctx.fillStyle = 'rgba(0,212,255,0.35)';
        ctx.beginPath();
        ctx.arc(c * GRID, r * GRID, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* Central chip */
    var chipW = 58, chipH = 46;
    ctx.strokeStyle = NODE_CLR;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - chipW / 2, cy - chipH / 2, chipW, chipH);
    ctx.fillStyle = 'rgba(0,212,255,0.06)';
    ctx.fillRect(cx - chipW / 2, cy - chipH / 2, chipW, chipH);

    /* Chip pins */
    ctx.strokeStyle = 'rgba(0,212,255,0.55)';
    ctx.lineWidth = 1;
    var vPins = 3;
    for (var p = 1; p <= vPins; p++) {
      var py = cy - chipH / 2 + (chipH / (vPins + 1)) * p;
      ctx.beginPath(); ctx.moveTo(cx - chipW / 2, py); ctx.lineTo(cx - chipW / 2 - 10, py); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + chipW / 2, py); ctx.lineTo(cx + chipW / 2 + 10, py); ctx.stroke();
    }
    var hPins = 3;
    for (var q = 1; q <= hPins; q++) {
      var px = cx - chipW / 2 + (chipW / (hPins + 1)) * q;
      ctx.beginPath(); ctx.moveTo(px, cy - chipH / 2); ctx.lineTo(px, cy - chipH / 2 - 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, cy + chipH / 2); ctx.lineTo(px, cy + chipH / 2 + 10); ctx.stroke();
    }

    /* Chip label */
    ctx.textAlign = 'center';
    ctx.fillStyle = NODE_CLR;
    ctx.font = 'bold 9px "Courier New", monospace';
    ctx.fillText('MCU', cx, cy);
    ctx.fillStyle = 'rgba(0,212,255,0.65)';
    ctx.font = '7px "Courier New", monospace';
    ctx.fillText('32-BIT', cx, cy + 11);
    ctx.textAlign = 'left';

    /* Pulses */
    var alive = [];
    for (var i = 0; i < pulses.length; i++) {
      var pulse = pulses[i];
      if (pulse.prog > 1) continue;
      alive.push(pulse);
      var tr = pulse.trace;
      var px2 = tr.x1 + (tr.x2 - tr.x1) * pulse.prog;
      var py2 = tr.y1 + (tr.y2 - tr.y1) * pulse.prog;
      var grad = ctx.createRadialGradient(px2, py2, 0, px2, py2, 6);
      grad.addColorStop(0, 'rgba(0,255,200,0.95)');
      grad.addColorStop(1, 'rgba(0,212,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px2, py2, 6, 0, Math.PI * 2);
      ctx.fill();
      pulse.prog += pulse.speed;
    }
    pulses = alive;

    if (Math.random() > 0.93) spawnPulse();
  }

  setup();
  window.addEventListener('resize', setup);
  setInterval(render, 40);
})();
