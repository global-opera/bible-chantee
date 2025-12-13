#!/bin/bash
# Génération automatique des 10 chapitres prioritaires PT
# Usage: bash generate-priority-10.sh

echo "========================================="
echo "GÉNÉRATION PRIORITAIRE - 10 CHAPITRES PT"
echo "========================================="
echo ""

# Counter
TOTAL=10
CURRENT=0
SUCCESS=0
FAILED=0

# Function to generate chapter
generate_chapter() {
    BOOK=$1
    CHAPTER=$2
    NAME=$3

    CURRENT=$((CURRENT + 1))
    echo ""
    echo "[$CURRENT/$TOTAL] $NAME - Chapitre $CHAPTER"
    echo "-----------------------------------"

    python Scripts/suno_api_generator.py --lang PT --book "$BOOK" --chapter "$CHAPTER"

    if [ $? -eq 0 ]; then
        SUCCESS=$((SUCCESS + 1))
        echo "✓ Succès"
    else
        FAILED=$((FAILED + 1))
        echo "✗ Échec"
        read -p "Continuer? (o/n) " response
        if [ "$response" != "o" ] && [ "$response" != "O" ]; then
            echo "Arrêt demandé"
            exit 1
        fi
    fi
}

# 1 Chroniques
generate_chapter "13_1CH" "29" "1 Chroniques"

# Esdras
generate_chapter "15_EZR" "6" "Esdras"

# Esther
generate_chapter "17_EST" "6" "Esther"

# Néhémie
generate_chapter "16_NEH" "5" "Néhémie"
generate_chapter "16_NEH" "10" "Néhémie"

# 2 Chroniques
generate_chapter "14_2CH" "5" "2 Chroniques"
generate_chapter "14_2CH" "16" "2 Chroniques"
generate_chapter "14_2CH" "21" "2 Chroniques"
generate_chapter "14_2CH" "27" "2 Chroniques"
generate_chapter "14_2CH" "33" "2 Chroniques"

# Summary
echo ""
echo "========================================="
echo "RÉSUMÉ"
echo "========================================="
echo "Total: $TOTAL chapitres"
echo "Succès: $SUCCESS"
echo "Échecs: $FAILED"
echo ""

if [ $SUCCESS -eq $TOTAL ]; then
    echo "✓ TOUS LES CHAPITRES GÉNÉRÉS!"
    echo ""
    echo "Prochaines étapes:"
    echo "1. python generate-all-audio-urls.py"
    echo "2. python analyze-missing-chapters.py"
    echo "3. git add audio-urls-pt.js && git commit && git push"
else
    echo "⚠ Génération incomplète"
fi
