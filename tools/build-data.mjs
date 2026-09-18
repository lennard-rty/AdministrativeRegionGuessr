/**
 * Bouwt de speldata: data/<spel-id>.js (de grenzen) en data/games.js (de catalogus
 * die het startscherm vult).
 *
 * Gebruik:
 *   node tools/build-data.mjs                  toont welke spellen er zijn
 *   node tools/build-data.mjs be-gemeenten     bouwt één spel
 *   node tools/build-data.mjs --all            bouwt alle spellen
 *   node tools/build-data.mjs --catalog        herschrijft enkel data/games.js
 *
 * Opties:
 *   --simplify 30%   fijnere grenzen dan het spel zelf voorschrijft (groter bestand)
 *   --raw <pad>      een reeds gedownload bronbestand gebruiken
 *   --fresh          de gecachete download negeren en opnieuw ophalen
 *
 * Een spel toevoegen = één bestand in tools/games/ zetten en dit script draaien.
 * Zie README.md ("Een spel toevoegen") voor de velden van zo'n bestand.
 *
 * Vereist Node.js en internet (voor de download en voor `npx mapshaper`). Het spel
 * zelf blijft daarna een map met statische bestanden, zonder build-stap.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GAMES_DIR = join(ROOT, 'tools', 'games');
const DATA_DIR = join(ROOT, 'data');
const CATALOG = join(DATA_DIR, 'games.js');
const CACHE_DIR = join(tmpdir(), 'arg-brondata');
const MAPSHAPER = 'mapshaper@0.6.102';

// mapshaper krijgt platte tekstvelden toegeschoven; namen en gebiedsniveaus worden er
// achteraf weer uit opgebouwd. Geneste properties overleven de omweg via mapshaper niet.
const F_ID = 'gg_id';
const F_NAME = 'gg_n_';    // + taalcode
const F_GROUP = 'gg_g';    // + niveau-index
const F_X = 'gg_x';
const F_Y = 'gg_y';

// ---------- argumenten ----------

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const targets = args.filter(
  (a, i) => !a.startsWith('--') && args[i - 1] !== '--simplify' && args[i - 1] !== '--raw'
);

// ---------- spelconfiguraties ----------

async function loadConfigs() {
  const files = readdirSync(GAMES_DIR).filter((f) => f.endsWith('.mjs')).sort();
  const configs = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(join(GAMES_DIR, file)).href);
    const config = mod.default;
    if (!config || !config.id) throw new Error(`tools/games/${file} exporteert geen spel met een id`);
    if (config.id !== file.replace(/\.mjs$/, '')) {
      throw new Error(`tools/games/${file}: id "${config.id}" past niet bij de bestandsnaam`);
    }
    configs.push(config);
  }
  return configs;
}

const title = (config) => `${config.country} (${config.regionType})`;

// ---------- bronbestand ----------

async function download(url, dest) {
  process.stdout.write('  brondata downloaden ...\n');
  const res = await fetch(url, { headers: { 'user-agent': 'AdministrativeRegionGuessr/build-data' } });
  if (!res.ok) throw new Error(`download mislukt: HTTP ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, body);
  process.stdout.write(`  ${dest} (${(body.length / 1048576).toFixed(1)} MB)\n`);
}

async function rawFile(config) {
  const override = option('--raw', null);
  if (override) {
    if (!existsSync(override)) throw new Error(`bronbestand niet gevonden: ${override}`);
    process.stdout.write(`  bronbestand: ${override}\n`);
    return override;
  }
  const cached = join(CACHE_DIR, `${config.build.cache || config.id}.geojson`);
  if (existsSync(cached) && !flag('--fresh')) {
    process.stdout.write(`  gecachete brondata hergebruikt: ${cached}\n`);
    return cached;
  }
  await download(config.build.url, cached);
  return cached;
}

// ---------- mapshaper ----------

function run(cmd, cmdArgs) {
  // shell:true is nodig om npx op Windows te starten, en die shell krijgt de
  // argumenten ongewijzigd. Vandaar: paden tussen aanhalingstekens, en verder geen
  // enkel argument met een spatie of een shell-teken erin.
  const res = spawnSync(cmd, cmdArgs, { shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
  if (res.status !== 0) throw new Error(`${cmd} faalde:\n${res.stderr?.toString() ?? ''}`);
  return res.stdout.toString();
}

function mapshaper(inPath, outPath, config, simplify, fields) {
  const cmd = ['--yes', MAPSHAPER, `"${inPath}"`];

  if (config.build.dissolve) {
    // Afgeleid spel: de bron beschrijft kleinere regio's, die hier per doelregio
    // samengevoegd worden (binnengrenzen verdwijnen, buitengrenzen blijven exact).
    const copy = fields.filter((f) => f !== F_ID);
    cmd.push('-dissolve2', F_ID, `copy-fields=${copy.join(',')}`);
  }
  (config.build.mapshaper || []).forEach((extra) => cmd.push(...extra));

  cmd.push('-simplify', simplify, 'keep-shapes');
  // Na het vereenvoudigen: een punt dat gegarandeerd binnen de vorm ligt, voor het
  // kaartlabel. Twee aparte -each commando's, zodat geen argument een komma bevat.
  cmd.push('-each', `${F_X}=this.innerX`);
  cmd.push('-each', `${F_Y}=this.innerY`);
  cmd.push('-o', `"${outPath}"`, 'precision=0.00001', 'force');

  run('npx', cmd);
}

// ---------- omzetten ----------

/** Bronvelden -> platte velden die mapshaper ongeschonden doorgeeft. */
function flatten(feature, config, langs) {
  const mapped = config.build.prepare(feature.properties, feature);
  if (!mapped) return null;

  const props = { [F_ID]: String(mapped.id) };
  langs.forEach((code) => {
    props[F_NAME + code] = mapped.names[code] || mapped.names[langs[0]] || '';
  });
  (config.levels || []).forEach((_, i) => {
    props[F_GROUP + i] = (mapped.groups || [])[i] || '';
  });
  return { type: 'Feature', properties: props, geometry: feature.geometry };
}

