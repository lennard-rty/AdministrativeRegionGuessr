/**
 * Indonesië (provincies) — de 38 provincies, met Nederlandse en Indonesische namen.
 *
 * Sinds 2022 telt Indonesië er 38: Papoea werd in vier gesplitst (Papoea, Zuid-Papoea,
 * Centraal-Papoea en Papoea-Gebergte) en West-Papoea in twee (West-Papoea en
 * Zuidwest-Papoea). Geen enkele vrije bron heeft die nieuwe grenzen al, maar ze volgen
 * exact die van de regentschappen (kabupaten en kota) en die zijn er wel. Dit spel
 * bouwt de provincies daarom op uit de 514 regentschappen van het statistiekbureau (BPS,
 * 2020): elk regentschap krijgt zijn provincie, en mapshaper smelt ze samen. De bron telt
 * er 519: vier meren en een bosgebied staan er als eigen eenheid in, en smelten gewoon mee
 * met de provincie waarin ze liggen.
 *
 * Nagerekend: per provincie komt het aantal regentschappen overeen met de officiële
 * telling (Atjeh 23, Oost-Java 38, Zuid-Papoea 4, ...).
 *
 * Die bron zegt niet in welke provincie een regentschap ligt. Dat komt uit de 34
 * provincies van 2017 (geoBoundaries, een tweede download): een steekproef van punten op
 * de rand van elk regentschap stemt voor de provincie waarin het ligt. Voor de zes
 * Papoea-provincies beslist daarna de lijst hieronder, op de naam van het regentschap.
 *
 * Als gebiedskeuze de zeven eilandengroepen. Zuidwest-Papoea en Papoea delen er één
 * met West-Papoea: het westelijk deel van Nieuw-Guinea.
 */

import { INDONESIE_NL } from '../lib/nederlandse-namen.mjs';

const SUMATRA = 'Sumatra';
const JAVA = 'Java';
const SOENDA = 'Kleine Soenda-eilanden';
const KALIMANTAN = 'Kalimantan';
const SULAWESI = 'Sulawesi';
const MOLUKKEN = 'Molukse eilanden';
const NIEUW_GUINEA = 'Westelijk Nieuw-Guinea';

/** Code -> [Indonesische naam, eilandengroep]. */
const PROVINCIE = {
  'ID-AC': ['Aceh', SUMATRA],
  'ID-SU': ['Sumatera Utara', SUMATRA],
  'ID-SB': ['Sumatera Barat', SUMATRA],
  'ID-RI': ['Riau', SUMATRA],
  'ID-KR': ['Kepulauan Riau', SUMATRA],
  'ID-JA': ['Jambi', SUMATRA],
  'ID-BE': ['Bengkulu', SUMATRA],
  'ID-SS': ['Sumatera Selatan', SUMATRA],
  'ID-BB': ['Kepulauan Bangka Belitung', SUMATRA],
  'ID-LA': ['Lampung', SUMATRA],
  'ID-BT': ['Banten', JAVA],
  'ID-JK': ['Jakarta', JAVA],
  'ID-JB': ['Jawa Barat', JAVA],
  'ID-JT': ['Jawa Tengah', JAVA],
  'ID-YO': ['Yogyakarta', JAVA],
  'ID-JI': ['Jawa Timur', JAVA],
  'ID-BA': ['Bali', SOENDA],
  'ID-NB': ['Nusa Tenggara Barat', SOENDA],
  'ID-NT': ['Nusa Tenggara Timur', SOENDA],
  'ID-KB': ['Kalimantan Barat', KALIMANTAN],
  'ID-KT': ['Kalimantan Tengah', KALIMANTAN],
  'ID-KS': ['Kalimantan Selatan', KALIMANTAN],
  'ID-KI': ['Kalimantan Timur', KALIMANTAN],
  'ID-KU': ['Kalimantan Utara', KALIMANTAN],
  'ID-SA': ['Sulawesi Utara', SULAWESI],
  'ID-GO': ['Gorontalo', SULAWESI],
  'ID-ST': ['Sulawesi Tengah', SULAWESI],
  'ID-SR': ['Sulawesi Barat', SULAWESI],
  'ID-SN': ['Sulawesi Selatan', SULAWESI],
  'ID-SG': ['Sulawesi Tenggara', SULAWESI],
  'ID-MA': ['Maluku', MOLUKKEN],
  'ID-MU': ['Maluku Utara', MOLUKKEN],
  'ID-PA': ['Papua', NIEUW_GUINEA],
  'ID-PB': ['Papua Barat', NIEUW_GUINEA],
  'ID-PS': ['Papua Selatan', NIEUW_GUINEA],
  'ID-PT': ['Papua Tengah', NIEUW_GUINEA],
  'ID-PE': ['Papua Pegunungan', NIEUW_GUINEA],
  'ID-PD': ['Papua Barat Daya', NIEUW_GUINEA],
};

