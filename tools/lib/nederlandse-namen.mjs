/**
 * Nederlandse namen voor buitenlandse regio's, per spel gegroepeerd.
 *
 * Het spel is Nederlands, dus gebiedsnamen staan altijd in het Nederlands — zie README,
 * "Een spel toevoegen". Waar de bron die namen niet kent, staan ze hier. De regels:
 *
 * - Bestaat er een gewone Nederlandse naam, dan gebruiken we die: Beieren, Toscane,
 *   Andalusië, Schotland. Dat geldt voor het bovenste niveau van een land, waar de namen
 *   ook in het Nederlands ingeburgerd zijn.
 * - Bestaat die niet, dan houdt de regio haar eigen naam: de Franse departementen, de
 *   Duitse Kreise, de Zwitserse kantons, de Zweedse län. Een verzonnen vertaling helpt
 *   niemand.
 *
 * De sleutel is de naam zoals de bron ze schrijft (of de code waar die stabieler is), en
 * de lijsten zijn volledig: wat er niet in staat, bestaat niet in de bron.
 */

/** Duitse deelstaten, op deelstaatcode — de twee cijfers waar elke Kreiscode mee begint. */
export const DEELSTAAT_NL = {
  '01': 'Sleeswijk-Holstein',
  '02': 'Hamburg',
  '03': 'Nedersaksen',
  '04': 'Bremen',
  '05': 'Noordrijn-Westfalen',
  '06': 'Hessen',
  '07': 'Rijnland-Palts',
  '08': 'Baden-Württemberg',
  '09': 'Beieren',
  '10': 'Saarland',
  '11': 'Berlijn',
  '12': 'Brandenburg',
  '13': 'Mecklenburg-Voor-Pommeren',
  '14': 'Saksen',
  '15': 'Saksen-Anhalt',
  '16': 'Thüringen',
};

/** Spaanse autonome gemeenschappen, op de naam die de bron geeft. */
export const GEMEENSCHAP_NL = {
  'Andalucía': 'Andalusië',
  'Aragón': 'Aragón',
  'Principado de Asturias': 'Asturië',
  'Illes Balears': 'Balearen',
  'Canarias': 'Canarische Eilanden',
  'Cantabria': 'Cantabrië',
  'Castilla y León': 'Castilië en León',
  'Castilla-La Mancha': 'Castilië-La Mancha',
  'Cataluña': 'Catalonië',
  'Comunitat Valenciana': 'Valencia',
  'Extremadura': 'Extremadura',
  'Galicia': 'Galicië',
  'Comunidad de Madrid': 'Madrid',
  'Región de Murcia': 'Murcia',
  'Comunidad Foral de Navarra': 'Navarra',
  'País Vasco': 'Baskenland',
  'La Rioja': 'La Rioja',
  'Ciudad Autónoma de Ceuta': 'Ceuta',
  'Ciudad Autónoma de Melilla': 'Melilla',
};

/** Italiaanse regio's, op de naam die de bron geeft. */
export const REGIONE_NL = {
  'Abruzzo': 'Abruzzen',
  'Basilicata': 'Basilicata',
  'Calabria': 'Calabrië',
  'Campania': 'Campanië',
  'Emilia-Romagna': 'Emilia-Romagna',
  'Friuli Venezia Giulia': 'Friuli-Venezia Giulia',
  'Lazio': 'Lazio',
  'Liguria': 'Ligurië',
  'Lombardia': 'Lombardije',
  'Marche': 'Marche',
  'Molise': 'Molise',
  'Piemonte': 'Piëmont',
  'Puglia': 'Apulië',
  'Sardegna': 'Sardinië',
  'Sicilia': 'Sicilië',
  'Toscana': 'Toscane',
  'Trentino-Alto Adige': 'Trentino-Zuid-Tirol',
  'Umbria': 'Umbrië',
  "Valle d'Aosta": "Valle d'Aosta",
  'Veneto': 'Veneto',
};

/** De vijf Italiaanse landsdelen waarin het statistiekbureau de regio's groepeert. */
export const LANDSDEEL_IT_NL = {
  'Nord-Ovest': 'Noordwest-Italië',
  'Nord-Est': 'Noordoost-Italië',
  'Centro': 'Midden-Italië',
  'Sud': 'Zuid-Italië',
  'Isole': 'Eilanden',
};

