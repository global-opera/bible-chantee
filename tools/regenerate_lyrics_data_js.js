// tools/regenerate_lyrics_data_js.js
// Usage:
//   node tools/regenerate_lyrics_data_js.js --lang FR
//
// Génère lyrics-data.js (ou met à jour celui existant) en conservant le nom window.* déjà utilisé.

const fs = require("fs");
const path = require("path");

function parseArg(name) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

function main() {
  const repoRoot = process.cwd();
  const lang = (parseArg("--lang") || "FR").toUpperCase();

  const jsonPath = path.join(repoRoot, "lyrics", `${lang}.json`);
  const outPath = path.join(repoRoot, "lyrics-data.js");

  if (!fs.existsSync(jsonPath)) {
    console.error("Missing:", jsonPath);
    process.exit(1);
  }

  let varName = `window.chapterLyrics${lang}`;
  if (lang === "FR") {
    varName = "window.chapterLyrics"; // FR uses base name without suffix
  }

  if (fs.existsSync(outPath)) {
    const existing = fs.readFileSync(outPath, "utf8");
    const m = existing.match(/window\.(chapterLyrics[A-Z]{2}|chapterLyrics)\s*=/);
    if (m && m[1]) varName = `window.${m[1]}`;
    else {
      const m2 = existing.match(/window\.(chapterLyrics)\s*=/);
      if (m2 && m2[1]) varName = `window.${m2[1]}`;
    }
  }

  const jsonRaw = fs.readFileSync(jsonPath, "utf8").trim();
  const content = `// Paroles des chapitres - Bible Chantee
// Source: ${lang}.json
// Auto-genere: ${new Date().toISOString().split('T')[0]}
${varName} = ${jsonRaw};
`;

  fs.writeFileSync(outPath, content, "utf8");

  console.log("Wrote:", outPath);
  console.log("Var  :", varName);
  console.log("From :", jsonPath);
}

main();
