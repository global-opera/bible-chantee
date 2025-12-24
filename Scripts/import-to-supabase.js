/**
 * ============================================
 * Importer les 13 inscrits Netlify dans Supabase
 * ============================================
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('========================================');
console.log('  Import des inscrits dans Supabase');
console.log('========================================\n');

// Credentials Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://ozkztvstozwdkpsyhgsr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquant');
    console.error('\nDéfinir la variable:');
    console.error('  $env:SUPABASE_SERVICE_ROLE_KEY = "votre_key"');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Connexion Supabase OK\n');

// Lire les inscrits depuis le JSON
const jsonPath = path.join(__dirname, '..', 'inscrits_biblechantee.json');

if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Fichier non trouvé: ${jsonPath}`);
    console.error('   Exécuter d\'abord: powershell -File Scripts/download-subscribers.ps1');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const subscribers = data.subscribers;

console.log(`📧 ${subscribers.length} inscrit(s) à importer\n`);

// Fonction d'import
async function importSubscribers() {
    const results = {
        created: [],
        existing: [],
        errors: []
    };

    for (const sub of subscribers) {
        try {
            // Vérifier si l'utilisateur existe déjà
            const { data: existing, error: selectError } = await supabase
                .from('users')
                .select('*')
                .eq('email', sub.email)
                .single();

            if (existing) {
                console.log(`   ⏭️  ${sub.email} - Existe déjà`);
                results.existing.push(sub.email);
                continue;
            }

            // Créer le nouvel utilisateur
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert({
                    email: sub.email,
                    credits: 100, // 100 crédits de base
                    is_premium: false,
                    early_adopter: true, // Tous les 13 premiers sont early adopters
                    preferred_language: sub.language,
                    created_at: sub.created_at
                })
                .select()
                .single();

            if (insertError) {
                console.error(`   ❌ ${sub.email} - Erreur: ${insertError.message}`);
                results.errors.push({ email: sub.email, error: insertError.message });
                continue;
            }

            console.log(`   ✅ ${sub.email} - Créé avec 100 crédits (early adopter)`);
            results.created.push(sub.email);

        } catch (error) {
            console.error(`   ❌ ${sub.email} - Exception: ${error.message}`);
            results.errors.push({ email: sub.email, error: error.message });
        }

        // Petit délai pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
}

// Exécution
(async () => {
    try {
        console.log('🚀 Début de l\'import...\n');

        const results = await importSubscribers();

        // Rapport final
        console.log('\n========================================');
        console.log('  RAPPORT FINAL');
        console.log('========================================\n');

        console.log(`✅ Créés: ${results.created.length}`);
        console.log(`⏭️  Existants: ${results.existing.length}`);
        console.log(`❌ Erreurs: ${results.errors.length}\n`);

        if (results.errors.length > 0) {
            console.log('Erreurs détaillées:');
            results.errors.forEach(err => {
                console.log(`   - ${err.email}: ${err.error}`);
            });
            console.log('');
        }

        // Vérifier le total dans Supabase
        const { count } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        console.log(`📊 Total utilisateurs dans Supabase: ${count}`);

        // Statistiques
        const { data: stats } = await supabase
            .from('users')
            .select('*');

        const premiumCount = stats.filter(u => u.is_premium).length;
        const earlyAdoptersCount = stats.filter(u => u.early_adopter).length;
        const credits100Plus = stats.filter(u => u.credits >= 100).length;

        console.log(`👑 Premium: ${premiumCount}`);
        console.log(`🌟 Early adopters: ${earlyAdoptersCount}`);
        console.log(`💎 100+ crédits: ${credits100Plus}`);

        console.log('\n========================================');
        console.log('  ✅ IMPORT TERMINÉ!');
        console.log('========================================\n');

        console.log('Prochaine étape:');
        console.log('  Accédez au dashboard: https://biblechantee.com/admin-dashboard.html');
        console.log('');

    } catch (error) {
        console.error('\n❌ Erreur fatale:', error);
        process.exit(1);
    }
})();
