$ErrorActionPreference="Stop"
$files = @("pricing.html","thank-you.html")
$repls = @(
  @{ pat = "getCurrentLanguage"; rep = "resolveLang" },
  @{ pat = "setCurrentLanguage"; rep = "setLang" },
  @{ pat = "sungbible_lang";    rep = "bc_lang" },
  @{ pat = "\|\|\s*'FR'";       rep = "|| 'EN'" },
  @{ pat = "\|\|\s*'fr'";       rep = "|| 'en'" }
)
foreach ($f in $files) {
  if (!(Test-Path $f)) { continue }
  $c  = Get-Content $f -Raw
  $c2 = $c
  foreach ($r in $repls) { $c2 = [regex]::Replace($c2, $r.pat, $r.rep) }
  if ($c2 -ne $c) {
    Set-Content $f -Value $c2 -Encoding UTF8
    Write-Host "✅ patched $f" -ForegroundColor Green
  } else {
    Write-Host "ℹ️ no change $f" -ForegroundColor Yellow
  }
}
