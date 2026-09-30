/**
 * Rusland (federale subjecten) — de 83 subjecten binnen de internationaal erkende grenzen,
 * met Nederlandse en Russische namen en het federaal district als gebiedskeuze.
 *
 * Rusland telt er zelf 89: sinds 2014 ook de Krim en Sevastopol, sinds 2022 ook de
 * oblasten Donetsk, Loehansk, Zaporizja en Cherson. Die zes zijn Oekraïens grondgebied en
 * doen hier niet mee — de bron (geoBoundaries) rekent de Krim en Sevastopol eveneens tot
 * Oekraïne. Het Zuidelijk Federaal District telt daardoor zes subjecten in plaats van acht.
 *
 * Een subject is een oblast, kraj, republiek, autonome okroeg, autonome oblast of federale
 * stad. Dat verschil zit in de naam (Oblast Koersk, Kraj Altaj, Republiek Altaj); waar het
 * er niet in zit, zegt het niets over de ligging.
 *
 * Tsjoekotka loopt over de datumgrens heen. De bron knipt het op 180° in twee; het deel
 * aan de overkant schuift 360° op (zie tools/lib/datumgrens.mjs) en build.dissolve naait
 * de twee helften weer aaneen.
 *
 * Bron: geoBoundaries, dat de grenzen uit OpenStreetMap haalt. De Nederlandse namen komen
 * uit tools/lib/nederlandse-namen.mjs, de Russische en het district staan hieronder.
 */

import { RUSLAND_NL, RUSLAND_DISTRICT_NL } from '../lib/nederlandse-namen.mjs';
import { shiftLongitudes, eastward } from '../lib/datumgrens.mjs';

/** ISO 3166-2-code -> [Russische naam, federaal district]. */
const SUBJECT = {
  'RU-AD': ['Адыгея', 'south'],
  'RU-AL': ['Республика Алтай', 'siberia'],
  'RU-ALT': ['Алтайский край', 'siberia'],
  'RU-AMU': ['Амурская область', 'fareast'],
  'RU-ARK': ['Архангельская область', 'northwest'],
  'RU-AST': ['Астраханская область', 'south'],
  'RU-BA': ['Башкортостан', 'volga'],
  'RU-BEL': ['Белгородская область', 'central'],
  'RU-BRY': ['Брянская область', 'central'],
  'RU-BU': ['Бурятия', 'fareast'],
  'RU-CE': ['Чечня', 'caucasus'],
  'RU-CHE': ['Челябинская область', 'urals'],
  'RU-CHU': ['Чукотский автономный округ', 'fareast'],
  'RU-CU': ['Чувашия', 'volga'],
  'RU-DA': ['Дагестан', 'caucasus'],
  'RU-IN': ['Ингушетия', 'caucasus'],
  'RU-IRK': ['Иркутская область', 'siberia'],
  'RU-IVA': ['Ивановская область', 'central'],
  'RU-KAM': ['Камчатский край', 'fareast'],
  'RU-KB': ['Кабардино-Балкария', 'caucasus'],
  'RU-KC': ['Карачаево-Черкесия', 'caucasus'],
  'RU-KDA': ['Краснодарский край', 'south'],
  'RU-KEM': ['Кемеровская область', 'siberia'],
  'RU-KGD': ['Калининградская область', 'northwest'],
  'RU-KGN': ['Курганская область', 'urals'],
  'RU-KHA': ['Хабаровский край', 'fareast'],
  'RU-KHM': ['Ханты-Мансийский автономный округ', 'urals'],
  'RU-KIR': ['Кировская область', 'volga'],
  'RU-KK': ['Хакасия', 'siberia'],
  'RU-KL': ['Калмыкия', 'south'],
  'RU-KLU': ['Калужская область', 'central'],
  'RU-KO': ['Коми', 'northwest'],
  'RU-KOS': ['Костромская область', 'central'],
  'RU-KR': ['Карелия', 'northwest'],
  'RU-KRS': ['Курская область', 'central'],
  'RU-KYA': ['Красноярский край', 'siberia'],
  'RU-LEN': ['Ленинградская область', 'northwest'],
  'RU-LIP': ['Липецкая область', 'central'],
  'RU-MAG': ['Магаданская область', 'fareast'],
  'RU-ME': ['Марий Эл', 'volga'],
  'RU-MO': ['Мордовия', 'volga'],
  'RU-MOS': ['Московская область', 'central'],
  'RU-MOW': ['Москва', 'central'],
  'RU-MUR': ['Мурманская область', 'northwest'],
  'RU-NEN': ['Ненецкий автономный округ', 'northwest'],
  'RU-NGR': ['Новгородская область', 'northwest'],
  'RU-NIZ': ['Нижегородская область', 'volga'],
  'RU-NVS': ['Новосибирская область', 'siberia'],
  'RU-OMS': ['Омская область', 'siberia'],
  'RU-ORE': ['Оренбургская область', 'volga'],
  'RU-ORL': ['Орловская область', 'central'],
  'RU-PER': ['Пермский край', 'volga'],
  'RU-PNZ': ['Пензенская область', 'volga'],
  'RU-PRI': ['Приморский край', 'fareast'],
  'RU-PSK': ['Псковская область', 'northwest'],
  'RU-ROS': ['Ростовская область', 'south'],
  'RU-RYA': ['Рязанская область', 'central'],
  'RU-SA': ['Якутия', 'fareast'],
  'RU-SAK': ['Сахалинская область', 'fareast'],
  'RU-SAM': ['Самарская область', 'volga'],
  'RU-SAR': ['Саратовская область', 'volga'],
  'RU-SE': ['Северная Осетия — Алания', 'caucasus'],
  'RU-SMO': ['Смоленская область', 'central'],
  'RU-SPE': ['Санкт-Петербург', 'northwest'],
  'RU-STA': ['Ставропольский край', 'caucasus'],
  'RU-SVE': ['Свердловская область', 'urals'],
  'RU-TA': ['Татарстан', 'volga'],
  'RU-TAM': ['Тамбовская область', 'central'],
  'RU-TOM': ['Томская область', 'siberia'],
  'RU-TUL': ['Тульская область', 'central'],
  'RU-TVE': ['Тверская область', 'central'],
  'RU-TY': ['Тыва', 'siberia'],
  'RU-TYU': ['Тюменская область', 'urals'],
  'RU-UD': ['Удмуртия', 'volga'],
  'RU-ULY': ['Ульяновская область', 'volga'],
  'RU-VGG': ['Волгоградская область', 'south'],
  'RU-VLA': ['Владимирская область', 'central'],
  'RU-VLG': ['Вологодская область', 'northwest'],
  'RU-VOR': ['Воронежская область', 'central'],
  'RU-YAN': ['Ямало-Ненецкий автономный округ', 'urals'],
  'RU-YAR': ['Ярославская область', 'central'],
  'RU-YEV': ['Еврейская автономная область', 'fareast'],
  'RU-ZAB': ['Забайкальский край', 'fareast'],
};

