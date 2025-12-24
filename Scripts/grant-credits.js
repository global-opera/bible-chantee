/**
 * ============================================
 * Script pour offrir 100 crédits aux inscrits
 * ============================================
 *
 * Usage:
 *   1. Exécuter get-subscribers.ps1 pour générer inscrits_biblechantee.csv
 *   2. Configurer les variables d'environnement Supabase
 *   3. Exécuter: node scripts/grant-credits.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const CREDITS_TO_GRANT = 100;
const CSV_PATH = path.join(__dirname, '..', 'inscrits_biblechantee.csv');

// ============================================
// VÉRIFICATION DES CREDENTIALS SUPABASE
// ============================================

console.log('========================================');
console.log('  Offrir 100 crédits aux inscrits');
console.log('========================================\n');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement Supabase manquantes:');
    console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
    console.error('   SUPABASE_SERVICE_KEY:', supabaseKey ? '✅' : '❌');
    console.error('\nDéfinir les variables d\'environnement ou créer un fichier .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Connexion Supabase OK\n');

// ============================================
// LECTURE DU CSV
// ============================================

console.log('[1/3] Lecture du fichier CSV...');

if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ Fichier non trouvé: ${CSV_PATH}`);
    console.error('   Exécuter d\'abord: powershell -File scripts/get-subscribers.ps1');
    process.exit(1);
}

const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',');

// Parser le CSV (simple, assume que les emails n'ont pas de virgules)
const emails = lines.slice(1).map(line => {
    const values = line.split(',');
    return values[0].replace(/"/g, '').trim(); // Premier colonne = Email
}).filter(email => email && email.includes('@'));

console.log(`✅ ${emails.length} email(s) trouvé(s)\n`);

// ============================================
// FONCTION POUR ACCORDER LES CRÉDITS
// ============================================

async function grantCreditsToEmail(email) {
    try {
        // 1. Vérifier si l'utilisateur existe
        const { data: existing, error: selectError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = not found
            console.error(`   ❌ ${email}: Erreur lecture - ${selectError.message}`);
            return { email, status: 'error', error: selectError.message };
        }

        if (existing) {
            // Utilisateur existe - ajouter 100 crédits
            const newCredits = (existing.credits || 0) + CREDITS_TO_GRANT;

            const { error: updateError } = await supabase
                .from('users')
                .update({
                    credits: newCredits,
                    updated_at: new Date().toISOString()
                })
                .eq('email', email);

            if (updateError) {
                console.error(`   ❌ ${email}: Erreur mise à jour - ${updateError.message}`);
                return { email, status: 'error', error: updateError.message };
            }

            console.log(`   ✅ ${email}: ${existing.credits} → ${newCredits} crédits`);
            return {
                email,
                status: 'updated',
                oldCredits: existing.credits,
                newCredits: newCredits
            };

        } else {
            // Utilisateur n'existe pas - créer avec 100 crédits
            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    email: email,
                    credits: CREDITS_TO_GRANT,
                    is_premium: false,
                    early_adopter: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (insertError) {
                console.error(`   ❌ ${email}: Erreur création - ${insertError.message}`);
                return { email, status: 'error', error: insertError.message };
            }

            console.log(`   ✅ ${email}: NOUVEAU utilisateur avec ${CREDITS_TO_GRANT} crédits`);
            return {
                email,
                status: 'created',
                newCredits: CREDITS_TO_GRANT
            };
        }

    } catch (error) {
        console.error(`   ❌ ${email}: Exception - ${error.message}`);
        return { email, status: 'error', error: error.message };
    }
}

// ============================================
// TRAITEMENT PAR BATCH
// ============================================

async function grantCreditsToAll() {
    console.log('[2/3] Attribution des crédits...\n');

    const results = {
        created: [],
        updated: [],
        errors: []
    };

    // Traiter chaque email
    for (const email of emails) {
        const result = await grantCreditsToEmail(email);

        if (result.status === 'created') {
            results.created.push(result);
        } else if (result.status === 'updated') {
            results.updated.push(result);
        } else if (result.status === 'error') {
            results.errors.push(result);
        }

        // Petit délai pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
}

// ============================================
// EXÉCUTION PRINCIPALE
// ============================================

(async () => {
    try {
        const results = await grantCreditsToAll();

        // Rapport final
        console.log('\n========================================');
        console.log('  RAPPORT FINAL');
        console.log('========================================\n');

        console.log(`📊 Total traité: ${emails.length}`);
        console.log(`✅ Nouveaux utilisateurs: ${results.created.length}`);
        console.log(`✅ Utilisateurs mis à jour: ${results.updated.length}`);
        console.log(`❌ Erreurs: ${results.errors.length}\n`);

        if (results.errors.length > 0) {
            console.log('Erreurs détaillées:');
            results.errors.forEach(err => {
                console.log(`   - ${err.email}: ${err.error}`);
            });
            console.log('');
        }

        // Sauvegarder le rapport
        const reportPath = path.join(__dirname, '..', 'rapport_credits.json');
        fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');
        console.log(`📄 Rapport sauvegardé: ${reportPath}`);

        console.log('\n========================================');
        console.log('  ✅ TERMINÉ!');
        console.log('========================================\n');

    } catch (error) {
        console.error('\n❌ Erreur fatale:', error);
        process.exit(1);
    }
})();
