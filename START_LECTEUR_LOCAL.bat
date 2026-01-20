@echo off
title Bible Chantee - Serveur Local
color 0B

echo ========================================================================
echo   BIBLE CHANTEE - SERVEUR LOCAL
echo ========================================================================
echo.
echo Demarrage du serveur sur http://localhost:8888
echo.
echo Le navigateur va s'ouvrir automatiquement...
echo.
echo Pour arreter : fermez cette fenetre ou appuyez sur Ctrl+C
echo ========================================================================
echo.

cd /d "%~dp0"
start http://localhost:8888/lecteur.html
python server.py

pause
