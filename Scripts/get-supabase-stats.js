/**
 * ============================================
 * Script pour récupérer les statistiques Supabase
 * ============================================
 *
 * Affiche :
 * - Total utilisateurs
 * - Utilisateurs premium
 * - Utilisateurs avec 100+ crédits
 * - Distribution des crédits
 * - Early adopters
 */

const { createClient } = require('@supabase/supabase-js');

// ============================================
// CONFIGURATION
// ============================================

console.log('========================================');
console.log('  Statistiques Supabase - Bible Chantée');
console.log('========================================\n');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement Supabase manquantes:');
    console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
    console.error('   SUPABASE_SERVICE_KEY:', supabaseKey ? '✅' : '❌');
    console.error('\nDéfinir les variables d\'environnement');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Connexion Supabase OK\n');

// ============================================
// RÉCUPÉRATION DES DONNÉES
// ============================================

async function getStats() {
    console.log('[1/5] Récupération des utilisateurs...');

    // Récupérer TOUS les utilisateurs
    const { data: allUsers, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }

    console.log(`✅ ${allUsers.length} utilisateur(s) trouvé(s)\n`);

    // ============================================
    // STATISTIQUES GÉNÉRALES
    // ============================================

    console.log('[2/5] Calcul des statistiques...\n');

    const stats = {
        total: allUsers.length,
        premium: allUsers.filter(u => u.is_premium).length,
        with100Credits: allUsers.filter(u => u.credits >= 100).length,
        earlyAdopters: allUsers.filter(u => u.early_adopter).length,
        totalCredits: allUsers.reduce((sum, u) => sum + (u.credits || 0), 0),
        averageCredits: 0
    };

    stats.averageCredits = stats.total > 0
        ? Math.round(stats.totalCredits / stats.total)
        : 0;

    console.log('📊 STATISTIQUES GÉNÉRALES');
    console.log('─'.repeat(40));
    console.log(`Total utilisateurs:      ${stats.total}`);
    console.log(`Utilisateurs premium:    ${stats.premium}`);
    console.log(`Utilisateurs 100+ crédits: ${stats.with100Credits}`);
    console.log(`Early adopters:          ${stats.earlyAdopters}`);
    console.log(`Total crédits:           ${stats.totalCredits}`);
    console.log(`Moyenne crédits:         ${stats.averageCredits}`);
    console.log('');

    // ============================================
    // DISTRIBUTION DES CRÉDITS
    // ============================================

    console.log('[3/5] Distribution des crédits...\n');

    const creditRanges = {
        '0': 0,
        '1-50': 0,
        '51-100': 0,
        '101-500': 0,
        '500+': 0
    };

    allUsers.forEach(u => {
        const credits = u.credits || 0;
        if (credits === 0) creditRanges['0']++;
        else if (credits <= 50) creditRanges['1-50']++;
        else if (credits <= 100) creditRanges['51-100']++;
        else if (credits <= 500) creditRanges['101-500']++;
        else creditRanges['500+']++;
    });

    console.log('💰 DISTRIBUTION DES CRÉDITS');
    console.log('─'.repeat(40));
    Object.entries(creditRanges).forEach(([range, count]) => {
        const percentage = ((count / stats.total) * 100).toFixed(1);
        console.log(`${range.padEnd(10)} : ${count.toString().padStart(4)} (${percentage}%)`);
    });
    console.log('');

    // ============================================
    // TOP UTILISATEURS (PAR CRÉDITS)
    // ============================================

    console.log('[4/5] Top utilisateurs...\n');

    const topUsers = [...allUsers]
        .sort((a, b) => (b.credits || 0) - (a.credits || 0))
        .slice(0, 10);

    console.log('🏆 TOP 10 UTILISATEURS (par crédits)');
    console.log('─'.repeat(60));
    console.log('Email'.padEnd(35) + 'Crédits'.padEnd(10) + 'Premium');
    console.log('─'.repeat(60));

    topUsers.forEach(u => {
        const email = (u.email || 'N/A').substring(0, 32).padEnd(35);
        const credits = (u.credits || 0).toString().padEnd(10);
        const premium = u.is_premium ? '✅' : '';
        console.log(`${email}${credits}${premium}`);
    });
    console.log('');

    // ============================================
    // LISTES DÉTAILLÉES
    // ============================================

    console.log('[5/5] Export des listes...\n');

    const fs = require('fs');
    const path = require('path');

    // Liste des premium
    const premiumUsers = allUsers.filter(u => u.is_premium);
    const premiumPath = path.join(__dirname, '..', 'liste_premium.json');
    fs.writeFileSync(premiumPath, JSON.stringify(premiumUsers, null, 2), 'utf-8');
    console.log(`✅ Liste premium: ${premiumPath} (${premiumUsers.length} utilisateurs)`);

    // Liste des 100+ crédits
    const users100Plus = allUsers.filter(u => u.credits >= 100);
    const credits100Path = path.join(__dirname, '..', 'liste_100credits.json');
    fs.writeFileSync(credits100Path, JSON.stringify(users100Plus, null, 2), 'utf-8');
    console.log(`✅ Liste 100+ crédits: ${credits100Path} (${users100Plus.length} utilisateurs)`);

    // Liste early adopters
    const earlyAdoptersUsers = allUsers.filter(u => u.early_adopter);
    const earlyPath = path.join(__dirname, '..', 'liste_early_adopters.json');
    fs.writeFileSync(earlyPath, JSON.stringify(earlyAdoptersUsers, null, 2), 'utf-8');
    console.log(`✅ Liste early adopters: ${earlyPath} (${earlyAdoptersUsers.length} utilisateurs)`);

    // Statistiques complètes
    const statsPath = path.join(__dirname, '..', 'stats_supabase.json');
    fs.writeFileSync(statsPath, JSON.stringify({
        generatedAt: new Date().toISOString(),
        stats,
        creditRanges,
        topUsers: topUsers.map(u => ({
            email: u.email,
            credits: u.credits,
            isPremium: u.is_premium,
            createdAt: u.created_at
        }))
    }, null, 2), 'utf-8');
    console.log(`✅ Statistiques: ${statsPath}`);

    // CSV pour Excel
    const csvLines = [
        'Email,Credits,Premium,EarlyAdopter,CreatedAt'
    ];
    allUsers.forEach(u => {
        csvLines.push(
            `${u.email},${u.credits || 0},${u.is_premium ? 'Oui' : 'Non'},${u.early_adopter ? 'Oui' : 'Non'},${u.created_at}`
        );
    });
    const csvPath = path.join(__dirname, '..', 'utilisateurs_supabase.csv');
    fs.writeFileSync(csvPath, csvLines.join('\n'), 'utf-8');
    console.log(`✅ CSV: ${csvPath}`);

    console.log('');

    // ============================================
    // RAPPORT FINAL
    // ============================================

    console.log('========================================');
    console.log('  ✅ TERMINÉ!');
    console.log('========================================');
    console.log('Fichiers générés:');
    console.log(`  - liste_premium.json (${premiumUsers.length})`);
    console.log(`  - liste_100credits.json (${users100Plus.length})`);
    console.log(`  - liste_early_adopters.json (${earlyAdoptersUsers.length})`);
    console.log(`  - stats_supabase.json`);
    console.log(`  - utilisateurs_supabase.csv (${allUsers.length})`);
    console.log('');
}

// ============================================
// EXÉCUTION
// ============================================

getStats().catch(error => {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
});
