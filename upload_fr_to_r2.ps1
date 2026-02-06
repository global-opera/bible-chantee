# upload_fr_to_r2.ps1
# Upload les MP3 de FR vers R2 pour remplacer la version actuelle

param(
    [string]$SourceDir = "G:\Mon Drive\01 BibleChantee\Suno_Output\FR",
    [string]$R2Remote = "r2-bible-chantee:bible-chantee-audio",  # Nom du remote rclone
    [string]$R2Path = "FR",  # Chemin dans le bucket
    [switch]$DryRun = $false  # Test sans upload réel
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "UPLOAD MP3 FR VERS R2" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que rclone est installé
try {
    $rcloneVersion = rclone version 2>&1 | Select-Object -First 1
    Write-Host "[OK] rclone installé: $rcloneVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] rclone n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Write-Host "Installez rclone: https://rclone.org/downloads/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Vérifier le remote R2
Write-Host "Vérification du remote R2..." -ForegroundColor Yellow
$remotes = rclone listremotes 2>&1
if ($remotes -notmatch $R2Remote.Replace(":", "")) {
    Write-Host "[ERROR] Remote '$R2Remote' non configuré" -ForegroundColor Red
    Write-Host ""
    Write-Host "Configurez rclone pour R2:" -ForegroundColor Yellow
    Write-Host "  rclone config" -ForegroundColor White
    Write-Host ""
    Write-Host "Choisissez:" -ForegroundColor Yellow
    Write-Host "  - Type: s3" -ForegroundColor White
    Write-Host "  - Provider: Cloudflare R2" -ForegroundColor White
    Write-Host "  - Account ID: [votre account ID R2]" -ForegroundColor White
    Write-Host "  - Access Key ID: [votre access key]" -ForegroundColor White
    Write-Host "  - Secret Access Key: [votre secret key]" -ForegroundColor White
    exit 1
}

Write-Host "[OK] Remote '$R2Remote' configuré" -ForegroundColor Green
Write-Host ""

# Vérifier le dossier source
if (-not (Test-Path $SourceDir)) {
    Write-Host "[ERROR] Dossier source introuvable: $SourceDir" -ForegroundColor Red
    exit 1
}

Write-Host "Source: $SourceDir" -ForegroundColor White
Write-Host "Destination: $R2Remote/$R2Path" -ForegroundColor White
Write-Host ""

if ($DryRun) {
    Write-Host "[MODE TEST] Aucun fichier ne sera uploadé" -ForegroundColor Yellow
    Write-Host ""
}

# Compter les MP3 à uploader
$mp3Count = 0
$bookDirs = Get-ChildItem -Path $SourceDir -Directory | Where-Object { $_.Name -match '^\d+_[A-Z]+$' }

foreach ($bookDir in $bookDirs) {
    $mp3Files = Get-ChildItem -Path $bookDir.FullName -Filter "*.mp3"
    $mp3Count += $mp3Files.Count
}

Write-Host "Fichiers MP3 trouvés: $mp3Count" -ForegroundColor Cyan
Write-Host ""

if ($mp3Count -eq 0) {
    Write-Host "[WARN] Aucun fichier MP3 trouvé!" -ForegroundColor Yellow
    exit 0
}

# Confirmation
if (-not $DryRun) {
    Write-Host "ATTENTION: Cette opération va:" -ForegroundColor Red
    Write-Host "  - Uploader $mp3Count fichiers MP3 vers R2" -ForegroundColor Yellow
    Write-Host "  - Remplacer les fichiers existants sur R2" -ForegroundColor Yellow
    Write-Host ""
    $confirm = Read-Host "Continuer? (oui/non)"

    if ($confirm -ne "oui") {
        Write-Host "Opération annulée" -ForegroundColor Yellow
        exit 0
    }
    Write-Host ""
}

# Upload avec rclone
Write-Host "Démarrage de l'upload..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$rcloneArgs = @(
    "copy",
    $SourceDir,
    "$R2Remote/$R2Path",
    "--include", "*.mp3",
    "--progress",
    "--transfers", "4",
    "--checkers", "8",
    "--stats", "5s",
    "--verbose"
)

if ($DryRun) {
    $rcloneArgs += "--dry-run"
}

# Exécuter rclone
& rclone @rcloneArgs

$exitCode = $LASTEXITCODE

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($exitCode -eq 0) {
    Write-Host "SUCCÈS: Upload terminé" -ForegroundColor Green

    if (-not $DryRun) {
        Write-Host ""
        Write-Host "Les MP3 FR sont maintenant disponibles sur:" -ForegroundColor White
        Write-Host "  https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/FR/XX_CODE/XX_CODE_XX_FR.mp3" -ForegroundColor Cyan
    }
} else {
    Write-Host "ERREUR: Upload échoué (code: $exitCode)" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Cyan
