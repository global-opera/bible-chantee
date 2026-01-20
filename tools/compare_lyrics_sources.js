// tools/compare_lyrics_sources.js
// Compare Whisper transcriptions with 3 existing sources
// Usage: node tools/compare_lyrics_sources.js

const fs = require('fs');
const path = require('path');

// Test cases: [book, chapter, filename]
const testCases = [
  ['01', '1', '01_GEN_01_FR'],
  ['02', '1', '02_EXO_01_FR'],
  ['19', '1', '19_PSA_01_FR'],
  ['19', '3', '19_PSA_03_FR'],
  ['19', '23', '19_PSA_23_FR'],
  ['19', '103', '19_PSA_103_FR']
];

// Paths
const whisperDir = 'C:\\ScriptBible\\bible-chantee\\whisper_comparison_10';
const frV2Base = 'G:\\Mon Drive\\01 BibleChantee\\Lyrics\\FR\\FR_V2';
const frBackupBase = 'G:\\Mon Drive\\01 BibleChantee\\Lyrics\\FR_BACKUP_BEFORE_FR_V2';
const whisperOldBase = 'G:\\Mon Drive\\01 BibleChantee\\Lyrics_Whisper_FR';

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8').trim();
  } catch (e) {
    return null;
  }
}

// Extract just lyrics content (remove [TITLE], [STYLE], timestamps)
function extractLyrics(text) {
  if (!text) return '';

  // Remove timestamps like [00:00.000 --> 00:24.000]
  text = text.replace(/\[\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}\.\d{3}\]/g, '');

  // Extract [LYRICS] section if present
  const lyricsMatch = text.match(/\[LYRICS\]([\s\S]*?)(?:\[STYLE\]|$)/i);
  if (lyricsMatch) {
    text = lyricsMatch[1];
  }

  // Normalize: lowercase, remove extra whitespace, punctuation
  return text
    .toLowerCase()
    .replace(/[^\w\sàâäéèêëïîôùûüÿœæç]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 200); // First 200 chars for comparison
}

// Similarity score (simple word overlap)
function similarity(str1, str2) {
  const words1 = new Set(str1.split(' ').filter(w => w.length > 2));
  const words2 = new Set(str2.split(' ').filter(w => w.length > 2));

  let overlap = 0;
  for (const w of words1) {
    if (words2.has(w)) overlap++;
  }

  const total = Math.max(words1.size, words2.size);
  return total > 0 ? (overlap / total * 100).toFixed(1) : 0;
}

function main() {
  console.log('='.repeat(80));
  console.log('COMPARISON: Whisper vs 3 Sources');
  console.log('='.repeat(80));
  console.log();

  const results = [];

  for (const [book, chapter, filename] of testCases) {
    console.log(`\n--- ${filename} ---`);

    // Read Whisper transcription (new)
    const whisperFile = path.join(whisperDir, `${filename}.txt`);
    const whisperText = readFile(whisperFile);

    if (!whisperText) {
      console.log('❌ Whisper transcription not found');
      continue;
    }

    const whisperLyrics = extractLyrics(whisperText);
    console.log(`Whisper: "${whisperLyrics.substring(0, 80)}..."`);

    // Read 3 sources
    const sources = {
      'FR_V2': readFile(path.join(frV2Base, `${book}_*`, `${filename}.txt`)),
      'FR_BACKUP': readFile(path.join(frBackupBase, `${book}_*`, `${filename}.txt`)),
      'Whisper_OLD': readFile(path.join(whisperOldBase, `${book}_*`, `${filename}.txt`))
    };

    // Try without wildcard if not found
    if (!sources.FR_V2) {
      const subdirs = ['GEN', 'EXO', 'PSA', 'MAT', 'JOH', 'ROM', 'REV'];
      for (const sub of subdirs) {
        const tryPath = path.join(frV2Base, `${book}_${sub}`, `${filename}.txt`);
        sources.FR_V2 = readFile(tryPath);
        if (sources.FR_V2) break;
      }
    }
    if (!sources.FR_BACKUP) {
      const subdirs = ['GEN', 'EXO', 'PSA', 'MAT', 'JOH', 'ROM', 'REV'];
      for (const sub of subdirs) {
        const tryPath = path.join(frBackupBase, `${book}_${sub}`, `${filename}.txt`);
        sources.FR_BACKUP = readFile(tryPath);
        if (sources.FR_BACKUP) break;
      }
    }
    if (!sources.Whisper_OLD) {
      const subdirs = ['GEN', 'EXO', 'PSA', 'MAT', 'JOH', 'ROM', 'REV'];
      for (const sub of subdirs) {
        const tryPath = path.join(whisperOldBase, `${book}_${sub}`, `${filename}.txt`);
        sources.Whisper_OLD = readFile(tryPath);
        if (sources.Whisper_OLD) break;
      }
    }

    // Compare
    const scores = {};
    for (const [name, content] of Object.entries(sources)) {
      if (content) {
        const lyrics = extractLyrics(content);
        scores[name] = similarity(whisperLyrics, lyrics);
        console.log(`  ${name}: ${scores[name]}% match`);
      } else {
        console.log(`  ${name}: ❌ NOT FOUND`);
        scores[name] = 0;
      }
    }

    // Best match
    const best = Object.entries(scores).reduce((a, b) => b[1] > a[1] ? b : a);
    console.log(`  ✅ BEST: ${best[0]} (${best[1]}%)`);

    results.push({
      file: filename,
      scores,
      best: best[0]
    });
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));

  const counts = { FR_V2: 0, FR_BACKUP: 0, Whisper_OLD: 0 };
  results.forEach(r => counts[r.best]++);

  console.log(`FR_V2: ${counts.FR_V2} wins`);
  console.log(`FR_BACKUP_BEFORE_FR_V2: ${counts.FR_BACKUP} wins`);
  console.log(`Whisper_OLD: ${counts.Whisper_OLD} wins`);

  console.log('\n' + '='.repeat(80));
}

main();
