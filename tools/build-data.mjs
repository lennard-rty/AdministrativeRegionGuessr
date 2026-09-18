/**
 * Bouwt data/gemeenten.js op basis van de Statbel-gemeentegrenzen (via Opendatasoft).
 *
 * Gebruik:  node tools/build-data.mjs [--simplify 15%] [--raw <pad naar reeds gedownloade geojson>]
 *
 * Vereist internet (voor de download en voor `npx mapshaper`).
 * De ruwe download (~19 MB) belandt in de tijdelijke map van het systeem, niet in dit project.
 */

import { writeFileSync, readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_URL =
  'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
  'georef-belgium-municipality/exports/geojson?lang=nl&timezone=Europe%2FBrussels';
const MAPSHAPER = 'mapshaper@0.6.102';

const args = process.argv.slice(2);
const argValue = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const simplify = argValue('--simplify', '15%');
const work = mkdtempSync(join(tmpdir(), 'gemeenten-'));
const rawPath = argValue('--raw', join(work, 'raw.geojson'));
const simplePath = join(work, 'simple.geojson');

async function download(url, dest) {
  process.stdout.write(`Downloaden van brondata ...\n`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download mislukt: HTTP ${res.status}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  process.stdout.write(`  ${dest} (${(readFileSync(dest).length / 1048576).toFixed(1)} MB)\n`);
}

function run(cmd, cmdArgs) {
  const res = spawnSync(cmd, cmdArgs, { shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
  if (res.status !== 0) {
    throw new Error(`${cmd} faalde:\n${res.stderr?.toString() ?? ''}`);
  }
  return res.stdout.toString();
}

/** Bewaart per gemeente alleen wat het spel nodig heeft. */
function slim(feature) {
  const p = feature.properties;
  const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;
  const region = first(p.reg_name_nl);
  const province = first(p.prov_name_nl) || region; // Brussel heeft geen provincie
  return {
    type: 'Feature',
    properties: {
      id: first(p.mun_code),
      nl: first(p.mun_name_nl),
      fr: first(p.mun_name_fr),
      de: first(p.mun_name_de),
      reg: region,
      prov: province,
      c: [
        Number(p.geo_point_2d.lon.toFixed(5)),
        Number(p.geo_point_2d.lat.toFixed(5)),
      ],
    },
    geometry: feature.geometry,
  };
}

const main = async () => {
  if (!existsSync(rawPath)) await download(SOURCE_URL, rawPath);
  else process.stdout.write(`Bestaande brondata hergebruikt: ${rawPath}\n`);

  process.stdout.write(`Vereenvoudigen met mapshaper (${simplify}, topologie-behoudend) ...\n`);
  run('npx', [
    '--yes', MAPSHAPER, rawPath,
    '-simplify', simplify, 'keep-shapes',
    '-o', simplePath, 'precision=0.00001', 'force',
  ]);

  const fc = JSON.parse(readFileSync(simplePath, 'utf8'));
  const features = fc.features
    .map(slim)
    .sort((a, b) => a.properties.nl.localeCompare(b.properties.nl, 'nl'));

  const missing = features.filter((f) => !f.properties.id || !f.properties.nl);
  if (missing.length) throw new Error(`${missing.length} gemeenten zonder naam of NIS-code`);

  const payload = {
    type: 'FeatureCollection',
    features,
  };
  const meta = {
    generated: new Date().toISOString().slice(0, 10),
    year: fc.features[0]?.properties?.year ?? 'onbekend',
    count: features.length,
    simplify,
    source: 'Statbel / Opendatasoft "georef-belgium-municipality"',
    sourceUrl: 'https://public.opendatasoft.com/explore/dataset/georef-belgium-municipality/',
    license: 'Open data Statbel (FOD Economie) — bronvermelding vereist',
  };

  const out = join(ROOT, 'data', 'gemeenten.js');
  writeFileSync(
    out,
    '// Automatisch gegenereerd door tools/build-data.mjs — niet met de hand bewerken.\n' +
      `window.GEMEENTEN_META = ${JSON.stringify(meta, null, 2)};\n` +
      `window.GEMEENTEN = ${JSON.stringify(payload)};\n`,
    'utf8'
  );

  const mb = (readFileSync(out).length / 1048576).toFixed(2);
  process.stdout.write(`\nKlaar: data/gemeenten.js — ${features.length} gemeenten, ${mb} MB (jaargang ${meta.year})\n`);
};

main().catch((err) => {
  console.error('\nFout:', err.message);
  process.exit(1);
});
