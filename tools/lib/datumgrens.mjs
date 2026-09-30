/**
 * Landen over de datumgrens heen.
 *
 * De bronnen knippen elke vorm op 180° en leggen het stuk erachter aan de andere kant van
 * de wereld: Tsjoekotka loopt van 172° tot 180° en gaat verder op -180°, de westelijke
 * Aleoeten liggen op +179°. Zo getekend strekt Rusland of de VS zich over de hele
 * wereldkaart uit, en kadert het spel een lege planeet in.
 *
 * Leaflet kan gerust met lengtegraden voorbij 180° rekenen. Door de punten aan de verkeerde
 * kant 360° op te schuiven komt het land weer aaneen te liggen: Tsjoekotka loopt dan door
 * tot 190°, de Aleoeten beginnen op -181°. Mapshaper rekent daar net zo goed mee.
 */

/** Past `shift(lon)` toe op elk punt van een Polygon of MultiPolygon. */
export function shiftLongitudes(geometry, shift) {
  const walk = (coords) =>
    typeof coords[0] === 'number' ? [shift(coords[0]), ...coords.slice(1)] : coords.map(walk);
  return { ...geometry, coordinates: walk(geometry.coordinates) };
}

/** Voor een land dat oostwaarts over de datumgrens loopt (Rusland). */
export const eastward = (lon) => (lon < 0 ? lon + 360 : lon);

/** Voor een land dat westwaarts over de datumgrens loopt (de VS, met Guam en de Marianen). */
export const westward = (lon) => (lon > 0 ? lon - 360 : lon);
