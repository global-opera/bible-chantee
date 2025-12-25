$ErrorActionPreference = "Stop"

$pages = Get-ChildItem -Filter "*.html" | Select-Object -ExpandProperty Name
$mustHave = @("translations.js","translations-extra.js","i18n.js","lang-shared.js")
$initPats = @("applyTranslations","BibleI18n\.init","initLanguage","getTranslation\(")

$anyRed = $false

Write-Host "=== CHECK I18N STRICT v2 ===" -ForegroundColor Cyan

foreach ($p in $pages) {
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

  $hasInit = $false
  foreach ($pat in $initPats) { if ($c -match $pat) { $hasInit = $true; break } }
  if ($hasInit) { Write-Host "✅ init ok" } else { $anyRed = $true; Write-Host "❌ init missing" -ForegroundColor Red }
}

if ($anyRed) { exit 1 } else { exit 0 }
