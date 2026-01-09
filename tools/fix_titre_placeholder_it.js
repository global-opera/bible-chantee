const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LYRICS_PATH = path.join(ROOT, "lyrics-archive", "IT.json");
const TITLES_PATH = path.join(ROOT, "titles", "IT.json");

function loadJson(p) {
  if (!fs.existsSync(p)) {
    console.error("File not found:", p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function saveJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function main() {
  const lyrics = loadJson(LYRICS_PATH);
  const titles = loadJson(TITLES_PATH);

  let fixed = 0;
  let notFound = 0;

  for (const book of Object.keys(lyrics)) {
    if (!lyrics[book]) continue;

    for (const chap of Object.keys(lyrics[book])) {
      let content = lyrics[book][chap];

      if (typeof content === "string" && content.includes("[TITRE]")) {
        // Get actual title from titles/IT.json
        const actualTitle = titles[book]?.[chap];

        if (actualTitle) {
          // Replace [TITRE] with actual title
          content = content.replace(/\[TITRE\]\s*\n?\*?\*?([^\n]*)\*?\*?/g, (match, oldTitle) => {
            console.log(`${book}:${chap} - Replacing: "${oldTitle.trim()}" -> "${actualTitle}"`);
            return `[TITRE]\n${actualTitle}`;
          });

          lyrics[book][chap] = content;
          fixed++;
        } else {
          console.warn(`⚠ ${book}:${chap} - No title found in titles/IT.json`);
          notFound++;
        }
      }
    }
  }

  if (fixed > 0) {
    // Create backup
    const backupPath = LYRICS_PATH + ".bak";
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(LYRICS_PATH, backupPath);
      console.log("\n✓ Backup created:", backupPath);
    }

    saveJson(LYRICS_PATH, lyrics);
    console.log(`\n✓ Fixed ${fixed} [TITRE] placeholders`);
  }

  if (notFound > 0) {
    console.log(`⚠ ${notFound} chapters without matching titles`);
  }

  if (fixed === 0 && notFound === 0) {
    console.log("✓ No [TITRE] placeholders found");
  }
}

main();
