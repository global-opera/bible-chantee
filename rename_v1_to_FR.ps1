# rename_v1_to_FR.ps1
# Renomme tous les fichiers *_v1.mp3 en *_FR.mp3 dans le dossier FR

param(
    [string]$SourceDir = "G:\Mon Drive\01 BibleChantee\Suno_Output\FR",
    [switch]$DryRun = $false,
    [switch]$AutoConfirm = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RENOMMAGE _v1 -> _FR DANS FR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "[MODE TEST] Aucun fichier ne sera renomme" -ForegroundColor Yellow
    Write-Host ""
}

# Trouver tous les MP3 avec _v1
$v1Files = Get-ChildItem -Path $SourceDir -Recurse -Filter "*_v1.mp3"

Write-Host "Fichiers _v1.mp3 trouves: $($v1Files.Count)" -ForegroundColor Cyan
Write-Host ""

if ($v1Files.Count -eq 0) {
    Write-Host "[INFO] Aucun fichier _v1.mp3 trouve!" -ForegroundColor Yellow
    exit 0
}

# Confirmation si pas DryRun
if (-not $DryRun -and -not $AutoConfirm) {
    Write-Host "ATTENTION: Cette operation va renommer $($v1Files.Count) fichiers" -ForegroundColor Red
    Write-Host "  Pattern: XX_CODE_XX_v1.mp3 -> XX_CODE_XX_FR.mp3" -ForegroundColor Yellow
    Write-Host ""
    $confirm = Read-Host "Continuer? (oui/non)"

    if ($confirm -ne "oui") {
        Write-Host "Operation annulee" -ForegroundColor Yellow
        exit 0
    }
    Write-Host ""
} elseif (-not $DryRun -and $AutoConfirm) {
    Write-Host "AUTO-CONFIRM: Renommage de $($v1Files.Count) fichiers..." -ForegroundColor Yellow
    Write-Host ""
}

# Renommer
$count = 0
$errors = 0

foreach ($file in $v1Files) {
    $newName = $file.Name -replace '_v1\.mp3$', '_FR.mp3'
    $newPath = Join-Path $file.DirectoryName $newName

    if ($DryRun) {
        Write-Host "[DRY] $($file.Name) -> $newName" -ForegroundColor Gray
    } else {
        try {
            Rename-Item -Path $file.FullName -NewName $newName -ErrorAction Stop
            $count++
            if ($count % 100 -eq 0) {
                Write-Host "[OK] $count fichiers renommes..." -ForegroundColor Green
            }
        } catch {
            Write-Host "[ERROR] Echec: $($file.Name) - $_" -ForegroundColor Red
            $errors++
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($DryRun) {
    Write-Host "TEST: $($v1Files.Count) fichiers seraient renommes" -ForegroundColor Yellow
} else {
    Write-Host "SUCCES: $count fichiers renommes" -ForegroundColor Green
    if ($errors -gt 0) {
        Write-Host "ERREURS: $errors fichiers en echec" -ForegroundColor Red
    }
}
Write-Host "========================================" -ForegroundColor Cyan