/** De vier landen van het Verenigd Koninkrijk. */
export const VK_LAND_NL = {
  'England': 'Engeland',
  'Scotland': 'Schotland',
  'Wales': 'Wales',
  'Northern Ireland': 'Noord-Ierland',
};

/** Oostenrijkse deelstaten, op NUTS-code (AT11 ... AT34). */
export const OOSTENRIJK_NL = {
  AT11: 'Burgenland',
  AT12: 'Neder-Oostenrijk',
  AT13: 'Wenen',
  AT21: 'Karinthië',
  AT22: 'Stiermarken',
  AT31: 'Opper-Oostenrijk',
  AT32: 'Salzburg',
  AT33: 'Tirol',
  AT34: 'Vorarlberg',
};

/**
 * Dezelfde negen deelstaten, maar op het eerste cijfer van de Oostenrijkse gemeente- en
 * districtscode. Oostenrijk gebruikt twee nummeringen naast elkaar: NUTS voor Europa,
 * de GKZ voor zichzelf. at-deelstaten komt uit de eerste, at-bezirke uit de tweede.
 */
export const OOSTENRIJK_GKZ_NL = {
  '1': 'Burgenland',
  '2': 'Karinthië',
  '3': 'Neder-Oostenrijk',
  '4': 'Opper-Oostenrijk',
  '5': 'Salzburg',
  '6': 'Stiermarken',
  '7': 'Tirol',
  '8': 'Vorarlberg',
  '9': 'Wenen',
};

/**
 * De staten van de VS, Washington D.C. en de vijf bewoonde territoria, op FIPS-code. De
 * meeste houden hun Engelse naam; enkel waar het Nederlands een eigen vorm heeft wijkt
 * die af (Californië, Noord-Carolina, Amerikaans-Samoa).
 */
export const VS_NL = {
  '01': 'Alabama',
  '02': 'Alaska',
  '04': 'Arizona',
  '05': 'Arkansas',
  '06': 'Californië',
  '08': 'Colorado',
  '09': 'Connecticut',
  '10': 'Delaware',
  '11': 'Washington D.C.',
  '12': 'Florida',
  '13': 'Georgia',
  '15': 'Hawaï',
  '16': 'Idaho',
  '17': 'Illinois',
  '18': 'Indiana',
  '19': 'Iowa',
  '20': 'Kansas',
  '21': 'Kentucky',
  '22': 'Louisiana',
  '23': 'Maine',
  '24': 'Maryland',
  '25': 'Massachusetts',
  '26': 'Michigan',
  '27': 'Minnesota',
  '28': 'Mississippi',
  '29': 'Missouri',
  '30': 'Montana',
  '31': 'Nebraska',
  '32': 'Nevada',
  '33': 'New Hampshire',
  '34': 'New Jersey',
  '35': 'New Mexico',
  '36': 'New York',
  '37': 'Noord-Carolina',
  '38': 'Noord-Dakota',
  '39': 'Ohio',
  '40': 'Oklahoma',
  '41': 'Oregon',
  '42': 'Pennsylvania',
  '44': 'Rhode Island',
  '45': 'Zuid-Carolina',
  '46': 'Zuid-Dakota',
  '47': 'Tennessee',
  '48': 'Texas',
  '49': 'Utah',
  '50': 'Vermont',
  '51': 'Virginia',
  '53': 'Washington',
  '54': 'West Virginia',
  '55': 'Wisconsin',
  '56': 'Wyoming',
  '60': 'Amerikaans-Samoa',
  '66': 'Guam',
  '69': 'Noordelijke Marianen',
  '72': 'Puerto Rico',
  '78': 'Amerikaanse Maagdeneilanden',
};

/**
 * De vier regio's waarin het Census Bureau de staten en Washington D.C. groepeert, op
 * FIPS-code. De territoria horen bij geen enkele.
 */
