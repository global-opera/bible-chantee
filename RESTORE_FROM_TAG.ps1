param(
  [string]$Tag = "stable-i18n-2025-12-25",
  [switch]$Hard
)

$ErrorActionPreference = "Stop"

function Fail($msg) { throw $msg }

Write-Host "=== RESTORE FROM TAG ===" -ForegroundColor Cyan
Write-Host "Repo : $PWD" -ForegroundColor Yellow
Write-Host "Tag  : $Tag" -ForegroundColor Yellow

git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) { Fail "Not a git repository. Run from C:\ScriptBible\bible-chantee" }

# Snapshot sécurité
$ts = Get-Date -Format "yyyyMMdd_HHmmss"
$bk = "C:\ScriptBible\bible-chantee__PRE_RESTORE_$ts"
New-Item -ItemType Directory -Path $bk -Force | Out-Null
Copy-Item -Path (Join-Path $PWD "*") -Destination $bk -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Snapshot local: $bk" -ForegroundColor Green

git fetch --tags *> $null

if ($Hard) {
  git reset --hard *> $null
  git clean -fdx *> $null
} else {
  git checkout -- . *> $null
}

git checkout $Tag *> $null
if ($LASTEXITCODE -ne 0) { Fail "Tag not found: $Tag" }

if (Test-Path ".\RUN_AUDIT.ps1") {
  .\RUN_AUDIT.ps1
  if ($LASTEXITCODE -ne 0) { Fail "AUDIT FAILED after restore" }
  Write-Host "✅ AUDIT OK after restore" -ForegroundColor Green
}

Write-Host "✅ RESTORE DONE (tag)" -ForegroundColor Green
