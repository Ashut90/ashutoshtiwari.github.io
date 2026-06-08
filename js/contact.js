/* contact.js — typewriter + terminal input */
(function () {
  'use strict';

  var LINES = [
    { cls: 'tw-cmd', text: '$ ssh ash@portfolio.dev' },
    { cls: 'tw-val', text: 'Connecting to New Taipei City, Taiwan...' },
    { cls: 'tw-ok',  text: 'Connection established. ✓' },
    { cls: 'tw-blank', text: '' },
    { cls: 'tw-val', text: 'System variables:' },
    { cls: 'tw-key', text: '  USER     =  ', trail: { cls: 'tw-val', text: 'Ashutosh Tiwari' } },
    { cls: 'tw-key', text: '  ROLE     =  ', trail: { cls: 'tw-val', text: 'Firmware Developer' } },
    { cls: 'tw-key', text: '  LOCATION =  ', trail: { cls: 'tw-val', text: 'New Taipei City, Taiwan' } },
    { cls: 'tw-key', text: '  STATUS   =  ', trail: { cls: 'tw-val', text: 'Open to opportunities' } },
    { cls: 'tw-blank', text: '' },
    { cls: 'tw-val', text: 'Network interfaces:' },
    { cls: 'tw-lk',  text: '  [email]     ', trail: { cls: 'tw-val', text: 'ash945512@gmail.com' } },
    { cls: 'tw-lk',  text: '  [linkedin]  ', trail: { cls: 'tw-val', text: 'linkedin.com/in/ashutosh-tiwari94' } },
    { cls: 'tw-lk',  text: '  [github]    ', trail: { cls: 'tw-val', text: 'github.com/Ashut90' } },
    { cls: 'tw-blank', text: '' },
    { cls: 'tw-val', text: 'Ready for input. Type a message and press Enter:' }
  ];

  function makeSpan(cls, text) {
    var s = document.createElement('span');
    s.className = cls;
    s.textContent = text;
    return s;
  }

  function typeChars(span, text, charDelay, done) {
    var i = 0;
    function next() {
      if (i >= text.length) { if (done) done(); return; }
      span.textContent += text[i++];
      setTimeout(next, charDelay);
    }
    next();
  }

  function renderLines(container, lines, charDelay, onDone) {
    var cursor = 0;
    function nextLine() {
      if (cursor >= lines.length) { if (onDone) onDone(); return; }
      var l = lines[cursor++];
      var lineEl = document.createElement('span');
      lineEl.className = 'tw-line';

      if (l.cls === 'tw-blank') {
        lineEl.className = 'tw-blank';
        container.appendChild(lineEl);
        setTimeout(nextLine, 80);
        return;
      }

      container.appendChild(lineEl);

      if (l.trail) {
        var prefix = makeSpan(l.cls, '');
        var suffix = makeSpan(l.trail.cls, '');
        lineEl.appendChild(prefix);
        lineEl.appendChild(suffix);
        typeChars(prefix, l.text, charDelay, function () {
          typeChars(suffix, l.trail.text, charDelay, nextLine);
        });
      } else {
        var span = makeSpan(l.cls, '');
        lineEl.appendChild(span);
        typeChars(span, l.text, charDelay, nextLine);
      }
    }
    nextLine();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMatrix(0.4);

    var container = document.getElementById('typewriter');
    var inputRow  = document.getElementById('input-row');
    var msgInput  = document.getElementById('msg-input');
    var status    = document.getElementById('msg-status');

    if (!container) return;

    renderLines(container, LINES, 25, function () {
      if (inputRow) {
        inputRow.style.display = 'flex';
        if (msgInput) msgInput.focus();
      }
    });

    if (msgInput) {
      msgInput.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        var msg = msgInput.value.trim();
        if (!msg) return;

        status.textContent = 'Sending...';
        status.style.color = '#00FFCC';

        setTimeout(function () {
          status.textContent = 'Message queued. ✓';
          status.style.color = '#00FF41';
          window.open(
            'mailto:ash945512@gmail.com?subject=Portfolio%20Inquiry&body=' +
            encodeURIComponent(msg),
            '_blank'
          );
          msgInput.value = '';
          msgInput.focus();
          setTimeout(function () {
            status.textContent = '';
          }, 4000);
        }, 600);
      });
    }
  });

}());
