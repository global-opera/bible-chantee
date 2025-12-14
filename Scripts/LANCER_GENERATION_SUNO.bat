@echo off
REM ============================================================================
REM  SCRIPT DE DEMARRAGE - GENERATION BIBLE CHANTEE SUNO
REM ============================================================================
REM  Ce script lance automatiquement la generation des chapitres manquants
REM  Double-cliquez simplement sur ce fichier pour demarrer!
REM ============================================================================

title Bible Chantee - Generation Suno FR

echo.
echo ========================================================================
echo   BIBLE CHANTEE - GENERATION AUTOMATIQUE SUNO
echo ========================================================================
echo.
echo   Cle API: baa2f6a4d4244bd9a4b5c0c755db5dab
echo   Credits disponibles: 11 738
echo   Chapitres manquants: 263
echo.
echo   Le processus va demarrer dans 3 secondes...
echo   Appuyez sur Ctrl+C pour annuler
echo.
echo ========================================================================
timeout /t 3 /nobreak >nul

REM Se positionner dans le bon repertoire
cd /d "C:\ScriptBible\bible-chantee\Scripts"

REM Verifier que Python est disponible
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERREUR] Python n'est pas installe ou pas dans le PATH
    echo Veuillez installer Python 3.x depuis https://www.python.org/
    pause
    exit /b 1
)

REM Verifier que le fichier api_key.py existe
if not exist "api_key.py" (
    echo.
    echo [ERREUR] Le fichier api_key.py est manquant
    echo Creation automatique du fichier...
    echo """Configuration des cles API pour le projet Bible Chantee""" > api_key.py
    echo. >> api_key.py
    echo # Cle API Suno pour la generation de musique >> api_key.py
    echo SUNO_API_KEY = "baa2f6a4d4244bd9a4b5c0c755db5dab" >> api_key.py
    echo.
    echo [OK] Fichier api_key.py cree
)

REM Verifier que les modules requis sont installes
echo.
echo [INFO] Verification des dependances Python...
python -c "import requests" 2>nul
if errorlevel 1 (
    echo [INFO] Installation du module 'requests'...
    pip install requests
)

REM Afficher l'etat actuel
echo.
echo [INFO] Analyse de l'etat actuel...
python -c "from pathlib import Path; import os; books = [('01_GEN', 'Genese', 50), ('02_EXO', 'Exode', 40), ('03_LEV', 'Levitique', 27), ('04_NUM', 'Nombres', 36), ('05_DEU', 'Deuteronome', 34), ('06_JOS', 'Josue', 24), ('07_JDG', 'Juges', 21), ('08_RUT', 'Ruth', 4), ('09_1SAM', '1 Samuel', 31), ('10_2SAM', '2 Samuel', 24), ('11_1KI', '1 Rois', 22), ('12_2KI', '2 Rois', 25), ('13_1CH', '1 Chroniques', 29), ('14_2CH', '2 Chroniques', 36), ('15_EZR', 'Esdras', 10), ('16_NEH', 'Nehemie', 13), ('17_EST', 'Esther', 10), ('18_JOB', 'Job', 42), ('19_PSA', 'Psaumes', 150), ('20_PRO', 'Proverbes', 31), ('21_ECC', 'Ecclesiaste', 12), ('22_SON', 'Cantique', 8), ('23_ISA', 'Esaie', 66), ('24_JER', 'Jeremie', 52), ('25_LAM', 'Lamentations', 5), ('26_EZE', 'Ezechiel', 48), ('27_DAN', 'Daniel', 12), ('28_HOS', 'Osee', 14), ('29_JOE', 'Joel', 3), ('30_AMO', 'Amos', 9), ('31_OBA', 'Abdias', 1), ('32_JON', 'Jonas', 4), ('33_MIC', 'Michee', 7), ('34_NAH', 'Nahum', 3), ('35_HAB', 'Habacuc', 3), ('36_ZEP', 'Sophonie', 3), ('37_HAG', 'Aggee', 2), ('38_ZEC', 'Zacharie', 14), ('39_MAL', 'Malachie', 4), ('40_MAT', 'Matthieu', 28), ('41_MAR', 'Marc', 16), ('42_LUK', 'Luc', 24), ('43_JOH', 'Jean', 21), ('44_ACT', 'Actes', 28), ('45_ROM', 'Romains', 16), ('46_1CO', '1 Corinthiens', 16), ('47_2CO', '2 Corinthiens', 13), ('48_GAL', 'Galates', 6), ('49_EPH', 'Ephesiens', 6), ('50_PHP', 'Philippiens', 4), ('51_COL', 'Colossiens', 4), ('52_1TH', '1 Thessaloniciens', 5), ('53_2TH', '2 Thessaloniciens', 3), ('54_1TI', '1 Timothee', 6), ('55_2TI', '2 Timothee', 4), ('56_TIT', 'Tite', 3), ('57_PHM', 'Philemon', 1), ('58_HEB', 'Hebreux', 13), ('59_JAS', 'Jacques', 5), ('60_1PE', '1 Pierre', 5), ('61_2PE', '2 Pierre', 3), ('62_1JO', '1 Jean', 5), ('63_2JO', '2 Jean', 1), ('64_3JO', '3 Jean', 1), ('65_JUD', 'Jude', 1), ('66_REV', 'Apocalypse', 22)]; base = Path('G:/Mon Drive/01 BibleChantee/Suno_Output/FR'); total_expected = sum(c for _,_,c in books); total_actual = sum(len(list((base/code).glob('*.mp3'))) if (base/code).exists() else 0 for code,_,_ in books); complete = sum(1 for code,_,expected in books if (base/code).exists() and len(list((base/code).glob('*.mp3'))) >= expected); print(f'\n[ETAT] {total_actual}/{total_expected} chapitres generes ({total_actual/total_expected*100:.1f}%%)'); print(f'[ETAT] {complete}/66 livres complets'); print(f'[ETAT] {total_expected-total_actual} chapitres manquants\n')"

echo.
echo ========================================================================
echo   LANCEMENT DE LA GENERATION
echo ========================================================================
echo.
echo   Le processus peut prendre plusieurs heures
echo   Vous pouvez fermer cette fenetre avec Ctrl+C
echo   Le script reprendra automatiquement au prochain lancement
echo.
echo   Dossier de sortie: G:\Mon Drive\01 BibleChantee\Suno_Output\FR\
echo.
echo ========================================================================
echo.

REM Lancer la generation
python generate_all_66_books.py

REM Si le script se termine normalement
echo.
echo ========================================================================
echo   GENERATION TERMINEE!
echo ========================================================================
echo.
pause
