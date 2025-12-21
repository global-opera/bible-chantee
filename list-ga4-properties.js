const { google } = require('googleapis');
const fs = require('fs');

// Charger les credentials depuis le fichier JSON
const credentials = JSON.parse(fs.readFileSync('./service-account-key.json', 'utf8'));

async function listProperties() {
  console.log('=== Diagnostic GA4: Liste des propriétés accessibles ===');
  console.log('Service Account:', credentials.client_email);
  console.log('Project:', credentials.project_id);
  console.log('');

  try {
    // Créer un client OAuth2 avec le Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: [
        'https://www.googleapis.com/auth/analytics.readonly',
        'https://www.googleapis.com/auth/analytics'
      ]
    });

    const authClient = await auth.getClient();
    const analyticsadmin = google.analyticsadmin({
      version: 'v1beta',
      auth: authClient
    });

    console.log('Récupération de la liste des comptes GA4...');

    // Lister tous les comptes accessibles
    const accountsResponse = await analyticsadmin.accounts.list();
    const accounts = accountsResponse.data.accounts || [];

    if (accounts.length === 0) {
      console.log('❌ Aucun compte GA4 accessible.');
      console.log('');
      console.log('Le Service Account n\'a accès à aucun compte Analytics.');
      console.log('Vous devez l\'ajouter dans Google Analytics:');
      console.log('  Admin > Gestion des accès au compte > Ajouter des utilisateurs');
      console.log('  Email:', credentials.client_email);
      return;
    }

    console.log(`✅ ${accounts.length} compte(s) trouvé(s):\n`);

    // Pour chaque compte, lister les propriétés
    for (const account of accounts) {
      console.log(`📊 Compte: ${account.displayName}`);
      console.log(`   ID: ${account.name}`);

      try {
        const propertiesResponse = await analyticsadmin.properties.list({
          filter: `parent:${account.name}`
        });

        const properties = propertiesResponse.data.properties || [];

        if (properties.length === 0) {
          console.log('   ⚠️  Aucune propriété dans ce compte');
        } else {
          console.log(`   ✅ ${properties.length} propriété(s):\n`);

          properties.forEach(prop => {
            // Extraire l'ID numérique de la propriété
            const propId = prop.name.split('/')[1];
            console.log(`      • ${prop.displayName}`);
            console.log(`        Property ID: ${propId}`);
            console.log(`        Fuseau horaire: ${prop.timeZone}`);
            console.log(`        Devise: ${prop.currencyCode}`);
            console.log('');
          });
        }
      } catch (propError) {
        console.log('   ❌ Erreur lors de la récupération des propriétés:', propError.message);
      }

      console.log('');
    }

    console.log('=== Recommandations ===');
    console.log('1. Vérifiez que le Property ID 517149339 apparaît dans la liste ci-dessus');
    console.log('2. Si oui, utilisez ce Property ID dans Netlify (GA4_PROPERTY_ID)');
    console.log('3. Si non, ajoutez le Service Account au niveau PROPRIÉTÉ dans GA4:');
    console.log('   Analytics > Admin > Propriété "Bible Chantée" > Gestion des accès');
    console.log('   Email:', credentials.client_email);
    console.log('   Rôle: Lecteur ou Administrateur');

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    console.error('');

    if (error.message.includes('PERMISSION_DENIED')) {
      console.error('Le Service Account n\'a pas les permissions nécessaires.');
      console.error('');
      console.error('Solutions:');
      console.error('1. Vérifier que l\'API "Google Analytics Admin API" est activée');
      console.error('   console.cloud.google.com > API et services > Bibliothèque');
      console.error('   Rechercher: "Google Analytics Admin API"');
      console.error('');
      console.error('2. Ajouter le Service Account dans GA4:');
      console.error('   Admin > Compte > Gestion des accès au compte');
      console.error('   Email:', credentials.client_email);
      console.error('   Rôle: Lecteur');
    } else if (error.message.includes('not enabled')) {
      console.error('L\'API n\'est pas activée pour ce projet.');
      console.error('');
      console.error('Activer l\'API:');
      console.error('1. Aller sur: https://console.cloud.google.com/apis/library');
      console.error('2. Rechercher "Google Analytics Admin API"');
      console.error('3. Cliquer sur "Activer"');
    } else {
      console.error('Détails complets:');
      console.error(error);
    }
  }
}

listProperties();
