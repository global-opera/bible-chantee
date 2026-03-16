/* global-audience-data.js
 * Audience mondiale consolidée — Bible Chantée
 * Sources : Spotify for Artists + Apple Music for Artists
 * Période  : 28 derniers jours (mars 2026)
 * YouTube  : données par pays non encore exportées depuis YouTube Studio
 * Boomplay : en attente de validation Boomplay for Artists
 *
 * Structure par pays :
 *   sources[]  : plateformes confirmant une présence d'audience
 *   sourceCount: nombre de plateformes
 *   continent  : continent géographique
 */
window.globalAudienceData = {
  updatedAt: '2026-03',
  period: '28 derniers jours',
  sources: ['Spotify for Artists', 'Apple Music for Artists'],
  pendingSources: ['YouTube Studio', 'Boomplay for Artists'],
  countries: [
    /* ── 11 pays présents sur Spotify ET Apple Music ── */
    { country: 'France',           code: 'FR', lat:  46.23,  lng:   2.21,  continent: 'Europe',   sources: ['Spotify','Apple Music'] },
    { country: 'États-Unis',       code: 'US', lat:  37.09,  lng: -95.71,  continent: 'Amérique', sources: ['Spotify','Apple Music'] },
    { country: 'Canada',           code: 'CA', lat:  56.13,  lng:-106.35,  continent: 'Amérique', sources: ['Spotify','Apple Music'] },
    { country: 'Royaume-Uni',      code: 'GB', lat:  55.38,  lng:  -3.44,  continent: 'Europe',   sources: ['Spotify','Apple Music'] },
    { country: 'Allemagne',        code: 'DE', lat:  51.17,  lng:  10.45,  continent: 'Europe',   sources: ['Spotify','Apple Music'] },
    { country: 'Suisse',           code: 'CH', lat:  46.82,  lng:   8.23,  continent: 'Europe',   sources: ['Spotify','Apple Music'] },
    { country: 'Belgique',         code: 'BE', lat:  50.50,  lng:   4.47,  continent: 'Europe',   sources: ['Spotify','Apple Music'] },
    { country: 'Brésil',           code: 'BR', lat: -14.24,  lng: -51.93,  continent: 'Amérique', sources: ['Spotify','Apple Music'] },
    { country: 'Singapour',        code: 'SG', lat:   1.35,  lng: 103.82,  continent: 'Asie',     sources: ['Spotify','Apple Music'] },
    { country: 'République démocratique du Congo', code: 'CD', lat: -4.04, lng: 21.76, continent: 'Afrique', sources: ['Spotify','Apple Music'] },
    { country: 'Afrique du Sud',   code: 'ZA', lat: -30.56,  lng:  22.94,  continent: 'Afrique',  sources: ['Spotify','Apple Music'] },
    /* ── 3 pays présents sur Spotify uniquement ── */
    { country: 'Nigeria',          code: 'NG', lat:   9.08,  lng:   8.68,  continent: 'Afrique',  sources: ['Spotify'] },
    { country: 'Guinée',           code: 'GN', lat:   9.95,  lng: -11.31,  continent: 'Afrique',  sources: ['Spotify'] },
    { country: 'Philippines',      code: 'PH', lat:  12.88,  lng: 121.77,  continent: 'Asie',     sources: ['Spotify'] },
    /* ── 26 pays présents sur Apple Music uniquement ── */
    { country: 'Pays-Bas',         code: 'NL', lat:  52.13,  lng:   5.29,  continent: 'Europe',   sources: ['Apple Music'] },
    { country: 'Australie',        code: 'AU', lat: -25.27,  lng: 133.78,  continent: 'Océanie',  sources: ['Apple Music'] },
    { country: "Côte d'Ivoire",    code: 'CI', lat:   7.54,  lng:  -5.55,  continent: 'Afrique',  sources: ['Apple Music'] },
    { country: 'Sénégal',          code: 'SN', lat:  14.50,  lng: -14.45,  continent: 'Afrique',  sources: ['Apple Music'] },
    { country: 'Israël',           code: 'IL', lat:  31.05,  lng:  34.85,  continent: 'Asie',     sources: ['Apple Music'] },
    { country: 'Malaisie',         code: 'MY', lat:   4.21,  lng: 101.98,  continent: 'Asie',     sources: ['Apple Music'] },
    { country: 'Mali',             code: 'ML', lat:  17.57,  lng:  -3.99,  continent: 'Afrique',  sources: ['Apple Music'] },
    { country: 'Maurice',          code: 'MU', lat: -20.35,  lng:  57.55,  continent: 'Afrique',  sources: ['Apple Music'] },
    { country: 'Angola',           code: 'AO', lat: -11.20,  lng:  17.87,  continent: 'Afrique',  sources: ['Apple Music'] },
    { country: 'Autriche',         code: 'AT', lat:  47.52,  lng:  14.55,  continent: 'Europe',   sources: ['Apple Music'] },
    { country: 'Espagne',          code: 'ES', lat:  40.46,  lng:  -3.75,  continent: 'Europe',   sources: ['Apple Music'] },
    { country: 'Mexique',          code: 'MX', lat:  23.63,  lng:-102.55,  continent: 'Amérique', sources: ['Apple Music'] },
    { country: 'Cameroun',         code: 'CM', lat:   7.37,  lng:  12.35,  continent: 'Afrique',  sources: ['Apple Music'] },
    { country: 'Chili',            code: 'CL', lat: -35.68,  lng: -71.54,  continent: 'Amérique', sources: ['Apple Music'] },
    { country: 'Inde',             code: 'IN', lat:  20.59,  lng:  78.96,  continent: 'Asie',     sources: ['Apple Music'] },
    { country: 'Japon',            code: 'JP', lat:  36.20,  lng: 138.25,  continent: 'Asie',     sources: ['Apple Music'] },
    { country: 'République du Congo', code: 'CG', lat: -0.23, lng: 15.83, continent: 'Afrique',  sources: ['Apple Music'] },
    { country: 'Botswana',         code: 'BW', lat: -22.33,  lng:  24.68,  continent: 'Afrique',  sources: ['Apple Music'] },
    { country: 'Danemark',         code: 'DK', lat:  56.26,  lng:   9.50,  continent: 'Europe',   sources: ['Apple Music'] },
    { country: 'Kenya',            code: 'KE', lat:   0.02,  lng:  37.91,  continent: 'Afrique',  sources: ['Apple Music'] },
    { country: 'Maroc',            code: 'MA', lat:  31.79,  lng:  -7.09,  continent: 'Afrique',  sources: ['Apple Music'] },
    { country: 'Mozambique',       code: 'MZ', lat: -18.67,  lng:  35.53,  continent: 'Afrique',  sources: ['Apple Music'] },
    { country: 'Papouasie-Nouvelle-Guinée', code: 'PG', lat: -6.31, lng: 143.96, continent: 'Océanie', sources: ['Apple Music'] },
    { country: 'Portugal',         code: 'PT', lat:  39.40,  lng:  -8.22,  continent: 'Europe',   sources: ['Apple Music'] },
    { country: 'République dominicaine', code: 'DO', lat: 18.74, lng: -70.16, continent: 'Amérique', sources: ['Apple Music'] },
    { country: 'Zambie',           code: 'ZM', lat: -13.13,  lng:  27.85,  continent: 'Afrique',  sources: ['Apple Music'] }
  ]
};
