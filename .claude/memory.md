# MÉMOIRE CLAUDE - Bible Chantée

**Dernière mise à jour:** 2024-12-22
**Architecture:** data-i18n avec bc_lang (localStorage)

---

## 🌍 Système i18n OFFICIEL (2024-12-22)

### Règle fondamentale

**TOUJOURS utiliser le système `data-i18n` + `bc_lang`**

```html
<!-- ✅ CORRECT -->
<h1 data-i18n="page-title">Bible Chantée</h1>
<script>
  const lang = (localStorage.getItem('bc_lang') || 'FR').toUpperCase();
</script>

<!-- ❌ INTERDIT -->
<h1 id="pageTitle">Bible Chantée</h1>  <!-- IDs pour i18n -->
<script>
  const lang = localStorage.getItem('lang');  <!-- Ancienne clé -->
</script>
```

### Documentation complète

**Voir:** `.github/I18N.md` pour le guide complet

---

## 📊 État des langues (2024-12-22)

### Complètes (4 langues - 100%)

| Code | Langue | Chapitres | Audio | Lyrics | Bible |
|------|--------|-----------|-------|--------|-------|
| **FR** | Français | 1189/1189 | ✅ | ✅ | ✅ |
| **EN** | English | 1189/1189 | ✅ | ✅ | ✅ |
| **PT** | Português | 1189/1189 | ✅ | ✅ | ✅ |
| **ES** | Español | 1189/1189 | ✅ | ✅ | ✅ |

**Progress tracker:** `progress.json` (mis à jour 2024-12-22)

### En préparation (8 langues)

DE, IT, RU, AR, ZH, HI, TL, SW

---

## 🔒 Standards obligatoires

### 1. Attributs HTML

```html
<!-- TOUJOURS data-i18n -->
<h1 data-i18n="page-title">Bible Chantée</h1>
<a data-i18n="nav-project">Le Projet</a>
<p data-i18n="goal-desc">Pour finaliser...</p>
```

### 2. Clés de traduction

```javascript
// TOUJOURS kebab-case
const translations = {
  fr: {
    'page-title': 'Bible Chantée',
    'nav-project': 'Le Projet',
    'goal-desc': 'Pour finaliser les 12 langues'
  }
}
```

### 3. localStorage

```javascript
// TOUJOURS bc_lang (pas "lang", "userLang", etc.)
const lang = (localStorage.getItem('bc_lang') || 'FR').toUpperCase();
localStorage.setItem('bc_lang', selectedLang);
```

---

## 📂 Architecture des fichiers

### Pages web

```
bible-chantee/
├── demo.html              ✅ data-i18n complet (référence)
├── crowdfunding.html      ✅ data-i18n complet (référence)
├── lecteur.html           ✅ Player principal
├── index.html             🔄 À vérifier
├── dashboard.html         ✅ Admin stats
└── progress.json          ✅ État langues (4/12)
```

### Données par langue

```
├── bible-data-fr.js       ✅ Texte biblique FR
├── bible-data-en.js       ✅ Texte biblique EN
├── bible-data-pt.js       ✅ Texte biblique PT
├── bible-data-es.js       ✅ Texte biblique ES
├── lyrics-data.js         ✅ Paroles FR
├── lyrics-data-en.js      ✅ Paroles EN
├── lyrics-data-pt.js      ✅ Paroles PT
├── lyrics-data-es.js      ✅ Paroles ES
├── audio-urls-fr.js       ✅ URLs R2 FR
├── audio-urls-en.js       ✅ URLs R2 EN
├── audio-urls-pt.js       ✅ URLs R2 PT
└── audio-urls-es.js       ✅ URLs R2 ES
```

### Documentation

```
├── .github/
│   └── I18N.md            📚 Guide i18n officiel
├── .claude/
│   └── memory.md          📝 Ce fichier
└── CLAUDE.md              📋 Instructions projet
```

---

## 🎯 Template JavaScript standard

```javascript
<script>
(function() {
  // 1. Langue depuis bc_lang
  const stored = (localStorage.getItem('bc_lang') || 'FR').toUpperCase();
  const VALID_LANGS = ['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'RU', 'AR', 'ZH', 'HI', 'TL', 'SW'];
  const currentLang = VALID_LANGS.includes(stored) ? stored : 'FR';

  // 2. Translations complètes
  const translations = {
    fr: { 'page-title': 'Bible Chantée', /* ... */ },
    en: { 'page-title': 'Sung Bible', /* ... */ },
    pt: { 'page-title': 'Bíblia Cantada', /* ... */ },
    es: { 'page-title': 'Biblia Cantada', /* ... */ }
  };

  // 3. Traduction automatique
  function translatePage(lang) {
    const t = translations[lang.toLowerCase()] || translations.fr;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.innerHTML = t[key];
    });
    document.documentElement.lang = lang.toLowerCase();
  }

  // 4. Init
  document.addEventListener('DOMContentLoaded', () => {
    translatePage(currentLang);
  });

  // 5. Sync cross-tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'bc_lang') location.reload();
  });
})();
</script>
```

