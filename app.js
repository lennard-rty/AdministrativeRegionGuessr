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

  /** Alles wat we van een spel weten, voor de tooltip van zijn knop. */
  function describe(entry, main) {
    var parts = [];
    if (entry.count) parts.push(entry.count + ' ' + entry.region.many);
    if (entry.year) parts.push('jaargang ' + entry.year);
    else if (entry.generated) parts.push('bijgewerkt ' + entry.generated);

    // Het gebied van het cijfer op de knop niet nog eens meetellen.
    var areas = window.ARGScores.perfectAreas(entry.id, main && main.area);
    if (areas) parts.push(areas + (areas === 1 ? ' gebied' : ' gebieden') + ' uitgespeeld');
    if (main) parts.push(scoreText(main));
    return parts.join(' · ');
  }

  /** Je beste volledige ronde, voluit. */
  function scoreText(main) {
    var scores = window.ARGScores;
    var where = main.area === 'ALL' ? 'heel het land' : scores.areaName(main.area);
    return (scores.isPerfect(main.record) ? 'uitgespeeld: ' : 'beste volledige ronde: ') +
      main.record.c + ' van ' + main.record.t + ' juist in ' + where;
  }

  /** Datzelfde record kort op de knop: een vinkje als alles juist was, anders het percentage. */
  function scoreMark(main) {
    if (!main) return '';
    var scores = window.ARGScores;
    if (scores.isPerfect(main.record)) return '<span class="game-score is-perfect">✓</span>';
    return '<span class="game-score">' + scores.percent(main.record) + '%</span>';
  }

  /**
   * De spellen per land. De catalogus zet de spellen van eenzelfde land al na elkaar
   * (build-data.mjs sorteert op land, dan op regiotype), dus één keer doorlopen volstaat.
   */
  function byCountry(games) {
    var groups = [];
    games.forEach(function (entry) {
      var group = groups[groups.length - 1];
      if (!group || group.country !== entry.country) {
        group = { country: entry.country, games: [] };
        groups.push(group);
      }
      group.games.push(entry);
    });
    return groups;
  }

  /** Eén spel: een knop met het regiotype en hoeveel regio's erin zitten. */
  function gameButton(entry, last) {
    var main = window.ARGScores.main(entry.id, entry.defaultArea);
    var isLast = entry.id === last;
    return '<li><button type="button" class="game' + (isLast ? ' is-last' : '') +
      '" data-id="' + esc(entry.id) + '" title="' + esc(describe(entry, main)) + '">' +
      '<span class="game-type">' + esc(entry.regionType) + '</span>' +
      (entry.count ? '<span class="game-count">' + esc(entry.count) + '</span>' : '') +
      scoreMark(main) +
      (isLast ? '<span class="game-badge">laatst</span>' : '') +
      '</button></li>';
  }

  function renderMenu() {
    if (!GAMES.length) {
      list.innerHTML = '';
      say('Geen spellen gevonden. Draai eerst: node tools/build-data.mjs --all');
      return;
    }

    var last = store('game');
    list.innerHTML = byCountry(GAMES).map(function (group) {
      return '<li class="country"><h2 class="country-name">' + esc(group.country) + '</h2>' +
        '<ul class="variants">' +
        group.games.map(function (entry) { return gameButton(entry, last); }).join('') +
        '</ul></li>';
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
      window.ARGGame.start(entry, data, leaveGame);
      pushGame();
    });
  }

  // ---------- terugknop ----------

  // De terugknop van Android (en terugvegen op een iPhone, of Vorige in een browser) zou
  // de pagina verlaten, of de app op het beginscherm sluiten. Een spel krijgt daarom een
  // eigen stap in de geschiedenis: terug brengt je naar het startscherm, of sluit eerst het
  // instellingenpaneel als dat openstaat.
  function pushGame() {
    try {
      window.history.pushState({ arg: 'game' }, '');
    } catch (e) { /* geen geschiedenis: dan doet terug wat het altijd deed */ }
  }

  function inGameStep() {
    return !!(window.history.state && window.history.state.arg === 'game');
  }

  // "← Ander spel" neemt dezelfde weg terug, zodat er geen spelstappen blijven liggen.
  function leaveGame() {
    if (inGameStep()) window.history.back();
    else showMenu();
  }

  window.addEventListener('popstate', function () {
    if (app.hidden) return;
    if (window.ARGGame.back()) {
      pushGame();   // het paneel ging dicht; het spel loopt verder en houdt zijn stap
      return;
    }
    window.ARGGame.stop();
    showMenu();
  });

  // Herladen tijdens een spel geeft het startscherm; de spelstap van daarnet hoort er dan
  // niet meer bij.
  if (inGameStep()) {
    try { window.history.replaceState(null, ''); } catch (e) { /* zie pushGame */ }
  }

  list.addEventListener('click', function (e) {
    var button = e.target.closest ? e.target.closest('.game') : null;
    if (!button) return;
    var entry = GAMES.filter(function (game) { return game.id === button.getAttribute('data-id'); })[0];
    if (entry) play(entry, button);
  });

  // ---------- smal scherm ----------

  // Op een gsm staat bovenaan een balk met wat je moet zoeken, en schuiven de instellingen
  // van onderen open. De kop, de vraag, de cijfers en de leerkaart verhuizen daarvoor naar
  // #bar; een lege markering onthoudt waar ze op een breed scherm in het zijpaneel staan.
  // Zo blijft het brede scherm precies wat het was. De mediaquery staat ook in style.css.
  var compact = window.matchMedia('(max-width: 860px), (max-height: 520px)');
  var bar = document.getElementById('bar');
  var movers = ['.head', '.prompt', '.stats', '.progress', '#learnPanel'].map(function (selector) {
    var node = document.querySelector('#panel ' + selector);
    var mark = document.createComment(selector);
    node.parentNode.insertBefore(mark, node);
    return { node: node, mark: mark };
  });

  function placeLayout() {
    movers.forEach(function (item) {
      if (compact.matches) bar.appendChild(item.node);
      else item.mark.parentNode.insertBefore(item.node, item.mark);
    });
  }

  placeLayout();
  if (compact.addEventListener) compact.addEventListener('change', placeLayout);
  else compact.addListener(placeLayout);   // Safari voor versie 14

  // ---------- opstarten ----------

  if (!window.L) {
    say('Leaflet ontbreekt — is de map vendor/ nog compleet?');
  }
  showMenu();
})();
