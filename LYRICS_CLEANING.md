# Nettoyage des Paroles - Bible Chantée

## Vue d'ensemble

Ce document décrit le système de nettoyage des paroles pour le projet Bible Chantée. Les fichiers de données brutes (`lyrics-data.js` et `lyrics-data-pt.js`) contiennent des marqueurs structurels qui doivent être supprimés avant l'affichage à l'utilisateur.

## Problème identifié

Les paroles contiennent plusieurs types de marqueurs techniques qui polluent l'affichage :

### 1. Marqueurs entre crochets
- **Français** : `[Verse 1]`, `[Chorus]`, `[Bridge]`, `[Outro]`, `[Spoken Word]`, `[Verset]`
- **Portugais** : `[TITRE]`, `[LYRICS]`, `[Verso]`, `[Refrão]`, `[Ponte]`, `[Conclusão]`, `[ESTILO]`, `[STYLE]`

### 2. Marqueurs Markdown
- `**Cânticos do Criador**`
- `**[TÍTULO]**`
- `**Génesis 1**`

### 3. Marqueurs en texte brut
- `Verse 1:`
- `Chorus:`
- `Refrão:`
- `Ponte:`
- etc.

### 4. Sections techniques
- `[STYLE]` ou `[ESTILO]` suivis de descriptions techniques complètes qui ne doivent jamais être affichées

## Solution : Fonction cleanLyrics()

### Code complet

```javascript
function cleanLyrics(text) {
    if (!text) return '';

    // 1. Supprimer [STYLE] ou [ESTILO] et tout ce qui suit
    text = text.replace(/\[(STYLE|ESTILO)\][\s\S]*/gi, '');

    // 2. Supprimer TOUS les marqueurs entre crochets [...]
    text = text.replace(/\[.*?\]/gi, '');

    // 3. Supprimer TOUS les marqueurs Markdown **...**
    text = text.replace(/\*\*[^*]+\*\*/g, '');

    // 4. Supprimer les lignes de marqueurs structurels seules
    text = text.replace(/^[\s]*(Verse|Chorus|Bridge|Refrain|Couplet|Outro|Intro|Hook|Pre-Chorus|Post-Chorus|Conclusão|Conclusion|Ponte|Refrão|Estrofe|Interlude|Solo|Tag|Vamp|Ad-lib|Break|Verset|Verso|Glória|Final)[\s\d]*[:\s]*$/gim, '');

    // 5. Normaliser les espaces : exactement 1 ligne vide entre couplets
    text = text.replace(/\n{2,}/g, '\n\n');

    // 6. Supprimer les lignes vides au début et à la fin
    return text.trim();
}
```

### Explication détaillée

#### Étape 1 : Suppression de [STYLE]/[ESTILO]
```javascript
text.replace(/\[(STYLE|ESTILO)\][\s\S]*/gi, '')
```
- **Pourquoi en premier** : Doit être traité avant les autres remplacements
- **Regex** : `[\s\S]*` capture TOUT jusqu'à la fin (newlines inclus)
- **Flags** : `gi` = global, case-insensitive

