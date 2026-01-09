const fs = require('fs');
const en = require('./titles/EN.json');

// Lot 1-50: Traductions EN
const translations = {
  // Livre 10 (2 Samuel)
  '10': {
    '23': 'My Rock, My Praise'
  },
  // Livre 11 (1 Kings)
  '11': {
    '4': 'Wisdom and Peace Under Solomon\'s Reign',
    '7': 'In the House of the Eternal',
    '10': 'The Wisdom of King Solomon',
    '11': 'A Heart Faithful to You',
    '12': 'Guide Our Hearts to Unity',
    '13': 'Hear the Voice of God',
    '14': 'In the Shadow of Your Grace',
    '16': 'Eternal, Our King, Our Light',
    '20': 'Our King, Our Victory',
    '21': 'The Vine of Justice',
    '22': 'Guide Our Steps, Eternal!'
  },
  // Livre 12 (2 Kings)
  '12': {
    '3': 'Eternal, Our Guide',
    '9': 'Jehu, Instrument of Your Justice',
    '10': 'The Zeal of Jehu for the Eternal',
    '13': 'Liberation and Mercy',
    '16': 'Faithful Despite Our Wanderings',
    '19': 'Eternal, Our King, Our Deliverance',
    '23': 'Let Us Walk in the Light of the King',
    '24': 'King of Grace and Redemption'
  },
  // Livre 13 (1 Chronicles)
  '13': {
    '1': 'Genealogy of Grace',
    '2': 'In the Lineage of Your Glory',
    '3': 'Heirs of the Promise',
    '7': 'Glory to You, Lord of Generations!',
    '8': 'Lineages of Praise and Victory',
    '11': 'Eternal of Hosts, Our Victory!',
    '22': 'Let Us Raise Your House, Eternal!',
    '23': 'Forever, We Will Worship You',
    '25': 'United in Praise to the Eternal'
  },
  // Livre 14 (2 Chronicles)
  '14': {
    '1': 'Wisdom and Glory, Our Divine Heritage',
    '2': 'Let Us Build for Our King',
    '4': 'In the Temple of Your Glory',
    '5': 'In Your Presence, Eternal!',
    '7': 'The House of His Glory',
    '8': 'Solomon, Builder of Praises',
    '9': 'The Wisdom and Glory of the King',
    '11': 'Rehoboam, Under Your Protection',
    '12': 'Humility and Grace: Our Song to the Eternal',
    '22': 'In the Shadow of Your Grace',
    '23': 'Long Live the King of Kings!',
    '27': 'Jotham, King of Righteousness and Faith',
    '30': 'Let Us Return to the Eternal!',
    '31': 'Reborn in Your Light',
    '36': 'Rock of Mercy'
  },
  // Livre 15 (Ezra)
  '15': {
    '1': 'In Jerusalem, Let Us Build His House!',
    '2': 'Return to the House of the Lord',
    '3': 'United for the Eternal',
    '4': 'Let Us Build for the Eternal!',
    '6': 'Reborn in Praise'
  },
  // Livre 16 (Nehemiah)
  '16': {
    '2': 'Let Us Rebuild Jerusalem!'
  }
};

// Appliquer les traductions
for (const book in translations) {
  if (!en[book]) en[book] = {};
  for (const chapter in translations[book]) {
    en[book][chapter] = translations[book][chapter];
  }
}

fs.writeFileSync('./titles/EN.json', JSON.stringify(en, null, 2));
console.log('✓ Lot 1-50: 50 titres traduits et ajoutés à EN.json!');
