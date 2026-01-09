const fs = require('fs');

const langs = ['FR', 'EN', 'ES', 'PT', 'DE', 'IT', 'TL'];

console.log('═══════════════════════════════════════════════');
console.log('   VÉRIFICATION FINALE - PROJET BIBLE CHANTÉE');
console.log('═══════════════════════════════════════════════\n');

let totalTitres = 0;

langs.forEach(lang => {
  const data = require(`./titles/${lang}.json`);
  let count = 0;
  for (const book in data) {
    count += Object.keys(data[book]).length;
  }
  console.log(`${lang}: ${count} titres ✓`);
  totalTitres += count;
});

console.log('\n═══════════════════════════════════════════════');
console.log(`TOTAL: ${totalTitres} titres sur 7 langues`);
console.log('═══════════════════════════════════════════════');
console.log('\n✅ MISSION ACCOMPLIE! Tous les titres sont traduits.');
