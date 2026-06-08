/**
 * spa.js — Single-Page Application view controller
 * Manages section switching with fade transitions.
 * Sections are full-viewport layers; only one is visible at a time.
 */
(function () {
  'use strict';

  /* nav-key → section element id */
  var VIEW = {
    home:     'home-section',
    about:    'about-section',
    skills:   'skills-section',
    resume:   'resume-section',
    projects: 'project-section',
    contact:  'contact-section'
  };

  var SECTION_LABELS = {
    about:    'About',
    skills:   'Skills',
    resume:   'Resume',
    projects: 'Projects',
    contact:  'Contact'
  };

  var current = null;

  /* ── Activate a view ─────────────────────────────────── */
  function showView(key, updateHash) {
    if (!VIEW[key]) key = 'home';
    if (key === current) return;
    current = key;

    /* Hide every section */
    Object.keys(VIEW).forEach(function (k) {
      var el = document.getElementById(VIEW[k]);
      if (el) el.classList.remove('active');
    });

    /* Deactivate every nav item */
    document.querySelectorAll('#ftco-nav .nav-item').forEach(function (li) {
      li.classList.remove('active');
    });

    /* Show target section */
    var target = document.getElementById(VIEW[key]);
    if (target) {
      target.scrollTop = 0;
      target.classList.add('active');
      triggerAnimations(target);
    }

    /* Highlight matching nav link */
    var link = document.querySelector('[data-nav="' + key + '"]');
    if (link) { var ni = link.closest('.nav-item'); if (ni) ni.classList.add('active'); }

    var isHome = (key === 'home');

    /* Matrix canvas + vignette: only visible on home */
    var canvas   = document.getElementById('matrixCanvas');
    var vignette = document.getElementById('matrix-vignette');
    if (canvas)   canvas.style.display   = isHome ? 'block' : 'none';
    if (vignette) vignette.style.display = isHome ? 'block' : 'none';

    /* Floating home button: show on every section except home */
    var homeBtn   = document.getElementById('home-nav-btn');
    var sectionLbl = document.getElementById('section-label-bar');
    if (homeBtn) homeBtn.style.display = isHome ? 'none' : 'flex';
    if (sectionLbl) sectionLbl.textContent = SECTION_LABELS[key] || '';

    /* Re-trigger card stagger when returning to home */
    if (isHome) {
      document.querySelectorAll('.nav-card').forEach(function (card) {
        card.style.animation = 'none';
        /* Force reflow so the browser registers the change */
        void card.offsetWidth;
        card.style.animation = '';
      });
    }

    /* Update URL hash without full navigation */
    if (updateHash !== false) {
      history.replaceState({ view: key }, '', '#' + key);
    }
  }

  /* ── Fade-in entrance animations for each section ───── */
  function triggerAnimations(section) {
    var delay = 0;
    section.querySelectorAll('.ftco-animate:not(.ftco-animated)').forEach(function (el) {
      (function (elem, d) {
        setTimeout(function () {
          elem.classList.add('ftco-animated', 'fadeInUp');
        }, d);
      }(el, delay));
      delay += 55;
    });
  }

  /* ── Wire nav click handlers ─────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('[data-nav]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        showView(this.getAttribute('data-nav'));
        var collapse = document.getElementById('ftco-nav');
        if (collapse && collapse.classList.contains('show')) {
          collapse.classList.remove('show');
        }
        var toggle = document.querySelector('.js-fh5co-nav-toggle');
        if (toggle) toggle.classList.remove('active');
      });
    });

    /* Initial view: honour URL hash, else home */
    var hash = window.location.hash.replace('#', '');
    showView(VIEW[hash] ? hash : 'home', false);
  });

  /* Browser back / forward support */
  window.addEventListener('popstate', function () {
    var hash = window.location.hash.replace('#', '');
    if (VIEW[hash]) showView(hash, false);
  });

}());