export const VS_REGIO_NL = Object.fromEntries(
  Object.entries({
    Noordoosten: ['09', '23', '25', '33', '34', '36', '42', '44', '50'],
    Middenwesten: ['17', '18', '19', '20', '26', '27', '29', '31', '38', '39', '46', '55'],
    Zuiden: [
      '01', '05', '10', '11', '12', '13', '21', '22', '24', '28', '37', '40', '45', '47',
      '48', '51', '54',
    ],
    Westen: ['02', '04', '06', '08', '15', '16', '30', '32', '35', '41', '49', '53', '56'],
  }).flatMap(([regio, codes]) => codes.map((code) => [code, regio]))
);

/** Canadese provincies en territoria, op de code van Statistics Canada. */
export const CANADA_NL = {
  '10': 'Newfoundland en Labrador',
  '11': 'Prins Edwardeiland',
  '12': 'Nova Scotia',
  '13': 'New Brunswick',
  '24': 'Quebec',
  '35': 'Ontario',
  '46': 'Manitoba',
  '47': 'Saskatchewan',
  '48': 'Alberta',
  '59': 'Brits-Columbia',
  '60': 'Yukon',
  '61': 'Northwest Territories',
  '62': 'Nunavut',
};

/**
 * Mexicaanse staten waarvan de Nederlandse naam afwijkt, op INEGI-code. De andere dertig
 * houden hun Spaanse naam.
 */
export const MEXICO_NL = {
  '09': 'Mexico-Stad',
  '15': 'Mexico (staat)',
};

/**
 * De 83 federale subjecten van Rusland binnen de internationaal erkende grenzen, op
 * ISO 3166-2-code. Russische namen hebben in ons alfabet geen eigen vorm, dus volgen ze
 * de Nederlandse transliteratie zoals de Nederlandstalige Wikipedia die schrijft:
 * Oblast Koersk, Kraj Chabarovsk, Tsjoevasjië.
 */
export const RUSLAND_NL = {
  'RU-AD': 'Adygea',
  'RU-AL': 'Republiek Altaj',
  'RU-ALT': 'Kraj Altaj',
  'RU-AMU': 'Oblast Amoer',
  'RU-ARK': 'Oblast Archangelsk',
  'RU-AST': 'Oblast Astrachan',
  'RU-BA': 'Basjkirostan',
  'RU-BEL': 'Oblast Belgorod',
  'RU-BRY': 'Oblast Brjansk',
  'RU-BU': 'Boerjatië',
  'RU-CE': 'Tsjetsjenië',
  'RU-CHE': 'Oblast Tsjeljabinsk',
  'RU-CHU': 'Tsjoekotka',
  'RU-CU': 'Tsjoevasjië',
  'RU-DA': 'Dagestan',
  'RU-IN': 'Ingoesjetië',
  'RU-IRK': 'Oblast Irkoetsk',
  'RU-IVA': 'Oblast Ivanovo',
  'RU-KAM': 'Kraj Kamtsjatka',
  'RU-KB': 'Kabardië-Balkarië',
  'RU-KC': 'Karatsjaj-Tsjerkessië',
  'RU-KDA': 'Kraj Krasnodar',
  'RU-KEM': 'Oblast Kemerovo',
  'RU-KGD': 'Oblast Kaliningrad',
  'RU-KGN': 'Oblast Koergan',
  'RU-KHA': 'Kraj Chabarovsk',
  'RU-KHM': 'Chanto-Mansië',
  'RU-KIR': 'Oblast Kirov',
  'RU-KK': 'Chakassië',
  'RU-KL': 'Kalmukkië',
  'RU-KLU': 'Oblast Kaloega',
  'RU-KO': 'Komi',
  'RU-KOS': 'Oblast Kostroma',
  'RU-KR': 'Karelië',
  'RU-KRS': 'Oblast Koersk',
  'RU-KYA': 'Kraj Krasnojarsk',
  'RU-LEN': 'Oblast Leningrad',
  'RU-LIP': 'Oblast Lipetsk',
  'RU-MAG': 'Oblast Magadan',
  'RU-ME': 'Mari El',
  'RU-MO': 'Mordovië',
  'RU-MOS': 'Oblast Moskou',
  'RU-MOW': 'Moskou',
  'RU-MUR': 'Oblast Moermansk',
  'RU-NEN': 'Nenetsië',
  'RU-NGR': 'Oblast Novgorod',
  'RU-NIZ': 'Oblast Nizjni Novgorod',
  'RU-NVS': 'Oblast Novosibirsk',
  'RU-OMS': 'Oblast Omsk',
  'RU-ORE': 'Oblast Orenburg',
  'RU-ORL': 'Oblast Orjol',
  'RU-PER': 'Kraj Perm',
  'RU-PNZ': 'Oblast Penza',
  'RU-PRI': 'Kraj Primorje',
  'RU-PSK': 'Oblast Pskov',
  'RU-ROS': 'Oblast Rostov',
  'RU-RYA': 'Oblast Rjazan',
  'RU-SA': 'Jakoetië',
  'RU-SAK': 'Oblast Sachalin',
  'RU-SAM': 'Oblast Samara',
  'RU-SAR': 'Oblast Saratov',
  'RU-SE': 'Noord-Ossetië-Alanië',
  'RU-SMO': 'Oblast Smolensk',
  'RU-SPE': 'Sint-Petersburg',
  'RU-STA': 'Kraj Stavropol',
  'RU-SVE': 'Oblast Sverdlovsk',
  'RU-TA': 'Tatarstan',
  'RU-TAM': 'Oblast Tambov',
  'RU-TOM': 'Oblast Tomsk',
  'RU-TUL': 'Oblast Toela',
  'RU-TVE': 'Oblast Tver',
  'RU-TY': 'Toeva',
  'RU-TYU': 'Oblast Tjoemen',
  'RU-UD': 'Oedmoertië',
  'RU-ULY': 'Oblast Oeljanovsk',
  'RU-VGG': 'Oblast Wolgograd',
  'RU-VLA': 'Oblast Vladimir',
  'RU-VLG': 'Oblast Vologda',
  'RU-VOR': 'Oblast Voronezj',
  'RU-YAN': 'Jamalië',
  'RU-YAR': 'Oblast Jaroslavl',
  'RU-YEV': 'Joodse Autonome Oblast',
  'RU-ZAB': 'Kraj Transbaikal',
};

