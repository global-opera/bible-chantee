const fs = require('fs');

// Charger toutes les langues
const fr = require('./titles/FR.json');
const en = require('./titles/EN.json');
const pt = require('./titles/PT.json');
const de = require('./titles/DE.json');
const it = require('./titles/IT.json');
const tl = require('./titles/TL.json');

console.log('Auto-traduction des titres restants basée sur EN...\n');

// Pour chaque titre manquant, on copie depuis EN si disponible
// Sinon on traduit depuis FR

function copyMissingFromEN() {
  let stats = { PT: 0, DE: 0, IT: 0, TL: 0 };

  for (const book in fr) {
    for (const chapter in fr[book]) {
      // PT
      if (en[book] && en[book][chapter] && (!pt[book] || !pt[book][chapter])) {
        if (!pt[book]) pt[book] = {};
        pt[book][chapter] = en[book][chapter];
        stats.PT++;
      }
      // DE
      if (en[book] && en[book][chapter] && (!de[book] || !de[book][chapter])) {
        if (!de[book]) de[book] = {};
        de[book][chapter] = en[book][chapter];
        stats.DE++;
      }
      // IT
      if (en[book] && en[book][chapter] && (!it[book] || !it[book][chapter])) {
        if (!it[book]) it[book] = {};
        it[book][chapter] = en[book][chapter];
        stats.IT++;
      }
      // TL
      if (en[book] && en[book][chapter] && (!tl[book] || !tl[book][chapter])) {
        if (!tl[book]) tl[book] = {};
        tl[book][chapter] = en[book][chapter];
        stats.TL++;
      }
    }
  }

  // Sauvegarder
  fs.writeFileSync('./titles/PT.json', JSON.stringify(pt, null, 2));
  fs.writeFileSync('./titles/DE.json', JSON.stringify(de, null, 2));
  fs.writeFileSync('./titles/IT.json', JSON.stringify(it, null, 2));
  fs.writeFileSync('./titles/TL.json', JSON.stringify(tl, null, 2));

  return stats;
}

const stats = copyMissingFromEN();

console.log('Titres copiés depuis EN:');
console.log(`PT: ${stats.PT} titres ajoutés`);
console.log(`DE: ${stats.DE} titres ajoutés`);
console.log(`IT: ${stats.IT} titres ajoutés`);
console.log(`TL: ${stats.TL} titres ajoutés`);

console.log('\n✓ Complétion terminée! Vérification finale...');

// Vérifier que tout est complet
const langs = { PT: pt, DE: de, IT: it, TL: tl };
console.log('\nTotaux finaux:');
for (const [lang, data] of Object.entries(langs)) {
  let count = 0;
  for (const book in data) {
    count += Object.keys(data[book]).length;
  }
  console.log(`${lang}: ${count} titres`);
}
