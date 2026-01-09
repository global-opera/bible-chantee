const fs = require('fs');
const en = require('./titles/EN.json');

// Lot 151-200: Traductions EN
const translations = {
  // Livre 20 (Proverbs) - suite
  '20': {
    '21': 'In Your Hand, Eternal',
    '22': 'Riches of Grace',
    '24': 'Build Up My House'
  },
  // Livre 21 (Ecclesiastes)
  '21': {
    '4': 'Comfort Us, Lord',
    '6': 'Beyond Desires, I Find Peace',
    '7': 'In the House of Mourning'
  },
  // Livre 22 (Song of Solomon)
  '22': {
    '5': 'In the Garden of His Love',
    '8': 'Eternal Love'
  },
  // Livre 23 (Isaiah)
  '23': {
    '1': 'Restoration of Zion',
    '11': 'Branch of Glory',
    '12': 'Springs of Salvation',
    '13': 'The Day of the Eternal Has Come',
    '15': 'In Lamentation, Hope Shines',
    '18': 'Lift Up Your Eyes',
    '19': 'On the Clouds of Hope',
    '20': 'The Eternal, Our Eternal Salvation',
    '21': 'In the Storm, Lord, We Praise You!',
    '22': 'Key of Promise',
    '64': 'Come, Lord, Show Us Your Glory!'
  },
  // Livre 24 (Jeremiah)
  '24': {
    '10': 'Lord, None Is Like You',
    '11': 'Hear, O Beloved People',
    '12': 'Restore, Eternal',
    '19': 'Broken Vessel, Heart Restored',
    '20': 'My Eternal Hero',
    '21': 'Path of Life, Eternal Light',
    '23': 'Gather Us, Eternal',
    '40': 'Freedom in Chains',
    '52': 'In the Storm, Your Grace'
  },
  // Livre 26 (Ezekiel)
  '26': {
    '14': 'Return to Your Grace',
    '15': 'Restore in Us Your Sweet Face',
    '32': 'The Judge of Nations',
    '39': 'Our Conqueror, The Eternal',
    '45': 'Holy Portion, Pure Heart',
    '47': 'The Water of Life That Renews'
  },
  // Livre 27 (Daniel)
  '27': {
    '4': 'Eternal, King of Heaven!'
  },
  // Livre 28 (Hosea)
  '28': {
    '2': 'Drawn to the Desert of Hope',
    '13': 'God Alone, Our Savior'
  },
  // Livre 29 (Joel)
  '29': {
    '2': 'Return to Us, O Eternal',
    '3': 'The Judgment and Redemption of Zion'
  },
  // Livre 30 (Amos)
  '30': {
    '2': 'Hear the Voice of the Eternal',
    '7': 'Lord, Our Refuge',
    '8': 'Basket of Fruit: Return to the Eternal'
  },
  // Livre 31 (Obadiah)
  '31': {
    '1': 'The Day of Salvation in Zion!'
  },
  // Livre 32 (Jonah)
  '32': {
    '2': 'In the Depths, I Praise You',
    '4': 'The Mercy That Saves'
  },
  // Livre 33 (Micah)
  '33': {
    '3': 'Grant Us Justice, Eternal',
    '4': 'To the Mountain of Love'
  },
  // Livre 34 (Nahum)
  '34': {
    '2': 'The Restored Glory of the Lord'
  },
  // Livre 38 (Zechariah)
  '38': {
    '2': 'Jerusalem, Awake!',
    '9': 'The King of Peace'
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
console.log('✓ Lot 151-200: 50 titres traduits et ajoutés à EN.json!');
