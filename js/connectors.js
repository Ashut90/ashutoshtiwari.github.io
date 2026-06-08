/* connectors.js — IntersectionObserver reveals for non-home sections */
(function () {
  'use strict';

  function setupRevealObserver() {
    if (!window.IntersectionObserver) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.remove('io-hidden');
          e.target.classList.add('io-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(
      '#about-section, #skills-section, #resume-section, #project-section, #contact-section'
    ).forEach(function (sec) {
      sec.querySelectorAll('.ftco-animate').forEach(function (el) {
        if (!el.classList.contains('ftco-animated')) {
          el.classList.add('io-hidden');
          io.observe(el);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', setupRevealObserver);

  /* Stub — spa.js calls this on home re-entry; no-op now that lines are removed */
  window.buildNavConnectors = function () {};
}());
