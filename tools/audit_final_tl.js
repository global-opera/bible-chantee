const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TL_PATH = path.join(ROOT, "titles", "TL.json");

const ACCENTED_CHARS = "éèêëàâäùûüôöîïçñÉÈÊËÀÂÄÙÛÜÔÖÎÏÇÑ";
const reAccents = new RegExp("[" + ACCENTED_CHARS.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]");

// French words ONLY (not valid in Tagalog)
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
  const errors = [];

  for (const book of Object.keys(tl)) {
    for (const chap of Object.keys(tl[book] || {})) {
      const title = String(tl[book][chap] || "").trim();
      if (!title) continue;

      // Check French accents (not used in Tagalog)
      if (reAccents.test(title)) {
        errors.push({ book, chap, title });
        continue;
      }

      // Check French words
      const frenchMatch = title.match(reFrenchWords);
      if (frenchMatch) {
        errors.push({ book, chap, title });
        continue;
      }

      // Check French elision
      if (reFrenchElision.test(title)) {
        errors.push({ book, chap, title });
      }
    }
  }

  if (errors.length) {
    console.log("AUDIT FINAL TL: ECHEC");
    console.log("Erreurs restantes:", errors.length);
    errors.slice(0, 50).forEach((e, i) => {
      console.log(`${String(i+1).padStart(2,"0")}. ${e.book}:${e.chap} -> ${e.title}`);
    });
    process.exit(2);
  }

  console.log("AUDIT FINAL TL: OK (0 erreur)");
  process.exit(0);
}

main();
