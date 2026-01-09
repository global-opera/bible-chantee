const fs = require('fs');
const en = require('./titles/EN.json');

// Lot 251-300: Traductions EN
const translations = {
  // Livre 58 (Hebrews)
  '58': {
    '2': 'A Great Salvation in Jesus',
    '4': 'Let Us Enter God\'s Rest',
    '5': 'High Priest, Our Redeemer',
    '6': 'Anchor of Our Soul'
  },
  // Livre 60 (1 Peter)
  '60': {
    '5': 'Under the Mighty Hand of God'
  },
  // Livre 62 (1 John)
  '62': {
    '5': 'Triumph in Christ'
  },
  // Livre 63 (2 John)
  '63': {
    '1': 'In Love and Truth'
  },
  // Livre 64 (3 John)
  '64': {
    '1': 'Let Us Walk in Truth!'
  },
  // Livre 66 (Revelation)
  '66': {
    '1': 'Jesus, Our Eternal King',
    '17': 'The Victorious Lamb',
    '20': 'Eternal Victory, Our King!',
    '21': 'The New Jerusalem, Our Eternal Hope'
  },
  // Livre 09 (1 Samuel)
  '09': {
    '3': 'Hear, Eternal, I Am Yours',
    '4': 'The Eternal, Our Savior',
    '5': 'The Power of the Eternal',
    '6': 'The Ark of Glory, Return and Praise!',
    '19': 'Faithful at Heart, Divine Refuge',
    '21': 'Shelter in the Storm',
    '22': 'My Strength in the Storm',
    '25': 'Wisdom and Peace in the Storm',
    '28': 'In the Storm, Lord, Our Refuge',
    '30': 'In the Storm, I Turn to You',
    '31': 'In the Night, Your Light'
  },
  // Livre 08 (Ruth)
  '08': {
    '2': 'Under the Wings of Grace',
    '4': 'Redemption at the Gate of Bethlehem'
  },
  // Livre 06 (Joshua)
  '06': {
    '4': 'Let Us Remember His Power',
    '6': 'The Walls of Jericho Fall!',
    '7': 'Sanctify Us, O Lord!',
    '12': 'Victory and Praise to the King of Kings',
    '13': 'The Inheritance of the Promise',
    '14': 'Heirs of the Promise',
    '16': 'Heirs of His Promise',
    '19': 'The Inheritance of Our God',
    '20': 'Cities of Refuge, Shelter of Grace',
    '21': 'Cities of Refuge, Our Praise',
    '22': 'Witness of Our Unity'
  },
  // Livre 02 (Exodus)
  '02': {
    '3': 'Here I Am, O Eternal',
    '9': 'Eternal, Your Power Manifests',
    '12': 'The Passover of Our Liberation',
    '15': 'Song of Deliverance and Glory',
    '16': 'Manna from Heaven, Bread of Life',
    '17': 'The Eternal, Our Rock and Banner!',
    '18': 'Blessed Be the Eternal, Our Deliverer!',
    '26': 'In the Tabernacle of Your Glory',
    '28': 'Holiness to the Eternal, Our Redemption',
    '35': 'Offering of Hearts',
    '37': 'Light in the Holy of Holies',
    '38': 'Sanctuary of Praise',
    '40': 'Glory in the Cloud'
  },
  // Livre 07 (Judges)
  '07': {
    '2': 'Remind Us, Eternal!'
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
console.log('✓ Lot 251-300: 50 titres traduits et ajoutés à EN.json!');
