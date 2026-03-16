$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

function Test-Url($url) {
  try {
    $r = Invoke-WebRequest -Uri $url -Method Head -MaximumRedirection 5 -TimeoutSec 15 -ErrorAction Stop
    return [PSCustomObject]@{ Url=$url; Status=$r.StatusCode; Note="HEAD OK" }
  } catch {
    try {
      $r2 = Invoke-WebRequest -Uri $url -Method Get -MaximumRedirection 5 -TimeoutSec 15 -ErrorAction Stop
      return [PSCustomObject]@{ Url=$url; Status=$r2.StatusCode; Note="GET OK" }
    } catch {
      $code = $null
      if ($_.Exception.Response -and $_.Exception.Response.StatusCode) { $code = [int]$_.Exception.Response.StatusCode }
      if (-not $code) { $code = "ERR" }
      return [PSCustomObject]@{ Url=$url; Status=$code; Note=$_.Exception.Message }
    }
  }
}

Write-Host "=== 1) Dossiers publication ===" -ForegroundColor Yellow
@("dist","build","public",".next","out") | ForEach-Object {
  if (Test-Path $_) { Write-Host "   FOUND: $_" -ForegroundColor Green }
  else { Write-Host "   missing: $_" -ForegroundColor DarkGray }
}

Write-Host "`n=== 2) Dossiers Bible ===" -ForegroundColor Yellow
@("public\bible","public\data\bible","bible","data\bible","V3\bible","assets\bible","src\bible") | ForEach-Object {
  if (Test-Path $_) { Write-Host "   FOUND: $_" -ForegroundColor Green }
  else { Write-Host "   missing: $_" -ForegroundColor DarkGray }
}

Write-Host "`n=== 3) Contenu V3\bible ===" -ForegroundColor Yellow
if (Test-Path "V3\bible") {
  $files = Get-ChildItem "V3\bible" -Filter "*.json" -File
  Write-Host "   $($files.Count) fichiers JSON"
  $files | Select-Object -First 8 | ForEach-Object { Write-Host "   - $($_.Name) ($($_.Length) bytes)" }
} else {
  Write-Host "   V3\bible introuvable" -ForegroundColor Red
}

Write-Host "`n=== 4) Git status ===" -ForegroundColor Yellow
git status -sb 2>&1 | Select-Object -First 10

Write-Host "`n=== 5) Tests URL prod ===" -ForegroundColor Yellow
$base = "https://biblechantee.com"
$urls = @(
  "$base/V3/bible/fr_bible_segond1910.json",
  "$base/bible/fr/genese/01.json",
  "$base/data/bible/fr/genese/01.json",
  "$base/robots.txt",
  "$base/favicon.ico",
  "$base/js/player.js"
)
foreach ($u in $urls) {
  $res = Test-Url $u
  $color = if ($res.Status -eq 200) { "Green" } else { "Red" }
  Write-Host "   [$($res.Status)] $($res.Url)" -ForegroundColor $color
}

Write-Host "`n=== FIN ===" -ForegroundColor Cyan
