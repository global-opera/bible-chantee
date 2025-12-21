const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const fs = require('fs');
const path = require('path');

// Chercher le fichier JSON
const possiblePaths = [
    path.join(__dirname, 'service-account-key.json'),
    path.join(__dirname, 'peaceful-storm-436014-j9-4993028ee637.json'),
    'C:\\Users\\Stéphane CASSANI\\Desktop\\peaceful-storm-436014-j9-4993028ee637.json',
    'C:\\Users\\Stéphane CASSANI\\Downloads\\peaceful-storm-436014-j9-4993028ee637.json'
];

let credentials = null;
let keyPath = null;

for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        keyPath = p;
        credentials = JSON.parse(fs.readFileSync(p, 'utf8'));
        console.log('Cle trouvee:', p);
        break;
    }
}

if (!credentials) {
    console.error('ERREUR: Fichier JSON non trouve!');
    console.log('Chemins testes:', possiblePaths);
    process.exit(1);
}

const PROPERTY_ID = '517149339';

async function testAccess() {
    console.log('\n=== TEST ACCES GA4 ===');
    console.log('Property ID:', PROPERTY_ID);
    console.log('Service Account:', credentials.client_email);
    
    try {
        const client = new BetaAnalyticsDataClient({ credentials });
        
        // Test 1: Lister les proprietes accessibles
        console.log('\n--- Test 1: Liste des proprietes ---');
        try {
            const [accounts] = await client.listAccountSummaries();
            if (accounts && accounts.length > 0) {
                console.log('Proprietes accessibles:');
                accounts.forEach(account => {
                    console.log('  Compte:', account.displayName);
                    if (account.propertySummaries) {
                        account.propertySummaries.forEach(prop => {
                            const propId = prop.property.replace('properties/', '');
                            console.log('    - Propriete:', prop.displayName, '(ID:', propId + ')');
                        });
                    }
                });
            } else {
                console.log('Aucune propriete accessible!');
            }
        } catch (e) {
            console.log('Erreur liste:', e.message);
        }
        
        // Test 2: Requete sur la propriete specifique
        console.log('\n--- Test 2: Acces Property', PROPERTY_ID, '---');
        const [response] = await client.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }]
        });
        
        console.log('\n✅ SUCCES! Acces autorise!');
        console.log('Utilisateurs actifs (7 jours):', response.rows?.[0]?.metricValues?.[0]?.value || '0');
        console.log('\n🎉 TOUT FONCTIONNE!');
        console.log('→ Le probleme vient de Netlify');
        console.log('→ Verifier que GA4_PROPERTY_ID = 517149339 sur Netlify');
        
    } catch (error) {
        console.log('\n❌ ERREUR:', error.message);
        
        if (error.message.includes('PERMISSION_DENIED')) {
            console.log('\n→ Le Service Account n\'a pas acces a cette propriete');
            console.log('→ Verifier dans GA4: Admin > Gestion des acces a la propriete');
            console.log('→ Attendre 10 min si vous venez d\'ajouter les permissions');
        } else if (error.message.includes('NOT_FOUND')) {
            console.log('\n→ Property ID incorrect');
            console.log('→ Verifier l\'URL GA4 pour trouver le bon ID');
        }
    }
}

testAccess();