/**
 * De regentschappen van de vier provincies die in 2022 uit Papoea en West-Papoea gesneden
 * werden. Wat van die twee overblijft, blijft Papoea en West-Papoea.
 */
const NIEUWE_PROVINCIE = {
  'ID-PS': ['Merauke', 'Boven Digoel', 'Mappi', 'Asmat'],
  'ID-PT': ['Nabire', 'Puncak Jaya', 'Paniai', 'Mimika', 'Puncak', 'Dogiyai', 'Intan Jaya', 'Deiyai'],
  'ID-PE': [
    'Jayawijaya', 'Pegunungan Bintang', 'Yahukimo', 'Tolikara', 'Mamberamo Tengah', 'Yalimo',
    'Lanny Jaya', 'Nduga',
  ],
  'ID-PD': ['Sorong', 'Kota Sorong', 'Sorong Selatan', 'Raja Ampat', 'Tambrauw', 'Maybrat'],
};

const OUD_PAPOEA = ['ID-PA', 'ID-PB'];

// ---------- in welke provincie ligt een regentschap ----------

function rings(geometry) {
  return geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
}

function bbox(geometry) {
  const box = [Infinity, Infinity, -Infinity, -Infinity];
  rings(geometry).forEach((polygon) => polygon[0].forEach(([x, y]) => {
    box[0] = Math.min(box[0], x); box[1] = Math.min(box[1], y);
    box[2] = Math.max(box[2], x); box[3] = Math.max(box[3], y);
  }));
  return box;
}

function contains(geometry, [x, y]) {
  return rings(geometry).some((polygon) => {
    let inside = false;
    polygon.forEach((ring) => {
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i];
        const [xj, yj] = ring[j];
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
    });
    return inside;
  });
}

/**
 * Punten binnenin een regentschap: een raster van 15 bij 15 over zijn omtrek, waarvan
 * enkel wat erbinnen valt telt. Punten op de rand zouden slechte kiezers zijn: de helft
 * ligt op de provinciegrens, en daar zijn de twee bronnen het net niet eens. Een eilandje
 * dat tussen de rasterpunten door glipt, stemt met zijn randpunten.
 */
function samplePoints(geometry) {
  const [x0, y0, x1, y1] = bbox(geometry);
  const inner = [];
  for (let i = 0.5; i < 15; i++) {
    for (let j = 0.5; j < 15; j++) {
      const pt = [x0 + ((x1 - x0) * i) / 15, y0 + ((y1 - y0) * j) / 15];
      if (contains(geometry, pt)) inner.push(pt);
    }
  }
  if (inner.length) return inner;
  const edge = [];
  rings(geometry).forEach((polygon) => polygon[0].forEach((pt) => edge.push(pt)));
  const step = Math.max(1, Math.floor(edge.length / 80));
  return edge.filter((_, i) => i % step === 0);
}

/**
 * Elk steekproefpunt stemt voor de provincie die het bevat. Punten op zee (de kustlijn
 * van de twee bronnen valt niet samen) stemmen niet. Stemt er geen enkel, dan wint de
 * provincie met het dichtste middelpunt — dat gebeurt enkel bij eilandjes.
 */
