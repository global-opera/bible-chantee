# Script PowerShell pour uploader les prieres FR sur R2
$sourceFolder = "C:\Users\Stephane CASSANI\Desktop\Prieres\Generated\mp3 prieres"
$bucket = "bible-chantee-audio"
$destPrefix = "prayers/FR"

$files = @{
    "FR_Notre Pere.mp3" = "01_Notre_Pere.mp3"
    "FR_D'Abord Je Te Cherche_v1.mp3" = "02_DAbord_Je_Te_Cherche.mp3"
    "FR_Priere de delivrance.mp3" = "03_Priere_de_Delivrance.mp3"
    "FR_Reconnaissance_v1.mp3" = "04_Reconnaissance.mp3"
    "FR_Tu Es Ma Protection_v1.mp3" = "05_Tu_Es_Ma_Protection.mp3"
}

Write-Host "=== UPLOAD DES PRIERES FR VERS R2 ===" -ForegroundColor Cyan

foreach ($source in $files.Keys) {
    $dest = $files[$source]
    $sourcePath = Join-Path $sourceFolder $source
    $destPath = "$destPrefix/$dest"

    if (Test-Path $sourcePath) {
        Write-Host "Uploading: $source -> $destPath" -ForegroundColor Green
        rclone copy "$sourcePath" "r2:$bucket/$destPrefix/" --s3-upload-cutoff=200M --progress
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Upload OK: $dest" -ForegroundColor Green
        } else {
            Write-Host "  Erreur: $dest" -ForegroundColor Red
        }
    } else {
        Write-Host "Fichier introuvable: $source" -ForegroundColor Red
    }
}

Write-Host "Termine!" -ForegroundColor Green
