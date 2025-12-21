@echo off
chcp 65001 > nul
echo.
echo ========================================
echo   DIAGNOSTIC GA4 - Bible Chantée
echo ========================================
echo.

cd /d "C:\ScriptBible\bible-chantee"

echo Vérification des fichiers nécessaires...
if not exist "service-account-key.json" (
    echo.
    echo ❌ ERREUR: service-account-key.json manquant
    echo.
    echo Veuillez copier le fichier JSON du Service Account:
    echo   Depuis: C:\Users\Stéphane CASSANI\Desktop\peaceful-storm-436014-j9-4993028ee637.json
    echo   Vers:   C:\ScriptBible\bible-chantee\service-account-key.json
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo.
    echo Installation des dépendances npm...
    call npm install
    echo.
)

echo.
echo ========================================
echo   TEST 1: Liste des propriétés GA4
echo ========================================
echo.
echo Ce test va lister toutes les propriétés GA4
echo accessibles par le Service Account.
echo.
pause

node list-ga4-properties.js

echo.
echo.
echo ========================================
echo   TEST 2: Accès à la propriété 517149339
echo ========================================
echo.
echo Ce test va vérifier l'accès à la propriété
echo "Bible Chantée" (ID: 517149339).
echo.
pause

node test-ga4-access.js

echo.
echo.
echo ========================================
echo   TESTS TERMINÉS
echo ========================================
echo.
echo Consultez les résultats ci-dessus pour:
echo 1. Vérifier que le Property ID 517149339 est accessible
echo 2. Identifier les erreurs de permission
echo 3. Corriger la configuration Netlify si nécessaire
echo.
pause
