const fs = require('fs');
const path = require('path');

const LYRICS_DIR = path.join(__dirname, '..', 'lyrics', 'prayers');

// Extracted from prayers.html
const PRAYERS = {
    FR: [
        { title: "Notre Pere", audio: "FR_Notre Pere.mp3", lyrics: "FR_Notre Pere.md" },
        { title: "D'Abord Je Te Cherche", audio: "FR_DAbord Je Te Cherche.mp3", lyrics: "FR_DAbord Je Te Cherche.md" },
        { title: "Priere de Delivrance", audio: "FR_Priere de delivrance.mp3", lyrics: "FR_Priere de delivrance.md" },
        { title: "Reconnaissance", audio: "FR_Reconnaissance.mp3", lyrics: "FR_Reconnaissance.md" },
        { title: "Tu Es Ma Protection", audio: "FR_Tu Es Ma Protection.mp3", lyrics: "FR_Tu Es Ma Protection.md" }
    ],
    EN: [
        { title: "Our Father", audio: "EN_Our Father.mp3", lyrics: "EN_Our Father.md" },
        { title: "First I Seek You", audio: "EN_First I Seek You.mp3", lyrics: "EN_First I Seek You.md" },
        { title: "Gratitude", audio: "EN_Gratitude.mp3", lyrics: "EN_Gratitude.md" },
        { title: "Prayer of Deliverance", audio: "EN_Prayer of Deliverance.mp3", lyrics: "EN_Prayer of Deliverance.md" },
        { title: "You Are My Protection", audio: "EN_You Are My Protection.mp3", lyrics: "EN_You Are My Protection.md" },
        { title: "You Open Doors", audio: "EN_You Open Doors.mp3", lyrics: "EN_You Open Doors.md" }
    ],
    ES: [
        { title: "Padre Nuestro", audio: "ES_Padre Nuestro.mp3", lyrics: "ES_Padre Nuestro.md" },
        { title: "Primero Te Busco", audio: "ES_Primero Te Busco.mp3", lyrics: "ES_Primero Te Busco.md" },
        { title: "Gratitud", audio: "ES_Gratitud.mp3", lyrics: "ES_Gratitud.md" },
        { title: "Oracion de Liberacion", audio: "ES_Oracion de Liberacion.mp3", lyrics: "ES_Oración de Liberación.md" },
        { title: "Tu Eres Mi Proteccion", audio: "ES_Tu Eres Mi Proteccion.mp3", lyrics: "ES_Tú Eres Mi Protección.md" },
        { title: "Abres Las Puertas", audio: "ES_Abres Las Puertas.mp3", lyrics: "ES_Abres Las Puertas.md" }
    ],
    DE: [
        { title: "Vater Unser", audio: "DE_Vater Unser.mp3", lyrics: "DE_Vater Unser.md" },
        { title: "Zuerst Suche Ich Dich", audio: "DE_Zuerst Suche Ich Dich.mp3", lyrics: "DE_Zuerst Suche Ich Dich.md" },
        { title: "Dankbarkeit", audio: "DE_Dankbarkeit.mp3", lyrics: "DE_Dankbarkeit.md" },
        { title: "Gebet der Befreiung", audio: "DE_Gebet der Befreiung.mp3", lyrics: "DE_Gebet der Befreiung.md" },
        { title: "Du Bist Mein Schutz", audio: "DE_Du Bist Mein Schutz.mp3", lyrics: "DE_Du Bist Mein Schutz.md" },
        { title: "Du Offnest Turen", audio: "DE_Du offnest Turen.mp3", lyrics: "DE_Du Öffnest Türen.md" }
    ],
    IT: [
        { title: "Padre Nostro", audio: "IT_Padre Nostro.mp3", lyrics: "IT_Padre Nostro.md" },
        { title: "Prima Ti Cerco", audio: "IT_Prima Ti Cerco.mp3", lyrics: "IT_Prima Ti Cerco.md" },
        { title: "Gratitudine", audio: "IT_Gratitudine.mp3", lyrics: "IT_Gratitudine.md" },
        { title: "Preghiera di Liberazione", audio: "IT_Preghiera di Liberazione.mp3", lyrics: "IT_Preghiera di Liberazione.md" },
        { title: "Tu Sei La Mia Protezione", audio: "IT_Tu Sei La Mia Protezione.mp3", lyrics: "IT_Tu Sei La Mia Protezione.md" },
        { title: "Apri Le Porte", audio: "IT_Apri Le Porte.mp3", lyrics: "IT_Apri Le Porte.md" }
    ],
    PT: [
        { title: "Pai Nosso", audio: "PT_Pai Nosso.mp3", lyrics: "PT_Pai Nosso.md" },
        { title: "Gratidao", audio: "PT_Gratidao.mp3", lyrics: "PT_Gratidão.md" },
        { title: "Oracao de Libertacao", audio: "PT_Oracao de Libertacao.mp3", lyrics: "PT_Oração de Libertação.md" },
        { title: "Primeiro Eu Te Busco", audio: "PT_Primeiro Eu Te Busco.mp3", lyrics: "PT_Primeiro Eu Te Busco.md" },
        { title: "Tu Es a Minha Protecao", audio: "PT_Tu es a Minha Protecao.mp3", lyrics: "PT_Tu És a Minha Proteção.md" }
    ],
    TL: [
        { title: "Ama Namin", audio: "TL_Ama Namin.mp3", lyrics: null },
        { title: "Pasasalamat", audio: "TL_Pasasalamat.mp3", lyrics: "TL_Pasasalamat.md" },
        { title: "Panalangin ng Paglaya", audio: "TL_Panalangin ng Paglaya.mp3", lyrics: "TL_Panalangin ng Paglaya.md" },
        { title: "Una Kitang Hinahanap", audio: "TL_Una Kitang Hinahanap.mp3", lyrics: "TL_Una Kitang Hinahanap.md" },
        { title: "Binubuksan Mo Ang Pinto", audio: "TL_Binubuksan Mo Ang Pinto.mp3", lyrics: "TL_Binubuksan Mo Ang Pinto.md" },
        { title: "Ikaw ang Aking Proteksiyon", audio: "TL_Ikaw ang Aking Proteksiyon.mp3", lyrics: "TL_Ikaw ang Aking Proteksiyon.md" }
    ]
};

