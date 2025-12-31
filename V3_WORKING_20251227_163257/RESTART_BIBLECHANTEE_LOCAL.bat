@echo off
title Bible Chantée — Restart local server
set PORT=8787
set URL=http://localhost:%PORT%/lecteur.html?lang=FR

echo.
echo ==========================================
echo   Bible Chantee - Redemarrage serveur
echo ==========================================
echo.

REM 1) Tuer tout processus sur le port
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :%PORT%') do (
  echo -> Kill process %%p on port %PORT%
  taskkill /PID %%p /F >nul 2>&1
)

REM 2) Petit delai de securite
timeout /t 1 >nul

REM 3) Lancer serveur HTTP (Python)
echo -> Starting local server on port %PORT%
start "BibleChanteeServer" cmd /k python -m http.server %PORT%

REM 4) Attendre que le serveur soit pret
timeout /t 2 >nul

REM 5) Ouvrir le navigateur
echo -> Opening browser
start "" "%URL%"

echo.
echo ==========================================
echo   Serveur lance avec succes
echo   %URL%
echo ==========================================
echo.

