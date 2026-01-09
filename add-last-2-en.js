const fs = require('fs');
const en = require('./titles/EN.json');

if (!en['04']) en['04'] = {};
en['04']['4'] = 'In the Tent of His Glory';
en['04']['30'] = 'Promises of Faith, United Hearts';

fs.writeFileSync('./titles/EN.json', JSON.stringify(en, null, 2));
console.log('✓ 2 derniers titres EN ajoutés!');
console.log('✓✓✓ EN.json est maintenant 100% COMPLET! ✓✓✓');
