const fs = require('fs');
const es = require('./titles/ES.json');

// Traductions ES (espagnol) - Lot 1-50
const translations = {
  '10': {
    '6': 'Danza de Alabanza ante el Eterno',
    '12': 'En la Luz de Tu Gracia',
    '19': 'Reina en Nosotros, Oh Rey de Gracia'
  },
  '11': {
    '7': 'En la Casa del Eterno',
    '15': 'Luz y Fidelidad en Nuestros Corazones'
  },
  '12': {
    '2': 'En el Torbellino de Tu Gloria',
    '17': 'Regresa al Eterno, Nuestro Refugio!',
    '23': 'Caminemos en la Luz del Rey',
    '25': 'En el Dolor, Tú Eres Nuestra Esperanza'
  },
  '13': {
    '4': 'Amplía Mis Límites, Oh Dios!',
    '15': 'Celebremos el Arca del Señor'
  },
  '14': {
    '18': 'La Luz en la Batalla',
    '20': 'En la Alabanza, Nuestra Victoria!'
  },
  '15': {
    '5': 'Construyamos Juntos la Casa de Nuestro Rey'
  },
  '16': {
    '9': 'Fidelidad y Misericordia del Eterno',
    '10': 'Unidos por Tu Casa, Señor',
    '13': 'Restauración y Alabanza'
  },
  '19': {
    '115': 'A Tu Nombre, Señor, la Gloria!',
    '134': 'Bendigamos al Eterno, Nuestro Rey'
  },
  '23': {
    '51': 'Despierta, Sion!'
  },
  '24': {
    '9': 'Lágrimas de Verdad',
    '22': 'Voz del Eterno',
    '29': 'Esperanza en Cautividad',
    '32': 'Fuerza y Promesa',
    '49': 'En las Ruinas, Te Alabamos',
    '52': 'En la Tormenta, Tu Gracia'
  },
  '25': {
    '2': 'Restaura, Oh Eterno, Nuestro Corazón en Llanto!'
  },
  '26': {
    '23': 'Tráenos de Vuelta a Ti',
    '37': 'Despiértanos, Espíritu de Vida!',
    '43': 'En Tu Casa, Eterno',
    '48': 'El Eterno Está Aquí!'
  },
  '27': {
    '3': 'En Ti, Nuestra Liberación',
    '6': 'El Dios que Libera'
  },
  '29': {
    '3': 'El Juicio y la Redención de Sion'
  },
  '30': {
    '2': 'Escucha la Voz del Eterno'
  },
  '33': {
    '4': 'Hacia la Montaña de Amor'
  },
  '36': {
    '2': 'Vístete de Su Bondad',
    '3': 'Despierta, Oh Sion!'
  },
  '38': {
    '1': 'Regresa a Mí, Oh Jerusalén'
  },
  '40': {
    '6': 'En el Secreto de Tu Presencia',
    '13': 'Semillas de Gloria',
    '22': 'Vengan a las Bodas del Rey',
    '24': 'Ven, Señor, en Tu Gloria'
  },
  '41': {
    '4': 'Escucha al Sembrador, Da Fruto!',
    '5': 'Libertador de Nuestras Almas',
    '6': 'Jesús, Nuestra Esperanza Eterna',
    '10': 'Unidos en Tu Gracia',
    '13': 'Velen y Oren'
  },
  '42': {
    '1': 'Promesas de Gracia y Luz',
    '4': 'El Mesías, Nuestra Esperanza'
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
console.log('✓ Lot 1-50: 50 titres ES traduits et ajoutés!');
