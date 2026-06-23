/* home.js — card stagger animation + chat widget */
(function () {
  'use strict';

  var STAGGER_OFFSETS = [0, -18, 12, 8, -12, 4]; /* px translateY per card */

  document.addEventListener('DOMContentLoaded', function () {
    initMatrix(1.0);

    /* Staggered card entrance */
    var cards = document.querySelectorAll('.term-card');
    cards.forEach(function (card, i) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(' + (STAGGER_OFFSETS[i] + 30) + 'px)';
      setTimeout(function () {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(' + STAGGER_OFFSETS[i] + 'px)';
      }, 300 + i * 200);
    });

    /* Contact panel open / close */
    var chatTerm = document.getElementById('chat-terminal');
    var cpPanel  = document.getElementById('contact-panel');
    var cpClose  = document.getElementById('cp-close');
    var cpMsg    = document.getElementById('cp-msg');
    var cpStatus = document.getElementById('cp-status');
    var overlay  = document.getElementById('chat-overlay');

    function openPanel() {
      if (cpPanel) { cpPanel.classList.add('open'); cpPanel.setAttribute('aria-hidden', 'false'); }
      if (overlay) overlay.classList.add('active');
      setTimeout(function () { if (cpMsg) cpMsg.focus(); }, 240);
    }
    function closePanel() {
      if (cpPanel) { cpPanel.classList.remove('open'); cpPanel.setAttribute('aria-hidden', 'true'); }
      if (overlay) overlay.classList.remove('active');
    }

    if (chatTerm) chatTerm.addEventListener('click', openPanel);
    if (cpClose)  cpClose.addEventListener('click',  function (e) { e.stopPropagation(); closePanel(); });
    if (overlay)  overlay.addEventListener('click',  closePanel);

    /* Quick message → Telegram bot */
    if (cpMsg) {
      cpMsg.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        var msg = cpMsg.value.trim();
        if (!msg) return;
        cpStatus.textContent = 'sending...';
        cpStatus.style.color = 'var(--cyan)';

        var text = '📩 Portfolio message:\n' + msg + '\n\n— ashutoshtiwari.github.io';

        fetch('https://api.telegram.org/bot8825072528:AAHc3u5HSMd3rt6YIo0JfBrGUcrHczCKaPo/sendMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: '7737853571', text: text })
        })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d.ok) {
            cpMsg.value = '';
            cpStatus.textContent = '[ OK ] Delivered.';
            setTimeout(function () { cpStatus.textContent = ''; }, 3000);
          } else {
            cpStatus.textContent = '[ ERR ] Failed — try email.';
            cpStatus.style.color = 'var(--red)';
          }
        })
        .catch(function () {
          /* Network fallback → mailto */
          window.open('mailto:ash945512@gmail.com?subject=Portfolio%20Contact&body=' + encodeURIComponent(msg), '_blank');
          cpMsg.value = '';
          cpStatus.textContent = '[ OK ] Sent via email.';
          setTimeout(function () { cpStatus.textContent = ''; }, 3000);
        });
      });
    }
  });

}());
