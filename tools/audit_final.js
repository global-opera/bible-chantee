const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EN_PATH = path.join(ROOT, "titles", "EN.json");

const ACCENTED_CHARS = "éèêëàâäùûüôöîïçñÉÈÊËÀÂÄÙÛÜÔÖÎÏÇÑ";
const reAccents = new RegExp("[" + ACCENTED_CHARS.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]");

// Mots français UNIQUEMENT (pas valides en anglais)
const FRENCH_WORDS = [
  "Éternel","Eternel","Majesté","Majeste","Seigneur","Dieu","Cœur","Coeur","Lumière","Lumiere","Grâce",
  "Amour","Gloire","Louange","Promesse","Victoire","Fidèle","Fidele","Béni","Beni","Cieux","Terre",
  "Roi","Père","Pere","Mère","Mere","Fille","Frère","Frere","Sœur","Soeur","Enfant","Peuple","Esprit",
  "Âme","Ame","Corps","Vie","Mort","Jour","Nuit","Temps","Ciel","Mer","Montagne","Vallée","Vallee","Désert",
  "Jardin","Chemin","Voie","Porte","Pierre","Rocher","Feu","Eau","Vent","Soleil","Lune","Étoile","Etoile",
  "Or","Argent","Pain","Vin","Sang","Main","Pied","Tête","Tete","Œil","Oeil","Yeux",
  "le","la","les","de","du","des","dans","pour","avec","sans","sous","sur","vers","entre",
  "notre","votre","mon","ton","son","mes","tes","ses","une","aux","cette","qui","que","où","ou","toi","moi"
];

// Mots exclus (valides en anglais ET français)
const VALID_ENGLISH = ["Grace", "Refuge", "Desert", "Fils", "Son", "Pain"];

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

const reFrenchElision = /(^|[\s"""(\[])(l|d|j|c|m|n|s|t|qu)['']/i;

function loadJson(p) {
  if (!fs.existsSync(p)) {
    console.error("Introuvable:", p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function main() {
  const en = loadJson(EN_PATH);
  const errors = [];

  for (const book of Object.keys(en)) {
    for (const chap of Object.keys(en[book] || {})) {
      const title = String(en[book][chap] || "").trim();
      if (!title) continue;

      // Check accents
      if (reAccents.test(title)) {
        errors.push({ book, chap, title });
        continue;
      }

      // Check French words (but exclude valid English words)
      const frenchMatch = title.match(reFrenchWords);
      if (frenchMatch) {
        const matchedWord = frenchMatch[2]; // Le mot capturé
        if (!VALID_ENGLISH.some(w => w.toLowerCase() === matchedWord.toLowerCase())) {
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
    console.log("AUDIT FINAL: ECHEC");
    console.log("Erreurs restantes:", errors.length);
    errors.slice(0, 50).forEach((e, i) => {
      console.log(`${String(i+1).padStart(2,"0")}. ${e.book}:${e.chap} -> ${e.title}`);
    });
    process.exit(2);
  }

  console.log("AUDIT FINAL: OK (0 erreur)");
  process.exit(0);
}

main();
