# Generate-LyricsFiles.ps1
# Génère des fichiers .lyrics.txt nettoyés à partir des .prompt.txt
# Pour toutes les versions : FR, FR_V1, FR_V2

param(
    [string]$BaseDir = "G:\Mon Drive\01 BibleChantee\Suno_Output"
)

# Versions à traiter
$versions = @("FR", "FR_V1", "FR_V2")

# Tags Suno à supprimer
$sunoTags = @(
    '\[Verse\s*\d*\]',
    '\[Chorus\]',
    '\[Bridge\]',
    '\[Pre-Chorus\]',
    '\[Outro\]',
    '\[Intro\]',
    '\[Final Chorus\]',
    '\[Hook\]',
    '\[Post-Chorus\]',
    '\[Verse\]',
    '\[Refrain\]'
)

function Clean-Lyrics {
    param([string]$content)

    # Extraire seulement la section [LYRICS]
    if ($content -match '(?s)\[LYRICS\]\s*(.*?)(?=\[STYLE\]|\[TITLE\]|$)') {
        $lyrics = $matches[1].Trim()
    } else {
        Write-Warning "Pas de section [LYRICS] trouvée"
        return $null
    }

    # Supprimer tous les tags Suno
    foreach ($tag in $sunoTags) {
        $lyrics = $lyrics -replace $tag, ''
    }

    # Supprimer le caractère ¶
    $lyrics = $lyrics -replace '¶', ''

    # Nettoyer les lignes vides multiples
    $lyrics = $lyrics -replace '(?m)^\s*$(\r?\n){2,}', "`r`n`r`n"

    # Traiter ligne par ligne pour mettre une majuscule au début
    $lines = $lyrics -split "`r?`n"
    $cleanedLines = @()

    foreach ($line in $lines) {
        $line = $line.Trim()
        if ($line -ne '') {
            # Mettre une majuscule au début si c'est une lettre
            if ($line -match '^[a-z]') {
                $line = $line.Substring(0,1).ToUpper() + $line.Substring(1)
            }
            $cleanedLines += $line
        } else {
            $cleanedLines += ''
        }
    }

    return ($cleanedLines -join "`r`n").Trim()
}

# Statistiques
$stats = @{
    TotalFiles = 0
    Created = 0
    Skipped = 0
    Errors = 0
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GENERATION DES FICHIERS .lyrics.txt" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

foreach ($version in $versions) {
    $versionPath = Join-Path $BaseDir $version

    if (-not (Test-Path $versionPath)) {
        Write-Host "[SKIP] Version $version n'existe pas" -ForegroundColor Yellow
        continue
    }

    Write-Host "Version: $version" -ForegroundColor Green
    Write-Host "----------------------------------------"

    # Parcourir tous les dossiers de livres
    $bookDirs = Get-ChildItem -Path $versionPath -Directory | Where-Object { $_.Name -match '^\d+_[A-Z]+$' }

    foreach ($bookDir in $bookDirs) {
        $bookCode = $bookDir.Name

        # Trouver tous les .prompt.txt
        $promptFiles = Get-ChildItem -Path $bookDir.FullName -Filter "*.prompt.txt"

        foreach ($promptFile in $promptFiles) {
            $stats.TotalFiles++

            # Générer le nom du fichier .lyrics.txt
            $baseName = $promptFile.BaseName -replace '\.prompt$', ''
            $lyricsFile = Join-Path $bookDir.FullName "$baseName.lyrics.txt"

            # Vérifier si le fichier existe déjà
            if (Test-Path $lyricsFile) {
                Write-Host "  [SKIP] $bookCode\$($promptFile.Name) (existe)" -ForegroundColor DarkGray
                $stats.Skipped++
                continue
            }

            try {
                # Lire le contenu du .prompt.txt
                $content = Get-Content -Path $promptFile.FullName -Raw -Encoding UTF8

                # Nettoyer les paroles
                $cleanedLyrics = Clean-Lyrics -content $content

                if ($null -eq $cleanedLyrics) {
                    Write-Host "  [ERROR] $bookCode\$($promptFile.Name) - Pas de paroles" -ForegroundColor Red
                    $stats.Errors++
                    continue
                }

                # Sauvegarder le fichier .lyrics.txt
                $cleanedLyrics | Out-File -FilePath $lyricsFile -Encoding UTF8 -NoNewline

                Write-Host "  [OK] $bookCode\$baseName.lyrics.txt ($($cleanedLyrics.Length) car)" -ForegroundColor Green
                $stats.Created++

            } catch {
                Write-Host "  [ERROR] $bookCode\$($promptFile.Name) - $($_.Exception.Message)" -ForegroundColor Red
                $stats.Errors++
            }
        }
    }

    Write-Host ""
}

# Afficher les statistiques
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STATISTIQUES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total fichiers traités: $($stats.TotalFiles)" -ForegroundColor White
Write-Host "Créés:                  $($stats.Created)" -ForegroundColor Green
Write-Host "Ignorés (existent):     $($stats.Skipped)" -ForegroundColor Yellow
Write-Host "Erreurs:                $($stats.Errors)" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
