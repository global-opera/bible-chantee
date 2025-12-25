# SYSTÈME D'AUDIT - BibleChantee

## 📋 Vue d'ensemble

Ce système garantit l'intégrité architecturale du projet BibleChantee avant chaque déploiement.

**Principe fondamental:** Architecture monolingue avec sélection unique sur la page d'accueil, propagée globalement via `activeLang`.

---

## 🎯 Règle d'or

```
EXIT CODE = 0  →  ✅ Déploiement autorisé
EXIT CODE = 2  →  ❌ STOP - Corriger avant déploiement
```

**AUCUN DÉPLOIEMENT SANS EXIT CODE = 0**

---

## 🔧 Scripts d'audit disponibles

### 1. `audit_global.py` - Audit complet (PRODUCTION-GRADE)

**Le seul audit à utiliser systématiquement.**

```powershell
python audit_global.py --root . --base-url "https://biblechantee.com" --require-lang-in-assets --prod-head-only
```

**Vérifie:**
- ✅ Architecture langue (aucune langue hardcodée)
- ✅ Traçabilité (liens valides repo + PROD)
- ✅ Conflits nommage (collisions, casse, espaces)
- ✅ Assets (langue explicite dans MP3/lyrics/JSON)
- ✅ PROD (crawl 40+ pages, validation redirects)

**Distinction intelligente:**
- Fichiers web (racine, pages, assets) → CRITICAL si problème
- Dev/archives/reports (Scripts/, _archive/, *_REPORT.txt) → WARNING seulement

---

### 2. `audit_site.py` - Audit architecture langue (léger)

Vérifie uniquement les hardcoded language patterns.

```powershell
python audit_site.py --root . --base-url "https://biblechantee.com"
```

**Usage:** Vérification rapide post-modification JS/HTML.

---

### 3. `audit_filenames.py` - Audit noms de fichiers (contrat technique)

Vérifie respect du contrat technique de nommage.

```powershell
python audit_filenames.py
```

**Usage:** Avant ajout de nouveaux fichiers/assets.

---

## 📐 Architecture garantie

### Principe langue unique

1. **Page d'accueil (index.html):**
   - SEUL endroit avec sélecteur de langue (header)
   - Stocke choix dans `localStorage.lang`

2. **Toutes les autres pages:**
   - Lisent `localStorage.lang` (ou `?lang=XX` en fallback)
   - AUCUN sélecteur de langue visible
   - Tous liens utilisent `data-lang-link` pour injection automatique

3. **Ressources (MP3/lyrics/JSON):**
   - Objets séparés par langue (audioUrlsFR, audioUrlsPT, audioUrlsEN)
   - Sélection runtime basée sur `activeLang`
   - Chemins explicites avec langue (/fr/audio/..., file_fr.mp3)

### Fichiers clés

- **`lang-shared.js`** - Helpers globaux (getLang(), setLang(), applyLangToLinks())
- **`index.html`** - Seule page avec traduction UI et sélecteur langue
- **`translations.js`** - Traductions UI (navPromises, btnBible, etc.)
- **`netlify.toml`** - Redirects 301 (clean URLs → .html)

---

## 🚀 Workflow de développement

### Avant chaque commit important

```powershell
cd "G:\Mon Drive\BibleChantee_GIT"

# 1. Audit complet
python audit_global.py --root . --base-url "https://biblechantee.com" --require-lang-in-assets --prod-head-only

# 2. Vérifier exit code
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ AUDIT OK - Safe to commit"
    git add -A
    git commit -m "Your commit message"
    git push
} else {
    Write-Host "❌ CRITICAL FOUND - Fix before commit"
    # Lire GLOBAL_AUDIT_REPORT.txt pour détails
    exit 1
}
```

### Après modifications HTML/JS

```powershell
# Vérification rapide architecture langue
python audit_site.py --root . --base-url "https://biblechantee.com"
```

### Avant ajout nouveaux fichiers

```powershell
# Vérifier conformité nommage
python audit_filenames.py
```

---

## 🔍 Interprétation des résultats

### EXIT CODE = 0 ✅

**Signification:** Aucune violation CRITICAL détectée.

- Architecture langue respectée
- Tous les liens valides
- Aucune collision nommage
- PROD accessible et fonctionnel

