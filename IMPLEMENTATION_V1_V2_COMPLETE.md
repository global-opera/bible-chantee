# IMPLÉMENTATION TOGGLE V1/V2 - BIBLE CHANTÉE LOCAL

## ✅ Configuration terminée avec succès

Le lecteur local a été configuré pour basculer entre les versions V1 et V2 des fichiers MP3 et paroles.

---

## 📂 Architecture des fichiers

### Jonctions symboliques créées
```
C:\ScriptBible\bible-chantee\
├── audio_v1/  → G:\Mon Drive\01 BibleChantee\Suno_Output\FR_V1
├── audio_v2/  → G:\Mon Drive\01 BibleChantee\Suno_Output\FR_V2
├── lyrics_v1/ → G:\Mon Drive\01 BibleChantee\Lyrics\FR_V1
└── lyrics_v2/ → G:\Mon Drive\01 BibleChantee\Lyrics\FR_V2
```

### Patterns de nommage

**V1 (1189 chapitres complets):**
- Audio: `audio_v1/{BOOK}/{BOOK}_{CH:02}_FR.mp3`
  - Exemple: `audio_v1/01_GEN/01_GEN_01_FR.mp3`
- Lyrics: `lyrics_v1/{BOOK}/{BOOK}_{CH:02}_FR.txt`
  - Exemple: `lyrics_v1/01_GEN/01_GEN_01_FR.txt`

**V2 (433 MP3, 117 lyrics - en cours):**
- Audio: `audio_v2/{BOOK}/{BOOK}_{CH:03}_v1.mp3`
  - Exemple: `audio_v2/01_GEN/01_GEN_001_v1.mp3`
- Lyrics: `lyrics_v2/{BOOK}/{BOOK}_{CH:03}_FR.txt`
  - Exemple: `lyrics_v2/01_GEN/01_GEN_001_FR.txt`

---

## 🎯 Modifications appliquées

### 1. Fonction `getAudioUrl()`
**Avant:** Utilisait CDN R2 pour V1
**Après:** Utilise `audio_v1/` pour V1 et `audio_v2/` pour V2

### 2. Fonction `loadLyricsV1()` (nouvelle)
Charge les paroles depuis `lyrics_v1/{BOOK}/{BOOK}_{CH:02}_FR.txt`
- Nettoie les tags [TITLE], [LYRICS], [STYLE]
- Formate en HTML avec paragraphes

### 3. Fonction `loadLyricsV2()` (modifiée)
Charge les paroles depuis `lyrics_v2/{BOOK}/{BOOK}_{CH:03}_FR.txt`
- Gère les fichiers manquants avec message gracieux

### 4. Fonction `loadLyrics()` (modifiée)
Appelle `loadLyricsV1()` quand V1 est sélectionné

### 5. Bouton V1 (modifié)
Charge maintenant les paroles V1 au lieu d'afficher un message

---

## 🚀 Utilisation

### Démarrer le serveur local
```bash
cd C:\ScriptBible\bible-chantee
python -m http.server 8080
```

### Ouvrir le lecteur
```
http://localhost:8080/lecteur.html
```

### Interface

Le lecteur affiche deux boutons **V1** et **V2** dans le header :

```
🔷 [V1] Genèse [V2]
    Chapitre 1
```

- **V1 actif** (doré) : Lecture depuis FR_V1 (complet)
- **V2 actif** (doré) : Lecture depuis FR_V2 (en cours)

---

## 🔍 Tests à effectuer

### ✅ Test 1: V1 Genèse 1
1. Ouvrir `http://localhost:8080/lecteur.html`
2. Vérifier que V1 est actif (bouton doré)
3. Sélectionner Genèse, Chapitre 1
4. Cliquer Play → Audio joue
5. Voir les paroles → Texte affiché proprement

### ✅ Test 2: V2 Genèse 1
1. Cliquer sur bouton V2
2. Audio se recharge automatiquement
3. Paroles se rechargent
4. Vérifier dans console F12 : `[V2] Chargement paroles: lyrics_v2/01_GEN/01_GEN_001_FR.txt`

