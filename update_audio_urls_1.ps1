# Mise a jour audio-urls.js - Nombres 27-36
$file = "C:\ScriptBible\bible-chantee\audio-urls.js"
$content = Get-Content $file -Raw

# Nouvelles URLs
$updates = @{
    '27: "https://musicfile.api.box/MzU5MWJlMDktZDc3NS00ODY0LTk5NDAtZWZjMGVhNmU0ZGE2.mp3"' = '27: "https://musicfile.api.box/MTdjNDVkNzgtM2FlZS00MTljLTkwYTAtNDUwYjYyNzIxNjU1.mp3"'
    '28: "https://musicfile.api.box/OTk4ZjVlZmEtZTY0Ni00MWFjLTk2MGEtMjVhMzhjNTk2ZGM2.mp3"' = '28: "https://musicfile.api.box/NWVkZTlkYmEtMDkyMS00YjYwLThkZDYtNjMzYTkyMGQzZTM4.mp3"'
    '29: "https://musicfile.api.box/YTBiNjBmY2ItOTY4YS00OTRlLTlmMzUtNDRmMzZiYjE3M2U2.mp3"' = '29: "https://musicfile.api.box/MDQ2MjcxODItMGU2ZC00NTkwLTkxMjQtOTY3ODk0ZDhhOWMw.mp3"'
    '30: "https://musicfile.api.box/MzI3NmExOGUtZTBkNi00MTVhLThhMjEtY2NjZGQzNjNhNjFm.mp3"' = '30: "https://musicfile.api.box/MWU0OGVhMjYtNzNiNy00YTdlLWE5N2YtZjI3ZDhhMDcyNjE5.mp3"'
    '31: "https://musicfile.api.box/YWU0MTc4MDgtOTg1MS00NWJjLWIyZmItZmJiMWQ0YzNkOWJh.mp3"' = '31: "https://musicfile.api.box/ODQ5MGVlNWEtODgzYy00MmVlLWFlMDctYjA0YjlhYzJmYjJh.mp3"'
    '32: "https://musicfile.api.box/YWY0OWM3NjktNTE2ZC00MDAyLWE5NTMtZGNiNDZlOGY3OWIy.mp3"' = '32: "https://musicfile.api.box/NjVlNmZjZjEtOGJlOC00YjZiLTkxZmUtYWEzZWE4M2Y5YjEz.mp3"'
    '33: "https://musicfile.api.box/MTVjMDU4ODYtZDRjNS00N2E2LTkxZDQtZjBlNmI1MzFkNDhj.mp3"' = '33: "https://musicfile.api.box/MjVjZDM0N2MtOTg2ZS00MDdhLWFmMmUtODhiZGZkMTA0YmE3.mp3"'
    '34: "https://musicfile.api.box/NWY3MTRiYTQtYzE2OS00NjJlLWFjNDAtNGY5MzQzOTcwNDc0.mp3"' = '34: "https://musicfile.api.box/YTIzNDIxNTMtYWE4MS00ZWYwLWFmMTUtNzM5OGM4NmYwNjJi.mp3"'
    '35: "https://musicfile.api.box/ZDQ2ODkwMzUtNGJjMy00MTA4LWJiMTctOWRiMWM2ZjNmZTA2.mp3"' = '35: "https://musicfile.api.box/MDNhY2Y0YjgtMjk5ZC00NWUxLWEzZGUtZTU2MTdlOGFhNDI2.mp3"'
    '36: "https://musicfile.api.box/ZDNlMDQ0ODUtNGY3NC00N2VmLTkwZDgtMTdlNmNhODRlOTAw.mp3"' = '36: "https://musicfile.api.box/MGM0MDg0NjctY2YzZi00YzU0LWEyMzQtZGQyMGQ2OWFmYjQz.mp3"'
}

foreach ($old in $updates.Keys) {
    $new = $updates[$old]
    $content = $content -replace [regex]::Escape($old), $new
}

Set-Content $file $content -NoNewline
Write-Host "audio-urls.js mis a jour avec les nouvelles URLs pour Nombres 27-36"
