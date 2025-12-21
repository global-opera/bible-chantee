# build_and_run_es_windows.ps1
# Génère 10 windows .cmd pour compléter ES + les lance en parallèle.

$ErrorActionPreference = "Stop"

$root     = "C:\ScriptBible\bible-chantee"
$audioRoot= "G:\Mon Drive\01 BibleChantee\Suno_Output"
$lang     = "ES"
$target   = 1189
$windows  = 10

# Dossiers output
$cmdDir = Join-Path $root "Scripts\es_windows"
$logDir = Join-Path $root "logs_es"
New-Item -ItemType Directory -Force -Path $cmdDir, $logDir | Out-Null

# Trouver suno_v5_bible.py dans le repo
$pyScript = Get-ChildItem $root -Recurse -File -Filter "suno_v5_bible.py" -ErrorAction SilentlyContinue |
  Select-Object -First 1 -ExpandProperty FullName

if (-not $pyScript) {
  throw "suno_v5_bible.py introuvable dans $root. Mets le script dans le repo ou indique son chemin."
}

# Lire mp3 ES existants (ignore variantes)
$esDir = Join-Path $audioRoot $lang
if (-not (Test-Path $esDir)) { throw "Dossier audio ES introuvable: $esDir" }

$files = Get-ChildItem $esDir -Recurse -File -Filter "*.mp3" -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch '\\variantes\\' }

# Parse IDs: 19_PSA_150_ES.mp3 -> book=19_PSA ch=150
$re = '^(\d{2}_[A-Z0-9]{3,4})_(\d{1,3})_' + $lang + '\.mp3$'
$existing = @{}
foreach($f in $files){
  if($f.Name -match $re){
    $book = $Matches[1]
    $ch   = [int]$Matches[2]
    $id   = "$book|$ch"
    $existing[$id] = $true
  }
}

# Table chapitres par livre (codes "anciens" comme chez toi: 09_1SA, 22_SNG, etc.)
$books = @(
  @{Code="01_GEN"; Chapters=50}, @{Code="02_EXO"; Chapters=40}, @{Code="03_LEV"; Chapters=27}, @{Code="04_NUM"; Chapters=36}, @{Code="05_DEU"; Chapters=34},
  @{Code="06_JOS"; Chapters=24}, @{Code="07_JDG"; Chapters=21}, @{Code="08_RUT"; Chapters=4},  @{Code="09_1SA"; Chapters=31}, @{Code="10_2SA"; Chapters=24},
  @{Code="11_1KI"; Chapters=22}, @{Code="12_2KI"; Chapters=25}, @{Code="13_1CH"; Chapters=29}, @{Code="14_2CH"; Chapters=36}, @{Code="15_EZR"; Chapters=10},
  @{Code="16_NEH"; Chapters=13}, @{Code="17_EST"; Chapters=10}, @{Code="18_JOB"; Chapters=42}, @{Code="19_PSA"; Chapters=150}, @{Code="20_PRO"; Chapters=31},
  @{Code="21_ECC"; Chapters=12}, @{Code="22_SNG"; Chapters=8},  @{Code="23_ISA"; Chapters=66}, @{Code="24_JER"; Chapters=52}, @{Code="25_LAM"; Chapters=5},
  @{Code="26_EZK"; Chapters=48}, @{Code="27_DAN"; Chapters=12}, @{Code="28_HOS"; Chapters=14}, @{Code="29_JOL"; Chapters=3},  @{Code="30_AMO"; Chapters=9},
  @{Code="31_OBA"; Chapters=1},  @{Code="32_JON"; Chapters=4},  @{Code="33_MIC"; Chapters=7},  @{Code="34_NAH"; Chapters=3},  @{Code="35_HAB"; Chapters=3},
  @{Code="36_ZEP"; Chapters=3},  @{Code="37_HAG"; Chapters=2},  @{Code="38_ZEC"; Chapters=14}, @{Code="39_MAL"; Chapters=4},
  @{Code="40_MAT"; Chapters=28}, @{Code="41_MRK"; Chapters=16}, @{Code="42_LUK"; Chapters=24}, @{Code="43_JHN"; Chapters=21}, @{Code="44_ACT"; Chapters=28},
  @{Code="45_ROM"; Chapters=16}, @{Code="46_1CO"; Chapters=16}, @{Code="47_2CO"; Chapters=13}, @{Code="48_GAL"; Chapters=6},  @{Code="49_EPH"; Chapters=6},
  @{Code="50_PHP"; Chapters=4},  @{Code="51_COL"; Chapters=4},  @{Code="52_1TH"; Chapters=5},  @{Code="53_2TH"; Chapters=3},  @{Code="54_1TI"; Chapters=6},
  @{Code="55_2TI"; Chapters=4},  @{Code="56_TIT"; Chapters=3},  @{Code="57_PHM"; Chapters=1},  @{Code="58_HEB"; Chapters=13}, @{Code="59_JAS"; Chapters=5},
  @{Code="60_1PE"; Chapters=5},  @{Code="61_2PE"; Chapters=3},  @{Code="62_1JN"; Chapters=5},  @{Code="63_2JN"; Chapters=1},  @{Code="64_3JN"; Chapters=1},
  @{Code="65_JUD"; Chapters=1},  @{Code="66_REV"; Chapters=22}
)

