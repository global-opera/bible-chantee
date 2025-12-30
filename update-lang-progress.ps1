#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Met à jour la progression d'une langue dans lang-config.json

.DESCRIPTION
    Script pour mettre à jour facilement le nombre de chapitres générés pour une langue.
    Calcule automatiquement le pourcentage et le statut.

.PARAMETER LangCode
    Code de la langue (FR, EN, PT, ES, DE, IT, TL, AR, RU, ZH, HI, SW)

.PARAMETER Chapters
    Nombre de chapitres générés (0-1189)

.EXAMPLE
    .\update-lang-progress.ps1 -LangCode TL -Chapters 100
    Met à jour Tagalog à 100 chapitres

.EXAMPLE
    .\update-lang-progress.ps1 TL 1189
    Marque Tagalog comme complet (1189/1189)
#>

param(
    [Parameter(Mandatory=$true, Position=0)]
    [ValidateSet('FR','EN','PT','ES','DE','IT','TL','AR','RU','ZH','HI','SW')]
    [string]$LangCode,

    [Parameter(Mandatory=$true, Position=1)]
    [ValidateRange(0, 1189)]
    [int]$Chapters
)

$configPath = "js/lang-config.json"

# Vérifier que le fichier existe
if (-not (Test-Path $configPath)) {
    Write-Error "❌ Fichier $configPath non trouvé!"
    exit 1
}

# Charger la config
$config = Get-Content $configPath -Raw | ConvertFrom-Json

# Mettre à jour la langue
if ($config.languages.$LangCode) {
    $oldChapters = $config.languages.$LangCode.chapters
    $config.languages.$LangCode.chapters = $Chapters

    # Déterminer le statut
    if ($Chapters -eq 1189) {
        $config.languages.$LangCode.status = "complete"
    } elseif ($Chapters -gt 0) {
        $config.languages.$LangCode.status = "generating"
    } else {
        $config.languages.$LangCode.status = "planned"
    }

    # Mettre à jour la date
    $config.lastUpdated = Get-Date -Format "yyyy-MM-dd"

    # Recalculer les stats
    $completeList = @($config.languages.PSObject.Properties | Where-Object { $_.Value.status -eq "complete" })
    $generatingList = @($config.languages.PSObject.Properties | Where-Object { $_.Value.status -eq "generating" })
    $plannedList = @($config.languages.PSObject.Properties | Where-Object { $_.Value.status -eq "planned" })

    $complete = $completeList.Count
    $generating = $generatingList.Count
    $planned = $plannedList.Count
    $totalLangs = $config.languages.PSObject.Properties.Count

    $config.stats.complete = $complete
    $config.stats.generating = $generating
    $config.stats.planned = $planned
    $config.stats.totalLanguages = $totalLangs
    $config.stats.completionPercentage = [math]::Round(([double]$complete / [double]$totalLangs) * 100, 1)

    # Sauvegarder
    $config | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8

    # Afficher le résultat
    $langName = $config.languages.$LangCode.name
    $progress = [math]::Round(($Chapters / 1189) * 100, 1)
    $status = $config.languages.$LangCode.status

    Write-Host "`n=== MISE À JOUR ===" -ForegroundColor Cyan
    Write-Host "Langue: $LangCode ($langName)" -ForegroundColor Yellow
    Write-Host "Chapitres: $oldChapters → $Chapters" -ForegroundColor Green
    Write-Host "Progression: $progress%" -ForegroundColor Green
    Write-Host "Statut: $status" -ForegroundColor $(if ($status -eq "complete") { "Green" } elseif ($status -eq "generating") { "Yellow" } else { "Gray" })
    Write-Host "`n=== STATS GLOBALES ===" -ForegroundColor Cyan
    Write-Host "Complètes: $complete langues" -ForegroundColor Green
    Write-Host "En cours: $generating langues" -ForegroundColor Yellow
    Write-Host "Planifiées: $planned langues" -ForegroundColor Gray
    Write-Host "Progression totale: $($config.stats.completionPercentage)%" -ForegroundColor Cyan
    Write-Host "`n✅ Config mise à jour: $configPath" -ForegroundColor Green

} else {
    Write-Error "❌ Langue '$LangCode' non trouvée dans la config!"
    exit 1
}
