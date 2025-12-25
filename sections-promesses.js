// sections-promesses.js
// Bible Chantée – Sections thématiques "Promesses"
// Utilisé par lecteur.html (menu de section + retour + sous-titres)

(function () {
  "use strict";

  // ================================
  // 1. SECTIONS → CHAPITRES
  // ================================
  // book = numéro du livre (string)
  // chapter = numéro du chapitre (number)
  window.PROMESSES_SECTIONS = {
    anxiete: [
      { book: "19", chapter: 23 },
      { book: "19", chapter: 27 },
      { book: "19", chapter: 46 },
      { book: "19", chapter: 91 }
    ],
    paix: [
      { book: "19", chapter: 4 },
      { book: "19", chapter: 23 },
      { book: "19", chapter: 37 },
      { book: "19", chapter: 131 }
    ],
    louange: [
      { book: "19", chapter: 100 },
      { book: "19", chapter: 103 },
      { book: "19", chapter: 145 },
      { book: "19", chapter: 150 }
    ],
    protection: [
      { book: "19", chapter: 91 },
      { book: "19", chapter: 121 },
      { book: "19", chapter: 125 },
      { book: "19", chapter: 144 }
    ],
    tristesse: [
      { book: "19", chapter: 30 },
      { book: "19", chapter: 34 },
      { book: "19", chapter: 42 },
      { book: "19", chapter: 130 }
    ],
    force: [
      { book: "19", chapter: 18 },
      { book: "19", chapter: 27 },
      { book: "19", chapter: 46 },
      { book: "19", chapter: 144 }
    ],
    confiance: [
      { book: "19", chapter: 37 },
      { book: "19", chapter: 62 },
      { book: "19", chapter: 125 },
      { book: "19", chapter: 131 }
    ],
    amour: [
      { book: "19", chapter: 103 },
      { book: "19", chapter: 145 },
      { book: "19", chapter: 147 },
      { book: "19", chapter: 148 }
    ],
    esperance: [
      { book: "19", chapter: 27 },
      { book: "19", chapter: 42 },
      { book: "19", chapter: 62 },
      { book: "19", chapter: 130 }
    ],
    adoration: [
      { book: "19", chapter: 100 },
      { book: "19", chapter: 148 },
      { book: "19", chapter: 150 }
    ]
  };

  // ================================
  // 2. LIBELLÉS DES SECTIONS (UI)
  // ================================
  window.PROMESSES_SECTION_LABELS = {
    FR: {
      anxiete: "Anxiété et peur",
      paix: "Paix et repos",
      louange: "Louange et gratitude",
      protection: "Protection",
      tristesse: "Tristesse et deuil",
      force: "Force et courage",
      confiance: "Confiance en Dieu",
      amour: "Amour de Dieu",
      esperance: "Espérance",
      adoration: "Adoration",
      psalm: "Psaume"
    },
    EN: {
      anxiete: "Anxiety and fear",
      paix: "Peace and rest",
      louange: "Praise and gratitude",
      protection: "Protection",
      tristesse: "Grief and sorrow",
      force: "Strength and courage",
      confiance: "Trust in God",
      amour: "God’s love",
      esperance: "Hope",
      adoration: "Worship",
      psalm: "Psalm"
    },
    PT: {
      anxiete: "Ansiedade e medo",
      paix: "Paz e descanso",
      louange: "Louvor e gratidão",
      protection: "Proteção",
      tristesse: "Tristeza e luto",
      force: "Força e coragem",
      confiance: "Confiança em Deus",
      amour: "Amor de Deus",
      esperance: "Esperança",
      adoration: "Adoração",
      psalm: "Salmo"
    }
  };

  // ================================
  // 3. INDEX → SECTION (COMPAT)
  // ================================
  window.PROMESSES_THEME_INDEX_TO_KEY = [
    "anxiete",
    "paix",
    "louange",
    "protection",
    "tristesse",
    "force",
    "confiance",
    "amour",
    "esperance",
    "adoration"
  ];

  // ================================
  // 4. SOUS-TITRES DES PSAUMES
  // ================================
  window.PSALM_SUBTITLES = {
    23: { FR: "L’Éternel est mon berger", EN: "The Lord is my shepherd", PT: "O Senhor é meu pastor" },
    27: { FR: "L’Éternel est ma lumière", EN: "The Lord is my light", PT: "O Senhor é minha luz" },
    30: { FR: "La joie vient le matin", EN: "Joy comes in the morning", PT: "A alegria vem pela manhã" },
    34: { FR: "Goûtez et voyez", EN: "Taste and see", PT: "Provai e vede" },
    37: { FR: "Confie-toi en l’Éternel", EN: "Trust in the Lord", PT: "Confia no Senhor" },
    42: { FR: "Mon âme a soif de Dieu", EN: "My soul thirsts for God", PT: "Minha alma tem sede de Deus" },
    46: { FR: "Dieu est notre refuge", EN: "God is our refuge", PT: "Deus é o nosso refúgio" },
    62: { FR: "Mon âme se confie en Dieu", EN: "My soul trusts in God", PT: "Minha alma confia em Deus" },
    91: { FR: "À l’abri du Très-Haut", EN: "Shelter of the Most High", PT: "À sombra do Altíssimo" },
    100:{ FR: "Acclamez l’Éternel", EN: "Shout for joy", PT: "Aclamai ao Senhor" },
    103:{ FR: "Bénis l’Éternel mon âme", EN: "Bless the Lord", PT: "Bendize o Senhor" },
    121:{ FR: "Mon secours vient de l’Éternel", EN: "My help comes from the Lord", PT: "O meu socorro vem do Senhor" },
    125:{ FR: "Ceux qui se confient", EN: "Those who trust", PT: "Os que confiam" },
    130:{ FR: "Des profondeurs", EN: "Out of the depths", PT: "Das profundezas" },
    131:{ FR: "Mon cœur n’est pas orgueilleux", EN: "My heart is not proud", PT: "Meu coração não é soberbo" },
    144:{ FR: "Mon rocher et ma forteresse", EN: "My rock and fortress", PT: "Minha rocha e fortaleza" },
    145:{ FR: "Je t’exalterai mon Dieu", EN: "I will exalt You", PT: "Eu te exaltarei" },
    147:{ FR: "Louez l’Éternel", EN: "Praise the Lord", PT: "Louvai ao Senhor" },
    148:{ FR: "Que tout ce qui respire loue", EN: "Let everything praise", PT: "Tudo que respira louve" },
    150:{ FR: "Louez Dieu dans son sanctuaire", EN: "Praise God in His sanctuary", PT: "Louvai a Deus no seu santuário" }
  };

  console.log("[sections-promesses] chargé correctement");
})();
