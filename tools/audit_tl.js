const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TL_PATH = path.join(ROOT, "titles", "TL.json");
const FR_PATH = path.join(ROOT, "titles", "FR.json");
const CSV_OUT = path.join(ROOT, "errors_TL_completes.csv");

const ACCENTED_CHARS = "éèêëàâäùûüôöîïçñÉÈÊËÀÂÄÙÛÜÔÖÎÏÇÑ";
const reAccents = new RegExp("[" + ACCENTED_CHARS.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]");

// French words that should not appear in Tagalog text
const FRENCH_WORDS = [
  "Éternel","Eternel","Majesté","Majeste","Seigneur","Dieu","Lumière","Lumiere","Grâce","Grace",
  "Louange","Promesse","Victoire","Fidèle","Fidele","Béni","Beni","Cœur","Coeur","Père","Pere",
  "Mère","Mere","Frère","Frere","Sœur","Soeur","Âme","Ame","Vallée","Vallee","Désert","Desert",
  "Chemin","Voie","Étoile","Etoile","Tête","Tete","Œil","Oeil",
  "le","la","les","de","du","des","dans","pour","avec","sans","sous","sur","vers","entre",
  "notre","votre","mon","ton","son","mes","tes","ses","une","aux","cette","qui","que","où","ou"
];

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const frenchWordPattern = FRENCH_WORDS
  .map(w => escapeRegex(w))
  .sort((a,b) => b.length - a.length)
  .join("|");

const reFrenchWords = new RegExp(
  `(^|[\\s"""'''()\\[\\]{}<>.,;:!?/\\\\|-])(${frenchWordPattern})(?=($|[\\s"""'''()\\[\\]{}<>.,;:!?/\\\\|-]))`,
  "i"
);

const reFrenchElision = /(^|[\s"""([])(l|d|j|c|m|n|s|t|qu)['']/i;

function loadJson(p) {
  if (!fs.existsSync(p)) {
    console.error("Introuvable:", p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function main() {
  const tl = loadJson(TL_PATH);
  const fr = loadJson(FR_PATH);
  const errors = [];

  for (const book of Object.keys(tl)) {
    for (const chap of Object.keys(tl[book] || {})) {
      const title = String(tl[book][chap] || "").trim();
      if (!title) continue;

      // Check French accents (not used in Tagalog)
      if (reAccents.test(title)) {
        const frSource = (fr[book] && fr[book][chap]) || "";
        errors.push({ book, chap, titleTL: title, titleFR: frSource });
        continue;
      }

      // Check French words
      const frenchMatch = title.match(reFrenchWords);
      if (frenchMatch) {
        const frSource = (fr[book] && fr[book][chap]) || "";
        errors.push({ book, chap, titleTL: title, titleFR: frSource });
        continue;
      }

      // Check French elision
      if (reFrenchElision.test(title)) {
        const frSource = (fr[book] && fr[book][chap]) || "";
        errors.push({ book, chap, titleTL: title, titleFR: frSource });
      }
    }
  }

  if (errors.length) {
    console.log(`AUDIT TL: ${errors.length} erreur(s) détectée(s)`);
    console.log("\nExemples (10 premiers):");
    errors.slice(0, 10).forEach((e, i) => {
      console.log(`${String(i+1).padStart(2,"0")}. ${e.book}:${e.chap} -> ${e.titleTL}`);
    });

    // Generate CSV
    const csvLines = ["Livre,Chapitre,Titre_TL_Actuel,Titre_FR_Source"];
    for (const e of errors) {
      const escapeCsv = (s) => {
        s = String(s || "").replace(/"/g, '""');
        return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s}"` : s;
      };
      csvLines.push(`${e.book},${e.chap},${escapeCsv(e.titleTL)},${escapeCsv(e.titleFR)}`);
    }
    fs.writeFileSync(CSV_OUT, csvLines.join("\n"), "utf8");
    console.log("\nCSV généré ->", CSV_OUT);
    process.exit(1);
  }

  console.log("AUDIT TL: OK (0 erreur)");
  process.exit(0);
}

main();
