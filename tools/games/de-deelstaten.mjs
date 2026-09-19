/**
 * Duitsland (deelstaten) — de zestien Bundesländer, met Nederlandse en Duitse namen.
 *
 * Klein spel, maar niet vanzelfsprekend: de drie stadstaten (Berlijn, Hamburg, Bremen)
 * zijn op een landkaart maar stipjes, en Bremen bestaat uit twee losse stukken.
 *
 * De bron kent enkel de Duitse naam; de Nederlandse komt uit tools/lib/duitse-deelstaten.mjs.
 */

import { DEELSTAAT_NL } from '../lib/duitse-deelstaten.mjs';

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'de-deelstaten',
  country: 'Duitsland',
  regionType: 'deelstaten',
  region: { one: 'deelstaat', many: 'deelstaten' },
  idLabel: 'Deelstaatcode',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'de', label: 'Duits' },
  ],

  levels: [],   // met zestien stukken valt er niets te filteren

  source: {
    credit: 'Destatis / Opendatasoft',
    name: 'Opendatasoft "georef-germany-land" (Statistisches Bundesamt)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-germany-land/',
    license: 'Datenlizenz Deutschland – Namensnennung 2.0',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-germany-land/exports/geojson?lang=de&timezone=Europe%2FBerlin',
    cache: 'de-land',
    simplify: '25%',   // weinig vormen, dus mag fijner
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      const code = first(p.lan_code);
      const duits = first(p.lan_name);
      return {
        id: code,
        names: { nl: DEELSTAAT_NL[code] || duits, de: duits },
        groups: [],
      };
    },
  },
};
