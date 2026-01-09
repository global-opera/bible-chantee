#!/usr/bin/env pwsh
# Script pour normaliser tous les titres dans chapter-titles.js
# Applique la logique cleanTitle() : trim + suppression guillemets externes

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$CHAPTER_TITLES_FILE = "C:\ScriptBible\bible-chantee\js\chapter-titles.js"

Write-Host "Normalisation des titres dans chapter-titles.js..." -ForegroundColor Cyan

# Fonction cleanTitle équivalente au JS
function Clean-Title {
    param([string]$s)

    if ([string]::IsNullOrEmpty($s)) { return "" }

    # Trim
    $s = $s.Trim()

    # Suppression guillemets externes (", ", ', « »)
    $s = $s -replace '^[\s""''«]+', ''
    $s = $s -replace '[\s""''»]+$', ''

    return $s.Trim()
}

# Lire le fichier
$content = Get-Content $CHAPTER_TITLES_FILE -Raw -Encoding UTF8

# Pattern pour capturer les entrées de titre
# Ex: "1": "Le titre ici",
$pattern = '("(\d+)"\s*:\s*)"([^"]*)"(\s*,?)'

# Compteur
$count = 0

# Remplacer en appliquant cleanTitle()
$newContent = [regex]::Replace($content, $pattern, {
    param($match)

    $key = $match.Groups[1].Value          # "1":
    $chapterNum = $match.Groups[2].Value   # 1
    $oldTitle = $match.Groups[3].Value     # Le titre original
    $comma = $match.Groups[4].Value        # , ou ""

    # Appliquer cleanTitle
    $cleanedTitle = Clean-Title $oldTitle

    # Compter si modification
    if ($cleanedTitle -ne $oldTitle) {
        $script:count++
        Write-Host "  [$chapterNum] '$oldTitle' → '$cleanedTitle'" -ForegroundColor Yellow
    }

    # Reconstruire
    return "$key`"$cleanedTitle`"$comma"
})

if ($count -gt 0) {
    # Sauvegarder
    $newContent | Set-Content $CHAPTER_TITLES_FILE -NoNewline -Encoding UTF8
    Write-Host "`n[OK] $count titres normalisés et fichier sauvegardé" -ForegroundColor Green
} else {
    Write-Host "[INFO] Aucune modification nécessaire (déjà normalisé)" -ForegroundColor Green
}
