/* Belgische Gemeente Guessr — spellogica. */
(function () {
  'use strict';

  var DATA = window.GEMEENTEN;
  var META = window.GEMEENTEN_META || {};

  if (!DATA || !DATA.features) {
    document.getElementById('dataInfo').textContent =
      'data/gemeenten.js ontbreekt — draai eerst: node tools/build-data.mjs';
    return;
  }

  var MAX_ATTEMPTS = 3;
  var WRONG_FLASH_MS = 1000;   // hoe lang de naam van een foute klik blijft staan
  var REVEAL_MS = 1900;        // hoe lang het juiste antwoord in het rood blijft staan
  var CORRECT_FLASH_MS = 850;

  var REGION_ORDER = ['Vlaams Gewest', 'Waals Gewest', 'Brussels Hoofdstedelijk Gewest'];
  var LANG_LABEL = { nl: 'Nederlands', fr: 'Frans', de: 'Duits' };

  // Lijndiktes gelden voor ingezoomde kaarten; ver uitgezoomd worden ze geschaald
  // zodat de 565 grenzen niet tot één donkere brij versmelten.
  var STYLES = {
    idle:     { color: '#2f3944', weight: 1.1, opacity: 0.5,  fill: true, fillColor: '#ffffff', fillOpacity: 0 },
    dimmed:   { color: '#7c8794', weight: 0.7, opacity: 0.25, fill: true, fillColor: '#ffffff', fillOpacity: 0 },
    correct:  { color: '#166534', weight: 1.4, opacity: 0.85, fill: true, fillColor: '#22c55e', fillOpacity: 0.38 },
    wrong:    { color: '#991b1b', weight: 1.4, opacity: 0.85, fill: true, fillColor: '#ef4444', fillOpacity: 0.38 },
    selected: { color: '#1d4ed8', weight: 2,   opacity: 0.9,  fill: true, fillColor: '#3b82f6', fillOpacity: 0.28 }
  };

  function weightScale(zoom) {
    if (zoom <= 8) return 0.5;
    if (zoom <= 10) return 0.75;
    return 1;
  }

  var state = {
    mode: 'quiz',
    area: 'ALL',
    lang: 'nl',
    basemap: 'osm',
    queue: [],
    total: 0,
    current: null,
    attempts: 0,
    correct: 0,
    wrong: 0,
    misclicks: 0,
    status: {},          // id -> 'correct' | 'wrong'
    locked: false,
    finished: false,
    learnSelected: null
  };

  var el = {};
  ['dataInfo', 'area', 'lang', 'basemap', 'basemapNote', 'target', 'attempts', 'statLeft', 'statCorrect', 'statWrong',
   'progressBar', 'misclicks', 'skip', 'restart', 'done', 'quizPanel', 'learnPanel',
   'learnCard', 'learnName', 'learnMeta', 'sourceName'].forEach(function (id) {
    el[id] = document.getElementById(id);
  });

  // ---------- helpers ----------

  var ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"]/g, function (c) {
      return ESCAPES[c];
    });
  }

  function nameOf(props, lang) {
    return props[lang || state.lang] || props.nl;
  }

  function centroid(props) {
    return L.latLng(props.c[1], props.c[0]);
  }

  function inArea(props) {
    return state.area === 'ALL' || props.reg === state.area || props.prov === state.area;
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
      if (value === undefined) return window.localStorage.getItem('bgg.' + key);
      window.localStorage.setItem('bgg.' + key, value);
    } catch (e) { /* file:// of privemodus: instellingen worden gewoon niet bewaard */ }
    return null;
  }

  // ---------- kaart ----------

  var map = L.map('map', {
    preferCanvas: true,
    minZoom: 7,
    maxZoom: 18,
    maxBoundsViscosity: 0.7
  });

  var OSM_CREDIT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bijdragers';
  var PLAIN_CREDIT = OSM_CREDIT + ', tegels van <a href="https://openfreemap.org/">OpenFreeMap</a>';
  var PLAIN_STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
  var BASEMAP_KEYS = { osm: true, plain: true };

  var tiles = null;
  var plainStyle = null;   // OpenFreeMap-stijl met de labellagen eruit, na de eerste keer bewaard

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
  var byId = {};
  var propsById = {};

  var gemeenten = L.geoJSON(DATA, {
    renderer: canvas,
    style: function () { return STYLES.idle; },
    onEachFeature: function (feature, layer) {
      byId[feature.properties.id] = layer;
      propsById[feature.properties.id] = feature.properties;
    }
  }).addTo(map);

  map.fitBounds(gemeenten.getBounds(), { padding: [12, 12] });
  map.setMaxBounds(gemeenten.getBounds().pad(0.45));

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
    var status = state.status[props.id];
    if (status === 'correct') return STYLES.correct;
    if (status === 'wrong') return STYLES.wrong;
    return STYLES.idle;
  }

  function applyStyle(id) {
    var props = propsById[id];
    var base = styleFor(props);
    var style = {};
    for (var key in base) style[key] = base[key];
    style.weight = base.weight * weightScale(map.getZoom());
    style.interactive = state.mode === 'learn' ? true : inArea(props);
    byId[id].setStyle(style);
  }

  function restyleAll() {
    Object.keys(byId).forEach(applyStyle);
  }

  var lastScale = null;
  map.on('zoomend', function () {
    var scale = weightScale(map.getZoom());
    if (scale === lastScale) return;
    lastScale = scale;
    restyleAll();
  });

  // ---------- gebiedskeuze ----------

  function buildAreaOptions() {
    var regions = {};
    var provinces = {};

    DATA.features.forEach(function (feature) {
      var props = feature.properties;
      regions[props.reg] = (regions[props.reg] || 0) + 1;
      if (props.prov !== props.reg) {
        if (!provinces[props.prov]) provinces[props.prov] = { reg: props.reg, n: 0 };
        provinces[props.prov].n++;
      }
    });

    var html = '<option value="ALL">Heel België (' + DATA.features.length + ')</option>';

    html += '<optgroup label="Gewesten">';
    REGION_ORDER.filter(function (name) { return regions[name]; }).forEach(function (name) {
      html += '<option value="' + esc(name) + '">' + esc(name) + ' (' + regions[name] + ')</option>';
    });
    html += '</optgroup><optgroup label="Provincies">';

    Object.keys(provinces).sort(function (a, b) {
      var ra = REGION_ORDER.indexOf(provinces[a].reg);
      var rb = REGION_ORDER.indexOf(provinces[b].reg);
      return ra - rb || a.localeCompare(b, 'nl');
    }).forEach(function (name) {
      html += '<option value="' + esc(name) + '">' + esc(name) + ' (' + provinces[name].n + ')</option>';
    });

    el.area.innerHTML = html + '</optgroup>';
  }

  function areaIds() {
    return DATA.features.filter(function (feature) {
      return inArea(feature.properties);
    }).map(function (feature) {
      return feature.properties.id;
    });
  }

  function zoomToArea() {
    var bounds = L.latLngBounds([]);
    areaIds().forEach(function (id) { bounds.extend(byId[id].getBounds()); });
    if (bounds.isValid()) map.flyToBounds(bounds, { padding: [16, 16], duration: 0.6 });
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
    state.wrong = 0;
    state.misclicks = 0;
    state.attempts = 0;
    state.locked = false;
    state.finished = false;
    state.queue = shuffle(areaIds());
    state.total = state.queue.length;
    state.current = state.queue.pop() || null;
    restyleAll();
    render();
  }

  function nextTarget() {
    state.attempts = 0;
    state.current = state.queue.pop() || null;
    if (!state.current) state.finished = true;
    render();
  }

  function onCorrect(latlng) {
    state.status[state.current] = 'correct';
    state.correct++;
    applyStyle(state.current);
    flash(latlng, nameOf(propsById[state.current]), 'ok', CORRECT_FLASH_MS);
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

    state.status[id] = 'wrong';
    state.wrong++;
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
    ['nl', 'fr', 'de'].forEach(function (lang) {
      if (lang !== state.lang && props[lang] && props[lang] !== nameOf(props)) {
        rows.push([LANG_LABEL[lang], props[lang]]);
      }
    });
    if (props.prov !== props.reg) rows.push(['Provincie', props.prov]);
    rows.push(['Gewest', props.reg]);
    rows.push(['NIS-code', props.id]);

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

  gemeenten.on('click', function (e) {
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
    // Klik op een gemeente is hierboven al afgehandeld en bubbelt door naar de kaart.
    if (e.propagatedFrom || Date.now() - lastHit < 100) return;
    // Buiten elke meespelende gemeente geklikt: telt niet als poging.
    if (state.mode === 'learn') clearLearn();
  });

  // ---------- weergave ----------

  function render() {
    var left = state.queue.length + (state.current && !state.finished ? 1 : 0);
    el.statLeft.textContent = left;
    el.statCorrect.textContent = state.correct;
    el.statWrong.textContent = state.wrong;

    var handled = state.correct + state.wrong;
    el.progressBar.style.width = state.total ? (handled / state.total * 100) + '%' : '0%';
    el.misclicks.textContent = state.misclicks
      ? 'Foute klikken: ' + state.misclicks
      : ' ';

    if (state.finished) {
      el.target.textContent = 'Klaar!';
      el.done.hidden = false;
      el.done.innerHTML = '<b>' + state.correct + ' van ' + state.total + ' juist</b><br>' +
        state.wrong + ' gemeente' + (state.wrong === 1 ? '' : 'n') + ' niet gevonden, ' +
        state.misclicks + ' foute klik' + (state.misclicks === 1 ? '' : 'ken') + '.';
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

  function setMode(mode) {
    state.mode = mode;
    store('mode', mode);
    clearFlashes();
    state.learnSelected = null;
    unpin();
    el.learnCard.hidden = true;
    el.quizPanel.hidden = mode !== 'quiz';
    el.learnPanel.hidden = mode !== 'learn';
    Array.prototype.forEach.call(document.querySelectorAll('.mode'), function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-mode') === mode);
    });
    restyleAll();
    render();
  }

  // ---------- bediening ----------

  Array.prototype.forEach.call(document.querySelectorAll('.mode'), function (btn) {
    btn.addEventListener('click', function () { setMode(btn.getAttribute('data-mode')); });
  });

  el.area.addEventListener('change', function () {
    state.area = el.area.value;
    store('area', state.area);
    startRound();
    zoomToArea();
  });

  el.lang.addEventListener('change', function () {
    state.lang = el.lang.value;
    store('lang', state.lang);
    if (state.learnSelected) showLearn(propsById[state.learnSelected]);
    render();
  });

  el.basemap.addEventListener('change', function () {
    setBasemap(el.basemap.value);
  });

  el.skip.addEventListener('click', function () {
    if (state.mode !== 'quiz' || state.locked || state.finished) return;
    reveal();
  });

  el.restart.addEventListener('click', startRound);

  // ---------- opstarten ----------

  buildAreaOptions();

  var savedArea = store('area');
  var hasArea = Array.prototype.some.call(el.area.options, function (option) {
    return option.value === savedArea;
  });
  if (savedArea && hasArea) {
    el.area.value = savedArea;
    state.area = savedArea;
  }

  var savedLang = store('lang');
  if (savedLang && LANG_LABEL[savedLang]) {
    el.lang.value = savedLang;
    state.lang = savedLang;
  }

  var savedBasemap = store('basemap');
  el.basemap.value = BASEMAP_KEYS[savedBasemap] ? savedBasemap : 'osm';
  setBasemap(el.basemap.value);

  el.dataInfo.textContent = DATA.features.length + ' gemeenten · jaargang ' + (META.year || '?');
  el.sourceName.textContent = META.source || 'Statbel';

  startRound();
  setMode(store('mode') === 'learn' ? 'learn' : 'quiz');
  if (state.area !== 'ALL') zoomToArea();

  // Handig om vanuit de browserconsole in het spel te kijken of te sleutelen.
  window.BGG = { map: map, state: state, layers: byId, props: propsById, restart: startRound };
})();
