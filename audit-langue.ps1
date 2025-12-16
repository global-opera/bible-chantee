# audit-langue.ps1
# Audit complet de l'architecture langue Bible Chantee
# Usage: .\audit-langue.ps1

$RepoPath = "C:\ScriptBible\bible-chantee"

Write-Host "`n" -NoNewline
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "  AUDIT ARCHITECTURE LANGUE - BIBLE CHANTEE" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

# Liste des fichiers a auditer
$SecondaryPages = @(
    "lecteur.html",
    "about.html", 
    "mentions-legales.html",
    "crowdfunding.html",
    "coming-soon.html",
    "credits-depliant.html",
    "youtube-coming-soon.html"
)

$Results = @()

# Fonction d'audit d'un fichier
function Audit-HtmlFile {
    param([string]$FilePath, [string]$FileName)
    
    if (-not (Test-Path $FilePath)) {
        return @{
            File = $FileName
            Exists = $false
            HasLangBar = "N/A"
            HasLangShared = "N/A"
            HasChangeLanguage = "N/A"
            Status = "MANQUANT"
        }
    }
    
    $Content = Get-Content $FilePath -Raw -Encoding UTF8
    
    # Verifications
    $HasLangBar = $Content -match 'class="lang-bar"' -or $Content -match "class='lang-bar'"
    $HasLangBtnHtml = $Content -match '<button[^>]*class="lang-btn"' -or $Content -match "data-lang="
    $HasLangShared = $Content -match 'src="lang-shared\.js"' -or $Content -match "src='lang-shared.js'"
    $HasChangeLanguage = $Content -match 'function changeLanguage' -or $Content -match 'function setLanguage'
    $HasLangBarCSS = $Content -match '\.lang-bar\s*\{' -or $Content -match '\.lang-btn\s*\{'
    
    # Determiner le statut
    $Issues = @()
    if ($HasLangBar -or $HasLangBtnHtml) { $Issues += "lang-bar HTML" }
    if ($HasLangBarCSS) { $Issues += "lang-bar CSS" }
    if ($HasChangeLanguage) { $Issues += "changeLanguage()" }
    if (-not $HasLangShared) { $Issues += "MANQUE lang-shared.js" }
    
    $Status = if ($Issues.Count -eq 0) { "OK" } else { "ERREUR" }
    
    return @{
        File = $FileName
        Exists = $true
        HasLangBar = $HasLangBar -or $HasLangBtnHtml -or $HasLangBarCSS
        HasLangShared = $HasLangShared
        HasChangeLanguage = $HasChangeLanguage
        Issues = ($Issues -join ", ")
        Status = $Status
    }
}

# Audit index.html (cas special - DOIT avoir le selecteur)
Write-Host "`n[1/2] VERIFICATION INDEX.HTML (doit avoir selecteur)" -ForegroundColor Yellow
Write-Host "-" * 50

