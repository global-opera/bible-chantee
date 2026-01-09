const title = "Babilônia Caiu, Desperta Nosso Coração!";

// French-specific accents
const FRENCH_ONLY_ACCENTS = "èëùûôöîïÈËÙÛÔÖÎÏ";
const reAccents = new RegExp("[" + FRENCH_ONLY_ACCENTS.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "]");
console.log("Accent match:", reAccents.test(title), reAccents.exec(title));

// French words
const FRENCH_WORDS = [
  "Éternel","Eternel","Majesté","Majeste","Seigneur","Lumière","Lumiere","Grâce","Grace",
  "Louange","Promesse","Fidèle","Fidele","Béni","Beni","Cœur","Coeur","Père","Pere","Mère","Mere",
  "Frère","Frere","Sœur","Soeur","Âme","Ame","Vallée","Vallee","Désert","Desert","Chemin","Voie",
  "Étoile","Etoile","Tête","Tete","Œil","Oeil",
  "le","la","les","du","des","dans","pour","avec","sans","sous","sur","vers","entre",
  "notre","votre","mon","ton","son","mes","tes","ses","une","aux","cette","qui","où","ou","toi","moi"
];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = FRENCH_WORDS.map(w => escapeRegex(w)).sort((a,b) => b.length - a.length).join("|");
const reFrenchWords = new RegExp(
  `(^|[\\s"""'''()\\[\\]{}<>.,;:!?/\\\\|-])(${pattern})(?=($|[\\s"""'''()\\[\\]{}<>.,;:!?/\\\\|-]))`,
  "i"
);

const match = title.match(reFrenchWords);
console.log("Word match:", match);

// French elision
const reFrenchElision = /(^|[\s"""([])(l|j|c|m|n|s|t|qu)['']/i;
console.log("Elision match:", reFrenchElision.test(title), reFrenchElision.exec(title));

console.log("\nTitle:", title);
console.log("Detected issue:", match || reAccents.exec(title) || reFrenchElision.exec(title));
