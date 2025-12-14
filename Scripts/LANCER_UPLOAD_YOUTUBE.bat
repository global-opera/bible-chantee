@echo off
REM ============================================================================
REM  UPLOAD AUTOMATIQUE YOUTUBE - BIBLE CHANTÉE
REM ============================================================================
REM  Lance l'upload automatique des vidéos MP4 sur YouTube
REM  IMPORTANT: Nécessite configuration Google Cloud Console (voir SETUP_YOUTUBE.txt)
REM ============================================================================

title Bible Chantee - Upload YouTube

echo.
echo ========================================================================
echo   BIBLE CHANTEE - UPLOAD AUTOMATIQUE YOUTUBE
echo ========================================================================
echo.
echo   Quota gratuit: 10,000 unites/jour
echo   Upload video = ~1,600 unites
echo   Limite: ~6 videos/jour
echo.
echo   Ce processus va:
echo   1. Scanner les videos MP4 dans Videos/FR/
echo   2. Generer automatiquement titres/descriptions/tags
echo   3. Uploader sur YouTube avec thumbnails
echo   4. Ajouter aux playlists par livre
echo   5. Sauvegarder URLs dans youtube_uploads.json
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
    pause
    exit /b 1
)

REM Verifier que les modules Google API sont installes
python -c "import google.oauth2.credentials" >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERREUR] Modules Google API manquants
    echo Installation requise:
    echo   pip install google-api-python-client google-auth-oauthlib google-auth-httplib2
    echo.
    pause
    exit /b 1
)

REM Verifier que client_secret.json existe
if not exist "client_secret.json" (
    echo.
    echo [ERREUR] Fichier client_secret.json manquant!
    echo.
    echo Consultez SETUP_YOUTUBE.txt pour les instructions de configuration
    echo.
    pause
    exit /b 1
)

echo.
echo [INFO] Demarrage de l'upload YouTube...
echo.

REM Lancer le script Python
python upload_to_youtube.py

REM Si le script se termine
echo.
echo ========================================================================
echo   UPLOAD TERMINE
echo ========================================================================
echo.
pause
