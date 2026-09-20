/**
 * Ierland (graafschappen) — de 26 graafschappen van de Republiek, met de provincie als
 * gebiedskeuze en met Engelse en Ierse namen.
 *
 * De bron is die van de landmeetdienst en beschrijft de wettelijke grenzen van de
 * Republiek; de zes graafschappen van Noord-Ierland zitten er dus niet in. Wie de
 * traditionele 32 wil, speelt dit spel naast de Noord-Ierse districten in uk-counties.
 *
 * Ulster is hier dus maar het stuk dat in de Republiek ligt: Cavan, Donegal en Monaghan.
 *
 * De bron schrijft de Engelse namen in hoofdletters (DONEGAL); die zetten we terug naar
 * gewone spelling. De Ierse namen staan er al goed in.
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

/** DONEGAL -> Donegal. Alle 26 namen zijn één woord, dus dit volstaat. */
const kleinLetters = (naam) =>
  (naam || '').toLowerCase().replace(/(^|[\s-])([a-z])/g, (m, voor, letter) => voor + letter.toUpperCase());

export default {
  id: 'ie-graafschappen',
  country: 'Ierland',
  regionType: 'graafschappen',
  region: { one: 'graafschap', many: 'graafschappen' },
  idLabel: 'Graafschapscode',

  languages: [
    { code: 'en', label: 'Engels' },
    { code: 'ga', label: 'Iers' },
  ],

  levels: [
    { one: 'Provincie', many: 'Provincies', order: ['Leinster', 'Munster', 'Connacht', 'Ulster'] },
  ],

  source: {
    credit: 'Tailte Éireann',
    name: 'Tailte Éireann — Counties, National Statutory Boundaries (generalised 20 m)',
    url: 'https://data-osi.opendata.arcgis.com/',
    license: 'CC BY 4.0 — bronvermelding vereist',
  },

  build: {
    url:
      'https://services-eu1.arcgis.com/FH5XCsx8rYXqnjF5/arcgis/rest/services/' +
      'Counties___OSi_National_Statutory_Boundaries___Generalised_20m/FeatureServer/0/query' +
      '?where=1%3D1&outFields=CO_ID,ENGLISH,GAEILGE,PROVINCE&outSR=4326&f=geojson',
    cache: 'ie-county',
    simplify: '15%',
    year: '2019',
    prepare(p) {
      return {
        id: first(p.CO_ID),
        names: { en: kleinLetters(first(p.ENGLISH)), ga: first(p.GAEILGE) },
        groups: [first(p.PROVINCE)],
      };
    },
  },
};
