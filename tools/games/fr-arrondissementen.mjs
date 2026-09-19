/**
 * Frankrijk (arrondissementen) — de 333 arrondissements départementaux, het niveau
 * tussen departement en kanton. Elk arrondissement heet naar zijn hoofdplaats.
 *
 * Gebiedskeuze op drie niveaus: gebiedsdeel, regio (± 18 arrondissementen, een mooie
 * ronde) en departement (twee tot zes). Net als bij de departementen begint het spel in
 * Europees Frankrijk; dertien arrondissementen liggen overzee.
 *
 * Honderd departementen, niet 101: Mayotte is niet in arrondissementen verdeeld. Zeventien
 * regio's, niet 18, om dezelfde reden.
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

const EUROPA = 'Europees Frankrijk';
const OVERZEE = 'Overzeese departementen';

// Vier arrondissementen delen hun naam met een ander: Saint-Denis bestaat in
// Seine-Saint-Denis en op La Réunion, Saint-Pierre op Martinique en op La Réunion. Zonder
// toevoeging is zo'n vraag niet te beantwoorden, dus krijgen die vier hun departement
// erbij. De bouwer waarschuwt als de bron er ooit een paar bij krijgt.
const ONTDUBBEL = {
  '933': 'Saint-Denis (Seine-Saint-Denis)',
  '9741': 'Saint-Denis (La Réunion)',
  '9724': 'Saint-Pierre (Martinique)',
  '9742': 'Saint-Pierre (La Réunion)',
};

export default {
  id: 'fr-arrondissementen',
  country: 'Frankrijk',
  regionType: 'arrondissementen',
  region: { one: 'arrondissement', many: 'arrondissementen' },
  idLabel: 'Arrondissementsnummer',

  languages: [{ code: 'fr', label: 'Frans' }],

  levels: [
    { one: 'Gebiedsdeel', many: 'Gebiedsdelen', order: [EUROPA, OVERZEE] },
    { one: 'Regio', many: "Regio's" },
    { one: 'Departement', many: 'Departementen' },
  ],

  defaultArea: EUROPA,

  source: {
    credit: 'IGN / Opendatasoft',
    name: 'Opendatasoft "georef-france-arrondissement-departemental" (grenzen van het IGN)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-france-arrondissement-departemental/',
    license: 'Licence Ouverte / Open Licence 2.0 — bronvermelding vereist',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-france-arrondissement-departemental/exports/geojson?lang=fr&timezone=Europe%2FParis',
    cache: 'fr-arrondissement',
    // Anders dan het departementenbestand (1,1 MB voor 101 vormen) is deze bron niet
    // voorveralgemeend: 7,8 MB voor 333 vormen. Ze mag dus gewoon terug naar de maat van
    // de andere spellen — ongeveer even veel punten per vorm als de departementen houden.
    simplify: '30%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      const code = first(p.arrdep_code);
      return {
        id: code,
        names: { fr: ONTDUBBEL[code] || first(p.arrdep_name) },
        groups: [
          /^97/.test(first(p.dep_code)) ? OVERZEE : EUROPA,
          first(p.reg_name),
          first(p.dep_name),
        ],
      };
    },
  },
};
