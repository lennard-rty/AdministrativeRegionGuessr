/*
 * Startscherm: welk spel spelen we? Zet de gekozen dataset klaar en geeft ze aan
 * game.js door. De catalogus komt uit data/games.js, de grenzen uit data/<id>.js —
 * dat laatste bestand wordt pas opgehaald wanneer je het spel kiest, zodat het
 * startscherm licht blijft hoe veel spellen er ook bijkomen.
 */
(function () {
  'use strict';

  var GAMES = window.ARG_GAMES || [];

  var menu = document.getElementById('menu');
  var app = document.getElementById('app');
  var list = document.getElementById('gameList');
  var note = document.getElementById('menuNote');

  var ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"]/g, function (c) {
      return ESCAPES[c];
    });
  }

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem('arg.' + key);
      window.localStorage.setItem('arg.' + key, value);
    } catch (e) { /* file:// of privemodus: instellingen worden gewoon niet bewaard */ }
    return null;
  }

  function say(message) {
    note.hidden = !message;
    note.textContent = message || '';
  }

  // ---------- startscherm ----------

  function describe(entry) {
    var parts = [];
    if (entry.count) parts.push(entry.count + ' ' + entry.region.many);
    if (entry.year) parts.push('jaargang ' + entry.year);
    else if (entry.generated) parts.push('bijgewerkt ' + entry.generated);
    return parts.join(' · ');
  }

  function renderMenu() {
    if (!GAMES.length) {
      list.innerHTML = '';
      say('Geen spellen gevonden. Draai eerst: node tools/build-data.mjs --all');
      return;
    }

    var last = store('game');
    list.innerHTML = GAMES.map(function (entry) {
      return '<li><button type="button" class="game" data-id="' + esc(entry.id) + '">' +
        '<span class="game-title">' + esc(entry.country) +
        ' <em>(' + esc(entry.regionType) + ')</em></span>' +
        '<span class="game-meta">' + esc(describe(entry)) + '</span>' +
        (entry.id === last ? '<span class="game-badge">laatst gespeeld</span>' : '') +
        '</button></li>';
    }).join('');
  }

  // ---------- data ophalen ----------

  function dataset(entry) {
    return window.ARG_DATA && window.ARG_DATA[entry.id];
  }

  function loadData(entry, done) {
    if (dataset(entry)) {
      done(null, dataset(entry));
      return;
    }
    var script = document.createElement('script');
    script.src = entry.file;
    script.onload = function () {
      if (dataset(entry)) done(null, dataset(entry));
      else done(new Error(entry.file + ' bevat geen data voor ' + entry.id));
    };
    script.onerror = function () {
      done(new Error(entry.file + ' kon niet geladen worden — draai: node tools/build-data.mjs ' + entry.id));
    };
    document.head.appendChild(script);
  }

  // ---------- schakelen tussen menu en spel ----------

  function showMenu() {
    app.hidden = true;
    menu.hidden = false;
    document.title = 'Administrative Region Guessr';
    say('');
    renderMenu();
  }

  function play(entry, button) {
    say('');
    if (button) button.classList.add('is-loading');

    loadData(entry, function (err, data) {
      if (button) button.classList.remove('is-loading');
      if (err) {
        say(err.message);
        return;
      }
      store('game', entry.id);
      document.title = entry.country + ' (' + entry.regionType + ') — Region Guessr';

      // De kaart heeft een zichtbare container met afmetingen nodig voor ze start.
      menu.hidden = true;
      app.hidden = false;
      window.ARGGame.start(entry, data, showMenu);
    });
  }

  list.addEventListener('click', function (e) {
    var button = e.target.closest ? e.target.closest('.game') : null;
    if (!button) return;
    var entry = GAMES.filter(function (game) { return game.id === button.getAttribute('data-id'); })[0];
    if (entry) play(entry, button);
  });

  // ---------- opstarten ----------

  if (!window.L) {
    say('Leaflet ontbreekt — is de map vendor/ nog compleet?');
  }
  showMenu();
})();
