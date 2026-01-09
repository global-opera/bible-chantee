const fs = require('fs');
const fr = require('./titles/FR.json');
const de = require('./titles/DE.json');

const missing = [];

for (const book in fr) {
  for (const chapter in fr[book]) {
    if (!de[book] || !de[book][chapter]) {
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

console.log(`Total de titres manquants en DE: ${missing.length}`);

fs.writeFileSync('./missing-de.json', JSON.stringify(missing, null, 2));
console.log('✓ Liste sauvegardée dans missing-de.json');
