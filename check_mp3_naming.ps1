# check_mp3_naming.ps1
# Vérifie et liste les MP3 qui nécessitent un renommage (XXX → XX)

param(
    [string]$SourceDir = "G:\Mon Drive\01 BibleChantee\Suno_Output\FR",
    [switch]$Rename = $false  # Passer -Rename pour effectuer le renommage
)

$issues = @()
$stats = @{
    Total = 0
    NeedRename = 0
    Renamed = 0
    Errors = 0
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICATION NOMMAGE MP3 - VERSION FR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $SourceDir)) {
    Write-Host "[ERROR] Dossier introuvable: $SourceDir" -ForegroundColor Red
    exit 1
}

# Parcourir tous les dossiers de livres
$bookDirs = Get-ChildItem -Path $SourceDir -Directory | Where-Object { $_.Name -match '^\d+_[A-Z]+$' }

foreach ($bookDir in $bookDirs) {
    # Trouver tous les MP3
    $mp3Files = Get-ChildItem -Path $bookDir.FullName -Filter "*.mp3"

    foreach ($mp3 in $mp3Files) {
        $stats.Total++

        # Pattern: XX_CODE_XXX.mp3 où XXX devrait être XX
        if ($mp3.Name -match '^(\d+)_([A-Z]+)_(\d{3,})(_.*)?\.mp3$') {
            $bookNum = $matches[1]
            $bookCode = $matches[2]
            $chapterNum = $matches[3]
            $suffix = if ($matches[4]) { $matches[4] } else { "" }

            # Convertir XXX en XX (enlever zéros leading sauf si c'est déjà à 2 chiffres)
            $chapterInt = [int]$chapterNum
            $newChapterNum = $chapterInt.ToString("00")

            # Vérifier si renommage nécessaire
            if ($chapterNum -ne $newChapterNum) {
                $stats.NeedRename++

                $newName = "${bookNum}_${bookCode}_${newChapterNum}${suffix}.mp3"
                $newPath = Join-Path $bookDir.FullName $newName

                $issue = [PSCustomObject]@{
                    Book = $bookDir.Name
                    OldName = $mp3.Name
                    NewName = $newName
                    OldPath = $mp3.FullName
                    NewPath = $newPath
                }

                $issues += $issue

                Write-Host "[RENAME] $($bookDir.Name)/" -NoNewline -ForegroundColor Yellow
                Write-Host "$($mp3.Name) " -NoNewline -ForegroundColor White
                Write-Host "→ " -NoNewline -ForegroundColor Yellow
                Write-Host "$newName" -ForegroundColor Green

                # Effectuer le renommage si demandé
                if ($Rename) {
                    try {
                        if (Test-Path $newPath) {
                            Write-Host "  [SKIP] Le fichier de destination existe déjà" -ForegroundColor Red
                            $stats.Errors++
                        } else {
                            Rename-Item -Path $mp3.FullName -NewName $newName -ErrorAction Stop
                            Write-Host "  [OK] Renommé" -ForegroundColor Green
                            $stats.Renamed++
                        }
                    } catch {
                        Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
                        $stats.Errors++
                    }
                }
            }
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STATISTIQUES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total MP3:           $($stats.Total)" -ForegroundColor White
Write-Host "À renommer:          $($stats.NeedRename)" -ForegroundColor Yellow

if ($Rename) {
    Write-Host "Renommés:            $($stats.Renamed)" -ForegroundColor Green
    Write-Host "Erreurs:             $($stats.Errors)" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Cyan

if ($stats.NeedRename -gt 0 -and -not $Rename) {
    Write-Host ""
    Write-Host "Pour effectuer le renommage, exécutez:" -ForegroundColor Yellow
    Write-Host "  .\check_mp3_naming.ps1 -Rename" -ForegroundColor White
}

# Exporter la liste des fichiers à uploader
if ($Rename -and $stats.Renamed -gt 0) {
    Write-Host ""
    Write-Host "Fichiers renommés et prêts pour upload R2" -ForegroundColor Green
}
