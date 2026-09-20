/**
 * Denemarken (regio's) — de vijf regio's.
 *
 * Het kleinste spel van de reeks: sinds de hervorming van 2007 heeft Denemarken nog vijf
 * regio's, waar vroeger veertien amter lagen. Bornholm, het eiland tegen Zweden aan, hoort
 * bij Hovedstaden — de regio rond Kopenhagen.
 *
 * Groenland en de Faeröer horen bij het koninkrijk maar niet bij deze indeling, en zitten
 * er dus niet in. Dat scheelt een kaart van de halve Noord-Atlantische Oceaan.
 *
 * Bron: de NUTS-indeling van Eurostat, die voor Denemarken samenvalt met de regio's. Eén
 * pan-Europees bestand, dus één download voor alle spellen die eruit komen; prepare()
 * houdt enkel dit land over.
 */

export default {
  id: 'dk-regios',
  country: 'Denemarken',
  regionType: "regio's",
  region: { one: 'regio', many: "regio's" },
  idLabel: 'NUTS-code',

  languages: [{ code: 'da', label: 'Deens' }],

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
      if (p.CNTR_CODE !== 'DK') return null;
      return { id: p.NUTS_ID, names: { da: p.NAME_LATN }, groups: [] };
    },
  },
};
