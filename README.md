# Administrative Region Guessr

Een offline-vriendelijk kaartspel: duid de administratieve regio's van een land aan op
een OpenStreetMap-achtergrond. Alles zit in deze map — geen build-stap, geen webserver,
geen externe JavaScript-bibliotheken die tijdens het spelen opgehaald worden. De taal
van het spel is Nederlands, ongeacht welk land je speelt.

Spellen die nu meegeleverd zijn:

| Spel | Regio's | Gebiedskeuze |
| --- | --- | --- |
| België (arrondissementen) | 43 | gewest, provincie |
| België (deelgemeenten) | 2664 (de voormalige gemeenten, opgegaan in de huidige 565) | gewest, provincie, arrondissement |
| België (gemeenten) | 565 | gewest, provincie |
| België (provincies) | 11 (10 provincies + het Brussels Hoofdstedelijk Gewest) | gewest |
| Denemarken (regio's) | 5 | geen |
| Duitsland (deelstaten) | 16 | geen |
| Duitsland (Kreise) | 400 (294 Kreise en Landkreise + 106 kreisfreie Städte) | deelstaat |
| Finland (landschappen) | 19 | geen |
| Frankrijk (arrondissementen) | 333 (320 Europese + 13 overzeese) | gebiedsdeel, regio, departement |
| Frankrijk (departementen) | 101 (96 Europese + 5 overzeese) | gebiedsdeel, regio |
| Frankrijk (regio's) | 18 (13 Europese + 5 overzeese) | gebiedsdeel |
| Ierland (graafschappen) | 26 (de Republiek; Noord-Ierland zit in het Britse spel) | provincie |
| Italië (provincies) | 107 (inclusief de veertien città metropolitane) | landsdeel, regio |
| Italië (regio's) | 20 | landsdeel |
| Luxemburg (gemeenten) | 100 | kanton |
| Luxemburg (kantons) | 12 | geen |
| Nederland (gemeenten) | 342 | provincie |
| Nederland (provincies) | 12 | geen |
| Noorwegen (fylker) | 15 | geen |
| Oostenrijk (Bezirke) | 94 (79 districten + 15 Statutarstädte) | deelstaat |
| Oostenrijk (deelstaten) | 9 | geen |
| Polen (woiwodschappen) | 16 | geen |
| Portugal (districten) | 20 (18 op het vasteland + Azoren en Madeira) | gebiedsdeel |
| Spanje (autonome gemeenschappen) | 19 (17 + Ceuta en Melilla) | gebiedsdeel |
| Spanje (provincies) | 52 (50 + Ceuta en Melilla) | gebiedsdeel, autonome gemeenschap |
| Tsjechië (kraje) | 14 | geen |
| Verenigd Koninkrijk (counties) | 218 (counties, unitary authorities, council areas, London boroughs) | land, regio |
| Zweden (län) | 21 | geen |
| Zwitserland (kantons) | 26 | geen |

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
grenzen op een lege achtergrond — net wat je krijgt met *Geen achtergrondkaart*.

## Spelen

**Quiz** — het spel vraagt regio per regio, in willekeurige volgorde. Je krijgt drie klikken
per regio, en de kleur op de kaart onthoudt hoeveel je er nodig had:

| Kleur | Wat er gebeurde | Telt als |
| --- | --- | --- |
| groen | meteen juist aangeduid | juist |
| geel | juist, na één misser | fout |
| oranje | juist, na twee missers | fout |
| rood | na drie missers voor je onthuld | fout |

Alleen wie een regio in één keer aanwijst krijgt ze bij **juist**. Twee of drie klikken
nodig? Dan staat ze bij **fout**, maar de kleur laat zien dat je haar uiteindelijk gevonden
hebt. Anders zou een regio die je pas bij de derde poging raadt even zwaar wegen als een die
je meteen wist.

- Fout geklikt: de naam van de regio waarop je klikte verschijnt 1 seconde op de kaart.
- Na 3 foute klikken kleurt de juiste regio rood, met haar naam erbij. Ligt ze buiten beeld,
  dan schuift de kaart er even naartoe. Daarna volgt de volgende naam.
- Klikken buiten elke meespelende regio (zee, buitenland, een provincie die niet meespeelt)
  telt niet als poging.
- Klikken op een regio die je deze ronde al gehad hebt — ze staat al ingekleurd — telt
  evenmin als poging: haar naam is al gevallen, dus er valt niets meer te raden. Je krijgt
  die naam kort te zien en de vraag blijft staan.
- **Overslaan** toont meteen het antwoord en telt als fout. **Opnieuw** start een nieuwe ronde.

De tellers **te gaan / juist / fout** staan altijd in beeld, met daaronder het totale aantal
foute klikken en een legende van de vier kleuren. De drie bolletjes onder de gevraagde naam
tonen je pogingen voor deze vraag.

**Leren** — geen vragen, geen score. Klik op eender welke regio en je krijgt haar naam op de
kaart, plus de anderstalige namen (als het spel die heeft), de gebieden waar ze onder valt
en haar code in het zijpaneel.

**Gebied** — het hele land, of één gebied uit de niveaus die het spel kent. Wat dat is,
hangt van het spel af: gewesten en provincies in België, deelstaten in Duitsland en
Oostenrijk, gebiedsdelen en regio's in Frankrijk, Italië en Spanje, landen en regio's in
het Verenigd Koninkrijk, provincies in Nederland en Ierland, kantons in Luxemburg. Regio's
buiten het gekozen gebied blijven zichtbaar als achtergrond, maar doen niet mee. Let op:
van gebied veranderen start een nieuwe ronde. Bij een spel zonder niveaus — de meeste
kleine spellen, van Denemarken tot Zwitserland — verdwijnt de keuze.

De drie Franse spellen beginnen niet in heel het land maar in *Europees Frankrijk*. De
overzeese departementen en regio's liggen in de Cariben, Zuid-Amerika en de Indische Oceaan:
heel Frankrijk in beeld brengen levert een wereldkaart op waarop je niets kan aanduiden. Ze
doen wel gewoon mee zodra je *Heel Frankrijk* of het overzeese gebiedsdeel kiest.

Mayotte is niet in arrondissementen verdeeld, dus het arrondissementenspel telt 100
departementen en 17 regio's in plaats van 101 en 18.

Spanje en Portugal doen hetzelfde: die beginnen op het vasteland, want de Canarische
Eilanden en de Azoren liggen ver de oceaan in. Ceuta en Melilla liggen wel in Noord-Afrika,
maar vlak over de Straat van Gibraltar, en spelen dus mee met het vasteland.

**Aantal vragen** — standaard *alle*, of een korte ronde van 10, 25 of 50 willekeurige
regio's. Handig bij grote spellen: 565 gemeenten is een lange zit, en 2664 deelgemeenten
een avond. Keuzes die niet in het gekozen gebied passen worden niet getoond.

**Taal** — enkel bij spellen met meertalige namen. Voor België: Nederlands (standaard),
Frans of Duits, wat bepaalt welke naam gevraagd en getoond wordt (*Luik*, *Liège* of
*Lüttich* — bij de arrondissementen net zo goed als bij de gemeenten). Ierland heeft Engels
en Iers (*Donegal* of *Dún na nGall*). Bij de Duitse en Oostenrijkse deelstaten, de
Italiaanse regio's en de Spaanse autonome gemeenschappen staat er een Nederlandse naam
naast de eigen: *Beieren* of *Bayern*, *Toscane* of *Toscana*, *Andalusië* of *Andalucía*.

Bij de andere spellen verdwijnt de keuze: die hebben één naam per regio. Daar geldt de
regel dat een regio haar eigen naam houdt zodra er geen gewone Nederlandse voor bestaat —
*Ardennes*, *Landkreis München*, *Stockholms län*, *Jihočeský kraj*, *Małopolskie*. Een
half vertaalde lijst helpt niemand. De namen van de *gebieden* waarin je speelt staan wel
altijd in het Nederlands, ook als de regio's zelf anders heten; alleen de Franse regio's en
departementen houden ook daar hun eigen naam.

**Records** — na elke volledige ronde onthoudt het spel je beste resultaat, per spel én per
gebied. Boven de knoppen staat het record van het gebied waarin je speelt (*Record voor
Vlaams Gewest: 92% (62 van 67)*, of *uitgespeeld* als je er ooit alles juist had); klap
*Records per gebied* open voor de volledige lijst. Op het startscherm krijgt elk spel een
pil met je beste volledige ronde — groen met een vinkje zodra je het uitspeelde — en de
meta-regel telt erbij hoeveel gebieden je al uitspeelde.

Het percentage is dat van de tellers: het aandeel regio's dat je meteen juist aanwees. Een
regio die je pas bij de tweede of derde klik vond, telt er dus niet in mee. 100% betekent
daardoor echt dat je elke regio in één keer wist.

Alleen volledige rondes tellen mee: een korte ronde van 10, 25 of 50 vragen laat je record
ongemoeid, en zegt dat ook onder de uitslag. Anders zou een steekproef van tien de score
voor een heel land bepalen. 99% blijft 99% zolang er één regio ontbreekt. Er wordt geen tijd
bijgehouden: snelheid is het punt van dit spel niet.

**Achtergrondkaart** — drie keuzes:

- *OpenStreetMap* (standaard): de vertrouwde kaart. Let op: vanaf ongeveer zoomniveau 10
  staan de plaatsnamen op de kaart zelf, dus dan is de quiz deels aflezen.
- *OpenStreetMap zonder namen*: dezelfde OSM-gegevens, maar vectorieel getekend met alle
  naamlagen eruit gefilterd. Wegen, water, bebouwing en groen blijven zichtbaar, namen niet.
  Eerlijker om mee te quizzen. Vereist WebGL; lukt dat niet, dan schakelt het spel vanzelf
  terug naar de gewone kaart met een melding in het zijpaneel.
- *Geen achtergrondkaart*: enkel de grenzen, op een effen achtergrond. De lijnen worden dan
  wat donkerder getekend, want ze dragen de kaart alleen. Geen kust, geen rivieren, geen
  wegen om je aan vast te houden — de moeilijkste stand, en de enige die helemaal zonder
  internet werkt.

Spelkeuze, gebied, aantal vragen, taal en achtergrondkaart worden onthouden voor een
volgende keer (in zoverre je browser `localStorage` toelaat op `file://`). Het gekozen
gebied wordt per spel onthouden.

## Waar blijven je records?

In de `localStorage` van je eigen browser, onder de sleutel `arg.records` — niet in een
bestand in dit project. Daar is bewust voor gekozen: zo kan er nooit een score in git
terechtkomen, en begint iedereen die dit project uitcheckt met een lege lijst in plaats van
met die van iemand anders. Records reizen dus ook niet mee naar een andere browser of een
andere computer, en ze verdwijnen als je de browsergegevens voor deze pagina wist.

De vorm is bewust simpel, mocht je ze ooit willen bekijken of opruimen vanuit de console:

```js
JSON.parse(localStorage.getItem('arg.records'))
// { "be-gemeenten": { "ALL": { c: 492, t: 565 }, "L0:Vlaams Gewest": { c: 285, t: 285 } } }
localStorage.removeItem('arg.records')   // alles wissen
```

`c` is het aantal juiste regio's, `t` het totaal van die ronde; `ALL` is het hele land en
`L0:`/`L1:` verwijzen naar het gebiedsniveau. Geen tijden, geen namen, niets anders.

## Wat staat waar

| Pad | Inhoud |
| --- | --- |
| `index.html` | opbouw van de pagina: startscherm + spelscherm |
| `style.css` | vormgeving van startscherm, paneel en kaartlabels |
| `app.js` | startscherm: spellijst, dataset laden, heen en weer tussen menu en spel |
| `game.js` | spellogica, kaart en klikafhandeling — kent geen enkel land bij naam |
| `scores.js` | je records per spel en per gebied, in `localStorage` van je browser |
| `data/games.js` | de catalogus die het startscherm vult (gegenereerd) |
| `data/<spel-id>.js` | de grenzen van één spel (gegenereerd) |
| `tools/games/<spel-id>.mjs` | de beschrijving van één spel: namen, niveaus, bron |
| `tools/lib/` | wat meer dan één spelbestand nodig heeft: de Nederlandse namen van buitenlandse regio's |
| `tools/build-data.mjs` | bouwt `data/` op uit `tools/games/` |
| `vendor/` | Leaflet 1.9.4 en MapLibre GL 5.9 (voor de kaart zonder namen), lokaal meegeleverd |

De speelregels staan als constanten bovenaan `game.js`: `MAX_ATTEMPTS` (3 pogingen),
`WRONG_FLASH_MS` (1000 ms), `REVEAL_MS`, `ROUND_SIZES` (10 / 25 / 50) en `ANSWER`, de
kleurschaal van groen naar rood — één kleur per aantal klikken, dus zet je `MAX_ATTEMPTS`
hoger, voorzie dan evenveel kleuren. Vanuit de
browserconsole kan je met `ARG.map`, `ARG.state` en `ARG.props` in het lopende spel kijken.

## Data opnieuw opbouwen

Nodig bij een fusie of grenswijziging, of als je scherpere of ruwere grenzen wil:

```
node tools/build-data.mjs                  # toont welke spellen er zijn
node tools/build-data.mjs be-gemeenten     # bouwt één spel
node tools/build-data.mjs --all            # bouwt ze allemaal
node tools/build-data.mjs be-gemeenten --simplify 30%   # scherpere grenzen, ~2,7 MB
```

Het script downloadt de brondata (1 à 31 MB, naar de tijdelijke map van je systeem, niet
naar dit project) en vereenvoudigt ze met `npx mapshaper`. Die download wordt gecachet en
tussen spellen gedeeld: `be-gemeenten`, `be-provincies` en `be-arrondissementen` halen
hetzelfde bestand op, net als `fr-departementen`/`fr-regios`, `nl-gemeenten`/`nl-provincies`,
`es-provincies`/`es-gemeenschappen`, `it-provincies`/`it-regios` en
`lu-gemeenten`/`lu-kantons`. De zes spellen die uit de NUTS-indeling van Eurostat komen
delen er twee: één bestand per NUTS-niveau, waar elk spel zijn eigen land uit haalt. Met `--fresh` haal je het opnieuw op. De vereenvoudiging is
topologie-behoudend: aangrenzende regio's blijven exact op elkaar aansluiten, er ontstaan
geen gaten of overlappingen. Node.js en een internetverbinding zijn vereist.

`data/games.js` wordt na elke bouw mee herschreven. Spellen waarvan het databestand nog
niet bestaat blijven uit de catalogus, zodat het startscherm nooit een spel toont dat niet
kan starten.

## Een spel toevoegen

Eén bestand in `tools/games/` erbij, en bouwen. De bestandsnaam is de spel-id.

```js
// tools/games/ie-graafschappen.mjs
export default {
  id: 'ie-graafschappen',             // moet gelijk zijn aan de bestandsnaam
  country: 'Ierland',                 // startscherm: "Ierland (graafschappen)"
  regionType: 'graafschappen',
  region: { one: 'graafschap', many: 'graafschappen' },   // voor zinnen in het paneel
  idLabel: 'Graafschapscode',         // label van de code in de leermodus (mag null)

  languages: [{ code: 'en', label: 'Engels' }],   // meer dan één = taalkeuze zichtbaar

  levels: [                           // gebiedsniveaus, grof naar fijn; [] = geen gebiedskeuze
    // order is optioneel en bepaalt de volgorde in het gebiedsmenu
    { one: 'Provincie', many: 'Provincies', order: ['Leinster', 'Munster', 'Connacht'] },
  ],

  defaultArea: null,                  // naam van het gebied waarin het spel begint (zie onder)

  source: { credit: 'OSi', name: '...', url: 'https://...', license: '...' },

  build: {
    url: 'https://.../export.geojson',   // bron met de grenzen
    cache: 'ie-graafschap',              // naam van het gecachete bronbestand
    simplify: '15%',                     // hoeveel detail de grenzen houden
    year: (raw) => '2026',               // of null; verschijnt als "jaargang ..." in het paneel
    prepare(props) {                     // één bronregio -> één regio in het spel; null = overslaan
      return {
        id: props.county_code,
        names: { en: props.county_name },
        groups: [props.province],        // één waarde per niveau uit `levels`
      };
    },
    names(regions, langs) {},            // optioneel; zie "dubbele namen" hieronder
  },
};
```

Daarna:

```
node tools/build-data.mjs ie-graafschappen
```

Dat schrijft `data/ie-graafschappen.js` en zet het spel in `data/games.js`. Herlaad
`index.html` en het staat in de lijst.

Twee dingen die de bouwer voor je regelt: het middelpunt van elke regio (mapshaper
berekent een punt dat gegarandeerd *binnen* de vorm ligt, ook bij fjorden en enclaves) en
de controle achteraf — dubbele codes, naamloze regio's of regio's die buiten elk gebied
vallen laten de bouw falen in plaats van een half spel op te leveren.

**Dubbele namen** laten de bouw niet falen, maar leveren wel een waarschuwing op. De vraag
is dan namelijk niet te beantwoorden: klik je de andere Saint-Denis aan, dan telt dat als
misser. Zet er in `prepare()` iets bij dat ze uit elkaar houdt — de provincie, het
departement, de gemeente — zoals `be-gemeenten` en `fr-arrondissementen` doen. Let op dat
het per taal kan verschillen: Sint-Niklaas en Saint-Nicolas zijn in het Nederlands twee
namen en in het Frans één.

`prepare()` ziet één bronregio tegelijk en weet dus niet welke namen dubbel zijn. Wil je
enkel díe ontdubbelen — een provincie achter een naam die maar één keer voorkomt lost niets
op en verklapt half waar je moet zoeken — zet dan naast `prepare()` een `names(regions,
langs)` in `build`. Die krijgt alle regio's ineens (elk met zijn `id`, `names` en `groups`)
en mag hun namen nog bijstellen; `prepare()` mag er velden voor meegeven die het spel zelf
niet gebruikt. Zo krijgen in `be-deelgemeenten` 85 van de 2.664 deelgemeenten hun gemeente
achter hun naam, en de rest niet.

**In één gebied beginnen**: zet `defaultArea` op de naam van een gebied uit `levels`. Het
spel start dan met dat gebied gekozen in plaats van met het hele land — nodig als een land
ver uit elkaar liggende stukken heeft, zoals Frankrijk met zijn overzeese departementen.
De andere gebieden, en het hele land, blijven gewoon kiesbaar.

**Een spel afleiden uit een ander** (zoals `be-provincies` en `nl-provincies` uit de
gemeentegrenzen): zet `dissolve: true` in `build` en laat `prepare()` voor elke bronregio
de *doelregio* teruggeven. Alle gemeenten van dezelfde provincie krijgen dan dezelfde `id`, en mapshaper
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

- **Belgische grenzen**: Statbel (FOD Economie), via de Opendatasoft-datasets
  [`georef-belgium-municipality`](https://public.opendatasoft.com/explore/dataset/georef-belgium-municipality/)
  (gemeenten, en daaruit gesmolten de provincies en arrondissementen) en
  [`georef-belgium-submunicipality`](https://public.opendatasoft.com/explore/dataset/georef-belgium-submunicipality/)
  (deelgemeenten) — jaargang 2025, dus inclusief de fusies van 1 januari 2025.
  Bronvermelding vereist bij hergebruik.
- **Duitse grenzen**: Statistisches Bundesamt (Destatis), via de Opendatasoft-datasets
  [`georef-germany-land`](https://public.opendatasoft.com/explore/dataset/georef-germany-land/)
  (deelstaten) en
  [`georef-germany-kreis`](https://public.opendatasoft.com/explore/dataset/georef-germany-kreis/)
  (Kreise) — jaargang 2025, Datenlizenz Deutschland – Namensnennung 2.0. De bron kent enkel
  Duitse namen; de Nederlandse namen van de zestien deelstaten staan in
  `tools/lib/nederlandse-namen.mjs`.
- **Franse grenzen**: IGN, via de Opendatasoft-datasets
  [`georef-france-departement`](https://public.opendatasoft.com/explore/dataset/georef-france-departement/)
  (departementen, en daaruit gesmolten de regio's) en
  [`georef-france-arrondissement-departemental`](https://public.opendatasoft.com/explore/dataset/georef-france-arrondissement-departemental/)
  (arrondissementen) — jaargang 2025, Licence Ouverte 2.0. Het departementenbestand is al
  veralgemeend (1,1 MB voor 101 vormen), vandaar `simplify: '90%'` in plaats van de 15% van
  de andere spellen; het arrondissementenbestand is dat niet (7,8 MB voor 333 vormen) en
  gaat naar 30%.
- **Ierse grenzen**: Tailte Éireann (de landmeetdienst), via de ArcGIS-dienst van hun
  [open-dataportaal](https://data-osi.opendata.arcgis.com/) — de veralgemeende versie
  (20 m) van de wettelijke graafschapsgrenzen, CC BY 4.0. De Engelse namen staan er in
  hoofdletters in; het spel zet ze terug naar gewone spelling.
- **Italiaanse grenzen**: ISTAT, via de Opendatasoft-dataset [`georef-italy-provincia`](https://public.opendatasoft.com/explore/dataset/georef-italy-provincia/)
  (provincies, en daaruit gesmolten de regio's) — jaargang 2022, CC BY 4.0.
- **Luxemburgse grenzen**: het kadaster (ACT), via
  [data.public.lu](https://data.public.lu/en/datasets/limites-administratives-du-grand-duche-de-luxembourg/) —
  de gemeentegrenzen van 2023 in CC0, met het kanton als veld, waaruit het kantonspel
  gesmolten wordt.
- **Nederlandse grenzen**: Bestuurlijke gebieden (Kadaster), via de
  [PDOK-webservice](https://www.pdok.nl/introductie/-/article/bestuurlijke-gebieden) —
  de actuele toestand, CC BY 4.0. De provincies zijn samengesteld uit die gemeentegrenzen,
  dus beide Nederlandse spellen delen exact dezelfde lijnen.
- **Oostenrijkse districten**: STATISTIK AUSTRIA,
  [Gliederung Österreichs in politische Bezirke](https://data.statistik.gv.at/web/meta.jsp?dataset=OGDEXT_POLBEZ_1) —
  CC BY 4.0, opgehaald via hun WFS-dienst in GeoJSON. Die bron levert Wenen zowel in zijn
  geheel als in 23 stadsdelen; het spel houdt het geheel.
- **Portugese grenzen**: DGT, via de Opendatasoft-dataset [`georef-portugal-distrito`](https://public.opendatasoft.com/explore/dataset/georef-portugal-distrito/) —
  jaargang 2024.
- **Spaanse grenzen**: INE, via de Opendatasoft-dataset [`georef-spain-provincia`](https://public.opendatasoft.com/explore/dataset/georef-spain-provincia/)
  (provincies, en daaruit gesmolten de autonome gemeenschappen) — jaargang 2022.
- **Britse grenzen**: Office for National Statistics, via de Opendatasoft-dataset
  [`georef-united-kingdom-county-unitary-authority`](https://public.opendatasoft.com/explore/dataset/georef-united-kingdom-county-unitary-authority/) — jaargang 2024, Open Government
  Licence 3.0.
- **Zweedse grenzen**: SCB, via de Opendatasoft-dataset [`georef-sweden-lan`](https://public.opendatasoft.com/explore/dataset/georef-sweden-lan/) —
  jaargang 2022. Dat bestand is al sterk veralgemeend (0,3 MB voor 21 län), vandaar
  `simplify: '90%'`; fijner dan de bron kan niet.
- **Zwitserse grenzen**: swisstopo, via de Opendatasoft-dataset [`georef-switzerland-kanton`](https://public.opendatasoft.com/explore/dataset/georef-switzerland-kanton/) —
  jaargang 2025.
- **Denemarken, Finland, Noorwegen, Oostenrijk (deelstaten), Polen en Tsjechië**: de
  [NUTS-indeling van Eurostat](https://ec.europa.eu/eurostat/web/gisco/geodata/statistical-units/territorial-units-statistics)
  (versie 2024, schaal 1:1 miljoen) — vrij te gebruiken met bronvermelding, grenzen
  © EuroGeographics. Voor die zes landen valt een NUTS-niveau samen met de bestuurlijke
  indeling, en zo komen zes spellen uit twee downloads. Waar dat niet opgaat, is een
  nationale bron nodig: de Oostenrijkse Bezirke en de Ierse graafschappen staan hierboven.
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
