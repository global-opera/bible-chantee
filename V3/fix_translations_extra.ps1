# Fix translations-extra.js references

Write-Host "=== CORRECTION CHEMINS ===" -ForegroundColor Cyan

# Fix about.html
$aboutContent = Get-Content "about.html" -Raw -Encoding UTF8
$aboutContent = $aboutContent -replace 'src="translations-extra.js"', 'src="js/translations-extra.js"'
Set-Content "about.html" $aboutContent -Encoding UTF8
Write-Host "✅ about.html - chemin corrigé" -ForegroundColor Green

# Create empty translations-extra.js stub if it doesn't exist
if (-not (Test-Path "js\translations-extra.js")) {
    $stub = @"
// translations-extra.js - Extra translations stub
// Add extra translations here if needed

console.log('[translations-extra] Loaded');
"@
    Set-Content "js\translations-extra.js" $stub -Encoding UTF8
    Write-Host "✅ translations-extra.js stub créé" -ForegroundColor Green
}

# Verify
Write-Host "`n=== VÉRIFICATION ===" -ForegroundColor Cyan
Write-Host "Fichiers utilisant translations-extra:" -ForegroundColor Yellow
Select-String -Path "*.html" -Pattern "translations-extra" |
    ForEach-Object { Write-Host "  $($_.Filename): $($_.Line.Trim())" }

Write-Host "`nFichier translations-extra.js:" -ForegroundColor Yellow
if (Test-Path "js\translations-extra.js") {
    Get-Item "js\translations-extra.js" | Select-Object Name, Length | Format-Table
} else {
    Write-Host "  ❌ Manquant" -ForegroundColor Red
}
