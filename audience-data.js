/* audience-data.js
 * Données d'audience Spotify for Artists — Bible Chantée
 * Métrique   : Auditeurs uniques (≠ streams)
 * Période    : 28 derniers jours
 * Source     : Spotify for Artists > Public > Localisation > Top pays
 * Mis à jour : mars 2026
 * Total      : 436 auditeurs uniques · 14 pays · 4 continents
 *
 * Valeurs lues directement dans l'interface Spotify for Artists :
 * #1 France 175 | #2 Brésil 90 | #3 États-Unis 33 | #4 Canada 25
 * #5 Allemagne 20 | #6 Suisse 20 | #7 Nigeria 20 | #8 Belgique 16
 * #9 Royaume-Uni 8 | #10 RD Congo 6 | #11 Afrique du Sud 6
 * #12 Guinée 6 | #13 Singapour 6 | #14 Philippines 5
 */
window.audienceData = {
  source:     'Spotify for Artists',
  metric:     'listeners',           /* 'listeners' = auditeurs uniques | 'streams' = écoutes */
  metricLabel:'auditeurs',
  period:     '28 derniers jours',
  updatedAt:  '2026-03',
  totalListeners: 436,
  continents: ['Europe', 'Amérique', 'Afrique', 'Asie'],
  countries: [
    { country: 'France',                           code: 'FR', lat: 46.23,  lng:   2.21,  listeners: 175, continent: 'Europe'   },
    { country: 'Brésil',                           code: 'BR', lat: -14.24, lng: -51.93,  listeners:  90, continent: 'Amérique' },
    { country: 'États-Unis',                       code: 'US', lat:  37.09, lng: -95.71,  listeners:  33, continent: 'Amérique' },
    { country: 'Canada',                           code: 'CA', lat:  56.13, lng:-106.35,  listeners:  25, continent: 'Amérique' },
    { country: 'Allemagne',                        code: 'DE', lat:  51.17, lng:  10.45,  listeners:  20, continent: 'Europe'   },
    { country: 'Suisse',                           code: 'CH', lat:  46.82, lng:   8.23,  listeners:  20, continent: 'Europe'   },
    { country: 'Nigeria',                          code: 'NG', lat:   9.08, lng:   8.68,  listeners:  20, continent: 'Afrique'  },
    { country: 'Belgique',                         code: 'BE', lat:  50.50, lng:   4.47,  listeners:  16, continent: 'Europe'   },
    { country: 'Royaume-Uni',                      code: 'GB', lat:  55.38, lng:  -3.44,  listeners:   8, continent: 'Europe'   },
    { country: 'République démocratique du Congo', code: 'CD', lat:  -4.04, lng:  21.76,  listeners:   6, continent: 'Afrique'  },
    { country: 'Afrique du Sud',                   code: 'ZA', lat: -30.56, lng:  22.94,  listeners:   6, continent: 'Afrique'  },
    { country: 'Guinée',                           code: 'GN', lat:   9.95, lng: -11.31,  listeners:   6, continent: 'Afrique'  },
    { country: 'Singapour',                        code: 'SG', lat:   1.35, lng: 103.82,  listeners:   6, continent: 'Asie'     },
    { country: 'Philippines',                      code: 'PH', lat:  12.88, lng: 121.77,  listeners:   5, continent: 'Asie'     }
  ]
};
