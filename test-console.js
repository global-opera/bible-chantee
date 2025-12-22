// ============================================
// TEST-CONSOLE.JS - Bible Chantée Debug Suite (v2)
// Coller dans DevTools Console (F12)
// ============================================

console.log("🧪 === BIBLE CHANTÉE - TESTS VALIDATION (v2) ===\n");

// Helpers
const fmtTime = (ms) => {
  if (ms <= 0) return "0s";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h ? `${h}h ${m}m ${r}s` : (m ? `${m}m ${r}s` : `${r}s`);
};
const isVisible = (el) => {
  if (!el) return false;
  const cs = getComputedStyle(el);
  return cs.display !== "none" && cs.visibility !== "hidden" && cs.opacity !== "0";
};
const displayInfo = (el) => {
  if (!el) return "(absent)";
  const cs = getComputedStyle(el);
  return `computed: display=${cs.display}, visibility=${cs.visibility}, opacity=${cs.opacity}`;
};
const getFn = (...names) => names.find(n => typeof window[n] === "function");

// ============================================
// TEST 1: sessionStorage (cooldowns)
// ============================================
console.log("TEST 1: sessionStorage");
console.log("----------------------");

const paywallShown = sessionStorage.getItem("bc_paywall_shown");
const paywallLastRaw = sessionStorage.getItem("bc_paywall_last");

console.log("bc_paywall_shown:", paywallShown ?? "(non défini)");
console.log("bc_paywall_last:", paywallLastRaw ?? "(non défini)");

if (paywallLastRaw && !Number.isNaN(Number(paywallLastRaw))) {
  const last = Number(paywallLastRaw);
  const now = Date.now();

  // Règle appliquée : 45s + 1 fois/session
  const cd45 = 45 * 1000;
  const rem45 = cd45 - (now - last);

  console.log("Cooldown 45s restant (règle appliquée):", rem45 > 0 ? fmtTime(rem45) : "expiré ✅");

  if (rem45 > 0) console.log("⏱️ Anti-spam actif (45s).");
  else console.log("✅ Anti-spam 45s expiré.");

  // Diagnostic optionnel (24h pour debug si modif code)
  const cd24h = 24 * 60 * 60 * 1000;
  const rem24 = cd24h - (now - last);
  console.log("Diagnostic 24h (si modifié):", rem24 > 0 ? fmtTime(rem24) : "expiré");
} else {
  console.log("Aucun timestamp cooldown actif.");
}
console.log("");

// ============================================
// TEST 2: Overlays / modals
// ============================================
console.log("TEST 2: État des overlays");
console.log("-------------------------");

const creditsOverlay = document.getElementById("creditsOverlay");
const purchaseModal = document.getElementById("purchase-modal");

console.log("creditsOverlay:", creditsOverlay ? "présent ✓" : "ABSENT ✗");
console.log("  - visible:", isVisible(creditsOverlay) ? "OUI ✗ (devrait être NON hors popup)" : "NON ✓");
console.log("  -", displayInfo(creditsOverlay));
console.log("  - aria-hidden:", creditsOverlay?.getAttribute("aria-hidden") ?? "(n/a)");

console.log("purchase-modal:", purchaseModal ? "présent ✓" : "ABSENT ✗");
console.log("  - visible:", isVisible(purchaseModal) ? "OUI ✗ (devrait être NON hors popup)" : "NON ✓");
console.log("  -", displayInfo(purchaseModal));
console.log("  - aria-hidden:", purchaseModal?.getAttribute("aria-hidden") ?? "(n/a)");
console.log("");

// ============================================
// TEST 3: Scroll / UI lock
// ============================================
console.log("TEST 3: Scroll et overflow");
console.log("--------------------------");

const bodyOverflow = document.body.style.overflow;
const hasPopupOpen = document.body.classList.contains("popup-open");

console.log("body.style.overflow:", bodyOverflow || "(vide/défaut) ✓");
console.log("body.classList contient 'popup-open':", hasPopupOpen ? "OUI ✗" : "NON ✓");

// Quick scroll check (non destructif)
const canScroll = document.documentElement.scrollHeight > window.innerHeight;
console.log("page scrollable:", canScroll ? "OUI" : "NON (page courte)");
console.log("");

// ============================================
// TEST 4: Systèmes crédits
// ============================================
console.log("TEST 4: Systèmes de crédits");
console.log("---------------------------");

if (typeof window.CREDITS !== "undefined") {
  console.log("CREDITS (credits.js): ✓ DÉTECTÉ");
  console.log("  - keys:", Object.keys(window.CREDITS).slice(0, 25).join(", "), Object.keys(window.CREDITS).length > 25 ? "..." : "");
  console.log("  - balance:", window.CREDITS.balance ?? "(n/a)");
} else {
  console.log("CREDITS (credits.js): ✗ NON TROUVÉ");
}

if (typeof window.creditsSystem !== "undefined") {
  console.log("creditsSystem (credits-system.js): ✓ DÉTECTÉ");
  console.log("  - keys:", Object.keys(window.creditsSystem).slice(0, 25).join(", "), Object.keys(window.creditsSystem).length > 25 ? "..." : "");
} else {
  console.log("creditsSystem (credits-system.js): ✗ NON TROUVÉ");
}
console.log("");

// ============================================
// TEST 5: Fonctions anti-spam (tolérant)
// ============================================
console.log("TEST 5: Fonctions anti-spam");
console.log("---------------------------");

const fnMaybe =
  getFn("bcMaybeShowCreditsPopup", "maybeShowCreditsPopup", "bcShouldShowPaywallOnce", "maybeOpenCreditsBecauseLimit");

console.log("Fonction anti-spam détectée:", fnMaybe ? `✓ ${fnMaybe}()` : "✗ Aucune fonction reconnue");
console.log("");

// ============================================
// RÉSUMÉ
// ============================================
console.log("🎯 === RÉSUMÉ ===");
console.log("1) Anti-spam: popup 1x puis plus rien après fermeture.");
console.log("2) UI: '...' et scroll OK après fermeture.");
console.log("3) Badge: clic sur 🎵 crédits ouvre le popup volontairement.");
console.log("");

// ============================================
// COMMANDES DEBUG (safe)
// ============================================
console.log("🧰 === COMMANDES DEBUG ===");
console.log("Reset session:   sessionStorage.clear(); location.reload()");
if (fnMaybe) {
  console.log(`Forcer test:     ${fnMaybe}('test')  (si ton implémentation accepte un param)`);
} else {
  console.log("Forcer test:     (non disponible - aucune fonction détectée)");
}
console.log("Overlay display: getComputedStyle(document.getElementById('creditsOverlay')).display");
console.log("Modal display:   getComputedStyle(document.getElementById('purchase-modal')).display");
console.log("\n✅ === FIN DES TESTS ===");
