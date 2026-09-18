// Automatisch gegenereerd door tools/build-data.mjs — niet met de hand bewerken.
// De spellen zelf staan beschreven in tools/games/; hier staat enkel wat het
// startscherm en het spelpaneel nodig hebben.
window.ARG_GAMES = [
  {
    "id": "be-gemeenten",
    "country": "België",
    "regionType": "gemeenten",
    "region": {
      "one": "gemeente",
      "many": "gemeenten"
    },
    "idLabel": "NIS-code",
    "languages": [
      {
        "code": "nl",
        "label": "Nederlands"
      },
      {
        "code": "fr",
        "label": "Frans"
      },
      {
        "code": "de",
        "label": "Duits"
      }
    ],
    "levels": [
      {
        "one": "Gewest",
        "many": "Gewesten",
        "order": [
          "Vlaams Gewest",
          "Waals Gewest",
          "Brussels Hoofdstedelijk Gewest"
        ]
      },
      {
        "one": "Provincie",
        "many": "Provincies",
        "order": null
      }
    ],
    "file": "data/be-gemeenten.js",
    "count": 565,
    "year": "2025",
    "generated": "2026-09-18",
    "source": {
      "credit": "Statbel",
      "name": "Statbel (FOD Economie) via Opendatasoft \"georef-belgium-municipality\"",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-belgium-municipality/",
      "license": "Open data Statbel — bronvermelding vereist"
    }
  },
  {
    "id": "be-provincies",
    "country": "België",
    "regionType": "provincies",
    "region": {
      "one": "provincie",
      "many": "provincies"
    },
    "idLabel": "NIS-code",
    "languages": [
      {
        "code": "nl",
        "label": "Nederlands"
      },
      {
        "code": "fr",
        "label": "Frans"
      },
      {
        "code": "de",
        "label": "Duits"
      }
    ],
    "levels": [
      {
        "one": "Gewest",
        "many": "Gewesten",
        "order": [
          "Vlaams Gewest",
          "Waals Gewest",
          "Brussels Hoofdstedelijk Gewest"
        ]
      }
    ],
    "file": "data/be-provincies.js",
    "count": 11,
    "year": "2025",
    "generated": "2026-09-18",
    "source": {
      "credit": "Statbel",
      "name": "Statbel (FOD Economie) via Opendatasoft \"georef-belgium-municipality\"",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-belgium-municipality/",
      "license": "Open data Statbel — bronvermelding vereist"
    }
  },
  {
    "id": "nl-gemeenten",
    "country": "Nederland",
    "regionType": "gemeenten",
    "region": {
      "one": "gemeente",
      "many": "gemeenten"
    },
    "idLabel": "Gemeentecode",
    "languages": [
      {
        "code": "nl",
        "label": "Nederlands"
      }
    ],
    "levels": [
      {
        "one": "Provincie",
        "many": "Provincies",
        "order": null
      }
    ],
    "file": "data/nl-gemeenten.js",
    "count": 342,
    "year": null,
    "generated": "2026-09-18",
    "source": {
      "credit": "Kadaster / PDOK",
      "name": "Bestuurlijke gebieden (Kadaster), via PDOK",
      "url": "https://www.pdok.nl/introductie/-/article/bestuurlijke-gebieden",
      "license": "CC BY 4.0 — bronvermelding vereist"
    }
  }
];
