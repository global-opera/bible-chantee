const missing = require('./missing-en.json');

console.log('Lot 101-150:\n');
missing.slice(100, 150).forEach((m, i) => {
  console.log(`${i+101}. Livre ${m.book}, Ch ${m.chapter}: "${m.titleFR}"`);
});
