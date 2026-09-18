/**
 * Nederland (gemeenten) — de actuele gemeenten, met de provincie als gebiedskeuze.
 *
 * Bron: de WFS "Bestuurlijke gebieden" van het Kadaster via PDOK. Die geeft per
 * gemeente meteen de provincie mee, dus er is geen ruimtelijke koppeling nodig.
 * Er zit geen jaargang in de data: de dienst beschrijft de toestand van vandaag,
 * en het spel toont daarom de bouwdatum.
 */

export default {
  id: 'nl-gemeenten',
  country: 'Nederland',
  regionType: 'gemeenten',
  region: { one: 'gemeente', many: 'gemeenten' },
  idLabel: 'Gemeentecode',

  languages: [{ code: 'nl', label: 'Nederlands' }],

  levels: [{ one: 'Provincie', many: 'Provincies' }],

  source: {
    credit: 'Kadaster / PDOK',
    name: 'Bestuurlijke gebieden (Kadaster), via PDOK',
    url: 'https://www.pdok.nl/introductie/-/article/bestuurlijke-gebieden',
    license: 'CC BY 4.0 — bronvermelding vereist',
  },

  build: {
    url:
      'https://service.pdok.nl/kadaster/bestuurlijkegebieden/wfs/v1_0' +
      '?request=GetFeature&service=WFS&version=2.0.0' +
      '&typeNames=bestuurlijkegebieden:Gemeentegebied' +
      '&outputFormat=application/json&srsName=urn:ogc:def:crs:EPSG::4326',
    cache: 'nl-gemeentegebied',
    simplify: '15%',
    year: null,
    prepare(p) {
      return {
        id: p.identificatie || `GM${p.code}`,
        names: { nl: p.naam },
        groups: [p.ligtInProvincieNaam],
      };
    },
  },
};
