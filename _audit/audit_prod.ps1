$ErrorActionPreference = "Stop"

Write-Host "=== AUDIT PROD (Bible Chantée) ===" -ForegroundColor Cyan
$repo = (Get-Location).Path

$prod = @(
  "index.html","demo.html","lecteur.html","premium.html","promesses.html","promesse-detail.html",
  "about.html","contact.html","pricing.html","signup.html","success.html","thank-you.html",
  "mentions-legales.html","nouveautes.html","recover-premium.html","bible.html","aide.html"
)

$reportDir = Join-Path $repo "_audit\reports"
$ts = Get-Date -Format "yyyyMMdd_HHmmss"

$log = Join-Path $reportDir ("audit_prod_{0}.log" -f $ts)
Start-Transcript -Path $log | Out-Null

$anyRed = $false

Write-Host "`n--- 1) PROD pages exist ---" -ForegroundColor Yellow
foreach ($p in $prod) {
  if (!(Test-Path $p)) { $anyRed=$true; Write-Host "❌ missing file: $p" -ForegroundColor Red }
  else { Write-Host "✅ $p" }
}

Write-Host "`n--- 2) lang-shared.js is present in each PROD page ---" -ForegroundColor Yellow
foreach ($p in $prod) {
  if (!(Test-Path $p)) { continue }
  $c = Get-Content $p -Raw
  if ($c -match "lang-shared\.js") { Write-Host "✅ $p" }
  else { $anyRed=$true; Write-Host "❌ no lang-shared.js in $p" -ForegroundColor Red }
}

Write-Host "`n--- 3) i18n strict v4 ---" -ForegroundColor Yellow
if (Test-Path ".\CHECK_I18N_STRICT_v4.ps1") {
  & ".\CHECK_I18N_STRICT_v4.ps1"
  if ($LASTEXITCODE -ne 0) { $anyRed = $true; Write-Host "❌ CHECK_I18N_STRICT_v4 failed" -ForegroundColor Red }
  else { Write-Host "✅ CHECK_I18N_STRICT_v4 OK" }
} else {
  $anyRed = $true
  Write-Host "❌ missing CHECK_I18N_STRICT_v4.ps1" -ForegroundColor Red
}

Write-Host "`n--- 4) i18n keys (HTML data-i18n* must exist in all langs) ---" -ForegroundColor Yellow
if (Test-Path ".\CHECK_KEYS_NODE.js") {
  node ".\CHECK_KEYS_NODE.js"
  if ($LASTEXITCODE -ne 0) { $anyRed = $true; Write-Host "❌ CHECK_KEYS_NODE failed" -ForegroundColor Red }
  else { Write-Host "✅ CHECK_KEYS_NODE OK" }
} else {
  $anyRed = $true
  Write-Host "❌ missing CHECK_KEYS_NODE.js" -ForegroundColor Red
}

Write-Host "`n--- 5) forbidden leftovers (FR/fr hard defaults, sungbible_* legacy) ---" -ForegroundColor Yellow
$forbidden = @(
  "\|\|\s*'FR'","\|\|\s*'fr'",
  "localStorage\.getItem\('sungbible_",
  "localStorage\.setItem\('sungbible_",
  "sungbible_lang",
  "BC_LANG'\)",
  "getCurrentLanguage\(",
  "setCurrentLanguage\("
)

foreach ($pat in $forbidden) {
  $hits = Select-String -Path $prod -Pattern $pat -ErrorAction SilentlyContinue
  if ($hits) {
    $anyRed = $true
    Write-Host "❌ forbidden pattern found: $pat" -ForegroundColor Red
    $hits | ForEach-Object { Write-Host ("   {0}:{1}:{2}" -f $_.Path,$_.LineNumber,$_.Line.Trim()) -ForegroundColor Red }
  } else {
    Write-Host "✅ no hits: $pat"
  }
}

Write-Host "`n--- 6) translations-extra.js exists (recommended) ---" -ForegroundColor Yellow
if (Test-Path ".\translations-extra.js") { Write-Host "✅ translations-extra.js present" }
else { Write-Host "⚠️ translations-extra.js missing" -ForegroundColor DarkYellow }

Stop-Transcript | Out-Null

if ($anyRed) { Write-Host "`n❌ AUDIT FAILED: $log" -ForegroundColor Red; exit 1 }
Write-Host "`n✅ AUDIT OK: $log" -ForegroundColor Green
exit 0
