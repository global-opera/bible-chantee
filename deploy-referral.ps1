# Script de déploiement système parrainage
# Usage: .\deploy-referral.ps1

Set-Location "C:\ScriptBible\bible-chantee"

Write-Host "=== DÉPLOIEMENT SYSTÈME PARRAINAGE ===" -ForegroundColor Cyan

# Vérifier que les fichiers existent avant d'ajouter
$files = @(
    "package.json",
    "netlify.toml",
    "netlify/functions/bc_signup.js",
    "netlify/functions/bc_me.js",
    "lecteur.html",
    "signup.html",
    "SUPABASE_CONSTRAINTS_FIXED.sql",
    "FINAL_SECURITY_FIXES.md",
    "SECURITY_FIXES.md",
    "TEST_REFERRAL.md",
    ".gitignore"
)

$missing = @()
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "[OK] $file" -ForegroundColor Green
        git add $file
    } else {
        Write-Host "[MANQUANT] $file" -ForegroundColor Yellow
        $missing += $file
    }
}

if ($missing.Count -gt 0) {
    Write-Host "`n⚠️  Fichiers manquants: $($missing -join ', ')" -ForegroundColor Yellow
    $continue = Read-Host "Continuer quand même? (o/n)"
    if ($continue -ne 'o') {
        exit
    }
}

Write-Host "`n=== GIT STATUS ===" -ForegroundColor Cyan
git status

Write-Host "`n=== COMMIT ===" -ForegroundColor Cyan
git commit -m "Referral system: secure signup + first-ref-wins + DB constraints"

Write-Host "`n=== PUSH ===" -ForegroundColor Cyan
git push

Write-Host "`n✅ Déploiement terminé!" -ForegroundColor Green
Write-Host "Attends 30-60s que Netlify build, puis teste:" -ForegroundColor Cyan
Write-Host "https://biblechantee.com/.netlify/functions/bc_me?uid=test123"
