/**
 * België (provincies) — de 10 provincies plus het Brussels Hoofdstedelijk Gewest,
 * dat geen provincie is maar wel het elfde stuk van de kaart.
 *
 * Afgeleid spel: het gebruikt dezelfde brondata als be-gemeenten en laat mapshaper
 * de gemeentegrenzen binnen elke provincie wegsmelten (build.dissolve).
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

const strip = {
  nl: /^Provincie /,
  fr: /^Province (?:de la |de |du |d['’])/,
  de: /^Provinz /,
};

const shorten = (name, lang) => (name ? name.replace(strip[lang], '') : null);

export default {
  id: 'be-provincies',
  country: 'België',
  regionType: 'provincies',
  region: { one: 'provincie', many: 'provincies' },
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
    cache: 'be-municipality',   // zelfde download als be-gemeenten
    dissolve: true,
    simplify: '25%',            // veel minder vormen, dus mag fijner
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      const region = first(p.reg_name_nl);
      const province = first(p.prov_name_nl);
      // Brussel valt onder geen provincie en speelt als gewest mee.
      if (!province) {
        return {
          id: first(p.reg_code),
          names: { nl: region, fr: first(p.reg_name_fr), de: first(p.reg_name_de) },
          groups: [region],
        };
      }
      return {
        id: first(p.prov_code),
        names: {
          nl: shorten(province, 'nl'),
          fr: shorten(first(p.prov_name_fr), 'fr'),
          de: shorten(first(p.prov_name_de), 'de'),
        },
        groups: [region],
      };
    },
  },
};
