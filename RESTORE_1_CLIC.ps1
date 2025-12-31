#!/usr/bin/env pwsh
# RESTORE_1_CLIC.ps1
# Restaure bible-chantee depuis un snapshot en 1 clic

param(
    [Parameter(Mandatory=$false)]
    [string]$SnapshotName = ""
)

Write-Host "`n=== RESTAURATION 1 CLIC ===" -ForegroundColor Red

# Si pas de snapshot spécifié, afficher la liste et demander
if ($SnapshotName -eq "") {
    Write-Host "`nSnapshots disponibles:" -ForegroundColor Cyan
    $snapshots = Get-ChildItem "C:\ScriptBible\SNAPSHOT_*" -Directory | Sort-Object Name -Descending

    if ($snapshots.Count -eq 0) {
        Write-Host "❌ Aucun snapshot trouvé!" -ForegroundColor Red
        exit 1
    }

    for ($i = 0; $i -lt $snapshots.Count; $i++) {
        $snap = $snapshots[$i]
        $date = $snap.CreationTime.ToString("yyyy-MM-dd HH:mm:ss")
        Write-Host "  [$i] $($snap.Name) - $date" -ForegroundColor Yellow
    }

    Write-Host ""
    $choice = Read-Host "Choisir un snapshot (0-$($snapshots.Count-1)) ou ENTRER pour le plus récent"

    if ($choice -eq "") {
        $SnapshotName = $snapshots[0].Name
    } else {
        $index = [int]$choice
        if ($index -ge 0 -and $index -lt $snapshots.Count) {
            $SnapshotName = $snapshots[$index].Name
        } else {
            Write-Host "❌ Choix invalide!" -ForegroundColor Red
            exit 1
        }
    }
}

$snapshotPath = "C:\ScriptBible\$SnapshotName"
$targetPath = "C:\ScriptBible\bible-chantee"

# Vérifier que le snapshot existe
if (-not (Test-Path $snapshotPath)) {
    Write-Host "❌ Snapshot non trouvé: $snapshotPath" -ForegroundColor Red
    exit 1
}

Write-Host "`nSnapshot sélectionné: $SnapshotName" -ForegroundColor Green
Write-Host "Destination: $targetPath" -ForegroundColor Gray

# Demander confirmation
Write-Host "`n⚠️  ATTENTION: Cela va ÉCRASER le contenu actuel de bible-chantee!" -ForegroundColor Yellow
$confirm = Read-Host "Continuer? (oui/non)"

if ($confirm -ne "oui") {
    Write-Host "❌ Annulé par l'utilisateur" -ForegroundColor Red
    exit 0
}

# Créer backup du contenu actuel (léger, sans audio)
Write-Host "`nCréation backup du contenu actuel..." -ForegroundColor Yellow
$backupName = "BACKUP_BEFORE_RESTORE_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
$backupPath = "C:\ScriptBible\$backupName"

try {
    robocopy $targetPath $backupPath /E /XD "node_modules" ".git" "SNAPSHOT_*" "BACKUP_*" /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
    Write-Host "✅ Backup créé: $backupPath" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backup échoué (continuons quand même): $_" -ForegroundColor Yellow
}

# Restaurer depuis le snapshot avec robocopy /MIR
Write-Host "`nRestauration depuis le snapshot..." -ForegroundColor Yellow

try {
    # Utiliser robocopy /MIR pour synchroniser (plus fiable que Remove-Item + Copy)
    # /MIR = miroir complet, /XD .git = exclure .git, /R:1 /W:1 = retry rapide
    $result = robocopy $snapshotPath $targetPath /MIR /XD ".git" /R:1 /W:1 /NFL /NDL /NJH /NJS
    
    if ($LASTEXITCODE -le 7) {
        Write-Host "✅ Fichiers restaurés!" -ForegroundColor Green
    } else {
        throw "Robocopy failed with code $LASTEXITCODE"
    }
} catch {
    Write-Host "❌ ERREUR lors de la restauration: $_" -ForegroundColor Red
    Write-Host "Le backup est disponible ici: $backupPath" -ForegroundColor Yellow
    exit 1
}

# Git commit et push
Write-Host "`nGit commit et push..." -ForegroundColor Yellow
Set-Location $targetPath

try {
    git add .
    git commit -m "RESTORE from $SnapshotName"
    git push origin prod --force

    Write-Host "✅ Git push terminé!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Git push échoué: $_" -ForegroundColor Yellow
    Write-Host "Tu peux le faire manuellement: git add . && git commit -m 'RESTORE' && git push origin prod --force" -ForegroundColor Gray
}

Write-Host "`n✅ RESTAURATION TERMINÉE!" -ForegroundColor Green
Write-Host "Backup disponible: $backupPath" -ForegroundColor Cyan
