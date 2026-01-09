// Prayers Data for Bible Chantée
// Audio files hosted on R2: https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/
// Lyrics files: ../lyrics/prayers/

const PRAYERS_BASE_URL = "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/";
const LYRICS_BASE_PATH = "lyrics/prayers/";

const PRAYERS_DATA = {
  "FR": [
    {
      title: "Notre Père",
      audioFile: "FR_Notre Père.mp3",
      lyricsFile: "FR_Notre Père.md"
    },
    {
      title: "D'Abord Je Te Cherche",
      audioFile: "FR_D'Abord Je Te Cherche.mp3",
      lyricsFile: "FR_D'Abord Je Te Cherche.md"
    },
    {
      title: "Prière de Délivrance",
      audioFile: "FR_Prière de délivrance.mp3",
      lyricsFile: "FR_Prière de délivrance.md"
    },
    {
      title: "Reconnaissance",
      audioFile: "FR_Reconnaissance.mp3",
      lyricsFile: "FR_Reconnaissance.md"
    },
    {
      title: "Tu Es Ma Protection",
      audioFile: "FR_Tu Es Ma Protection.mp3",
      lyricsFile: "FR_Tu Es Ma Protection.md"
    },
    {
      title: "Tu Ouvres Des Portes",
      audioFile: "FR_Tu Ouvres Des Portes.mp3",
      lyricsFile: null // Lyrics not available
    },
    {
      title: "Tu Ouvres Des Portes (v1)",
      audioFile: "FR_Tu Ouvres Des Portes_v1.mp3",
      lyricsFile: null
    },
    {
      title: "Tu Ouvres Des Portes (v2)",
      audioFile: "FR_Tu Ouvres Des Portes_v2.mp3",
      lyricsFile: null
    }
  ],
  "EN": [
    {
      title: "Our Father",
      audioFile: "EN_Our Father.mp3",
      lyricsFile: "EN_Our Father.md"
    },
    {
      title: "Our Father (v1)",
      audioFile: "EN_Our Father_v1.mp3",
      lyricsFile: "EN_Our Father.md"
    },
    {
      title: "First I Seek You",
      audioFile: "EN_First I Seek You.mp3",
      lyricsFile: "EN_First I Seek You.md"
    },
    {
      title: "Gratitude",
      audioFile: "EN_Gratitude.mp3",
      lyricsFile: "EN_Gratitude.md"
    },
    {
      title: "Prayer of Deliverance",
      audioFile: "EN_Prayer of Deliverance.mp3",
      lyricsFile: "EN_Prayer of Deliverance.md"
    },
    {
      title: "You Are My Protection",
      audioFile: "EN_You Are My Protection.mp3",
      lyricsFile: "EN_You Are My Protection.md"
    },
    {
      title: "You Open Doors",
      audioFile: "EN_You Open Doors.mp3",
      lyricsFile: "EN_You Open Doors.md"
    },
    {
      title: "You Open Doors (v1)",
      audioFile: "EN_You Open Doors_v1.mp3",
      lyricsFile: "EN_You Open Doors.md"
    },
    {
      title: "You Open Doors (v2)",
      audioFile: "EN_You Open Doors_v2.mp3",
      lyricsFile: "EN_You Open Doors.md"
    }
  ],
  "ES": [
    {
      title: "Padre Nuestro",
      audioFile: "ES_Padre Nuestro.mp3",
      lyricsFile: "ES_Padre Nuestro.md"
    },
    {
      title: "Padre Nuestro (v1)",
      audioFile: "ES_Padre Nuestro_v1.mp3",
      lyricsFile: "ES_Padre Nuestro.md"
    },
    {
      title: "Padre Nuestro (v2)",
      audioFile: "ES_Padre Nuestro_v2.mp3",
      lyricsFile: "ES_Padre Nuestro.md"
    },
    {
      title: "Abres Las Puertas",
      audioFile: "ES_Abres Las Puertas.mp3",
      lyricsFile: "ES_Abres Las Puertas.md"
    },
    {
      title: "Abres Las Puertas (v1)",
      audioFile: "ES_Abres Las Puertas_v1.mp3",
      lyricsFile: "ES_Abres Las Puertas.md"
    },
    {
      title: "Gratitud",
      audioFile: "ES_Gratitud.mp3",
      lyricsFile: "ES_Gratitud.md"
    },
    {
      title: "Oración de Liberación",
      audioFile: "ES_Oración de Liberación.mp3",
      lyricsFile: "ES_Oración de Liberación.md"
    },
    {
      title: "Oración de Liberación (v1)",
      audioFile: "ES_Oración de Liberación_v1.mp3",
      lyricsFile: "ES_Oración de Liberación.md"
    },
    {
      title: "Primero Te Busco",
      audioFile: "ES_Primero Te Busco.mp3",
      lyricsFile: "ES_Primero Te Busco.md"
    },
    {
      title: "Primero Te Busco (v1)",
      audioFile: "ES_Primero Te Busco_v1.mp3",
      lyricsFile: "ES_Primero Te Busco.md"
    },
    {
      title: "Tú Eres Mi Protección",
      audioFile: "ES_Tú Eres Mi Protección.mp3",
      lyricsFile: "ES_Tú Eres Mi Protección.md"
    }
  ],
  "DE": [
    {
      title: "Vater Unser",
      audioFile: "DE_Vater Unser.mp3",
      lyricsFile: "DE_Vater Unser.md"
    },
    {
      title: "Vater Unser (v1)",
      audioFile: "DE_Vater Unser_v1.mp3",
      lyricsFile: "DE_Vater Unser.md"
    },
    {
      title: "Vater Unser (v2)",
      audioFile: "DE_Vater Unser_v2.mp3",
      lyricsFile: "DE_Vater Unser.md"
    },
    {
      title: "Dankbarkeit",
      audioFile: "DE_Dankbarkeit.mp3",
      lyricsFile: "DE_Dankbarkeit.md"
    },
    {
      title: "Du Bist Mein Schutz",
      audioFile: "DE_Du Bist Mein Schutz.mp3",
      lyricsFile: "DE_Du Bist Mein Schutz.md"
    },
    {
      title: "Du Öffnest Türen",
      audioFile: "DE_Du Öffnest Türen.mp3",
      lyricsFile: "DE_Du Öffnest Türen.md"
    },
    {
      title: "Gebet der Befreiung",
      audioFile: "DE_Gebet der Befreiung.mp3",
      lyricsFile: "DE_Gebet der Befreiung.md"
    },
    {
      title: "Gebet der Befreiung (v1)",
      audioFile: "DE_Gebet der Befreiung_v1.mp3",
      lyricsFile: "DE_Gebet der Befreiung.md"
    },
    {
      title: "Zuerst Suche Ich Dich",
      audioFile: "DE_Zuerst Suche Ich Dich.mp3",
      lyricsFile: "DE_Zuerst Suche Ich Dich.md"
    }
  ],
  "IT": [
    {
      title: "Padre Nostro",
      audioFile: "IT_Padre Nostro.mp3",
      lyricsFile: "IT_Padre Nostro.md"
    },
    {
      title: "Padre Nostro (v1)",
      audioFile: "IT_Padre Nostro_v1.mp3",
      lyricsFile: "IT_Padre Nostro.md"
    },
    {
      title: "Apri Le Porte",
      audioFile: "IT_Apri Le Porte.mp3",
      lyricsFile: "IT_Apri Le Porte.md"
    },
    {
      title: "Gratitudine",
      audioFile: "IT_Gratitudine.mp3",
      lyricsFile: "IT_Gratitudine.md"
    },
    {
      title: "Preghiera di Liberazione",
      audioFile: "IT_Preghiera di Liberazione.mp3",
      lyricsFile: "IT_Preghiera di Liberazione.md"
    },
    {
      title: "Prima Ti Cerco",
      audioFile: "IT_Prima Ti Cerco.mp3",
      lyricsFile: "IT_Prima Ti Cerco.md"
    },
    {
      title: "Tu Sei La Mia Protezione",
      audioFile: "IT_Tu Sei La Mia Protezione.mp3",
      lyricsFile: "IT_Tu Sei La Mia Protezione.md"
    }
  ],
  "PT": [
    {
      title: "Pai Nosso",
      audioFile: "PT_Pai Nosso.mp3",
      lyricsFile: "PT_Pai Nosso.md"
    },
    {
      title: "Gratidão",
      audioFile: "PT_Gratidão.mp3",
      lyricsFile: "PT_Gratidão.md"
    },
    {
      title: "Oração de Libertação",
      audioFile: "PT_Oração de Libertação.mp3",
      lyricsFile: "PT_Oração de Libertação.md"
    },
    {
      title: "Primeiro Eu Te Busco",
      audioFile: "PT_Primeiro Eu Te Busco.mp3",
      lyricsFile: "PT_Primeiro Eu Te Busco.md"
    },
    {
      title: "Tu És a Minha Proteção",
      audioFile: "PT_Tu És a Minha Proteção.mp3",
      lyricsFile: "PT_Tu És a Minha Proteção.md"
    },
    {
      title: "Tu Abres Portas",
      audioFile: "PT_Tu Abres Portas.mp3",
      lyricsFile: null // Lyrics not available
    }
  ],
  "TL": [
    {
      title: "Ama Namin",
      audioFile: "TL_Ama Namin.mp3",
      lyricsFile: null // Lyrics not available
    },
    {
      title: "Ama Namin (v1)",
      audioFile: "TL_Ama Namin_v1.mp3",
      lyricsFile: null
    },
    {
      title: "Binubuksan Mo Ang Pinto",
      audioFile: "TL_Binubuksan Mo Ang Pinto.mp3",
      lyricsFile: "TL_Binubuksan Mo Ang Pinto.md"
    },
    {
      title: "Ikaw ang Aking Proteksiyon",
      audioFile: "TL_Ikaw ang Aking Proteksiyon.mp3",
      lyricsFile: "TL_Ikaw ang Aking Proteksiyon.md"
    },
    {
      title: "Panalangin ng Paglaya",
      audioFile: "TL_Panalangin ng Paglaya.mp3",
      lyricsFile: "TL_Panalangin ng Paglaya.md"
    },
    {
      title: "Pasasalamat",
      audioFile: "TL_Pasasalamat.mp3",
      lyricsFile: "TL_Pasasalamat.md"
    },
    {
      title: "Una Kitang Hinahanap",
      audioFile: "TL_Una Kitang Hinahanap.mp3",
      lyricsFile: "TL_Una Kitang Hinahanap.md"
    }
  ]
};

