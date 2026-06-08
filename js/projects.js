/* projects.js — collapsible project panels */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMatrix(0.35);

    document.querySelectorAll('.project-header').forEach(function (hdr) {
      hdr.addEventListener('click', function () {
        var card = hdr.closest('.project-card');
        var isOpen = card.classList.contains('open');

        /* Close all */
        document.querySelectorAll('.project-card.open').forEach(function (c) {
          c.classList.remove('open');
        });

        /* Open clicked (toggle) */
        if (!isOpen) card.classList.add('open');
      });
    });
  });

}());
