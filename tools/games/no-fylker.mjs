/**
 * Noorwegen (fylker) — de vijftien fylker.
 *
 * Noorwegen voegde zijn fylker in 2020 samen tot elf en draaide dat in 2024 grotendeels
 * terug; dit is de indeling van daarna.
 *
 * De bron geeft de noordelijke fylker met hun Samische naam erbij — Troms/Romsa/Tromssa,
 * Finnmark/Finnmárku/Finmarkku. Op de kaart staat alleen het Noorse deel, anders past de
 * vraag niet in het paneel. Jan Mayen en Svalbard horen bij Noorwegen maar zijn geen
 * fylke, en vallen weg: met Svalbard erbij loopt de kaart door tot 81 graden
 * noorderbreedte en wordt het vasteland een streepje onderaan.
 *
 * Bron: de NUTS-indeling van Eurostat, die voor Noorwegen samenvalt met de fylker. Eén
 * pan-Europees bestand, dus één download voor alle spellen die eruit komen; prepare()
 * houdt enkel dit land over.
 */

export default {
  id: 'no-fylker',
  country: 'Noorwegen',
  regionType: 'fylker',
  region: { one: 'fylke', many: 'fylker' },
  idLabel: 'NUTS-code',

  languages: [{ code: 'no', label: 'Noors' }],

  levels: [],

  source: {
    credit: 'Eurostat (GISCO) / © EuroGeographics',
    name: 'Eurostat GISCO, NUTS 2024 (1:1 miljoen) — grenzen © EuroGeographics',
    url: 'https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics',
    license: 'Vrij te gebruiken met bronvermelding — © EuroGeographics voor de grenzen',
  },

  build: {
    url:
      'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/' +
      'NUTS_RG_01M_2024_4326_LEVL_3.geojson',
    cache: 'gisco-nuts3',
    // De bron is al veralgemeend tot 1:1 miljoen, maar deze kust is grillig genoeg om nog
    // wat te kunnen missen.
    simplify: '70%',
    year: '2024',
    prepare(p) {
      if (p.CNTR_CODE !== 'NO') return null;
      if (p.NUTS_ID === 'NO0B1' || p.NUTS_ID === 'NO0B2') return null;   // Jan Mayen, Svalbard
      return { id: p.NUTS_ID, names: { no: p.NAME_LATN.split('/')[0] }, groups: [] };
    },
  },
};
