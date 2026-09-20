/**
 * Spanje (autonome gemeenschappen) — de 17 autonome gemeenschappen plus de autonome steden
 * Ceuta en Melilla, met Nederlandse en Spaanse namen.
 *
 * Afgeleid spel: het gebruikt dezelfde brondata als es-provincies en laat mapshaper de
 * provinciegrenzen binnen elke gemeenschap wegsmelten (build.dissolve).
 *
 * Zeven gemeenschappen bestaan uit één provincie (Asturië, Cantabrië, Madrid, Murcia,
 * Navarra, La Rioja en de Balearen); die tekenen in beide spellen exact dezelfde vorm.
 */

import { GEMEENSCHAP_NL } from '../lib/nederlandse-namen.mjs';

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

const VASTELAND = 'Vasteland en Balearen';
const EILANDEN = 'Canarische Eilanden';

// "Comunidad Foral de Navarra" is de staatkundige titel; op de kaart heet ze Navarra.
const strip = /^(Ciudad Autónoma de |Comunidad Foral de |Comunidad de |Principado de |Región de )/;

export default {
  id: 'es-gemeenschappen',
  country: 'Spanje',
  regionType: 'autonome gemeenschappen',
  region: { one: 'autonome gemeenschap', many: 'autonome gemeenschappen' },
  idLabel: 'INE-code',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'es', label: 'Spaans' },
  ],

  levels: [{ one: 'Gebiedsdeel', many: 'Gebiedsdelen', order: [VASTELAND, EILANDEN] }],

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
    cache: 'es-provincia',   // zelfde download als es-provincies
    dissolve: true,
    simplify: '12%',         // grote vormen: meer detail levert niets zichtbaars op
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      const naam = first(p.acom_name);
      if (!GEMEENSCHAP_NL[naam]) return null;
      return {
        id: first(p.acom_code),
        names: { nl: GEMEENSCHAP_NL[naam], es: naam.replace(strip, '') },
        groups: [naam === 'Canarias' ? EILANDEN : VASTELAND],
      };
    },
  },
};
