@echo off
chcp 65001 >nul
title Deployer Nouveau Testament - Bible Chantee
color 0B

echo.
echo   ============================================================
echo        DEPLOIEMENT NOUVEAU TESTAMENT
echo   ============================================================
echo.
echo   Ce script va:
echo     1. Diagnostiquer les MP3 du NT (livres 40-66)
echo     2. Verifier ce qui est dans le repo GitHub
echo     3. Copier les MP3 manquants vers le repo
echo     4. Deployer sur GitHub Pages + Netlify
echo.
echo   ============================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0DEPLOYER_NOUVEAU_TESTAMENT.ps1"

pause
