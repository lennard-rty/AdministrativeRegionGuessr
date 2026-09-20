/**
 * België (deelgemeenten) — de 2.664 deelgemeenten: de voormalige gemeenten die bij de
 * fusies in de huidige 565 opgingen en als naam en als stuk kaart zijn blijven bestaan.
 *
 * Het grootste spel van de reeks. Speel het per arrondissement (± 60 deelgemeenten) of
 * per provincie; "heel België" is een zit van een paar uur.
 *
 * Twee dingen die de bron niet oplost:
 *
 * 1. Namen zijn niet uniek — er is een Heusden bij Destelbergen en een Heusden bij
 *    Heusden-Zolder, en zo zijn er 46 namen voor 96 deelgemeenten, Beveren zelfs vier
 *    keer. Een vraag "Heusden" is dan niet te beantwoorden, dus krijgen net die 96 hun
 *    gemeente erbij: "Heusden (Destelbergen)". Alleen zij: achter een naam die maar één
 *    keer voorkomt lost een gemeente niets op en verklapt ze enkel waar je moet zoeken.
 *    Binnen zo'n groep houdt de deelgemeente die haar gemeente haar naam gaf de hare
 *    kaal — naast "Aalst (Sint-Truiden)" staat gewoon "Aalst", niet "Aalst (Aalst)". Zo
 *    dragen 85 van de 2.664 namen een gemeente, en blijven ze allemaal uniek. Het
 *    ontdubbelen gebeurt per taal, in names() hieronder: wat in de ene taal dubbel is,
 *    is het in de andere niet.
 * 2. Elke deelgemeente heeft maar de naam van haar eigen taalgebied; de andere twee
 *    velden zijn leeg. Vandaar de terugval nl -> fr -> de: een Waalse deelgemeente heet
 *    ook in het Nederlandse spel Orroir, en de 25 Oostkantonse houden hun Duitse naam
 *    (Recht, Sankt Vith).
 */

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

/** De naam in de gevraagde taal, of de enige naam die de bron kent. */
const naam = (p, lang) =>
  first(p['smun_name_' + lang]) || first(p.smun_name_nl) ||
  first(p.smun_name_fr) || first(p.smun_name_de);

const gemeente = (p, lang) => first(p['mun_name_' + lang]) || first(p.mun_name_nl);

export default {
  id: 'be-deelgemeenten',
  country: 'België',
  regionType: 'deelgemeenten',
  region: { one: 'deelgemeente', many: 'deelgemeenten' },
  idLabel: 'NIS-code',

  languages: [
    { code: 'nl', label: 'Nederlands' },
    { code: 'fr', label: 'Frans' },
    { code: 'de', label: 'Duits' },
  ],

  levels: [
    {
      one: 'Gewest',
      many: 'Gewesten',
      order: ['Vlaams Gewest', 'Waals Gewest', 'Brussels Hoofdstedelijk Gewest'],
    },
    { one: 'Provincie', many: 'Provincies' },
    { one: 'Arrondissement', many: 'Arrondissementen' },
  ],

  source: {
    credit: 'Statbel',
    name: 'Statbel (FOD Economie) via Opendatasoft "georef-belgium-submunicipality"',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-belgium-submunicipality/',
    license: 'Open data Statbel — bronvermelding vereist',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-belgium-submunicipality/exports/geojson?lang=nl&timezone=Europe%2FBrussels',
    cache: 'be-submunicipality',
    // Dezelfde maat als het gemeentespel: deelgemeentegrenzen bekijk je even ver ingezoomd
    // als gemeentegrenzen, dus mogen ze niet grover zijn. Kost 2,8 in plaats van 2,2 MB.
    simplify: '15%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      return {
        id: first(p.smun_code),
        names: { nl: naam(p, 'nl'), fr: naam(p, 'fr'), de: naam(p, 'de') },
        // Blijft in het spelbestand buiten beeld; names() hieronder heeft het nodig.
        gemeente: { nl: gemeente(p, 'nl'), fr: gemeente(p, 'fr'), de: gemeente(p, 'de') },
        // De negentien Brusselse gemeenten vallen onder geen provincie.
        groups: [first(p.reg_name_nl), first(p.prov_name_nl) || '', first(p.arr_name_nl)],
      };
    },
    /** Zet de gemeente achter elke naam die meer dan één deelgemeente draagt. */
    names(regions, langs) {
      langs.forEach((lang) => {
        const aantal = new Map();
        regions.forEach((r) => aantal.set(r.names[lang], (aantal.get(r.names[lang]) || 0) + 1));
        regions.forEach((r) => {
          const mun = r.gemeente[lang];
          if (aantal.get(r.names[lang]) > 1 && mun && r.names[lang] !== mun) {
            r.names[lang] += ' (' + mun + ')';
          }
        });
      });
    },
  },
};
