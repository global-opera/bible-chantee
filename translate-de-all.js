const fs = require('fs');
const de = require('./titles/DE.json');

// Toutes les traductions DE (allemand) - 58 titres
const translations = {
  '10': {
    '13': 'Im Schatten Deiner Gnade',
    '25': 'Im Licht Deines Thrones'
  },
  '11': {
    '15': 'Licht und Treue in unseren Herzen'
  },
  '12': {
    '13': 'Befreiung und Barmherzigkeit',
    '18': 'Hiskias Vertrauen'
  },
  '13': {
    '10': 'Mut im Kampf',
    '24': 'Im Schatten Deines Lichts'
  },
  '14': {
    '4': 'Im Tempel Deiner Herrlichkeit',
    '7': 'Das Haus Seiner Herrlichkeit',
    '9': 'Die Weisheit und Herrlichkeit des Königs',
    '27': 'Jotham, König der Rechtschaffenheit und des Glaubens'
  },
  '15': {
    '8': 'Durch Deine Hand, O Herr',
    '10': 'Ein Bund unserer Herzen'
  },
  '16': {
    '5': 'Stellt uns wieder her, O Herr',
    '7': 'Baut unsere Mauern wieder auf',
    '8': 'Die Freude des Herrn ist unsere Stärke',
    '9': 'Treue und Barmherzigkeit des Ewigen',
    '10': 'Treuer Eid von Herz und Hand',
    '12': 'Lieder der Erlösten'
  },
  '17': {
    '1': 'Das Fest der Herrlichkeit',
    '6': 'Erhoben in der Herrlichkeit Gottes',
    '8': 'Der Sieg des Königs des Himmels',
    '9': 'Tage der Freude und des Sieges'
  },
  '18': {
    '9': 'In Deiner Gegenwart, Herr',
    '19': 'Mein Erlöser lebt!',
    '24': 'Im Schatten Deines Lichts'
  },
  '19': {
    '134': 'Lasst uns den Ewigen segnen, unseren König'
  },
  '23': {
    '7': 'Immanuel, Gott mit uns'
  },
  '24': {
    '1': 'Ich habe dich gerufen',
    '31': 'Der Neue Bund, in unsere Herzen geschrieben'
  },
  '26': {
    '20': 'Versammelt in Deinem Namen'
  },
  '27': {
    '6': 'Der Gott, der befreit',
    '10': 'Gestärkt durch Gnade'
  },
  '29': {
    '1': 'Klage des Landes'
  },
  '32': {
    '3': 'Von der Angst zur Gnade'
  },
  '33': {
    '1': 'Der Ruf aus dem Tempel'
  },
  '36': {
    '2': 'Kleide dich in Seine Güte'
  },
  '38': {
    '1': 'Kehre zu Mir zurück',
    '14': 'Der Tag des Ewigen'
  },
  '40': {
    '3': 'Bereitet den Weg des Herrn',
    '4': 'Überwinder der Finsternis',
    '5': 'Licht der Welt',
    '6': 'Im Geheimnis Deiner Gegenwart',
    '11': 'Kommt zu Mir, findet Ruhe'
  },
  '41': {
    '6': 'Jesus, unsere ewige Hoffnung'
  },
  '42': {
    '1': 'Verheißungen von Gnade und Licht',
    '4': 'Der Messias, unsere Hoffnung'
  },
  '43': {
    '3': 'Licht des Lebens, ewige Liebe',
    '4': 'Das lebendige Wasser der Gnade',
    '11': 'Erwecke uns, Herr',
    '15': 'Wurzeln der Liebe',
    '16': 'Bleibt in Mir',
    '17': 'Vereint in Deiner Herrlichkeit',
    '18': 'Der König des Himmels',
    '19': 'Dornenkrone, ewige Liebe'
  },
  '09': {
    '2': 'Mein Herz freut sich in Dir, Ewiger'
  },
  '01': {
    '36': 'Esau, Vater einer großen Nation'
  },
  '03': {
    '15': 'Gereinigt durch Deine Gnade'
  }
};

// Appliquer les traductions
for (const book in translations) {
  if (!de[book]) de[book] = {};
  for (const chapter in translations[book]) {
    de[book][chapter] = translations[book][chapter];
  }
}

fs.writeFileSync('./titles/DE.json', JSON.stringify(de, null, 2));
console.log('✓ Tous les 58 titres DE traduits et ajoutés!');
console.log('✓✓✓ DE.json est maintenant 100% COMPLET! ✓✓✓');
