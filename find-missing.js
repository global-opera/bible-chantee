const fr = require('./titles/FR.json');
const en = require('./titles/EN.json');

const missing = [];

for (const book in fr) {
  for (const chapter in fr[book]) {
    if (!en[book] || !en[book][chapter]) {
      missing.push({
        book,
        chapter,
        title: fr[book][chapter]
      });
      if (missing.length >= 10) break;
    }
  }
  if (missing.length >= 10) break;
}

console.log('10 premiers titres manquants en EN:\n');
missing.forEach((m, i) => {
  console.log(`${i+1}. Livre ${m.book}, Chapitre ${m.chapter}: "${m.title}"`);
});
