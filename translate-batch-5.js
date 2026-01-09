const fs = require('fs');
const en = require('./titles/EN.json');

// Lot 201-250: Traductions EN
const translations = {
  // Livre 38 (Zechariah) - suite
  '38': {
    '14': 'The Day of the Eternal'
  },
  // Livre 39 (Malachi)
  '39': {
    '1': 'Great Is the Eternal, Our King',
    '2': 'Awaken Our Hearts to Your Truth',
    '3': 'Purified by Your Light',
    '4': 'The Sun of Righteousness'
  },
  // Livre 40 (Matthew)
  '40': {
    '11': 'Come to Me, Find Rest',
    '12': 'Lord of the Sabbath, Light of Our Lives',
    '13': 'Seeds of Glory',
    '22': 'Come to the Wedding of the King'
  },
  // Livre 41 (Mark)
  '41': {
    '1': 'Prepare the Way of the Lord',
    '6': 'Jesus, Our Eternal Hope',
    '13': 'Watch and Pray',
    '15': 'The Crucified King',
    '16': 'Alleluia, He Is Alive!'
  },
  // Livre 42 (Luke)
  '42': {
    '3': 'Prepare the Way of the Lord!',
    '11': 'In the Light of Prayer',
    '19': 'Blessed Is the King Who Saves Us!',
    '20': 'Cornerstone',
    '24': 'He Is Alive, Alleluia!'
  },
  // Livre 43 (John)
  '43': {
    '2': 'The Miracle of Cana',
    '3': 'Light of Life, Eternal Love',
    '4': 'The Living Water of Grace',
    '13': 'At Your Feet, Lord',
    '15': 'Roots of Love',
    '17': 'United in Your Glory',
    '18': 'The King of Heaven',
    '19': 'Crown of Thorns, Eternal Love'
  },
  // Livre 44 (Acts)
  '44': {
    '3': 'Rise Up and Walk in Him!',
    '5': 'In the Light of Truth',
    '21': 'United for His Glory',
    '28': 'Our Mighty God'
  },
  // Livre 45 (Romans)
  '45': {
    '2': 'Make Us Pure, Lord of Glory',
    '3': 'Redeemed by Faith',
    '5': 'The Love That Liberates',
    '6': 'Free for Eternity',
    '7': 'Freed by the Grace of Christ',
    '9': 'Sons of the Living God',
    '10': 'Come, Lord, and Save Us',
    '11': 'The Eternal Grace of God',
    '12': 'A Sacrifice of Praise',
    '13': 'Let Us Clothe Ourselves in Light and Love',
    '14': 'United in the Love of the Lord'
  },
  // Livre 46 (1 Corinthians)
  '46': {
    '2': 'The Hidden Wisdom of God',
    '11': 'United in Praise to Our Head'
  },
  // Livre 49 (Ephesians)
  '49': {
    '5': 'Walk in the Light of Christ'
  },
  // Livre 50 (Philippians)
  '50': {
    '2': 'Lifted in Praise, Our Savior!',
    '3': 'Let Us Advance to Heavenly Glory',
    '4': 'Rejoice in the Lord!'
  },
  // Livre 51 (Colossians)
  '51': {
    '3': 'Let Us Clothe Ourselves in Love and Light'
  },
  // Livre 56 (Titus)
  '56': {
    '3': 'Heirs of His Grace'
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
console.log('✓ Lot 201-250: 50 titres traduits et ajoutés à EN.json!');
