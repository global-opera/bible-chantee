# ============================================
# Script principal pour récupérer TOUTES les statistiques
# ============================================

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  📊 RÉCUPÉRATION STATS - BIBLE CHANTÉE  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ============================================
# PARTIE 1: INSCRITS NETLIFY FORMS
# ============================================

Write-Host "┌────────────────────────────────────────┐" -ForegroundColor Yellow
Write-Host "│  1️⃣  INSCRITS NETLIFY FORMS            │" -ForegroundColor Yellow
Write-Host "└────────────────────────────────────────┘" -ForegroundColor Yellow
Write-Host ""

& "$PSScriptRoot\download-subscribers.ps1"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erreur lors de la récupération des inscrits Netlify" -ForegroundColor Red
    Write-Host "Continuer quand même ? (O/N)" -ForegroundColor Yellow
    $continue = Read-Host
    if ($continue -ne "O" -and $continue -ne "o") {
        exit 1
    }
}

Write-Host ""
Write-Host "Appuyez sur Entrée pour continuer..." -ForegroundColor Gray
Read-Host
Write-Host ""

# ============================================
# PARTIE 2: STATISTIQUES SUPABASE
# ============================================

Write-Host "┌────────────────────────────────────────┐" -ForegroundColor Yellow
Write-Host "│  2️⃣  STATISTIQUES SUPABASE             │" -ForegroundColor Yellow
Write-Host "└────────────────────────────────────────┘" -ForegroundColor Yellow
Write-Host ""

# Vérifier si les credentials Supabase sont configurés
if (-not $env:SUPABASE_URL -or -not $env:SUPABASE_SERVICE_KEY) {
    Write-Host "⚠️  Variables Supabase non configurées" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pour récupérer les stats Supabase, définir:" -ForegroundColor White
    Write-Host "  `$env:SUPABASE_URL = `"https://VOTRE_PROJET.supabase.co`"" -ForegroundColor Gray
    Write-Host "  `$env:SUPABASE_SERVICE_KEY = `"VOTRE_KEY`"" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Voulez-vous les configurer maintenant ? (O/N)" -ForegroundColor Yellow
    $config = Read-Host

    if ($config -eq "O" -or $config -eq "o") {
        Write-Host ""
        $env:SUPABASE_URL = Read-Host "SUPABASE_URL"
        $env:SUPABASE_SERVICE_KEY = Read-Host "SUPABASE_SERVICE_KEY (ou ANON_KEY)"
        Write-Host ""
    } else {
        Write-Host "⏭️  Stats Supabase ignorées" -ForegroundColor Gray
        Write-Host ""
        exit 0
    }
}

# Exécuter le script Node.js
node "$PSScriptRoot\get-supabase-stats.js"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erreur lors de la récupération des stats Supabase" -ForegroundColor Red
}

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# ============================================
# RÉSUMÉ FINAL
# ============================================

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         ✅ RÉCAPITULATIF FINAL          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📁 Fichiers générés:" -ForegroundColor Cyan
Write-Host ""

$files = @(
    @{ Path = "inscrits_biblechantee.csv"; Description = "Inscrits Netlify Forms (CSV)" },
    @{ Path = "inscrits_biblechantee.json"; Description = "Inscrits Netlify Forms (JSON)" },
    @{ Path = "liste_premium.json"; Description = "Utilisateurs premium Supabase" },
    @{ Path = "liste_100credits.json"; Description = "Utilisateurs 100+ crédits" },
    @{ Path = "liste_early_adopters.json"; Description = "Early adopters" },
    @{ Path = "stats_supabase.json"; Description = "Statistiques complètes Supabase" },
    @{ Path = "utilisateurs_supabase.csv"; Description = "Tous les utilisateurs (CSV)" }
)

foreach ($file in $files) {
    $fullPath = Join-Path (Get-Location) $file.Path
    if (Test-Path $fullPath) {
        $size = (Get-Item $fullPath).Length
        $sizeKB = [math]::Round($size / 1024, 1)
        Write-Host "  ✅ $($file.Description)" -ForegroundColor Green
        Write-Host "     $fullPath ($sizeKB KB)" -ForegroundColor Gray
    } else {
        Write-Host "  ⏭️  $($file.Description)" -ForegroundColor Gray
        Write-Host "     Non généré" -ForegroundColor DarkGray
    }
    Write-Host ""
}

Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Toutes les statistiques ont été récupérées!" -ForegroundColor Green
Write-Host ""
