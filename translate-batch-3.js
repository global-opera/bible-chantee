const fs = require('fs');
const en = require('./titles/EN.json');

// Lot 101-150: Traductions EN
const translations = {
  // Livre 19 (Psalms) - suite
  '19': {
    '48': 'Praise the Great King of Zion!',
    '51': 'Pure Heart, Renewed Spirit',
    '52': 'The Eternal Goodness of God',
    '55': 'Cry to the Lord, My Strength and My Peace',
    '61': 'My Refuge, My Fortress',
    '67': 'All Peoples Praise You',
    '71': 'My Eternal Refuge',
    '73': 'My Rock, My Eternal Refuge',
    '90': 'Eternal, Our Refuge',
    '95': 'Let Us Sing to Our King!',
    '96': 'Let Us Sing to the King of Heaven!',
    '98': 'Let Us Sing to the Eternal, Our King!',
    '99': 'The Eternal Reigns in Glory!',
    '100': 'Let Us Celebrate the Eternal, Our Eternal Joy!',
    '101': 'On the Path of Justice',
    '103': 'Bless the Eternal, O My Soul!',
    '104': 'Bless the Eternal, O My Soul!',
    '108': 'Arise, O Lord, in Your Glory!',
    '110': 'At Your Right Hand, O My King',
    '111': 'Praise the Eternal, With All My Heart!',
    '112': 'Blessed the Man of Light',
    '117': 'Praise the Eternal, His Goodness Is Eternal!',
    '118': 'The Eternal, Our Strength Forever!',
    '123': 'Look Upon Us, Eternal!',
    '125': 'Unshakeable in Your Love',
    '128': 'Blessed the Man of God',
    '130': 'Hope in the Eternal',
    '131': 'Hope in the Eternal, Forever!',
    '132': 'Come to Your Rest, Eternal!',
    '133': 'United in Blessing',
    '134': 'Let Us Bless the Eternal, Our King',
    '135': 'Praise the Eternal, Our Foundation!',
    '136': 'Praise the Eternal, His Mercy Endures Forever!',
    '137': 'Remember Jerusalem',
    '142': 'My Refuge, My Light',
    '144': 'Blessed the People of the Eternal',
    '145': 'The Eternal, My Eternal Praise',
    '146': 'The Eternal, Our Eternal Hope',
    '149': 'Sing to the King of Glory!',
    '150': 'Let Us Celebrate the Eternal!'
  },
  // Livre 20 (Proverbs)
  '20': {
    '2': 'In the Light of Your Wisdom',
    '9': 'Wisdom, Enlighten Our Hearts',
    '10': 'The Song of the Righteous',
    '11': 'Justice and Truth',
    '12': 'Establish Us in Your Light',
    '13': 'In Your Light, We Walk',
    '15': 'Answer of Peace',
    '17': 'Peace and Wisdom in You',
    '18': 'My Strong Tower',
    '19': 'Guide My Steps, O Eternal'
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
console.log('✓ Lot 101-150: 50 titres traduits et ajoutés à EN.json!');
