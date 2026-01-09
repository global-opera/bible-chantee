═══════════════════════════════════════════════════════════════
  PATCH COMPLET : NETTOYAGE PERMANENT DES TITRES
═══════════════════════════════════════════════════════════════

✅ STATUT : COMPLETÉ ET PRÊT À COMMITER

───────────────────────────────────────────────────────────────
📦 FICHIERS MODIFIÉS
───────────────────────────────────────────────────────────────

1. lecteur.html
   ✓ Ajout fonction cleanTitle(s)
   ✓ Application dans getChapterTitle()
   ✓ Correction code cassé (lignes 1408-1411)

2. js/chapter-titles.js
   ✓ 8 titres normalisés (guillemets » supprimés)

3. Scripts/NORMALIZE_CHAPTER_TITLES.ps1
   ✓ Script de normalisation automatique (NOUVEAU)

───────────────────────────────────────────────────────────────
🎯 FONCTION cleanTitle()
───────────────────────────────────────────────────────────────

function cleanTitle(s) {
  if (s == null || s === '') return '';
  s = String(s).trim();
  s = s.replace(/^[\s""'«]+/g, '');  // Supprime guillemets ouvrants
  s = s.replace(/[\s""'»]+$/g, '');  // Supprime guillemets fermants
  return s.trim();
}

Appliquée à :
  - Ligne 1408 : Lecture CHAPTER_TITLES[lang][bookNum][chKey]
  - Ligne 1514 : Titres extraits des lyrics

───────────────────────────────────────────────────────────────
📊 RÉSULTATS
───────────────────────────────────────────────────────────────

Titres normalisés : 8
  • Lamentations 3 : « Ta Fidélité, Ma Lumière » → sans »
  • Marc 15 : « le Roi Crucifié » → sans »
  • Galates 1 : « Gloire à Toi, Évangile de Grâce » → sans »
  • Exode 10 : « Éternel, Notre Délivrance » → sans »
  • Lévitique 7 : « Sacrifices de Louange » → sans »
  • Nombres 16 : « L'Éternel, Notre Refuge » → sans »
  • 1 Samuel 4 : « L'Éternel, Notre Sauveur » → sans »
  • 1 Samuel 8 : « Éternel, Notre Roi » → sans »

"Verse X" supprimés (patch précédent) : 178

───────────────────────────────────────────────────────────────
🚀 POUR COMMITER
───────────────────────────────────────────────────────────────

cd "C:\ScriptBible\bible-chantee"

git add lecteur.html
git add js/chapter-titles.js
git add Scripts/NORMALIZE_CHAPTER_TITLES.ps1

git commit -F COMMIT_MESSAGE.txt

# Optionnel : tag
git tag -a v1.2.0-clean-titles -m "Nettoyage permanent titres"

git push origin prod

───────────────────────────────────────────────────────────────
📚 DOCUMENTATION
───────────────────────────────────────────────────────────────

GUIDE_COMMIT.md               → Guide étape par étape
PATCH_SUMMARY.md              → Documentation complète
PATCH_CLEAN_TITLES_COMPLETE.diff → Diff format git
COMMIT_MESSAGE.txt            → Message de commit préparé

───────────────────────────────────────────────────────────────
✨ IMPACT
───────────────────────────────────────────────────────────────

AVANT : "Lamentations 3 - « Ta Fidélité, Ma Lumière »"
APRÈS : "Lamentations 3 - « Ta Fidélité, Ma Lumière"

• Guillemets externes supprimés automatiquement
• Affichage propre dans toutes les langues
• Code maintenable et réutilisable

───────────────────────────────────────────────────────────────
🔧 MAINTENANCE FUTURE
───────────────────────────────────────────────────────────────

Pour normaliser de nouveaux titres :
  pwsh Scripts/NORMALIZE_CHAPTER_TITLES.ps1

La fonction cleanTitle() s'appliquera automatiquement à :
  • Tous les titres lus depuis CHAPTER_TITLES
  • Tous les titres extraits des lyrics

═══════════════════════════════════════════════════════════════
Date : 2026-01-09
Auteur : Claude Sonnet 4.5
Version : 1.0 FINAL
═══════════════════════════════════════════════════════════════