$IndexPath = Join-Path $RepoPath "index.html"
if (Test-Path $IndexPath) {
    $IndexContent = Get-Content $IndexPath -Raw -Encoding UTF8
    $HasSelector = $IndexContent -match 'class="lang-bar"' -or $IndexContent -match 'data-lang='
    $UsesSelectedLanguage = $IndexContent -match "selectedLanguage"
    
    if ($HasSelector) {
        Write-Host "  [OK] Selecteur de langue present" -ForegroundColor Green
    } else {
        Write-Host "  [ERREUR] Selecteur de langue MANQUANT!" -ForegroundColor Red
    }
    
    if ($UsesSelectedLanguage) {
        Write-Host "  [OK] Utilise 'selectedLanguage' pour localStorage" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Verifier la cle localStorage" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [ERREUR] index.html introuvable!" -ForegroundColor Red
}

# Audit pages secondaires
Write-Host "`n[2/2] VERIFICATION PAGES SECONDAIRES (sans selecteur)" -ForegroundColor Yellow
Write-Host "-" * 50

foreach ($Page in $SecondaryPages) {
    $FilePath = Join-Path $RepoPath $Page
    $Result = Audit-HtmlFile -FilePath $FilePath -FileName $Page
    $Results += $Result
    
    if ($Result.Status -eq "OK") {
        Write-Host "  [OK] $Page" -ForegroundColor Green
    } elseif ($Result.Status -eq "MANQUANT") {
        Write-Host "  [--] $Page (fichier absent)" -ForegroundColor Gray
    } else {
        Write-Host "  [ERREUR] $Page : $($Result.Issues)" -ForegroundColor Red
    }
}

# Verification lecteur.html - logique paroles
Write-Host "`n[BONUS] VERIFICATION LOGIQUE PAROLES LECTEUR.HTML" -ForegroundColor Yellow
Write-Host "-" * 50

$LecteurPath = Join-Path $RepoPath "lecteur.html"
if (Test-Path $LecteurPath) {
    $LecteurContent = Get-Content $LecteurPath -Raw -Encoding UTF8
    
    # Verifier l'ordre d'initialisation
    $LangInitMatch = [regex]::Match($LecteurContent, 'let currentLanguage\s*=')
    $UpdateLyricsMatch = [regex]::Match($LecteurContent, 'function updateLyrics')
    
    if ($LangInitMatch.Success -and $UpdateLyricsMatch.Success) {
        if ($LangInitMatch.Index -lt $UpdateLyricsMatch.Index) {
            Write-Host "  [OK] currentLanguage defini AVANT updateLyrics()" -ForegroundColor Green
        } else {
            Write-Host "  [ERREUR] currentLanguage defini APRES updateLyrics()!" -ForegroundColor Red
            Write-Host "         Position currentLanguage: $($LangInitMatch.Index)" -ForegroundColor Gray
            Write-Host "         Position updateLyrics: $($UpdateLyricsMatch.Index)" -ForegroundColor Gray
        }
    }
    
    # Verifier la condition PT dans updateLyrics
    if ($LecteurContent -match "currentLanguage === 'PT'.*chapterLyricsPT") {
        Write-Host "  [OK] Condition PT pour paroles presente" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Verifier condition PT dans updateLyrics()" -ForegroundColor Yellow
    }
    
    # Verifier chargement lyrics-data-pt.js
    if ($LecteurContent -match 'src="lyrics-data-pt\.js"') {
        Write-Host "  [OK] lyrics-data-pt.js charge" -ForegroundColor Green
    } else {
        Write-Host "  [ERREUR] lyrics-data-pt.js NON charge!" -ForegroundColor Red
    }
    
    # Verifier chargement audio-urls-pt.js
    if ($LecteurContent -match 'src="audio-urls-pt\.js"') {
        Write-Host "  [OK] audio-urls-pt.js charge" -ForegroundColor Green
    } else {
        Write-Host "  [ERREUR] audio-urls-pt.js NON charge!" -ForegroundColor Red
    }
}

# Verification lang-shared.js existe
Write-Host "`n[FICHIER CLE] VERIFICATION LANG-SHARED.JS" -ForegroundColor Yellow
Write-Host "-" * 50

$LangSharedPath = Join-Path $RepoPath "lang-shared.js"
if (Test-Path $LangSharedPath) {
    $LangSharedContent = Get-Content $LangSharedPath -Raw -Encoding UTF8
    Write-Host "  [OK] lang-shared.js existe" -ForegroundColor Green
    
    if ($LangSharedContent -match "window\.currentLanguage") {
        Write-Host "  [OK] Definit window.currentLanguage" -ForegroundColor Green
    } else {
        Write-Host "  [ERREUR] Ne definit pas window.currentLanguage!" -ForegroundColor Red
    }
    
    if ($LangSharedContent -match "selectedLanguage") {
        Write-Host "  [OK] Utilise cle 'selectedLanguage'" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Verifier la cle localStorage" -ForegroundColor Yellow
    }
} else {
    Write-Host "  [ERREUR] lang-shared.js INTROUVABLE!" -ForegroundColor Red
    Write-Host "         Ce fichier est OBLIGATOIRE pour l'architecture" -ForegroundColor Red
}

# Resume
Write-Host "`n" -NoNewline
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host "  RESUME" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan

$OkCount = ($Results | Where-Object { $_.Status -eq "OK" }).Count
$ErrorCount = ($Results | Where-Object { $_.Status -eq "ERREUR" }).Count
$MissingCount = ($Results | Where-Object { $_.Status -eq "MANQUANT" }).Count

Write-Host ""
Write-Host "  Pages conformes:    $OkCount / $($SecondaryPages.Count)" -ForegroundColor $(if ($OkCount -eq $SecondaryPages.Count) { "Green" } else { "Yellow" })
Write-Host "  Pages en erreur:    $ErrorCount" -ForegroundColor $(if ($ErrorCount -eq 0) { "Green" } else { "Red" })
Write-Host "  Pages manquantes:   $MissingCount" -ForegroundColor Gray
Write-Host ""

if ($ErrorCount -gt 0) {
    Write-Host "  ACTIONS REQUISES:" -ForegroundColor Red
    foreach ($R in ($Results | Where-Object { $_.Status -eq "ERREUR" })) {
        Write-Host "    - $($R.File): $($R.Issues)" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""
