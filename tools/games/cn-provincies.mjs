/**
 * China (provincies) — de 22 provincies, 5 autonome regio's en 4 stadsprovincies van het
 * vasteland, plus Hongkong en Macau: 33 in totaal, met Nederlandse en Chinese namen.
 *
 * Taiwan doet niet mee. De Volksrepubliek rekent het tot haar 23e provincie, maar bestuurt
 * er geen vierkante meter van, en een spel over Chinese provincies met een land erin dat
 * zijn eigen verkiezingen houdt, zou eerder verwarren dan leren.
 *
 * De grenzen zijn die van China zelf. Tibet loopt daardoor door over Arunachal Pradesh
 * (voor China "Zuid-Tibet") en over vier kleinere stroken aan de Indiase grens: Demchok,
 * Samdu, Tirpani en Bara Hoti. India bestuurt ze; op de kaart staan ze gearceerd, en een
 * klik erop telt als Tibet. Aksai Chin en de Shaksgamvallei bestuurt China wel, en die
 * horen dus gewoon bij Xinjiang en Tibet — in het Indiase spel staan zij gearceerd.
 *
 * De Paraceleilanden (bestuurd door China, geclaimd door Vietnam en Taiwan) horen bij
 * Hainan. De verdere claims in de Zuid-Chinese Zee — de Spratly's, Scarborough — zijn
 * riffen op zee zonder vaste grens, en blijven buiten beschouwing.
 *
 * Bron: de provincies van Natural Earth, met Hongkong en Macau (daar aparte gebieden) er
 * weer bij; Hongkong komt in achttien districten en wordt tot één geheel gesmolten.
 */

import { CHINA_NL } from '../lib/nederlandse-namen.mjs';
import { NE_BETWIST, NE_BETWIST_BRON, disputedAreas } from '../lib/betwist.mjs';

const NOORD = 'Noord-China';
const NOORDOOST = 'Noordoost-China';
const OOST = 'Oost-China';
const CENTRAALZUID = 'Centraal-Zuid-China';
const ZUIDWEST = 'Zuidwest-China';
const NOORDWEST = 'Noordwest-China';

/** De zes grote regio's waarin China zijn provincies groepeert, op ISO-code. */
const REGIO = {
  'CN-BJ': NOORD, 'CN-TJ': NOORD, 'CN-HE': NOORD, 'CN-SX': NOORD, 'CN-NM': NOORD,
  'CN-LN': NOORDOOST, 'CN-JL': NOORDOOST, 'CN-HL': NOORDOOST,
  'CN-SH': OOST, 'CN-JS': OOST, 'CN-ZJ': OOST, 'CN-AH': OOST, 'CN-FJ': OOST, 'CN-JX': OOST,
  'CN-SD': OOST,
  'CN-HA': CENTRAALZUID, 'CN-HB': CENTRAALZUID, 'CN-HN': CENTRAALZUID, 'CN-GD': CENTRAALZUID,
  'CN-GX': CENTRAALZUID, 'CN-HI': CENTRAALZUID, 'CN-HK': CENTRAALZUID, 'CN-MO': CENTRAALZUID,
  'CN-CQ': ZUIDWEST, 'CN-SC': ZUIDWEST, 'CN-GZ': ZUIDWEST, 'CN-YN': ZUIDWEST, 'CN-XZ': ZUIDWEST,
  'CN-SN': NOORDWEST, 'CN-GS': NOORDWEST, 'CN-QH': NOORDWEST, 'CN-NX': NOORDWEST,
  'CN-XJ': NOORDWEST,
};

const CHINEES = {
  'CN-HK': '香港特别行政区',
  'CN-MO': '澳门特别行政区',
};

// Door India bestuurd, door China tot Tibet gerekend.
const ZUID_TIBET = ['Arunachal Pradesh', 'Demchok', 'Samdu Valleys', 'Tirpani Valleys', 'Bara Hotii Valleys'];

function region(code, chinees, geometry) {
  return {
    id: code,
    names: { nl: CHINA_NL[code], zh: CHINEES[code] || chinees },
    groups: [REGIO[code]],
    geometry,
  };
}

export default {
  id: 'cn-provincies',
  country: 'China',
  regionType: 'provincies',
  region: { one: 'provincie', many: 'provincies' },
  idLabel: 'ISO-code',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'zh', label: 'Chinees' },
  ],

  levels: [
    { one: 'Regio', many: "Regio's", order: [NOORD, NOORDOOST, OOST, CENTRAALZUID, ZUIDWEST, NOORDWEST] },
  ],

  source: {
    credit: 'Natural Earth',
    name: 'Natural Earth, Admin 1 – States, Provinces (1:10 miljoen); ' + NE_BETWIST_BRON,
    url: 'https://www.naturalearthdata.com/',
    license: 'Publiek domein',
  },

  build: {
    url:
      'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/' +
      'ne_10m_admin_1_states_provinces.geojson',
    cache: 'ne-admin1',
    extra: { betwist: NE_BETWIST },
    dissolve: true,   // Hongkong uit zijn districten, Tibet met Zuid-Tibet, Hainan met de Paracels
    simplify: '40%',
    year: null,
    regions({ raw, extra }) {
      const list = [];
      raw.features.forEach((f) => {
        const p = f.properties;
        if (p.adm0_a3 === 'CHN') {
          const code = p.iso_3166_2 === 'CN-X01~' ? 'CN-HI' : p.iso_3166_2;   // de Paracels
          if (!CHINA_NL[code]) throw new Error(`onbekende provincie: ${code} (${p.name})`);
          list.push(region(code, p.name_zh, f.geometry));
        } else if (p.adm0_a3 === 'HKG') {
          list.push(region('CN-HK', null, f.geometry));
        } else if (p.adm0_a3 === 'MAC') {
          list.push(region('CN-MO', null, f.geometry));
        }
      });
      // De Paracels dragen hun eigen Chinese naam; Hainan moet de zijne houden, en na het
      // smelten wint de eerste die mapshaper tegenkomt. Dus: overal de naam van Hainan.
      const hainan = list.find((r) => r.id === 'CN-HI' && r.names.zh === '海南省');
      list.filter((r) => r.id === 'CN-HI').forEach((r) => { r.names = hainan.names; });
      disputedAreas(extra.betwist, ZUID_TIBET).forEach((d) => {
        list.push(region('CN-XZ', '西藏自治区', d.geometry));
      });
      return list;
    },
    overlay: ({ extra }) => disputedAreas(extra.betwist, ZUID_TIBET),
  },
};
