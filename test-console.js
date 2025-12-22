/**
 * SCRIPT DE TEST CONSOLE - Bible Chantée Popup Anti-Spam
 *
 * Copier/coller ce script dans la console DevTools (F12)
 * pour valider automatiquement les protections anti-spam
 */

console.log('🧪 === TEST ANTI-SPAM BIBLE CHANTÉE ===\n');

// Test 1: Vérifier sessionStorage
console.log('📋 Test 1: Vérification sessionStorage');
const shown = sessionStorage.getItem('bc_paywall_shown');
const last = sessionStorage.getItem('bc_paywall_last');

console.log('  bc_paywall_shown:', shown);
console.log('  bc_paywall_last:', last);

if (shown === '1') {
    console.log('  ✅ Flag "shown" posé correctement');
} else {
    console.log('  ⚠️ Flag "shown" non posé (popup pas encore déclenché ?)');
}

if (last && !isNaN(Number(last))) {
    const timestamp = new Date(Number(last));
    console.log('  ✅ Cooldown timestamp:', timestamp.toLocaleString());

    const elapsed = Date.now() - Number(last);
    const remaining = Math.max(0, 45000 - elapsed);

    if (remaining > 0) {
        console.log(`  ⏱️ Cooldown actif: ${Math.ceil(remaining/1000)}s restants`);
    } else {
        console.log('  ⏱️ Cooldown expiré (> 45s)');
    }
} else {
    console.log('  ⚠️ Cooldown non initialisé');
}

// Test 2: Vérifier overlay état
console.log('\n📋 Test 2: État de l\'overlay');
const overlay = document.getElementById('creditsOverlay');
const modal = document.getElementById('purchase-modal');

if (overlay) {
    console.log('  Overlay credits.js:');
    console.log('    - display:', overlay.style.display);
    console.log('    - aria-hidden:', overlay.getAttribute('aria-hidden'));
    console.log('    - visible:', overlay.style.display === 'flex' ? '✅ OUI' : '✅ NON (correct)');
}

if (modal) {
    console.log('  Modal credits-system.js:');
    console.log('    - display:', modal.style.display);
    console.log('    - visible:', modal.style.display === 'flex' ? '❌ OUI (bloque UI!)' : '✅ NON (correct)');
}

// Test 3: Vérifier body overflow
console.log('\n📋 Test 3: Scroll et overflow');
console.log('  body.style.overflow:', document.body.style.overflow || '(défaut)');
console.log('  body.classList:', [...document.body.classList].join(', ') || '(aucune)');

if (document.body.style.overflow === 'hidden') {
    console.log('  ❌ Scroll bloqué! (overflow:hidden actif)');
} else {
    console.log('  ✅ Scroll fonctionnel');
}

// Test 4: Vérifier systèmes de crédits
console.log('\n📋 Test 4: Systèmes de crédits détectés');

if (typeof CREDITS !== 'undefined') {
    console.log('  ✅ CREDITS (credits.js) chargé');
    try {
        console.log('    - Credits restants:', CREDITS.getCredits());
        console.log('    - Premium:', CREDITS.isPremium());
    } catch (e) {
        console.log('    ⚠️ Erreur:', e.message);
    }
}

if (typeof creditsSystem !== 'undefined') {
    console.log('  ✅ creditsSystem (credits-system.js) chargé');
    try {
        console.log('    - Credits restants:', creditsSystem.getCredits());
        console.log('    - Unlimited:', creditsSystem.hasUnlimitedAccess());
    } catch (e) {
        console.log('    ⚠️ Erreur:', e.message);
    }
}

// Test 5: Fonctions anti-spam disponibles
console.log('\n📋 Test 5: Fonctions anti-spam');
console.log('  bcMaybeShowCreditsPopup:', typeof bcMaybeShowCreditsPopup === 'function' ? '✅' : '❌');
console.log('  maybeShowCreditsPopup:', typeof maybeShowCreditsPopup === 'function' ? '✅' : '❌');

// Résumé
console.log('\n🎯 === RÉSUMÉ ===');
console.log('Pour tester manuellement:');
console.log('1. Cliquer 10 livres → popup doit apparaître 1 fois max');
console.log('2. Fermer popup → recliquer 10 livres → aucun popup');
console.log('3. Tester menu "..." du player → doit s\'ouvrir');
console.log('4. Scroll page → doit fonctionner');
console.log('\n✅ Si tout fonctionne = FIX VALIDÉ');

// Utilitaires
console.log('\n🛠️ === UTILITAIRES ===');
console.log('Reset session (pour re-tester):');
console.log('  → sessionStorage.clear(); location.reload()');
console.log('\nForcer popup (debug):');
console.log('  → bcMaybeShowCreditsPopup("test")');
console.log('\nVérifier si modal visible:');
console.log('  → document.getElementById("creditsOverlay")?.style.display');
console.log('  → document.getElementById("purchase-modal")?.style.display');
