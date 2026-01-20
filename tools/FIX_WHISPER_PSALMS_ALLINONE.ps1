$ErrorActionPreference = "Stop"

$IN  = "G:\Mon Drive\01 BibleChantee\Lyrics_Whisper_FR_FINAL"
$OUT = "G:\Mon Drive\01 BibleChantee\Lyrics_Whisper_FR_FIXED_PSALMS"
$AUD_TXT  = "G:\Mon Drive\01 BibleChantee\audit_psalms_fixed.txt"
$AUD_JSON = "G:\Mon Drive\01 BibleChantee\audit_psalms_fixed.json"

$WRAP_COL = 80
New-Item -ItemType Directory -Force -Path $OUT | Out-Null

function Strip-Blocks([string]$raw){
  $s = $raw -replace "`r`n","`n"
  $s = [regex]::Replace($s, '^\s*\[TITLE\]\s*\n([\s\S]*?)(?=\n\s*\[LYRICS\]\s*\n|\n{2,}|$)', '', 'IgnoreCase,Multiline')
  $s = [regex]::Replace($s, '^\s*\[LYRICS\]\s*\n?', '', 'IgnoreCase,Multiline')
  $s = [regex]::Replace($s, '^\s*\[[A-Z_]+\]\s*\n?', '', 'IgnoreCase,Multiline')
  return $s.Trim()
}

function Canonicalize([string]$text){
  $s = $text -replace "`r`n","`n"
  $s = $s -replace "’","'"
  $s = $s -replace "`t"," "
  $SEP = " __STANZA_BREAK__ "
  $s = [regex]::Replace($s, "\n{2,}", $SEP)
  $s = [regex]::Replace($s, "\n+", " ")
  $s = [regex]::Replace($s, "\s{2,}", " ").Trim()
  $s = [regex]::Replace($s, "\s*__STANZA_BREAK__\s*", "__STANZA_BREAK__")
  return $s
}

$Repl = @(
  @{ a = "paillés"; b = "paille" },
  @{ a = "voix des justes"; b = "voie des justes" },
  @{ a = "Je l'aurai"; b = "Je louerai" },
  @{ a = "je l'aurai"; b = "je louerai" },
  @{ a = "je me peinirai"; b = "je m'épanouirai" },
  @{ a = "Je me peinirai"; b = "Je m'épanouirai" }
)

$RegexRules = @(
  @{ re = '\b(l\s*''\s*aura|l\s*aura)\s+(je|tu|il|elle|on|nous|vous)\b'; rep = "l'orage `$2"; opt = "IgnoreCase" },
  @{ re = '\bcomme\s+paill[eé]s?\s+dans\s+le\s+vent\b'; rep = "comme paille dans le vent"; opt = "IgnoreCase" },
  @{ re = '\bconna[iî]t\s+la\s+voix\s+des\s+justes\b'; rep = "connaît la voie des justes"; opt = "IgnoreCase" },
  @{ re = '\bje\s+me\s+tiens\s+Tout\s+ce\b'; rep = "je me tiens. Tout ce"; opt = "None" }
)

function Apply-Corrections([string]$canon){
  $SEP = "__STANZA_BREAK__"
  $parts = $canon -split $SEP
  for($i=0;$i -lt $parts.Count;$i++){
    $p = $parts[$i]
    foreach($r in $Repl){ $p = $p.Replace($r.a, $r.b) }
    foreach($rule in $RegexRules){
      $opts = [System.Text.RegularExpressions.RegexOptions]::None
      if($rule.opt -eq "IgnoreCase"){ $opts = $opts -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase }
      $p = [regex]::Replace($p, $rule.re, $rule.rep, $opts)
    }
    $p = [regex]::Replace($p, "\b([cdjlmnst])\s*'\s*", "`$1'", "IgnoreCase")
    $p = [regex]::Replace($p, "\s{2,}", " ").Trim()
    $parts[$i] = $p
  }
  return ($parts -join $SEP).Trim()
}

function Punctuate-ForReflow([string]$s){
  # Unicode-safe: new line after . ! ? when next is any letter (including accented)
  $s = [regex]::Replace($s, '([.!?])\s+(\p{L})', "`$1`n`$2")
  # after ":" same idea
  $s = [regex]::Replace($s, ':\s+(\p{L})', ":`n`$1")
  return $s
}

function Wrap-Line([string]$text, [int]$width){
  $words = ($text.Trim() -split "\s+") | Where-Object { $_ -ne "" }
  $lines = New-Object System.Collections.Generic.List[string]
  $line = ""
  foreach($w in $words){
    if($line.Length -eq 0){ $line = $w }
    elseif(($line.Length + 1 + $w.Length) -le $width){ $line = "$line $w" }
    else { $lines.Add($line); $line = $w }
  }
  if($line.Length -gt 0){ $lines.Add($line) }
  return ($lines -join "`n")
}

function Reflow([string]$canonCorrected){
  $SEP = "__STANZA_BREAK__"
  $stanzas = $canonCorrected -split $SEP | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
  $outStanzas = foreach($st in $stanzas){
    $p = Punctuate-ForReflow $st
    $paras = $p -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
    ($paras | ForEach-Object { Wrap-Line $_ $WRAP_COL }) -join "`n"
  }
  if($outStanzas.Count -gt 1){ return (($outStanzas -join "`n`n").Trim() + "`n") }
  return (($outStanzas -join "`n").Trim() + "`n")
}

