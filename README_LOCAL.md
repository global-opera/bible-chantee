# Bible Chantée - Lecteur Local

## 🚀 Démarrage rapide

Double-cliquez sur : **START_LECTEUR_LOCAL.bat**

Le lecteur s'ouvrira automatiquement sur `http://localhost:8888/lecteur.html`

## 📁 Structure des fichiers

```
C:\ScriptBible\bible-chantee/
├── lecteur.html          (Lecteur principal avec toggle V1/V2)
├── server.py             (Serveur HTTP Python - Port 8888)
├── START_LECTEUR_LOCAL.bat  (Lancement rapide)
│
├── audio_v1/  -> G:\Mon Drive\01 BibleChantee\Suno_Output\FR_V1
├── audio_v2/  -> G:\Mon Drive\01 BibleChantee\Suno_Output\FR_V2
├── lyrics_v1/ -> G:\Mon Drive\01 BibleChantee\Lyrics\FR_V1
└── lyrics_v2/ -> G:\Mon Drive\01 BibleChantee\Lyrics\FR_V2
```

## 🎵 Toggle V1/V2

### Version V1 - "Original (1189)"
- **1189 chapitres complets**
- Pattern MP3 : `audio_v1/{BOOK}/{BOOK}_{CH}_FR.mp3` (2 chiffres)
- Pattern Lyrics : `lyrics_v1/{BOOK}/{BOOK}_{CH}_FR.txt`
- Exemple : `audio_v1/01_GEN/01_GEN_01_FR.mp3`

### Version V2 - "Nouveau (433)"
- **433 chapitres disponibles** (génération en cours)
- Pattern MP3 : `audio_v2/{BOOK}/{BOOK}_{CH}_v1.mp3` (3 chiffres)
- Pattern Lyrics : `lyrics_v2/{BOOK}/{BOOK}_{CH}_FR.txt`
- Exemple : `audio_v2/01_GEN/01_GEN_001_v1.mp3`

## ✨ Fonctionnalités

1. **Boutons V1/V2 dans le header**
   - Position : À gauche et droite du titre du livre
   - Style actif : Surbrillance dorée (#D4AF37)
   - Compteurs en temps réel

2. **Gestion automatique des chapitres manquants**
   - Si V2 non disponible : Message élégant avec bouton retour V1
   - Détection automatique des erreurs 404

3. **Paroles nettoyées**
   - Suppression automatique des tags : [TITLE], [LYRICS], [STYLE], [Verse], [Chorus], [Bridge], etc.
   - Formatage propre en paragraphes

## 🔧 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier que le port 8888 est libre
netstat -ano | findstr 8888

# Ou utiliser manuellement :
cd C:\ScriptBible\bible-chantee
python server.py
```

### Les fichiers audio ne se chargent pas
Vérifiez que les jonctions existent :
```bash
ls -l audio_v1 audio_v2 lyrics_v1 lyrics_v2
```

### Recréer les jonctions si nécessaire
```powershell
cd C:\ScriptBible\bible-chantee
cmd /c mklink /J audio_v1 "G:\Mon Drive\01 BibleChantee\Suno_Output\FR_V1"
cmd /c mklink /J audio_v2 "G:\Mon Drive\01 BibleChantee\Suno_Output\FR_V2"
cmd /c mklink /J lyrics_v1 "G:\Mon Drive\01 BibleChantee\Lyrics\FR_V1"
cmd /c mklink /J lyrics_v2 "G:\Mon Drive\01 BibleChantee\Lyrics\FR_V2"
```

## 📊 État de la génération V2

Pour suivre la progression de la génération V2 :
```bash
cd C:\Users\Stéphane CASSANI\bible-chantee\Scripts
python monitor_fr_v2.py
```

## 🔗 Liens utiles

- **URL locale** : http://localhost:8888/lecteur.html
- **Monitoring** : C:\Users\Stéphane CASSANI\Desktop\MONITOR_BIBLE_30s.bat
- **Scripts génération** : C:\Users\Stéphane CASSANI\bible-chantee\Scripts\

## 📝 Codes des livres

01_GEN, 02_EXO, 03_LEV, 04_NUM, 05_DEU, 06_JOS, 07_JDG, 08_RUT, 09_1SA, 10_2SA, 11_1KI, 12_2KI, 13_1CH, 14_2CH, 15_EZR, 16_NEH, 17_EST, 18_JOB, 19_PSA, 20_PRO, 21_ECC, 22_SNG, 23_ISA, 24_JER, 25_LAM, 26_EZK, 27_DAN, 28_HOS, 29_JOL, 30_AMO, 31_OBA, 32_JON, 33_MIC, 34_NAM, 35_HAB, 36_ZEP, 37_HAG, 38_ZEC, 39_MAL, 40_MAT, 41_MRK, 42_LUK, 43_JHN, 44_ACT, 45_ROM, 46_1CO, 47_2CO, 48_GAL, 49_EPH, 50_PHP, 51_COL, 52_1TH, 53_2TH, 54_1TI, 55_2TI, 56_TIT, 57_PHM, 58_HEB, 59_JAS, 60_1PE, 61_2PE, 62_1JN, 63_2JN, 64_3JN, 65_JUD, 66_REV
