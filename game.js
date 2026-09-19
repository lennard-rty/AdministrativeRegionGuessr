/*
 * Spellogica — één spel opstarten, spelen en weer opruimen.
 *
 * Het spel weet niets over België of gemeenten: alles wat het toont komt uit het
 * catalogusitem (data/games.js) en de dataset (data/<spel-id>.js). Elke regio heeft
 * { id, names: {taalcode: naam}, groups: [niveau 0, niveau 1, ...], c: [lon, lat] }.
 */
(function () {
  'use strict';

  var MAX_ATTEMPTS = 3;
  var WRONG_FLASH_MS = 1000;   // hoe lang de naam van een foute klik blijft staan
  var REVEAL_MS = 1900;        // hoe lang het juiste antwoord in het rood blijft staan
  var CORRECT_FLASH_MS = 850;
  var ROUND_SIZES = [10, 25, 50];   // keuzes bij "Aantal vragen", naast "alle"

  // Lijndiktes gelden voor ingezoomde kaarten; ver uitgezoomd worden ze geschaald
  // zodat honderden grenzen niet tot één donkere brij versmelten.
  var STYLES = {
    idle:     { color: '#2f3944', weight: 1.1, opacity: 0.5,  fill: true, fillColor: '#ffffff', fillOpacity: 0 },
    dimmed:   { color: '#7c8794', weight: 0.7, opacity: 0.25, fill: true, fillColor: '#ffffff', fillOpacity: 0 },
    selected: { color: '#1d4ed8', weight: 2,   opacity: 0.9,  fill: true, fillColor: '#3b82f6', fillOpacity: 0.28 }
  };

  // De kleur van een afgehandelde regio vertelt hoeveel klikken ze gekost heeft: groen
  // voor meteen juist, dan geler en oranjer per misser, rood als je ze niet vond. In de
  // cijfers telt alleen de eerste klik als juist — de kleur zegt of je er toch geraakt bent.
  var ANSWER = [
    { color: '#166534', fillColor: '#22c55e' },   // meteen juist
    { color: '#854d0e', fillColor: '#eab308' },   // juist na één misser
    { color: '#9a3412', fillColor: '#f97316' },   // juist na twee missers
    { color: '#991b1b', fillColor: '#ef4444' }    // niet gevonden
  ].map(function (tint) {
    return {
      color: tint.color, fillColor: tint.fillColor,
      weight: 1.4, opacity: 0.85, fill: true, fillOpacity: 0.38
    };
  });

  var OSM_CREDIT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bijdragers';
  var PLAIN_CREDIT = OSM_CREDIT + ', tegels van <a href="https://openfreemap.org/">OpenFreeMap</a>';
  var PLAIN_STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
  var BASEMAP_KEYS = { osm: true, plain: true };

  var plainStyle = null;   // OpenFreeMap-stijl zonder labellagen; blijft bewaard tussen spellen
  var running = null;      // opruimfunctie van het spel dat nu loopt

  // ---------- helpers ----------

  var ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"]/g, function (c) {
      return ESCAPES[c];
    });
  }

  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = list[i];
      list[i] = list[j];
      list[j] = tmp;
    }
    return list;
  }

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem('arg.' + key);
      window.localStorage.setItem('arg.' + key, value);
    } catch (e) { /* file:// of privemodus: instellingen worden gewoon niet bewaard */ }
    return null;
  }

  function byId(id) { return document.getElementById(id); }

  // ---------- een spel starten ----------

  function start(entry, dataset, onExit) {
    stop();

    var GEO = dataset.geo;
    var META = dataset.meta || {};
    var levels = entry.levels || [];
    var langs = entry.languages;
    var langCodes = langs.map(function (l) { return l.code; });
    var one = entry.region.one;
    var many = entry.region.many;

    var el = {};
    ['gameCountry', 'gameRegionType', 'dataInfo', 'area', 'areaField', 'count', 'lang', 'langField',
     'basemap', 'basemapNote', 'target', 'attempts', 'statLeft', 'statCorrect', 'statWrong',
     'progressBar', 'misclicks', 'skip', 'restart', 'done', 'quizPanel', 'learnPanel',
     'learnHint', 'learnCard', 'learnName', 'learnMeta', 'sourceLine', 'backToMenu',
     'recordNow', 'recordMore', 'recordSummary', 'recordRows'].forEach(function (id) {
      el[id] = byId(id);
    });

    var state = {
      mode: store('mode') === 'learn' ? 'learn' : 'quiz',
      area: 'ALL',
      areaLevel: -1,
      areaName: null,
      count: 'all',
      lang: langCodes.indexOf(store('lang')) !== -1 ? store('lang') : langCodes[0],
      basemap: 'osm',
      queue: [],
      total: 0,
      current: null,
      attempts: 0,
      correct: 0,         // meteen juist: het enige dat als juist telt
      late: 0,            // pas na een misser gevonden
      missed: 0,          // helemaal niet gevonden
      misclicks: 0,
      status: {},         // id -> aantal missers voor de juiste klik (MAX_ATTEMPTS = niet gevonden)
      locked: false,
      finished: false,
      fullRound: true,     // besloeg de ronde het hele gebied? enkel dan telt ze mee
      result: null,        // uitkomst van de laatst afgewerkte ronde
      learnSelected: null
    };

    function nameOf(props, lang) {
      return props.names[lang || state.lang] || props.names[langCodes[0]];
    }

    function centroid(props) {
      return L.latLng(props.c[1], props.c[0]);
    }

    function inArea(props) {
      return state.area === 'ALL' || props.groups[state.areaLevel] === state.areaName;
    }

    function plural(n) {
      return n === 1 ? one : many;
    }

    // ---------- kaart ----------

    var map = L.map('map', {
      preferCanvas: true,
      maxZoom: 18,
      maxBoundsViscosity: 0.7
    });

    var tiles = null;

    function attachBasemap(layer) {
      if (tiles) map.removeLayer(tiles);
      tiles = layer;
      map.addLayer(tiles);
      if (tiles.bringToBack) tiles.bringToBack();
    }

    // De gewone OSM-kaart toont plaatsnamen; ingezoomd kan je het antwoord dus aflezen.
    function osmLayer() {
      return L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: OSM_CREDIT
      });
    }

    function hasWebGL() {
      try {
        var probe = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
          (probe.getContext('webgl2') || probe.getContext('webgl')));
      } catch (err) {
        return false;
      }
    }

    function fallbackToOsm(reason) {
      el.basemap.value = 'osm';
      state.basemap = 'osm';
      store('basemap', 'osm');
      attachBasemap(osmLayer());
      el.basemapNote.textContent = reason;
    }

    // Dezelfde OSM-gegevens als de gewone kaart, maar vectorieel gerenderd zonder
    // de labellagen — eerlijker om mee te quizzen.
    function attachPlain() {
      try {
        attachBasemap(L.maplibreGL({
          style: plainStyle,
          attributionControl: { customAttribution: PLAIN_CREDIT }
        }));
        el.basemapNote.textContent = '';
      } catch (err) {
        fallbackToOsm('Labelloze kaart kon niet starten, terug naar de gewone kaart.');
      }
    }

    function setBasemap(key) {
      var choice = BASEMAP_KEYS[key] ? key : 'osm';
      state.basemap = choice;
      store('basemap', choice);
      el.basemapNote.textContent = '';

      if (choice === 'osm') {
        attachBasemap(osmLayer());
        return;
      }
      if (!window.maplibregl || !L.maplibreGL || !hasWebGL()) {
        fallbackToOsm('Labelloze kaart vereist WebGL, terug naar de gewone kaart.');
        return;
      }
      if (plainStyle) {
        attachPlain();
        return;
      }

      el.basemapNote.textContent = 'Labelloze kaart laden…';
      fetch(PLAIN_STYLE_URL).then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      }).then(function (style) {
        style.layers = style.layers.filter(function (layer) { return layer.type !== 'symbol'; });
        plainStyle = style;
        if (state.basemap === 'plain') attachPlain();   // gebruiker kan intussen omgeschakeld zijn
      }).catch(function () {
        if (state.basemap === 'plain') {
          fallbackToOsm('Labelloze kaart niet bereikbaar, terug naar de gewone kaart.');
        }
      });
    }

    var canvas = L.canvas({ padding: 0.4 });
    var layerById = {};
    var propsById = {};

    var regions = L.geoJSON(GEO, {
      renderer: canvas,
      style: function () { return STYLES.idle; },
      onEachFeature: function (feature, layer) {
        layerById[feature.properties.id] = layer;
        propsById[feature.properties.id] = feature.properties;
      }
    }).addTo(map);

    var bounds = regions.getBounds();
    map.fitBounds(bounds, { padding: [12, 12] });
    map.setMaxBounds(bounds.pad(0.45));

    // Het hele land past nu in beeld; verder uitzoomen heeft geen zin.
    var fitZoom = map.getZoom();
    map.setMinZoom(Math.max(2, Math.floor(fitZoom)));

    function weightScale(zoom) {
      if (GEO.features.length < 60) return 1;   // weinig vormen: nooit een donkere brij
      var steps = zoom - fitZoom;
      if (steps <= 1) return 0.5;
      if (steps <= 3) return 0.75;
      return 1;
    }

    // ---------- labels op de kaart ----------

    var flashes = [];
    var pinned = null;

    function makeLabel(latlng, text, kind) {
      return L.tooltip({
        permanent: true,
        direction: 'top',
        className: 'gg-label' + (kind ? ' is-' + kind : ''),
        opacity: 1,
        interactive: false
      }).setLatLng(latlng).setContent(esc(text)).addTo(map);
    }

    function flash(latlng, text, kind, ms) {
      var entry = { tip: makeLabel(latlng, text, kind), timer: null };
      entry.timer = window.setTimeout(function () {
        map.removeLayer(entry.tip);
        var i = flashes.indexOf(entry);
        if (i !== -1) flashes.splice(i, 1);
      }, ms);
      flashes.push(entry);
    }

    function clearFlashes() {
      flashes.forEach(function (entry) {
        window.clearTimeout(entry.timer);
        map.removeLayer(entry.tip);
      });
      flashes.length = 0;
    }

    function pin(latlng, text) {
      unpin();
      pinned = makeLabel(latlng, text, 'info');
    }

    function unpin() {
      if (pinned) {
        map.removeLayer(pinned);
        pinned = null;
      }
    }

    // ---------- styling ----------

    function styleFor(props) {
      if (state.mode === 'learn') {
        return props.id === state.learnSelected ? STYLES.selected : STYLES.idle;
      }
      if (!inArea(props)) return STYLES.dimmed;
      var misses = state.status[props.id];   // 0, 1, 2 klikken te veel, of MAX_ATTEMPTS
      return misses == null ? STYLES.idle : ANSWER[misses];
    }

    function applyStyle(id) {
      var props = propsById[id];
      var base = styleFor(props);
      var style = {};
      for (var key in base) style[key] = base[key];
      style.weight = base.weight * weightScale(map.getZoom());
      style.interactive = state.mode === 'learn' ? true : inArea(props);
      layerById[id].setStyle(style);
    }

    function restyleAll() {
      Object.keys(layerById).forEach(applyStyle);
    }

    var lastScale = null;
    map.on('zoomend', function () {
      var scale = weightScale(map.getZoom());
      if (scale === lastScale) return;
      lastScale = scale;
      restyleAll();
    });

    // ---------- gebiedskeuze ----------

    function rank(level, name) {
      var order = levels[level] && levels[level].order;
      if (!order) return 0;
      var i = order.indexOf(name);
      return i === -1 ? order.length : i;
    }

    function buildAreaOptions() {
      if (!levels.length) {
        el.area.innerHTML = '';   // laat niets van een vorig spel staan
        el.areaField.hidden = true;
        return;
      }
      el.areaField.hidden = false;

      var html = '<option value="ALL">Heel ' + esc(entry.country) +
        ' (' + GEO.features.length + ')</option>';

      levels.forEach(function (level, i) {
        var groups = {};
        GEO.features.forEach(function (feature) {
          var name = feature.properties.groups[i];
          if (!name) return;
          if (!groups[name]) groups[name] = { n: 0, parent: feature.properties.groups[0] };
          groups[name].n++;
        });

        var names = Object.keys(groups);
        if (!names.length) return;

        names.sort(function (a, b) {
          return rank(0, groups[a].parent) - rank(0, groups[b].parent) ||
            rank(i, a) - rank(i, b) ||
            a.localeCompare(b, 'nl');
        });

        html += '<optgroup label="' + esc(level.many) + '">';
        names.forEach(function (name) {
          html += '<option value="L' + i + ':' + esc(name) + '">' +
            esc(name) + ' (' + groups[name].n + ')</option>';
        });
        html += '</optgroup>';
      });

      el.area.innerHTML = html;
    }

    function setArea(value) {
      var separator = value.indexOf(':');
      if (value === 'ALL' || separator === -1) {
        state.area = 'ALL';
        state.areaLevel = -1;
        state.areaName = null;
      } else {
        state.area = value;
        state.areaLevel = Number(value.slice(1, separator));
        state.areaName = value.slice(separator + 1);
      }
      store('area.' + entry.id, state.area);
    }

    function areaIds() {
      return GEO.features.filter(function (feature) {
        return inArea(feature.properties);
      }).map(function (feature) {
        return feature.properties.id;
      });
    }

    function zoomToArea(animate) {
      var box = L.latLngBounds([]);
      areaIds().forEach(function (id) { box.extend(layerById[id].getBounds()); });
      if (!box.isValid()) return;
      if (animate === false) map.fitBounds(box, { padding: [16, 16] });
      else map.flyToBounds(box, { padding: [16, 16], duration: 0.6 });
    }

    // Een spel mag een gebied aanwijzen om in te beginnen. Frankrijk doet dat: met de
    // overzeese departementen erbij zou "heel het land" een wereldkaart opleveren.
    function defaultArea() {
      if (!entry.defaultArea) return 'ALL';
      for (var i = 0; i < levels.length; i++) {
        var level = i;
        var exists = GEO.features.some(function (feature) {
          return feature.properties.groups[level] === entry.defaultArea;
        });
        if (exists) return 'L' + i + ':' + entry.defaultArea;
      }
      return 'ALL';
    }

    // ---------- records ----------

    function areaName(value) {
      if (value === 'ALL') return 'Heel ' + entry.country;
      var separator = value.indexOf(':');
      return separator === -1 ? value : value.slice(separator + 1);
    }

    function areaValues() {
      if (!levels.length) return ['ALL'];
      return Array.prototype.map.call(el.area.options, function (option) { return option.value; });
    }

    function renderRecords() {
      var scores = window.ARGScores;
      var current = scores.get(entry.id, state.area);
      var here = areaName(state.area);

      if (!current) {
        el.recordNow.className = 'record-now';
        el.recordNow.textContent = 'Nog geen volledige ronde gespeeld voor ' + here + '.';
      } else if (scores.isPerfect(current)) {
        el.recordNow.className = 'record-now is-perfect';
        el.recordNow.textContent = here + ' uitgespeeld — alle ' + current.t + ' ' +
          plural(current.t) + ' juist.';
      } else {
        el.recordNow.className = 'record-now';
        el.recordNow.textContent = 'Record voor ' + here + ': ' + scores.percent(current) +
          '% (' + current.c + ' van ' + current.t + ').';
      }

      var saved = scores.forGame(entry.id);
      var all = areaValues();
      var played = all.filter(function (value) { return scores.get(entry.id, value); });

      el.recordMore.hidden = played.length < 2;
      if (el.recordMore.hidden) return;

      var perfect = played.filter(function (value) { return scores.isPerfect(saved[value]); }).length;
      el.recordSummary.textContent = 'Records per gebied — ' + played.length + ' van ' +
        all.length + ' gespeeld, ' + perfect + ' uitgespeeld';

      el.recordRows.innerHTML = played.map(function (value) {
        var record = saved[value];
        var done = scores.isPerfect(record);
        return '<dt>' + esc(areaName(value)) + '</dt>' +
          '<dd' + (done ? ' class="is-perfect"' : '') + '>' +
          scores.percent(record) + '%' + (done ? ' ✓' : '') + '</dd>';
      }).join('');
    }

    // ---------- rondelengte ----------

    function buildCountOptions() {
      var available = areaIds().length;
      var html = '<option value="all">alle (' + available + ')</option>';
      ROUND_SIZES.forEach(function (n) {
        if (n < available) html += '<option value="' + n + '">' + n + '</option>';
      });
      el.count.innerHTML = html;

      // Een keuze die niet meer past (klein gebied) valt terug op "alle".
      var wanted = state.count === 'all' ? 'all' : String(state.count);
      var fits = Array.prototype.some.call(el.count.options, function (option) {
        return option.value === wanted;
      });
      el.count.value = fits ? wanted : 'all';
      state.count = el.count.value === 'all' ? 'all' : Number(el.count.value);
      store('count', el.count.value);
    }

    // ---------- quiz ----------

    var revealTimer = null;

    function startRound() {
      if (revealTimer) {
        window.clearTimeout(revealTimer);
        revealTimer = null;
      }
      clearFlashes();
      unpin();
      state.status = {};
      state.correct = 0;
      state.late = 0;
      state.missed = 0;
      state.misclicks = 0;
      state.attempts = 0;
      state.locked = false;
      state.finished = false;
      state.fullRound = true;
      state.result = null;

      var ids = shuffle(areaIds());
      state.queue = state.count === 'all' ? ids : ids.slice(0, state.count);
      state.total = state.queue.length;
      state.current = state.queue.pop() || null;
      restyleAll();
      renderRecords();
      render();
    }

    function nextTarget() {
      state.attempts = 0;
      state.current = state.queue.pop() || null;
      if (!state.current) finishRound();
      render();
    }

    function finishRound() {
      state.finished = true;
      // Een korte ronde (10, 25 of 50 vragen) is oefenen, geen record: anders zou een
      // steekproef van tien de score voor een heel land bepalen.
      state.fullRound = state.total > 0 && state.total === areaIds().length;
      state.result = state.fullRound
        ? window.ARGScores.save(entry.id, state.area, state.correct, state.total)
        : null;
      renderRecords();
    }

    function onCorrect(latlng) {
      var misses = state.attempts;
      state.status[state.current] = misses;
      if (misses === 0) state.correct++;
      else state.late++;   // wel gevonden, maar niet in één keer: telt als fout
      applyStyle(state.current);
      flash(latlng, nameOf(propsById[state.current]), misses === 0 ? 'ok' : 'late', CORRECT_FLASH_MS);
      nextTarget();
    }

    function onWrong(clickedProps, latlng) {
      state.attempts++;
      state.misclicks++;
      flash(latlng, nameOf(clickedProps), 'bad', WRONG_FLASH_MS);
      if (state.attempts >= MAX_ATTEMPTS) reveal();
      else render();
    }

    function reveal() {
      var id = state.current;
      if (!id) return;

      state.status[id] = MAX_ATTEMPTS;
      state.missed++;
      state.locked = true;
      applyStyle(id);
      clearFlashes();   // laat het juiste antwoord alleen staan

      var latlng = centroid(propsById[id]);
      if (!map.getBounds().pad(-0.12).contains(latlng)) map.panTo(latlng, { duration: 0.5 });
      flash(latlng, nameOf(propsById[id]), 'bad', REVEAL_MS);
      render();

      revealTimer = window.setTimeout(function () {
        revealTimer = null;
        state.locked = false;
        nextTarget();
      }, REVEAL_MS);
    }

    // ---------- leermodus ----------

    function showLearn(props) {
      state.learnSelected = props.id;
      restyleAll();
      pin(centroid(props), nameOf(props));

      el.learnCard.hidden = false;
      el.learnName.textContent = nameOf(props);

      var rows = [];
      langs.forEach(function (lang) {
        if (lang.code !== state.lang && props.names[lang.code] &&
            props.names[lang.code] !== nameOf(props)) {
          rows.push([lang.label, props.names[lang.code]]);
        }
      });
      levels.forEach(function (level, i) {
        if (props.groups[i]) rows.push([level.one, props.groups[i]]);
      });
      if (entry.idLabel) rows.push([entry.idLabel, props.id]);

      el.learnMeta.innerHTML = rows.map(function (row) {
        return '<dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd>';
      }).join('');
    }

    function clearLearn() {
      state.learnSelected = null;
      unpin();
      el.learnCard.hidden = true;
      restyleAll();
    }

    // ---------- klikafhandeling ----------

    var lastHit = 0;

    regions.on('click', function (e) {
      var layer = e.layer || e.propagatedFrom;
      if (!layer || !layer.feature) return;
      lastHit = Date.now();

      var props = layer.feature.properties;

      if (state.mode === 'learn') {
        showLearn(props);
        return;
      }
      if (state.locked || state.finished || !state.current || !inArea(props)) return;

      if (props.id === state.current) onCorrect(e.latlng);
      else onWrong(props, e.latlng);
    });

    map.on('click', function (e) {
      // Klik op een regio is hierboven al afgehandeld en bubbelt door naar de kaart.
      if (e.propagatedFrom || Date.now() - lastHit < 100) return;
      // Buiten elke meespelende regio geklikt: telt niet als poging.
      if (state.mode === 'learn') clearLearn();
    });

    // ---------- weergave ----------

    function render() {
      var left = state.queue.length + (state.current && !state.finished ? 1 : 0);
      el.statLeft.textContent = left;
      el.statCorrect.textContent = state.correct;
      el.statWrong.textContent = state.late + state.missed;

      var handled = state.correct + state.late + state.missed;
      el.progressBar.style.width = state.total ? (handled / state.total * 100) + '%' : '0%';
      el.misclicks.textContent = state.misclicks ? 'Foute klikken: ' + state.misclicks : ' ';

      if (state.finished) {
        el.target.textContent = 'Klaar!';
        el.done.hidden = false;
        var details = [];
        if (state.late) details.push(state.late + ' pas na een extra klik gevonden');
        if (state.missed) details.push(state.missed + ' niet gevonden');
        if (state.misclicks) {
          details.push(state.misclicks + ' foute klik' + (state.misclicks === 1 ? '' : 'ken'));
        }
        el.done.innerHTML = '<b>' + state.correct + ' van ' + state.total +
          ' in één keer juist</b>' +
          (details.length ? '<br>' + esc(details.join(', ')) + '.' : '') +
          '<span class="note">' + esc(roundVerdict()) + '</span>';
        el.skip.disabled = true;
      } else {
        el.target.textContent = state.current ? nameOf(propsById[state.current]) : '—';
        el.done.hidden = true;
        el.skip.disabled = state.locked;
      }

      var dots = '';
      for (var i = 0; i < MAX_ATTEMPTS; i++) {
        dots += '<i' + (i < state.attempts ? ' class="is-used"' : '') + '></i>';
      }
      el.attempts.innerHTML = dots;
    }

    /** Wat deze ronde met je record deed — één zin onder de einduitslag. */
    function roundVerdict() {
      if (!state.fullRound) return 'Korte ronde — telt niet mee voor het record.';
      if (state.correct === state.total) return areaName(state.area) + ' uitgespeeld!';
      if (state.result && state.result.improved) {
        return state.result.previous
          ? 'Nieuw record, je vorige was ' + window.ARGScores.percent(state.result.previous) + '%.'
          : 'Je eerste record voor dit gebied.';
      }
      if (state.result && state.result.record) {
        return 'Je record voor dit gebied blijft ' +
          window.ARGScores.percent(state.result.record) + '%.';
      }
      return '';
    }

    function setMode(mode) {
      state.mode = mode;
      store('mode', mode);
      clearFlashes();
      state.learnSelected = null;
      unpin();
      el.learnCard.hidden = true;
      el.quizPanel.hidden = mode !== 'quiz';
      el.learnPanel.hidden = mode !== 'learn';
      modeButtons.forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-mode') === mode);
      });
      restyleAll();
      render();
    }

    // ---------- bediening ----------

    var listeners = [];

    function on(node, type, handler) {
      node.addEventListener(type, handler);
      listeners.push([node, type, handler]);
    }

    var modeButtons = Array.prototype.slice.call(document.querySelectorAll('.mode'));
    modeButtons.forEach(function (btn) {
      on(btn, 'click', function () { setMode(btn.getAttribute('data-mode')); });
    });

    on(el.area, 'change', function () {
      setArea(el.area.value);
      buildCountOptions();
      startRound();
      zoomToArea();
    });

    on(el.count, 'change', function () {
      state.count = el.count.value === 'all' ? 'all' : Number(el.count.value);
      store('count', el.count.value);
      startRound();
    });

    on(el.lang, 'change', function () {
      state.lang = el.lang.value;
      store('lang', state.lang);
      if (state.learnSelected) showLearn(propsById[state.learnSelected]);
      render();
    });

    on(el.basemap, 'change', function () { setBasemap(el.basemap.value); });

    on(el.skip, 'click', function () {
      if (state.mode !== 'quiz' || state.locked || state.finished) return;
      reveal();
    });

    on(el.restart, 'click', startRound);

    on(el.backToMenu, 'click', function () {
      stop();
      if (onExit) onExit();
    });

    // ---------- opstarten ----------

    el.gameCountry.textContent = entry.country;
    el.gameRegionType.textContent = '(' + entry.regionType + ')';
    el.dataInfo.textContent = GEO.features.length + ' ' + many +
      (META.year ? ' · jaargang ' + META.year : META.generated ? ' · bijgewerkt ' + META.generated : '');
    el.learnHint.textContent = 'Klik op een ' + one + ' op de kaart om de naam te zien.';
    el.sourceLine.innerHTML = 'Grenzen: ' + (entry.source && entry.source.url
      ? '<a href="' + esc(entry.source.url) + '" target="_blank" rel="noopener">' +
        esc(entry.source.credit || entry.source.name) + '</a>'
      : esc((entry.source && entry.source.credit) || 'onbekend')) + '.';

    el.langField.hidden = langs.length < 2;
    el.lang.innerHTML = langs.map(function (lang) {
      return '<option value="' + esc(lang.code) + '">' + esc(lang.label) + '</option>';
    }).join('');
    el.lang.value = state.lang;

    buildAreaOptions();
    var savedArea = store('area.' + entry.id);
    var known = savedArea && Array.prototype.some.call(el.area.options, function (option) {
      return option.value === savedArea;
    });
    setArea(known ? savedArea : defaultArea());
    el.area.value = state.area;

    var savedCount = store('count');
    state.count = savedCount && savedCount !== 'all' ? Number(savedCount) : 'all';
    buildCountOptions();

    var savedBasemap = store('basemap');
    el.basemap.value = BASEMAP_KEYS[savedBasemap] ? savedBasemap : 'osm';
    setBasemap(el.basemap.value);

    startRound();
    setMode(state.mode);
    if (state.area !== 'ALL') zoomToArea(false);

    // ---------- opruimen ----------

    running = function () {
      if (revealTimer) window.clearTimeout(revealTimer);
      clearFlashes();
      unpin();
      listeners.forEach(function (item) { item[0].removeEventListener(item[1], item[2]); });
      listeners.length = 0;
      // Eerst de vormen, dan de renderer, dan pas de kaart. Draai je die volgorde om, dan
      // blijft er een geplande hertekening over voor een canvas dat al weg is; die valt
      // pas op als je snel na een klik een ander spel kiest.
      map.removeLayer(regions);
      map.removeLayer(canvas);
      map.remove();
      running = null;
      window.ARG.state = null;
    };

    // Handig om vanuit de browserconsole in het spel te kijken of te sleutelen.
    window.ARG = {
      entry: entry, map: map, state: state, layers: layerById, props: propsById, restart: startRound
    };
  }

  function stop() {
    if (running) running();
  }

  window.ARGGame = { start: start, stop: stop };
})();
