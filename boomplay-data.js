/* boomplay-data.js
 * Structure de préparation pour intégration Boomplay — Bible Chantée
 * Statut  : données non encore disponibles — à remplir manuellement
 * Source  : Boomplay for Artists (accès à obtenir)
 * Note    : ne pas afficher dans la carte audience tant que streams/listeners = 0
 */
window.boomplayData = {
  platform:    'Boomplay',
  platformId:  'boomplay',
  region:      'Afrique subsaharienne',
  officialUrl: 'https://www.boomplay.com',
  artistUrl:   'https://www.boomplay.com/search/default/Bible+Chant%C3%A9e',

  /* ── Métriques (à mettre à jour dès accès Boomplay for Artists) ── */
  streams:    0,       /* Total écoutes cumulées */
  listeners:  0,       /* Auditeurs uniques (28 jours) */
  downloads:  0,       /* Téléchargements (si disponible) */

  /* ── Répartition géographique (à compléter) ── */
  topCountries: [
    /* Exemple de structure attendue :
    { country: 'Nigeria',  code: 'NG', lat: 9.08,  lng:  8.68, streams: 0 },
    { country: 'Ghana',    code: 'GH', lat: 7.95,  lng: -1.02, streams: 0 },
    { country: 'Kenya',    code: 'KE', lat:-1.29,  lng: 36.82, streams: 0 },
    { country: 'Tanzania', code: 'TZ', lat:-6.37,  lng: 34.89, streams: 0 }
    */
  ],

  /* ── Titres les plus écoutés (à compléter) ── */
  topTracks: [],

  /* ── Métadonnées ── */
  dataAvailable: false,   /* Passer à true dès que les métriques sont renseignées */
  lastUpdated:   '',
  notes: 'Présence confirmée sur Boomplay. Données analytics en attente d\'accès Boomplay for Artists.'
};
