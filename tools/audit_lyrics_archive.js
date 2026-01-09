#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARCHIVE_FILE = path.join(ROOT_DIR, 'lyrics-archive', 'lyrics-archive.json');
const REPORT_FILE = path.join(ROOT_DIR, 'lyrics-archive', 'lyrics-audit-report.json');

const BIBLE_BOOKS = [
  { num: "01", code: "01_GEN", chapters: 50 },
  { num: "02", code: "02_EXO", chapters: 40 },
  { num: "03", code: "03_LEV", chapters: 27 },
  { num: "04", code: "04_NUM", chapters: 36 },
  { num: "05", code: "05_DEU", chapters: 34 },
  { num: "06", code: "06_JOS", chapters: 24 },
  { num: "07", code: "07_JDG", chapters: 21 },
  { num: "08", code: "08_RUT", chapters: 4 },
  { num: "09", code: "09_1SAM", chapters: 31 },
  { num: "10", code: "10_2SAM", chapters: 24 },
  { num: "11", code: "11_1KI", chapters: 22 },
  { num: "12", code: "12_2KI", chapters: 25 },
  { num: "13", code: "13_1CH", chapters: 29 },
  { num: "14", code: "14_2CH", chapters: 36 },
  { num: "15", code: "15_EZR", chapters: 10 },
  { num: "16", code: "16_NEH", chapters: 13 },
  { num: "17", code: "17_EST", chapters: 10 },
  { num: "18", code: "18_JOB", chapters: 42 },
  { num: "19", code: "19_PSA", chapters: 150 },
  { num: "20", code: "20_PRO", chapters: 31 },
  { num: "21", code: "21_ECC", chapters: 12 },
  { num: "22", code: "22_SON", chapters: 8 },
  { num: "23", code: "23_ISA", chapters: 66 },
  { num: "24", code: "24_JER", chapters: 52 },
  { num: "25", code: "25_LAM", chapters: 5 },
  { num: "26", code: "26_EZE", chapters: 48 },
  { num: "27", code: "27_DAN", chapters: 12 },
  { num: "28", code: "28_HOS", chapters: 14 },
  { num: "29", code: "29_JOE", chapters: 3 },
  { num: "30", code: "30_AMO", chapters: 9 },
  { num: "31", code: "31_OBA", chapters: 1 },
  { num: "32", code: "32_JON", chapters: 4 },
  { num: "33", code: "33_MIC", chapters: 7 },
  { num: "34", code: "34_NAH", chapters: 3 },
  { num: "35", code: "35_HAB", chapters: 3 },
  { num: "36", code: "36_ZEP", chapters: 3 },
  { num: "37", code: "37_HAG", chapters: 2 },
  { num: "38", code: "38_ZEC", chapters: 14 },
  { num: "39", code: "39_MAL", chapters: 4 },
  { num: "40", code: "40_MAT", chapters: 28 },
  { num: "41", code: "41_MAR", chapters: 16 },
  { num: "42", code: "42_LUK", chapters: 24 },
  { num: "43", code: "43_JOH", chapters: 21 },
  { num: "44", code: "44_ACT", chapters: 28 },
  { num: "45", code: "45_ROM", chapters: 16 },
  { num: "46", code: "46_1CO", chapters: 16 },
  { num: "47", code: "47_2CO", chapters: 13 },
  { num: "48", code: "48_GAL", chapters: 6 },
  { num: "49", code: "49_EPH", chapters: 6 },
  { num: "50", code: "50_PHP", chapters: 4 },
  { num: "51", code: "51_COL", chapters: 4 },
  { num: "52", code: "52_1TH", chapters: 5 },
  { num: "53", code: "53_2TH", chapters: 3 },
  { num: "54", code: "54_1TI", chapters: 6 },
  { num: "55", code: "55_2TI", chapters: 4 },
  { num: "56", code: "56_TIT", chapters: 3 },
  { num: "57", code: "57_PHM", chapters: 1 },
  { num: "58", code: "58_HEB", chapters: 13 },
  { num: "59", code: "59_JAM", chapters: 5 },
  { num: "60", code: "60_1PE", chapters: 5 },
  { num: "61", code: "61_2PE", chapters: 3 },
  { num: "62", code: "62_1JO", chapters: 5 },
  { num: "63", code: "63_2JO", chapters: 1 },
  { num: "64", code: "64_3JO", chapters: 1 },
  { num: "65", code: "65_JUD", chapters: 1 },
  { num: "66", code: "66_REV", chapters: 22 }
];

console.log('🔍 Loading archive...\n');

if (!fs.existsSync(ARCHIVE_FILE)) {
  console.error(`❌ Archive not found: ${ARCHIVE_FILE}`);
  console.error('   Run export_lyrics_archive.js first\n');
  process.exit(1);
}

const archive = JSON.parse(fs.readFileSync(ARCHIVE_FILE, 'utf8'));
const languages = Object.keys(archive);

