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

    /* Chat widget toggle */
    var toggle  = document.getElementById('chat-toggle');
    var panel   = document.getElementById('chat-panel');
    var closeBtn = document.getElementById('chat-close');

    function openPanel() {
      if (!panel) return;
      panel.classList.add('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
    }
    function closePanel() {
      if (!panel) return;
      panel.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        panel && panel.classList.contains('open') ? closePanel() : openPanel();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closePanel();
      });
    }

    /* Close panel on outside click */
    document.addEventListener('click', function (e) {
      var widget = document.getElementById('chat-widget');
      if (widget && !widget.contains(e.target)) closePanel();
    });
  });

}());
