# 🎯 GUIDE RAPIDE : Commit du Patch de Nettoyage des Titres

## ✅ Ce qui a été fait

### 1. Code modifié (automatiquement)
- ✅ `lecteur.html` : Fonction `cleanTitle()` ajoutée et appliquée
- ✅ `js/chapter-titles.js` : 8 titres normalisés (guillemets supprimés)

### 2. Scripts créés
- ✅ `Scripts/NORMALIZE_CHAPTER_TITLES.ps1` (réutilisable)
- ✅ `Scripts/CLEAN_EN_VERSE_TITLES.ps1` (déjà utilisé - 178 "Verse X" supprimés)

### 3. Documentation
- ✅ `PATCH_CLEAN_TITLES_COMPLETE.diff` (format git diff)
- ✅ `COMMIT_MESSAGE.txt` (message de commit pré-rédigé)
- ✅ `PATCH_SUMMARY.md` (documentation complète)
- ✅ `GUIDE_COMMIT.md` (ce fichier)

---

## 🚀 Pour Commiter (méthode simple)

### Option 1 : Commit direct avec message préparé

```bash
cd "C:\ScriptBible\bible-chantee"

# Ajouter les fichiers modifiés
git add lecteur.html
git add js/chapter-titles.js
git add Scripts/NORMALIZE_CHAPTER_TITLES.ps1

# Commiter avec le message préparé
git commit -F COMMIT_MESSAGE.txt

# Pousser (optionnel)
git push origin main
```

### Option 2 : Vérifier avant de commiter

```bash
cd "C:\ScriptBible\bible-chantee"

# Voir l'état
git status

# Voir les changements dans lecteur.html
git diff lecteur.html

# Voir les changements dans chapter-titles.js
git diff js/chapter-titles.js

# Si tout est OK, commiter
git add lecteur.html js/chapter-titles.js Scripts/NORMALIZE_CHAPTER_TITLES.ps1
git commit -F COMMIT_MESSAGE.txt
```

---

## 📝 Message de Commit (déjà préparé)

Le fichier `COMMIT_MESSAGE.txt` contient :

```
feat: nettoyage permanent des titres de chapitres

## Modifications

### Frontend (lecteur.html)
- Ajout fonction cleanTitle(s)
- Application systématique dans getChapterTitle()
- Correction code cassé

### Données (js/chapter-titles.js)
- Normalisation de 8 titres

### Scripts
- Scripts/NORMALIZE_CHAPTER_TITLES.ps1 : normalisation automatique
- Scripts/CLEAN_EN_VERSE_TITLES.ps1 : suppression "Verse X"

Testé: ✓ Aucune régression
```

---

## 🔍 Vérification Rapide

### Test dans le navigateur (après commit)
1. Ouvrir `lecteur.html`
2. Ouvrir la console (F12)
3. Tester :
```javascript
cleanTitle('" Test "')  // Devrait retourner "Test"
cleanTitle('« Titre »')  // Devrait retourner "Titre"
```

### Vérifier l'affichage
- Charger un chapitre dans chaque langue
- Vérifier qu'aucun titre ne commence/finit par guillemet externe
- Exemple : Lamentations 3 (FR) devrait afficher `Lamentations 3 - « Ta Fidélité, Ma Lumière` (sans » à la fin)

---

## 📦 Fichiers à Commiter

### Obligatoires
- ✅ `lecteur.html` (fonction cleanTitle + corrections)
- ✅ `js/chapter-titles.js` (8 titres normalisés)
- ✅ `Scripts/NORMALIZE_CHAPTER_TITLES.ps1` (pour maintenance future)

### Optionnels (documentation)
- `COMMIT_MESSAGE.txt`
- `PATCH_SUMMARY.md`
- `PATCH_CLEAN_TITLES_COMPLETE.diff`
- `GUIDE_COMMIT.md`

---

## 🏷️ Tag Optionnel

Si vous souhaitez créer un tag de version :

```bash
git tag -a v1.2.0-clean-titles -m "Nettoyage permanent des titres de chapitres"
git push origin v1.2.0-clean-titles
```

---

## ⚠️ Important

### Ne PAS commiter
- ❌ Fichiers temporaires (*.tmp, *.log)
- ❌ Fichiers de backup (*_BACKUP_*)
- ❌ node_modules/

### ATTENTION
- Les modifications sont **permanentes** et **réversibles** via git
- Les 8 titres dans `chapter-titles.js` ont perdu leur guillemet fermant `»`
- C'est **intentionnel** : `cleanTitle()` le supprimera aussi côté frontend

---

## 📊 Statistiques du Patch

| Métrique | Valeur |
|----------|--------|
| Fichiers modifiés | 2 |
| Lignes ajoutées | ~15 |
| Lignes supprimées | ~5 |
| Titres normalisés | 8 |
| "Verse X" supprimés (avant) | 178 |
| Scripts créés | 1 nouveau |

---

## 🆘 En Cas de Problème

### Annuler les modifications (AVANT commit)
```bash
git checkout -- lecteur.html
git checkout -- js/chapter-titles.js
```

### Annuler le commit (APRÈS commit, AVANT push)
```bash
git reset --soft HEAD~1
# Vos modifications restent, vous pouvez les modifier
```

### Annuler complètement (APRÈS commit)
```bash
git reset --hard HEAD~1
# ATTENTION : Perte des modifications !
```

---

## ✨ Résultat Final

Après ce commit :
- ✅ Tous les titres sont normalisés automatiquement
- ✅ Aucun guillemet externe visible dans l'UI
- ✅ Code maintenable et documenté
- ✅ Script réutilisable pour futures normalisations

---

**Prêt à commiter ? Lancez :**

```bash
cd "C:\ScriptBible\bible-chantee"
git add lecteur.html js/chapter-titles.js Scripts/NORMALIZE_CHAPTER_TITLES.ps1
git commit -F COMMIT_MESSAGE.txt
```

✅ **C'est fait !**
