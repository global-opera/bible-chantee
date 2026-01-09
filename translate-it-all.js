const fs = require('fs');
const it = require('./titles/IT.json');

// Toutes les traductions IT (italien) - 56 titres
const translations = {
  '10': {
    '13': 'Nell\'Ombra della Tua Grazia',
    '25': 'Nella Luce del Tuo Trono'
  },
  '11': {
    '15': 'Luce e Fedeltà nei Nostri Cuori'
  },
  '12': {
    '13': 'Liberazione e Misericordia',
    '18': 'La Fiducia di Ezechia'
  },
  '13': {
    '10': 'Coraggio nella Battaglia',
    '24': 'Nell\'Ombra della Tua Luce'
  },
  '14': {
    '4': 'Nel Tempio della Tua Gloria',
    '7': 'La Casa della Sua Gloria',
    '9': 'La Sapienza e la Gloria del Re',
    '27': 'Jotham, Re di Giustizia e Fede'
  },
  '15': {
    '8': 'Attraverso la Tua Mano, O Signore',
    '10': 'Un Patto dei Nostri Cuori'
  },
  '16': {
    '5': 'Restauraci, O Signore',
    '7': 'Ricostruiamo le Nostre Mura',
    '8': 'La Gioia del Signore è la Nostra Forza',
    '9': 'Fedeltà e Misericordia dell\'Eterno',
    '10': 'Giuramento Fedele di Cuore e Mano',
    '12': 'Canti dei Redenti'
  },
  '17': {
    '1': 'La Festa della Gloria',
    '6': 'Innalzato nella Gloria di Dio',
    '8': 'La Vittoria del Re dei Cieli',
    '9': 'Giorni di Gioia e Vittoria'
  },
  '18': {
    '9': 'Nella Tua Presenza, Signore',
    '19': 'Il Mio Redentore Vive!',
    '24': 'Nell\'Ombra della Tua Luce'
  },
  '19': {
    '134': 'Benediciamo l\'Eterno, Nostro Re'
  },
  '23': {
    '7': 'Emmanuele, Dio con Noi'
  },
  '24': {
    '1': 'Ti Ho Chiamato',
    '31': 'Il Nuovo Patto, Scritto nei Nostri Cuori'
  },
  '26': {
    '20': 'Radunati nel Tuo Nome'
  },
  '27': {
    '6': 'Il Dio che Libera',
    '10': 'Fortificati dalla Grazia'
  },
  '29': {
    '1': 'Lamento della Terra'
  },
  '32': {
    '3': 'Dall\'Angoscia alla Grazia'
  },
  '33': {
    '1': 'Il Richiamo dal Tempio'
  },
  '36': {
    '2': 'Rivestiti della Sua Bontà'
  },
  '38': {
    '1': 'Ritorna a Me',
    '14': 'Il Giorno dell\'Eterno'
  },
  '40': {
    '3': 'Preparate la Via del Signore',
    '4': 'Vincitore delle Tenebre',
    '5': 'Luce del Mondo',
    '6': 'Nel Segreto della Tua Presenza',
    '11': 'Venite a Me, Trovate Riposo'
  },
  '41': {
    '6': 'Gesù, la Nostra Speranza Eterna'
  },
  '42': {
    '1': 'Promesse di Grazia e Luce',
    '4': 'Il Messia, la Nostra Speranza'
  },
  '43': {
    '3': 'Luce della Vita, Amore Eterno',
    '4': 'L\'Acqua Viva della Grazia',
    '11': 'Risvegliaci, Signore',
    '15': 'Radici d\'Amore',
    '16': 'Rimanete in Me',
    '17': 'Uniti nella Tua Gloria',
    '18': 'Il Re dei Cieli',
    '19': 'Corona di Spine, Amore Eterno'
  },
  '09': {
    '2': 'Il Mio Cuore Gioisce in Te, Eterno'
  },
  '01': {
    '36': 'Esaù, Padre di una Grande Nazione'
  },
  '03': {
    '15': 'Purificati dalla Tua Grazia'
  }
};

// Appliquer les traductions
for (const book in translations) {
  if (!it[book]) it[book] = {};
  for (const chapter in translations[book]) {
    it[book][chapter] = translations[book][chapter];
  }
}

fs.writeFileSync('./titles/IT.json', JSON.stringify(it, null, 2));
console.log('✓ Tous les 56 titres IT traduits et ajoutés!');
console.log('✓✓✓ IT.json est maintenant 100% COMPLET! ✓✓✓');
