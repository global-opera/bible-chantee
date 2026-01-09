#!/usr/bin/env pwsh
# Script pour nettoyer TOUS les "Verse X" dans CHAPTER_TITLES.EN
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$CHAPTER_TITLES_FILE = "C:\ScriptBible\bible-chantee\js\chapter-titles.js"

Write-Host "Nettoyage des titres 'Verse X' dans la section EN..." -ForegroundColor Cyan

# Lire le fichier
$content = Get-Content $CHAPTER_TITLES_FILE -Raw

# Pattern pour détecter les lignes EN avec "Verse X" (toutes variantes)
# Capture le numéro de chapitre et la valeur complète
$pattern = '("(\d+)"\s*:\s*)"(\(?\[?[Vv]erse\s*\d+[:\.]?\s*\]?\)?)"'

# Trouver toutes les correspondances pour compter
$matches = [regex]::Matches($content, $pattern)
$count = $matches.Count

if ($count -gt 0) {
    Write-Host "Trouvé $count titres 'Verse X' à nettoyer..." -ForegroundColor Yellow

    # Remplacer toutes les occurrences par chaîne vide
    $newContent = $content -replace $pattern, '$1""'

    # Sauvegarder
    $newContent | Set-Content $CHAPTER_TITLES_FILE -NoNewline -Encoding UTF8
    Write-Host "[OK] $count titres 'Verse X' supprimés et fichier sauvegardé" -ForegroundColor Green
} else {
    Write-Host "[INFO] Aucun 'Verse X' trouvé (déjà propre)" -ForegroundColor Yellow
}
