/**
 * Betwiste gebieden, uit de laag "admin 0 disputed areas" van Natural Earth.
 *
 * Een spel tekent zijn land zoals dat land het zelf ziet, en arceert daarbinnen wat het
 * claimt maar niet bestuurt. Natural Earth beschrijft precies die stukken, elk met wie ze
 * bestuurt (NOTE_BRK: "Admin. by China; Claimed by India"). Hieronder staan ze op de naam
 * die Natural Earth gebruikt (BRK_NAME), met een Nederlandse naam en de bestuurder.
 */

export const NE_BETWIST = {
  url:
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/' +
    'ne_10m_admin_0_disputed_areas.geojson',
  cache: 'ne-betwist',
};

export const NE_BETWIST_BRON = 'Natural Earth (publiek domein) voor de betwiste gebieden';

const GEBIED = {
  // Door India geclaimd, door een ander bestuurd.
  'Aksai Chin': { name: 'Aksai Chin', by: 'China' },
  'Shaksam Valley': { name: 'Shaksgamvallei', by: 'China' },
  'Gilgit-Baltistan': { name: 'Gilgit-Baltistan', by: 'Pakistan' },
  'Azad Kashmir': { name: 'Azad Kasjmir', by: 'Pakistan' },
  // Door China geclaimd, door India bestuurd.
  'Arunachal Pradesh': { name: 'Arunachal Pradesh', by: 'India' },
  'Demchok': { name: 'Demchok', by: 'India' },
  'Samdu Valleys': { name: 'Samdu', by: 'India' },
  'Tirpani Valleys': { name: 'Tirpani', by: 'India' },
  'Bara Hotii Valleys': { name: 'Bara Hoti', by: 'India' },
};

/**
 * De gevraagde gebieden uit de Natural Earth-laag, als { name, by, geometry, source }.
 * Faalt als er een ontbreekt: een stilletjes verdwenen betwist gebied is erger dan een
 * mislukte bouw.
 */
export function disputedAreas(collection, sourceNames) {
  return sourceNames.map((sourceName) => {
    const feature = collection.features.find((f) => f.properties.BRK_NAME === sourceName);
    if (!feature || !GEBIED[sourceName]) throw new Error(`betwist gebied niet gevonden: ${sourceName}`);
    return { ...GEBIED[sourceName], geometry: feature.geometry, source: sourceName };
  });
}
