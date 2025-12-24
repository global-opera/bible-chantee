# ============================================
# Script pour appeler la Netlify Function et générer le CSV
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Téléchargement des inscrits via API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$apiUrl = "https://biblechantee.com/.netlify/functions/export-subscribers"

Write-Host "[1/3] Appel de l'API Netlify Function..." -ForegroundColor Yellow
Write-Host "   URL: $apiUrl" -ForegroundColor Gray
Write-Host ""

try {
    # Appeler la fonction Netlify
    $response = Invoke-RestMethod -Uri $apiUrl -Method Get -ContentType "application/json"

    if ($response.success) {
        Write-Host "✅ Données récupérées avec succès!" -ForegroundColor Green
        Write-Host "   Total: $($response.total) inscrit(s)" -ForegroundColor Gray
        Write-Host "   Soumissions totales: $($response.totalSubmissions)" -ForegroundColor Gray
        Write-Host ""

        # Afficher les statistiques par langue
        Write-Host "📊 Statistiques par langue:" -ForegroundColor Cyan
        $response.summary.byLanguage.PSObject.Properties | ForEach-Object {
            Write-Host "   $($_.Name): $($_.Value)" -ForegroundColor Gray
        }
        Write-Host ""

        # === Exporter en CSV ===
        Write-Host "[2/3] Export en CSV..." -ForegroundColor Yellow

        $csvData = $response.subscribers | ForEach-Object {
            [PSCustomObject]@{
                Email = $_.email
                Language = $_.language
                Date = $_.created_at
                ID = $_.id
            }
        }

        $csvPath = ".\inscrits_biblechantee.csv"
        $csvData | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8

        Write-Host "✅ CSV généré: $csvPath" -ForegroundColor Green
        Write-Host ""

        # === Exporter aussi en JSON pour le script Node.js ===
        $jsonPath = ".\inscrits_biblechantee.json"
        $response | ConvertTo-Json -Depth 10 | Out-File -FilePath $jsonPath -Encoding UTF8

        Write-Host "✅ JSON généré: $jsonPath" -ForegroundColor Green
        Write-Host ""

        # === Afficher un aperçu ===
        Write-Host "[3/3] Aperçu des données:" -ForegroundColor Yellow
        Write-Host ""
        $csvData | Select-Object -First 10 | Format-Table -AutoSize

        if ($csvData.Count -gt 10) {
            Write-Host "... et $($csvData.Count - 10) de plus" -ForegroundColor Gray
        }

        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ TERMINÉ!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Fichiers générés:" -ForegroundColor White
        Write-Host "  - $csvPath ($($csvData.Count) lignes)" -ForegroundColor Gray
        Write-Host "  - $jsonPath" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Prochaine étape:" -ForegroundColor Yellow
        Write-Host "  node Scripts/grant-credits.js" -ForegroundColor White
        Write-Host ""

    } else {
        Write-Host "❌ Erreur dans la réponse API" -ForegroundColor Red
        Write-Host $response | ConvertTo-Json -Depth 10
    }

} catch {
    Write-Host ""
    Write-Host "❌ Erreur lors de l'appel API:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""

    if ($_.Exception.Message -like "*404*" -or $_.Exception.Message -like "*Not Found*") {
        Write-Host "⏳ La fonction Netlify n'est peut-être pas encore déployée." -ForegroundColor Yellow
        Write-Host "   Attendez 1-2 minutes et réessayez." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   Ou vérifiez le déploiement sur:" -ForegroundColor Yellow
        Write-Host "   https://app.netlify.com/sites/bible-chantee/deploys" -ForegroundColor Gray
    }

    Write-Host ""
    exit 1
}
