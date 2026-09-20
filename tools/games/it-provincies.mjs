/**
 * Italië (provincies) — de 107 provincies, met landsdeel en regio als gebiedskeuze.
 *
 * "Provincie" is hier de verzamelnaam: er zitten ook veertien città metropolitane tussen
 * (Rome, Milaan, Napels ...) en de vrije gemeenteconsortia van Sicilië. Ze staan in de bron
 * op hetzelfde niveau en spelen dus gewoon mee.
 *
 * De namen blijven Italiaans — Firenze, Napoli, Torino. De regio's en landsdelen waarin je
 * kan spelen staan wel in het Nederlands.
 */

import { REGIONE_NL, LANDSDEEL_IT_NL } from '../lib/nederlandse-namen.mjs';

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'it-provincies',
  country: 'Italië',
  regionType: 'provincies',
  region: { one: 'provincie', many: 'provincies' },
  idLabel: 'ISTAT-code',

  languages: [{ code: 'it', label: 'Italiaans' }],

  levels: [
    {
      one: 'Landsdeel',
      many: 'Landsdelen',
      order: ['Noordwest-Italië', 'Noordoost-Italië', 'Midden-Italië', 'Zuid-Italië', 'Eilanden'],
    },
    { one: 'Regio', many: "Regio's" },
  ],

  source: {
    credit: 'ISTAT / Opendatasoft',
    name: 'Opendatasoft "georef-italy-provincia" (Istituto Nazionale di Statistica)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-italy-provincia/',
    license: 'CC BY 4.0 — bronvermelding vereist',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-italy-provincia/exports/geojson?lang=it&timezone=Europe%2FRome',
    cache: 'it-provincia',
    simplify: '20%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      return {
        id: first(p.prov_code),
        names: { it: first(p.prov_name) },
        groups: [LANDSDEEL_IT_NL[first(p.rip_name)], REGIONE_NL[first(p.reg_name)]],
      };
    },
  },
};
