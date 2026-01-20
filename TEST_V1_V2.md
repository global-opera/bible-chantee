# TEST DU LECTEUR LOCAL V1/V2

## Configuration appliquée

Le lecteur a été configuré pour utiliser les fichiers locaux via les jonctions symboliques.

## Tests à effectuer

### Test 1: V1 Genèse 1 ✓
**Attendu :**
- Audio : `audio_v1/01_GEN/01_GEN_01_FR.mp3`
- Paroles : `lyrics_v1/01_GEN/01_GEN_01_FR.txt`

**Vérifier :**
1. Sélectionner Genèse, Chapitre 1
2. Vérifier que V1 est actif (bouton doré)
3. Cliquer Play → Audio doit se charger et jouer
4. Afficher paroles → Texte doit s'afficher proprement

### Test 2: V2 Genèse 1 ✓
**Attendu :**
- Audio : `audio_v2/01_GEN/01_GEN_001_v1.mp3`
- Paroles : `lyrics_v2/01_GEN/01_GEN_001_FR.txt`

**Vérifier :**
1. Cliquer sur bouton V2
2. L'audio doit se recharger
3. Les paroles doivent se recharger

### Test 3: V2 Apocalypse 22 (pas encore disponible)
**Attendu :**
- Audio : Erreur 404 (fichier n'existe pas)
- Paroles : Message "Paroles V2 non disponibles"

**Vérifier :**
1. Sélectionner Apocalypse, Chapitre 22
2. Cliquer sur V2
3. Vérifier message d'erreur gracieux

### Test 4: Navigation avec autoplay
**Vérifier :**
1. Activer autoplay
2. Lire Genèse 1 en V1
3. Vérifier que Genèse 2 se charge automatiquement en V1

## Console JavaScript

Ouvrir la console (F12) pour voir les logs :
- `[V1] Chargement paroles: lyrics_v1/...`
- `[V2] Chargement paroles: lyrics_v2/...`
- `[V1] Response status: 200 true`

## Chemins vérifiés

### Jonctions symboliques
```
C:\ScriptBible\bible-chantee\audio_v1    → G:\Mon Drive\01 BibleChantee\Suno_Output\FR_V1
C:\ScriptBible\bible-chantee\audio_v2    → G:\Mon Drive\01 BibleChantee\Suno_Output\FR_V2
C:\ScriptBible\bible-chantee\lyrics_v1   → G:\Mon Drive\01 BibleChantee\Lyrics\FR_V1
C:\ScriptBible\bible-chantee\lyrics_v2   → G:\Mon Drive\01 BibleChantee\Lyrics\FR_V2
```

### Patterns de fichiers
**V1:**
- MP3: `{BOOK}_{CH:02}_FR.mp3` (ex: 01_GEN_01_FR.mp3)
- TXT: `{BOOK}_{CH:02}_FR.txt` (ex: 01_GEN_01_FR.txt)

**V2:**
- MP3: `{BOOK}_{CH:03}_v1.mp3` (ex: 01_GEN_001_v1.mp3)
- TXT: `{BOOK}_{CH:03}_FR.txt` (ex: 01_GEN_001_FR.txt)

## État des versions

### V1 (Complet - 1189 chapitres)
✓ Audio : 1189/1189
✓ Lyrics : 1189/1189

### V2 (En cours - 433 MP3, 117 lyrics)
⏳ Audio : 433/1189 (36.4%)
⏳ Lyrics : 117/1189 (9.8%)

Livres V2 complétés :
- 01_GEN - 50/50 ✓
- 02_EXO - 40/40 ✓
- 03_LEV - 27/27 ✓
- 04_NUM - 36/36 ✓
- 05_DEU - 34/34 ✓
- 06_JOS - 24/24 ✓
- 07_JDG - 21/21 ✓
- 08_RUT - 4/4 ✓
- 09_1SA - 31/31 ✓
- 10_2SA - 24/24 ✓
- 11_1KI - 13/22 (en cours)

## URL de test
http://localhost:8080/lecteur.html

## Arrêter le serveur
Dans le terminal où tourne `python -m http.server 8080`:
- Windows: Ctrl+C
- Ou fermer la fenêtre de commande