console.log(`✅ Loaded ${languages.length} languages: ${languages.join(', ')}\n`);

const report = {
  timestamp: new Date().toISOString(),
  languages: {},
  summary: {
    totalLanguages: languages.length,
    totalBlocks: 0,
    totalMissing: 0,
    totalDuplicates: 0,
    totalKeyVariants: 0
  }
};

languages.forEach(lang => {
  console.log(`📊 Analyzing ${lang}...`);

  const data = archive[lang];
  const bookKeys = Object.keys(data);

  const langReport = {
    booksCount: bookKeys.length,
    chaptersCount: 0,
    missing: [],
    duplicates: [],
    keyVariants: []
  };

  bookKeys.forEach(bookKey => {
    langReport.chaptersCount += Object.keys(data[bookKey]).length;
  });

  // Détecter variants de clés (05 vs 05_DEU)
  const keyGroups = {};
  bookKeys.forEach(bookKey => {
    const numMatch = bookKey.match(/^(\d{1,2})/);
    if (numMatch) {
      const num = numMatch[1].padStart(2, '0');
      if (!keyGroups[num]) keyGroups[num] = [];
      keyGroups[num].push(bookKey);
    }
  });

  Object.keys(keyGroups).forEach(num => {
    if (keyGroups[num].length > 1) {
      langReport.keyVariants.push({
        bookNum: num,
        variants: keyGroups[num]
      });
    }
  });

  // Détecter manquants
  BIBLE_BOOKS.forEach(book => {
    const possibleKeys = [book.num, book.code, book.num.replace(/^0/, '')];
    const foundKey = possibleKeys.find(k => data[k]);

    if (!foundKey) {
      langReport.missing.push({
        book: book.code,
        chapters: 'ALL',
        expectedChapters: book.chapters
      });
    } else {
      const chapters = Object.keys(data[foundKey]).map(c => parseInt(c, 10)).sort((a, b) => a - b);
      const missingChapters = [];

      for (let i = 1; i <= book.chapters; i++) {
        if (!chapters.includes(i)) {
          missingChapters.push(i);
        }
      }

      if (missingChapters.length > 0) {
        langReport.missing.push({
          book: book.code,
          bookKey: foundKey,
          chapters: missingChapters.join(', '),
          missingCount: missingChapters.length
        });
      }
    }
  });

  // Détecter doublons par hash
  const contentHashes = {};
  bookKeys.forEach(bookKey => {
    Object.keys(data[bookKey]).forEach(chapterKey => {
      const content = data[bookKey][chapterKey];
      const hash = crypto.createHash('md5').update(content).digest('hex');
      const key = `${bookKey}/${chapterKey}`;

      if (contentHashes[hash]) {
        langReport.duplicates.push({
          key1: contentHashes[hash],
          key2: key
        });
      } else {
        contentHashes[hash] = key;
      }
    });
  });

  report.languages[lang] = langReport;
  report.summary.totalBlocks += langReport.chaptersCount;
  report.summary.totalMissing += langReport.missing.length;
  report.summary.totalDuplicates += langReport.duplicates.length;
  report.summary.totalKeyVariants += langReport.keyVariants.length;

  console.log(`   Books: ${langReport.booksCount}`);
  console.log(`   Chapters: ${langReport.chaptersCount}`);
  console.log(`   Missing: ${langReport.missing.length}`);
  console.log(`   Duplicates: ${langReport.duplicates.length}`);
  console.log(`   Key variants: ${langReport.keyVariants.length}\n`);
});

fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf8');

console.log('='.repeat(60));
console.log('📊 AUDIT SUMMARY');
console.log('='.repeat(60));
console.log(`Languages:          ${report.summary.totalLanguages}`);
console.log(`Total blocks:       ${report.summary.totalBlocks}`);
console.log(`Total missing:      ${report.summary.totalMissing}`);
console.log(`Total duplicates:   ${report.summary.totalDuplicates}`);
console.log(`Key variants:       ${report.summary.totalKeyVariants}`);
console.log(`\nReport:             ${REPORT_FILE}`);
console.log('='.repeat(60) + '\n');

if (report.summary.totalKeyVariants > 0) {
  console.log('⚠️  KEY VARIANTS DETECTED:\n');
  languages.forEach(lang => {
    if (report.languages[lang].keyVariants.length > 0) {
      console.log(`${lang}:`);
      report.languages[lang].keyVariants.forEach(kv => {
        console.log(`   Book ${kv.bookNum}: ${kv.variants.join(', ')}`);
      });
      console.log('');
    }
  });
}

const criticalMissing = languages.filter(l => report.languages[l].missing.length > 10);
if (criticalMissing.length > 0) {
  console.log('⚠️  CRITICAL MISSING:\n');
  criticalMissing.forEach(l => {
    console.log(`   ${l}: ${report.languages[l].missing.length} items`);
  });
  console.log('');
}

console.log('✅ Audit completed!\n');
