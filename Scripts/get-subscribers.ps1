# ============================================
# Script pour récupérer les inscrits Netlify Forms
# et exporter leurs emails en CSV
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Récupération des inscrits - Bible Chantée" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# === ÉTAPE 1: RÉCUPÉRER LES CREDENTIALS ===
Write-Host "[1/4] Vérification des credentials Netlify..." -ForegroundColor Yellow

# Essayer de récupérer depuis les variables d'environnement
$token = $env:NETLIFY_ACCESS_TOKEN
$siteId = $env:NETLIFY_SITE_ID

# Si non trouvées, demander à l'utilisateur
if (-not $token) {
    Write-Host "❌ NETLIFY_ACCESS_TOKEN non trouvé dans les variables d'environnement" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour obtenir un token:" -ForegroundColor White
    Write-Host "1. Aller sur: https://app.netlify.com/user/applications#personal-access-tokens" -ForegroundColor Gray
    Write-Host "2. Créer un 'Personal access token'" -ForegroundColor Gray
    Write-Host "3. Copier le token généré" -ForegroundColor Gray
    Write-Host ""
    $token = Read-Host "Entrez votre NETLIFY_ACCESS_TOKEN"

    if (-not $token) {
        Write-Host "❌ Token requis. Abandon." -ForegroundColor Red
        exit 1
    }
}

if (-not $siteId) {
    Write-Host "❌ NETLIFY_SITE_ID non trouvé dans les variables d'environnement" -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour obtenir le Site ID:" -ForegroundColor White
    Write-Host "1. Aller sur: https://app.netlify.com" -ForegroundColor Gray
    Write-Host "2. Sélectionner le site 'bible-chantee'" -ForegroundColor Gray
    Write-Host "3. Site settings > General > Site information > Site ID" -ForegroundColor Gray
    Write-Host ""
    $siteId = Read-Host "Entrez votre NETLIFY_SITE_ID"

    if (-not $siteId) {
        Write-Host "❌ Site ID requis. Abandon." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Credentials trouvés!" -ForegroundColor Green
Write-Host ""

# === ÉTAPE 2: RÉCUPÉRER LES FORMULAIRES ===
Write-Host "[2/4] Récupération des formulaires Netlify..." -ForegroundColor Yellow

try {
    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }

    $formsUrl = "https://api.netlify.com/api/v1/sites/$siteId/forms"
    $forms = Invoke-RestMethod -Uri $formsUrl -Headers $headers -Method Get

    Write-Host "✅ $($forms.Count) formulaire(s) trouvé(s):" -ForegroundColor Green
    $forms | ForEach-Object {
        Write-Host "   - $($_.name): $($_.submission_count) soumission(s)" -ForegroundColor Gray
    }
    Write-Host ""

} catch {
    Write-Host "❌ Erreur lors de la récupération des formulaires:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# === ÉTAPE 3: RÉCUPÉRER LES SOUMISSIONS DU FORMULAIRE "subscribe" ===
Write-Host "[3/4] Récupération des inscriptions..." -ForegroundColor Yellow

$subscribeForm = $forms | Where-Object { $_.name -eq "subscribe" }

if (-not $subscribeForm) {
    Write-Host "❌ Formulaire 'subscribe' non trouvé!" -ForegroundColor Red
    exit 1
}

$formId = $subscribeForm.id
Write-Host "   Formulaire ID: $formId" -ForegroundColor Gray

try {
    # Récupérer TOUTES les soumissions avec pagination
    $allSubmissions = @()
    $page = 1
    $perPage = 100

    do {
        $submissionsUrl = "https://api.netlify.com/api/v1/forms/$formId/submissions?per_page=$perPage&page=$page"
        $submissions = Invoke-RestMethod -Uri $submissionsUrl -Headers $headers -Method Get

        $allSubmissions += $submissions

        Write-Host "   Page $page : $($submissions.Count) inscription(s)" -ForegroundColor Gray

        # Si moins de 100 résultats, c'est la dernière page
        if ($submissions.Count -lt $perPage) {
            break
        }

        $page++
    } while ($true)

    Write-Host "✅ Total: $($allSubmissions.Count) inscription(s) récupérées!" -ForegroundColor Green
    Write-Host ""

} catch {
    Write-Host "❌ Erreur lors de la récupération des inscriptions:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# === ÉTAPE 4: EXPORTER EN CSV ===
Write-Host "[4/4] Export des données..." -ForegroundColor Yellow

# Préparer les données pour l'export
$exportData = $allSubmissions | ForEach-Object {
    [PSCustomObject]@{
        Email = $_.data.email
        Language = $_.data.language
        Date = $_.created_at
        ID = $_.id
    }
}

# Trier par email unique
$uniqueEmails = $exportData | Sort-Object Email -Unique

# Exporter en CSV
$csvPath = ".\inscrits_biblechantee.csv"
$uniqueEmails | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8

Write-Host "✅ Exporté: $csvPath" -ForegroundColor Green
Write-Host "   $($uniqueEmails.Count) email(s) unique(s)" -ForegroundColor Gray
Write-Host ""

# Afficher un aperçu
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  APERÇU DES INSCRIPTIONS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
$uniqueEmails | Select-Object -First 10 | Format-Table -AutoSize

if ($uniqueEmails.Count -gt 10) {
    Write-Host "... et $($uniqueEmails.Count - 10) de plus" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ TERMINÉ!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Fichier CSV: $csvPath" -ForegroundColor White
Write-Host "Total inscrits: $($uniqueEmails.Count)" -ForegroundColor White
Write-Host ""
