// sections-promesses.js
// Mapping des sections thematiques vers les chapitres bibliques
// Utilise par lecteur.html pour afficher un menu de section au lieu des 66 livres

window.PROMESSES_SECTIONS = {
    // Section 0: Anxiete et Peur
    anxiete: [
        { book: "19", chapter: "23", labelKey: "psalm" },
        { book: "19", chapter: "27", labelKey: "psalm" },
        { book: "19", chapter: "46", labelKey: "psalm" },
        { book: "19", chapter: "91", labelKey: "psalm" }
    ],
    // Section 1: Paix et Repos
    paix: [
        { book: "19", chapter: "4", labelKey: "psalm" },
        { book: "19", chapter: "23", labelKey: "psalm" },
        { book: "19", chapter: "37", labelKey: "psalm" },
        { book: "19", chapter: "131", labelKey: "psalm" }
    ],
    // Section 2: Louange et Gratitude
    louange: [
        { book: "19", chapter: "100", labelKey: "psalm" },
        { book: "19", chapter: "103", labelKey: "psalm" },
        { book: "19", chapter: "145", labelKey: "psalm" },
        { book: "19", chapter: "150", labelKey: "psalm" }
    ],
    // Section 3: Protection
    protection: [
        { book: "19", chapter: "91", labelKey: "psalm" },
        { book: "19", chapter: "121", labelKey: "psalm" },
        { book: "19", chapter: "125", labelKey: "psalm" },
        { book: "19", chapter: "144", labelKey: "psalm" }
    ],
    // Section 4: Tristesse et Deuil
    tristesse: [
        { book: "19", chapter: "30", labelKey: "psalm" },
        { book: "19", chapter: "34", labelKey: "psalm" },
        { book: "19", chapter: "42", labelKey: "psalm" },
        { book: "19", chapter: "130", labelKey: "psalm" }
    ],
    // Section 5: Force et Courage
    force: [
        { book: "19", chapter: "18", labelKey: "psalm" },
        { book: "19", chapter: "27", labelKey: "psalm" },
        { book: "19", chapter: "46", labelKey: "psalm" },
        { book: "19", chapter: "144", labelKey: "psalm" }
    ],
    // Section 6: Confiance en Dieu
    confiance: [
        { book: "19", chapter: "37", labelKey: "psalm" },
        { book: "19", chapter: "62", labelKey: "psalm" },
        { book: "19", chapter: "125", labelKey: "psalm" },
        { book: "19", chapter: "131", labelKey: "psalm" }
    ],
    // Section 7: Amour de Dieu
    amour: [
        { book: "19", chapter: "103", labelKey: "psalm" },
        { book: "19", chapter: "145", labelKey: "psalm" },
        { book: "19", chapter: "147", labelKey: "psalm" },
        { book: "19", chapter: "148", labelKey: "psalm" }
    ],
    // Section 8: Esperance
    esperance: [
        { book: "19", chapter: "27", labelKey: "psalm" },
        { book: "19", chapter: "42", labelKey: "psalm" },
        { book: "19", chapter: "62", labelKey: "psalm" },
        { book: "19", chapter: "130", labelKey: "psalm" }
    ],
    // Section 9: Adoration
    adoration: [
        { book: "19", chapter: "100", labelKey: "psalm" },
        { book: "19", chapter: "148", labelKey: "psalm" },
        { book: "19", chapter: "150", labelKey: "psalm" }
    ]
};

