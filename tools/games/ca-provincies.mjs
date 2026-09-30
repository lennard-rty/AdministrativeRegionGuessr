/**
 * Canada (provincies) — de tien provincies en drie territoria, met Nederlandse, Engelse
 * en Franse namen.
 *
 * Met dertien stukken valt er niets te filteren. Wat het spel lastig maakt zit in het
 * noorden: de drie territoria delen de Arctische archipel, en de grens tussen de
 * Northwest Territories en Nunavut loopt dwars over de eilanden.
 */

import { CANADA_NL } from '../lib/nederlandse-namen.mjs';

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'ca-provincies',
  country: 'Canada',
  regionType: 'provincies',
  region: { one: 'provincie', many: 'provincies' },
  idLabel: 'Provinciecode',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'en', label: 'Engels' },
    { code: 'fr', label: 'Frans' },
  ],

  levels: [],

  source: {
    credit: 'Statistics Canada / Opendatasoft',
    name: 'Opendatasoft "georef-canada-province" (Statistics Canada)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-canada-province/',
    license: 'Statistics Canada Open Licence',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-canada-province/exports/geojson?lang=en&timezone=UTC',
    cache: 'ca-province',
    // De bron is al sterk veralgemeend (0,6 MB voor heel Canada); fijner dan de bron
    // kan niet, en grover laat van de Arctische eilanden enkel driehoeken over.
    simplify: '100%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      const code = first(p.prov_code);
      if (!CANADA_NL[code]) throw new Error(`onbekende provincie: ${code} (${first(p.prov_name_en)})`);
      return {
        id: code,
        names: { nl: CANADA_NL[code], en: first(p.prov_name_en), fr: first(p.prov_name_fr) },
        groups: [],
      };
    },
  },
};
