/**
 * Polen (woiwodschappen) — de zestien woiwodschappen.
 *
 * Afgeleid spel: de bron splitst Mazovië in twee stukken, Warschau en de rest, omdat de
 * hoofdstad de streekcijfers scheeftrekt. Bestuurlijk is het één woiwodschap, dus krijgen
 * beide stukken dezelfde id en smelt mapshaper de grens ertussen weg (build.dissolve).
 *
 * De namen blijven Pools, in de bijvoeglijke vorm die het land zelf gebruikt:
 * Małopolskie, niet Klein-Polen.
 *
 * Bron: de NUTS-indeling van Eurostat. Eén pan-Europees bestand, dus één download voor
 * alle spellen die eruit komen; prepare() houdt enkel dit land over.
 */

export default {
  id: 'pl-woiwodschappen',
  country: 'Polen',
  regionType: 'woiwodschappen',
  region: { one: 'woiwodschap', many: 'woiwodschappen' },
  idLabel: 'NUTS-code',

  languages: [{ code: 'pl', label: 'Pools' }],

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
    dissolve: true,
    // De bron is al veralgemeend tot 1:1 miljoen; verder vereenvoudigen maakt er hoeken van.
    simplify: '100%',
    year: '2024',
    prepare(p) {
      if (p.CNTR_CODE !== 'PL') return null;
      const mazovie = p.NUTS_ID === 'PL91' || p.NUTS_ID === 'PL92';
      return {
        id: mazovie ? 'PL9' : p.NUTS_ID,
        names: { pl: mazovie ? 'Mazowieckie' : p.NAME_LATN },
        groups: [],
      };
    },
  },
};
