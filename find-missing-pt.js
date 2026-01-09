const fs = require('fs');
const fr = require('./titles/FR.json');
const pt = require('./titles/PT.json');

const missing = [];

for (const book in fr) {
  for (const chapter in fr[book]) {
    if (!pt[book] || !pt[book][chapter]) {
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

console.log(`Total de titres manquants en PT: ${missing.length}`);

fs.writeFileSync('./missing-pt.json', JSON.stringify(missing, null, 2));
console.log('✓ Liste sauvegardée dans missing-pt.json');
