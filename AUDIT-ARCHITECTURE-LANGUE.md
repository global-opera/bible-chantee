# BIBLE CHANTÉE - ARCHITECTURE LANGUE

## PRINCIPE FONDAMENTAL

**SEUL `index.html` a le sélecteur de langue (12 boutons drapeaux).**
Toutes les autres pages LISENT la langue depuis `localStorage` via `lang-shared.js`.

---

## FLUX DE DONNÉES

```
┌─────────────────────────────────────────────────────────────────┐
│                         INDEX.HTML                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  🇫🇷 🇬🇧 🇧🇷 🇪🇸 🇩🇪 🇮🇹 🇸🇦 🇷🇺 🇨🇳 🇮🇳 🇵🇭 🇰🇷  │  ← SEUL SÉLECTEUR
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│            localStorage.setItem('selectedLanguage', 'PT')        │
│                              │                                   │
│                              ▼                                   │
│                    window.location → ?lang=PT                    │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TOUTES AUTRES PAGES                           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    lang-shared.js                            ││
│  │  1. Lit ?lang=PT depuis URL                                  ││
│  │  2. OU lit localStorage.getItem('selectedLanguage')          ││
│  │  3. OU détecte navigator.language                            ││
│  │  4. Défaut: 'FR'                                             ││
│  │                                                              ││
│  │  → window.currentLanguage = 'PT'                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  lecteur.html utilise currentLanguage pour:                  ││
│  │  • BOOK_NAMES[currentLanguage] → noms des livres             ││
│  │  • audioUrls${currentLanguage} → URLs audio                  ││
│  │  • chapterLyrics${currentLanguage} → paroles                 ││
│  │  • TRANSLATIONS[currentLanguage] → interface                 ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## FICHIERS ET CONFORMITÉ

### Pages avec sélecteur de langue (AUTORISÉ)
| Fichier | Sélecteur | Statut |
|---------|-----------|--------|
| `index.html` | ✅ OUI (12 boutons) | ✅ CONFORME |

### Pages SANS sélecteur (OBLIGATOIRE)
| Fichier | lang-shared.js | .lang-bar | Statut |
|---------|----------------|-----------|--------|
| `lecteur.html` | ✅ Requis | ❌ Interdit | ? |
| `about.html` | ✅ Requis | ❌ Interdit | ? |
| `mentions-legales.html` | ✅ Requis | ❌ Interdit | ? |
| `crowdfunding.html` | ✅ Requis | ❌ Interdit | ? |
| `coming-soon.html` | ✅ Requis | ❌ Interdit | ? |
| `credits-depliant.html` | ✅ Requis | ❌ Interdit | ? |
| `youtube-coming-soon.html` | ✅ Requis | ❌ Interdit | ? |

---

## RÈGLES STRICTES

### ❌ INTERDIT sur pages secondaires
```html
<!-- INTERDIT - Barre de langue -->
<div class="lang-bar">
  <button class="lang-btn" data-lang="FR">🇫🇷 FR</button>
  ...
</div>

<!-- INTERDIT - CSS .lang-bar -->
<style>
  .lang-bar { ... }
  .lang-btn { ... }
</style>

<!-- INTERDIT - Fonction changeLanguage() -->
<script>
function changeLanguage(lang) { ... }
function setLanguage(lang) { ... }
</script>
```

### ✅ REQUIS sur pages secondaires
```html
<!-- REQUIS - En premier dans les scripts -->
<script src="lang-shared.js"></script>
<script src="translations.js"></script>
<script src="i18n.js"></script>
```

---

## LECTEUR.HTML - LOGIQUE PAROLES

### Problème actuel
Les paroles s'affichent en **français** même quand `lang=PT`.

### Code à vérifier (updateLyrics)
```javascript
function updateLyrics() {
    const chapterStr = String(currentChapter);
    let lyrics = null;
    
    // currentLanguage DOIT être défini AVANT cette fonction
    console.log('updateLyrics - langue:', currentLanguage);

    // PRIORITÉ PT
    if (currentLanguage === 'PT' &&
        typeof chapterLyricsPT !== 'undefined' &&
        chapterLyricsPT[currentBook] &&
        chapterLyricsPT[currentBook][chapterStr]) {
        
        lyrics = chapterLyricsPT[currentBook][chapterStr];
        console.log('✅ Paroles PT trouvées');
    } else {
        // Fallback FR
        lyrics = chapterLyrics[currentBook][chapterStr];
        console.log('⚠️ Fallback paroles FR');
    }
}
```

### Ordre d'initialisation CRITIQUE
```javascript
// 1. DÉFINIR currentLanguage AU DÉBUT du script principal
let currentLanguage = window.currentLanguage || 'FR';
if (!window.currentLanguage) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang) {
        currentLanguage = urlLang.toUpperCase();
    } else {
        currentLanguage = localStorage.getItem('selectedLanguage') || 'FR';
    }
}
console.log('Langue initialisée:', currentLanguage);

// 2. ENSUITE définir les fonctions qui utilisent currentLanguage
function updateLyrics() { ... }  // Utilise currentLanguage
function playChapter() { ... }   // Utilise currentLanguage
```

---

## FICHIERS DE DONNÉES PAR LANGUE

### Audio
```
audio-urls.js       → FR (legacy)
audio-urls-fr.js    → FR
audio-urls-pt.js    → PT (434 chapitres)
audio-urls-en.js    → EN
...
```

### Paroles
```
lyrics-data.js      → FR (legacy, variable: chapterLyrics)
lyrics-data-v2.js   → FR V2 (variable: chapterLyricsV2)
lyrics-data-pt.js   → PT (variable: chapterLyricsPT)
```

### Sélection dynamique
```javascript
// Audio
const langAudioVar = `audioUrls${currentLanguage}`;  // audioUrlsPT
const audioSource = window[langAudioVar];

// Paroles
const langLyricsVar = `chapterLyrics${currentLanguage}`;  // chapterLyricsPT
// Mais attention: PT utilise chapterLyricsPT, pas chapterLyrics + PT
```

---

## DIAGNOSTIC CONSOLE

Ouvrir F12 → Console et vérifier :

```javascript
// Taper ces commandes
console.log('window.currentLanguage:', window.currentLanguage);
console.log('localStorage:', localStorage.getItem('selectedLanguage'));
console.log('URL lang:', new URLSearchParams(window.location.search).get('lang'));

// Vérifier les données PT
console.log('chapterLyricsPT existe:', typeof chapterLyricsPT !== 'undefined');
console.log('chapterLyricsPT["19"]:', chapterLyricsPT?.["19"]);  // Psaumes
console.log('chapterLyricsPT["19"]["23"]:', chapterLyricsPT?.["19"]?.["23"]);  // Psaume 23
```

---

## SCRIPT D'AUDIT POWERSHELL

Voir fichier `audit-langue.ps1` ci-dessous.
