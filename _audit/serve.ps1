$ErrorActionPreference="Stop"
$port = 4177
Write-Host "Serving http://127.0.0.1:$port" -ForegroundColor Cyan
# Node fallback si python absent
try {
  python -m http.server $port --bind 127.0.0.1 | Out-Host
} catch {
  npx --yes http-server . -p $port -a 127.0.0.1 -c-1 | Out-Host
}
