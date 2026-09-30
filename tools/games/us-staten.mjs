/**
 * Verenigde Staten (staten) — de 50 staten, Washington D.C. en de vijf bewoonde
 * territoria, met Nederlandse en Engelse namen.
 *
 * Twee gebiedsniveaus: eerst staten of territoria, dan de vier regio's van het Census
 * Bureau. D.C. telt mee bij de staten en bij het Zuiden, zoals het Census Bureau het doet;
 * de territoria vallen buiten elke regio.
 *
 * De territoria liggen verspreid over de Cariben en de Stille Oceaan, van Puerto Rico tot
 * Guam, en zijn op een landkaart speldenprikken. Net als de Franse spellen met hun
 * overzeese departementen begint dit spel daarom bij de staten.
 *
 * De westelijke Aleoeten, Guam en de Noordelijke Marianen liggen voorbij de datumgrens.
 * Ze schuiven 360° naar het westen (zie tools/lib/datumgrens.mjs), zodat Alaska één geheel
 * blijft en Guam ten westen van Hawaï ligt in plaats van aan de andere kant van de wereld.
 */

import { VS_NL, VS_REGIO_NL } from '../lib/nederlandse-namen.mjs';
import { shiftLongitudes, westward } from '../lib/datumgrens.mjs';

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

const STATEN = 'Staten en D.C.';
const TERRITORIA = 'Territoria';

/** De officiële Engelse naam, waar die voor een quiz te lang is. */
const ENGELS_KORT = {
  '69': 'Northern Mariana Islands',
  '78': 'U.S. Virgin Islands',
};

export default {
  id: 'us-staten',
  country: 'Verenigde Staten',
  wholeArea: 'Heel de Verenigde Staten',
  regionType: 'staten',
  region: { one: 'staat', many: 'staten' },
  idLabel: 'FIPS-code',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'en', label: 'Engels' },
  ],

  levels: [
    { one: 'Gebiedsdeel', many: 'Gebiedsdelen', order: [STATEN, TERRITORIA] },
    { one: 'Regio', many: "Regio's", order: ['Noordoosten', 'Middenwesten', 'Zuiden', 'Westen'] },
  ],

  defaultArea: STATEN,

  source: {
    credit: 'US Census Bureau / Opendatasoft',
    name: 'Opendatasoft "georef-united-states-of-america-state" (US Census Bureau)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-united-states-of-america-state/',
    license: 'Publiek domein (werk van de Amerikaanse federale overheid)',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-united-states-of-america-state/exports/geojson?lang=en&timezone=UTC',
    cache: 'us-state',
    dissolve: true,   // naait de Aleoeten aaneen over de datumgrens
    // De bron is al veralgemeend (1,1 MB voor alle 56 samen);
    // verder vereenvoudigen maakt van de kust een zaagtand.
    simplify: '100%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p, feature) {
      const code = first(p.ste_code);
      if (!VS_NL[code]) throw new Error(`onbekende staat: ${code} (${first(p.ste_name)})`);
      const territorium = first(p.ste_type) !== 'state';
      return {
        id: code,
        names: { nl: VS_NL[code], en: ENGELS_KORT[code] || first(p.ste_name) },
        groups: territorium ? [TERRITORIA] : [STATEN, VS_REGIO_NL[code]],
        geometry: shiftLongitudes(feature.geometry, westward),
      };
    },
  },
};
