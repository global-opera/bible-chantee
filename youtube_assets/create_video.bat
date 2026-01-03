@echo off
echo ============================================
echo CREATION VIDEO YOUTUBE - GENESE 1 FR
echo ============================================
echo.

REM Chemins
set MP3=G:\Mon Drive\01 BibleChantee\Suno_Output\FR\01_GEN\01_GEN_01_FR.mp3
set BG=background_genesis1.png
set SRT=01_GEN_01_FR.srt
set OUTPUT=FR_Genese_01_BibleChantee.mp4

REM Verifier que tous les fichiers existent
if not exist "%BG%" (
    echo ERREUR: %BG% non trouve
    exit /b 1
)

if not exist "%MP3%" (
    echo ERREUR: %MP3% non trouve
    exit /b 1
)

if not exist "%SRT%" (
    echo ERREUR: %SRT% non trouve
    echo INFO: Le fichier SRT doit etre genere avec Whisper d'abord
    exit /b 1
)

echo Fichiers sources:
echo   - Audio: %MP3%
echo   - Background: %BG%
echo   - Subtitles: %SRT%
echo.

echo Generation de la video...
ffmpeg -y -loop 1 -i %BG% -i "%MP3%" -vf "subtitles=%SRT%:force_style='FontSize=32,FontName=Arial,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=3,BorderStyle=3,Alignment=2,MarginV=100'" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -shortest -pix_fmt yuv420p %OUTPUT%

if errorlevel 1 (
    echo.
    echo ERREUR lors de la generation video
    exit /b 1
)

echo.
echo ============================================
echo VIDEO CREEE: %OUTPUT%
echo ============================================
echo.

REM Afficher informations
ffmpeg -i %OUTPUT% 2>&1 | findstr "Duration Video Audio"

echo.
echo OK! Video prete pour YouTube!
