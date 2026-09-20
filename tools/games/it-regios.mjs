/**
 * Italië (regio's) — de 20 regio's, met Nederlandse en Italiaanse namen.
 *
 * Afgeleid spel: het gebruikt dezelfde brondata als it-provincies en laat mapshaper de
 * provinciegrenzen binnen elke regio wegsmelten (build.dissolve).
 *
 * Vijf regio's hebben een bijzonder statuut omdat ze anderstalig of een eiland zijn:
 * Valle d'Aosta, Trentino-Zuid-Tirol, Friuli-Venezia Giulia, Sicilië en Sardinië.
 */

import { REGIONE_NL, LANDSDEEL_IT_NL } from '../lib/nederlandse-namen.mjs';

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'it-regios',
  country: 'Italië',
  regionType: "regio's",
  region: { one: 'regio', many: "regio's" },
  idLabel: 'ISTAT-code',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'it', label: 'Italiaans' },
  ],

  levels: [
    {
      one: 'Landsdeel',
      many: 'Landsdelen',
      order: ['Noordwest-Italië', 'Noordoost-Italië', 'Midden-Italië', 'Zuid-Italië', 'Eilanden'],
    },
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
    cache: 'it-provincia',   // zelfde download als it-provincies
    dissolve: true,
    simplify: '20%',         // grote vormen: meer detail levert niets zichtbaars op
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      const italiaans = first(p.reg_name);
      return {
        id: first(p.reg_code),
        names: { nl: REGIONE_NL[italiaans], it: italiaans },
        groups: [LANDSDEEL_IT_NL[first(p.rip_name)]],
      };
    },
  },
};
