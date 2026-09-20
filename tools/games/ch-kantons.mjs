/**
 * Zwitserland (kantons) — de 26 kantons.
 *
 * Elk kanton houdt zijn eigen naam, in de taal van het kanton: Genève en Vaud in het Frans,
 * Ticino in het Italiaans, de rest in het Duits. Anders dan bij België geeft de bron maar
 * één naam per kanton, dus er valt niets te kiezen — vandaar één "taal" die eigenlijk
 * gewoon "zoals het kanton zichzelf noemt" betekent.
 *
 * Nederlandse namen bestaan wel voor een handvol (Tessin, Wallis, Waadt, Freiburg), maar
 * niet voor de meeste; half vertalen zou een rommeltje geven.
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'ch-kantons',
  country: 'Zwitserland',
  regionType: 'kantons',
  region: { one: 'kanton', many: 'kantons' },
  idLabel: 'Kantonsnummer',

  languages: [{ code: 'ch', label: 'Eigen naam' }],

  levels: [],   // met 26 stukken valt er weinig te filteren

  source: {
    credit: 'swisstopo / Opendatasoft',
    name: 'Opendatasoft "georef-switzerland-kanton" (Bundesamt für Landestopografie)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-switzerland-kanton/',
    license: 'Open data swisstopo — bronvermelding vereist',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-switzerland-kanton/exports/geojson?lang=de&timezone=Europe%2FZurich',
    cache: 'ch-kanton',
    simplify: '25%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      return {
        id: first(p.kan_code),
        names: { ch: first(p.kan_name) },
        groups: [],
      };
    },
  },
};
