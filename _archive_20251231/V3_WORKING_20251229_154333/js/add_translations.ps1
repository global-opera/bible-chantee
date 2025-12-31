# Script pour ajouter btnOpenPlayer et btnOpen après navPlayer
$content = Get-Content "translations.js" -Raw -Encoding UTF8

# FR - Français
$content = $content.Replace(
    'navPlayer: "Lecteur",',
    'navPlayer: "Lecteur",
    btnOpenPlayer: "Ouvrir le lecteur",
    btnOpen: "Ouvrir",'
)

# EN - English
$content = $content.Replace(
    'navPlayer: "Player",',
    'navPlayer: "Player",
    btnOpenPlayer: "Open Player",
    btnOpen: "Open",'
)

# ES - Español
$content = $content.Replace(
    'navPlayer: "Reproductor",',
    'navPlayer: "Reproductor",
    btnOpenPlayer: "Abrir reproductor",
    btnOpen: "Abrir",'
)

# PT - Português
$content = $content.Replace(
    'navPlayer: "Leitor",',
    'navPlayer: "Leitor",
    btnOpenPlayer: "Abrir leitor",
    btnOpen: "Abrir",'
)

# DE - Deutsch
$content = $content.Replace(
    'navPlayer: "Spieler",',
    'navPlayer: "Spieler",
    btnOpenPlayer: "Player öffnen",
    btnOpen: "Öffnen",'
)

$content | Set-Content "translations.js" -Encoding UTF8 -NoNewline
Write-Host "Modifications appliquées avec succès"
