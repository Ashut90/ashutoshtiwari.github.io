/* skills.js — PCB trace hover effects */
(function () {
  'use strict';

  var RELATED = {
    'Yocto Linux':    ['Device Tree', 'Linux Kernel', 'brcmfmac'],
    'BCM4373/CYW4373':['USB 2.0', 'brcmfmac', 'Yocto Linux'],
    'JTAG':           ['GDB', 'ARM Cortex-M4', 'ADSP-SC598'],
    'Python':         ['Test Automation', 'CI/CD', 'Bash'],
    'Linux Kernel':   ['Device Tree', 'Kernel Modules', 'Yocto Linux'],
    'brcmfmac':       ['BCM4373/CYW4373', 'Yocto Linux', 'Linux Kernel']
  };

  var traceAnimIds = [];

  function clearTraces() {
    traceAnimIds.forEach(function (id) { cancelAnimationFrame(id); });
    traceAnimIds = [];
    var svg = document.getElementById('pcb-traces');
    if (svg) while (svg.firstChild) svg.removeChild(svg.firstChild);
    document.querySelectorAll('.skill-chip').forEach(function (c) {
      c.classList.remove('highlighted');
    });
  }

  function drawTrace(x1, y1, x2, y2) {
    var svg = document.getElementById('pcb-traces');
    if (!svg) return null;
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    /* PCB-style: horizontal then diagonal then horizontal */
    var mx = (x1 + x2) / 2;
    var d = 'M ' + x1 + ',' + y1 + ' L ' + mx + ',' + y1 + ' L ' + mx + ',' + y2 + ' L ' + x2 + ',' + y2;
    path.setAttribute('d', d);
    path.setAttribute('stroke', 'rgba(0,255,204,0.6)');
    path.setAttribute('stroke-width', '1');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-dasharray', '4 3');
    path.style.opacity = '0';
    svg.appendChild(path);

    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.style.transition = 'stroke-dashoffset 0.35s ease, opacity 0.2s ease';
    requestAnimationFrame(function () {
      path.style.opacity = '1';
      path.style.strokeDashoffset = '0';
    });
    return path;
  }

  function showTraces(chipName) {
    clearTraces();
    var related = RELATED[chipName];
    if (!related) return;

    var srcChip = findChip(chipName);
    if (!srcChip) return;
    srcChip.classList.add('highlighted');

    var srcR = srcChip.getBoundingClientRect();
    var ox = srcR.left + srcR.width / 2;
    var oy = srcR.top + srcR.height / 2;

    related.forEach(function (name) {
      var target = findChip(name);
      if (!target) return;
      target.classList.add('highlighted');
      var tr = target.getBoundingClientRect();
      var tx = tr.left + tr.width / 2;
      var ty = tr.top + tr.height / 2;
      drawTrace(ox, oy, tx, ty);
    });
  }

  function findChip(name) {
    var chips = document.querySelectorAll('.skill-chip');
    for (var i = 0; i < chips.length; i++) {
      if (chips[i].dataset.skill === name) return chips[i];
    }
    return null;
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMatrix(0.35);

    document.querySelectorAll('.skill-chip').forEach(function (chip) {
      chip.addEventListener('mouseenter', function () {
        showTraces(chip.dataset.skill);
      });
      chip.addEventListener('mouseleave', function () {
        clearTraces();
      });
    });
  });

}());
