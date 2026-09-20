/**
 * Verenigd Koninkrijk (counties) — de 218 gebieden van het niveau dat het ONS "counties and
 * unitary authorities" noemt, met land en regio als gebiedskeuze.
 *
 * Eén niveau, zes soorten, want elk landsdeel heeft zijn eigen bestuur: 21 counties en 85
 * unitary authorities, 36 metropolitan districts en 33 London boroughs in Engeland, 32
 * council areas in Schotland en 11 districts in Noord-Ierland. De ceremoniële graafschappen
 * die op oude kaarten staan — Yorkshire in één stuk — zijn iets anders en zitten hier niet in.
 *
 * De regio's zijn een Engelse indeling: buiten Engeland blijft dat niveau leeg, zodat
 * Schotland, Wales en Noord-Ierland niet twee keer in het gebiedsmenu komen.
 */

import { VK_LAND_NL } from '../lib/nederlandse-namen.mjs';

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'uk-counties',
  country: 'Verenigd Koninkrijk',
  regionType: 'counties',
  region: { one: 'county', many: 'counties' },
  idLabel: 'ONS-code',

  languages: [{ code: 'en', label: 'Engels' }],

  levels: [
    {
      one: 'Land',
      many: 'Landen',
      order: ['Engeland', 'Schotland', 'Wales', 'Noord-Ierland'],
    },
    { one: 'Regio', many: "Regio's" },
  ],

  source: {
    credit: 'ONS / Opendatasoft',
    name: 'Opendatasoft "georef-united-kingdom-county-unitary-authority" (Office for National Statistics)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-united-kingdom-county-unitary-authority/',
    license: 'Open Government Licence 3.0 — bronvermelding vereist',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-united-kingdom-county-unitary-authority/exports/geojson?lang=en&timezone=Europe%2FLondon',
    cache: 'uk-ctyua',
    simplify: '30%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      const land = VK_LAND_NL[first(p.ctry_name)];
      return {
        id: first(p.ctyua_code),
        names: { en: first(p.ctyua_name) },
        // Enkel Engeland is in regio's verdeeld; elders herhaalt de bron de landsnaam.
        groups: [land, land === 'Engeland' ? first(p.rgn_name) : ''],
      };
    },
  },
};
