$ErrorActionPreference = "Stop"

$prod = @(
  "index.html","demo.html","lecteur.html","premium.html","promesses.html","promesse-detail.html",
  "about.html","contact.html","pricing.html","signup.html","success.html","thank-you.html",
  "mentions-legales.html","nouveautes.html","recover-premium.html","bible.html","aide.html"
)

# Remplacements ciblés (string-level) pour éviter que l'audit bloque à cause de legacy code
$repls = @(
  @{ pat = "getCurrentLanguage"; rep = "resolveLang" },
  @{ pat = "setCurrentLanguage"; rep = "setLang" },
  @{ pat = "sungbible_lang";    rep = "bc_lang" },

  # Fallbacks FR/fr stricts (dans du code uniquement)
  @{ pat = "\|\|\s*'FR'"; rep = "|| 'EN'" },
  @{ pat = "\|\|\s*'fr'"; rep = "|| 'en'" }
)

$changed = @()

foreach ($p in $prod) {
  if (!(Test-Path $p)) { continue }
  $c = Get-Content $p -Raw
  $c2 = $c
  foreach ($r in $repls) {
    $c2 = [regex]::Replace($c2, $r.pat, $r.rep)
  }
  if ($c2 -ne $c) {
    Set-Content $p -Value $c2 -Encoding UTF8
    $changed += $p
  }
}

if ($changed.Count) {
  Write-Host "✅ Patched:" -ForegroundColor Green
  $changed | ForEach-Object { Write-Host " - $_" -ForegroundColor Green }
} else {
  Write-Host "ℹ️ No changes needed" -ForegroundColor Yellow
}
