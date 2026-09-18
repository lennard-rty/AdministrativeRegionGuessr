/**
 * Nederland (provincies) — de twaalf provincies.
 *
 * Afgeleid spel: het gebruikt dezelfde brondata als nl-gemeenten en laat mapshaper de
 * gemeentegrenzen binnen elke provincie wegsmelten (build.dissolve). Zo sluiten de
 * provinciegrenzen exact aan op die van het gemeentespel.
 *
 * Geen gebiedsniveaus: met twaalf provincies valt er weinig te filteren, dus het spel
 * toont geen gebiedskeuze.
 */

export default {
  id: 'nl-provincies',
  country: 'Nederland',
  regionType: 'provincies',
  region: { one: 'provincie', many: 'provincies' },
  idLabel: 'Provinciecode',

  languages: [{ code: 'nl', label: 'Nederlands' }],

  levels: [],

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
    cache: 'nl-gemeentegebied',   // zelfde download als nl-gemeenten
    dissolve: true,
    simplify: '25%',              // veel minder vormen, dus mag fijner
    year: null,
    prepare(p) {
      return {
        id: p.ligtInProvincieCode,
        names: { nl: p.ligtInProvincieNaam },
        groups: [],
      };
    },
  },
};
