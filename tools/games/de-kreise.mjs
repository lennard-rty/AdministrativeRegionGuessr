/**
 * Duitsland (Kreise) — de 400 Landkreise en kreisfreie Städte, met de deelstaat als
 * gebiedskeuze. Het Duitse tegenhanger van het Belgische gemeentespel qua omvang.
 *
 * De namen blijven Duits: Nederlandse namen bestaan er niet voor. Ze krijgen wel hun
 * soort mee — Landkreis, Kreis, Kreisfreie Stadt of Stadtkreis — en dat is geen sierlijk
 * detail maar noodzaak: 22 namen bestaan twee keer, met München en Karlsruhe als
 * bekendste. De stad München en de Landkreis München zijn twee verschillende stukken
 * kaart, en zo staan ze ook in de bron.
 *
 * De deelstaatnamen in het gebiedsmenu zijn wel Nederlands, zoals overal in het spel.
 */

import { DEELSTAAT_NL } from '../lib/duitse-deelstaten.mjs';

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'de-kreise',
  country: 'Duitsland',
  regionType: 'Kreise',
  region: { one: 'Kreis', many: 'Kreise' },
  idLabel: 'Kreiscode',

  languages: [{ code: 'de', label: 'Duits' }],

  levels: [{ one: 'Deelstaat', many: 'Deelstaten' }],

  source: {
    credit: 'Destatis / Opendatasoft',
    name: 'Opendatasoft "georef-germany-kreis" (Statistisches Bundesamt)',
    url: 'https://public.opendatasoft.com/explore/dataset/georef-germany-kreis/',
    license: 'Datenlizenz Deutschland – Namensnennung 2.0',
  },

  build: {
    url:
      'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/' +
      'georef-germany-kreis/exports/geojson?lang=de&timezone=Europe%2FBerlin',
    cache: 'de-kreis',
    simplify: '15%',
    year: (raw) => first(raw.features[0]?.properties?.year) ?? null,
    prepare(p) {
      const land = first(p.lan_code);
      return {
        id: first(p.krs_code),
        names: { de: first(p.krs_name) },
        groups: [DEELSTAAT_NL[land] || first(p.lan_name)],
      };
    },
  },
};
