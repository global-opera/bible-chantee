Push-Location $PSScriptRoot

Write-Host "=== RUN AUDIT ===" -ForegroundColor Cyan

Write-Host "`n=== CI DEBUG / PREUVE DE VERSION ===" -ForegroundColor Cyan
Write-Host "Date/Heure CI : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')" -ForegroundColor Cyan
Write-Host "GITHUB_SHA     : $env:GITHUB_SHA" -ForegroundColor Cyan

Write-Host "git rev-parse HEAD : " -NoNewline -ForegroundColor Cyan
git rev-parse HEAD

Write-Host "git log -1 : " -NoNewline -ForegroundColor Cyan
git log -1 --oneline --decorate

$extra = Join-Path $PSScriptRoot "translations-extra.js"
Write-Host "translations-extra.js : $(if (Test-Path $extra) {'OUI (PROBLEME !)'} else {'NON (normal)'})" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

# 1) I18N prod structure
.\CHECK_I18N_STRICT_v4.ps1
if ($LASTEXITCODE -ne 0) { throw "CHECK_I18N_STRICT_v4 failed" }

# 2) Keys exist (base+extra)
$check = Join-Path $PSScriptRoot "CHECK_KEYS_NODE.js"
if (!(Test-Path $check)) {
  throw "CHECK_KEYS_NODE.js not found at: $check"
}

Write-Host "PWD=$((Get-Location).Path)" -ForegroundColor Cyan
Write-Host "NODE=$(node -v)" -ForegroundColor Cyan
Write-Host "CHECK=$check" -ForegroundColor Cyan

node $check 2>&1 | Tee-Object -Variable checkLog
if ($LASTEXITCODE -ne 0) {
  Write-Host ($checkLog -join "`n")
  throw "CHECK_KEYS_NODE failed"
}

# 3) No FR/fr fallback in PROD pages
$prod = @(
  "index.html","demo.html","lecteur.html","premium.html","promesses.html","promesse-detail.html",
  "about.html","contact.html","pricing.html","signup.html","success.html","thank-you.html",
  "mentions-legales.html","nouveautes.html","recover-premium.html","bible.html"
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
  Pop-Location
  exit 1
}

Write-Host "✅ AUDIT OK" -ForegroundColor Green
Pop-Location
exit 0
