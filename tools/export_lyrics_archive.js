#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT_DIR = path.resolve(__dirname, '..');
const ARCHIVE_DIR = path.join(ROOT_DIR, 'lyrics-archive');

console.log('🔍 Scanning for lyrics files...\n');

// 1. Scanner tous les fichiers lyrics-data*.js
const files = fs.readdirSync(ROOT_DIR).filter(f => /^lyrics-data(-[a-z]{2})?\.js$/.test(f));

if (files.length === 0) {
  console.error('❌ No lyrics-data*.js files found in:', ROOT_DIR);
  process.exit(1);
}

console.log(`✅ Found ${files.length} files:`);
files.forEach(f => console.log(`   - ${f}`));
console.log('');

// 2. Parser chaque fichier avec vm
const archive = {};
let totalBlocks = 0;

files.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Détecter la langue depuis le nom du fichier
  const match = file.match(/^lyrics-data(-([a-z]{2}))?\.js$/);
  const lang = match[2] ? match[2].toUpperCase() : 'FR';

  console.log(`📖 Processing ${file} → ${lang}...`);

  // Créer un contexte sandbox avec window
  const sandbox = { window: {} };
  vm.createContext(sandbox);

  try {
    vm.runInContext(content, sandbox, { filename: file });
  } catch (e) {
    console.error(`   ❌ Error executing ${file}:`, e.message);
    return;
  }

  // Chercher window.chapterLyrics* dans le sandbox
  let data = null;
  for (const key of Object.keys(sandbox.window)) {
    if (/^chapterLyrics/i.test(key)) {
      data = sandbox.window[key];
      break;
    }
  }

  if (!data) {
    console.warn(`   ⚠️  No chapterLyrics* found in ${file}`);
    return;
  }

  // Compter les blocks
  let blockCount = 0;
  for (const bookKey in data) {
    for (const chapterKey in data[bookKey]) {
      blockCount++;
    }
  }

  // Vérifier conflits
  if (archive[lang]) {
    console.warn(`   ⚠️  CONFLICT: ${lang} already exists, merging...`);
    // Merge
    for (const bookKey in data) {
      if (!archive[lang][bookKey]) {
        archive[lang][bookKey] = data[bookKey];
      } else {
        for (const chapterKey in data[bookKey]) {
          if (archive[lang][bookKey][chapterKey]) {
            console.warn(`      ⚠️  Overwriting ${lang}[${bookKey}][${chapterKey}]`);
          }
          archive[lang][bookKey][chapterKey] = data[bookKey][chapterKey];
        }
      }
    }
  } else {
    archive[lang] = data;
  }

  totalBlocks += blockCount;
  console.log(`   ✅ ${blockCount} blocks extracted\n`);
});

// 3. Créer le dossier archive
if (!fs.existsSync(ARCHIVE_DIR)) {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

// 4. Sauvegarder archive complète
const archiveFile = path.join(ARCHIVE_DIR, 'lyrics-archive.json');
fs.writeFileSync(archiveFile, JSON.stringify(archive, null, 2), 'utf8');
console.log(`✅ Saved complete archive: ${archiveFile}\n`);

// 5. Sauvegarder par langue
Object.keys(archive).forEach(lang => {
  const langFile = path.join(ARCHIVE_DIR, `${lang}.json`);
  fs.writeFileSync(langFile, JSON.stringify(archive[lang], null, 2), 'utf8');
  console.log(`   ✅ ${lang}.json`);
});

// 6. Résumé
console.log('\n' + '='.repeat(60));
console.log('📊 EXPORT SUMMARY');
console.log('='.repeat(60));
console.log(`Languages:          ${Object.keys(archive).length}`);
Object.keys(archive).forEach(lang => {
  const books = Object.keys(archive[lang]).length;
  let chapters = 0;
  for (const bookKey in archive[lang]) {
    chapters += Object.keys(archive[lang][bookKey]).length;
  }
  console.log(`   ${lang}: ${books} books, ${chapters} chapters`);
});
console.log(`Total blocks:       ${totalBlocks}`);
console.log(`Output:             ${ARCHIVE_DIR}`);
console.log('='.repeat(60) + '\n');

console.log('✅ Export completed!\n');