console.log("🔍 AUDIT: Checking all prayers lyrics files...\n");

let totalPrayers = 0;
let totalWithLyrics = 0;
let missingFiles = 0;
let foundFiles = 0;

for (const [lang, prayers] of Object.entries(PRAYERS)) {
    console.log(`\n📚 ${lang}:`);

    for (const prayer of prayers) {
        totalPrayers++;

        if (!prayer.lyrics) {
            console.log(`  ⚠️  ${prayer.title} - No lyrics file specified`);
            continue;
        }

        totalWithLyrics++;
        const lyricsPath = path.join(LYRICS_DIR, prayer.lyrics);

        if (fs.existsSync(lyricsPath)) {
            const stats = fs.statSync(lyricsPath);
            console.log(`  ✅ ${prayer.title} - ${prayer.lyrics} (${stats.size} bytes)`);
            foundFiles++;
        } else {
            console.log(`  ❌ ${prayer.title} - MISSING: ${prayer.lyrics}`);
            missingFiles++;
        }
    }
}

console.log("\n" + "=".repeat(60));
console.log(`📊 SUMMARY:`);
console.log(`  Total prayers: ${totalPrayers}`);
console.log(`  With lyrics specified: ${totalWithLyrics}`);
console.log(`  Lyrics files found: ${foundFiles}`);
console.log(`  Lyrics files MISSING: ${missingFiles}`);

if (missingFiles === 0) {
    console.log(`\n✅ SUCCESS: All lyrics files found!`);
    process.exit(0);
} else {
    console.log(`\n❌ ERROR: ${missingFiles} lyrics files are missing!`);
    process.exit(1);
}
