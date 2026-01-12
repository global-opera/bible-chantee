// tools/import_structured_fr_folder.js
// Rebuilds lyrics/FR.json from perfectly structured original files
// Usage:
//   node tools/import_structured_fr_folder.js --src "C:\Users\Stéphane CASSANI\bible-chantee\Lyrics\FR" --out "lyrics\FR.json"

const fs = require("fs");
const path = require("path");

function parseArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function parseBookChapterFromName(filename) {
  // Handles: 19_PSA_103.txt, 19-PSA-103.txt, 01_GEN_1_FR.txt, 19_PSA_103_FR.txt, etc.
  const base = filename.replace(/\.(txt|TXT)$/, "").replace(/_FR$/, "");

  // Try pattern: XX_ABC_NNN or XX-ABC-NNN
  let m = base.match(/^(\d{1,2})[_-]([A-Z]{3})[_-](\d+)$/);
  if (m) {
    return {
      book: String(Number(m[1])).padStart(2, '0'),
      chapter: String(Number(m[3]))
    };
  }

  // Try pattern: XX_NNN or XX-NNN
  m = base.match(/^(\d{1,2})[_-](\d+)$/);
  if (m) {
    return {
      book: String(Number(m[1])).padStart(2, '0'),
      chapter: String(Number(m[2]))
    };
  }

  return null;
}

function normalizeSpaces(s) {
  return s
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractBlocks(text) {
  // Returns { titleBlock, lyricsBlock, styleBlock, other }
  const raw = text.replace(/\r\n/g, "\n");
  const lines = raw.split("\n");

  let cur = null;
  const blocks = { TITLE: [], LYRICS: [], STYLE: [], OTHER: [] };

  for (const ln of lines) {
    const m = ln.trim().match(/^\[(TITLE|LYRICS|STYLE)\]$/i);
    if (m) {
      cur = m[1].toUpperCase();
      continue;
    }
    if (!cur) blocks.OTHER.push(ln);
    else blocks[cur].push(ln);
  }

  const join = (arr) => normalizeSpaces(arr.join("\n"));
  return {
    titleBlock: join(blocks.TITLE),
    lyricsBlock: join(blocks.LYRICS),
    styleBlock: join(blocks.STYLE),
    other: join(blocks.OTHER),
  };
}

function rebuildBlocks(chTitle, lyricsText, styleText = "") {
  const out = [];
  out.push("[TITLE]");
  out.push(chTitle || "");
  out.push("");
  out.push("[LYRICS]");
  out.push(lyricsText || "");
  out.push("");
  out.push("[STYLE]");
  out.push(styleText || "");
  return out.join("\n").trim() + "\n";
}

function main() {
  const repoRoot = process.cwd();
  const srcFolder = parseArg("--src") || path.join(repoRoot, "Lyrics", "FR");
  const outPath = parseArg("--out") || path.join(repoRoot, "lyrics", "FR.json");
  const titlesPath = path.join(repoRoot, "titles", "FR.json");

  if (!fs.existsSync(srcFolder)) {
    console.error("Missing source folder:", srcFolder);
    process.exit(1);
  }

  if (!fs.existsSync(titlesPath)) {
    console.error("Missing titles file:", titlesPath);
    process.exit(1);
  }

  const titles = JSON.parse(fs.readFileSync(titlesPath, "utf8"));

  // Backup existing output
  if (fs.existsSync(outPath)) {
    const backupPath = outPath + ".bak-" + nowStamp();
    fs.copyFileSync(outPath, backupPath);
    console.log("Backup:", backupPath);
  }

  const lyrics = {};
  let imported = 0;
  let skipped = 0;

  console.log(`\nImporting from: ${srcFolder}\n`);

  // Check if we have subdirectories or direct files
  const entries = fs.readdirSync(srcFolder, { withFileTypes: true });
  const subdirs = entries.filter(e => e.isDirectory());

  let allFiles = [];

  if (subdirs.length > 0) {
    // Nested structure: iterate through subdirectories
    for (const subdir of subdirs) {
      const subdirPath = path.join(srcFolder, subdir.name);
      const files = fs.readdirSync(subdirPath)
        .filter(f => /\.(txt|TXT)$/i.test(f))
        .map(f => ({ file: f, fullPath: path.join(subdirPath, f) }));
      allFiles.push(...files);
    }
  } else {
    // Flat structure: files directly in folder
    allFiles = entries
      .filter(e => e.isFile() && /\.(txt|TXT)$/i.test(e.name))
      .map(e => ({ file: e.name, fullPath: path.join(srcFolder, e.name) }));
  }

  console.log(`Found ${allFiles.length} .txt files\n`);

  for (const { file, fullPath } of allFiles) {
    const parsed = parseBookChapterFromName(file);
    if (!parsed) {
      console.log(`SKIP ${file} (cannot parse)`);
      skipped++;
      continue;
    }

    const { book, chapter } = parsed;
    const content = fs.readFileSync(fullPath, "utf8");

    // Extract blocks
    const blocks = extractBlocks(content);

    // Use authoritative title from titles/FR.json
    const officialTitle = titles?.[book]?.[chapter]
      ? String(titles[book][chapter]).trim()
      : blocks.titleBlock || `Livre ${book} - Chapitre ${chapter}`;

    // Rebuild with official title
    const rebuilt = rebuildBlocks(
      officialTitle,
      blocks.lyricsBlock || blocks.other || "",
      blocks.styleBlock
    );

    if (!lyrics[book]) lyrics[book] = {};
    lyrics[book][chapter] = rebuilt;
    imported++;

    console.log(`OK ${book}:${chapter} (${file})`);
  }

  // Write output
  fs.writeFileSync(outPath, JSON.stringify(lyrics, null, 2) + "\n", "utf8");

  console.log("\n" + "=".repeat(60));
  console.log("DONE");
  console.log("=".repeat(60));
  console.log("Imported:", imported);
  console.log("Skipped:", skipped);
  console.log("Output:", outPath);
}

main();
