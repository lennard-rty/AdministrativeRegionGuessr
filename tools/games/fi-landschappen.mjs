/**
 * Finland (landschappen) — de negentien maakunnat.
 *
 * De namen blijven Fins. Veel landschappen hebben ook een Zweedse naam — Uusimaa is
 * Nyland, Varsinais-Suomi is Egentliga Finland — maar de bron geeft er één, en dat is de
 * Finse. Åland is Zweedstalig en autonoom, en telt hier als één landschap.
 *
 * Bron: de NUTS-indeling van Eurostat, die voor Finland samenvalt met de maakunnat. Eén
 * pan-Europees bestand, dus één download voor alle spellen die eruit komen; prepare()
 * houdt enkel dit land over.
 */

export default {
  id: 'fi-landschappen',
  country: 'Finland',
  regionType: 'landschappen',
  region: { one: 'landschap', many: 'landschappen' },
  idLabel: 'NUTS-code',

  languages: [{ code: 'fi', label: 'Fins' }],

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
    // De bron is al veralgemeend tot 1:1 miljoen, maar deze kust is grillig genoeg om nog
    // wat te kunnen missen.
    simplify: '70%',
    year: '2024',
    prepare(p) {
      if (p.CNTR_CODE !== 'FI') return null;
      return { id: p.NUTS_ID, names: { fi: p.NAME_LATN }, groups: [] };
    },
  },
};
