$data = Get-Content inscrits_biblechantee.json | ConvertFrom-Json
$data.subscribers | Select-Object email, language, created_at, id | Export-Csv -Path inscrits_biblechantee.csv -NoTypeInformation -Encoding UTF8
Write-Host "CSV created with $($data.subscribers.Count) subscribers"
$data.subscribers | Format-Table email, language
