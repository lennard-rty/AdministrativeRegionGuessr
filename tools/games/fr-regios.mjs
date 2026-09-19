/**
 * Frankrijk (regio's) — de 18 regio's, met Franse namen.
 *
 * Afgeleid spel: het gebruikt dezelfde brondata als fr-departementen en laat mapshaper de
 * departementsgrenzen binnen elke regio wegsmelten (build.dissolve), zodat beide spellen
 * exact dezelfde buitengrenzen tekenen.
 *
 * Vijf regio's liggen overzee en bestaan elk uit één departement (Guadeloupe, Martinique,
 * Guyane, La Réunion, Mayotte). Net als het departementenspel begint dit spel daarom in
 * Europees Frankrijk: heel Frankrijk in beeld is een wereldkaart.
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

const EUROPA = 'Europees Frankrijk';
const OVERZEE = "Overzeese regio's";

export default {
  id: 'fr-regios',
  country: 'Frankrijk',
  regionType: "regio's",
  region: { one: 'regio', many: "regio's" },
  idLabel: 'Regiocode',

  languages: [{ code: 'fr', label: 'Frans' }],

  levels: [{ one: 'Gebiedsdeel', many: 'Gebiedsdelen', order: [EUROPA, OVERZEE] }],

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
    cache: 'fr-departement',   // zelfde download als fr-departementen
    dissolve: true,
    simplify: '90%',           // bron is al veralgemeend, zie fr-departementen
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      // De acht collectivités d'outre-mer horen bij geen enkele regio.
      if (first(p.dep_type) !== 'département') return null;
      return {
        id: first(p.reg_code),
        names: { fr: first(p.reg_name) },
        groups: [/^97/.test(first(p.dep_code)) ? OVERZEE : EUROPA],
      };
    },
  },
};
