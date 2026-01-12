// tools/audit_fr_lyrics.js
// QA audit for lyrics/FR.json
// Detects: mojibake, missing blocks, empty titles, etc.
// Usage:
//   node tools/audit_fr_lyrics.js

const fs = require("fs");
const path = require("path");

function hasMojibake(text) {
  // Common mojibake patterns
  const patterns = [
    "�",           // Replacement character
    "Ã©", "Ã¨", "Ã ", "Ã§",  // UTF-8 as Latin-1
    "â€™", "â€œ", "â€",      // Smart quotes
    "Ã‰", "Ãˆ", "Ã€",        // Capitals
  ];

  for (const p of patterns) {
    if (text.includes(p)) return true;
  }
  return false;
}

function analyzeChapter(text) {
  const issues = [];

  // Check for blocks
  const hasTitle = /\[TITLE\]/i.test(text);
  const hasLyrics = /\[LYRICS\]/i.test(text);
  const hasStyle = /\[STYLE\]/i.test(text);

  if (!hasTitle) issues.push("Missing [TITLE]");
  if (!hasLyrics) issues.push("Missing [LYRICS]");
  if (!hasStyle) issues.push("Missing [STYLE]");

  // Check for mojibake
  if (hasMojibake(text)) issues.push("Mojibake detected");

  // Check for empty title
  const titleMatch = text.match(/\[TITLE\]\s*\n(.*?)\n/s);
  if (titleMatch && !titleMatch[1].trim()) {
    issues.push("Empty title");
  }

  // Check for empty lyrics
  const lyricsMatch = text.match(/\[LYRICS\]\s*\n(.*?)\n\s*\[STYLE\]/s);
  if (lyricsMatch && !lyricsMatch[1].trim()) {
    issues.push("Empty lyrics");
  }

  return issues;
}

function main() {
  const repoRoot = process.cwd();
  const lyricsPath = path.join(repoRoot, "lyrics", "FR.json");

  if (!fs.existsSync(lyricsPath)) {
    console.error("Missing file:", lyricsPath);
    process.exit(1);
  }

  console.log("=".repeat(60));
  console.log("AUDIT: lyrics/FR.json");
  console.log("=".repeat(60));
  console.log();

  const lyrics = JSON.parse(fs.readFileSync(lyricsPath, "utf8"));

  const stats = {
    total: 0,
    missingTitle: 0,
    missingLyrics: 0,
    missingStyle: 0,
    mojibake: 0,
    emptyTitle: 0,
    emptyLyrics: 0,
    perfect: 0
  };

  const samples = {
    mojibake: [],
    missingBlocks: [],
    emptyContent: []
  };

  for (const book of Object.keys(lyrics).sort()) {
    for (const chapter of Object.keys(lyrics[book]).sort((a, b) => Number(a) - Number(b))) {
      stats.total++;
      const text = lyrics[book][chapter];
      const issues = analyzeChapter(text);

      if (issues.length === 0) {
        stats.perfect++;
      } else {
        for (const issue of issues) {
          if (issue.includes("TITLE")) stats.missingTitle++;
          if (issue.includes("LYRICS")) stats.missingLyrics++;
          if (issue.includes("STYLE")) stats.missingStyle++;
          if (issue.includes("Mojibake")) {
            stats.mojibake++;
            if (samples.mojibake.length < 5) {
              samples.mojibake.push(`${book}:${chapter}`);
            }
          }
          if (issue.includes("Empty title")) stats.emptyTitle++;
          if (issue.includes("Empty lyrics")) {
            stats.emptyLyrics++;
            if (samples.emptyContent.length < 5) {
              samples.emptyContent.push(`${book}:${chapter}`);
            }
          }
        }

        if (issues.some(i => i.includes("Missing"))) {
          if (samples.missingBlocks.length < 5) {
            samples.missingBlocks.push(`${book}:${chapter} (${issues.join(", ")})`);
          }
        }
      }
    }
  }

  console.log("STATISTICS:");
  console.log("-".repeat(60));
  console.log(`Total chapters: ${stats.total}`);
  console.log(`Perfect: ${stats.perfect}`);
  console.log(`Missing [TITLE]: ${stats.missingTitle}`);
  console.log(`Missing [LYRICS]: ${stats.missingLyrics}`);
  console.log(`Missing [STYLE]: ${stats.missingStyle}`);
  console.log(`Mojibake: ${stats.mojibake}`);
  console.log(`Empty title: ${stats.emptyTitle}`);
  console.log(`Empty lyrics: ${stats.emptyLyrics}`);
  console.log();

  if (samples.mojibake.length > 0) {
    console.log("MOJIBAKE SAMPLES:");
    samples.mojibake.forEach(s => console.log(`  - ${s}`));
    console.log();
  }

  if (samples.missingBlocks.length > 0) {
    console.log("MISSING BLOCKS SAMPLES:");
    samples.missingBlocks.forEach(s => console.log(`  - ${s}`));
    console.log();
  }

  if (samples.emptyContent.length > 0) {
    console.log("EMPTY CONTENT SAMPLES:");
    samples.emptyContent.forEach(s => console.log(`  - ${s}`));
    console.log();
  }

  console.log("=".repeat(60));

  if (stats.mojibake === 0 && stats.missingTitle === 0 && stats.emptyLyrics === 0) {
    console.log("✓ AUDIT PASSED - No critical issues");
  } else {
    console.log("⚠ AUDIT WARNINGS - Review samples above");
  }

  console.log("=".repeat(60));
}

main();
