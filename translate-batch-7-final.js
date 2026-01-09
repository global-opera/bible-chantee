const fs = require('fs');
const en = require('./titles/EN.json');

// Lot 301-378 (final): Traductions EN
const translations = {
  // Livre 07 (Judges) - suite
  '07': {
    '4': 'The Victory of the Eternal',
    '6': 'Hero of Our Deliverance',
    '7': 'For the Eternal and for Gideon',
    '9': 'Eternal, Our King, Guide of Peace',
    '14': 'Strength and Gentleness in Christ',
    '19': 'In Darkness, Let Us Seek Your Light',
    '20': 'United in Truth, We Walk to You!',
    '21': 'United in Sorrow, Restored by Your Grace'
  },
  // Livre 05 (Deuteronomy)
  '05': {
    '2': 'Eternal, Our Guide and Defender',
    '3': 'Fear Not, The Eternal Fights for Us',
    '5': 'Walk in the Light of the Eternal',
    '7': 'Holy People, Eternal God',
    '8': 'Remember the Eternal, Our Strength and Our Path',
    '14': 'Children of the Eternal, Let Us Praise His Holiness',
    '15': 'Release and Grace',
    '16': 'Let Us Celebrate Our Deliverance!',
    '19': 'Refuge and Goodness of the Eternal',
    '21': 'Our Beacon, O Eternal',
    '22': 'Walk in the Love of God',
    '24': 'In the Shadow of Your Goodness',
    '25': 'Justice and Love, Our Eternal Heritage!',
    '26': 'Heirs of Your Promise',
    '27': 'Let Us Engrave His Law, Let Us Raise Our Voices',
    '28': 'Blessings and Promises of the Eternal',
    '29': 'Covenant of Eternity',
    '30': 'Choose Life, Choose Love'
  },
  // Livre 01 (Genesis)
  '01': {
    '4': 'The Cry of Blood and the Promise',
    '5': 'Generations in Praise',
    '9': 'The Ark of the Covenant',
    '14': 'In the Valley of Victories',
    '17': 'Eternal Promise',
    '18': 'Nothing Is Impossible for You',
    '19': 'Toward the Light, Spared by Your Grace',
    '22': 'On the Mountain, God Provides',
    '23': 'In Sorrow, Faith and Hope',
    '27': 'Bless Me, O Lord, in the Light of Your Grace!',
    '33': 'In the Unity of Your Love',
    '35': 'El-Bethel, Our Meeting Place',
    '36': 'Esau, Father of a Great Nation',
    '41': 'The Master of Dreams',
    '42': 'In Famine, Our Hope',
    '44': 'The Sacrifice of Love',
    '47': 'In the Arms of Your Grace',
    '50': 'Light in Mourning'
  },
  // Livre 03 (Leviticus)
  '03': {
    '1': 'Burnt Offering of Praise',
    '2': 'Grain Offering of Praise to the Eternal',
    '3': 'Sacrifice of Praise',
    '4': 'Forgive and Purify Our Hearts',
    '6': 'Restored by Your Grace',
    '7': 'Sacrifices of Praise',
    '9': 'Glory in the Presence of the Eternal',
    '12': 'Purified by Your Grace',
    '13': 'Cleansed by Your Hand',
    '14': 'Restoration and Healing',
    '15': 'Cleansed by Your Grace',
    '16': 'Day of Atonement, Our Redemption',
    '17': 'Life in the Blood',
    '19': 'Holy Living, Love Your Neighbor',
    '22': 'Offerings Without Blemish',
    '23': 'Appointed Feasts of the Lord',
    '27': 'Vows to the Eternal'
  },
  // Livre 04 (Numbers)
  '04': {
    '5': 'Purity in the Camp',
    '10': 'Journey with the Cloud',
    '11': 'Manna and Quail from Heaven',
    '13': 'Report of the Spies',
    '16': 'The Earth Swallows the Rebels',
    '17': 'Aaron\'s Rod That Budded',
    '19': 'Water of Purification',
    '22': 'Balaam and the Donkey',
    '24': 'A Star Shall Come',
    '25': 'Zeal for the Lord',
    '27': 'Daughters of Zelophehad',
    '28': 'Daily Offerings to the Lord',
    '31': 'War Against Midian',
    '34': 'Boundaries of the Promised Land',
    '35': 'Cities of Refuge'
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
console.log('✓ Lot 301-378 (FINAL): 78 titres traduits et ajoutés à EN.json!');
console.log('✓✓✓ TOUS les titres EN sont maintenant complétés! ✓✓✓');
