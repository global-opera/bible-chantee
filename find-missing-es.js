const fs = require('fs');
const fr = require('./titles/FR.json');
const es = require('./titles/ES.json');

const missing = [];

for (const book in fr) {
  for (const chapter in fr[book]) {
    if (!es[book] || !es[book][chapter]) {
      let title = fr[book][chapter];
      const prefixMatch = title.match(/^[^-]+ - [""]?(.+)[""]?$/);
      if (prefixMatch) {
        title = prefixMatch[1].trim();
      }
      title = title.replace(/^[""]|[""]$/g, '');

      missing.push({
        book,
        chapter,
        titleFR: title
      });
    }
  }
}

console.log(`Total de titres manquants en ES: ${missing.length}`);
console.log(`\nPremiers 50 titres à traduire:\n`);

fs.writeFileSync('./missing-es.json', JSON.stringify(missing, null, 2));

missing.slice(0, 50).forEach((m, i) => {
  console.log(`${i+1}. Livre ${m.book}, Ch ${m.chapter}: "${m.titleFR}"`);
});
