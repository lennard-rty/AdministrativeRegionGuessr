/** België (gemeenten) — 565 gemeenten, met gewest en provincie als gebiedskeuze. */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'be-gemeenten',
  country: 'België',
  regionType: 'gemeenten',
  region: { one: 'gemeente', many: 'gemeenten' },
  idLabel: 'NIS-code',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'fr', label: 'Frans' },
    { code: 'de', label: 'Duits' },
  ],

  levels: [
    {
      one: 'Gewest',
      many: 'Gewesten',
      order: ['Vlaams Gewest', 'Waals Gewest', 'Brussels Hoofdstedelijk Gewest'],
    },
    { one: 'Provincie', many: 'Provincies' },
  ],

  source: {
    credit: 'Statbel',
    name: 'Statbel (FOD Economie) via Opendatasoft "georef-belgium-municipality"',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-belgium-municipality/',
    license: 'Open data Statbel — bronvermelding vereist',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-belgium-municipality/exports/geojson?lang=nl&timezone=Europe%2FBrussels',
    cache: 'be-municipality',
    simplify: '15%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      const region = first(p.reg_name_nl);
      return {
        id: first(p.mun_code),
        names: {
          nl: first(p.mun_name_nl),
          fr: first(p.mun_name_fr),
          de: first(p.mun_name_de),
        },
        // Brussel heeft geen provincie: dan blijft het tweede niveau leeg.
        groups: [region, first(p.prov_name_nl) || ''],
      };
    },
  },
};
