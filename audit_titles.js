const fs = require('fs');

// Charger tous les fichiers de titres
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

// Patterns de placeholders à détecter
const placeholderPatterns = [
  /^LYRICS$/,
  /^TITLE$/,
  /^TITRE$/,
  /^Verse \d+$/,
  /^Verso \d+$/,
  /^Couplet \d+$/,
  /^Verset \d+$/,
  /^\[.*\]$/,  // Anything in brackets
  /^undefined$/,
  /^null$/
];

function isPlaceholder(title) {
  if (!title || title.trim() === '') return true;
  return placeholderPatterns.some(pattern => pattern.test(title));
}

function cleanFRTitle(title) {
  if (!title) return '';
  // Enlever les préfixes comme "Genèse 1 - " ou livre/chapitre
  title = title.replace(/^[^-]+ - [""]?(.+)[""]?$/, '$1');
  // Enlever guillemets
  title = title.replace(/^[""]|[""]$/g, '');
  return title.trim();
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('         AUDIT COMPLET DES TITRES - BIBLE CHANTÉE');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log(`Référence: FR avec ${Object.keys(fr).reduce((sum, book) => sum + Object.keys(fr[book]).length, 0)} titres`);
console.log('');

const report = {
  missing: {},
  placeholders: {},
  summary: {}
};

// Auditer chaque langue
for (const [lang, data] of Object.entries(languages)) {
  report.missing[lang] = [];
  report.placeholders[lang] = [];

  let totalMissing = 0;
  let totalPlaceholders = 0;

  // Vérifier tous les livres et chapitres de FR
  for (const book in fr) {
    for (const chapter in fr[book]) {
      const titleFR = fr[book][chapter];
      const titleLang = data[book] && data[book][chapter];

      // Titre complètement manquant
      if (!titleLang) {
        report.missing[lang].push({
          book,
          chapter,
          titleFR: cleanFRTitle(titleFR)
        });
        totalMissing++;
      }
      // Titre présent mais placeholder
      else if (isPlaceholder(titleLang)) {
        report.placeholders[lang].push({
          book,
          chapter,
          placeholder: titleLang,
          titleFR: cleanFRTitle(titleFR)
        });
        totalPlaceholders++;
      }
    }
  }

  report.summary[lang] = {
    missing: totalMissing,
    placeholders: totalPlaceholders,
    total: totalMissing + totalPlaceholders
  };
}

// Afficher le rapport
console.log('═══════════════════════════════════════════════════════════════');
console.log('RÉSUMÉ PAR LANGUE');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

for (const [lang, summary] of Object.entries(report.summary)) {
  console.log(`${lang}:`);
  console.log(`  - Titres manquants: ${summary.missing}`);
  console.log(`  - Placeholders: ${summary.placeholders}`);
  console.log(`  - TOTAL à corriger: ${summary.total}`);
  console.log('');
}

// Détails des titres manquants
console.log('═══════════════════════════════════════════════════════════════');
console.log('DÉTAILS DES TITRES MANQUANTS ET PLACEHOLDERS');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

for (const [lang, items] of Object.entries(report.missing)) {
  if (items.length > 0) {
    console.log(`\n━━━ ${lang}: ${items.length} TITRES MANQUANTS ━━━\n`);
    items.forEach((item, index) => {
      console.log(`${index + 1}. Livre ${item.book} Ch ${item.chapter}`);
      console.log(`   FR: "${item.titleFR}"`);
    });
  }
}

for (const [lang, items] of Object.entries(report.placeholders)) {
  if (items.length > 0) {
    console.log(`\n━━━ ${lang}: ${items.length} PLACEHOLDERS ━━━\n`);
    items.forEach((item, index) => {
      console.log(`${index + 1}. Livre ${item.book} Ch ${item.chapter}`);
      console.log(`   Placeholder: "${item.placeholder}"`);
      console.log(`   FR: "${item.titleFR}"`);
    });
  }
}

// Sauvegarder le rapport JSON pour le script de complétion
fs.writeFileSync('./audit_report.json', JSON.stringify(report, null, 2));

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('Rapport JSON sauvegardé: audit_report.json');
console.log('═══════════════════════════════════════════════════════════════');