---

## 🚫 Anti-patterns

### ❌ INTERDIT

```javascript
// IDs pour i18n
<h1 id="pageTitle">...</h1>

// camelCase dans clés
pageTitle: "Bible Chantée"

// Ancienne clé localStorage
localStorage.getItem('lang')
localStorage.getItem('sungbible_lang')

// Texte en dur sans data-i18n
<h1>Bible Chantée</h1>

// Mélange de systèmes
<h1 id="title">...</h1>
<p data-i18n="subtitle">...</p>
```

### ✅ CORRECT

```javascript
// data-i18n partout
<h1 data-i18n="page-title">...</h1>

// kebab-case dans clés
'page-title': "Bible Chantée"

// bc_lang uniquement
localStorage.getItem('bc_lang')

// Fallback FR visible
<h1 data-i18n="page-title">Bible Chantée</h1>

// Cohérence totale
<h1 data-i18n="page-title">...</h1>
<p data-i18n="page-subtitle">...</p>
```

---

## 📝 Checklist ajout langue

### Backend (données)

- [ ] Générer `bible-data-XX.js` (1189 chapitres)
- [ ] Générer `lyrics-data-XX.js` (~1185 chapitres)
- [ ] Générer `audio-urls-XX.js` (URLs R2)
- [ ] Uploader MP3 sur R2: `/XX/`
- [ ] Mettre à jour `progress.json`

### Frontend (UI)

- [ ] Ajouter clé `XX` dans `translations` de:
  - `demo.html`
  - `crowdfunding.html`
  - `lecteur.html`
  - `index.html`
  - `about.html` (si existe)
  - `contact.html` (si existe)

### Validation

- [ ] Test: `localStorage.setItem('bc_lang','XX'); location.reload()`
- [ ] Vérifier tous textes traduits (pas de mélange)
- [ ] Vérifier navigation cross-page (langue persiste)
- [ ] Vérifier lecteur audio (MP3 XX chargés)
- [ ] Vérifier paroles (lyrics XX affichés)

### Déploiement

- [ ] Commit: `git add . && git commit -m "Add XX language support (1189/1189)"`
- [ ] Push: `git push`
- [ ] Netlify auto-deploy (~2 min)
- [ ] Test PROD: biblechantee.com + sungbible.world
- [ ] Mettre à jour dashboard progress.json → "Complet"

---

## 🛠️ Debugging

### Console tests

```javascript
// Voir langue actuelle
localStorage.getItem('bc_lang')

// Changer langue
localStorage.setItem('bc_lang', 'ES');
location.reload();

// Tester toutes langues
['FR','EN','PT','ES'].forEach(lang => {
  localStorage.setItem('bc_lang', lang);
  console.log(`Testing ${lang}...`);
  setTimeout(() => location.reload(), 100);
});

// Vérifier traductions chargées
document.querySelectorAll('[data-i18n]').forEach(el => {
  console.log(el.getAttribute('data-i18n'), '→', el.textContent);
});
```

### Problèmes courants

**Langue ne change pas:**
→ Vérifier que `renderTracks()` est appelé dans `setLang()`

**Mélange FR/PT/ES:**
→ Éléments sans `data-i18n`, ajouter partout

**Cache service worker:**
→ Bumper `CACHE_NAME` v5 → v6 dans `service-worker.js`

**Audio ne charge pas:**
→ Vérifier `audio-urls-XX.js` avec bon pattern R2

---

## 🌐 URLs et déploiement

### Domaines

- **Production principale:** https://biblechantee.com
- **Production mirror:** https://sungbible.world
- **Repo GitHub:** github.com/global-opera/bible-chantee

### Netlify config

```toml
# netlify.toml
[[redirects]]
  from = "/"
  to = "/demo.html"
  conditions = {Host = ["sungbible.world"]}

[[redirects]]
  from = "/"
  to = "/lecteur.html"
  conditions = {Host = ["biblechantee.com"]}
```

### CDN Audio (Cloudflare R2)

Base URL: `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/`

Structure:
```
/FR/01_GEN/01_GEN_01_FR.mp3
/EN/01_GEN/01_GEN_01_EN.mp3
/PT/01_GEN/01_GEN_01_PT.mp3
/ES/01_GEN/01_GEN_01_ES.mp3
```

