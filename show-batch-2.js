const missing = require('./missing-en.json');

console.log('Lot 51-100:\n');
missing.slice(50, 100).forEach((m, i) => {
  console.log(`${i+51}. Livre ${m.book}, Ch ${m.chapter}: "${m.titleFR}"`);
});
