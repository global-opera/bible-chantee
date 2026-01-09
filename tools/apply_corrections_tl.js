const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TL_PATH = path.join(ROOT, "titles", "TL.json");
const CORR_PATH = path.join(ROOT, "corrections_TL.json");
const BACKUP_PATH = path.join(ROOT, "titles", "TL.json.bak");

function loadJson(p) {
  if (!fs.existsSync(p)) {
    console.error("Introuvable:", p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function saveJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function main() {
  const tl = loadJson(TL_PATH);
  const corr = loadJson(CORR_PATH);

  if (!fs.existsSync(BACKUP_PATH)) fs.copyFileSync(TL_PATH, BACKUP_PATH);

  let applied = 0;
  for (const book of Object.keys(corr)) {
    if (!tl[book]) tl[book] = {};
    for (const chap of Object.keys(corr[book])) {
      const newTitle = String(corr[book][chap] || "").trim();
      if (!newTitle) continue;
      tl[book][chap] = newTitle;
      applied++;
    }
  }

  saveJson(TL_PATH, tl);
  console.log("Corrections appliquées:", applied);
  console.log("OK ->", TL_PATH);
}

main();
