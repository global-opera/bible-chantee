# Ajouter autoplay et lecture continue au lecteur

Write-Host "=== AJOUT AUTOPLAY AU LECTEUR ===" -ForegroundColor Cyan
Write-Host ""

$content = Get-Content "lecteur.html" -Raw -Encoding UTF8

# 1. Ajouter élément audio caché après le player-bar
$audioElement = @"

        <!-- LECTEUR AUDIO (caché, contrôlé par UI) -->
        <audio id="audioPlayer" style="display: none;"></audio>
"@

if ($content -notmatch '<audio id="audioPlayer"') {
    $content = $content -replace '(</div>\s*<!-- TOGGLE PAROLES/BIBLE -->)', "$audioElement`n`$1"
    Write-Host "✅ Élément <audio> ajouté" -ForegroundColor Green
} else {
    Write-Host "⏭️ Élément <audio> déjà présent" -ForegroundColor Gray
}

# 2. Ajouter bouton autoplay dans player-controls
$autoplayBtn = '<button class="control-btn autoplay-btn" id="autoplayBtn" title="Lecture continue">🔁</button>'
if ($content -notmatch 'autoplay-btn') {
    # Ajouter avant le bouton share
    $content = $content -replace '(<button class="control-btn share-btn")', "$autoplayBtn`n            `$1"
    Write-Host "✅ Bouton autoplay ajouté" -ForegroundColor Green
} else {
    Write-Host "⏭️ Bouton autoplay déjà présent" -ForegroundColor Gray
}

# 3. Ajouter style pour le bouton autoplay
$autoplayStyle = @"

    .autoplay-btn {
      opacity: 0.5;
      transition: opacity 0.3s;
    }
    .autoplay-btn.active {
      opacity: 1;
      color: #F5CB42;
    }
"@

if ($content -notmatch 'autoplay-btn\.active') {
    # Insérer avant </style>
    $content = $content -replace '(\s*</style>)', "$autoplayStyle`$1"
    Write-Host "✅ Style autoplay ajouté" -ForegroundColor Green
} else {
    Write-Host "⏭️ Style autoplay déjà présent" -ForegroundColor Gray
}

# Sauvegarder
Set-Content "lecteur.html" $content -Encoding UTF8
Write-Host ""
Write-Host "✅ Modifications HTML terminées" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaine étape: Ajouter le JavaScript pour l'autoplay" -ForegroundColor Yellow
Write-Host "  - Charger audio depuis audio-urls-XX.js" -ForegroundColor Gray
Write-Host "  - Event listener 'ended' pour autoplay" -ForegroundColor Gray
Write-Host "  - Fonction playNextChapter()" -ForegroundColor Gray