$allTxt = Get-ChildItem -Path $IN -Recurse -File -Filter *.txt
$psalms = $allTxt | Where-Object { $_.Name -match '(?i)^19[_-]PSA' } | Sort-Object FullName

Write-Host "Found psalms txt files:" $psalms.Count

$changed = 0
foreach($f in $psalms){
  $raw = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8
  $stripped = Strip-Blocks $raw
  $canon = Canonicalize $stripped
  $corrected = Apply-Corrections $canon
  $pretty = Reflow $corrected

  $rel = $f.FullName.Substring($IN.Length).TrimStart("\","/")
  $outPath = Join-Path $OUT $rel
  New-Item -ItemType Directory -Force -Path (Split-Path $outPath -Parent) | Out-Null
  Set-Content -LiteralPath $outPath -Value $pretty -Encoding UTF8

  if(($raw -replace "`r`n","`n").Trim() -ne $pretty.Trim()){ $changed++ }
}

Write-Host "Processed:" $psalms.Count "Changed (approx):" $changed
Write-Host "Output:" $OUT

$SUSPECT_PATTERNS = @(
  "l'\s*aura\b",
  "\bpaill[eé]s?\b",
  "\bpeinirai\b",
  "\bje\s+l'\s*aurai\b",
  "\btaper\s+en\s+moi\b",
  "\bvoix\s+des\s+justes\b"
)

$tokenFreq = @{}
$suspectFiles = New-Object System.Collections.Generic.List[object]
$totalChars = 0
$totalTokens = 0

function Tokenize([string]$s){
  $x = ($s.ToLower() -replace "[“”«»""]","'") `
    -replace "[^a-zàâäçéèêëîïôöùûüÿ'\s-]"," " `
    -replace "\s{2,}"," "
  $x.Trim().Split(" ",[System.StringSplitOptions]::RemoveEmptyEntries)
}

$outFiles = Get-ChildItem -Path $OUT -Recurse -File -Filter *.txt
foreach($ff in $outFiles){
  $txt = Get-Content -LiteralPath $ff.FullName -Raw -Encoding UTF8
  $totalChars += $txt.Length
  $toks = Tokenize $txt
  $totalTokens += $toks.Count
  foreach($t in $toks){
    if($t.Length -lt 4){ continue }
    if($tokenFreq.ContainsKey($t)){ $tokenFreq[$t]++ } else { $tokenFreq[$t] = 1 }
  }
  $score = 0
  $hits = @()
  foreach($pat in $SUSPECT_PATTERNS){
    if([regex]::IsMatch($txt, $pat, "IgnoreCase")){ $score++; $hits += $pat }
  }
  if($score -gt 0){
    $suspectFiles.Add([pscustomobject]@{
      file = $ff.FullName
      score = $score
      size = $txt.Length
      hits = ($hits | Select-Object -Unique)
    })
  }
}

$topTokens = $tokenFreq.GetEnumerator() |
  Where-Object { $_.Value -ge 5 } |
  Sort-Object Value -Descending |
  Select-Object -First 200 |
  ForEach-Object { [pscustomobject]@{ token=$_.Key; count=$_.Value } }

$suspectTop = $suspectFiles | Sort-Object score -Descending, size -Descending | Select-Object -First 50

$report = [pscustomobject]@{
  dir = $OUT
  files = $outFiles.Count
  totalChars = $totalChars
  avgCharsPerFile = [math]::Round($totalChars / [math]::Max(1,$outFiles.Count))
  totalTokens = $totalTokens
  avgTokensPerFile = [math]::Round($totalTokens / [math]::Max(1,$outFiles.Count))
  suspectFilesTop50 = $suspectTop
  topTokens = $topTokens
}

$report | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $AUD_JSON -Encoding UTF8

$sb = New-Object System.Text.StringBuilder
$null = $sb.AppendLine("DIR: $OUT")
$null = $sb.AppendLine("FILES: $($outFiles.Count)")
$null = $sb.AppendLine("AVG CHARS/FILE: $($report.avgCharsPerFile)")
$null = $sb.AppendLine("AVG TOKENS/FILE: $($report.avgTokensPerFile)")
$null = $sb.AppendLine("")
$null = $sb.AppendLine("=== TOP 50 SUSPECT FILES ===")
foreach($sf in $suspectTop){
  $null = $sb.AppendLine("")
  $null = $sb.AppendLine("[score=$($sf.score)] $($sf.file)")
  $null = $sb.AppendLine("  hits: " + (($sf.hits) -join ", "))
}
$null = $sb.AppendLine("")
$null = $sb.AppendLine("=== TOP 100 TOKENS ===")
foreach($t in ($topTokens | Select-Object -First 100)){
  $null = $sb.AppendLine("$($t.count)`t$($t.token)")
}

$sb.ToString() | Set-Content -LiteralPath $AUD_TXT -Encoding UTF8

Write-Host "✅ Audit written:"
Write-Host $AUD_TXT
Write-Host $AUD_JSON
Write-Host "Suspect files:" $suspectFiles.Count
