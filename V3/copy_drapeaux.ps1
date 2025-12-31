# Copier drapeaux et test_architecture.html vers V3

$bureau = [Environment]::GetFolderPath("Desktop")
$source = "$bureau\drapeaux_et_html"
$dest = "C:\ScriptBible\bible-chantee\V3"

Write-Host "=== COPIE DRAPEAUX ET NOUVEAU LECTEUR ===" -ForegroundColor Cyan
Write-Host ""

# 1. Copier test_architecture.html -> lecteur.html
if (Test-Path "$source\test_architecture.html") {
    Copy-Item "$source\test_architecture.html" "$dest\lecteur.html" -Force
    Write-Host "✅ test_architecture.html → lecteur.html (27.6 KB)" -ForegroundColor Green
} else {
    Write-Host "❌ test_architecture.html non trouvé" -ForegroundColor Red
}

# 2. Copier tous les drapeaux
if (Test-Path "$source\img\flags") {
    # Créer le dossier de destination
    if (-not (Test-Path "$dest\img\flags")) {
        New-Item -ItemType Directory -Path "$dest\img\flags" -Force | Out-Null
    }

    # Copier tous les PNG
    Copy-Item "$source\img\flags\*.png" "$dest\img\flags\" -Force
    $count = (Get-ChildItem "$dest\img\flags\*.png").Count
    Write-Host "✅ $count drapeaux PNG copiés" -ForegroundColor Green
} else {
    Write-Host "❌ Dossier flags non trouvé" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== VÉRIFICATION ===" -ForegroundColor Cyan

# Vérifier lecteur.html
if (Test-Path "$dest\lecteur.html") {
    $size = (Get-Item "$dest\lecteur.html").Length
    Write-Host "✅ lecteur.html: $([math]::Round($size/1KB, 1)) KB" -ForegroundColor Green
} else {
    Write-Host "❌ lecteur.html manquant" -ForegroundColor Red
}

# Vérifier drapeaux
$flags = Get-ChildItem "$dest\img\flags\*.png" -ErrorAction SilentlyContinue
Write-Host "✅ Drapeaux: $($flags.Count)/12" -ForegroundColor Green
$flags | Select-Object Name | Format-Table -AutoSize

Write-Host ""
Write-Host "🎯 Tester: http://localhost:8787/lecteur.html?lang=FR" -ForegroundColor Yellow
