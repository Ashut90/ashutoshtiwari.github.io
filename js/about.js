/* about.js */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMatrix(0.35);

    var LINES = [
      { ts: '0.000000', type: 'plain', text: 'Initializing engineer profile...' },
      { ts: '0.000142', type: 'kv',    key: 'Name',       val: 'Ashutosh Tiwari' },
      { ts: '0.000280', type: 'kv',    key: 'Role',       val: 'Firmware Developer' },
      { ts: '0.000391', type: 'kv',    key: 'Location',   val: 'New Taipei City, Taiwan' },
      { ts: '0.000512', type: 'kv',    key: 'Experience', val: '4.5+ years' },
      { ts: '0.000634', type: 'kv',    key: 'Domain',     val: 'BSP · SoC bring-up · Linux kernel' },
      { ts: '0.001200', type: 'hdr',   text: 'Loading career timeline...' },
      { ts: '0.001400', type: 'career',text: '[2018–2020] Research Assistant — Tamkang University' },
      { ts: '0.001600', type: 'sub',   text: '            CNN · Python · C++ · Signal Processing' },
      { ts: '0.001800', type: 'career',text: '[2020–2021] SQA Engineer — CIeNET Technologies' },
      { ts: '0.002000', type: 'sub',   text: '            Android automotive · ADB · defect analysis' },
      { ts: '0.002200', type: 'career',text: '[2021–2023] Test Automation — Truetel Taiwan' },
      { ts: '0.002400', type: 'sub',   text: '            Python · GPS API · CI/CD · ADB' },
      { ts: '0.002600', type: 'career',text: '[2024–2026] Embedded Systems — Elytone Electronics' },
      { ts: '0.002800', type: 'sub',   text: '            BCM4373 WiFi · Yocto 5.0 · ADSP-SC598' },
      { ts: '0.003000', type: 'sub',   text: '            brcmfmac · bootloader · Dolby/Auro-3D' },
      { ts: '0.003200', type: 'ok',    text: 'Profile loaded.' },
      { ts: '0.003400', type: 'hdr',   text: 'Status: Open to BSP / Embedded Linux — Taiwan or remote' }
    ];

    var container = document.getElementById('boot-log');
    if (!container) return;

    var lineEls = [];
    LINES.forEach(function (l) {
      var el = document.createElement('span');
      el.className = 'boot-line';

      var html = '<span class="boot-ts">[' + l.ts + ']</span> ';
      if (l.type === 'kv') {
        html += '<span class="boot-key">' + padKey(l.key) + '</span> ';
        html += '<span class="boot-val">' + l.val + '</span>';
      } else if (l.type === 'ok') {
        html += '<span class="boot-ok">[  OK  ]</span> <span class="boot-val">' + l.text + '</span>';
      } else if (l.type === 'hdr') {
        html += '<span class="boot-hdr">' + l.text + '</span>';
      } else if (l.type === 'career') {
        html += '<span class="boot-key">' + l.text + '</span>';
      } else {
        html += '<span class="boot-val">' + (l.text || '') + '</span>';
      }

      el.innerHTML = html;
      container.appendChild(el);
      lineEls.push(el);
    });

    /* Type lines onto screen, 80ms between each */
    lineEls.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('visible');
        if (i === lineEls.length - 1) {
          /* Show stat boxes after last line */
          setTimeout(showStats, 300);
          /* Animate SVG diagram */
          setTimeout(animateDiagram, 200);
        }
      }, 80 * i);
    });

    function showStats() {
      var boxes = document.getElementById('stat-boxes');
      if (boxes) boxes.classList.add('visible');
    }

    function animateDiagram() {
      var boxes = document.querySelectorAll('.arch-box');
      var lines = document.querySelectorAll('.arch-line');
      boxes.forEach(function (b, i) {
        setTimeout(function () { b.classList.add('visible'); }, i * 300);
      });
      lines.forEach(function (l, i) {
        setTimeout(function () { l.classList.add('visible'); }, 150 + i * 300);
      });
    }

    function padKey(k) {
      var cols = 16;
      return k + ' ' + '.'.repeat(Math.max(0, cols - k.length - 1));
    }
  });

}());