/** De 28 staten en 8 unieterritoria van India, op ISO 3166-2-code. */
export const INDIA_NL = {
  'IN-AN': 'Andamanen en Nicobaren',
  'IN-AP': 'Andhra Pradesh',
  'IN-AR': 'Arunachal Pradesh',
  'IN-AS': 'Assam',
  'IN-BR': 'Bihar',
  'IN-CH': 'Chandigarh',
  'IN-CT': 'Chhattisgarh',
  'IN-DH': 'Dadra en Nagar Haveli en Daman en Diu',
  'IN-DL': 'Delhi',
  'IN-GA': 'Goa',
  'IN-GJ': 'Gujarat',
  'IN-HP': 'Himachal Pradesh',
  'IN-HR': 'Haryana',
  'IN-JH': 'Jharkhand',
  'IN-JK': 'Jammu en Kasjmir',
  'IN-KA': 'Karnataka',
  'IN-KL': 'Kerala',
  'IN-LA': 'Ladakh',
  'IN-LD': 'Lakshadweep',
  'IN-MH': 'Maharashtra',
  'IN-ML': 'Meghalaya',
  'IN-MN': 'Manipur',
  'IN-MP': 'Madhya Pradesh',
  'IN-MZ': 'Mizoram',
  'IN-NL': 'Nagaland',
  'IN-OR': 'Odisha',
  'IN-PB': 'Punjab',
  'IN-PY': 'Puducherry',
  'IN-RJ': 'Rajasthan',
  'IN-SK': 'Sikkim',
  'IN-TG': 'Telangana',
  'IN-TN': 'Tamil Nadu',
  'IN-TR': 'Tripura',
  'IN-UP': 'Uttar Pradesh',
  'IN-UT': 'Uttarakhand',
  'IN-WB': 'West-Bengalen',
};

/**
 * De provincies, autonome regio's, stadsprovincies en speciale bestuurlijke regio's van
 * China, op ISO 3166-2-code. De meeste in pinyin; enkel waar het Nederlands een eigen naam
 * heeft wijkt die af (Peking, Tibet, Binnen-Mongolië, Hongkong).
 */