#### Étape 2 : Suppression des marqueurs entre crochets
```javascript
text.replace(/\[.*?\]/gi, '')
```
- **Regex** : `.*?` = correspondance non-gourmande (s'arrête au premier `]`)
- **Capture** : Tous les textes entre `[` et `]`

#### Étape 3 : Suppression des marqueurs Markdown
```javascript
text.replace(/\*\*[^*]+\*\*/g, '')
```
- **Regex** : `[^*]+` = un ou plusieurs caractères qui ne sont PAS des `*`
- **Capture** : `**Titre**`, `**[TEXTO]**`, etc.

#### Étape 4 : Suppression des lignes de marqueurs structurels
```javascript
text.replace(/^[\s]*(liste de mots)[\s\d]*[:\s]*$/gim, '')
```
- **Regex** :
  - `^` = début de ligne
  - `[\s]*` = espaces optionnels au début
  - `(Verse|Chorus|...)` = liste complète des marqueurs
  - `[\s\d]*` = espaces et chiffres optionnels (ex: "Verse 1", "Refrão 2")
  - `[:\s]*` = deux-points et espaces optionnels (ex: "Verse 1:")
  - `$` = fin de ligne
- **Flags** : `gim` = global, case-insensitive, multiline

#### Étape 5 : Normalisation des espaces
```javascript
text.replace(/\n{2,}/g, '\n\n')
```
- **Objectif** : Exactement UNE ligne vide entre chaque couplet
- **Capture** : 2 newlines ou plus → remplace par exactement 2 newlines

#### Étape 6 : Nettoyage final
```javascript
return text.trim()
```
- Supprime les espaces/newlines au début et à la fin

## Liste complète des marqueurs supportés

### Marqueurs multilingues
- **Anglais** : Verse, Chorus, Bridge, Outro, Intro, Hook, Pre-Chorus, Post-Chorus, Interlude, Solo, Tag, Vamp, Ad-lib, Break
- **Français** : Verset, Refrain, Couplet, Pont, Conclusion
- **Portugais** : Verso, Refrão, Ponte, Estrofe, Conclusão, Glória, Final

### Variantes numériques
Tous les marqueurs ci-dessus peuvent inclure des numéros :
- `Verse 1`, `Verse 2`, etc.
- `Refrão 3`, `Ponte 2`, etc.

### Variantes avec deux-points
Tous les marqueurs peuvent se terminer par `:` :
- `Chorus:`
- `Verse 1:`
- `Refrão:`

## Implémentation

### Fichiers modifiés

1. **demo.html** (ligne ~742-762)
   - Fonction `cleanLyrics()` définie dans le scope global
   - Appliquée dans `toggleLyrics()` avant affichage

2. **lecteur.html** (ligne ~804-824)
   - Fonction `cleanLyrics()` définie dans le scope global
   - Appliquée dans `toggleLyrics()` avant affichage

### Utilisation

```javascript
function toggleLyrics(chapterId, verseNumber) {
    // ... code existant ...

    const lyrics = currentLang === 'PT'
        ? window.chapterLyricsPT[chapterId]?.[verseNumber]
        : window.chapterLyrics[chapterId]?.[verseNumber];

    // APPLIQUER cleanLyrics() avant l'affichage
    const cleanedLyrics = cleanLyrics(lyrics);

    lyricsDiv.textContent = cleanedLyrics;
    lyricsDiv.style.display = 'block';
}
```

## Tests recommandés

Pour valider le nettoyage, tester avec ces chapitres :

### Français
- **Genèse 1** : Contient des marqueurs `[Verse]`, `[Chorus]`
- **Psaume 23** : Structure typique avec refrains
- **Psaume 150** : Marqueurs variés

### Portugais
- **Gênesis 1** : Contient `[TITRE]`, `[LYRICS]`, `[STYLE]`
- **Salmo 23** : Marqueurs `**Markdown**`
- **Salmo 150** : Combinaison de tous les formats

### Vérifications
1. ✅ Aucun marqueur visible dans l'affichage final
2. ✅ Exactement 1 ligne vide entre chaque couplet
3. ✅ Pas de lignes vides au début/fin
4. ✅ Texte des paroles intact (aucune perte de contenu)
5. ✅ Sections [STYLE] complètement supprimées

## Maintenance future

### Ajout de nouveaux marqueurs

Si de nouveaux marqueurs apparaissent dans les données, les ajouter à l'étape 4 :

```javascript
text.replace(/^[\s]*(ANCIEN_LISTE|NOUVEAU_MARQUEUR)[\s\d]*[:\s]*$/gim, '');
```

### Ajout de nouveaux formats

Si un nouveau format de marqueur apparaît (ex: `~~texte~~`), ajouter une nouvelle étape :

```javascript
// 7. Supprimer nouveau format ~~...~~
text = text.replace(/~~[^~]+~~/g, '');
```

### Ordre des opérations

**IMPORTANT** : L'ordre des regex est critique :
1. Toujours traiter `[STYLE]` en premier
2. Les marqueurs génériques (`[...]`, `**...**`) ensuite
3. Les marqueurs spécifiques en dernier
4. La normalisation des espaces à la fin

## Historique des modifications

- **2025-12-17** : Création de la fonction complète avec support de tous les formats
- **2025-12-17** : Ajout du support pour `[ESTILO]` (variante portugaise)
- **2025-12-17** : Extension de la liste des marqueurs multilingues
- **2025-12-17** : Application dans `demo.html` et `lecteur.html`

## Références

- **Fichiers de données** : `lyrics-data.js`, `lyrics-data-pt.js`
- **Fichiers d'implémentation** : `demo.html`, `lecteur.html`
- **Format des données** : `window.chapterLyrics[chapterId][verseNumber]`

---

**Auteur** : Bible Chantée Development Team
**Dernière mise à jour** : 2025-12-17
**Version** : 1.0
