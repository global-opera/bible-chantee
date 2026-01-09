// tools/audit_en.js
// Audit complet de titles/EN.json vs titles/FR.json
// - détecte caractères accentués (liste donnée)
// - détecte mots FR (liste fournie + articles/stopwords)
// - génère erreurs_EN_completes.csv
// - affiche total + 20 premiers exemples

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, ".."); // ...\bible-chantee
const EN_PATH = path.join(ROOT, "titles", "EN.json");
const FR_PATH = path.join(ROOT, "titles", "FR.json");
const OUT_CSV = path.join(ROOT, "errors_EN_completes.csv");

// 1) Caractères accentués à détecter
const ACCENTED_CHARS = "éèêëàâäùûüôöîïçñÉÈÊËÀÂÄÙÛÜÔÖÎÏÇÑ";
const reAccents = new RegExp("[" + ACCENTED_CHARS.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]");

// 2) Mots français à détecter (liste fournie + quelques variantes courantes)
const FRENCH_WORDS = [
  "Éternel","Eternel","Majesté","Majeste","Seigneur","Dieu","Cœur","Coeur","Lumière","Lumiere","Grâce","Grace",
  "Amour","Gloire","Louange","Promesse","Victoire","Refuge","Fidèle","Fidele","Béni","Beni","Cieux","Terre",
  "Roi","Père","Pere","Mère","Mere","Fils","Fille","Frère","Frere","Sœur","Soeur","Enfant","Peuple","Esprit",
  "Âme","Ame","Corps","Vie","Mort","Jour","Nuit","Temps","Ciel","Mer","Montagne","Vallée","Vallee","Désert",
  "Desert","Jardin","Chemin","Voie","Porte","Pierre","Rocher","Feu","Eau","Vent","Soleil","Lune","Étoile","Etoile",
  "Or","Argent","Pain","Vin","Sang","Main","Pied","Tête","Tete","Œil","Oeil","Yeux",
  "le","la","les","de","du","des","dans","pour","avec","sans","sous","sur","vers","entre",
  "notre","votre","mon","ton","son","mes","tes","ses","une","aux","cette","qui","que","où","ou","toi","moi"
];

// Construit une regex robuste (mots entiers), insensible à la casse, avec gestion apostrophes typographiques
// Note: on match aussi les formes "l'" "d'" etc via une règle dédiée ci-dessous.
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const frenchWordPattern = FRENCH_WORDS
  .map(w => escapeRegex(w))
  // trier les plus longs d'abord (évite que "le" prenne sur "lève" etc)
  .sort((a,b) => b.length - a.length)
  .join("|");

// mots entiers : \b marche mal avec apostrophes, on utilise des séparateurs explicites
// séparateurs: début/fin, espaces, ponctuation courante
const reFrenchWords = new RegExp(
  `(^|[\\s"""'''()\\[\\]{}<>.,;:!?/\\\\|-])(${frenchWordPattern})(?=($|[\\s"""'''()\\[\\]{}<>.,;:!?/\\\\|-]))`,
  "i"
);

// détecte explicitement les élisions FR: l', d', j', c', m', n', s', t', qu'
const reFrenchElision = /(^|[\s"""(\[])(l|d|j|c|m|n|s|t|qu)['']/i;

function normalizeTitle(t) {
  return String(t ?? "").trim();
}

function loadJson(p) {
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

// Échappement CSV minimal
function csvEscape(v) {
  const s = String(v ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// tri numérique sur clés "01","02"... et chapitres "1","2"...
function sortNumKeys(a, b) {
  return Number(a) - Number(b);
}

function isProblematicEN(titleEN) {
  const t = normalizeTitle(titleEN);
  if (!t) return false; // titre vide: on ne le marque pas ici (optionnel)
  if (reAccents.test(t)) return true;
  if (reFrenchWords.test(t)) return true;
  if (reFrenchElision.test(t)) return true;
  return false;
}

function main() {
  if (!fs.existsSync(EN_PATH)) {
    console.error("EN.json introuvable:", EN_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(FR_PATH)) {
    console.error("FR.json introuvable:", FR_PATH);
    process.exit(1);
  }

  const en = loadJson(EN_PATH);
  const fr = loadJson(FR_PATH);

  const errors = [];

  const bookKeys = Object.keys(en).sort(sortNumKeys);

  for (const book of bookKeys) {
    const enBook = en[book] || {};
    const frBook = fr[book] || {};
    const chapKeys = Object.keys(enBook).sort(sortNumKeys);

    for (const chap of chapKeys) {
      const enTitle = normalizeTitle(enBook[chap]);
      const frTitle = normalizeTitle(frBook?.[chap] ?? "");

      if (isProblematicEN(enTitle)) {
        errors.push({
          Livre: book,
          Chapitre: chap,
          Titre_EN_Actuel: enTitle,
          Titre_FR_Source: frTitle
        });
      }
    }
  }

  // CSV complet
  const header = ["Livre","Chapitre","Titre_EN_Actuel","Titre_FR_Source"];
  const lines = [header.join(",")];

  for (const e of errors) {
    lines.push([
      csvEscape(e.Livre),
      csvEscape(e.Chapitre),
      csvEscape(e.Titre_EN_Actuel),
      csvEscape(e.Titre_FR_Source)
    ].join(","));
  }

  fs.writeFileSync(OUT_CSV, lines.join("\n"), "utf8");

  // Affichage console
  console.log("=== AUDIT titles/EN.json ===");
  console.log("Fichier EN:", EN_PATH);
  console.log("Fichier FR:", FR_PATH);
  console.log("CSV généré:", OUT_CSV);
  console.log("TOTAL erreurs détectées:", errors.length);
  console.log("");

  const preview = errors.slice(0, 20);
  console.log("=== 20 premiers exemples ===");
  preview.forEach((e, i) => {
    console.log(
      `${String(i + 1).padStart(2,"0")}. Livre ${e.Livre} Chap ${e.Chapitre}\n` +
      `    EN: ${e.Titre_EN_Actuel}\n` +
      `    FR: ${e.Titre_FR_Source}\n`
    );
  });

  // Exit code non-zero si erreurs (pratique en CI)
  process.exit(errors.length ? 2 : 0);
}

main();
