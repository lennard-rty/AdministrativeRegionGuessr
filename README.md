# Belgische Gemeente Guessr

Een offline-vriendelijk kaartspel: duid alle 565 Belgische gemeenten aan op een
OpenStreetMap-achtergrond. Alles zit in deze map — geen build-stap, geen webserver,
geen externe JavaScript-bibliotheken die tijdens het spelen opgehaald worden.

## Starten

Dubbelklik **`index.html`**. Dat volstaat: de gemeentegrenzen zitten in
`data/gemeenten.js` als gewoon JavaScript, dus `file://` volstaat (een `fetch()` van
een `.geojson` zou daar geblokkeerd worden).

De achtergrondkaart komt wel van internet (tegels van openstreetmap.org), dus voor de
kaartachtergrond heb je een verbinding nodig. Zonder verbinding blijft het spel
werken, maar dan zie je enkel de grenzen op een lege achtergrond.

## Spelen

**Quiz** — het spel vraagt gemeente per gemeente, in willekeurige volgorde.

- Juist geklikt: de gemeente kleurt doorzichtig groen en je krijgt de volgende naam.
- Fout geklikt: de naam van de gemeente waarop je klikte verschijnt 1 seconde op de kaart.
- Na 3 foute klikken kleurt de juiste gemeente doorzichtig rood, met haar naam erbij.
  Ligt ze buiten beeld, dan schuift de kaart er even naartoe. Daarna volgt de volgende naam.
- Klikken buiten elke meespelende gemeente (zee, buitenland, een provincie die niet
  meespeelt) telt niet als poging.
- **Overslaan** toont meteen het antwoord en telt als fout. **Opnieuw** start een nieuwe ronde.

De tellers **te gaan / juist / fout** staan altijd in beeld, met daaronder het totale
aantal foute klikken. De drie bolletjes onder de gevraagde naam tonen je pogingen.

**Leren** — geen vragen, geen score. Klik op eender welke gemeente en je krijgt haar
naam op de kaart, plus de anderstalige namen, de provincie, het gewest en de NIS-code
in het zijpaneel.

**Gebied** — heel België, één gewest, of één provincie. Gemeenten buiten het gekozen
gebied blijven zichtbaar als achtergrond, maar doen niet mee. Let op: van gebied
veranderen start een nieuwe ronde.

**Taal** — Nederlands (standaard), Frans of Duits. Dit bepaalt welke naam gevraagd en
getoond wordt: *Luik*, *Liège* of *Lüttich*.

**Achtergrondkaart** — twee keuzes:

- *OpenStreetMap* (standaard): de vertrouwde kaart. Let op: vanaf ongeveer zoomniveau 10
  staan de gemeentenamen op de kaart zelf, dus dan is de quiz deels aflezen.
- *OpenStreetMap zonder namen*: dezelfde OSM-gegevens, maar vectorieel getekend met alle
  naamlagen eruit gefilterd. Wegen, water, bebouwing en groen blijven zichtbaar, namen niet.
  Eerlijker om mee te quizzen. Vereist WebGL; lukt dat niet, dan schakelt het spel vanzelf
  terug naar de gewone kaart met een melding in het zijpaneel.

Gebied, taal en achtergrondkaart worden onthouden voor een volgende keer (in zoverre je
browser `localStorage` toelaat op `file://`).

## Wat staat waar

| Pad | Inhoud |
| --- | --- |
| `index.html` | opbouw van de pagina |
| `style.css` | vormgeving van paneel en kaartlabels |
| `app.js` | spellogica, kaart en klikafhandeling |
| `data/gemeenten.js` | de 565 gemeentegrenzen (gegenereerd, 1,5 MB) |
| `tools/build-data.mjs` | script dat `data/gemeenten.js` opbouwt |
| `vendor/` | Leaflet 1.9.4 en MapLibre GL 5.9 (voor de kaart zonder namen), lokaal meegeleverd |

De speelregels staan als constanten bovenaan `app.js`: `MAX_ATTEMPTS` (3 pogingen),
`WRONG_FLASH_MS` (1000 ms) en `REVEAL_MS`. Vanuit de browserconsole kan je met
`BGG.map`, `BGG.state` en `BGG.props` in het spel kijken.

## Data opnieuw opbouwen

Nodig bij een volgende gemeentefusie, of als je scherpere of ruwere grenzen wil:

```
node tools/build-data.mjs                  # standaard: 15% detail
node tools/build-data.mjs --simplify 30%   # scherpere grenzen, ~2,7 MB
```

Het script downloadt de brondata (~19 MB, naar de tijdelijke map van je systeem, niet
naar dit project) en vereenvoudigt ze met `npx mapshaper`. De vereenvoudiging is
topologie-behoudend: aangrenzende gemeenten blijven exact op elkaar aansluiten, er
ontstaan geen gaten of overlappingen. Node.js en een internetverbinding zijn vereist.

## Bronnen

- **Gemeentegrenzen**: Statbel (FOD Economie), via de Opendatasoft-dataset
  [`georef-belgium-municipality`](https://public.opendatasoft.com/explore/dataset/georef-belgium-municipality/) —
  jaargang 2025, dus inclusief de fusies van 1 januari 2025. Bronvermelding vereist bij hergebruik.
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