// Labels des sections par langue
window.PROMESSES_SECTION_LABELS = {
    FR: {
        anxiete: "Anxiete et Peur",
        paix: "Paix et Repos",
        louange: "Louange et Gratitude",
        protection: "Protection",
        tristesse: "Tristesse et Deuil",
        force: "Force et Courage",
        confiance: "Confiance en Dieu",
        amour: "Amour de Dieu",
        esperance: "Esperance",
        adoration: "Adoration",
        psalm: "Psaume"
    },
    EN: {
        anxiete: "Anxiety and Fear",
        paix: "Peace and Rest",
        louange: "Praise and Gratitude",
        protection: "Protection",
        tristesse: "Sadness and Grief",
        force: "Strength and Courage",
        confiance: "Trust in God",
        amour: "God's Love",
        esperance: "Hope",
        adoration: "Worship",
        psalm: "Psalm"
    },
    PT: {
        anxiete: "Ansiedade e Medo",
        paix: "Paz e Descanso",
        louange: "Louvor e Gratidao",
        protection: "Protecao",
        tristesse: "Tristeza e Luto",
        force: "Forca e Coragem",
        confiance: "Confianca em Deus",
        amour: "Amor de Deus",
        esperance: "Esperanca",
        adoration: "Adoracao",
        psalm: "Salmo"
    },
    ES: {
        anxiete: "Ansiedad y Miedo",
        paix: "Paz y Descanso",
        louange: "Alabanza y Gratitud",
        protection: "Proteccion",
        tristesse: "Tristeza y Duelo",
        force: "Fuerza y Valor",
        confiance: "Confianza en Dios",
        amour: "Amor de Dios",
        esperance: "Esperanza",
        adoration: "Adoracion",
        psalm: "Salmo"
    },
    DE: {
        anxiete: "Angst und Furcht",
        paix: "Frieden und Ruhe",
        louange: "Lob und Dankbarkeit",
        protection: "Schutz",
        tristesse: "Trauer und Leid",
        force: "Starke und Mut",
        confiance: "Vertrauen auf Gott",
        amour: "Gottes Liebe",
        esperance: "Hoffnung",
        adoration: "Anbetung",
        psalm: "Psalm"
    },
    IT: {
        anxiete: "Ansia e Paura",
        paix: "Pace e Riposo",
        louange: "Lode e Gratitudine",
        protection: "Protezione",
        tristesse: "Tristezza e Lutto",
        force: "Forza e Coraggio",
        confiance: "Fiducia in Dio",
        amour: "Amore di Dio",
        esperance: "Speranza",
        adoration: "Adorazione",
        psalm: "Salmo"
    },
    AR: {
        anxiete: "القلق والخوف",
        paix: "السلام والراحة",
        louange: "التسبيح والشكر",
        protection: "الحماية",
        tristesse: "الحزن والاسى",
        force: "القوة والشجاعة",
        confiance: "الثقة بالله",
        amour: "محبة الله",
        esperance: "الرجاء",
        adoration: "العبادة",
        psalm: "مزمور"
    },
    RU: {
        anxiete: "Тревога и страх",
        paix: "Мир и покой",
        louange: "Хвала и благодарность",
        protection: "Защита",
        tristesse: "Печаль и скорбь",
        force: "Сила и мужество",
        confiance: "Доверие Богу",
        amour: "Любовь Божья",
        esperance: "Надежда",
        adoration: "Поклонение",
        psalm: "Псалом"
    },
    ZH: {
        anxiete: "焦虑与恐惧",
        paix: "平安与安息",
        louange: "赞美与感恩",
        protection: "保护",
        tristesse: "悲伤与哀痛",
        force: "力量与勇气",
        confiance: "信靠神",
        amour: "神的爱",
        esperance: "盼望",
        adoration: "敬拜",
        psalm: "诗篇"
    },
    HI: {
        anxiete: "चिंता और भय",
        paix: "शांति और विश्राम",
        louange: "स्तुति और कृतज्ञता",
        protection: "सुरक्षा",
        tristesse: "दुख और शोक",
        force: "शक्ति और साहस",
        confiance: "परमेश्वर पर भरोसा",
        amour: "परमेश्वर का प्रेम",
        esperance: "आशा",
        adoration: "आराधना",
        psalm: "भजन"
    },
    TL: {
        anxiete: "Pagkabalisa at Takot",
        paix: "Kapayapaan at Pahinga",
        louange: "Papuri at Pasasalamat",
        protection: "Proteksyon",
        tristesse: "Kalungkutan",
        force: "Lakas at Tapang",
        confiance: "Pagtitiwala sa Diyos",
        amour: "Pag-ibig ng Diyos",
        esperance: "Pag-asa",
        adoration: "Pagsamba",
        psalm: "Awit"
    },
    KO: {
        anxiete: "불안과 두려움",
        paix: "평화와 안식",
        louange: "찬양과 감사",
        protection: "보호",
        tristesse: "슬픔과 애도",
        force: "힘과 용기",
        confiance: "하나님을 신뢰",
        amour: "하나님의 사랑",
        esperance: "소망",
        adoration: "예배",
        psalm: "시편"
    }
};

// Mapping index theme -> section key (pour compatibilite avec promesse-detail.html)
window.PROMESSES_THEME_INDEX_TO_KEY = [
    'anxiete',   // 0
    'paix',      // 1
    'louange',   // 2
    'protection', // 3
    'tristesse', // 4
    'force',     // 5
    'confiance', // 6
    'amour',     // 7
    'esperance', // 8
    'adoration'  // 9
];

