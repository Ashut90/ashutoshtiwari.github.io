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
    if (link) link.closest('.nav-item').classList.add('active');

    /* Matrix canvas: only run on home to save CPU */
    var canvas = document.getElementById('matrixCanvas');
    if (canvas) canvas.style.display = (key === 'home') ? 'block' : 'none';

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
        /* Close Bootstrap mobile nav */
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
