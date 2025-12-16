# PROMPT BIBLE CHANTÉE - CORRECTION ARCHITECTURE LANGUE

## CONTEXTE DU PROJET

Bible Chantée est un site web avec 66 livres bibliques, 1189 chapitres, en 12 langues.
- Repo: `C:\ScriptBible\bible-chantee`
- Live: https://biblechantee.com
- GitHub: https://github.com/global-opera/bible-chantee

## PROBLÈME ACTUEL

Quand l'utilisateur sélectionne **Portugais (PT)** sur `index.html` puis navigue vers `lecteur.html`:
- ✅ L'interface est en portugais (Salmos, Anterior, Próximo, Letras, Bíblia)
- ✅ Les noms de livres sont en portugais (Gênesis, Êxodo, Salmos)
- ✅ L'URL contient `?lang=PT`
- ❌ **Les PAROLES restent en FRANÇAIS** ("Dans les verts pâturages...")
- ❌ Devrait afficher: "O Senhor é meu pastor..."

## ARCHITECTURE LANGUE (PRINCIPE)

```
SEUL index.html = Sélecteur de langue (12 boutons drapeaux)
                  → localStorage.setItem('selectedLanguage', 'PT')
                  → Redirige avec ?lang=PT

TOUTES AUTRES PAGES = Lisent la langue via lang-shared.js
                      → window.currentLanguage = localStorage/URL/FR
                      → PAS de sélecteur de langue
                      → PAS de .lang-bar
                      → PAS de changeLanguage()
```

## FICHIERS DE DONNÉES

### Audio par langue
```
audio-urls.js       → window.audioUrls (FR legacy)
audio-urls-fr.js    → window.audioUrlsFR
audio-urls-pt.js    → window.audioUrlsPT (434 chapitres)
```

### Paroles par langue
```
lyrics-data.js      → window.chapterLyrics (FR legacy)
lyrics-data-v2.js   → window.chapterLyricsV2 (FR V2)
lyrics-data-pt.js   → window.chapterLyricsPT (1189 chapitres PT)
```

## CODE CRITIQUE - lecteur.html

### Ordre d'initialisation (DOIT être au début du script)
```javascript
// LIGNE ~713 - AVANT toutes les fonctions
let currentLanguage = window.currentLanguage || 'FR';
if (!window.currentLanguage) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang) {
        currentLanguage = urlLang.toUpperCase();
        window.currentLanguage = currentLanguage;
    } else {
        const saved = localStorage.getItem('selectedLanguage');
        if (saved) {
            currentLanguage = saved;
            window.currentLanguage = saved;
        }
    }
}
console.log('Langue initialisée:', currentLanguage);
```

### Fonction updateLyrics (utilise currentLanguage)
```javascript
function updateLyrics() {
    const chapterStr = String(currentChapter);
    let lyrics = null;
    
    console.log('updateLyrics - langue:', currentLanguage, 'livre:', currentBook);

    // PRIORITÉ PT
    if (currentLanguage === 'PT' &&
        typeof chapterLyricsPT !== 'undefined' &&
        chapterLyricsPT[currentBook] &&
        chapterLyricsPT[currentBook][chapterStr]) {
        
        lyrics = chapterLyricsPT[currentBook][chapterStr];
        console.log('✅ Paroles PT trouvées');
        
    } else if (typeof chapterLyrics !== 'undefined' &&
               chapterLyrics[currentBook] &&
               chapterLyrics[currentBook][chapterStr]) {
        
        // Fallback FR (V2 si disponible)
        if (useV2 && chapterLyricsV2?.[currentBook]?.[chapterStr]) {
            lyrics = chapterLyricsV2[currentBook][chapterStr];
        } else {
            lyrics = chapterLyrics[currentBook][chapterStr];
        }
        console.log('⚠️ Fallback paroles FR');
    }
    
    // ... affichage lyrics
}
```

## DIAGNOSTIC À FAIRE

1. Ouvrir `lecteur.html?lang=PT` dans le navigateur
2. Appuyer sur F12 → Console
3. Taper ces commandes:

```javascript
// Vérifier la langue
console.log('currentLanguage:', currentLanguage);
console.log('window.currentLanguage:', window.currentLanguage);

// Vérifier les données PT
console.log('chapterLyricsPT existe:', typeof chapterLyricsPT !== 'undefined');
console.log('Psaume 23 PT:', chapterLyricsPT?.["19"]?.["23"]?.substring(0, 100));
```

## FICHIERS À VÉRIFIER/CORRIGER

1. **lecteur.html** - Le plus critique
   - [ ] `currentLanguage` défini AU DÉBUT du script (avant les fonctions)
   - [ ] `updateLyrics()` utilise `currentLanguage` (pas une variable locale)
   - [ ] Pas de `.lang-bar` (CSS ni HTML)
   - [ ] Charge `lang-shared.js` en premier
   - [ ] Charge `lyrics-data-pt.js`

2. **lang-shared.js** - Doit exister et définir window.currentLanguage
   - [ ] Lit URL param `?lang=XX`
   - [ ] Lit localStorage `selectedLanguage`
   - [ ] Définit `window.currentLanguage`

3. **Autres pages** - Sans sélecteur
   - [ ] about.html
   - [ ] mentions-legales.html
   - [ ] crowdfunding.html
   - [ ] coming-soon.html
   - [ ] credits-depliant.html

## COMMANDE AUDIT

```powershell
cd C:\ScriptBible\bible-chantee
.\audit-langue.ps1
```

## OBJECTIF

Quand `lecteur.html?lang=PT` charge:
1. Console affiche: `Langue initialisée: PT`
2. Console affiche: `updateLyrics - langue: PT livre: 19`
3. Console affiche: `✅ Paroles PT trouvées`
4. Écran affiche: **"O Senhor é meu pastor, nada me faltará..."**

---

## FICHIERS UPLOADÉS POUR ANALYSE

- lecteur.html (version actuelle à corriger)
- lang-shared.js (si existe)
- lyrics-data-pt.js (pour vérifier la structure)
