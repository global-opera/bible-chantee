Set-Location "C:\ScriptBible\bible-chantee"

$audioRoot = "G:\Mon Drive\01 BibleChantee\Suno_Output"
$outFile   = "C:\ScriptBible\bible-chantee\progress.json"
$target    = 1189
$langs     = @("FR","EN","PT","ES")

function Get-UniqueChapterCount($lang) {
    $files = Get-ChildItem (Join-Path $audioRoot $lang) -Recurse -File -Filter "*.mp3" -ErrorAction SilentlyContinue |
             Where-Object { $_.FullName -notmatch '\\variantes\\' }

    $ids = $files.Name | ForEach-Object {
        if ($_ -match '^(\d{2}_[A-Z0-9]{3,4})_(\d{1,3})_' + $lang + '\.mp3$') {
            "$($Matches[1])_$([int]$Matches[2])"
        }
    }

    ($ids | Sort-Object -Unique).Count
}

$progress = [ordered]@{
    total = $target
    updated_at = (Get-Date).ToString("s")
    langs = [ordered]@{}
}

foreach ($lang in $langs) {
    $count = Get-UniqueChapterCount $lang
    $progress.langs[$lang] = [ordered]@{
        count   = $count
        target  = $target
        percent = [math]::Round(($count / $target) * 100, 1)
        status  = if ($count -eq $target) { "Complet" } else { "En cours" }
    }
}

$progress | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 $outFile

Write-Host "`n✅ progress.json mis à jour -> $outFile" -ForegroundColor Green
Write-Host "updated_at: $($progress.updated_at)`n" -ForegroundColor Cyan
foreach ($lang in $langs) {
    $v = $progress.langs[$lang]
    $color = if ($v.count -eq $target) { "Green" } else { "Yellow" }
    Write-Host ("{0}: {1}/{2} ({3}%) - {4}" -f $lang, $v.count, $v.target, $v.percent, $v.status) -ForegroundColor $color
}

git add progress.json
git commit -m "Update progress.json (auto from MP3 unique IDs, ignore variantes)" 2>$null
git push 2>$null

Write-Host "`n🚀 Git commit/push tenté." -ForegroundColor Magenta
