/**
 * Mexico (staten) — de 31 staten en Mexico-Stad, met Nederlandse en Spaanse namen.
 *
 * Mexico-Stad is sinds 2016 geen federaal district meer maar een deelgebied met dezelfde
 * rang als de staten, en telt hier dus gewoon mee. Het grenst aan de staat Mexico (México),
 * die er als een hoefijzer omheen ligt.
 *
 * Vier staten dragen officieel een eretitel achter hun naam: Coahuila de Zaragoza,
 * Michoacán de Ocampo, Veracruz de Ignacio de la Llave en México. Niemand noemt ze zo, dus
 * het spel ook niet; México wordt Estado de México, om het van het land te onderscheiden.
 * De Nederlandse namen zijn de Spaanse, op twee na — zie tools/lib/nederlandse-namen.mjs.
 */

import { MEXICO_NL } from '../lib/nederlandse-namen.mjs';

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

/** De gewone Spaanse naam, waar de officiële langer is. */
const SPAANS_KORT = {
  '05': 'Coahuila',
  '15': 'Estado de México',
  '16': 'Michoacán',
  '30': 'Veracruz',
};

export default {
  id: 'mx-staten',
  country: 'Mexico',
  regionType: 'staten',
  region: { one: 'staat', many: 'staten' },
  idLabel: 'Staatcode',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'es', label: 'Spaans' },
  ],

  levels: [],

  source: {
    credit: 'INEGI / Opendatasoft',
    name: 'Opendatasoft "georef-mexico-state" (INEGI)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-mexico-state/',
    license: 'Términos de Libre Uso de la Información del INEGI — bronvermelding vereist',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-mexico-state/exports/geojson?lang=es&timezone=UTC',
    cache: 'mx-state',
    simplify: '15%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      const code = first(p.sta_code);
      const spaans = SPAANS_KORT[code] || first(p.sta_name);
      return {
        id: code,
        names: { nl: MEXICO_NL[code] || spaans, es: spaans },
        groups: [],
      };
    },
  },
};
