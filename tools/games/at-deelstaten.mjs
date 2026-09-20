/**
 * Oostenrijk (deelstaten) — de negen Bundesländer, met Nederlandse en Duitse namen.
 *
 * Wenen is tegelijk deelstaat en gemeente, en ligt als enige helemaal binnen een andere
 * deelstaat: Neder-Oostenrijk sluit er rond.
 *
 * Bron: de NUTS-indeling van Eurostat, die voor Oostenrijk samenvalt met de deelstaten.
 * Eén pan-Europees bestand, dus één download voor alle spellen die eruit komen; prepare()
 * houdt enkel dit land over.
 */

import { OOSTENRIJK_NL } from '../lib/nederlandse-namen.mjs';

export default {
  id: 'at-deelstaten',
  country: 'Oostenrijk',
  regionType: 'deelstaten',
  region: { one: 'deelstaat', many: 'deelstaten' },
  idLabel: 'NUTS-code',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'de', label: 'Duits' },
  ],

  levels: [],

  source: {
    credit: 'Eurostat (GISCO) / © EuroGeographics',
    name: 'Eurostat GISCO, NUTS 2024 (1:1 miljoen) — grenzen © EuroGeographics',
    url: 'https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics',
    license: 'Vrij te gebruiken met bronvermelding — © EuroGeographics voor de grenzen',
  },

  build: {
    url:
      'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/' +
      'NUTS_RG_01M_2024_4326_LEVL_2.geojson',
    cache: 'gisco-nuts2',
    // De bron is al veralgemeend tot 1:1 miljoen; verder vereenvoudigen maakt er hoeken van.
    simplify: '100%',
    year: '2024',
    prepare(p) {
      if (p.CNTR_CODE !== 'AT') return null;
      return {
        id: p.NUTS_ID,
        names: { nl: OOSTENRIJK_NL[p.NUTS_ID] || p.NAME_LATN, de: p.NAME_LATN },
        groups: [],
      };
    },
  },
};
