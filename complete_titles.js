const fs = require('fs');

// Charger le rapport d'audit et les fichiers de titres
const auditReport = require('./audit_report.json');
const fr = require('./titles/FR.json');
const en = require('./titles/EN.json');
const pt = require('./titles/PT.json');
const es = require('./titles/ES.json');
const de = require('./titles/DE.json');
const it = require('./titles/IT.json');
const tl = require('./titles/TL.json');

const languages = {
  EN: en,
  PT: pt,
  ES: es,
  DE: de,
  IT: it,
  TL: tl
};

// Fonction de nettoyage du titre FR
function cleanFRTitle(title) {
  if (!title) return '';
  title = title.replace(/^[^-]+ - [""]?(.+)[""]?$/, '$1');
  title = title.replace(/^[""]|[""]$/g, '');
  return title.trim();
}

// Dictionnaire de traductions mot-à-mot
const translations = {
  // Verbes et actions
  "Chant": { EN: "Song", PT: "Canto", ES: "Canto", DE: "Lied", IT: "Canto", TL: "Awit" },
  "Danse": { EN: "Dance", PT: "Dança", ES: "Danza", DE: "Tanz", IT: "Danza", TL: "Sayaw" },
  "Louange": { EN: "Praise", PT: "Louvor", ES: "Alabanza", DE: "Lobpreis", IT: "Lode", TL: "Papuri" },
  "Garde": { EN: "Guard", PT: "Guarda", ES: "Guarda", DE: "Bewahre", IT: "Custodisci", TL: "Bantayan" },
  "Guide": { EN: "Guide", PT: "Guia", ES: "Guía", DE: "Führe", IT: "Guida", TL: "Gabay" },
  "Bâtissons": { EN: "Let Us Build", PT: "Construamos", ES: "Construyamos", DE: "Lasst uns bauen", IT: "Costruiamo", TL: "Magtayo Tayo" },
  "Revenons": { EN: "Let Us Return", PT: "Voltemos", ES: "Volvamos", DE: "Kehren wir zurück", IT: "Torniamo", TL: "Bumalik Tayo" },

  // Noms divins et titres
  "Éternel": { EN: "Eternal", PT: "Eterno", ES: "Eterno", DE: "Ewiger", IT: "Eterno", TL: "Walang Hanggan" },
  "l'Éternel": { EN: "the Eternal", PT: "o Eterno", ES: "el Eterno", DE: "der Ewige", IT: "l'Eterno", TL: "ang Walang Hanggan" },
  "Dieu": { EN: "God", PT: "Deus", ES: "Dios", DE: "Gott", IT: "Dio", TL: "Diyos" },
  "Seigneur": { EN: "Lord", PT: "Senhor", ES: "Señor", DE: "Herr", IT: "Signore", TL: "Panginoon" },
  "Roi": { EN: "King", PT: "Rei", ES: "Rey", DE: "König", IT: "Re", TL: "Hari" },
  "Sauveur": { EN: "Savior", PT: "Salvador", ES: "Salvador", DE: "Retter", IT: "Salvatore", TL: "Tagapagligtas" },
  "Rédempteur": { EN: "Redeemer", PT: "Redentor", ES: "Redentor", DE: "Erlöser", IT: "Redentore", TL: "Manunubos" },

  // Concepts spirituels
  "Grâce": { EN: "Grace", PT: "Graça", ES: "Gracia", DE: "Gnade", IT: "Grazia", TL: "Biyaya" },
  "Gloire": { EN: "Glory", PT: "Glória", ES: "Gloria", DE: "Herrlichkeit", IT: "Gloria", TL: "Kaluwalhatian" },
  "Victoire": { EN: "Victory", PT: "Vitória", ES: "Victoria", DE: "Sieg", IT: "Vittoria", TL: "Tagumpay" },
  "Lumière": { EN: "Light", PT: "Luz", ES: "Luz", DE: "Licht", IT: "Luce", TL: "Liwanag" },
  "Ténèbres": { EN: "Darkness", PT: "Trevas", ES: "Tinieblas", DE: "Finsternis", IT: "Tenebre", TL: "Kadiliman" },
  "Paix": { EN: "Peace", PT: "Paz", ES: "Paz", DE: "Friede", IT: "Pace", TL: "Kapayapaan" },
  "Amour": { EN: "Love", PT: "Amor", ES: "Amor", DE: "Liebe", IT: "Amore", TL: "Pag-ibig" },
  "Foi": { EN: "Faith", PT: "Fé", ES: "Fe", DE: "Glaube", IT: "Fede", TL: "Pananampalataya" },
  "Espérance": { EN: "Hope", PT: "Esperança", ES: "Esperanza", DE: "Hoffnung", IT: "Speranza", TL: "Pag-asa" },
  "Sagesse": { EN: "Wisdom", PT: "Sabedoria", ES: "Sabiduría", DE: "Weisheit", IT: "Saggezza", TL: "Karunungan" },
  "Justice": { EN: "Justice", PT: "Justiça", ES: "Justicia", DE: "Gerechtigkeit", IT: "Giustizia", TL: "Katarungan" },
  "Miséricorde": { EN: "Mercy", PT: "Misericórdia", ES: "Misericordia", DE: "Barmherzigkeit", IT: "Misericordia", TL: "Awa" },

  // Lieux et concepts
  "Maison": { EN: "House", PT: "Casa", ES: "Casa", DE: "Haus", IT: "Casa", TL: "Bahay" },
  "Temple": { EN: "Temple", PT: "Templo", ES: "Templo", DE: "Tempel", IT: "Tempio", TL: "Templo" },
  "Refuge": { EN: "Refuge", PT: "Refúgio", ES: "Refugio", DE: "Zuflucht", IT: "Rifugio", TL: "Kanlungan" },
  "Rocher": { EN: "Rock", PT: "Rocha", ES: "Roca", DE: "Fels", IT: "Roccia", TL: "Bato" },
  "Cœur": { EN: "Heart", PT: "Coração", ES: "Corazón", DE: "Herz", IT: "Cuore", TL: "Puso" },
  "Âme": { EN: "Soul", PT: "Alma", ES: "Alma", DE: "Seele", IT: "Anima", TL: "Kaluluwa" },

  // Expressions courantes
  "dans": { EN: "in", PT: "em", ES: "en", DE: "in", IT: "in", TL: "sa" },
  "de": { EN: "of", PT: "de", ES: "de", DE: "von", IT: "di", TL: "ng" },
  "notre": { EN: "our", PT: "nosso", ES: "nuestro", DE: "unser", IT: "nostro", TL: "ating" },
  "mon": { EN: "my", PT: "meu", ES: "mi", DE: "mein", IT: "mio", TL: "aking" },
  "ta": { EN: "your", PT: "tua", ES: "tu", DE: "dein", IT: "tua", TL: "iyong" }
};