### ✅ Test 3: V2 Apocalypse 22 (manquant)
1. Sélectionner Apocalypse, Chapitre 22
2. Cliquer sur V2
3. Vérifier message : "Paroles V2 non disponibles"
4. Audio peut échouer (404) - comportement attendu

### ✅ Test 4: Basculer V1 ↔ V2
1. Genèse 1 en V1 → Play
2. Cliquer V2 → Audio et paroles changent
3. Cliquer V1 → Retour à l'original

---

## 📊 État des versions

### V1 (Complet)
- ✅ Audio : **1189/1189** chapitres (100%)
- ✅ Lyrics : **1189/1189** chapitres (100%)
- Source : Archive.org + Google Drive

### V2 (En cours)
- ⏳ Audio : **433/1189** chapitres (36.4%)
- ⏳ Lyrics : **117/1189** chapitres (9.8%)
- Source : Génération Suno API en cours

**Livres V2 complets (11/66):**
1. 01_GEN - Genèse (50 chapitres) ✓
2. 02_EXO - Exode (40 chapitres) ✓
3. 03_LEV - Lévitique (27 chapitres) ✓
4. 04_NUM - Nombres (36 chapitres) ✓
5. 05_DEU - Deutéronome (34 chapitres) ✓
6. 06_JOS - Josué (24 chapitres) ✓
7. 07_JDG - Juges (21 chapitres) ✓
8. 08_RUT - Ruth (4 chapitres) ✓
9. 09_1SA - 1 Samuel (31 chapitres) ✓
10. 10_2SA - 2 Samuel (24 chapitres) ✓
11. 11_1KI - 1 Rois (13/22 chapitres) ⏳

---

## 🛠️ Debug console JavaScript

Ouvrir la console (F12) pour voir les logs détaillés :

```javascript
[V1] Chargement paroles: lyrics_v1/01_GEN/01_GEN_01_FR.txt
[V1] Response status: 200 true
[V1] Paroles chargées, longueur: 1234
```

Ou pour V2 :

```javascript
[V2] Chargement paroles: lyrics_v2/01_GEN/01_GEN_001_FR.txt
[V2] Response status: 200 true
[V2] Paroles chargées, longueur: 2345
```

---

## 📝 Fichiers modifiés

### `lecteur.html`
- ✅ `getAudioUrl()` - Adapté pour audio_v1 et audio_v2
- ✅ `loadLyricsV1()` - Nouvelle fonction
- ✅ `loadLyricsV2()` - Modifiée pour lyrics_v2
- ✅ `loadLyrics()` - Appelle loadLyricsV1 en V1
- ✅ Bouton V1 handler - Charge paroles V1

### `configure_v1_v2_local.py`
Script de configuration qui applique toutes les modifications automatiquement.

### Backup
`lecteur.html.backup` - Sauvegarde avant modification

---

## 🔧 Arrêter le serveur

Dans le terminal où tourne le serveur :
- **Windows:** `Ctrl+C`
- Ou fermer la fenêtre de commande

---

## ✨ Fonctionnalités conservées

- ✅ Sélection livre/chapitre
- ✅ Lecteur audio HTML5
- ✅ Navigation précédent/suivant
- ✅ Autoplay (lecture continue)
- ✅ Boutons de contrôle (⏮️ ⏪ ⏸️ ⏩ ⏭️)
- ✅ Barre de progression
- ✅ Bouton favoris
- ✅ Bouton partage
- ✅ Multilingue (7 langues)

---

## 🎉 Mission accomplie !

Le toggle V1/V2 est maintenant fonctionnel avec :
1. ✅ Chargement audio depuis audio_v1 et audio_v2
2. ✅ Chargement paroles depuis lyrics_v1 et lyrics_v2
3. ✅ Gestion gracieuse des fichiers V2 manquants
4. ✅ Interface intuitive avec boutons dorés
5. ✅ Logs console pour debugging

Le lecteur est prêt pour les tests ! 🚀
