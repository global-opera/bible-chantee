$ErrorActionPreference = "Stop"

$repo = (Get-Location).Path
$ts = Get-Date -Format "yyyyMMdd_HHmmss"
$relDir = Join-Path $repo ("_audit\releases\release_{0}" -f $ts)
New-Item -ItemType Directory -Force $relDir | Out-Null

Write-Host "=== RELEASE BACKUP ===" -ForegroundColor Cyan
Write-Host "Release dir: $relDir"

Write-Host "`n--- 1) run audit ---" -ForegroundColor Yellow
& ".\_audit\audit_prod.ps1"
if ($LASTEXITCODE -ne 0) { throw "Audit failed, aborting release backup." }

Write-Host "`n--- 2) git status must be clean or committed ---" -ForegroundColor Yellow
git status --porcelain
$dirty = (git status --porcelain)
if ($dirty) { throw "Working tree not clean. Commit before release backup." }

Write-Host "`n--- 3) create git tag ---" -ForegroundColor Yellow
$tag = "release-$ts"
git tag $tag
git show -s --oneline $tag

Write-Host "`n--- 4) zip repo (excluding node_modules, .git) ---" -ForegroundColor Yellow
$zip = Join-Path $relDir "repo.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }

$exclude = @(".git","node_modules","_audit\releases")
$files = Get-ChildItem -Recurse -File | Where-Object {
  $p = $_.FullName.Substring($repo.Length+1)
  foreach ($e in $exclude) { if ($p -like "$e*") { return $false } }
  return $true
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipFs = [System.IO.Compression.ZipFile]::Open($zip, "Create")
foreach ($f in $files) {
  $rel = $f.FullName.Substring($repo.Length+1)
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipFs, $f.FullName, $rel) | Out-Null
}
$zipFs.Dispose()
Write-Host "✅ repo.zip created: $zip"

Write-Host "`n--- 5) create SHA256 manifest ---" -ForegroundColor Yellow
$man = Join-Path $relDir "manifest_sha256.txt"
$hashes = $files | ForEach-Object {
  $rel = $_.FullName.Substring($repo.Length+1)
  $h = (Get-FileHash $_.FullName -Algorithm SHA256).Hash
  "{0}  {1}" -f $h, $rel
}
$hashes | Set-Content $man -Encoding UTF8
Write-Host "✅ manifest_sha256.txt: $man"

Write-Host "`n--- 6) copy latest audit logs ---" -ForegroundColor Yellow
$rep = Join-Path $repo "_audit\reports"
if (Test-Path $rep) {
  Copy-Item -Path (Join-Path $rep "*") -Destination (Join-Path $relDir "reports") -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "`n✅ RELEASE DONE"
Write-Host "Tag: $tag"
Write-Host "Folder: $relDir" -ForegroundColor Green
