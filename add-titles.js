const fs = require('fs');
const en = require('./titles/EN.json');

// Ajouter les 10 premiers titres manquants (livre 10 - 2 Samuel)
if (!en['10']) en['10'] = {};

en['10']['1'] = 'Song of the Fallen Heroes';
en['10']['2'] = 'Eternal, Our King and Our Guide';
en['10']['3'] = 'Eternal, Our King in Every Season';
en['10']['4'] = 'The Eternal, Our Refuge in Trial';
en['10']['5'] = 'David, King of Glory, Our Victory!';
en['10']['6'] = 'Dance of Praise Before the Eternal';
en['10']['9'] = 'At Your Table, Lord, We Find Grace!';
en['10']['11'] = 'Guard Our Hearts, O Eternal!';
en['10']['16'] = 'In the Storm, I Praise You';
en['10']['22'] = 'My Rock, My Savior';

fs.writeFileSync('./titles/EN.json', JSON.stringify(en, null, 2));
console.log('✓ 10 titres ajoutés avec succès à EN.json!');
