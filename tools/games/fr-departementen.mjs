/**
 * Frankrijk (departementen) — de 101 departementen, met Franse namen.
 *
 * De bron bevat ook de acht collectivités d'outre-mer (Nieuw-Caledonië, Frans-Polynesië,
 * Saint-Martin ...). Dat zijn geen departementen, dus die vallen weg in prepare().
 *
 * De vijf overzeese departementen liggen in de Cariben, Zuid-Amerika en de Indische
 * Oceaan. Ze doen mee, maar het spel begint in Europees Frankrijk: "heel Frankrijk" in
 * beeld brengen zou een wereldkaart opleveren waarop je niets kan aanduiden. Wie ze er
 * toch bij wil, kiest "Heel Frankrijk (101)" bij Gebied.
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

const EUROPA = 'Europees Frankrijk';
const OVERZEE = 'Overzeese departementen';

export default {
  id: 'fr-departementen',
  country: 'Frankrijk',
  regionType: 'departementen',
  region: { one: 'departement', many: 'departementen' },
  idLabel: 'Departementsnummer',

  // De namen blijven Frans — Ardennes, Côte-d'Or, Bouches-du-Rhône. Nederlandse
  // exoniemen bestaan er nauwelijks voor, en op de kaart staan ze ook in het Frans.
  languages: [{ code: 'fr', label: 'Frans' }],

  levels: [
    { one: 'Gebiedsdeel', many: 'Gebiedsdelen', order: [EUROPA, OVERZEE] },
    { one: 'Regio', many: "Regio's" },
  ],

  defaultArea: EUROPA,

  source: {
    credit: 'IGN / Opendatasoft',
    name: 'Opendatasoft "georef-france-departement" (grenzen van het IGN)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-france-departement/',
    license: 'Licence Ouverte / Open Licence 2.0 — bronvermelding vereist',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-france-departement/exports/geojson?lang=fr&timezone=Europe%2FParis',
    cache: 'fr-departement',
    // Deze bron is al veralgemeend (±260 punten per departement, tegenover ±850 per
    // Belgische gemeente), dus hier valt weinig meer weg te laten: 15% zou er hoekige
    // blokken van maken. 90% ruimt enkel overbodige punten op.
    simplify: '90%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      if (first(p.dep_type) !== 'département') return null;   // laat de collectivités weg
      const code = first(p.dep_code);
      return {
        id: code,
        names: { fr: first(p.dep_name) },
        groups: [/^97/.test(code) ? OVERZEE : EUROPA, first(p.reg_name)],
      };
    },
  },
};
