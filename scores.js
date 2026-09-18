/*
 * Records per spel en per gebied.
 *
 * Alles zit in één localStorage-sleutel van je eigen browser (`arg.records`). Er komt dus
 * geen bestand in de repo terecht: wie dit project uitcheckt, begint met een lege lijst,
 * en jouw records blijven van jou. Er wordt geen tijd bijgehouden — snelheid is het punt
 * van dit spel niet — alleen hoeveel regio's je juist had.
 *
 * Vorm: { "<spel-id>": { "<gebied>": { c: juist, t: totaal } } }, met "ALL" als gebied
 * voor het hele land. Alleen volledige rondes komen erin: een steekproef van tien vragen
 * valt niet te vergelijken met alle 565 gemeenten.
 */
(function () {
  'use strict';

  var KEY = 'arg.records';

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};   // file:// of privemodus: records worden gewoon niet bewaard
    }
  }

  function write(all) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(all));
    } catch (e) { /* niets aan te doen; het spel blijft gewoon werken */ }
  }

  function valid(record) {
    return !!record && typeof record.c === 'number' && typeof record.t === 'number' && record.t > 0;
  }

  function forGame(gameId) {
    var games = read();
    var game = games[gameId];
    return game && typeof game === 'object' ? game : {};
  }

  function get(gameId, area) {
    var record = forGame(gameId)[area];
    return valid(record) ? record : null;
  }

  /** Bewaart een volledige ronde; geeft terug of het een verbetering was. */
  function save(gameId, area, correct, total) {
    if (!total) return null;
    var all = read();
    var game = all[gameId];
    if (!game || typeof game !== 'object') game = all[gameId] = {};

    var previous = valid(game[area]) ? game[area] : null;
    if (previous && previous.c / previous.t >= correct / total) {
      return { record: previous, previous: previous, improved: false };
    }
    game[area] = { c: correct, t: total };
    write(all);
    return { record: game[area], previous: previous, improved: true };
  }

  function isPerfect(record) {
    return valid(record) && record.c === record.t;
  }

  /** 99% blijft 99% zolang er één regio mist: 100% betekent echt alles juist. */
  function percent(record) {
    if (!valid(record)) return 0;
    if (isPerfect(record)) return 100;
    return Math.min(99, Math.round(record.c / record.t * 100));
  }

  /** De naam van een gebied uit zijn sleutel: "L0:Vlaams Gewest" -> "Vlaams Gewest". */
  function areaName(key) {
    var separator = key.indexOf(':');
    return separator === -1 ? key : key.slice(separator + 1);
  }

  /**
   * Het record dat een spel het beste samenvat: dat van het hele land, of — voor een
   * spel dat in één gebied begint, zoals Frankrijk — dat van dat startgebied.
   */
  function main(gameId, defaultArea) {
    var game = forGame(gameId);
    if (valid(game.ALL)) return { area: 'ALL', record: game.ALL };
    if (!defaultArea) return null;

    var key = Object.keys(game).filter(function (area) {
      return areaName(area) === defaultArea && valid(game[area]);
    })[0];
    return key ? { area: key, record: game[key] } : null;
  }

  /** Aantal gebieden waar je alles juist had; `skip` laat er één buiten beschouwing. */
  function perfectAreas(gameId, skip) {
    var game = forGame(gameId);
    return Object.keys(game).filter(function (area) {
      return area !== 'ALL' && area !== skip && isPerfect(game[area]);
    }).length;
  }

  window.ARGScores = {
    get: get,
    forGame: forGame,
    save: save,
    percent: percent,
    isPerfect: isPerfect,
    areaName: areaName,
    main: main,
    perfectAreas: perfectAreas
  };
})();
