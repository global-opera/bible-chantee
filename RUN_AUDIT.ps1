cd "C:\ScriptBible\bible-chantee"

Write-Host "=== RUN AUDIT ===" -ForegroundColor Cyan

# 1) I18N prod structure
.\CHECK_I18N_STRICT_v4.ps1
if ($LASTEXITCODE -ne 0) { throw "CHECK_I18N_STRICT_v4 failed" }

# 2) Keys exist (base+extra)
node .\CHECK_KEYS_NODE.js
if ($LASTEXITCODE -ne 0) { throw "CHECK_KEYS_NODE failed" }

# 3) No FR/fr fallback in PROD pages
$prod = @(
  "index.html","demo.html","lecteur.html","premium.html","promesses.html","promesse-detail.html",
  "about.html","contact.html","pricing.html","signup.html","success.html","thank-you.html",
  "mentions-legales.html","nouveautes.html","recover-premium.html","bible.html","aide.html"
)

$bad = @()
foreach ($p in $prod) {
  if (!(Test-Path $p)) { continue }
  $c = Get-Content $p -Raw
  if ($c -match "\|\|\s*'FR'|\|\|\s*'fr'|sungbible_lang|getCurrentLanguage|setCurrentLanguage") {
    $bad += $p
  }
}

if ($bad.Count -gt 0) {
  Write-Host "❌ Forbidden patterns found in:" -ForegroundColor Red
  $bad | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
}

Write-Host "✅ AUDIT OK" -ForegroundColor Green
exit 0
