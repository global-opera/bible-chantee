const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ES_PATH = path.join(ROOT, "titles", "ES.json");
const FR_PATH = path.join(ROOT, "titles", "FR.json");
const CSV_OUT = path.join(ROOT, "errors_ES_completes.csv");

const ACCENTED_CHARS = "éèêëàâäùûüôöîïçñÉÈÊËÀÂÄÙÛÜÔÖÎÏÇÑ";
const reAccents = new RegExp("[" + ACCENTED_CHARS.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]");

// French words that should not appear in Spanish text
const FRENCH_WORDS = [
  "Éternel","Eternel","Majesté","Majeste","Seigneur","Lumière","Lumiere","Grâce","Grace",
  "Louange","Promesse","Fidèle","Fidele","Béni","Beni","Père","Pere","Mère","Mere","Frère","Frere","Sœur","Soeur",
  "Âme","Ame","Vallée","Vallee","Désert","Desert","Chemin","Voie","Étoile","Etoile","Tête","Tete","Œil","Oeil",
  "le","la","les","de","du","des","dans","pour","avec","sans","sous","sur","vers","entre",
  "notre","votre","mon","ton","son","mes","tes","ses","une","aux","cette","qui","que","où","ou","toi","moi"
];

// Words valid in both Spanish and French (to exclude from detection)
const VALID_SPANISH = ["Dios", "Rey", "Luz", "Amor", "Gloria", "Tierra", "Cielo", "Mar", "Vida", "Muerte",
                        "Corazón", "Espíritu", "Pueblo", "Refugio", "Fiel", "Santo", "Padre", "Hijo",
                        "Madre", "Hermano", "Hermana", "Cuerpo", "Alma", "Paz", "Fe"];

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
  const es = loadJson(ES_PATH);
  const fr = loadJson(FR_PATH);
  const errors = [];

  for (const book of Object.keys(es)) {
    for (const chap of Object.keys(es[book] || {})) {
      const title = String(es[book][chap] || "").trim();
      if (!title) continue;

      // Check French accents (é, è, ê, etc. not used in Spanish)
      if (reAccents.test(title)) {
        const frSource = (fr[book] && fr[book][chap]) || "";
        errors.push({ book, chap, titleES: title, titleFR: frSource });
        continue;
      }

      // Check French words
      const frenchMatch = title.match(reFrenchWords);
      if (frenchMatch) {
        const matchedWord = frenchMatch[2];
        if (!VALID_SPANISH.some(w => w.toLowerCase() === matchedWord.toLowerCase())) {
          const frSource = (fr[book] && fr[book][chap]) || "";
          errors.push({ book, chap, titleES: title, titleFR: frSource });
          continue;
        }
      }

      // Check French elision
      if (reFrenchElision.test(title)) {
        const frSource = (fr[book] && fr[book][chap]) || "";
        errors.push({ book, chap, titleES: title, titleFR: frSource });
      }
    }
  }

  if (errors.length) {
    console.log(`AUDIT ES: ${errors.length} erreur(s) détectée(s)`);
    console.log("\nExemples (10 premiers):");
    errors.slice(0, 10).forEach((e, i) => {
      console.log(`${String(i+1).padStart(2,"0")}. ${e.book}:${e.chap} -> ${e.titleES}`);
    });

    // Generate CSV
    const csvLines = ["Livre,Chapitre,Titre_ES_Actuel,Titre_FR_Source"];
    for (const e of errors) {
      const escapeCsv = (s) => {
        s = String(s || "").replace(/"/g, '""');
        return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s}"` : s;
      };
      csvLines.push(`${e.book},${e.chap},${escapeCsv(e.titleES)},${escapeCsv(e.titleFR)}`);
    }
    fs.writeFileSync(CSV_OUT, csvLines.join("\n"), "utf8");
    console.log("\nCSV généré ->", CSV_OUT);
    process.exit(1);
  }

  console.log("AUDIT ES: OK (0 erreur)");
  process.exit(0);
}

main();
