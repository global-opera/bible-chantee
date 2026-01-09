#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARCHIVE_FILE = path.join(ROOT_DIR, 'lyrics-archive', 'lyrics-archive.json');
const FLAT_DIR = path.join(ROOT_DIR, 'lyrics-archive', 'flat');

console.log('🔍 Loading archive...\n');

if (!fs.existsSync(ARCHIVE_FILE)) {
  console.error(`❌ Archive not found: ${ARCHIVE_FILE}`);
  console.error('   Run export_lyrics_archive.js first\n');
  process.exit(1);
}

const archive = JSON.parse(fs.readFileSync(ARCHIVE_FILE, 'utf8'));
const languages = Object.keys(archive);

console.log(`✅ Loaded ${languages.length} languages\n`);

if (!fs.existsSync(FLAT_DIR)) {
  fs.mkdirSync(FLAT_DIR, { recursive: true });
}

let totalFiles = 0;

languages.forEach(lang => {
  console.log(`📝 Exporting ${lang}...`);

  const langDir = path.join(FLAT_DIR, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  const data = archive[lang];
  let fileCount = 0;

  Object.keys(data).forEach(bookKey => {
    Object.keys(data[bookKey]).forEach(chapterKey => {
      const content = data[bookKey][chapterKey];
      const filename = `${bookKey}_${chapterKey}.txt`;
      const filepath = path.join(langDir, filename);

      fs.writeFileSync(filepath, content, 'utf8');
      fileCount++;
    });
  });

  totalFiles += fileCount;
  console.log(`   ✅ ${fileCount} files\n`);
});

console.log('='.repeat(60));
console.log('📊 FLAT TXT EXPORT SUMMARY');
console.log('='.repeat(60));
console.log(`Languages:          ${languages.length}`);
console.log(`Total files:        ${totalFiles}`);
console.log(`Output:             ${FLAT_DIR}`);
console.log('='.repeat(60) + '\n');

console.log('📁 Structure:');
console.log(`   ${FLAT_DIR}/`);
languages.slice(0, 2).forEach(lang => {
  const data = archive[lang];
  const firstBook = Object.keys(data)[0];
  const firstChapter = Object.keys(data[firstBook])[0];
  console.log(`   ├── ${lang}/`);
  console.log(`   │   ├── ${firstBook}_${firstChapter}.txt`);
  console.log(`   │   └── ...`);
});
console.log('');

console.log('✅ Export completed!\n');
