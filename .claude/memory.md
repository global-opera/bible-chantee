# MÉMOIRE CLAUDE - BibleChantee

## 🎯 Principe architectural fondamental

**ARCHITECTURE MONOLINGUE STRICTE**

La langue est choisie **UNE SEULE FOIS** sur la page d'accueil (index.html), puis propagée globalement via `localStorage.lang` (aka `activeLang`).

### Règles absolues

1. **Index.html UNIQUEMENT:**
   - Seule page avec sélecteur de langue (3 boutons header)
   - Seule page avec traductions UI complètes
   - Stocke choix: `localStorage.setItem("lang", selectedLang)`

2. **Toutes les autres pages:**
   - LISENT `localStorage.lang` (ne modifient JAMAIS)
   - AUCUN sélecteur de langue visible
   - Utilisent `data-lang-link` pour auto-injection ?lang=XX

3. **Ressources (MP3/lyrics):**
   - Objets séparés: `audioUrlsFR`, `audioUrlsPT`, `audioUrlsEN`
   - Sélection runtime: `window["audioUrls" + activeLang.toUpperCase()]`
   - Chemins explicites avec langue obligatoire

---

## 🔒 Système d'audit

### Règle d'or

```
EXIT CODE = 0  →  Déploiement OK
EXIT CODE = 2  →  STOP - Corriger avant
```

**AUCUN DÉPLOIEMENT SANS audit_global.py EXIT CODE = 0**

### Commande de référence

```powershell
python audit_global.py --root . --base-url "https://biblechantee.com" --require-lang-in-assets --prod-head-only
```

### Ce qui est vérifié

- ✅ Aucune langue hardcodée (pas de `?lang=FR` literal)
- ✅ Tous liens valides (repo + PROD)
- ✅ Pas de collisions nommage (casse, espaces)
- ✅ Assets avec langue explicite (/fr/, _fr.mp3)
- ✅ PROD 100% accessible (40+ pages)

---

## 📂 Fichiers clés

### Architecture langue

- **`lang-shared.js`** - Helpers: getLang(), setLang(), applyLangToLinks()
- **`index.html`** - Sélecteur langue + data-lang-link sur tous les boutons
- **`translations.js`** - Traductions UI (navPromises, btnBible, etc.)

### Redirects & routing

- **`netlify.toml`** - Redirects 301 clean URLs (/promessas → /promessas.html)
- Force tous les /route vers /route.html

### Assets multilingues

- **`audio-urls-fr.js`** - window.audioUrlsFR (archive.org CDN)
- **`audio-urls-pt.js`** - window.audioUrlsPT
- **`audio-urls-en.js`** - window.audioUrlsEN
- **`lyrics-data-pt.js`** - window.chapterLyricsPT
- **`promessas-data.js`** - Données thématiques PT

---

## 🚫 Anti-patterns à éviter

### ❌ INTERDIT

```javascript
// Langue hardcodée
href="promesses.html?lang=FR"

// Sélecteur langue sur page secondaire
<select id="langSelector">...</select>

// Ressource sans langue
const mp3 = "audio/01_gen_01.mp3"
```

### ✅ CORRECT

```javascript
// Langue dynamique
href="promesses.html" data-lang-link

// Pas de sélecteur (lecture seule)
const lang = getLang(); // depuis lang-shared.js

// Ressource avec langue
const mp3 = audioUrlsFR["1"]["1"] // ou audioUrlsPT, audioUrlsEN
```

---

## 🛠️ Corrections type par violation

### HARDCODE_LANG_IN_LINK

**Symptôme:** `<a href="page.html?lang=FR">`

**Fix:**
```html
<!-- Avant -->
<a href="promesses.html?lang=FR">Promesses</a>

<!-- Après -->
<a href="promesses.html" data-lang-link>Promesses</a>
```

Puis appeler `applyLangToLinks()` au chargement.

---

### CASE_COLLISION

**Symptôme:** `Index.html` et `index.html` détectés

**Fix:**
```powershell
git mv Index.html index.html  # Unifier en lowercase
```

---

### LOCAL_TARGET_MISSING

**Symptôme:** Lien vers fichier inexistant

**Fix:**
1. Créer le fichier manquant, ou
2. Corriger/supprimer le lien

---

### UPPERCASE_IN_NAME (fichier web)

**Symptôme:** `audio-v2/01_GEN_01.mp3`

**Fix:**
```powershell
# Option 1: Renommer avec langue
git mv "audio-v2/01_GEN_01.mp3" "audio-v2/01_gen_01_fr.mp3"

# Option 2: Organiser par dossier
mkdir "audio-v2/fr"
git mv "audio-v2/01_GEN_01.mp3" "audio-v2/fr/01_gen_01.mp3"
```

---

## 📊 État actuel (2025-12-15)

### Commits récents

```
744f547 Move audio-v2 MP3 to language-specific folder with lowercase naming
a84bcbe Fix critical naming collisions: remove backups, rename Scripts/index.html
31bcaae Implement global lang system: data-lang-link auto-applies chosen language
```

### Audit status

**EXIT CODE = 0** ✅

- Files indexed: 122
- PROD pages: 40 (100% OK)
- CRITICAL: 0
- WARNING: 22 (tous acceptables)

**Dernière vérification:** 2025-12-15 23:17

---

## 🔄 Workflow standard

### Avant modification HTML/JS

```powershell
# Audit rapide langue
python audit_site.py --root . --base-url "https://biblechantee.com"
```

### Avant commit

```powershell
# Audit complet
python audit_global.py --root . --base-url "https://biblechantee.com" --require-lang-in-assets --prod-head-only

# Si OK (exit 0)
git add -A
git commit -m "description"
git push
```

### Après déploiement Netlify

```powershell
# Re-vérifier PROD
python audit_global.py --base-url "https://biblechantee.com" --prod-head-only
```

---

## 📝 Conventions code

### localStorage

- **Key:** `"lang"` (unifié, pas `selectedLanguage`)
- **Values:** `"FR"`, `"PT"`, `"EN"` (UPPERCASE)
- **Access:** Via `getLang()` / `setLang(lang)` de lang-shared.js

### Attributs HTML

- **`data-lang-link`** - Marque un lien pour auto-injection ?lang=XX
- **`data-i18n="key"`** - Marque élément pour traduction UI

### Naming assets

- **MP3:** `01_gen_01_fr.mp3` ou `/fr/01_gen_01.mp3`
- **Lyrics:** `/Lyrics/FR_V2/...` ou `lyrics_fr.txt`
- **JSON:** `promessas-data.js` (avec `PROMESSAS[lang]` à l'intérieur)

---

## 🎯 Objectifs architecturaux atteints

✅ **Langue unique** - Choix sur index.html, propagation globale
✅ **Traçabilité** - Tous liens validés (repo + PROD)
✅ **Nommage cohérent** - Lowercase, langue explicite, zéro collision
✅ **PROD stable** - 40+ pages, 100% accessible, redirects OK
✅ **Audit automatisé** - Quality gate avant chaque déploiement

---

**Dernière mise à jour:** 2025-12-15
**Audit system:** audit_global.py v2.0 (production-grade)
**Architecture:** PURE MONOLINGUE (activeLang unique source of truth)