// Sous-titres des Psaumes par langue
window.PSALM_SUBTITLES = {
    4: { FR: "Paix dans la nuit", EN: "Peace at night", PT: "Paz na noite", ES: "Paz en la noche", DE: "Frieden in der Nacht", IT: "Pace nella notte" },
    18: { FR: "Dieu mon rocher", EN: "God my rock", PT: "Deus minha rocha", ES: "Dios mi roca", DE: "Gott mein Fels", IT: "Dio mia roccia" },
    23: { FR: "L'Eternel est mon berger", EN: "The Lord is my shepherd", PT: "O Senhor e meu pastor", ES: "El Senor es mi pastor", DE: "Der Herr ist mein Hirte", IT: "Il Signore e il mio pastore" },
    27: { FR: "L'Eternel est ma lumiere", EN: "The Lord is my light", PT: "O Senhor e minha luz", ES: "El Senor es mi luz", DE: "Der Herr ist mein Licht", IT: "Il Signore e la mia luce" },
    30: { FR: "La joie vient le matin", EN: "Joy comes in the morning", PT: "A alegria vem pela manha", ES: "El gozo viene por la manana", DE: "Freude kommt am Morgen", IT: "La gioia viene al mattino" },
    34: { FR: "Goutez et voyez", EN: "Taste and see", PT: "Provai e vede", ES: "Gustad y ved", DE: "Schmecket und sehet", IT: "Gustate e vedete" },
    37: { FR: "Confie-toi en l'Eternel", EN: "Trust in the Lord", PT: "Confia no Senhor", ES: "Confia en el Senor", DE: "Vertraue auf den Herrn", IT: "Confida nel Signore" },
    42: { FR: "Mon ame a soif de Dieu", EN: "My soul thirsts for God", PT: "Minha alma tem sede de Deus", ES: "Mi alma tiene sed de Dios", DE: "Meine Seele durstet nach Gott", IT: "L'anima mia ha sete di Dio" },
    46: { FR: "Dieu est notre refuge", EN: "God is our refuge", PT: "Deus e nosso refugio", ES: "Dios es nuestro refugio", DE: "Gott ist unsere Zuflucht", IT: "Dio e il nostro rifugio" },
    62: { FR: "Mon ame se confie en Dieu", EN: "My soul trusts in God", PT: "Minha alma confia em Deus", ES: "Mi alma confia en Dios", DE: "Meine Seele vertraut auf Gott", IT: "L'anima mia confida in Dio" },
    91: { FR: "A l'abri du Tres-Haut", EN: "Shelter of the Most High", PT: "Abrigo do Altissimo", ES: "Abrigo del Altisimo", DE: "Im Schutz des Hochsten", IT: "Al riparo dell'Altissimo" },
    100: { FR: "Acclamez l'Eternel", EN: "Shout for joy", PT: "Aclamai ao Senhor", ES: "Aclamad al Senor", DE: "Jauchzet dem Herrn", IT: "Acclamate il Signore" },
    103: { FR: "Benis l'Eternel mon ame", EN: "Bless the Lord O my soul", PT: "Bendize o Senhor minha alma", ES: "Bendice al Senor alma mia", DE: "Lobe den Herrn meine Seele", IT: "Benedici il Signore anima mia" },
    121: { FR: "Mon secours vient de l'Eternel", EN: "My help comes from the Lord", PT: "O meu socorro vem do Senhor", ES: "Mi socorro viene del Senor", DE: "Meine Hilfe kommt vom Herrn", IT: "Il mio aiuto viene dal Signore" },
    125: { FR: "Ceux qui se confient", EN: "Those who trust", PT: "Os que confiam", ES: "Los que confian", DE: "Die auf den Herrn vertrauen", IT: "Quelli che confidano" },
    130: { FR: "Des profondeurs", EN: "Out of the depths", PT: "Das profundezas", ES: "De lo profundo", DE: "Aus der Tiefe", IT: "Dal profondo" },
    131: { FR: "Mon coeur n'est pas orgueilleux", EN: "My heart is not proud", PT: "Meu coracao nao e soberbo", ES: "Mi corazon no es soberbio", DE: "Mein Herz ist nicht stolz", IT: "Il mio cuore non e superbo" },
    144: { FR: "Mon rocher et ma forteresse", EN: "My rock and fortress", PT: "Minha rocha e fortaleza", ES: "Mi roca y fortaleza", DE: "Mein Fels und meine Burg", IT: "La mia rocca e la mia fortezza" },
    145: { FR: "Je t'exalterai mon Dieu", EN: "I will exalt You my God", PT: "Eu te exaltarei meu Deus", ES: "Te exaltare mi Dios", DE: "Ich will dich erheben mein Gott", IT: "Ti esaltero mio Dio" },
    147: { FR: "Louez l'Eternel", EN: "Praise the Lord", PT: "Louvai ao Senhor", ES: "Alabad al Senor", DE: "Lobet den Herrn", IT: "Lodate il Signore" },
    148: { FR: "Que tout ce qui respire loue", EN: "Let everything praise", PT: "Tudo que respira louve", ES: "Todo lo que respira alabe", DE: "Alles was Odem hat lobe", IT: "Ogni cosa che respira lodi" },
    150: { FR: "Louez Dieu dans son sanctuaire", EN: "Praise God in His sanctuary", PT: "Louvai a Deus no seu santuario", ES: "Alabad a Dios en su santuario", DE: "Lobt Gott in seinem Heiligtum", IT: "Lodate Dio nel suo santuario" }
};