/** Platte velden -> de vorm die het spel in de browser leest. */
function unflatten(feature, config, langs) {
  const p = feature.properties;
  const names = {};
  langs.forEach((code) => { names[code] = p[F_NAME + code]; });

  const groups = [];
  (config.levels || []).forEach((_, i) => {
    if (p[F_GROUP + i]) groups[i] = p[F_GROUP + i];
  });

  const round = (v) => Number(Number(v).toFixed(5));
  return {
    type: 'Feature',
    properties: {
      id: p[F_ID],
      names,
      groups,
      c: [round(p[F_X]), round(p[F_Y])],
    },
    geometry: feature.geometry,
  };
}

function check(features, config, langs) {
  const primary = langs[0];
  const seen = new Set();
  features.forEach((f) => {
    const p = f.properties;
    if (!p.id) throw new Error('een regio zonder code');
    if (seen.has(p.id)) throw new Error(`code ${p.id} komt twee keer voor`);
    seen.add(p.id);
    if (!p.names[primary]) throw new Error(`regio ${p.id} heeft geen naam`);
    if (!f.geometry) throw new Error(`regio ${p.names[primary]} heeft geen vorm`);
    if (!Number.isFinite(p.c[0]) || !Number.isFinite(p.c[1])) {
      throw new Error(`regio ${p.names[primary]} heeft geen middelpunt`);
    }
    if ((config.levels || []).length && !p.groups[0]) {
      throw new Error(`regio ${p.names[primary]} valt buiten elk(e) ${config.levels[0].one}`);
    }
  });
}

// ---------- wegschrijven ----------

function buildGame(config, rawPath) {
  const langs = config.languages.map((l) => l.code);
  const simplify = option('--simplify', config.build.simplify || '15%');
  const work = join(CACHE_DIR, 'werk');
  mkdirSync(work, { recursive: true });
  const flatPath = join(work, `${config.id}-in.geojson`);
  const outPath = join(work, `${config.id}-uit.geojson`);

  const raw = JSON.parse(readFileSync(rawPath, 'utf8'));
  const prepared = raw.features.map((f) => flatten(f, config, langs)).filter(Boolean);
  if (!prepared.length) throw new Error('de bron leverde geen bruikbare regio\'s op');
  const fields = Object.keys(prepared[0].properties);
  writeFileSync(flatPath, JSON.stringify({ type: 'FeatureCollection', features: prepared }));

  process.stdout.write(`  vereenvoudigen met mapshaper (${simplify}, topologie-behoudend) ...\n`);
  mapshaper(flatPath, outPath, config, simplify, fields);

  const out = JSON.parse(readFileSync(outPath, 'utf8'));
  const features = out.features
    .map((f) => unflatten(f, config, langs))
    .sort((a, b) => a.properties.names[langs[0]].localeCompare(b.properties.names[langs[0]], 'nl'));
  check(features, config, langs);

  const meta = {
    count: features.length,
    year: typeof config.build.year === 'function' ? config.build.year(raw) : config.build.year || null,
    generated: new Date().toISOString().slice(0, 10),
    simplify,
    source: config.source,
  };

  const dest = join(DATA_DIR, `${config.id}.js`);
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(
    dest,
    '// Automatisch gegenereerd door tools/build-data.mjs — niet met de hand bewerken.\n' +
      'window.ARG_DATA = window.ARG_DATA || {};\n' +
      `window.ARG_DATA[${JSON.stringify(config.id)}] = {\n` +
      `  "meta": ${JSON.stringify(meta, null, 2).replace(/\n/g, '\n  ')},\n` +
      `  "geo": ${JSON.stringify({ type: 'FeatureCollection', features })}\n` +
      '};\n',
    'utf8'
  );

  const mb = (readFileSync(dest).length / 1048576).toFixed(2);
  process.stdout.write(`  klaar: data/${config.id}.js — ${features.length} regio's, ${mb} MB\n`);
  return meta;
}

