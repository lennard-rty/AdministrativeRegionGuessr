/**
 * Portugal (districten) — de 18 districten van het vasteland plus de twee autonome regio's
 * Azoren en Madeira.
 *
 * Het district is er het oudste bestuursniveau en nog altijd wat iedereen gebruikt om te
 * zeggen waar iets ligt, ook al is er sinds 2011 geen districtsbestuur meer.
 *
 * Het spel begint op het vasteland: de Azoren liggen 1.500 km de Atlantische Oceaan in.
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

const VASTELAND = 'Vasteland';
const EILANDEN = 'Autonome regio’s';

export default {
  id: 'pt-districten',
  country: 'Portugal',
  regionType: 'districten',
  region: { one: 'district', many: 'districten' },
  idLabel: 'Districtscode',

  languages: [{ code: 'pt', label: 'Portugees' }],

  levels: [{ one: 'Gebiedsdeel', many: 'Gebiedsdelen', order: [VASTELAND, EILANDEN] }],

  defaultArea: VASTELAND,

  source: {
    credit: 'DGT / Opendatasoft',
    name: 'Opendatasoft "georef-portugal-distrito" (Direção-Geral do Território)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-portugal-distrito/',
    license: 'Open data DGT — bronvermelding vereist',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-portugal-distrito/exports/geojson?lang=pt&timezone=Europe%2FLisbon',
    cache: 'pt-distrito',
    simplify: '15%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      return {
        id: first(p.dis_code),
        names: { pt: first(p.dis_name) },
        groups: [first(p.dis_type) === 'district' ? VASTELAND : EILANDEN],
      };
    },
  },
};