export default {
  id: 'ru-subjecten',
  country: 'Rusland',
  regionType: 'federale subjecten',
  region: { one: 'federaal subject', many: 'federale subjecten' },
  idLabel: 'ISO-code',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'ru', label: 'Russisch' },
  ],

  levels: [
    { one: 'Federaal district', many: 'Federale districten', order: Object.values(RUSLAND_DISTRICT_NL) },
  ],

  source: {
    credit: 'geoBoundaries / © OpenStreetMap-bijdragers',
    name: 'geoBoundaries gbOpen RUS ADM1 (grenzen uit OpenStreetMap)',
    url: 'https://www.geoboundaries.org/',
    license: 'Open Database License 1.0 — © OpenStreetMap-bijdragers',
  },

  build: {
    url:
      'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/RUS/ADM1/' +
      'geoBoundaries-RUS-ADM1.geojson',
    cache: 'ru-subject',
    dissolve: true,   // naait Tsjoekotka aaneen over de datumgrens; de rest blijft wat het is
    // De bron is erg gedetailleerd (59 MB): de Noordelijke IJszee zit vol eilandjes en
    // fjorden. Dit brengt het spel op de maat van de andere.
    simplify: '1.5%',
    year: '2017',
    prepare(p, feature) {
      const code = p.shapeISO;
      if (!SUBJECT[code] || !RUSLAND_NL[code]) throw new Error(`onbekend subject: ${code} (${p.shapeName})`);
      const [russisch, district] = SUBJECT[code];
      return {
        id: code,
        names: { nl: RUSLAND_NL[code], ru: russisch },
        groups: [RUSLAND_DISTRICT_NL[district]],
        geometry: shiftLongitudes(feature.geometry, eastward),
      };
    },
  },
};
