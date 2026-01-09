const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DE_PATH = path.join(ROOT, "titles", "DE.json");
const CORR_PATH = path.join(ROOT, "corrections_DE.json");
const BACKUP_PATH = path.join(ROOT, "titles", "DE.json.bak");

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
  const de = loadJson(DE_PATH);
  const corr = loadJson(CORR_PATH);

  if (!fs.existsSync(BACKUP_PATH)) fs.copyFileSync(DE_PATH, BACKUP_PATH);

  let applied = 0;
  for (const book of Object.keys(corr)) {
    if (!de[book]) de[book] = {};
    for (const chap of Object.keys(corr[book])) {
      const newTitle = String(corr[book][chap] || "").trim();
      if (!newTitle) continue;
      de[book][chap] = newTitle;
      applied++;
    }
  }

  saveJson(DE_PATH, de);
  console.log("Corrections appliquées:", applied);
  console.log("OK ->", DE_PATH);
}

main();