/** Leest de vorige catalogus, zodat spellen die nu niet gebouwd worden hun cijfers houden. */
function previousCatalog() {
  if (!existsSync(CATALOG)) return {};
  const fake = {};
  try {
    new Function('window', readFileSync(CATALOG, 'utf8'))(fake);
  } catch (e) {
    return {};
  }
  const map = {};
  (fake.ARG_GAMES || []).forEach((entry) => { map[entry.id] = entry; });
  return map;
}

function writeCatalog(configs, fresh) {
  const previous = previousCatalog();
  const entries = [];
  const missing = [];

  configs.forEach((config) => {
    if (!existsSync(join(DATA_DIR, `${config.id}.js`))) {
      missing.push(config.id);
      return;
    }
    const meta = fresh[config.id] || previous[config.id] || {};
    entries.push({
      id: config.id,
      country: config.country,
      regionType: config.regionType,
      region: config.region,
      idLabel: config.idLabel || null,
      languages: config.languages,
      levels: (config.levels || []).map((l) => ({ one: l.one, many: l.many, order: l.order || null })),
      file: `data/${config.id}.js`,
      count: meta.count || null,
      year: meta.year || null,
      generated: meta.generated || null,
      source: config.source,
    });
  });

  entries.sort(
    (a, b) => a.country.localeCompare(b.country, 'nl') || a.regionType.localeCompare(b.regionType, 'nl')
  );

  writeFileSync(
    CATALOG,
    '// Automatisch gegenereerd door tools/build-data.mjs — niet met de hand bewerken.\n' +
      '// De spellen zelf staan beschreven in tools/games/; hier staat enkel wat het\n' +
      '// startscherm en het spelpaneel nodig hebben.\n' +
      `window.ARG_GAMES = ${JSON.stringify(entries, null, 2)};\n`,
    'utf8'
  );
  process.stdout.write(`\nCatalogus: data/games.js — ${entries.length} spel(len)\n`);
  entries.forEach((e) => process.stdout.write(`  ${e.country} (${e.regionType}) — ${e.count} regio's\n`));
  missing.forEach((id) =>
    process.stdout.write(`  (${id} heeft nog geen data — draai: node tools/build-data.mjs ${id})\n`));
}

// ---------- hoofdprogramma ----------

const main = async () => {
  const configs = await loadConfigs();

  if (flag('--catalog')) {
    writeCatalog(configs, {});
    return;
  }

  let wanted;
  if (flag('--all')) {
    wanted = configs;
  } else if (targets.length) {
    wanted = targets.map((id) => {
      const config = configs.find((c) => c.id === id);
      if (!config) throw new Error(`onbekend spel: ${id}`);
      return config;
    });
  } else {
    process.stdout.write('Beschikbare spellen:\n');
    configs.forEach((c) => process.stdout.write(`  ${c.id.padEnd(16)} ${title(c)}\n`));
    process.stdout.write('\nGebruik: node tools/build-data.mjs <spel-id> | --all | --catalog\n');
    return;
  }

  const fresh = {};
  for (const config of wanted) {
    process.stdout.write(`\n${title(config)} [${config.id}]\n`);
    fresh[config.id] = buildGame(config, await rawFile(config));
  }
  writeCatalog(configs, fresh);
};

main().catch((err) => {
  console.error('\nFout:', err.message);
  process.exit(1);
});
