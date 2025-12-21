Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$audioRoot = "G:\Mon Drive\01 BibleChantee\Suno_Output"
$lang = "ES"
$target = 1189
$windows = 10

# 66 livres + nb chapitres (codes "standard" projet : 01_GEN ... 66_REV)
$books = @(
  @{Code="01_GEN";Ch=50}, @{Code="02_EXO";Ch=40}, @{Code="03_LEV";Ch=27}, @{Code="04_NUM";Ch=36}, @{Code="05_DEU";Ch=34},
  @{Code="06_JOS";Ch=24}, @{Code="07_JDG";Ch=21}, @{Code="08_RUT";Ch=4},  @{Code="09_1SA";Ch=31}, @{Code="10_2SA";Ch=24},
  @{Code="11_1KI";Ch=22}, @{Code="12_2KI";Ch=25}, @{Code="13_1CH";Ch=29}, @{Code="14_2CH";Ch=36}, @{Code="15_EZR";Ch=10},
  @{Code="16_NEH";Ch=13}, @{Code="17_EST";Ch=10}, @{Code="18_JOB";Ch=42}, @{Code="19_PSA";Ch=150}, @{Code="20_PRO";Ch=31},
  @{Code="21_ECC";Ch=12}, @{Code="22_SNG";Ch=8},  @{Code="23_ISA";Ch=66}, @{Code="24_JER";Ch=52}, @{Code="25_LAM";Ch=5},
  @{Code="26_EZK";Ch=48}, @{Code="27_DAN";Ch=12}, @{Code="28_HOS";Ch=14}, @{Code="29_JOL";Ch=3},  @{Code="30_AMO";Ch=9},
  @{Code="31_OBA";Ch=1},  @{Code="32_JON";Ch=4},  @{Code="33_MIC";Ch=7},  @{Code="34_NAH";Ch=3},  @{Code="35_HAB";Ch=3},
  @{Code="36_ZEP";Ch=3},  @{Code="37_HAG";Ch=2},  @{Code="38_ZEC";Ch=14}, @{Code="39_MAL";Ch=4},
  @{Code="40_MAT";Ch=28}, @{Code="41_MRK";Ch=16}, @{Code="42_LUK";Ch=24}, @{Code="43_JHN";Ch=21}, @{Code="44_ACT";Ch=28},
  @{Code="45_ROM";Ch=16}, @{Code="46_1CO";Ch=16}, @{Code="47_2CO";Ch=13}, @{Code="48_GAL";Ch=6},  @{Code="49_EPH";Ch=6},
  @{Code="50_PHP";Ch=4},  @{Code="51_COL";Ch=4},  @{Code="52_1TH";Ch=5},  @{Code="53_2TH";Ch=3}, @{Code="54_1TI";Ch=6},
  @{Code="55_2TI";Ch=4},  @{Code="56_TIT";Ch=3},  @{Code="57_PHM";Ch=1},  @{Code="58_HEB";Ch=13}, @{Code="59_JAS";Ch=5},
  @{Code="60_1PE";Ch=5},  @{Code="61_2PE";Ch=3},  @{Code="62_1JN";Ch=5},  @{Code="63_2JN";Ch=1}, @{Code="64_3JN";Ch=1},
  @{Code="65_JUD";Ch=1},  @{Code="66_REV";Ch=22}
)

function Get-ExistingSet {
  $files = Get-ChildItem (Join-Path $audioRoot $lang) -Recurse -File -Filter "*.mp3" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\variantes\\' }

  $set = @{}
  foreach($f in $files){
    if($f.Name -match '^(\d{2}_[A-Z0-9]{3,4})_(\d{1,3})_' + $lang + '\.mp3$'){
      $key = "$($Matches[1])_$([int]$Matches[2])"
      $set[$key] = $true
    }
  }
  return $set
}

$existing = Get-ExistingSet

$missing = New-Object System.Collections.Generic.List[object]
foreach($b in $books){
  for($c=1; $c -le $b.Ch; $c++){
    $key = "$($b.Code)_$c"
    if(-not $existing.ContainsKey($key)){
      $missing.Add([pscustomobject]@{ Book=$b.Code; Chap=$c })
    }
  }
}

Write-Host "Missing total: $($missing.Count)" -ForegroundColor Yellow

# Pack into contiguous ranges per book
$ranges = New-Object System.Collections.Generic.List[object]
foreach($g in ($missing | Group-Object Book)){
  $chs = $g.Group | Select-Object -ExpandProperty Chap | Sort-Object
  $start = $chs[0]; $prev = $chs[0]
  for($i=1;$i -lt $chs.Count;$i++){
    $cur = $chs[$i]
    if($cur -eq ($prev+1)){
      $prev = $cur
      continue
    }
    $ranges.Add([pscustomobject]@{Book=$g.Name; Start=$start; End=$prev; Len=($prev-$start+1)})
    $start = $cur; $prev = $cur
  }
  $ranges.Add([pscustomobject]@{Book=$g.Name; Start=$start; End=$prev; Len=($prev-$start+1)})
}

# Greedy balance into N windows by Len
$ranges = $ranges | Sort-Object Len -Descending
$bins = 1..$windows | ForEach-Object { [pscustomobject]@{ Id=$_; Total=0; Items=New-Object System.Collections.Generic.List[object] } }

foreach($r in $ranges){
  $bin = $bins | Sort-Object Total | Select-Object -First 1
  $bin.Items.Add($r)
  $bin.Total += $r.Len
}

$outDir = "C:\ScriptBible\bible-chantee\Scripts\es_windows"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# Write one .cmd per window (python lines only)
foreach($bin in $bins | Sort-Object Id){
  $path = Join-Path $outDir ("window_{0}.cmd" -f $bin.Id)
  $lines = @()
  foreach($it in ($bin.Items | Sort-Object Book, Start)){
    $lines += ("python suno_v5_bible.py ES {0} {1} {2}" -f $it.Book, $it.Start, $it.End)
  }
  Set-Content -Encoding UTF8 -Path $path -Value $lines
  Write-Host ("W{0}: {1} chapters -> {2}" -f $bin.Id, $bin.Total, $path)
}

Write-Host "Done. Run the 10 .cmd files in parallel (separate terminals) or via your pool runner." -ForegroundColor Cyan
