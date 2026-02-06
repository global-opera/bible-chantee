# Upload toutes les prieres vers R2
# Utilise wrangler ou rclone (a configurer)

$prayersFR = @(
    @{Source="C:\Users\Stephane CASSANI\Desktop\Prieres\Generated\mp3 prieres\FR_Notre Pere.mp3"; Dest="prayers/FR_Notre_Pere.mp3"},
    @{Source="C:\Users\Stephane CASSANI\Desktop\Prieres\Generated\mp3 prieres\FR_D'Abord Je Te Cherche_v1.mp3"; Dest="prayers/FR_DAbord_Je_Te_Cherche.mp3"},
    @{Source="C:\Users\Stephane CASSANI\Desktop\Prieres\Generated\mp3 prieres\FR_Priere de delivrance.mp3"; Dest="prayers/FR_Priere_de_delivrance.mp3"},
    @{Source="C:\Users\Stephane CASSANI\Desktop\Prieres\Generated\mp3 prieres\FR_Reconnaissance_v1.mp3"; Dest="prayers/FR_Reconnaissance.mp3"},
    @{Source="C:\Users\Stephane CASSANI\Desktop\Prieres\Generated\mp3 prieres\FR_Tu Es Ma Protection_v1.mp3"; Dest="prayers/FR_Tu_Es_Ma_Protection.mp3"}
)

$prayersPT = @(
    @{Source="G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\PT_Pai Nosso.mp3"; Dest="prayers/PT_Pai_Nosso.mp3"},
    @{Source="G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\PT_Gratidao.mp3"; Dest="prayers/PT_Gratidao.mp3"},
    @{Source="G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\PT_Oracao de Libertacao.mp3"; Dest="prayers/PT_Oracao_de_Libertacao.mp3"},
    @{Source="G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\PT_Primeiro Eu Te Busco.mp3"; Dest="prayers/PT_Primeiro_Eu_Te_Busco.mp3"},
    @{Source="G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\PT_Tu es a Minha Protecao.mp3"; Dest="prayers/PT_Tu_es_a_Minha_Protecao.mp3"}
)

$prayersTL = @(
    @{Source="G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\TL_Ama Namin.mp3"; Dest="prayers/TL_Ama_Namin.mp3"},
    @{Source="G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\TL_Pasasalamat.mp3"; Dest="prayers/TL_Pasasalamat.mp3"},
    @{Source="G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\TL_Panalangin ng Paglaya.mp3"; Dest="prayers/TL_Panalangin_ng_Paglaya.mp3"},
    @{Source="G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\TL_Una Kitang Hinahanap.mp3"; Dest="prayers/TL_Una_Kitang_Hinahanap.mp3"},
    @{Source="G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\TL_Binubuksan Mo Ang Pinto.mp3"; Dest="prayers/TL_Binubuksan_Mo_Ang_Pinto.mp3"},
    @{Source="G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\TL_Ikaw ang Aking Proteksiyon.mp3"; Dest="prayers/TL_Ikaw_ang_Aking_Proteksiyon.mp3"}
)

$allPrayers = $prayersFR + $prayersPT + $prayersTL
$bucket = "bible-chantee-audio"

Write-Host "=== UPLOAD PRAYERS TO R2 ===" -ForegroundColor Cyan
Write-Host "Total files: $($allPrayers.Count)" -ForegroundColor Yellow
Write-Host ""

# OPTION 1: Utiliser wrangler
Write-Host "METHOD 1: wrangler (Cloudflare CLI)" -ForegroundColor Green
Write-Host "Install: npm install -g wrangler" -ForegroundColor Gray
Write-Host "Login: wrangler login" -ForegroundColor Gray
Write-Host ""
foreach ($prayer in $allPrayers) {
    if (Test-Path $prayer.Source) {
        Write-Host "wrangler r2 object put $bucket/$($prayer.Dest) --file=`"$($prayer.Source)`"" -ForegroundColor White
    } else {
        Write-Host "MISSING: $($prayer.Source)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== OR ===" -ForegroundColor Yellow
Write-Host ""

# OPTION 2: Utiliser rclone
Write-Host "METHOD 2: rclone" -ForegroundColor Green
Write-Host "Configure rclone for Cloudflare R2 first" -ForegroundColor Gray
Write-Host ""
foreach ($prayer in $allPrayers) {
    if (Test-Path $prayer.Source) {
        Write-Host "rclone copy `"$($prayer.Source)`" r2:$bucket/$([System.IO.Path]::GetDirectoryName($prayer.Dest))" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "Apres upload, tester:" -ForegroundColor Cyan
Write-Host "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/FR_Notre_Pere.mp3" -ForegroundColor White
