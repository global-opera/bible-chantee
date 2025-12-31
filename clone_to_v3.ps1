# Script pour cloner les pages fonctionnelles vers V3

Write-Host "`n=== CLONAGE PAGES VERS V3 ===" -ForegroundColor Yellow

# 1. Créer le dossier V3/js s'il n'existe pas
if (-not (Test-Path "V3\js")) {
    New-Item -ItemType Directory -Path "V3\js" -Force | Out-Null
    Write-Host "✅ Dossier V3/js créé" -ForegroundColor Green
}

# 2. Copier les scripts JS nécessaires
Write-Host "`n=== COPIE SCRIPTS JS ===" -ForegroundColor Cyan
$scripts = @("translations.js", "translations-extra.js", "i18n.js", "lang-shared.js")
foreach ($script in $scripts) {
    if (Test-Path "js\$script") {
        Copy-Item "js\$script" "V3\js\$script" -Force
        Write-Host "  ✅ $script copié vers V3/js/" -ForegroundColor Green
    } elseif (Test-Path $script) {
        Copy-Item $script "V3\js\$script" -Force
        Write-Host "  ✅ $script copié vers V3/js/ (depuis racine)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ $script non trouvé" -ForegroundColor Yellow
    }
}

# 3. Copier les pages HTML
Write-Host "`n=== COPIE PAGES HTML ===" -ForegroundColor Cyan
$pages = @("confessions.html", "about.html", "promesses.html")
foreach ($page in $pages) {
    if (Test-Path $page) {
        Copy-Item $page "V3\$page" -Force
        Write-Host "  ✅ $page copié" -ForegroundColor Green
    }
}

# 4. Adapter les chemins dans toutes les pages V3
Write-Host "`n=== ADAPTATION CHEMINS ===" -ForegroundColor Cyan
$htmlFiles = Get-ChildItem "V3\*.html"
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $content

    # Remplacements de chemins
    $content = $content -replace 'src="/js/', 'src="js/'
    $content = $content -replace 'src="/translations', 'src="js/translations'
    $content = $content -replace 'src="/i18n', 'src="js/i18n'
    $content = $content -replace 'src="/lang', 'src="js/lang'
    $content = $content -replace 'href="/css/', 'href="css/'
    $content = $content -replace 'href="/lecteur', 'href="lecteur'

    if ($content -ne $original) {
        Set-Content $file.FullName $content -Encoding UTF8
        Write-Host "  ✅ $($file.Name) - chemins adaptés" -ForegroundColor Green
    } else {
        Write-Host "  ⏭️ $($file.Name) - aucun changement" -ForegroundColor Gray
    }
}

# 5. Résumé final
Write-Host "`n=== RÉSUMÉ V3 ===" -ForegroundColor Yellow
Write-Host "Pages HTML:" -ForegroundColor Cyan
Get-ChildItem "V3\*.html" | Select-Object Name | Format-Table -AutoSize

Write-Host "Scripts JS:" -ForegroundColor Cyan
if (Test-Path "V3\js") {
    Get-ChildItem "V3\js\*.js" -ErrorAction SilentlyContinue | Select-Object Name | Format-Table -AutoSize
} else {
    Write-Host "  Aucun script JS trouvé" -ForegroundColor Gray
}

Write-Host "`n✅ Clonage terminé!" -ForegroundColor Green
