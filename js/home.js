/* home.js — card stagger animation + Firebase bidirectional chat */
(function () {
  'use strict';

  var STAGGER_OFFSETS = [0, -18, 12, 8, -12, 4];

  /* ── Firebase init ──────────────────────────── */
  var db = null;
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey:      'AIzaSyDtUcYyP8og5s4HzlP9K9WhqMvmEzHFqXE',
          databaseURL: 'https://portfolio-chat-40b92-default-rtdb.asia-southeast1.firebasedatabase.app',
          projectId:   'portfolio-chat-40b92',
          appId:       '1:564513910409:web:2cf8b262aed88bafcf2058'
        });
      }
      db = firebase.database();
    }
  } catch (e) { /* Firebase blocked */ }

  /* ── Session ID — persists for the tab lifetime ── */
  var sessionId = sessionStorage.getItem('pf_sess');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('pf_sess', sessionId);
  }

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

    /* Panel elements */
    var chatTerm     = document.getElementById('chat-terminal');
    var cpPanel      = document.getElementById('contact-panel');
    var cpClose      = document.getElementById('cp-close');
    var cpMsg        = document.getElementById('cp-msg');
    var cpThread     = document.getElementById('cp-thread');
    var overlay      = document.getElementById('chat-overlay');
    var chatListening = false;

    /* Add a bubble to the thread */
    function addBubble(sender, text) {
      if (!cpThread) return;
      var hint = cpThread.querySelector('.cp-thread-hint');
      if (hint) hint.remove();
      var el = document.createElement('div');
      el.className = 'cp-msg-bubble ' + (sender === 'ash' ? 'ash' : 'visitor');
      el.textContent = text;
      cpThread.appendChild(el);
      cpThread.scrollTop = cpThread.scrollHeight;
    }

    /* Listen for ash's replies on this session */
    function startListening() {
      if (chatListening || !db) return;
      chatListening = true;
      db.ref('sessions/' + sessionId + '/messages').on('child_added', function (snap) {
        var m = snap.val();
        addBubble(m.sender, m.text);
      });
    }

    function openPanel() {
      if (cpPanel) { cpPanel.classList.add('open'); cpPanel.setAttribute('aria-hidden', 'false'); }
      if (overlay) overlay.classList.add('active');
      startListening();
      setTimeout(function () { if (cpMsg) cpMsg.focus(); }, 240);
    }
    function closePanel() {
      if (cpPanel) { cpPanel.classList.remove('open'); cpPanel.setAttribute('aria-hidden', 'true'); }
      if (overlay) overlay.classList.remove('active');
    }

    if (chatTerm) chatTerm.addEventListener('click', openPanel);
    if (cpClose)  cpClose.addEventListener('click',  function (e) { e.stopPropagation(); closePanel(); });
    if (overlay)  overlay.addEventListener('click',  closePanel);

    /* Send message */
    if (cpMsg) {
      cpMsg.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        var msg = cpMsg.value.trim();
        if (!msg) return;
        cpMsg.value = '';

        if (db) {
          var now = Date.now();
          var sessRef = db.ref('sessions/' + sessionId);
          sessRef.update({ lastActivity: now });
          sessRef.child('created').once('value', function (s) {
            if (!s.exists()) sessRef.child('created').set(now);
          });
          sessRef.child('messages').push({ sender: 'visitor', text: msg, time: now });
        }

        /* Telegram alert to Ashutosh */
        fetch('https://api.telegram.org/bot8825072528:AAHc3u5HSMd3rt6YIo0JfBrGUcrHczCKaPo/sendMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: '7737853571',
            text: '📩 Portfolio chat [' + sessionId + ']:\n' + msg +
                  '\n\nReply → ashut90.github.io/ashutoshtiwari.github.io/admin.html'
          })
        }).catch(function () {});
      });
    }
  });

}());