# Construire la liste des chapitres manquants par livre
$missingByBook = @{}
$totalMissing = 0
foreach($b in $books){
  $code = $b.Code
  $max  = [int]$b.Chapters
  $miss = New-Object System.Collections.Generic.List[int]
  for($ch=1; $ch -le $max; $ch++){
    $id = "$code|$ch"
    if(-not $existing.ContainsKey($id)){
      $miss.Add($ch)
      $totalMissing++
    }
  }
  $missingByBook[$code] = $miss
}

Write-Host "Missing total: $totalMissing" -ForegroundColor Cyan

# Convertir en ranges contigus: ex [1,2,3,7,8] -> (1-3),(7-8)
function To-Ranges([System.Collections.Generic.List[int]]$list){
  $ranges = New-Object System.Collections.Generic.List[object]
  if($list.Count -eq 0){ return $ranges }
  $sorted = $list | Sort-Object
  $start = $sorted[0]; $prev = $sorted[0]
  for($i=1; $i -lt $sorted.Count; $i++){
    $cur = $sorted[$i]
    if($cur -eq ($prev+1)){
      $prev = $cur
    } else {
      $ranges.Add([pscustomobject]@{Start=$start; End=$prev})
      $start = $cur; $prev = $cur
    }
  }
  $ranges.Add([pscustomobject]@{Start=$start; End=$prev})
  return $ranges
}

# Liste de tous les jobs (book + start/end)
$jobs = New-Object System.Collections.Generic.List[object]
foreach($b in $books){
  $code = $b.Code
  $ranges = To-Ranges $missingByBook[$code]
  foreach($r in $ranges){
    $jobs.Add([pscustomobject]@{
      Book=$code; Start=[int]$r.Start; End=[int]$r.End; Size=([int]$r.End - [int]$r.Start + 1)
    })
  }
}

# Greedy bin packing sur les ranges (plus gros d'abord)
$jobs = $jobs | Sort-Object Size -Descending

$bins = @()
for($i=0; $i -lt $windows; $i++){
  $bins += [pscustomobject]@{Idx=($i+1); Size=0; Items=(New-Object System.Collections.Generic.List[object])}
}

foreach($j in $jobs){
  $minBin = $bins | Sort-Object Size | Select-Object -First 1
  $minBin.Items.Add($j)
  $minBin.Size += $j.Size
}

# Écrire les .cmd
for($i=0; $i -lt $bins.Count; $i++){
  $w = $bins[$i]
  $cmdPath = Join-Path $cmdDir ("window_{0}.cmd" -f $w.Idx)
  $logPath = Join-Path $logDir ("window_{0}.log" -f $w.Idx)

  $lines = New-Object System.Collections.Generic.List[string]
  $lines.Add('@echo off')
  $lines.Add('cd /d "' + $root + '"')
  $lines.Add('echo === WINDOW ' + $w.Idx + ' START %DATE% %TIME% === > "' + $logPath + '"')

  foreach($it in ($w.Items | Sort-Object Book,Start)){
    $cmd = 'python "' + $pyScript + '" ' + $lang + ' ' + $it.Book + ' ' + $it.Start + ' ' + $it.End
    $lines.Add('echo ' + $cmd + '>> "' + $logPath + '"')
    $lines.Add($cmd + '>> "' + $logPath + '" 2>&1')
  }

  $lines.Add('echo === WINDOW ' + $w.Idx + ' END %DATE% %TIME% === >> "' + $logPath + '"')
  Set-Content -Path $cmdPath -Value ($lines -join "`r`n") -Encoding ASCII

  Write-Host ("W{0}: {1} chapters -> {2}" -f $w.Idx, $w.Size, $cmdPath) -ForegroundColor Green
}

# Lancer les 10 fenêtres
Write-Host "Launching 10 windows..." -ForegroundColor Cyan
for($i=1; $i -le $windows; $i++){
  $cmdPath = Join-Path $cmdDir ("window_{0}.cmd" -f $i)
  Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$cmdPath`"" -WindowStyle Minimized
}

Write-Host "DONE. Logs: $logDir" -ForegroundColor Cyan
