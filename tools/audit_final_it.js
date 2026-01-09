const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IT_PATH = path.join(ROOT, "titles", "IT.json");

const FRENCH_ACCENTS = "êëûôîïÊËÛÔÎÏ";
const reFrenchAccents = new RegExp("[" + FRENCH_ACCENTS.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]");

// French words ONLY (not valid in Italian)
// Note: "Eterno" is valid Italian (means "Eternal"), remove "Éternel"/"Eternel" entirely
const FRENCH_WORDS = [
  "Lumière","Lumiere","Grâce","Grace",
  "Louange","Promesse","Fidèle","Fidele","Béni","Beni","Cœur","Coeur","Père","Pere","Mère","Mere",
  "Frère","Frere","Sœur","Soeur","Âme","Ame","Vallée","Vallee","Désert","Desert","Chemin","Voie",
  "Étoile","Etoile","Tête","Tete","Œil","Oeil",
  "les","du","des","dans","pour","avec","sans","sous","sur","vers","entre",
  "notre","votre","mon","ton","son","mes","tes","ses","une","aux","cette","qui","que","où","ou"
];

// Words valid in both Italian and French (to exclude from detection)
const VALID_ITALIAN = ["Gloria", "Re", "Luce", "Amore", "Vita", "Morte", "Cuore", "Spirito",
                       "Popolo", "Rifugio", "Padre", "Madre", "Figlio", "Figlia", "Fratello",
                       "Sorella", "Corpo", "Anima", "Pace", "Fede", "Cielo", "Terra", "Mare", "Grazia",
                       "Eterno", "Eternel", "Éternel", "Promesse"];

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
  const errors = [];

  for (const book of Object.keys(it)) {
    for (const chap of Object.keys(it[book] || {})) {
      const title = String(it[book][chap] || "").trim();
      if (!title) continue;

      // Check French-specific accents (ê, ë, û, ô not used in Italian)
      if (reFrenchAccents.test(title)) {
        errors.push({ book, chap, title });
        continue;
      }

      // Check French words (but exclude valid Italian words)
      const frenchMatch = title.match(reFrenchWords);
      if (frenchMatch) {
        const matchedWord = frenchMatch[2];
        if (!VALID_ITALIAN.some(w => w.toLowerCase() === matchedWord.toLowerCase())) {
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
    console.log("AUDIT FINAL IT: ECHEC");
    console.log("Erreurs restantes:", errors.length);
    errors.slice(0, 50).forEach((e, i) => {
      console.log(`${String(i+1).padStart(2,"0")}. ${e.book}:${e.chap} -> ${e.title}`);
    });
    process.exit(2);
  }

  console.log("AUDIT FINAL IT: OK (0 erreur)");
  process.exit(0);
}

main();
