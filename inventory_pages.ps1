# Inventaire des pages HTML pour Bible Chantée V3

Write-Host "`n=== RECHERCHE PAGES SPECIFIQUES ===" -ForegroundColor Yellow

$keywords = @("about", "aide", "help", "promesse", "confess", "priere", "prayer")

foreach ($keyword in $keywords) {
    $found = Get-ChildItem -Recurse -Filter "*$keyword*" -File -ErrorAction SilentlyContinue |
             Where-Object { $_.Extension -eq '.html' }

    if ($found) {
        Write-Host "`n$keyword : trouve $($found.Count) fichier(s)" -ForegroundColor Green
        foreach ($file in $found) {
            $relativePath = $file.FullName -replace [regex]::Escape($PWD.Path + '\'), ''
            Write-Host "  - $relativePath" -ForegroundColor Gray
        }
    } else {
        Write-Host "`n$keyword : NON TROUVE" -ForegroundColor Red
    }
}

Write-Host "`n=== CONTENU GOOGLE DRIVE ===" -ForegroundColor Cyan
$driveFiles = Get-ChildItem "G:\Mon Drive\01 BibleChantee\*.html" -ErrorAction SilentlyContinue
if ($driveFiles) {
    $driveFiles | Select-Object Name | Format-Table -AutoSize
} else {
    Write-Host "Aucun fichier HTML dans Google Drive" -ForegroundColor Gray
}
