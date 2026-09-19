/** België (gemeenten) — 565 gemeenten, met gewest en provincie als gebiedskeuze. */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

// Twee gemeenten heten in het Frans Saint-Nicolas: Sint-Niklaas in Oost-Vlaanderen en
// Saint-Nicolas bij Luik. In het Nederlands en het Duits lopen ze uit elkaar (Sint-Niklaas
// tegenover Saint-Nicolas), in het Frans niet — en dan is de vraag niet te beantwoorden:
// wie de andere aanklikt, krijgt een misser. Die twee krijgen daarom hun provincie erbij.
// De bouwer waarschuwt als de bron er ooit een paar bij krijgt.
const ONTDUBBEL_FR = ['46021', '62093'];

const provincie = (name) => (name || '').replace(/^Province (?:de la |de |du |d['’])/, '');

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
      const code = first(p.mun_code);
      const fr = first(p.mun_name_fr);
      return {
        id: code,
        names: {
          nl: first(p.mun_name_nl),
          fr: ONTDUBBEL_FR.indexOf(code) === -1
            ? fr
            : fr + ' (' + provincie(first(p.prov_name_fr)) + ')',
          de: first(p.mun_name_de),
        },
        // Brussel heeft geen provincie: dan blijft het tweede niveau leeg.
        groups: [region, first(p.prov_name_nl) || ''],
      };
    },
  },
};
