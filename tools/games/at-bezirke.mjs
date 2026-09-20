/**
 * Oostenrijk (Bezirke) — de 94 politieke districten, met de deelstaat als gebiedskeuze.
 *
 * Vijftien ervan zijn Statutarstädte: steden die hun eigen district vormen. Die hebben in
 * de bron "(Stadt)" achter hun naam staan — Eisenstadt(Stadt), Wels(Stadt) — en daar
 * ontbreekt een spatie, die we erbij zetten.
 *
 * Wenen is tegelijk deelstaat, gemeente en district. De bron levert de stad één keer als
 * geheel (code 900) en daarnaast nog eens als 23 Gemeindebezirke (901-923). Die 23 vallen
 * weg: het zijn stadsdelen, geen politieke districten, en ze zouden het spel laten
 * ontploffen met 23 hapklare brokjes binnen de Ring.
 *
 * De deelstaat zit in het eerste cijfer van de districtscode — dezelfde systematiek als de
 * Duitse Kreise, waar de deelstaat in de eerste twee cijfers zit.
 */

import { OOSTENRIJK_GKZ_NL } from '../lib/nederlandse-namen.mjs';

const first = (v) => (Array.isArray(v) ? v[0] : v) ?? null;

export default {
  id: 'at-bezirke',
  country: 'Oostenrijk',
  regionType: 'Bezirke',
  region: { one: 'Bezirk', many: 'Bezirke' },
  idLabel: 'Districtscode',

  languages: [{ code: 'de', label: 'Duits' }],

  levels: [{ one: 'Deelstaat', many: 'Deelstaten' }],

  source: {
    credit: 'STATISTIK AUSTRIA',
    name: 'STATISTIK AUSTRIA — Gliederung Österreichs in politische Bezirke',
    url: 'https://data.statistik.gv.at/web/meta.jsp?dataset=OGDEXT_POLBEZ_1',
    license: 'CC BY 4.0 — bronvermelding vereist',
  },

  build: {
    url:
      'https://www.statistik.at/gs-open/GEODATA/ows?service=WFS&version=1.0.0' +
      '&request=GetFeature&typeName=GEODATA:STATISTIK_AUSTRIA_POLBEZ_20260101' +
      '&outputFormat=application/json&srsName=EPSG:4326',
    cache: 'at-bezirk',
    // De bron is erg gedetailleerd (21 MB voor 117 vormen); dit brengt de districten
    // op dezelfde maat als de Duitse Kreise.
    simplify: '5%',
    year: '2026',
    prepare(p) {
      const code = first(p.g_id);
      // 901-923 zijn de Weense stadsdelen; 900 is Wenen als geheel en blijft.
      if (code[0] === '9' && code !== '900') return null;
      return {
        id: code,
        names: { de: first(p.g_name).replace(/\(/, ' (') },
        groups: [OOSTENRIJK_GKZ_NL[code[0]]],
      };
    },
  },
};
