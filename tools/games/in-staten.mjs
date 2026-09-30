/**
 * India (staten) — de 28 staten en 8 unieterritoria, met Nederlandse en Engelse namen.
 *
 * De grenzen zijn die van India zelf: Jammu en Kasjmir en Ladakh lopen door tot over de
 * hele vroegere prinsenstaat Kasjmir. Wat India daarvan niet bestuurt, staat gearceerd op
 * de kaart: Azad Kasjmir en Gilgit-Baltistan (Pakistan), Aksai Chin en de Shaksgamvallei
 * (China). Die stukken tellen gewoon als de staat of het territorium waar India ze onder
 * rekent — klik je in Aksai Chin, dan klik je op Ladakh.
 *
 * De unieterritoria spelen mee zoals Washington D.C. bij de VS: het is het eerste
 * bestuurlijke niveau, en Delhi, Chandigarh en Puducherry zijn net zo goed deelgebieden als
 * de staten errond. Sinds 2019 zijn Jammu en Kasjmir en Ladakh twee territoria, en sinds
 * 2020 zijn Dadra en Nagar Haveli en Daman en Diu er één.
 *
 * De gebiedskeuze volgt de zes zonale raden (Zonal Councils) waarin de centrale regering de
 * staten groepeert. De Andamanen en Nicobaren en Lakshadweep horen bij geen enkele raad; ze
 * staan bij de zone die er geografisch het dichtst bij ligt.
 *
 * Bron: geoBoundaries, dat de grenzen van DataMeet en de Indiase Kiescommissie gebruikt.
 */

import { INDIA_NL } from '../lib/nederlandse-namen.mjs';
import { NE_BETWIST, NE_BETWIST_BRON, disputedAreas } from '../lib/betwist.mjs';

const NOORD = 'Noord-India';
const CENTRAAL = 'Centraal-India';
const OOST = 'Oost-India';
const WEST = 'West-India';
const ZUID = 'Zuid-India';
const NOORDOOST = 'Noordoost-India';

/** ISO-code -> [Engelse naam, zone]. */
const STAAT = {
  'IN-AN': ['Andaman and Nicobar Islands', OOST],
  'IN-AP': ['Andhra Pradesh', ZUID],
  'IN-AR': ['Arunachal Pradesh', NOORDOOST],
  'IN-AS': ['Assam', NOORDOOST],
  'IN-BR': ['Bihar', OOST],
  'IN-CH': ['Chandigarh', NOORD],
  'IN-CT': ['Chhattisgarh', CENTRAAL],
  'IN-DH': ['Dadra and Nagar Haveli and Daman and Diu', WEST],
  'IN-DL': ['Delhi', NOORD],
  'IN-GA': ['Goa', WEST],
  'IN-GJ': ['Gujarat', WEST],
  'IN-HP': ['Himachal Pradesh', NOORD],
  'IN-HR': ['Haryana', NOORD],
  'IN-JH': ['Jharkhand', OOST],
  'IN-JK': ['Jammu and Kashmir', NOORD],
  'IN-KA': ['Karnataka', ZUID],
  'IN-KL': ['Kerala', ZUID],
  'IN-LA': ['Ladakh', NOORD],
  'IN-LD': ['Lakshadweep', ZUID],
  'IN-MH': ['Maharashtra', WEST],
  'IN-ML': ['Meghalaya', NOORDOOST],
  'IN-MN': ['Manipur', NOORDOOST],
  'IN-MP': ['Madhya Pradesh', CENTRAAL],
  'IN-MZ': ['Mizoram', NOORDOOST],
  'IN-NL': ['Nagaland', NOORDOOST],
  'IN-OR': ['Odisha', OOST],
  'IN-PB': ['Punjab', NOORD],
  'IN-PY': ['Puducherry', ZUID],
  'IN-RJ': ['Rajasthan', NOORD],
  'IN-SK': ['Sikkim', NOORDOOST],
  'IN-TG': ['Telangana', ZUID],
  'IN-TN': ['Tamil Nadu', ZUID],
  'IN-TR': ['Tripura', NOORDOOST],
  'IN-UP': ['Uttar Pradesh', CENTRAAL],
  'IN-UT': ['Uttarakhand', CENTRAAL],
  'IN-WB': ['West Bengal', OOST],
};

export default {
  id: 'in-staten',
  country: 'India',
  regionType: 'staten',
  region: { one: 'staat', many: 'staten' },
  idLabel: 'ISO-code',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'en', label: 'Engels' },
  ],

  levels: [
    { one: 'Zone', many: 'Zones', order: [NOORD, CENTRAAL, OOST, WEST, ZUID, NOORDOOST] },
  ],

  source: {
    credit: 'geoBoundaries / DataMeet; Natural Earth',
    name: 'geoBoundaries gbOpen IND ADM1 (DataMeet, Election Commission of India); ' + NE_BETWIST_BRON,
    url: 'https://www.geoboundaries.org/',
    license: 'CC BY 2.5 India — bronvermelding vereist',
  },

  build: {
    url:
      'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IND/ADM1/' +
      'geoBoundaries-IND-ADM1.geojson',
    cache: 'in-staat',
    extra: { betwist: NE_BETWIST },
    // De bron is erg gedetailleerd (46 MB, vooral de kust en de Sundarbans).
    simplify: '2%',
    year: '2020',   // de bron zegt 2011, maar kent Ladakh (2019) en Dadra-Daman-Diu (2020) al
    prepare(p) {
      const code = p.shapeISO;
      if (!STAAT[code]) throw new Error(`onbekende staat: ${code} (${p.shapeName})`);
      const [engels, zone] = STAAT[code];
      return { id: code, names: { nl: INDIA_NL[code], en: engels }, groups: [zone] };
    },
    overlay: ({ extra }) =>
      disputedAreas(extra.betwist, ['Azad Kashmir', 'Gilgit-Baltistan', 'Aksai Chin', 'Shaksam Valley']),
  },
};
