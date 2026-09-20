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
