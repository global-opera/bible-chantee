const fs = require('fs');
const en = require('./titles/EN.json');

// Lot 51-100: Traductions EN
const translations = {
  // Livre 16 (Nehemiah)
  '16': {
    '3': 'Builders of Praise',
    '11': 'In Jerusalem, Our Heart Is Yours',
    '13': 'Restoration and Praise'
  },
  // Livre 17 (Esther)
  '17': {
    '1': 'The Feast of Glory',
    '4': 'For Such a Time as This',
    '6': 'Lifted in the Glory of God',
    '8': 'The Victory of the King of Heaven',
    '9': 'Days of Joy and Victory'
  },
  // Livre 18 (Job)
  '18': {
    '1': 'Faithful in the Midst of Trial',
    '6': 'In the Abyss, I Call to You',
    '16': 'My Witness in the Heavens',
    '17': 'Light in the Darkness',
    '18': 'Light in the Shadows',
    '19': 'My Redeemer Lives!',
    '20': 'The Eternal Justice of God',
    '21': 'Light in the Tumult',
    '28': 'The Wisdom Hidden in You',
    '32': 'Hear the Voice of the Eternal',
    '33': 'God, Our Refuge and Light',
    '34': 'Justice and Praise to the God of Heaven',
    '36': 'God, Our Power and Our Hope!',
    '37': 'Majesty of the Almighty',
    '40': 'In the Storm of Your Power',
    '41': 'King of Proud Creatures'
  },
  // Livre 19 (Psalms)
  '19': {
    '3': 'My Shield, My Hope',
    '4': 'In Your Light',
    '5': 'Light and Truth of My Heart',
    '6': 'Call for Mercy',
    '8': 'Eternal Majesty',
    '10': 'Arise, O Eternal!',
    '11': 'Eternal Refuge',
    '14': 'In the Light of Your Grace',
    '18': 'My Strength and My Deliverance',
    '19': 'Song of Glory to the Heavens',
    '21': 'Let Us Celebrate Your Majesty!',
    '23': 'My Shepherd, My Light',
    '24': 'The King of Glory Enters Our Hearts!',
    '25': 'Eternal, My Light and My Shelter',
    '28': 'Eternal, My Strength and My Shield',
    '29': 'Glory to the Eternal, Our Mighty King!',
    '30': 'From Darkness to Joy',
    '31': 'My Eternal Refuge',
    '32': 'Blessed in Your Grace',
    '33': 'The Eternal, Our Strength and Our Praise',
    '36': 'The Goodness That Reaches the Heavens',
    '37': 'The Eternal, My Eternal Refuge',
    '42': 'Hope in Him, My Eternal Praise',
    '44': 'Awake, O Lord!',
    '46': 'God, My Eternal Refuge',
    '47': 'The Eternal, Our Sovereign King!'
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
console.log('✓ Lot 51-100: 50 titres traduits et ajoutés à EN.json!');
