/**
 * Zweden (län) — de 21 län.
 *
 * De namen houden hun Zweedse vorm, "län" incluis: Stockholms län, Örebro län. Dat woord
 * weglaten zou er "Stockholms" van maken, want de naam staat in de genitief.
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'se-lan',
  country: 'Zweden',
  regionType: 'län',
  region: { one: 'län', many: 'län' },
  idLabel: 'Länscode',

  languages: [{ code: 'sv', label: 'Zweeds' }],

  levels: [],

  source: {
    credit: 'SCB / Opendatasoft',
    name: 'Opendatasoft "georef-sweden-lan" (Statistiska centralbyrån)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-sweden-lan/',
    license: 'CC0 — bronvermelding gewenst',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-sweden-lan/exports/geojson?lang=sv&timezone=Europe%2FStockholm',
    cache: 'se-lan',
    // De bron is al veralgemeend (0,3 MB voor 21 län): hier valt weinig weg te laten.
    simplify: '90%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      return {
        id: first(p.lan_code),
        names: { sv: first(p.lan_name) },
        groups: [],
      };
    },
  },
};
