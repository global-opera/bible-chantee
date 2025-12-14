================================================================================
  BIBLE CHANTEE - GUIDE D'UTILISATION RAPIDE
================================================================================

FICHIERS IMPORTANTS:
-------------------

1. LANCER_GENERATION_SUNO.bat
   --> Double-cliquez pour lancer la génération automatique
   --> Le script reprend automatiquement là où il s'était arrêté
   --> Peut être interrompu avec Ctrl+C et relancé plus tard

2. api_key.py
   --> Contient la clé API Suno (déjà configurée)
   --> Clé actuelle: baa2f6a4d4244bd9a4b5c0c755db5dab

3. generate_all_66_books.py
   --> Script principal de génération des 66 livres
   --> Appelé automatiquement par LANCER_GENERATION_SUNO.bat

4. suno_api_generator.py
   --> Module de base pour l'API Suno
   --> Ne pas modifier sauf si vous savez ce que vous faites


CONFIGURATION ACTUELLE:
----------------------

Clé API Suno: baa2f6a4d4244bd9a4b5c0c755db5dab
Crédits disponibles: 11 738 crédits (~978 chapitres)

État actuel (au 7 décembre 2025):
- 926/1189 chapitres générés (77.9%)
- 36/66 livres complets
- 263 chapitres manquants

Estimation:
- Temps restant: ~11 heures
- Crédits nécessaires: ~3 156
- Crédits restants après: ~8 582


DOSSIERS IMPORTANTS:
-------------------

Fichiers lyrics (entrée):
G:\Mon Drive\01 BibleChantee\Lyrics\FR\[CODE_LIVRE]\

Fichiers MP3 générés (sortie):
G:\Mon Drive\01 BibleChantee\Suno_Output\FR\[CODE_LIVRE]\


UTILISATION:
-----------

DÉMARRAGE RAPIDE:
1. Double-cliquez sur "LANCER_GENERATION_SUNO.bat"
2. Attendez que la génération se termine (ou interrompez avec Ctrl+C)
3. Les MP3 sont automatiquement sauvegardés

REPRENDRE UNE GÉNÉRATION INTERROMPUE:
1. Double-cliquez à nouveau sur "LANCER_GENERATION_SUNO.bat"
2. Le script détecte automatiquement ce qui manque et reprend

VÉRIFIER L'ÉTAT:
1. Ouvrez le dossier: G:\Mon Drive\01 BibleChantee\Suno_Output\FR\
2. Comptez les MP3 dans chaque livre
3. Ou relancez le script, il affiche l'état avant de commencer


GÉNÉRATION D'UN LIVRE SPÉCIFIQUE:
---------------------------------

Si vous voulez générer un livre précis (ex: Matthieu):

1. Ouvrez une invite de commande
2. cd C:\ScriptBible\bible-chantee\Scripts
3. python -c "from suno_api_generator import process_book; from api_key import SUNO_API_KEY; process_book('FR', '40_MAT', SUNO_API_KEY)"


CODES DES LIVRES:
----------------

Ancien Testament:
01_GEN (Genèse), 02_EXO (Exode), 03_LEV (Lévitique), 04_NUM (Nombres),
05_DEU (Deutéronome), 06_JOS (Josué), 07_JDG (Juges), 08_RUT (Ruth),
09_1SAM (1 Samuel), 10_2SAM (2 Samuel), 11_1KI (1 Rois), 12_2KI (2 Rois),
13_1CH (1 Chroniques), 14_2CH (2 Chroniques), 15_EZR (Esdras),
16_NEH (Néhémie), 17_EST (Esther), 18_JOB (Job), 19_PSA (Psaumes),
20_PRO (Proverbes), 21_ECC (Ecclésiaste), 22_SON (Cantique),
23_ISA (Ésaïe), 24_JER (Jérémie), 25_LAM (Lamentations),
26_EZE (Ézéchiel), 27_DAN (Daniel), 28_HOS (Osée), 29_JOE (Joël),
30_AMO (Amos), 31_OBA (Abdias), 32_JON (Jonas), 33_MIC (Michée),
34_NAH (Nahum), 35_HAB (Habacuc), 36_ZEP (Sophonie), 37_HAG (Aggée),
38_ZEC (Zacharie), 39_MAL (Malachie)

Nouveau Testament:
40_MAT (Matthieu), 41_MAR (Marc), 42_LUK (Luc), 43_JOH (Jean),
44_ACT (Actes), 45_ROM (Romains), 46_1CO (1 Corinthiens),
47_2CO (2 Corinthiens), 48_GAL (Galates), 49_EPH (Éphésiens),
50_PHP (Philippiens), 51_COL (Colossiens), 52_1TH (1 Thessaloniciens),
53_2TH (2 Thessaloniciens), 54_1TI (1 Timothée), 55_2TI (2 Timothée),
56_TIT (Tite), 57_PHM (Philémon), 58_HEB (Hébreux), 59_JAS (Jacques),
60_1PE (1 Pierre), 61_2PE (2 Pierre), 62_1JO (1 Jean), 63_2JO (2 Jean),
64_3JO (3 Jean), 65_JUD (Jude), 66_REV (Apocalypse)


DÉPANNAGE:
---------

Problème: "Python n'est pas reconnu"
Solution: Installez Python 3.x depuis https://www.python.org/

Problème: "Module 'requests' non trouvé"
Solution: pip install requests

Problème: "Clé API invalide"
Solution: Vérifiez que api_key.py contient la bonne clé

Problème: "Pas de crédits"
Solution: Rechargez des crédits sur votre compte Suno

Problème: Le script semble bloqué
Solution: Attendez 2-3 minutes (génération Suno prend du temps)
         Si vraiment bloqué: Ctrl+C puis relancez


CONTACT & SUPPORT:
-----------------

Pour toute question sur le projet Bible Chantée:
- Vérifiez d'abord ce README
- Consultez les logs dans la fenêtre de commande
- Vérifiez l'état des fichiers MP3 générés


================================================================================
Dernière mise à jour: 7 décembre 2025
================================================================================
