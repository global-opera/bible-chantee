# Upload des prières PT et TL vers R2
# Usage: .\upload_prayers_to_r2.ps1

Write-Host "=" * 80 -ForegroundColor Cyan
Write-Host "  UPLOAD PRIÈRES PT/TL vers R2" -ForegroundColor Yellow
Write-Host "=" * 80 -ForegroundColor Cyan

# Vérifier rclone
if (-not (Get-Command rclone -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] rclone n'est pas installé" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installez rclone:"
    Write-Host "  winget install Rclone.Rclone"
    Write-Host "ou téléchargez depuis: https://rclone.org/downloads/"
    exit 1
}

# Chemins
$sourceDir = "G:\Mon Drive\01 BibleChantee\Suno_Output\prayers"
$r2Path = "r2-bible-chantee:bible-chantee-audio/prayers"

Write-Host ""
Write-Host "Source: $sourceDir" -ForegroundColor Cyan
Write-Host "Destination: $r2Path" -ForegroundColor Cyan
Write-Host ""

# Vérifier les fichiers à uploader
Write-Host "Fichiers à uploader:" -ForegroundColor Yellow
$files = Get-ChildItem "$sourceDir\*.mp3" | Where-Object {
    $_.Name -like "PT_*" -or $_.Name -like "TL_*"
}

if ($files.Count -eq 0) {
    Write-Host "[ERROR] Aucun fichier PT ou TL trouvé" -ForegroundColor Red
    exit 1
}

foreach ($file in $files) {
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    Write-Host "  - $($file.Name) ($sizeMB MB)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Total: $($files.Count) fichiers" -ForegroundColor Yellow
Write-Host ""

# Confirmation
$confirm = Read-Host "Commencer l'upload? (o/n)"
if ($confirm -ne 'o') {
    Write-Host "Upload annulé" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Upload en cours..." -ForegroundColor Cyan

# Upload avec rclone
rclone copy $sourceDir $r2Path `
    --include "PT_*.mp3" `
    --include "TL_*.mp3" `
    --progress `
    --stats 5s `
    --transfers 4

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=" * 80 -ForegroundColor Green
    Write-Host "  ✅ UPLOAD TERMINÉ!" -ForegroundColor Green
    Write-Host "=" * 80 -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaine étape: Tester les URLs" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Test PT Pai Nosso:"
    Write-Host '  curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/PT_Pai Nosso.mp3"'
    Write-Host ""
    Write-Host "Test TL Ama Namin:"
    Write-Host '  curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/TL_Ama Namin.mp3"'
    Write-Host ""
    Write-Host "Test sur le site:"
    Write-Host "  https://biblechantee.com/prieres.html?lang=PT"
    Write-Host "  https://biblechantee.com/prieres.html?lang=TL"
} else {
    Write-Host ""
    Write-Host "=" * 80 -ForegroundColor Red
    Write-Host "  ❌ ERREUR UPLOAD" -ForegroundColor Red
    Write-Host "=" * 80 -ForegroundColor Red
    Write-Host ""
    Write-Host "Code erreur: $LASTEXITCODE" -ForegroundColor Red
}
