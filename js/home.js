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

    /* Chat terminal → open tawk.to */
    var chatTerm = document.getElementById('chat-terminal');
    if (chatTerm) {
      chatTerm.addEventListener('click', function () {
        if (typeof Tawk_API !== 'undefined' && typeof Tawk_API.maximize === 'function') {
          Tawk_API.maximize();
        }
      });
    }
  });

}());
