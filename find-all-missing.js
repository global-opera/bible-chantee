const fs = require('fs');
const fr = require('./titles/FR.json');
const en = require('./titles/EN.json');

const missing = [];

// Parcourir tous les livres et chapitres
for (const book in fr) {
  for (const chapter in fr[book]) {
    if (!en[book] || !en[book][chapter]) {
      // Extraire le titre sans le préfixe "Livre X, Chapitre Y -"
      let title = fr[book][chapter];

      // Enlever les préfixes comme "2 Samuel 1 - " ou similaires
      const prefixMatch = title.match(/^[^-]+ - [""]?(.+)[""]?$/);
      if (prefixMatch) {
        title = prefixMatch[1].trim();
      }

      // Enlever les guillemets doubles au début/fin si présents
      title = title.replace(/^[""]|[""]$/g, '');

      missing.push({
        book,
        chapter,
        titleFR: title
      });
    }
  }
}

console.log(`Total de titres manquants en EN: ${missing.length}`);
console.log(`\nPremiers 50 titres à traduire:\n`);

// Sauvegarder dans un fichier JSON pour traitement
fs.writeFileSync('./missing-en.json', JSON.stringify(missing, null, 2));

// Afficher les 50 premiers
missing.slice(0, 50).forEach((m, i) => {
  console.log(`${i+1}. Livre ${m.book}, Ch ${m.chapter}: "${m.titleFR}"`);
});
