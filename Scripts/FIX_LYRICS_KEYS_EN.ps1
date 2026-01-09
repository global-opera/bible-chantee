# Fix lyrics-data-en.js keys from "XX" to "XX_CODE"
$file = "C:\ScriptBible\bible-chantee\lyrics-data-en.js"
$content = Get-Content $file -Raw -Encoding UTF8

# Mapping from books.js
$mapping = @{
    '"01":' = '"01_GEN":'
    '"02":' = '"02_EXO":'
    '"03":' = '"03_LEV":'
    '"04":' = '"04_NUM":'
    '"05":' = '"05_DEU":'
    '"06":' = '"06_JOS":'
    '"07":' = '"07_JDG":'
    '"08":' = '"08_RUT":'
    '"09":' = '"09_1SAM":'
    '"10":' = '"10_2SAM":'
    '"11":' = '"11_1KI":'
    '"12":' = '"12_2KI":'
    '"13":' = '"13_1CH":'
    '"14":' = '"14_2CH":'
    '"15":' = '"15_EZR":'
    '"16":' = '"16_NEH":'
    '"17":' = '"17_EST":'
    '"18":' = '"18_JOB":'
    '"19":' = '"19_PSA":'
    '"20":' = '"20_PRO":'
    '"21":' = '"21_ECC":'
    '"22":' = '"22_SON":'
    '"23":' = '"23_ISA":'
    '"24":' = '"24_JER":'
    '"25":' = '"25_LAM":'
    '"26":' = '"26_EZE":'
    '"27":' = '"27_DAN":'
    '"28":' = '"28_HOS":'
    '"29":' = '"29_JOE":'
    '"30":' = '"30_AMO":'
    '"31":' = '"31_OBA":'
    '"32":' = '"32_JON":'
    '"33":' = '"33_MIC":'
    '"34":' = '"34_NAH":'
    '"35":' = '"35_HAB":'
    '"36":' = '"36_ZEP":'
    '"37":' = '"37_HAG":'
    '"38":' = '"38_ZEC":'
    '"39":' = '"39_MAL":'
    '"40":' = '"40_MAT":'
    '"41":' = '"41_MAR":'
    '"42":' = '"42_LUK":'
    '"43":' = '"43_JOH":'
    '"44":' = '"44_ACT":'
    '"45":' = '"45_ROM":'
    '"46":' = '"46_1CO":'
    '"47":' = '"47_2CO":'
    '"48":' = '"48_GAL":'
    '"49":' = '"49_EPH":'
    '"50":' = '"50_PHP":'
    '"51":' = '"51_COL":'
    '"52":' = '"52_1TH":'
    '"53":' = '"53_2TH":'
    '"54":' = '"54_1TI":'
    '"55":' = '"55_2TI":'
    '"56":' = '"56_TIT":'
    '"57":' = '"57_PHM":'
    '"58":' = '"58_HEB":'
    '"59":' = '"59_JAM":'
    '"60":' = '"60_1PE":'
    '"61":' = '"61_2PE":'
    '"62":' = '"62_1JO":'
    '"63":' = '"63_2JO":'
    '"64":' = '"64_3JO":'
    '"65":' = '"65_JUD":'
    '"66":' = '"66_REV":'
}

# Replace only book keys (at start of line with spaces)
foreach ($old in $mapping.Keys) {
    $new = $mapping[$old]
    # Match pattern: spaces + "XX": + space + {
    $content = $content -replace "(?m)^(\s+)$([regex]::Escape($old))\s+\{", "`$1$new {"
}

[System.IO.File]::WriteAllText($file, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Fixed lyrics-data-en.js keys" -ForegroundColor Green
