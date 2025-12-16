# Bible Chantée - Architecture Langue SIMPLE

## Principe Fondamental

**SEULE index.html a les boutons de langue.**
Toutes les autres pages lisent `localStorage` via `lang-shared.js`.

```
┌─────────────────────────────────────────────────────────────────┐
│  INDEX.HTML (seule page avec boutons langue)                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  [🇫🇷 FR] [🇬🇧 EN] [🇧🇷 PT] [🇪🇸 ES] ...               │    │
│  │  Clic sur PT →                                          │    │
│  │  localStorage.setItem('selectedLanguage', 'PT')         │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LECTEUR.HTML (et toutes autres pages)                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  <script src="lang-shared.js"></script>                 │    │
│  │  Au chargement:                                         │    │
│  │  → window.currentLanguage = localStorage.get(...)       │    │
│  │  → Si 'PT' → audioUrlsPT + chapterLyricsPT             │    │
│  │  → Traductions appliquées automatiquement               │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Clé localStorage

**UNIQUE pour tout le site:**
```javascript
localStorage.setItem('selectedLanguage', 'PT');  // ✅ CORRECT
localStorage.setItem('selectedLang', 'PT');      // ❌ ANCIEN (ne pas utiliser)
```

## Fichiers Corrigés

### ✅ Nouveaux fichiers (dans /outputs/)

| Fichier | Description |
|---------|-------------|
| `lang-shared.js` | Gestion centralisée langue - À CHARGER par toutes les pages secondaires |
| `lecteur.html` | Lecteur audio - SANS barre de langue (~100 lignes CSS supprimées) |

### 📋 Fichiers à vérifier

Les fichiers suivants doivent:
1. **NE PAS** avoir de `.lang-bar` (sauf index.html)
2. **CHARGER** `lang-shared.js` avant les autres scripts
3. **UTILISER** `window.currentLanguage` pour la langue courante

| Page | Boutons langue? | lang-shared.js? |
|------|-----------------|-----------------|
| index.html | ✅ OUI (seule page) | Non (définit la langue) |
| lecteur.html | ❌ NON | ✅ OUI |
| about.html | ❌ NON | ✅ OUI |
| mentions-legales.html | ❌ NON | ✅ OUI |
| crowdfunding.html | ❌ NON | ✅ OUI |
| coming-soon.html | ❌ NON | ✅ OUI |
| credits-depliant.html | ❌ NON | ✅ OUI |

## Sélection Audio/Lyrics par Langue

Dans `lecteur.html`, la logique est:

```javascript
// Audio
const langAudioVar = `audioUrls${currentLanguage}`;  // ex: audioUrlsPT
if (window[langAudioVar]) {
    audioSource = window[langAudioVar];
}

// Lyrics
if (currentLanguage === 'PT' && chapterLyricsPT[book][chapter]) {
    lyrics = chapterLyricsPT[book][chapter];
} else {
    lyrics = chapterLyrics[book][chapter];  // FR par défaut
}
```

## Fichiers de Données par Langue

| Langue | Audio | Lyrics |
|--------|-------|--------|
| FR | `audio-urls.js`, `audio-urls-fr.js` | `lyrics-data.js`, `lyrics-data-v2.js` |
| PT | `audio-urls-pt.js` | `lyrics-data-pt.js` |
| EN | `audio-urls-en.js` | (à venir) |
| ES | `audio-urls-es.js` | (à venir) |
| ... | ... | ... |

## Déploiement

1. Copier `lang-shared.js` et `lecteur.html` vers `C:\ScriptBible\bible-chantee\`
2. Vérifier les autres pages (about, mentions-legales, etc.)
3. Tester: index.html → clic PT → naviguer → vérifier que tout est en PT
4. `git add . && git commit -m "Architecture langue simplifiée" && git push`

## Test Manuel

1. Ouvrir `index.html`
2. Cliquer sur 🇧🇷 PT
3. Naviguer vers `lecteur.html`
4. Vérifier:
   - Noms des livres en portugais (Gênesis, Êxodo...)
   - Audio PT (si disponible)
   - Paroles PT
5. Rafraîchir la page → doit rester en PT
6. Fermer/rouvrir navigateur → doit rester en PT