// Traduction automatique mot-à-mot avec dictionnaire
function translate(titleFR, targetLang) {
  let titleClean = cleanFRTitle(titleFR);

  // Traduction mot-à-mot
  for (const [frWord, langMap] of Object.entries(translations)) {
    if (langMap[targetLang]) {
      // Remplacer le mot exact avec respect de la casse
      const regex = new RegExp(`\\b${frWord}\\b`, 'gi');
      titleClean = titleClean.replace(regex, (match) => {
        // Garder la même casse (majuscule au début)
        const translation = langMap[targetLang];
        if (match[0] === match[0].toUpperCase()) {
          return translation.charAt(0).toUpperCase() + translation.slice(1);
        }
        return translation;
      });
    }
  }

  return titleClean;
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('      COMPLÉTION AUTOMATIQUE DES TITRES MANQUANTS');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

let totalFixed = 0;
const stats = {};

// Compléter les titres manquants pour chaque langue
for (const [lang, items] of Object.entries(auditReport.missing)) {
  if (items.length === 0) continue;

  console.log(`\n━━━ ${lang}: ${items.length} titres à compléter ━━━\n`);

  stats[lang] = 0;
  const langData = languages[lang];

  for (const item of items) {
    const { book, chapter, titleFR } = item;

    // Créer le livre s'il n'existe pas
    if (!langData[book]) {
      langData[book] = {};
    }

    // Traduire et ajouter le titre
    const translatedTitle = translate(titleFR, lang);
    langData[book][chapter] = translatedTitle;

    stats[lang]++;
    totalFixed++;

    // Afficher les 5 premiers pour chaque langue
    if (stats[lang] <= 5) {
      console.log(`  ${stats[lang]}. Livre ${book} Ch ${chapter}: "${translatedTitle}"`);
    }
  }

  if (stats[lang] > 5) {
    console.log(`  ... et ${stats[lang] - 5} autres`);
  }

  // Sauvegarder le fichier
  fs.writeFileSync(`./titles/${lang}.json`, JSON.stringify(langData, null, 2));
  console.log(`  ✓ Fichier ./titles/${lang}.json mis à jour`);
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('RÉSUMÉ DE LA COMPLÉTION');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

for (const [lang, count] of Object.entries(stats)) {
  console.log(`${lang}: ${count} titres ajoutés`);
}

console.log('');
console.log(`TOTAL: ${totalFixed} titres complétés`);

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('Prochaine étape: Régénérer js/chapter-titles.js');
console.log('Commande: python extract_v3.py');
console.log('═══════════════════════════════════════════════════════════════');
