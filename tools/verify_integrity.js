#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARCHIVE_FILE = path.join(ROOT_DIR, 'lyrics-archive', 'lyrics-archive.json');

const sourceMappings = [
  { lang: 'FR', file: 'lyrics-data.js' },
  { lang: 'EN', file: 'lyrics-data-en.js' },
  { lang: 'ES', file: 'lyrics-data-es.js' },
  { lang: 'PT', file: 'lyrics-data-pt.js' },
  { lang: 'DE', file: 'lyrics-data-de.js' },
  { lang: 'IT', file: 'lyrics-data-it.js' },
  { lang: 'TL', file: 'lyrics-data-tl.js' }
];

console.log('🔍 Verifying integrity...\n');

if (!fs.existsSync(ARCHIVE_FILE)) {
  console.error(`❌ Archive not found: ${ARCHIVE_FILE}`);
  console.error('   Run export_lyrics_archive.js first\n');
  process.exit(1);
}

const archive = JSON.parse(fs.readFileSync(ARCHIVE_FILE, 'utf8'));

let totalChecks = 0;
let totalMatches = 0;
let totalMismatches = 0;
let totalMissing = 0;

sourceMappings.forEach(({ lang, file }) => {
  const filePath = path.join(ROOT_DIR, file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${lang}: Source not found (${file}) - skipping`);
    return;
  }

  console.log(`🔎 Checking ${lang} (${file})...`);

  const content = fs.readFileSync(filePath, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);

  try {
    vm.runInContext(content, sandbox, { filename: file });
  } catch (e) {
    console.log(`   ❌ Parse error: ${e.message}`);
    return;
  }

  let sourceData = null;
  for (const key of Object.keys(sandbox.window)) {
    if (/^chapterLyrics/i.test(key)) {
      sourceData = sandbox.window[key];
      break;
    }
  }

  if (!sourceData) {
    console.log(`   ⚠️  No chapterLyrics* found`);
    return;
  }

  const archiveData = archive[lang];
  if (!archiveData) {
    console.log(`   ⚠️  Not in archive`);
    totalMissing++;
    return;
  }

  let checks = 0;
  let matches = 0;
  let mismatches = 0;

  Object.keys(sourceData).forEach(bookKey => {
    Object.keys(sourceData[bookKey]).forEach(chapterKey => {
      checks++;
      const sourceBlock = sourceData[bookKey][chapterKey];
      const archiveBlock = archiveData[bookKey]?.[chapterKey];

      if (archiveBlock === undefined) {
        console.log(`   ❌ Missing: ${bookKey}/${chapterKey}`);
        mismatches++;
      } else if (sourceBlock === archiveBlock) {
        matches++;
      } else {
        console.log(`   ❌ Mismatch: ${bookKey}/${chapterKey}`);
        console.log(`      Source: ${sourceBlock.length} chars`);
        console.log(`      Archive: ${archiveBlock.length} chars`);
        mismatches++;
      }
    });
  });

  totalChecks += checks;
  totalMatches += matches;
  totalMismatches += mismatches;

  if (mismatches === 0) {
    console.log(`   ✅ ${checks} blocks perfect\n`);
  } else {
    console.log(`   ⚠️  ${matches}/${checks} OK, ${mismatches} mismatches\n`);
  }
});

console.log('='.repeat(60));
console.log('📊 INTEGRITY VERIFICATION');
console.log('='.repeat(60));
console.log(`Total checks:       ${totalChecks}`);
console.log(`Perfect matches:    ${totalMatches} (${((totalMatches / totalChecks) * 100).toFixed(1)}%)`);
console.log(`Mismatches:         ${totalMismatches}`);
console.log(`Missing sources:    ${totalMissing}`);
console.log('='.repeat(60) + '\n');

if (totalMismatches === 0 && totalMissing === 0) {
  console.log('✅ INTEGRITY VERIFIED: Archive is exact!\n');
  process.exit(0);
} else {
  console.log('⚠️  WARNING: Differences detected\n');
  process.exit(1);
}
