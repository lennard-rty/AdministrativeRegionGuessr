/**
 * Spanje (provincies) — de 50 provincies plus de autonome steden Ceuta en Melilla, met de
 * autonome gemeenschap als gebiedskeuze.
 *
 * De namen blijven Spaans. Waar een provincie een co-officiële naam heeft, is dat de naam
 * die de bron geeft: Bizkaia, Gipuzkoa, A Coruña, Ourense, Girona, Lleida, Araba/Álava.
 *
 * Het spel begint op het vasteland. De Canarische Eilanden liggen ruim 1.000 km zuidwestelijk,
 * voor de kust van Marokko; heel Spanje in beeld maakt het schiereiland een stuk kleiner.
 * Ceuta en Melilla liggen wel in Noord-Afrika, maar vlak over de Straat van Gibraltar en
 * horen dus bij het vasteland in beeld.
 */

import { GEMEENSCHAP_NL } from '../lib/nederlandse-namen.mjs';

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

const VASTELAND = 'Vasteland en Balearen';
const EILANDEN = 'Canarische Eilanden';

export default {
  id: 'es-provincies',
  country: 'Spanje',
  regionType: 'provincies',
  region: { one: 'provincie', many: 'provincies' },
  idLabel: 'INE-code',

  languages: [{ code: 'es', label: 'Spaans' }],

  levels: [
    { one: 'Gebiedsdeel', many: 'Gebiedsdelen', order: [VASTELAND, EILANDEN] },
    { one: 'Autonome gemeenschap', many: 'Autonome gemeenschappen' },
  ],

  defaultArea: VASTELAND,

  source: {
    credit: 'INE / Opendatasoft',
    name: 'Opendatasoft "georef-spain-provincia" (Instituto Nacional de Estadística)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-spain-provincia/',
    license: 'Open data INE — bronvermelding vereist',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-spain-provincia/exports/geojson?lang=es&timezone=Europe%2FMadrid',
    cache: 'es-provincia',
    simplify: '15%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      const gemeenschap = first(p.acom_name);
      // De bron heeft een restpost voor wat onder geen enkele provincie valt.
      if (!GEMEENSCHAP_NL[gemeenschap]) return null;
      return {
        id: first(p.prov_code),
        names: { es: first(p.prov_name) },
        groups: [gemeenschap === 'Canarias' ? EILANDEN : VASTELAND, GEMEENSCHAP_NL[gemeenschap]],
      };
    },
  },
};
