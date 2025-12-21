const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');

// Charger les credentials depuis le fichier JSON
const credentials = JSON.parse(fs.readFileSync('./service-account-key.json', 'utf8'));

// Property ID à tester (extrait de l'URL GA4)
const PROPERTY_ID = '517149339'; // Bible Chantée Property ID

async function testAccess() {
  console.log('=== Test d\'accès GA4 ===');
  console.log('Property ID:', PROPERTY_ID);
  console.log('Service Account:', credentials.client_email);
  console.log('');

  const client = new BetaAnalyticsDataClient({ credentials });

  try {
    console.log('Test 1: Récupération des métadonnées de la propriété...');
    const [metadata] = await client.getMetadata({
      name: `properties/${PROPERTY_ID}/metadata`
    });
    console.log('✅ Accès OK !');
    console.log('Propriété:', metadata.name);
    console.log('');

    console.log('Test 2: Récupération des visiteurs aujourd\'hui...');
    const [response] = await client.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }]
    });
    console.log('✅ Requête OK !');
    console.log('Visiteurs actifs:', response.rows?.[0]?.metricValues?.[0]?.value || 0);
    console.log('');

    console.log('🎉 TOUT FONCTIONNE !');
    console.log('Vous pouvez maintenant déployer sur Netlify.');

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    console.error('');

    if (error.message.includes('PERMISSION_DENIED')) {
      console.error('🔴 Le Service Account n\'a pas accès à cette propriété.');
      console.error('');
      console.error('Solutions:');
      console.error('1. Vérifier que le Property ID est correct');
      console.error('2. Ajouter le Service Account dans GA4:');
      console.error('   Admin > Propriété > Gestion des accès à la propriété');
      console.error('   Email:', credentials.client_email);
      console.error('   Rôle: Lecteur');
      console.error('3. Attendre 5-10 minutes que les permissions se propagent');
    } else if (error.message.includes('NOT_FOUND')) {
      console.error('🔴 Property ID incorrect ou propriété inexistante.');
      console.error('');
      console.error('Vérifier le Property ID dans:');
      console.error('Analytics > Admin > Paramètres de la propriété');
    } else {
      console.error('Détails:', error);
    }
  }
}

testAccess();
