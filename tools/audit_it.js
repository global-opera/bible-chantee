const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IT_PATH = path.join(ROOT, "titles", "IT.json");
const FR_PATH = path.join(ROOT, "titles", "FR.json");
const CSV_OUT = path.join(ROOT, "errors_IT_completes.csv");

const FRENCH_ACCENTS = "êëûôîïÊËÛÔÎÏ";
const reFrenchAccents = new RegExp("[" + FRENCH_ACCENTS.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]");

// French words that should not appear in Italian text
// Note: Exclude "la", "le", "de", "per" which are valid in Italian
const FRENCH_WORDS = [
  "Éternel","Eternel","Majesté","Majeste","Seigneur","Lumière","Lumiere","Grâce","Grace",
  "Louange","Promesse","Fidèle","Fidele","Béni","Beni","Cœur","Coeur","Père","Pere","Mère","Mere",
  "Frère","Frere","Sœur","Soeur","Âme","Ame","Vallée","Vallee","Désert","Desert","Chemin","Voie",
  "Étoile","Etoile","Tête","Tete","Œil","Oeil",
  "les","du","des","dans","pour","avec","sans","sous","sur","vers","entre",
  "notre","votre","mon","ton","son","mes","tes","ses","une","aux","cette","qui","que","où","ou"
];

// Valid Italian words that might look like French (to exclude)
const VALID_ITALIAN = ["Gloria", "Re", "Luce", "Amore", "Vita", "Morte", "Cuore", "Spirito",
                       "Popolo", "Rifugio", "Padre", "Madre", "Figlio", "Figlia", "Fratello",
                       "Sorella", "Corpo", "Anima", "Pace", "Fede", "Cielo", "Terra", "Mare"];

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

// Italian uses l', d', dell', nell', all', etc. - only flag French-specific elisions
const reFrenchElision = /(^|[\s"""([])(j|c|m|n|s|t|qu)['']/i;

function loadJson(p) {
  if (!fs.existsSync(p)) {
    console.error("Introuvable:", p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function main() {
  const it = loadJson(IT_PATH);
  const fr = loadJson(FR_PATH);
  const errors = [];

  for (const book of Object.keys(it)) {
    for (const chap of Object.keys(it[book] || {})) {
      const title = String(it[book][chap] || "").trim();
      if (!title) continue;

      // Check French-specific accents (ê, ë, û, ô not used in Italian)
      if (reFrenchAccents.test(title)) {
        const frSource = (fr[book] && fr[book][chap]) || "";
        errors.push({ book, chap, titleIT: title, titleFR: frSource });
        continue;
      }

      // Check French words
      const frenchMatch = title.match(reFrenchWords);
      if (frenchMatch) {
        const matchedWord = frenchMatch[2];
        if (!VALID_ITALIAN.some(w => w.toLowerCase() === matchedWord.toLowerCase())) {
          const frSource = (fr[book] && fr[book][chap]) || "";
          errors.push({ book, chap, titleIT: title, titleFR: frSource });
          continue;
        }
      }

      // Check French elision
      if (reFrenchElision.test(title)) {
        const frSource = (fr[book] && fr[book][chap]) || "";
        errors.push({ book, chap, titleIT: title, titleFR: frSource });
      }
    }
  }

  if (errors.length) {
    console.log(`AUDIT IT: ${errors.length} erreur(s) détectée(s)`);
    console.log("\nExemples (10 premiers):");
    errors.slice(0, 10).forEach((e, i) => {
      console.log(`${String(i+1).padStart(2,"0")}. ${e.book}:${e.chap} -> ${e.titleIT}`);
    });

    // Generate CSV
    const csvLines = ["Livre,Chapitre,Titre_IT_Actuel,Titre_FR_Source"];
    for (const e of errors) {
      const escapeCsv = (s) => {
        s = String(s || "").replace(/"/g, '""');
        return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s}"` : s;
      };
      csvLines.push(`${e.book},${e.chap},${escapeCsv(e.titleIT)},${escapeCsv(e.titleFR)}`);
    }
    fs.writeFileSync(CSV_OUT, csvLines.join("\n"), "utf8");
    console.log("\nCSV généré ->", CSV_OUT);
    process.exit(1);
  }

  console.log("AUDIT IT: OK (0 erreur)");
  process.exit(0);
}

main();
