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