// Language metadata
const LANGUAGE_INFO = {
  "FR": { name: "Français", flag: "🇫🇷" },
  "EN": { name: "English", flag: "🇬🇧" },
  "ES": { name: "Español", flag: "🇪🇸" },
  "DE": { name: "Deutsch", flag: "🇩🇪" },
  "IT": { name: "Italiano", flag: "🇮🇹" },
  "PT": { name: "Português", flag: "🇵🇹" },
  "TL": { name: "Tagalog", flag: "🇵🇭" }
};

// Get audio URL for a prayer
function getPrayerAudioUrl(audioFile) {
  return PRAYERS_BASE_URL + encodeURIComponent(audioFile);
}

// Get lyrics path for a prayer
function getPrayerLyricsPath(lyricsFile) {
  return lyricsFile ? LYRICS_BASE_PATH + lyricsFile : null;
}

// Get all prayers for a specific language
function getPrayersByLanguage(lang) {
  return PRAYERS_DATA[lang] || [];
}

// Get total count of prayers
function getTotalPrayersCount() {
  return Object.values(PRAYERS_DATA).reduce((sum, prayers) => sum + prayers.length, 0);
}

// Export for use in prayers.html
if (typeof window !== 'undefined') {
  window.PRAYERS_DATA = PRAYERS_DATA;
  window.LANGUAGE_INFO = LANGUAGE_INFO;
  window.getPrayerAudioUrl = getPrayerAudioUrl;
  window.getPrayerLyricsPath = getPrayerLyricsPath;
  window.getPrayersByLanguage = getPrayersByLanguage;
  window.getTotalPrayersCount = getTotalPrayersCount;
}
