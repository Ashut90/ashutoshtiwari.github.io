/* admin.js — portfolio chat admin panel */
(function () {
  'use strict';

  var ADMIN_PASS = 'ash@portfolio';

  var FIREBASE_CONFIG = {
    apiKey:      'AIzaSyDtUcYyP8og5s4HzlP9K9WhqMvmEzHFqXE',
    databaseURL: 'https://portfolio-chat-40b92-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId:   'portfolio-chat-40b92',
    appId:       '1:564513910409:web:2cf8b262aed88bafcf2058'
  };

  var db;
  var activeSession = null;
  var activeRef     = null;

  /* ── Firebase ─────────────────────────────── */
  if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.database();

  /* ── Auth gate ────────────────────────────── */
  var authPass = document.getElementById('auth-pass');
  var authErr  = document.getElementById('auth-err');
  var authGate = document.getElementById('auth-gate');
  var adminApp = document.getElementById('admin-app');

  authPass.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    if (this.value === ADMIN_PASS) {
      authGate.style.display  = 'none';
      adminApp.classList.add('visible');
      loadSessions();
    } else {
      authErr.textContent = 'access denied.';
      this.value = '';
    }
  });

  /* ── Session list ─────────────────────────── */
  function loadSessions() {
    var col    = document.getElementById('sessions-col');
    var empty  = document.getElementById('sess-empty');
    var count  = document.getElementById('adm-count');

    db.ref('sessions').orderByChild('lastActivity').on('value', function (snap) {
      col.innerHTML = '';
      var items = [];
      snap.forEach(function (child) { items.push({ id: child.key, d: child.val() }); });
      items.reverse();

      count.textContent = items.length + ' session' + (items.length !== 1 ? 's' : '');

      if (!items.length) {
        col.appendChild(Object.assign(document.createElement('div'), {
          className: 'sess-empty', textContent: '// no sessions yet'
        }));
        return;
      }

      items.forEach(function (item) {
        var msgs = item.d.messages ? Object.values(item.d.messages) : [];
        var last = msgs[msgs.length - 1];
        var preview = last ? last.text.substring(0, 38) + (last.text.length > 38 ? '…' : '') : '—';
        var time    = item.d.lastActivity
          ? new Date(item.d.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '';

        var el = document.createElement('div');
        el.className = 'sess-item' + (item.id === activeSession ? ' active' : '');
        el.innerHTML =
          '<div class="sess-id">' + item.id + '</div>' +
          '<div class="sess-preview">' + escHtml(preview) + '</div>' +
          '<div class="sess-time">' + time + '</div>';

        el.addEventListener('click', function () {
          document.querySelectorAll('.sess-item').forEach(function (s) { s.classList.remove('active'); });
          el.classList.add('active');
          openSession(item.id);
        });
        col.appendChild(el);
      });
    });
  }

  /* ── Open session ─────────────────────────── */
  function openSession(id) {
    activeSession = id;

    /* Stop previous listener */
    if (activeRef) { activeRef.off('child_added'); activeRef = null; }

    var thread   = document.getElementById('adm-thread');
    var chatView = document.getElementById('chat-view');
    var chatEmpty = document.getElementById('chat-empty');
    var admMsg   = document.getElementById('adm-msg');

    thread.innerHTML  = '';
    chatEmpty.style.display = 'none';
    chatView.classList.add('visible');

    /* Listen for messages */
    activeRef = db.ref('sessions/' + id + '/messages');
    activeRef.on('child_added', function (snap) {
      var m = snap.val();
      var el = document.createElement('div');
      el.className = 'adm-bubble ' + (m.sender === 'ash' ? 'ash' : 'visitor');
      el.textContent = m.text;
      thread.appendChild(el);
      thread.scrollTop = thread.scrollHeight;
    });

    /* Reply input — clone to reset previous listeners */
    var fresh = admMsg.cloneNode(true);
    admMsg.parentNode.replaceChild(fresh, admMsg);
    fresh.focus();

    fresh.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var msg = fresh.value.trim();
      if (!msg) return;
      fresh.value = '';

      var now = Date.now();
      db.ref('sessions/' + id + '/messages').push({ sender: 'ash', text: msg, time: now });
      db.ref('sessions/' + id + '/lastActivity').set(now);
    });
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

}());
