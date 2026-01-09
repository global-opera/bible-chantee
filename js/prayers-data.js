// Prayers Data for Bible Chantée - Version propre
const PRAYERS_BASE_URL = "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/";

const PRAYERS_DATA = {
  "FR": [
    { title: "Notre Père", audioFile: "FR_Notre Pere.mp3", lyricsFile: "FR_Notre Père.md" },
    { title: "D'Abord Je Te Cherche", audioFile: "FR_D'Abord Je Te Cherche.mp3", lyricsFile: "FR_D'Abord Je Te Cherche.md" },
    { title: "Prière de Délivrance", audioFile: "FR_Priere de delivrance.mp3", lyricsFile: "FR_Prière de délivrance.md" },
    { title: "Reconnaissance", audioFile: "FR_Reconnaissance.mp3", lyricsFile: "FR_Reconnaissance.md" },
    { title: "Tu Es Ma Protection", audioFile: "FR_Tu Es Ma Protection.mp3", lyricsFile: "FR_Tu Es Ma Protection.md" }
  ],
  "EN": [
    { title: "Our Father", audioFile: "EN_Our Father.mp3", lyricsFile: "EN_Our Father.md" },
    { title: "First I Seek You", audioFile: "EN_First I Seek You.mp3", lyricsFile: "EN_First I Seek You.md" },
    { title: "Gratitude", audioFile: "EN_Gratitude.mp3", lyricsFile: "EN_Gratitude.md" },
    { title: "Prayer of Deliverance", audioFile: "EN_Prayer of Deliverance.mp3", lyricsFile: "EN_Prayer of Deliverance.md" },
    { title: "You Are My Protection", audioFile: "EN_You Are My Protection.mp3", lyricsFile: "EN_You Are My Protection.md" },
    { title: "You Open Doors", audioFile: "EN_You Open Doors.mp3", lyricsFile: "EN_You Open Doors.md" }
  ],
  "ES": [
    { title: "Padre Nuestro", audioFile: "ES_Padre Nuestro.mp3", lyricsFile: "ES_Padre Nuestro.md" },
    { title: "Primero Te Busco", audioFile: "ES_Primero Te Busco.mp3", lyricsFile: "ES_Primero Te Busco.md" },
    { title: "Gratitud", audioFile: "ES_Gratitud.mp3", lyricsFile: "ES_Gratitud.md" },
    { title: "Oración de Liberación", audioFile: "ES_Oracion de Liberacion.mp3", lyricsFile: "ES_Oración de Liberación.md" },
    { title: "Tú Eres Mi Protección", audioFile: "ES_Tu Eres Mi Proteccion.mp3", lyricsFile: "ES_Tú Eres Mi Protección.md" },
    { title: "Abres Las Puertas", audioFile: "ES_Abres Las Puertas.mp3", lyricsFile: "ES_Abres Las Puertas.md" }
  ],
  "DE": [
    { title: "Vater Unser", audioFile: "DE_Vater Unser.mp3", lyricsFile: "DE_Vater Unser.md" },
    { title: "Zuerst Suche Ich Dich", audioFile: "DE_Zuerst Suche Ich Dich.mp3", lyricsFile: "DE_Zuerst Suche Ich Dich.md" },
    { title: "Dankbarkeit", audioFile: "DE_Dankbarkeit.mp3", lyricsFile: "DE_Dankbarkeit.md" },
    { title: "Gebet der Befreiung", audioFile: "DE_Gebet der Befreiung.mp3", lyricsFile: "DE_Gebet der Befreiung.md" },
    { title: "Du Bist Mein Schutz", audioFile: "DE_Du Bist Mein Schutz.mp3", lyricsFile: "DE_Du Bist Mein Schutz.md" },
    { title: "Du Öffnest Türen", audioFile: "DE_Du offnest Turen.mp3", lyricsFile: "DE_Du Öffnest Türen.md" }
  ],
  "IT": [
    { title: "Padre Nostro", audioFile: "IT_Padre Nostro.mp3", lyricsFile: "IT_Padre Nostro.md" },
    { title: "Gratitudine", audioFile: "IT_Gratitudine.mp3", lyricsFile: "IT_Gratitudine.md" },
    { title: "Preghiera di Liberazione", audioFile: "IT_Preghiera di Liberazione.mp3", lyricsFile: "IT_Preghiera di Liberazione.md" },
    { title: "Apri Le Porte", audioFile: "IT_Apri Le Porte.mp3", lyricsFile: "IT_Apri Le Porte.md" }
  ],
  "PT": [
    { title: "Gratidão", audioFile: "PT_Gratidao.mp3", lyricsFile: "PT_Gratidão.md" },
    { title: "Oração de Libertação", audioFile: "PT_Oracao de Libertacao.mp3", lyricsFile: "PT_Oração de Libertação.md" },
    { title: "Primeiro Eu Te Busco", audioFile: "PT_Primeiro Eu Te Busco.mp3", lyricsFile: "PT_Primeiro Eu Te Busco.md" },
    { title: "Tu És a Minha Proteção", audioFile: "PT_Tu es a Minha Protecao.mp3", lyricsFile: "PT_Tu És a Minha Proteção.md" }
  ],
  "TL": [
    { title: "Pasasalamat", audioFile: "TL_Pasasalamat.mp3", lyricsFile: "TL_Pasasalamat.md" },
    { title: "Panalangin ng Paglaya", audioFile: "TL_Panalangin ng Paglaya.mp3", lyricsFile: "TL_Panalangin ng Paglaya.md" },
    { title: "Binubuksan Mo Ang Pinto", audioFile: "TL_Binubuksan Mo Ang Pinto.mp3", lyricsFile: "TL_Binubuksan Mo Ang Pinto.md" },
    { title: "Ikaw ang Aking Proteksiyon", audioFile: "TL_Ikaw ang Aking Proteksiyon.mp3", lyricsFile: "TL_Ikaw ang Aking Proteksiyon.md" }
  ]
};

// Helper functions
window.getPrayersByLanguage = function(lang) {
  return PRAYERS_DATA[lang] || PRAYERS_DATA["FR"] || [];
};

window.getPrayerAudioUrl = function(filename) {
  return PRAYERS_BASE_URL + encodeURIComponent(filename);
};

window.getPrayerLyricsPath = function(filename) {
  return "lyrics/prayers/" + filename;
};