---

## 📊 Service Worker

### Cache version

**Actuel:** `CACHE_NAME = 'bible-chantee-v5'`

**Quand bumper:**
- Changement HTML/CSS majeur
- Ajout nouvelle langue
- Mise à jour manifest.json
- Fix critique JS

**Comment:**
```javascript
// service-worker.js
const CACHE_NAME = 'bible-chantee-v6';  // v5 → v6
```

Puis commit → push → Netlify redéploie → tous les clients forcent refresh

---

## 🔐 Fichiers sensibles

### NE JAMAIS commiter

```
signing.keystore               # Certificat Android
signing-key-info.txt           # Mots de passe
.env                           # Variables secrètes
service-account-key.json       # Clés API
```

### Sécurisés localement

```
Desktop/LOGO Bible chantee/
└── Bible Chantée - Google Play package/
    ├── Bible Chantée.aab      # App Bundle
    ├── signing.keystore        # ⚠️ SÉCURISÉ
    └── signing-key-info.txt    # ⚠️ SÉCURISÉ
```

---

## 📱 PWA & Android

### Manifest.json

```json
{
  "id": "biblechantee",
  "name": "Bible Chantée - Sung Bible",
  "short_name": "Bible Chantée",
  "start_url": "/lecteur.html",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192" },
    { "src": "/icons/icon-512.png", "sizes": "512x512" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "purpose": "maskable" }
  ]
}
```

### Digital Asset Links

Fichier: `.well-known/assetlinks.json`
Package: `com.biblechantee.twa`
SHA256: `7E:A5:E7:44:55:4E:8D:D7:47:3E:42:FA:CD:FA:73:64:AF:F6:01:64:0E:E4:0F:45:DA:EC:51:47:3D:51:27:1B`

---

## 🎯 Objectifs architecturaux

### Atteints ✅

- ✅ **4 langues complètes** (FR, EN, PT, ES - 1189 chapitres chacune)
- ✅ **Système i18n scalable** (data-i18n + bc_lang)
- ✅ **PWA installable** (manifest + service worker)
- ✅ **TWA Android** (assetlinks configuré)
- ✅ **CDN R2 optimisé** (audio streaming)
- ✅ **Dashboard analytics** (progress tracking)
- ✅ **Multi-domaines** (biblechantee.com + sungbible.world)

### En cours 🔄

- 🔄 **8 langues supplémentaires** (DE, IT, RU, AR, ZH, HI, TL, SW)
- 🔄 **Google Play publication** (TWA en attente review)
- 🔄 **Freemium system** (Stripe intégration)
- 🔄 **Analytics avancé** (GA4 + custom events)

---

## 📚 Références importantes

### Documentation

- **Guide i18n:** `.github/I18N.md`
- **Instructions projet:** `CLAUDE.md`
- **Mémoire Claude:** `.claude/memory.md` (ce fichier)

### Pages référence

- **Demo complet:** `demo.html` (meilleur exemple i18n)
- **Crowdfunding:** `crowdfunding.html` (traductions complètes)
- **Player:** `lecteur.html` (logique audio + lyrics)
- **Dashboard:** `dashboard.html` (stats + progress)

### Commits clés

```
bf4751e - Update dashboard ES progress to 1189/1189 (100% complete)
a256198 - Fix complete multi-language support for crowdfunding.html
ac72690 - Update crowdfunding stats (4756 chapters, 4 languages) + ES translations
beb7fc7 - Ensure ES language fully integrated in lecteur.html
c40fad3 - Generate ES datasets: bible-data-es.js, lyrics-data-es.js, audio-urls-es.js
```

---

## 🔄 Workflow standard

### Avant modification

```bash
# Vérifier état actuel
git status
git log -3 --oneline
```

### Développement

```bash
# Lire documentation pertinente
cat .github/I18N.md

# Faire les changements selon standards
# (data-i18n, kebab-case, bc_lang)

# Tester localement
# Ouvrir demo.html ou crowdfunding.html
# Console: localStorage.setItem('bc_lang','ES'); location.reload()
```

### Avant commit

```bash
# Vérifier changements
git diff

# Stage fichiers
git add [files]

# Commit descriptif
git commit -m "i18n: Add XX translation for page-title"
```

### Déploiement

```bash
# Push
git push

# Netlify auto-deploy (~2 min)
# Vérifier: biblechantee.com + sungbible.world
```

---

**Mainteneur:** Stéphane Cassani
**Projet:** Bible Chantée - 1189 chapitres en 4 langues (12 prévues)
**Stack:** HTML/CSS/JS + R2 CDN + Netlify + PWA + TWA Android
