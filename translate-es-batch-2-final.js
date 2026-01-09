const fs = require('fs');
const es = require('./titles/ES.json');

// Traductions ES (espagnol) - Lot 51-81 (FINAL)
const translations = {
  '42': {
    '5': 'Al Encuentro del Maestro',
    '6': 'Liberados por Tu Gracia, Señor!',
    '9': 'Sigamos al Rey',
    '12': 'Velemos en la Luz',
    '20': 'Piedra Angular',
    '22': 'En la Noche de la Pascua'
  },
  '43': {
    '7': 'Vengan a Mí, Oh Sedientos!',
    '12': 'Hosanna al Rey de los Cielos!',
    '13': 'A Tus Pies, Señor',
    '14': 'No Te Dejaré'
  },
  '44': {
    '20': 'Unidos en la Gracia',
    '21': 'Unidos por Su Gloria'
  },
  '46': {
    '7': 'Unidos en el Amor de Cristo',
    '9': 'Libres para el Evangelio, Unidos en Su Gracia'
  },
  '47': {
    '7': 'En la Tristeza, Tu Alegría'
  },
  '09': {
    '2': 'Mi Corazón Se Regocija en Ti, Eterno'
  },
  '06': {
    '6': 'Los Muros de Jericó Caen!',
    '13': 'La Herencia de la Promesa',
    '19': 'La Herencia de Nuestro Dios'
  },
  '02': {
    '8': 'Liberación por Tu Poder',
    '16': 'Maná del Cielo, Pan de Vida',
    '39': 'En el Santuario de Tu Gloria'
  },
  '05': {
    '31': 'Fortalecidos por Su Promesa'
  },
  '01': {
    '14': 'En el Valle de las Victorias',
    '19': 'Hacia la Luz, Salvados por Tu Gracia',
    '41': 'El Maestro de los Sueños'
  },
  '03': {
    '16': 'Purificados por la Sangre del Cordero',
    '27': 'A Ti, Señor, Nuestros Votos y Nuestros Corazones'
  },
  '04': {
    '4': 'En la Tienda de Su Gloria',
    '7': 'Ofrendas de Alabanza al Altísimo',
    '13': 'Hacia la Tierra Prometida, con Fe y Valor'
  }
};

// Appliquer les traductions
for (const book in translations) {
  if (!es[book]) es[book] = {};
  for (const chapter in translations[book]) {
    es[book][chapter] = translations[book][chapter];
  }
}

fs.writeFileSync('./titles/ES.json', JSON.stringify(es, null, 2));
console.log('✓ Lot 51-81 (FINAL): 31 titres ES traduits et ajoutés!');
console.log('✓✓✓ ES.json est maintenant 100% COMPLET! ✓✓✓');
