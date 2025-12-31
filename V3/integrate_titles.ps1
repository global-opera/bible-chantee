# Intégrer chapter-titles.js dans lecteur.html

Write-Host "=== INTÉGRATION CHAPTER-TITLES ===" -ForegroundColor Cyan
Write-Host ""

# 1. Lire le contenu actuel
$content = Get-Content "lecteur.html" -Raw -Encoding UTF8

# 2. Ajouter le script chapter-titles.js dans <head> si pas présent
if ($content -notmatch "chapter-titles.js") {
    $content = $content -replace '(</head>)', '    <script src="js/chapter-titles.js"></script>$1'
    Write-Host "✅ chapter-titles.js ajouté dans <head>" -ForegroundColor Green
} else {
    Write-Host "⏭️ chapter-titles.js déjà présent" -ForegroundColor Gray
}

# 3. Sauvegarder
Set-Content "lecteur.html" $content -Encoding UTF8
Write-Host "✅ lecteur.html mis à jour" -ForegroundColor Green

# 4. Chercher où le titre est affiché
Write-Host ""
Write-Host "=== RECHERCHE AFFICHAGE TITRE ===" -ForegroundColor Cyan
$titleLines = Select-String -Path "lecteur.html" -Pattern "chapitre|chapter|title|h1|h2|h3" -CaseSensitive:$false |
    Select-Object -First 15
if ($titleLines) {
    $titleLines | ForEach-Object {
        Write-Host "  Ligne $($_.LineNumber): $($_.Line.Trim().Substring(0, [Math]::Min($_.Line.Trim().Length, 80)))" -ForegroundColor Gray
    }
}

# 5. Vérifier les scripts chargés
Write-Host ""
Write-Host "=== SCRIPTS CHARGÉS ===" -ForegroundColor Cyan
Select-String -Path "lecteur.html" -Pattern '<script src=' | ForEach-Object {
    Write-Host "  $($_.Line.Trim())" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Intégration terminée!" -ForegroundColor Green
Write-Host "🎯 Tester: http://localhost:8787/lecteur.html?lang=FR&book=01_GEN&chapter=1" -ForegroundColor Yellow
