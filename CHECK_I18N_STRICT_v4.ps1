$ErrorActionPreference = "Stop"

Write-Host "=== CHECK I18N STRICT v4 (PROD ONLY) ===" -ForegroundColor Cyan

$prod = @(
  "index.html","demo.html","lecteur.html","premium.html","promesses.html","promesse-detail.html",
  "about.html","contact.html","pricing.html","signup.html","success.html","thank-you.html",
  "mentions-legales.html","nouveautes.html","recover-premium.html","bible.html"
)

$mustHave = @() # No single file is mandatory (accept multiple i18n modes)
$optional = @("lang-shared.js","i18n.js","translations.js","translations-extra.js")

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

  # 4) Init ok rule: Accept THREE valid modes
  # Mode A: lang-shared.js (auto-init)
  # Mode B: i18n.js + translations.js (manual init)
  # Mode C: Inline translations (standalone pages like lecteur.html)
  $hasLangShared = ($c -match "lang-shared\.js")
  $hasManualI18n = (($c -match "i18n\.js") -and ($c -match "translations\.js"))

  if ($hasLangShared) {
    Write-Host "[OK] init ok (via lang-shared auto-init)"
  } elseif ($hasManualI18n) {
    Write-Host "[OK] init ok (via i18n.js + translations.js)"
  } elseif ($hasInlineTranslations) {
    Write-Host "[OK] init ok (via inline translations)"
  } else {
    $anyRed = $true
    Write-Host "[FAIL] init missing (no i18n system detected)" -ForegroundColor Red
  }
}

if ($anyRed) { exit 1 } else { exit 0 }
