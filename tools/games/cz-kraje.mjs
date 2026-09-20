/**
 * Tsjechië (kraje) — de veertien regio's.
 *
 * De namen houden hun Tsjechische vorm, "kraj" incluis: Jihočeský kraj, Zlínský kraj.
 * Praag heet voluit Hlavní město Praha — de hoofdstad — en is tegelijk stad en kraj.
 *
 * Bron: de NUTS-indeling van Eurostat, die voor Tsjechië samenvalt met de kraje. Eén
 * pan-Europees bestand, dus één download voor alle spellen die eruit komen; prepare()
 * houdt enkel dit land over.
 */

export default {
  id: 'cz-kraje',
  country: 'Tsjechië',
  regionType: 'kraje',
  region: { one: 'kraj', many: 'kraje' },
  idLabel: 'NUTS-code',

  languages: [{ code: 'cs', label: 'Tsjechisch' }],

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
      'NUTS_RG_01M_2024_4326_LEVL_3.geojson',
    cache: 'gisco-nuts3',
    // De bron is al veralgemeend tot 1:1 miljoen; verder vereenvoudigen maakt er hoeken van.
    simplify: '100%',
    year: '2024',
    prepare(p) {
      if (p.CNTR_CODE !== 'CZ') return null;
      return { id: p.NUTS_ID, names: { cs: p.NAME_LATN }, groups: [] };
    },
  },
};