**Action:** Déploiement autorisé.

---

### EXIT CODE = 2 ❌

**Signification:** Violations CRITICAL détectées.

**Lire le rapport:**
```powershell
cat GLOBAL_AUDIT_REPORT.txt | Select-String "CRITICAL" -Context 0,2
```

**Types de CRITICAL courants:**

1. **HARDCODE_LANG_IN_LINK** - Langue hardcodée dans lien
   ```
   Exemple: <a href="promesses.html?lang=FR">
   Fix: Utiliser data-lang-link ou ${lang} dynamique
   ```

2. **LOCAL_TARGET_MISSING** - Lien vers fichier inexistant
   ```
   Exemple: <a href="page-manquante.html">
   Fix: Créer le fichier ou corriger le lien
   ```

3. **CASE_COLLISION** - Collision case-insensitive
   ```
   Exemple: Index.html et index.html
   Fix: git mv pour unifier la casse (lowercase)
   ```

4. **UPPERCASE_IN_NAME** - Majuscules dans fichier web
   ```
   Exemple: audio-v2/01_GEN_01.mp3
   Fix: git mv vers lowercase (01_gen_01_fr.mp3)
   ```

5. **PROD_HTTP_ERROR** - Page PROD retourne 404/500
   ```
   Fix: Vérifier déploiement Netlify, redirects
   ```

**Action:** Corriger toutes les violations, puis re-lancer audit.

---

### WARNINGS ⚠️

**Signification:** Éléments non-conformes mais non-critiques.

- Fichiers dev/docs avec majuscules (acceptable)
- Tokens "legacy" dans noms légitimes
- Variantes singulier/pluriel

**Action:** Aucune action requise (sauf si vous voulez nettoyer).

---

## 📊 Rapports générés

Chaque audit génère:
- **`GLOBAL_AUDIT_REPORT.txt`** - Rapport complet (config, findings, PROD pages)
- **`PURE_ARCH_REPORT.txt`** - Rapport architecture langue (audit_site.py)
- **`FILENAME_AUDIT_REPORT.txt`** - Rapport nommage (audit_filenames.py)

**Conservation:** Ces rapports sont ignorés par Git (temporaires, auto-générés).

---

## 🛡️ Garanties architecture

Avec `audit_global.py` exit code 0, vous avez la garantie:

1. ✅ **Langue unique** - Aucun hardcoded lang, tout passe par activeLang
2. ✅ **Liens valides** - Tous pointent vers fichiers existants (repo + PROD)
3. ✅ **Nommage cohérent** - Lowercase, pas de collisions, pas d'espaces
4. ✅ **PROD fonctionnel** - 40+ pages crawlées, 100% accessibles
5. ✅ **Redirects OK** - /promesses → /promesses.html (301)
6. ✅ **Assets trackés** - MP3/lyrics avec langue explicite

---

## 🔧 Configuration avancée

### Exclure dossiers supplémentaires

```powershell
python audit_global.py --exclude-dirs '["Scripts","docs","_archive","html old"]'
```

### Désactiver check langue dans assets

```powershell
# Ne pas vérifier langue explicite dans assets (mode permissif)
python audit_global.py --root . --base-url "https://biblechantee.com" --prod-head-only
```

### Crawler plus de pages

```powershell
python audit_global.py --max-pages 150 --delay-ms 100
```

---

## 📝 Historique des corrections

### 2025-12-15 - Verrouillage architecture

**Corrections appliquées:**
- ✅ Suppression dossiers backup (collisions)
- ✅ Renommage Scripts/index.html → index-exemple.html
- ✅ Suppression espace dans update_audio_urls (1).ps1
- ✅ Déplacement audio-v2/01_GEN_01.mp3 → audio-v2/fr/01_gen_01.mp3

**Résultat:** EXIT CODE = 0 (ZERO CRITICAL)

---

## 🎓 Ressources

- **Contrat technique nommage:** `audit_filenames.py` (règles a-z0-9-_.)
- **Architecture langue:** `lang-shared.js`, `index.html`
- **Redirects Netlify:** `netlify.toml`

---

**Dernière mise à jour:** 2025-12-15
**Auteur:** Claude Code (Sonnet 4.5)

