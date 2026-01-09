const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ES_PATH = path.join(ROOT, "titles", "ES.json");

// French-specific accents NOT used in Spanish (Spanish uses á,é,í,ó,ú,ñ,ü which are valid)
const FRENCH_ONLY_ACCENTS = "èêëàâäùûôöîïçÈÊËÀÂÄÙÛÔÖÎÏÇ";
const reAccents = new RegExp("[" + FRENCH_ONLY_ACCENTS.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]");

// French words ONLY (not valid in Spanish)
// Note: Exclude "de", "que" (Spanish "that"), "la", "el", "los", "las" which are valid in Spanish
const FRENCH_WORDS = [
  "Éternel","Eternel","Majesté","Majeste","Seigneur","Lumière","Lumiere","Grâce","Grace",
  "Louange","Promesse","Fidèle","Fidele","Béni","Beni","Père","Pere","Mère","Mere","Frère","Frere","Sœur","Soeur",
  "Âme","Ame","Vallée","Vallee","Désert","Desert","Chemin","Voie","Étoile","Etoile","Tête","Tete","Œil","Oeil",
  "le","les","du","des","dans","pour","avec","sans","sous","sur","vers","entre",
  "notre","votre","mon","ton","son","mes","tes","ses","une","aux","cette","qui","où","ou","toi","moi"
];

// Words valid in both Spanish and French (to exclude from detection)
const VALID_SPANISH = ["Dios", "Rey", "Luz", "Amor", "Gloria", "Tierra", "Cielo", "Mar", "Vida", "Muerte",
                        "Corazón", "Espíritu", "Pueblo", "Refugio", "Fiel", "Santo", "Padre", "Hijo",
                        "Madre", "Hermano", "Hermana", "Cuerpo", "Alma", "Paz", "Fe", "Gracia", "Señor"];

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
  const errors = [];

  for (const book of Object.keys(es)) {
    for (const chap of Object.keys(es[book] || {})) {
      const title = String(es[book][chap] || "").trim();
      if (!title) continue;

      // Check French accents
      if (reAccents.test(title)) {
        errors.push({ book, chap, title });
        continue;
      }

      // Check French words (but exclude valid Spanish words)
      const frenchMatch = title.match(reFrenchWords);
      if (frenchMatch) {
        const matchedWord = frenchMatch[2];
        if (!VALID_SPANISH.some(w => w.toLowerCase() === matchedWord.toLowerCase())) {
          errors.push({ book, chap, title });
          continue;
        }
      }

      // Check French elision
      if (reFrenchElision.test(title)) {
        errors.push({ book, chap, title });
      }
    }
  }

  if (errors.length) {
    console.log("AUDIT FINAL ES: ECHEC");
    console.log("Erreurs restantes:", errors.length);
    errors.slice(0, 50).forEach((e, i) => {
      console.log(`${String(i+1).padStart(2,"0")}. ${e.book}:${e.chap} -> ${e.title}`);
    });
    process.exit(2);
  }

  console.log("AUDIT FINAL ES: OK (0 erreur)");
  process.exit(0);
}

main();