export const CHINA_NL = {
  'CN-AH': 'Anhui',
  'CN-BJ': 'Peking',
  'CN-CQ': 'Chongqing',
  'CN-FJ': 'Fujian',
  'CN-GD': 'Guangdong',
  'CN-GS': 'Gansu',
  'CN-GX': 'Guangxi',
  'CN-GZ': 'Guizhou',
  'CN-HA': 'Henan',
  'CN-HB': 'Hubei',
  'CN-HE': 'Hebei',
  'CN-HI': 'Hainan',
  'CN-HK': 'Hongkong',
  'CN-HL': 'Heilongjiang',
  'CN-HN': 'Hunan',
  'CN-JL': 'Jilin',
  'CN-JS': 'Jiangsu',
  'CN-JX': 'Jiangxi',
  'CN-LN': 'Liaoning',
  'CN-MO': 'Macau',
  'CN-NM': 'Binnen-Mongolië',
  'CN-NX': 'Ningxia',
  'CN-QH': 'Qinghai',
  'CN-SC': 'Sichuan',
  'CN-SD': 'Shandong',
  'CN-SH': 'Shanghai',
  'CN-SN': 'Shaanxi',
  'CN-SX': 'Shanxi',
  'CN-TJ': 'Tianjin',
  'CN-XJ': 'Xinjiang',
  'CN-XZ': 'Tibet',
  'CN-YN': 'Yunnan',
  'CN-ZJ': 'Zhejiang',
};

/** De 38 provincies van Indonesië, zoals de Nederlandstalige Wikipedia ze noemt. */
export const INDONESIE_NL = {
  'ID-AC': 'Atjeh',
  'ID-BA': 'Bali',
  'ID-BB': 'Bangka-Belitung',
  'ID-BE': 'Bengkulu',
  'ID-BT': 'Banten',
  'ID-GO': 'Gorontalo',
  'ID-JA': 'Jambi',
  'ID-JB': 'West-Java',
  'ID-JI': 'Oost-Java',
  'ID-JK': 'Jakarta',
  'ID-JT': 'Midden-Java',
  'ID-KB': 'West-Kalimantan',
  'ID-KI': 'Oost-Kalimantan',
  'ID-KR': 'Riau-archipel',
  'ID-KS': 'Zuid-Kalimantan',
  'ID-KT': 'Midden-Kalimantan',
  'ID-KU': 'Noord-Kalimantan',
  'ID-LA': 'Lampung',
  'ID-MA': 'Molukken',
  'ID-MU': 'Noord-Molukken',
  'ID-NB': 'West-Nusa Tenggara',
  'ID-NT': 'Oost-Nusa Tenggara',
  'ID-PA': 'Papoea',
  'ID-PB': 'West-Papoea',
  'ID-PD': 'Zuidwest-Papoea',
  'ID-PE': 'Papoea-Gebergte',
  'ID-PS': 'Zuid-Papoea',
  'ID-PT': 'Centraal-Papoea',
  'ID-RI': 'Riau',
  'ID-SA': 'Noord-Sulawesi',
  'ID-SB': 'West-Sumatra',
  'ID-SG': 'Zuidoost-Sulawesi',
  'ID-SN': 'Zuid-Sulawesi',
  'ID-SR': 'West-Sulawesi',
  'ID-SS': 'Zuid-Sumatra',
  'ID-ST': 'Midden-Sulawesi',
  'ID-SU': 'Noord-Sumatra',
  'ID-YO': 'Yogyakarta',
};

/** De acht federale districten van Rusland, van west naar oost. */
export const RUSLAND_DISTRICT_NL = {
  central: 'Centraal Federaal District',
  northwest: 'Noordwestelijk Federaal District',
  south: 'Zuidelijk Federaal District',
  caucasus: 'Noord-Kaukasisch Federaal District',
  volga: 'Federaal District Wolga',
  urals: 'Federaal District Oeral',
  siberia: 'Siberisch Federaal District',
  fareast: 'Federaal District Verre Oosten',
};
