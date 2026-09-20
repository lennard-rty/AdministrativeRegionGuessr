/**
 * Luxemburg (gemeenten) — de 100 gemeenten, met het kanton als gebiedskeuze.
 *
 * Daarmee is de Benelux rond: dit is het derde land waarvan zowel de gemeenten als het
 * niveau erboven meespelen.
 *
 * De namen staan in de Franse vorm die de bron gebruikt (Esch-sur-Alzette, Redange). Het
 * Luxemburgs kent daarnaast eigen vormen — Esch-Uelzecht, Réiden — maar de bron geeft er
 * één, en dat is deze.
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'lu-gemeenten',
  country: 'Luxemburg',
  regionType: 'gemeenten',
  region: { one: 'gemeente', many: 'gemeenten' },
  idLabel: 'LAU-code',

  languages: [{ code: 'fr', label: 'Frans' }],

  levels: [{ one: 'Kanton', many: 'Kantons' }],

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
    cache: 'lu-commune',
    simplify: '25%',
    year: '2023',
    prepare(p) {
      return {
        id: first(p.LAU2),
        names: { fr: first(p.COMMUNE) },
        groups: [first(p.CANTON)],
      };
    },
  },
};
