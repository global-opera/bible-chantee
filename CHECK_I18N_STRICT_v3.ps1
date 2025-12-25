$ErrorActionPreference = "Stop"

Write-Host "=== CHECK I18N STRICT v3 (PROD ONLY) ===" -ForegroundColor Cyan

$prod = @(
  "index.html","demo.html","lecteur.html","premium.html","promesses.html","promesse-detail.html",
  "about.html","contact.html","pricing.html","signup.html","success.html","thank-you.html",
  "mentions-legales.html","nouveautes.html","recover-premium.html","bible.html","aide.html"
)

$mustHave = @("translations.js","translations-extra.js","lang-shared.js")
# i18n.js est optionnel (certaines pages ont leur propre moteur i18n)
$optional = @("i18n.js")

# “init” acceptable si on voit au moins un de ces marqueurs
$initPats = @(
  "initLanguage\(",
  "window\.setLanguage\s*=",
  "BC_LANG\.",
  "languageChanged",
  "applyTranslations",
  "BibleI18n\.init",
  "i18nInstance",
  "data-i18n"
)

$anyRed = $false

foreach ($p in $prod) {
  if (!(Test-Path $p)) { continue }

  $c = Get-Content $p -Raw
  Write-Host "`n--- $p ---" -ForegroundColor Yellow

  foreach ($s in $mustHave) {
    if ($c -match [regex]::Escape($s)) {
      Write-Host "✅ $s"
    } else {
      $anyRed = $true
      Write-Host "❌ missing $s" -ForegroundColor Red
    }
  }

  foreach ($s in $optional) {
    if ($c -match [regex]::Escape($s)) { Write-Host "ℹ️ has $s" } else { Write-Host "ℹ️ no $s (ok)" }
  }

  $hasInit = $false
  foreach ($pat in $initPats) { if ($c -match $pat) { $hasInit = $true; break } }

  if ($hasInit) { Write-Host "✅ init ok" } else { $anyRed = $true; Write-Host "❌ init missing" -ForegroundColor Red }
}

if ($anyRed) { exit 1 } else { exit 0 }
