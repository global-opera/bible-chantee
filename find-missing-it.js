const fs = require('fs');
const fr = require('./titles/FR.json');
const it = require('./titles/IT.json');

const missing = [];

for (const book in fr) {
  for (const chapter in fr[book]) {
    if (!it[book] || !it[book][chapter]) {
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

console.log(`Total de titres manquants en IT: ${missing.length}`);

fs.writeFileSync('./missing-it.json', JSON.stringify(missing, null, 2));
console.log('✓ Liste sauvegardée dans missing-it.json');
