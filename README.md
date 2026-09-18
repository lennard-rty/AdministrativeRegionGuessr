# Administrative Region Guessr

Een offline-vriendelijk kaartspel: duid de administratieve regio's van een land aan op
een OpenStreetMap-achtergrond. Alles zit in deze map — geen build-stap, geen webserver,
geen externe JavaScript-bibliotheken die tijdens het spelen opgehaald worden. De taal
van het spel is Nederlands, ongeacht welk land je speelt.

Spellen die nu meegeleverd zijn:

| Spel | Regio's | Gebiedskeuze |
| --- | --- | --- |
| België (gemeenten) | 565 | gewest, provincie |
| België (provincies) | 11 (10 provincies + het Brussels Hoofdstedelijk Gewest) | gewest |
| Nederland (gemeenten) | 342 | provincie |
| Nederland (provincies) | 12 | geen |

Er kunnen er zonder aanpassing van de spellogica bijkomen — zie
[Een spel toevoegen](#een-spel-toevoegen).

## Starten

Dubbelklik **`index.html`**. Dat volstaat: de grenzen zitten in `data/*.js` als gewoon
JavaScript, dus `file://` volstaat (een `fetch()` van een `.geojson` zou daar geblokkeerd
worden).

Je krijgt eerst het startscherm met de lijst *Land (regiotype)*. Pas als je een spel kiest
wordt de bijbehorende dataset opgehaald, dus het startscherm blijft licht hoe veel spellen
er ook bijkomen. Het spel dat je het laatst speelde krijgt het label *laatst gespeeld*,
maar het startscherm komt altijd eerst; met **← Ander spel** bovenaan het zijpaneel ga je
terug naar de lijst.

De achtergrondkaart komt van internet (tegels van openstreetmap.org), dus daarvoor heb je
een verbinding nodig. Zonder verbinding blijft het spel werken, maar dan zie je enkel de
grenzen op een lege achtergrond.

## Spelen

**Quiz** — het spel vraagt regio per regio, in willekeurige volgorde.

- Juist geklikt: de regio kleurt doorzichtig groen en je krijgt de volgende naam.
- Fout geklikt: de naam van de regio waarop je klikte verschijnt 1 seconde op de kaart.
- Na 3 foute klikken kleurt de juiste regio doorzichtig rood, met haar naam erbij. Ligt ze
  buiten beeld, dan schuift de kaart er even naartoe. Daarna volgt de volgende naam.
- Klikken buiten elke meespelende regio (zee, buitenland, een provincie die niet meespeelt)
  telt niet als poging.
- **Overslaan** toont meteen het antwoord en telt als fout. **Opnieuw** start een nieuwe ronde.

De tellers **te gaan / juist / fout** staan altijd in beeld, met daaronder het totale aantal
foute klikken. De drie bolletjes onder de gevraagde naam tonen je pogingen.

**Leren** — geen vragen, geen score. Klik op eender welke regio en je krijgt haar naam op de
kaart, plus de anderstalige namen (als het spel die heeft), de gebieden waar ze onder valt
en haar code in het zijpaneel.

**Gebied** — het hele land, of één gebied uit de niveaus die het spel kent: voor België
(gemeenten) zijn dat gewesten en provincies, voor Nederland (gemeenten) provincies. Regio's
buiten het gekozen gebied blijven zichtbaar als achtergrond, maar doen niet mee. Let op: van
gebied veranderen start een nieuwe ronde. Bij een spel zonder niveaus — Nederland
(provincies) — verdwijnt de keuze.

**Aantal vragen** — standaard *alle*, of een korte ronde van 10, 25 of 50 willekeurige
regio's. Handig bij grote landen: 565 gemeenten is een lange zit. Keuzes die niet in het
gekozen gebied passen worden niet getoond.

**Taal** — enkel bij spellen met meertalige namen. Voor België: Nederlands (standaard),
Frans of Duits, wat bepaalt welke naam gevraagd en getoond wordt (*Luik*, *Liège* of
*Lüttich*). Bij Nederland verdwijnt de keuze, want daar is er maar één naam per gemeente.
De namen van de gebieden (gewesten, provincies) staan altijd in het Nederlands.

**Achtergrondkaart** — twee keuzes:

- *OpenStreetMap* (standaard): de vertrouwde kaart. Let op: vanaf ongeveer zoomniveau 10
  staan de plaatsnamen op de kaart zelf, dus dan is de quiz deels aflezen.
- *OpenStreetMap zonder namen*: dezelfde OSM-gegevens, maar vectorieel getekend met alle
  naamlagen eruit gefilterd. Wegen, water, bebouwing en groen blijven zichtbaar, namen niet.
  Eerlijker om mee te quizzen. Vereist WebGL; lukt dat niet, dan schakelt het spel vanzelf
  terug naar de gewone kaart met een melding in het zijpaneel.

Spelkeuze, gebied, aantal vragen, taal en achtergrondkaart worden onthouden voor een
volgende keer (in zoverre je browser `localStorage` toelaat op `file://`). Het gekozen
gebied wordt per spel onthouden.

## Wat staat waar

| Pad | Inhoud |
| --- | --- |
| `index.html` | opbouw van de pagina: startscherm + spelscherm |
| `style.css` | vormgeving van startscherm, paneel en kaartlabels |
| `app.js` | startscherm: spellijst, dataset laden, heen en weer tussen menu en spel |
| `game.js` | spellogica, kaart en klikafhandeling — kent geen enkel land bij naam |
| `data/games.js` | de catalogus die het startscherm vult (gegenereerd) |
| `data/<spel-id>.js` | de grenzen van één spel (gegenereerd) |
| `tools/games/<spel-id>.mjs` | de beschrijving van één spel: namen, niveaus, bron |
| `tools/build-data.mjs` | bouwt `data/` op uit `tools/games/` |
| `vendor/` | Leaflet 1.9.4 en MapLibre GL 5.9 (voor de kaart zonder namen), lokaal meegeleverd |

De speelregels staan als constanten bovenaan `game.js`: `MAX_ATTEMPTS` (3 pogingen),
`WRONG_FLASH_MS` (1000 ms), `REVEAL_MS` en `ROUND_SIZES` (10 / 25 / 50). Vanuit de
browserconsole kan je met `ARG.map`, `ARG.state` en `ARG.props` in het lopende spel kijken.

## Data opnieuw opbouwen

Nodig bij een fusie of grenswijziging, of als je scherpere of ruwere grenzen wil:

```
node tools/build-data.mjs                  # toont welke spellen er zijn
node tools/build-data.mjs be-gemeenten     # bouwt één spel
node tools/build-data.mjs --all            # bouwt ze allemaal
node tools/build-data.mjs be-gemeenten --simplify 30%   # scherpere grenzen, ~2,7 MB
```

Het script downloadt de brondata (18 à 31 MB, naar de tijdelijke map van je systeem, niet
naar dit project) en vereenvoudigt ze met `npx mapshaper`. Die download wordt gecachet en
tussen spellen gedeeld: `be-gemeenten`/`be-provincies` halen hetzelfde bestand op, net als
`nl-gemeenten`/`nl-provincies`. Met `--fresh` haal je het opnieuw op. De vereenvoudiging is
topologie-behoudend: aangrenzende regio's blijven exact op elkaar aansluiten, er ontstaan
geen gaten of overlappingen. Node.js en een internetverbinding zijn vereist.

`data/games.js` wordt na elke bouw mee herschreven. Spellen waarvan het databestand nog
niet bestaat blijven uit de catalogus, zodat het startscherm nooit een spel toont dat niet
kan starten.

## Een spel toevoegen

Eén bestand in `tools/games/` erbij, en bouwen. De bestandsnaam is de spel-id.

```js
// tools/games/fr-departements.mjs
export default {
  id: 'fr-departements',              // moet gelijk zijn aan de bestandsnaam
  country: 'Frankrijk',               // startscherm: "Frankrijk (departementen)"
  regionType: 'departementen',
  region: { one: 'departement', many: 'departementen' },   // voor zinnen in het paneel
  idLabel: 'INSEE-code',              // label van de code in de leermodus (mag null)

  languages: [{ code: 'nl', label: 'Nederlands' }],        // meer talen = taalkeuze zichtbaar

  levels: [                           // gebiedsniveaus, grof naar fijn; [] = geen gebiedskeuze
    { one: 'Regio', many: 'Regio\'s', order: ['Île-de-France'] },   // order is optioneel
  ],

  source: { credit: 'IGN', name: '...', url: 'https://...', license: '...' },

  build: {
    url: 'https://.../export.geojson',   // bron met de grenzen
    cache: 'fr-departements',            // naam van het gecachete bronbestand
    simplify: '15%',                     // hoeveel detail de grenzen houden
    year: (raw) => '2026',               // of null; verschijnt als "jaargang ..." in het paneel
    prepare(props) {                     // één bronregio -> één regio in het spel
      return {
        id: props.dep_code,
        names: { nl: props.dep_name },
        groups: [props.reg_name],        // één waarde per niveau uit `levels`
      };
    },
  },
};
```

Daarna:

```
node tools/build-data.mjs fr-departements
```

Dat schrijft `data/fr-departements.js` en zet het spel in `data/games.js`. Herlaad
`index.html` en het staat in de lijst.

Twee dingen die de bouwer voor je regelt: het middelpunt van elke regio (mapshaper
berekent een punt dat gegarandeerd *binnen* de vorm ligt, ook bij fjorden en enclaves) en
de controle achteraf — dubbele codes, naamloze regio's of regio's die buiten elk gebied
vallen laten de bouw falen in plaats van een half spel op te leveren.

**Een spel afleiden uit een ander** (zoals `be-provincies` en `nl-provincies` uit de
gemeentegrenzen): zet
`dissolve: true` in `build` en laat `prepare()` voor elke bronregio de *doelregio*
teruggeven. Alle gemeenten van dezelfde provincie krijgen dan dezelfde `id`, en mapshaper
smelt hun binnengrenzen weg. Zet `cache` op dezelfde waarde als het spel waaruit je afleidt
en de download gebeurt maar één keer.

**Wat het spel van een regio verwacht** (dit schrijft de bouwer weg, handmatig samengestelde
datasets mogen hetzelfde doen):

```js
window.ARG_DATA['be-gemeenten'] = {
  meta: { count: 565, year: '2025', generated: '2026-09-18', simplify: '15%', source: {...} },
  geo: { type: 'FeatureCollection', features: [{
    type: 'Feature',
    properties: {
      id: '11001',                                   // uniek
      names: { nl: 'Aartselaar', fr: 'Aartselaar' }, // één naam per taal uit `languages`
      groups: ['Vlaams Gewest', 'Provincie Antwerpen'],  // één per niveau uit `levels`
      c: [4.38504, 51.13315],                        // [lon, lat], waar het label komt
    },
    geometry: { /* Polygon of MultiPolygon in WGS84 */ },
  }] },
};
```

Groepsnamen moeten uniek zijn binnen hun niveau: het gebiedsmenu herkent een gebied aan
zijn naam. Een regio mag wel minder niveaus invullen dan het spel er heeft — Brussel heeft
geen provincie, en verdwijnt dus gewoon uit het provinciemenu.

## Bronnen

- **Belgische grenzen**: Statbel (FOD Economie), via de Opendatasoft-dataset
  [`georef-belgium-municipality`](https://public.opendatasoft.com/explore/dataset/georef-belgium-municipality/) —
  jaargang 2025, dus inclusief de fusies van 1 januari 2025. Bronvermelding vereist bij hergebruik.
- **Nederlandse grenzen**: Bestuurlijke gebieden (Kadaster), via de
  [PDOK-webservice](https://www.pdok.nl/introductie/-/article/bestuurlijke-gebieden) —
  de actuele toestand, CC BY 4.0. De provincies zijn samengesteld uit die gemeentegrenzen,
  dus beide Nederlandse spellen delen exact dezelfde lijnen.
- **Achtergrondkaart met namen**: © OpenStreetMap-bijdragers, tegels van openstreetmap.org
  ([gebruiksvoorwaarden](https://operations.osmfoundation.org/policies/tiles/) — geschikt
  voor persoonlijk gebruik, niet voor een druk bezochte publieke site).
- **Achtergrondkaart zonder namen**: dezelfde OSM-gegevens als vectortegels van
  [OpenFreeMap](https://openfreemap.org/) (gratis, geen API-sleutel). Het spel haalt de
  `positron`-stijl op en gooit er alle `symbol`-lagen uit; dat zijn precies de naamlagen.
- **Leaflet** 1.9.4 (BSD-2-Clause), **MapLibre GL JS** 5.9 en **maplibre-gl-leaflet**
  (beide BSD-3-Clause).

Waarom niet gewoon labelloze rastertegels? De bekende gratis bronnen daarvoor (CARTO
Positron, Stamen via Stadia) vragen intussen allemaal een API-sleutel. OpenFreeMap doet
dat niet, en werkt ook vanaf `file://`.
