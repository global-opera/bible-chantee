# Vérifier format des titres dans lyrics

Write-Host "=== RECHERCHE LYRICS ET TITRES ===" -ForegroundColor Cyan
Write-Host ""

# 1. Chercher les lyrics (probablement dans le dossier parent ou sur Google Drive)
$possiblePaths = @(
    "lyrics\FR\01_GEN\01_GEN_04_FR.txt",
    "..\lyrics\FR\01_GEN\01_GEN_04_FR.txt",
    "C:\ScriptBible\bible-chantee\lyrics\FR\01_GEN\01_GEN_04_FR.txt",
    "G:\Mon Drive\01 BibleChantee\Lyrics\FR\FR_V2\01_GEN\01_GEN_04_FR.txt"
)

$foundLyrics = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $foundLyrics = $path
        Write-Host "✅ Lyrics trouvés: $path" -ForegroundColor Green
        Write-Host ""
        Write-Host "=== CONTENU GENÈSE 4 (10 premières lignes) ===" -ForegroundColor Cyan
        Get-Content $path -Head 10
        break
    }
}

if (-not $foundLyrics) {
    Write-Host "❌ Lyrics non trouvés dans les emplacements standards" -ForegroundColor Red
    Write-Host ""
    Write-Host "Recherche dans le projet..." -ForegroundColor Yellow
    $found = Get-ChildItem "C:\ScriptBible\bible-chantee" -Recurse -Filter "*GEN*04*FR*.txt" -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if ($found) {
        Write-Host "✅ Trouvé: $($found.FullName)" -ForegroundColor Green
        Get-Content $found.FullName -Head 10
    }
}

# 2. Chercher fichiers avec titres
Write-Host ""
Write-Host "=== FICHIERS TITLES/CHAPTER-NAMES ===" -ForegroundColor Cyan
$titleFiles = Get-ChildItem "." -Recurse -Filter "*title*" -ErrorAction SilentlyContinue
$chapterFiles = Get-ChildItem "." -Recurse -Filter "*chapter*name*" -ErrorAction SilentlyContinue

if ($titleFiles) {
    $titleFiles | Select-Object FullName | Format-Table -AutoSize
} else {
    Write-Host "Aucun fichier *title* trouvé" -ForegroundColor Gray
}

if ($chapterFiles) {
    $chapterFiles | Select-Object FullName | Format-Table -AutoSize
} else {
    Write-Host "Aucun fichier *chapter*name* trouvé" -ForegroundColor Gray
}

# 3. Vérifier books.js
Write-Host ""
Write-Host "=== BOOKS.JS (structure) ===" -ForegroundColor Cyan
if (Test-Path "js\books.js") {
    Get-Content "js\books.js" -Head 40
} else {
    Write-Host "❌ js\books.js non trouvé" -ForegroundColor Red
}
