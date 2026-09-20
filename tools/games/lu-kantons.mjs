/**
 * Luxemburg (kantons) — de twaalf kantons.
 *
 * Afgeleid spel: het gebruikt dezelfde brondata als lu-gemeenten en laat mapshaper de
 * gemeentegrenzen binnen elk kanton wegsmelten (build.dissolve).
 *
 * Het kanton heeft in Luxemburg geen eigen bestuur meer, maar het is wel de indeling
 * waarin het land zichzelf beschrijft — en de eerste twee cijfers van elke gemeentecode
 * verwijzen er nog altijd naar. Vandaar dat die hier als id dienen.
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'lu-kantons',
  country: 'Luxemburg',
  regionType: 'kantons',
  region: { one: 'kanton', many: 'kantons' },
  idLabel: 'Kantonnummer',

  languages: [{ code: 'fr', label: 'Frans' }],

  levels: [],

  source: {
    credit: 'ACT / data.public.lu',
    name: 'Limites administratives du Grand-Duché de Luxembourg (Administration du cadastre et de la topographie)',
    url: 'https://data.public.lu/en/datasets/limites-administratives-du-grand-duche-de-luxembourg/',
    license: 'CC0 — vrij te gebruiken',
  },

  build: {
    url:
      'https://download.data.public.lu/resources/' +
      'limites-administratives-du-grand-duche-de-luxembourg/20231123-101528/communes4326.geojson',
    cache: 'lu-commune',   // zelfde download als lu-gemeenten
    dissolve: true,
    simplify: '40%',       // veel minder vormen, dus mag fijner
    year: '2023',
    prepare(p) {
      return {
        id: first(p.LAU2).slice(0, 2),
        names: { fr: first(p.CANTON) },
        groups: [],
      };
    },
  },
};
