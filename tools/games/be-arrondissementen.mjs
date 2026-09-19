/**
 * België (arrondissementen) — de 43 administratieve arrondissementen, met gewest en
 * provincie als gebiedskeuze.
 *
 * Afgeleid spel: het gebruikt dezelfde brondata als be-gemeenten en laat mapshaper de
 * gemeentegrenzen binnen elk arrondissement wegsmelten (build.dissolve). Zo sluiten de
 * arrondissementsgrenzen exact aan op die van het gemeente- en het provinciespel.
 *
 * De middenmaat tussen 11 provincies en 565 gemeenten, en het niveau waarop de drie
 * talen het mooist uit elkaar lopen: Luik / Liège / Lüttich.
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

const strip = {
  nl: /^Arrondissement /,
  fr: /^Arrondissement (?:de la |de |du |des |d['’])/,
  de: /^Bezirk /,
};

const shorten = (name, lang) => (name ? name.replace(strip[lang], '') : null);

export default {
  id: 'be-arrondissementen',
  country: 'België',
  regionType: 'arrondissementen',
  region: { one: 'arrondissement', many: 'arrondissementen' },
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
    cache: 'be-municipality',   // zelfde download als be-gemeenten
    dissolve: true,
    simplify: '25%',            // veel minder vormen, dus mag fijner
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      return {
        id: first(p.arr_code),
        names: {
          nl: shorten(first(p.arr_name_nl), 'nl'),
          fr: shorten(first(p.arr_name_fr), 'fr'),
          de: shorten(first(p.arr_name_de), 'de'),
        },
        // Brussel valt onder geen provincie: dan blijft het tweede niveau leeg.
        groups: [first(p.reg_name_nl), first(p.prov_name_nl) || ''],
      };
    },
  },
};
