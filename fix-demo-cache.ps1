# Fix cache demo.html - PT 405 → 1189
# Usage: .\fix-demo-cache.ps1

Set-Location "C:\ScriptBible\bible-chantee"

Write-Host "=== FIX CACHE DEMO.HTML ===" -ForegroundColor Cyan
Write-Host "Problème: PT affiche 405 au lieu de 1189 (cache Netlify)`n"

# Vérifier que demo.html existe
if (!(Test-Path "demo.html")) {
    Write-Host "❌ demo.html introuvable" -ForegroundColor Red
    exit
}

Write-Host "✅ Cache-bust appliqué (lignes 9-11: ?v=20251221)" -ForegroundColor Green

# Git add + commit + push
Write-Host "`n=== GIT COMMIT ===" -ForegroundColor Cyan
git add demo.html
git commit -m "Cache-bust demo.html: fix PT progress display (405 → 1189)"

Write-Host "`n=== GIT PUSH ===" -ForegroundColor Cyan
git push

Write-Host "`n✅ Déploiement terminé!" -ForegroundColor Green
Write-Host "`nDans Netlify Dashboard:" -ForegroundColor Cyan
Write-Host "1. Attends que le build termine (30-60s)"
Write-Host "2. Si PT affiche toujours 405:"
Write-Host "   → Netlify → Deploys → Trigger deploy → Clear cache and deploy site"
Write-Host "`nOu teste en navigation privée: https://sungbible.world"
