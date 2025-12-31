# 🔧 Correction : Boutons de chapitres non cliquables

## Problème identifié

Les boutons de chapitres dans `lecteur.html` n'étaient **pas cliquables**.

### Cause

**Décalage ID/Sélecteur** :
- HTML utilise : `<div id="chapterGrid" class="chapters"></div>`
- JavaScript cherche : `#chapterButtons, #chapters, .chapter-buttons, .chapters, .chapter-grid`

❌ **`#chapterGrid` n'était pas dans la liste !**

### Impact

Le code JavaScript ne trouvait pas le conteneur et ne pouvait pas :
1. Créer les boutons de chapitres
2. Attacher les événements de clic
3. Permettre le changement de chapitre

## Solution appliquée

**Fichiers modifiés :**
- `js/player.js` (ligne 129)
- `V3/js/player.js` (ligne 129)

**Changement :**
```javascript
// AVANT
function findChapterWrap(){
  return document.querySelector('#chapterButtons, #chapters, .chapter-buttons, .chapters, .chapter-grid');
}

// APRÈS
function findChapterWrap(){
  return document.querySelector('#chapterButtons, #chapters, #chapterGrid, .chapter-buttons, .chapters, .chapter-grid');
}
```

## Test de validation

1. Ouvrir `lecteur.html` dans un navigateur
2. Sélectionner un livre (ex: Genèse)
3. Vérifier que les boutons de chapitres apparaissent (1, 2, 3, ... 50)
4. Cliquer sur le bouton "2"
5. Vérifier que :
   - Le bouton "2" devient actif (bordure dorée)
   - L'audio de Genèse 2 se charge
   - Les paroles de Genèse 2 s'affichent

## Résultat attendu

✅ Les boutons de chapitres sont maintenant cliquables
✅ Le changement de chapitre fonctionne correctement
✅ L'audio et les paroles se synchronisent

## Date de correction

2025-12-28

---

# 🔧 Correction : Boutons de chapitres reviennent au chapitre 1

## Problème identifié

Après la correction du problème de clics, un **nouveau problème** est apparu : quand on cliquait sur un bouton de chapitre (ex: chapitre 2), le lecteur revenait toujours au chapitre 1.

### Cause

**Ordre d'exécution incorrect dans `refreshAll()`** :
1. L'utilisateur clique sur le bouton "2"
2. `setActiveChapter(2)` ajoute la classe `.active` au bouton 2
3. `refreshAll(false)` est appelé (false = ne pas réinitialiser le chapitre)
4. `refreshAll()` appelle `renderChaptersFor()` qui fait `innerHTML = ''` ❌ **Tous les boutons sont détruits**
5. De nouveaux boutons sont créés (sans classe `.active`)
6. `refreshAll()` appelle `getSelectedChapter()` pour restaurer le chapitre
7. `getSelectedChapter()` cherche `.chapter-btn.active` mais ne trouve rien (boutons neufs)
8. Retourne la valeur par défaut : `1`
9. `setActiveChapter(1)` réactive le chapitre 1

### Impact

- Impossible de changer de chapitre
- Le lecteur reste bloqué sur le chapitre 1
- L'utilisateur voit brièvement le bouton 2 actif, puis il revient à 1

## Solution appliquée

**Fichiers modifiés :**
- `js/player.js` (lignes 671-686)
- `V3/js/player.js` (lignes 658-665)

**Changement :**
Sauvegarder le chapitre **AVANT** de détruire les boutons

```javascript
// AVANT (ligne 671-684 dans js/player.js)
if(bookCode){
  renderChaptersFor(bookCode);  // ← Détruit les boutons

  if(urlChapter !== null){
    setActiveChapter(urlChapter);
    urlChapter = null;
  } else {
    var savedChapter = getSelectedChapter();  // ← Ne trouve plus .active !
    if(resetChapter !== false) setActiveChapter(1);
    else setActiveChapter(savedChapter);
  }
}

// APRÈS
if(bookCode){
  // Sauvegarder le chapitre AVANT de détruire les boutons
  var savedChapter = getSelectedChapter();  // ← Sauvegarde AVANT destruction

  renderChaptersFor(bookCode);  // ← Détruit les boutons

  if(urlChapter !== null){
    setActiveChapter(urlChapter);
    urlChapter = null;
  } else {
    if(resetChapter !== false) setActiveChapter(1);
    else setActiveChapter(savedChapter);  // ← Restaure le bon chapitre
  }
}
```

### Explication de la correction

**Avant** : `getSelectedChapter()` était appelé APRÈS `renderChaptersFor()`, donc il cherchait `.active` sur des boutons qui venaient d'être détruits.

**Après** : `getSelectedChapter()` est appelé AVANT `renderChaptersFor()`, donc il trouve le bon bouton actif avant qu'il ne soit détruit, sauvegarde le numéro, puis le restaure sur les nouveaux boutons.

## Test de validation

1. Ouvrir `lecteur.html` dans un navigateur
2. Sélectionner un livre (ex: Genèse)
3. Vérifier que le chapitre 1 est actif par défaut
4. Cliquer sur le bouton "2"
5. Vérifier que :
   - Le bouton "2" reste actif (bordure dorée)
   - L'audio de Genèse 2 se charge et joue
   - Les paroles de Genèse 2 s'affichent
   - Le bouton ne revient PAS au chapitre 1
6. Cliquer sur le bouton "3"
7. Vérifier que le chapitre 3 reste actif

## Résultat attendu

✅ Les boutons de chapitres restent actifs après le clic
✅ Le changement de chapitre fonctionne correctement
✅ Pas de retour au chapitre 1
✅ L'audio et les paroles se synchronisent avec le bon chapitre

## Date de correction

2025-12-28
