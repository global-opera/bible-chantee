const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PT_PATH = path.join(ROOT, "titles", "PT.json");

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function saveJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function main() {
  const pt = loadJson(PT_PATH);

  // Manual corrections for 5 titles that escaped initial audit
  const patches = {
    "14": { "32": "Fortalece-te, Nosso Deus Está Aqui!" },
    "23": { "65": "Alegra-te, Jerusalém!" },
    "45": { "1": "Glória a Ti, Nossa Força de Salvação" },
    "66": { "18": "Babilônia Caiu, Desperta Nosso Coração!" },
    "02": { "21": "Liberdade e Justiça em Ti" }
  };

  for (const [book, chapters] of Object.entries(patches)) {
    if (!pt[book]) pt[book] = {};
    for (const [chap, title] of Object.entries(chapters)) {
      console.log(`Patching ${book}:${chap} -> ${title}`);
      pt[book][chap] = title;
    }
  }

  saveJson(PT_PATH, pt);
  console.log("\n5 patches appliqués avec succès!");
}

main();
