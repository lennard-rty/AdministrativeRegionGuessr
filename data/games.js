// Automatisch gegenereerd door tools/build-data.mjs — niet met de hand bewerken.
// De spellen zelf staan beschreven in tools/games/; hier staat enkel wat het
// startscherm en het spelpaneel nodig hebben.
window.ARG_GAMES = [
  {
    "id": "be-arrondissementen",
    "country": "België",
    "regionType": "arrondissementen",
    "region": {
      "one": "arrondissement",
      "many": "arrondissementen"
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
    "defaultArea": null,
    "file": "data/be-arrondissementen.js",
    "count": 43,
    "year": "2025",
    "generated": "2026-09-19",
    "source": {
      "credit": "Statbel",
      "name": "Statbel (FOD Economie) via Opendatasoft \"georef-belgium-municipality\"",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-belgium-municipality/",
      "license": "Open data Statbel — bronvermelding vereist"
    }
  },
  {
    "id": "be-deelgemeenten",
    "country": "België",
    "regionType": "deelgemeenten",
    "region": {
      "one": "deelgemeente",
      "many": "deelgemeenten"
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
      },
      {
        "one": "Arrondissement",
        "many": "Arrondissementen",
        "order": null
      }
    ],
    "defaultArea": null,
    "file": "data/be-deelgemeenten.js",
    "count": 2664,
    "year": "2025",
    "generated": "2026-09-20",
    "source": {
      "credit": "Statbel",
      "name": "Statbel (FOD Economie) via Opendatasoft \"georef-belgium-submunicipality\"",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-belgium-submunicipality/",
      "license": "Open data Statbel — bronvermelding vereist"
    }
  },
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
    "defaultArea": null,
    "file": "data/be-gemeenten.js",
    "count": 565,
    "year": "2025",
    "generated": "2026-09-19",
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
    "defaultArea": null,
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
    "id": "dk-regios",
    "country": "Denemarken",
    "regionType": "regio's",
    "region": {
      "one": "regio",
      "many": "regio's"
    },
    "idLabel": "NUTS-code",
    "languages": [
      {
        "code": "da",
        "label": "Deens"
      }
    ],
    "levels": [],
    "defaultArea": null,
    "file": "data/dk-regios.js",
    "count": 5,
    "year": "2024",
    "generated": "2026-09-20",
    "source": {
      "credit": "Eurostat (GISCO) / © EuroGeographics",
      "name": "Eurostat GISCO, NUTS 2024 (1:1 miljoen) — grenzen © EuroGeographics",
      "url": "https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics",
      "license": "Vrij te gebruiken met bronvermelding — © EuroGeographics voor de grenzen"
    }
  },
  {
    "id": "de-deelstaten",
    "country": "Duitsland",
    "regionType": "deelstaten",
    "region": {
      "one": "deelstaat",
      "many": "deelstaten"
    },
    "idLabel": "Deelstaatcode",
    "languages": [
      {
        "code": "nl",
        "label": "Nederlands"
      },
      {
        "code": "de",
        "label": "Duits"
      }
    ],
    "levels": [],
    "defaultArea": null,
    "file": "data/de-deelstaten.js",
    "count": 16,
    "year": "2025",
    "generated": "2026-09-19",
    "source": {
      "credit": "Destatis / Opendatasoft",
      "name": "Opendatasoft \"georef-germany-land\" (Statistisches Bundesamt)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-germany-land/",
      "license": "Datenlizenz Deutschland – Namensnennung 2.0"
    }
  },
  {
    "id": "de-kreise",
    "country": "Duitsland",
    "regionType": "Kreise",
    "region": {
      "one": "Kreis",
      "many": "Kreise"
    },
    "idLabel": "Kreiscode",
    "languages": [
      {
        "code": "de",
        "label": "Duits"
      }
    ],
    "levels": [
      {
        "one": "Deelstaat",
        "many": "Deelstaten",
        "order": null
      }
    ],
    "defaultArea": null,
    "file": "data/de-kreise.js",
    "count": 400,
    "year": "2025",
    "generated": "2026-09-19",
    "source": {
      "credit": "Destatis / Opendatasoft",
      "name": "Opendatasoft \"georef-germany-kreis\" (Statistisches Bundesamt)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-germany-kreis/",
      "license": "Datenlizenz Deutschland – Namensnennung 2.0"
    }
  },
  {
    "id": "fi-landschappen",
    "country": "Finland",
    "regionType": "landschappen",
    "region": {
      "one": "landschap",
      "many": "landschappen"
    },
    "idLabel": "NUTS-code",
    "languages": [
      {
        "code": "fi",
        "label": "Fins"
      }
    ],
    "levels": [],
    "defaultArea": null,
    "file": "data/fi-landschappen.js",
    "count": 19,
    "year": "2024",
    "generated": "2026-09-20",
    "source": {
      "credit": "Eurostat (GISCO) / © EuroGeographics",
      "name": "Eurostat GISCO, NUTS 2024 (1:1 miljoen) — grenzen © EuroGeographics",
      "url": "https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics",
      "license": "Vrij te gebruiken met bronvermelding — © EuroGeographics voor de grenzen"
    }
  },
  {
    "id": "fr-arrondissementen",
    "country": "Frankrijk",
    "regionType": "arrondissementen",
    "region": {
      "one": "arrondissement",
      "many": "arrondissementen"
    },
    "idLabel": "Arrondissementsnummer",
    "languages": [
      {
        "code": "fr",
        "label": "Frans"
      }
    ],
    "levels": [
      {
        "one": "Gebiedsdeel",
        "many": "Gebiedsdelen",
        "order": [
          "Europees Frankrijk",
          "Overzeese departementen"
        ]
      },
      {
        "one": "Regio",
        "many": "Regio's",
        "order": null
      },
      {
        "one": "Departement",
        "many": "Departementen",
        "order": null
      }
    ],
    "defaultArea": "Europees Frankrijk",
    "file": "data/fr-arrondissementen.js",
    "count": 333,
    "year": "2025",
    "generated": "2026-09-19",
    "source": {
      "credit": "IGN / Opendatasoft",
      "name": "Opendatasoft \"georef-france-arrondissement-departemental\" (grenzen van het IGN)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-france-arrondissement-departemental/",
      "license": "Licence Ouverte / Open Licence 2.0 — bronvermelding vereist"
    }
  },
  {
    "id": "fr-departementen",
    "country": "Frankrijk",
    "regionType": "departementen",
    "region": {
      "one": "departement",
      "many": "departementen"
    },
    "idLabel": "Departementsnummer",
    "languages": [
      {
        "code": "fr",
        "label": "Frans"
      }
    ],
    "levels": [
      {
        "one": "Gebiedsdeel",
        "many": "Gebiedsdelen",
        "order": [
          "Europees Frankrijk",
          "Overzeese departementen"
        ]
      },
      {
        "one": "Regio",
        "many": "Regio's",
        "order": null
      }
    ],
    "defaultArea": "Europees Frankrijk",
    "file": "data/fr-departementen.js",
    "count": 101,
    "year": "2025",
    "generated": "2026-09-18",
    "source": {
      "credit": "IGN / Opendatasoft",
      "name": "Opendatasoft \"georef-france-departement\" (grenzen van het IGN)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-france-departement/",
      "license": "Licence Ouverte / Open Licence 2.0 — bronvermelding vereist"
    }
  },
  {
    "id": "fr-regios",
    "country": "Frankrijk",
    "regionType": "regio's",
    "region": {
      "one": "regio",
      "many": "regio's"
    },
    "idLabel": "Regiocode",
    "languages": [
      {
        "code": "fr",
        "label": "Frans"
      }
    ],
    "levels": [
      {
        "one": "Gebiedsdeel",
        "many": "Gebiedsdelen",
        "order": [
          "Europees Frankrijk",
          "Overzeese regio's"
        ]
      }
    ],
    "defaultArea": "Europees Frankrijk",
    "file": "data/fr-regios.js",
    "count": 18,
    "year": "2025",
    "generated": "2026-09-19",
    "source": {
      "credit": "IGN / Opendatasoft",
      "name": "Opendatasoft \"georef-france-departement\" (grenzen van het IGN)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-france-departement/",
      "license": "Licence Ouverte / Open Licence 2.0 — bronvermelding vereist"
    }
  },
  {
    "id": "ie-graafschappen",
    "country": "Ierland",
    "regionType": "graafschappen",
    "region": {
      "one": "graafschap",
      "many": "graafschappen"
    },
    "idLabel": "Graafschapscode",
    "languages": [
      {
        "code": "en",
        "label": "Engels"
      },
      {
        "code": "ga",
        "label": "Iers"
      }
    ],
    "levels": [
      {
        "one": "Provincie",
        "many": "Provincies",
        "order": [
          "Leinster",
          "Munster",
          "Connacht",
          "Ulster"
        ]
      }
    ],
    "defaultArea": null,
    "file": "data/ie-graafschappen.js",
    "count": 26,
    "year": "2019",
    "generated": "2026-09-20",
    "source": {
      "credit": "Tailte Éireann",
      "name": "Tailte Éireann — Counties, National Statutory Boundaries (generalised 20 m)",
      "url": "https://data-osi.opendata.arcgis.com/",
      "license": "CC BY 4.0 — bronvermelding vereist"
    }
  },
  {
    "id": "it-provincies",
    "country": "Italië",
    "regionType": "provincies",
    "region": {
      "one": "provincie",
      "many": "provincies"
    },
    "idLabel": "ISTAT-code",
    "languages": [
      {
        "code": "it",
        "label": "Italiaans"
      }
    ],
    "levels": [
      {
        "one": "Landsdeel",
        "many": "Landsdelen",
        "order": [
          "Noordwest-Italië",
          "Noordoost-Italië",
          "Midden-Italië",
          "Zuid-Italië",
          "Eilanden"
        ]
      },
      {
        "one": "Regio",
        "many": "Regio's",
        "order": null
      }
    ],
    "defaultArea": null,
    "file": "data/it-provincies.js",
    "count": 107,
    "year": "2022",
    "generated": "2026-09-20",
    "source": {
      "credit": "ISTAT / Opendatasoft",
      "name": "Opendatasoft \"georef-italy-provincia\" (Istituto Nazionale di Statistica)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-italy-provincia/",
      "license": "CC BY 4.0 — bronvermelding vereist"
    }
  },
  {
    "id": "it-regios",
    "country": "Italië",
    "regionType": "regio's",
    "region": {
      "one": "regio",
      "many": "regio's"
    },
    "idLabel": "ISTAT-code",
    "languages": [
      {
        "code": "nl",
        "label": "Nederlands"
      },
      {
        "code": "it",
        "label": "Italiaans"
      }
    ],
    "levels": [
      {
        "one": "Landsdeel",
        "many": "Landsdelen",
        "order": [
          "Noordwest-Italië",
          "Noordoost-Italië",
          "Midden-Italië",
          "Zuid-Italië",
          "Eilanden"
        ]
      }
    ],
    "defaultArea": null,
    "file": "data/it-regios.js",
    "count": 20,
    "year": "2022",
    "generated": "2026-09-20",
    "source": {
      "credit": "ISTAT / Opendatasoft",
      "name": "Opendatasoft \"georef-italy-provincia\" (Istituto Nazionale di Statistica)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-italy-provincia/",
      "license": "CC BY 4.0 — bronvermelding vereist"
    }
  },
  {
    "id": "lu-gemeenten",
    "country": "Luxemburg",
    "regionType": "gemeenten",
    "region": {
      "one": "gemeente",
      "many": "gemeenten"
    },
    "idLabel": "LAU-code",
    "languages": [
      {
        "code": "fr",
        "label": "Frans"
      }
    ],
    "levels": [
      {
        "one": "Kanton",
        "many": "Kantons",
        "order": null
      }
    ],
    "defaultArea": null,
    "file": "data/lu-gemeenten.js",
    "count": 100,
    "year": "2023",
    "generated": "2026-09-20",
    "source": {
      "credit": "ACT / data.public.lu",
      "name": "Limites administratives du Grand-Duché de Luxembourg (Administration du cadastre et de la topographie)",
      "url": "https://data.public.lu/en/datasets/limites-administratives-du-grand-duche-de-luxembourg/",
      "license": "CC0 — vrij te gebruiken"
    }
  },
  {
    "id": "lu-kantons",
    "country": "Luxemburg",
    "regionType": "kantons",
    "region": {
      "one": "kanton",
      "many": "kantons"
    },
    "idLabel": "Kantonnummer",
    "languages": [
      {
        "code": "fr",
        "label": "Frans"
      }
    ],
    "levels": [],
    "defaultArea": null,
    "file": "data/lu-kantons.js",
    "count": 12,
    "year": "2023",
    "generated": "2026-09-20",
    "source": {
      "credit": "ACT / data.public.lu",
      "name": "Limites administratives du Grand-Duché de Luxembourg (Administration du cadastre et de la topographie)",
      "url": "https://data.public.lu/en/datasets/limites-administratives-du-grand-duche-de-luxembourg/",
      "license": "CC0 — vrij te gebruiken"
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
    "defaultArea": null,
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
  },
  {
    "id": "nl-provincies",
    "country": "Nederland",
    "regionType": "provincies",
    "region": {
      "one": "provincie",
      "many": "provincies"
    },
    "idLabel": "Provinciecode",
    "languages": [
      {
        "code": "nl",
        "label": "Nederlands"
      }
    ],
    "levels": [],
    "defaultArea": null,
    "file": "data/nl-provincies.js",
    "count": 12,
    "year": null,
    "generated": "2026-09-18",
    "source": {
      "credit": "Kadaster / PDOK",
      "name": "Bestuurlijke gebieden (Kadaster), via PDOK",
      "url": "https://www.pdok.nl/introductie/-/article/bestuurlijke-gebieden",
      "license": "CC BY 4.0 — bronvermelding vereist"
    }
  },
  {
    "id": "no-fylker",
    "country": "Noorwegen",
    "regionType": "fylker",
    "region": {
      "one": "fylke",
      "many": "fylker"
    },
    "idLabel": "NUTS-code",
    "languages": [
      {
        "code": "no",
        "label": "Noors"
      }
    ],
    "levels": [],
    "defaultArea": null,
    "file": "data/no-fylker.js",
    "count": 15,
    "year": "2024",
    "generated": "2026-09-20",
    "source": {
      "credit": "Eurostat (GISCO) / © EuroGeographics",
      "name": "Eurostat GISCO, NUTS 2024 (1:1 miljoen) — grenzen © EuroGeographics",
      "url": "https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics",
      "license": "Vrij te gebruiken met bronvermelding — © EuroGeographics voor de grenzen"
    }
  },
  {
    "id": "at-bezirke",
    "country": "Oostenrijk",
    "regionType": "Bezirke",
    "region": {
      "one": "Bezirk",
      "many": "Bezirke"
    },
    "idLabel": "Districtscode",
    "languages": [
      {
        "code": "de",
        "label": "Duits"
      }
    ],
    "levels": [
      {
        "one": "Deelstaat",
        "many": "Deelstaten",
        "order": null
      }
    ],
    "defaultArea": null,
    "file": "data/at-bezirke.js",
    "count": 94,
    "year": "2026",
    "generated": "2026-09-20",
    "source": {
      "credit": "STATISTIK AUSTRIA",
      "name": "STATISTIK AUSTRIA — Gliederung Österreichs in politische Bezirke",
      "url": "https://data.statistik.gv.at/web/meta.jsp?dataset=OGDEXT_POLBEZ_1",
      "license": "CC BY 4.0 — bronvermelding vereist"
    }
  },
  {
    "id": "at-deelstaten",
    "country": "Oostenrijk",
    "regionType": "deelstaten",
    "region": {
      "one": "deelstaat",
      "many": "deelstaten"
    },
    "idLabel": "NUTS-code",
    "languages": [
      {
        "code": "nl",
        "label": "Nederlands"
      },
      {
        "code": "de",
        "label": "Duits"
      }
    ],
    "levels": [],
    "defaultArea": null,
    "file": "data/at-deelstaten.js",
    "count": 9,
    "year": "2024",
    "generated": "2026-09-20",
    "source": {
      "credit": "Eurostat (GISCO) / © EuroGeographics",
      "name": "Eurostat GISCO, NUTS 2024 (1:1 miljoen) — grenzen © EuroGeographics",
      "url": "https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics",
      "license": "Vrij te gebruiken met bronvermelding — © EuroGeographics voor de grenzen"
    }
  },
  {
    "id": "pl-woiwodschappen",
    "country": "Polen",
    "regionType": "woiwodschappen",
    "region": {
      "one": "woiwodschap",
      "many": "woiwodschappen"
    },
    "idLabel": "NUTS-code",
    "languages": [
      {
        "code": "pl",
        "label": "Pools"
      }
    ],
    "levels": [],
    "defaultArea": null,
    "file": "data/pl-woiwodschappen.js",
    "count": 16,
    "year": "2024",
    "generated": "2026-09-20",
    "source": {
      "credit": "Eurostat (GISCO) / © EuroGeographics",
      "name": "Eurostat GISCO, NUTS 2024 (1:1 miljoen) — grenzen © EuroGeographics",
      "url": "https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics",
      "license": "Vrij te gebruiken met bronvermelding — © EuroGeographics voor de grenzen"
    }
  },
  {
    "id": "pt-districten",
    "country": "Portugal",
    "regionType": "districten",
    "region": {
      "one": "district",
      "many": "districten"
    },
    "idLabel": "Districtscode",
    "languages": [
      {
        "code": "pt",
        "label": "Portugees"
      }
    ],
    "levels": [
      {
        "one": "Gebiedsdeel",
        "many": "Gebiedsdelen",
        "order": [
          "Vasteland",
          "Autonome regio’s"
        ]
      }
    ],
    "defaultArea": "Vasteland",
    "file": "data/pt-districten.js",
    "count": 20,
    "year": "2024",
    "generated": "2026-09-20",
    "source": {
      "credit": "DGT / Opendatasoft",
      "name": "Opendatasoft \"georef-portugal-distrito\" (Direção-Geral do Território)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-portugal-distrito/",
      "license": "Open data DGT — bronvermelding vereist"
    }
  },
  {
    "id": "es-gemeenschappen",
    "country": "Spanje",
    "regionType": "autonome gemeenschappen",
    "region": {
      "one": "autonome gemeenschap",
      "many": "autonome gemeenschappen"
    },
    "idLabel": "INE-code",
    "languages": [
      {
        "code": "nl",
        "label": "Nederlands"
      },
      {
        "code": "es",
        "label": "Spaans"
      }
    ],
    "levels": [
      {
        "one": "Gebiedsdeel",
        "many": "Gebiedsdelen",
        "order": [
          "Vasteland en Balearen",
          "Canarische Eilanden"
        ]
      }
    ],
    "defaultArea": "Vasteland en Balearen",
    "file": "data/es-gemeenschappen.js",
    "count": 19,
    "year": "2022",
    "generated": "2026-09-20",
    "source": {
      "credit": "INE / Opendatasoft",
      "name": "Opendatasoft \"georef-spain-provincia\" (Instituto Nacional de Estadística)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-spain-provincia/",
      "license": "Open data INE — bronvermelding vereist"
    }
  },
  {
    "id": "es-provincies",
    "country": "Spanje",
    "regionType": "provincies",
    "region": {
      "one": "provincie",
      "many": "provincies"
    },
    "idLabel": "INE-code",
    "languages": [
      {
        "code": "es",
        "label": "Spaans"
      }
    ],
    "levels": [
      {
        "one": "Gebiedsdeel",
        "many": "Gebiedsdelen",
        "order": [
          "Vasteland en Balearen",
          "Canarische Eilanden"
        ]
      },
      {
        "one": "Autonome gemeenschap",
        "many": "Autonome gemeenschappen",
        "order": null
      }
    ],
    "defaultArea": "Vasteland en Balearen",
    "file": "data/es-provincies.js",
    "count": 52,
    "year": "2022",
    "generated": "2026-09-20",
    "source": {
      "credit": "INE / Opendatasoft",
      "name": "Opendatasoft \"georef-spain-provincia\" (Instituto Nacional de Estadística)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-spain-provincia/",
      "license": "Open data INE — bronvermelding vereist"
    }
  },
  {
    "id": "cz-kraje",
    "country": "Tsjechië",
    "regionType": "kraje",
    "region": {
      "one": "kraj",
      "many": "kraje"
    },
    "idLabel": "NUTS-code",
    "languages": [
      {
        "code": "cs",
        "label": "Tsjechisch"
      }
    ],
    "levels": [],
    "defaultArea": null,
    "file": "data/cz-kraje.js",
    "count": 14,
    "year": "2024",
    "generated": "2026-09-20",
    "source": {
      "credit": "Eurostat (GISCO) / © EuroGeographics",
      "name": "Eurostat GISCO, NUTS 2024 (1:1 miljoen) — grenzen © EuroGeographics",
      "url": "https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics",
      "license": "Vrij te gebruiken met bronvermelding — © EuroGeographics voor de grenzen"
    }
  },
  {
    "id": "uk-counties",
    "country": "Verenigd Koninkrijk",
    "regionType": "counties",
    "region": {
      "one": "county",
      "many": "counties"
    },
    "idLabel": "ONS-code",
    "languages": [
      {
        "code": "en",
        "label": "Engels"
      }
    ],
    "levels": [
      {
        "one": "Land",
        "many": "Landen",
        "order": [
          "Engeland",
          "Schotland",
          "Wales",
          "Noord-Ierland"
        ]
      },
      {
        "one": "Regio",
        "many": "Regio's",
        "order": null
      }
    ],
    "defaultArea": null,
    "file": "data/uk-counties.js",
    "count": 218,
    "year": "2024",
    "generated": "2026-09-20",
    "source": {
      "credit": "ONS / Opendatasoft",
      "name": "Opendatasoft \"georef-united-kingdom-county-unitary-authority\" (Office for National Statistics)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-united-kingdom-county-unitary-authority/",
      "license": "Open Government Licence 3.0 — bronvermelding vereist"
    }
  },
  {
    "id": "se-lan",
    "country": "Zweden",
    "regionType": "län",
    "region": {
      "one": "län",
      "many": "län"
    },
    "idLabel": "Länscode",
    "languages": [
      {
        "code": "sv",
        "label": "Zweeds"
      }
    ],
    "levels": [],
    "defaultArea": null,
    "file": "data/se-lan.js",
    "count": 21,
    "year": "2022",
    "generated": "2026-09-20",
    "source": {
      "credit": "SCB / Opendatasoft",
      "name": "Opendatasoft \"georef-sweden-lan\" (Statistiska centralbyrån)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-sweden-lan/",
      "license": "CC0 — bronvermelding gewenst"
    }
  },
  {
    "id": "ch-kantons",
    "country": "Zwitserland",
    "regionType": "kantons",
    "region": {
      "one": "kanton",
      "many": "kantons"
    },
    "idLabel": "Kantonsnummer",
    "languages": [
      {
        "code": "ch",
        "label": "Eigen naam"
      }
    ],
    "levels": [],
    "defaultArea": null,
    "file": "data/ch-kantons.js",
    "count": 26,
    "year": "2025",
    "generated": "2026-09-20",
    "source": {
      "credit": "swisstopo / Opendatasoft",
      "name": "Opendatasoft \"georef-switzerland-kanton\" (Bundesamt für Landestopografie)",
      "url": "https://public.opendatasoft.com/explore/dataset/georef-switzerland-kanton/",
      "license": "Open data swisstopo — bronvermelding vereist"
    }
  }
];
