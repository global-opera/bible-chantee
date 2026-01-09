const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PT_PATH = path.join(ROOT, "titles", "PT.json");

// French-specific accents NOT used in Portuguese (Portuguese uses á,â,ã,à,é,ê,í,ó,ô,õ,ú,ü,ç which are valid)
// Note: ô is VALID in Portuguese (avô, vovô, pôr, etc.), so exclude it
const FRENCH_ONLY_ACCENTS = "èëùûöîïÈËÙÛÖÎÏ";
const reAccents = new RegExp("[" + FRENCH_ONLY_ACCENTS.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]");

// French words ONLY (not valid in Portuguese)
const FRENCH_WORDS = [
  "Éternel","Eternel","Majesté","Majeste","Seigneur","Lumière","Lumiere","Grâce","Grace",
  "Louange","Promesse","Fidèle","Fidele","Béni","Beni","Cœur","Coeur","Père","Pere","Mère","Mere",
  "Frère","Frere","Sœur","Soeur","Âme","Ame","Vallée","Vallee","Désert","Desert","Chemin","Voie",
  "Étoile","Etoile","Tête","Tete","Œil","Oeil",
  "le","la","les","du","des","dans","pour","avec","sans","sous","sur","vers","entre",
  "notre","votre","mon","ton","son","mes","tes","ses","une","aux","cette","qui","où","ou","toi","moi"
];

// Words valid in both Portuguese and French (to exclude from detection)
const VALID_PORTUGUESE = ["Deus", "Rei", "Luz", "Amor", "Glória", "Terra", "Céu", "Mar", "Vida", "Morte",
                          "Coração", "Espírito", "Povo", "Refúgio", "Fiel", "Santo", "Pai", "Filho",
                          "Mãe", "Irmão", "Irmã", "Corpo", "Alma", "Paz", "Fé", "Graça", "Senhor", "Que"];

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

// Portuguese doesn't use l', d', etc. as extensively as French
const reFrenchElision = /(^|[\s"""([])(l|j|c|m|n|s|t|qu)['']/i;

function loadJson(p) {
  if (!fs.existsSync(p)) {
    console.error("Introuvable:", p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function main() {
  const pt = loadJson(PT_PATH);
  const errors = [];

  for (const book of Object.keys(pt)) {
    for (const chap of Object.keys(pt[book] || {})) {
      const title = String(pt[book][chap] || "").trim();
      if (!title) continue;

      // Check French-specific accents
      if (reAccents.test(title)) {
        errors.push({ book, chap, title });
        continue;
      }

      // Check French words (but exclude valid Portuguese words)
      const frenchMatch = title.match(reFrenchWords);
      if (frenchMatch) {
        const matchedWord = frenchMatch[2];
        if (!VALID_PORTUGUESE.some(w => w.toLowerCase() === matchedWord.toLowerCase())) {
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
    console.log("AUDIT FINAL PT: ECHEC");
    console.log("Erreurs restantes:", errors.length);
    errors.slice(0, 50).forEach((e, i) => {
      console.log(`${String(i+1).padStart(2,"0")}. ${e.book}:${e.chap} -> ${e.title}`);
    });
    process.exit(2);
  }

  console.log("AUDIT FINAL PT: OK (0 erreur)");
  process.exit(0);
}

main();
