$ErrorActionPreference = "Stop"

Write-Host "=== CHECK I18N STRICT v4 (PROD ONLY) ===" -ForegroundColor Cyan

$prod = @(
  "index.html","demo.html","lecteur.html","premium.html","promesses.html","promesse-detail.html",
  "about.html","contact.html","pricing.html","signup.html","success.html","thank-you.html",
  "mentions-legales.html","nouveautes.html","recover-premium.html","bible.html","aide.html"
)

$mustHave = @("lang-shared.js") # seul vrai obligatoire
$optional = @("i18n.js","translations.js","translations-extra.js")

$anyRed = $false

foreach ($p in $prod) {
  if (!(Test-Path $p)) { continue }

  $c = Get-Content $p -Raw
  Write-Host "`n--- $p ---" -ForegroundColor Yellow

  # 1) Must have
  foreach ($s in $mustHave) {
    if ($c -match [regex]::Escape($s)) { Write-Host "[OK] $s" }
    else { $anyRed = $true; Write-Host "[FAIL] missing $s" -ForegroundColor Red }
  }

  # 2) Optional (info only)
  foreach ($s in $optional) {
    if ($c -match [regex]::Escape($s)) { Write-Host "[INFO] has $s" } else { Write-Host "[INFO] no $s" }
  }

  # 3) Detect inline translations (covers lecteur/premium/etc)
  $hasInlineTranslations = ($c -match "window\.translations\s*=" -or $c -match "const\s+TRANSLATIONS\s*=")

  if ($hasInlineTranslations) {
    Write-Host "[INFO] inline translations detected (OK)" -ForegroundColor DarkCyan
  } else {
    # if not inline, prefer script files (warning only)
    if (($c -notmatch "translations\.js") -or ($c -notmatch "translations-extra\.js")) {
      Write-Host "[WARN] translations.js/extra.js not both present (might be ok)" -ForegroundColor DarkYellow
    }
  }

  # 4) Init ok rule:
  # If lang-shared.js exists -> initLanguage() runs on load => OK
  if ($c -match "lang-shared\.js") {
    Write-Host "[OK] init ok (via lang-shared auto-init)"
  } else {
    $anyRed = $true
    Write-Host "[FAIL] init missing (no lang-shared)" -ForegroundColor Red
  }
}

if ($anyRed) { exit 1 } else { exit 0 }