function provinceOf(geometry, provinces) {
  const votes = {};
  samplePoints(geometry).forEach((pt) => {
    const hit = provinces.find((p) =>
      pt[0] >= p.box[0] && pt[0] <= p.box[2] && pt[1] >= p.box[1] && pt[1] <= p.box[3] &&
      contains(p.geometry, pt));
    if (hit) votes[hit.code] = (votes[hit.code] || 0) + 1;
  });
  const ranked = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  if (ranked.length) return ranked[0][0];

  const [x0, y0, x1, y1] = bbox(geometry);
  const mid = [(x0 + x1) / 2, (y0 + y1) / 2];
  const dist = (p) => ((p.box[0] + p.box[2]) / 2 - mid[0]) ** 2 + ((p.box[1] + p.box[3]) / 2 - mid[1]) ** 2;
  return provinces.slice().sort((a, b) => dist(a) - dist(b))[0].code;
}

export default {
  id: 'id-provincies',
  country: 'Indonesië',
  regionType: 'provincies',
  region: { one: 'provincie', many: 'provincies' },
  idLabel: 'Provinciecode',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'id', label: 'Indonesisch' },
  ],

  levels: [
    {
      one: 'Eilandengroep',
      many: 'Eilandengroepen',
      order: [SUMATRA, JAVA, SOENDA, KALIMANTAN, SULAWESI, MOLUKKEN, NIEUW_GUINEA],
    },
  ],

  source: {
    credit: 'BPS / geoBoundaries',
    name: 'geoBoundaries gbOpen IDN ADM2 (BPS, WFP, OCHA ROAP), samengesmolten tot provincies',
    url: 'https://www.geoboundaries.org/',
    license: 'CC BY 3.0 IGO — bronvermelding vereist',
  },

  build: {
    url:
      'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IDN/ADM2/' +
      'geoBoundaries-IDN-ADM2.geojson',
    cache: 'id-kabupaten',
    extra: {
      // Enkel om te weten welk regentschap in welke provincie ligt; de vereenvoudigde
      // versie volstaat daarvoor en rekent veel sneller.
      provinsi: {
        url:
          'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IDN/ADM1/' +
          'geoBoundaries-IDN-ADM1_simplified.geojson',
        cache: 'id-provinsi-2017',
      },
    },
    dissolve: true,
    // De bron is zeer gedetailleerd (159 MB): 17.000 eilanden en elke mangrove.
    simplify: '1%',
    year: '2022',   // de regentschappen zijn van 2020, de provinciegrenzen van 2022
    regions({ raw, extra }) {
      const provinces = extra.provinsi.features.map((f) => ({
        code: f.properties.shapeISO,
        geometry: f.geometry,
        box: bbox(f.geometry),
      }));
      provinces.forEach((p) => {
        if (!PROVINCIE[p.code]) throw new Error(`onbekende provincie in de bron: ${p.code}`);
      });

      const nieuw = {};
      Object.entries(NIEUWE_PROVINCIE).forEach(([code, names]) => names.forEach((n) => { nieuw[n] = code; }));
      const found = new Set();

      return raw.features.map((f) => {
        const name = f.properties.shapeName;
        let code = provinceOf(f.geometry, provinces);
        if (OUD_PAPOEA.includes(code) && nieuw[name]) {
          code = nieuw[name];
          found.add(name);
        }
        const [indonesisch, groep] = PROVINCIE[code];
        return {
          id: code,
          names: { nl: INDONESIE_NL[code], id: indonesisch },
          groups: [groep],
          geometry: f.geometry,
          kabupaten: name,
        };
      }).concat(
        // Een regentschap uit de lijst dat niet in Papoea gevonden werd, is een tikfout
        // of een verkeerd toegewezen regentschap — beide maken een provincie te klein.
        Object.keys(nieuw).filter((n) => !found.has(n)).map((n) => {
          throw new Error(`regentschap ${n} niet gevonden in Papoea of West-Papoea`);
        })
      );
    },
  },
};
