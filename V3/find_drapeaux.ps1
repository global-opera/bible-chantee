# Rechercher le dossier drapeaux_et_html

Write-Host "=== RECHERCHE DRAPEAUX ===" -ForegroundColor Cyan
Write-Host ""

# Chercher sur le bureau
$bureau = [Environment]::GetFolderPath("Desktop")
$source = "$bureau\drapeaux_et_html"

Write-Host "Bureau: $bureau" -ForegroundColor Gray
Write-Host "Recherche: $source" -ForegroundColor Gray
Write-Host ""

if (Test-Path $source) {
    Write-Host "✅ Dossier trouvé: $source" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== CONTENU ===" -ForegroundColor Cyan
    Get-ChildItem $source -Recurse | Select-Object FullName, Length
} else {
    Write-Host "❌ Dossier non trouvé: $source" -ForegroundColor Red
    Write-Host ""

    # Recherche alternative
    Write-Host "=== RECHERCHE DANS DESKTOP ===" -ForegroundColor Yellow
    $desktopFiles = Get-ChildItem "$bureau\*" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "*drapeau*" -or $_.Name -like "*flag*" -or $_.Name -like "*html*" }

    if ($desktopFiles) {
        $desktopFiles | Select-Object FullName | Format-Table -AutoSize
    } else {
        Write-Host "  Aucun fichier trouvé" -ForegroundColor Gray
    }

    Write-Host ""
    Write-Host "=== RECHERCHE DANS DOWNLOADS ===" -ForegroundColor Yellow
    $downloads = [Environment]::GetFolderPath("UserProfile") + "\Downloads"
    $downloadFiles = Get-ChildItem "$downloads\*" -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "*drapeau*" -or $_.Name -like "*flag*" -or $_.Name -like "*architecture*" }

    if ($downloadFiles) {
        $downloadFiles | Select-Object FullName | Format-Table -AutoSize
    } else {
        Write-Host "  Aucun fichier trouvé" -ForegroundColor Gray
    }
}
