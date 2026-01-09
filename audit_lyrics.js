const fs = require('fs');

// Charger tous les fichiers de paroles
const fr = require('./lyrics/FR.json');
const en = require('./lyrics/EN.json');
const pt = require('./lyrics/PT.json');
const es = require('./lyrics/ES.json');
const de = require('./lyrics/DE.json');
const it = require('./lyrics/IT.json');
const tl = require('./lyrics/TL.json');

const languages = {
  FR: fr,
  EN: en,
  PT: pt,
  ES: es,
  DE: de,
  IT: it,
  TL: tl
};

// Patterns à détecter dans les paroles
const patterns = {
  // Tags structurels
  titleTag: /\[TITLE\]/gi,
  lyricsTag: /\[LYRICS\]/gi,
  styleTag: /\[STYLE\]/gi,

  // Sections avec crochets
  verseTagged: /\[(Verse|Verso|Verset|Couplet|Strophe)\s*\d*\]/gi,
  chorusTagged: /\[(Chorus|Refrão|Refrain|Coro)\s*\d*\]/gi,
  bridgeTagged: /\[(Bridge|Ponte|Puente)\s*\d*\]/gi,
  outroTagged: /\[(Outro|Final|Fim)\s*\d*\]/gi,
  introTagged: /\[(Intro|Introduction)\s*\d*\]/gi,
  spokenTagged: /\[Spoken Word\]/gi,

  // Sections avec markdown
  verseMarkdown: /\*\*\[(Verse|Verso|Verset|Couplet|Strophe)[^\]]*\]\*\*/gi,
  chorusMarkdown: /\*\*\[(Chorus|Refrão|Refrain|Coro)[^\]]*\]\*\*/gi,
  bridgeMarkdown: /\*\*\[(Bridge|Ponte|Puente)[^\]]*\]\*\*/gi,
  outroMarkdown: /\*\*\[(Outro|Final|Fim)[^\]]*\]\*\*/gi,

  // Sections sans crochets (ligne complète)
  verseLine: /^(Verse|Verso|Verset|Couplet|Strophe)\s*\d*\s*:?\s*$/gmi,
  chorusLine: /^(Chorus|Refrão|Refrain|Coro)\s*:?\s*$/gmi,
  bridgeLine: /^(Bridge|Ponte|Puente)\s*:?\s*$/gmi,
  outroLine: /^(Outro|Final|Fim)\s*:?\s*$/gmi,

  // Lignes de titre
  titleLineMarkdown: /\*\*(Título|Title):\s*["""][^"""]*["""]\*\*/gi,
  titleLine: /(Título|Title):\s*["""][^"""]*["""]/gi,

  // Markdown général
  boldMarkdown: /\*\*([^*]+)\*\*/g,

  // Mots seuls
  lyricsWord: /^Lyrics\s*$/gmi,
  letrasWord: /^Letras\s*$/gmi,

  // Lignes vides multiples
  multipleEmptyLines: /(\r?\n\s*){3,}/g
};

console.log('═══════════════════════════════════════════════════════════════');
console.log('         AUDIT COMPLET DES PAROLES - BIBLE CHANTÉE');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

const report = {
  byLanguage: {},
  examples: {},
  summary: {}
};

// Auditer chaque langue
for (const [lang, data] of Object.entries(languages)) {
  report.byLanguage[lang] = {};
  report.examples[lang] = {};

  let totalChapters = 0;
  let chaptersWithIssues = 0;

  for (const book in data) {
    for (const chapter in data[book]) {
      const lyrics = data[book][chapter];
      totalChapters++;

      let hasIssues = false;
      const issues = {};

      // Tester chaque pattern
      for (const [patternName, regex] of Object.entries(patterns)) {
        const matches = lyrics.match(regex);
        if (matches && matches.length > 0) {
          hasIssues = true;
          issues[patternName] = matches.length;

          // Garder un exemple
          if (!report.examples[lang][patternName]) {
            report.examples[lang][patternName] = {
              book,
              chapter,
              sample: matches[0]
            };
          }
        }
      }

      if (hasIssues) {
        chaptersWithIssues++;
        if (!report.byLanguage[lang][book]) {
          report.byLanguage[lang][book] = {};
        }
        report.byLanguage[lang][book][chapter] = issues;
      }
    }
  }

  report.summary[lang] = {
    totalChapters,
    chaptersWithIssues,
    percentage: ((chaptersWithIssues / totalChapters) * 100).toFixed(1)
  };
}

// Afficher le rapport
console.log('═══════════════════════════════════════════════════════════════');
console.log('RÉSUMÉ PAR LANGUE');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

for (const [lang, summary] of Object.entries(report.summary)) {
  console.log(`${lang}:`);
  console.log(`  - Total chapitres: ${summary.totalChapters}`);
  console.log(`  - Chapitres avec patterns: ${summary.chaptersWithIssues} (${summary.percentage}%)`);
  console.log('');
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('PATTERNS DÉTECTÉS PAR LANGUE');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

for (const [lang, examples] of Object.entries(report.examples)) {
  if (Object.keys(examples).length > 0) {
    console.log(`\n━━━ ${lang} ━━━\n`);
    for (const [patternName, example] of Object.entries(examples)) {
      console.log(`Pattern: ${patternName}`);
      console.log(`  Exemple (Livre ${example.book} Ch ${example.chapter}): "${example.sample}"`);
    }
  }
}

// Compter les occurrences totales par pattern
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('STATISTIQUES PAR PATTERN (toutes langues)');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

const patternStats = {};
for (const [lang, langData] of Object.entries(report.byLanguage)) {
  for (const book in langData) {
    for (const chapter in langData[book]) {
      const issues = langData[book][chapter];
      for (const [patternName, count] of Object.entries(issues)) {
        if (!patternStats[patternName]) {
          patternStats[patternName] = 0;
        }
        patternStats[patternName] += count;
      }
    }
  }
}

const sortedPatterns = Object.entries(patternStats)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

console.log('Top 20 patterns les plus fréquents:\n');
sortedPatterns.forEach(([pattern, count], index) => {
  console.log(`${index + 1}. ${pattern}: ${count} occurrences`);
});

// Sauvegarder le rapport JSON
fs.writeFileSync('./audit_lyrics_report.json', JSON.stringify(report, null, 2));

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('Rapport JSON sauvegardé: audit_lyrics_report.json');
console.log('═══════════════════════════════════════════════════════════════');
