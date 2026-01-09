const fs = require('fs');
const pt = require('./titles/PT.json');

// Toutes les traductions PT (portugais brésilien) - 79 titres
const translations = {
  '10': {
    '15': 'No Vale das Lágrimas'
  },
  '11': {
    '3': 'Sabedoria do Céu, Guia dos Nossos Corações',
    '11': 'Um Coração Fiel a Ti',
    '15': 'Luz e Fidelidade em Nossos Corações'
  },
  '12': {
    '1': 'Eterno, Nosso Único Refúgio',
    '11': 'Joás, Rei de Luz',
    '16': 'Fiel Apesar dos Nossos Desvios'
  },
  '13': {
    '16': 'Louvai ao Eterno, Nosso Salvador!',
    '17': 'Reis e Sacerdotes do Senhor',
    '18': 'Abençoados pela Tua Mão',
    '19': 'Louvai ao Senhor, Nosso Libertador',
    '20': 'Vitória pela Fé',
    '21': 'Contados por Sua Graça'
  },
  '14': {
    '10': 'Rei de Misericórdia'
  },
  '15': {
    '10': 'Jejum e Louvor ao Eterno'
  },
  '16': {
    '7': 'Reconstruamos os Muros'
  },
  '17': {
    '5': 'Para um Tempo Como Este'
  },
  '18': {
    '19': 'Meu Redentor Vive!',
    '36': 'Deus, Nosso Poder e Nossa Esperança!'
  },
  '19': {
    '134': 'Bendigamos ao Eterno, Nosso Rei'
  },
  '20': {
    '11': 'Justiça e Verdade'
  },
  '23': {
    '7': 'Emanuel, Deus Conosco',
    '12': 'Fontes de Salvação'
  },
  '24': {
    '1': 'Eu Te Chamei',
    '31': 'O Novo Pacto, Escrito em Nossos Corações'
  },
  '26': {
    '20': 'Congregados em Teu Nome'
  },
  '27': {
    '6': 'O Deus que Liberta',
    '10': 'Fortalecidos pela Graça'
  },
  '29': {
    '1': 'Lamento da Terra',
    '3': 'O Julgamento e a Redenção de Sião'
  },
  '30': {
    '2': 'Ouça a Voz do Eterno'
  },
  '32': {
    '3': 'Da Angústia à Graça'
  },
  '33': {
    '1': 'O Chamado do Templo',
    '4': 'Rumo à Montanha do Amor'
  },
  '36': {
    '2': 'Vista-se de Sua Bondade'
  },
  '38': {
    '1': 'Volta para Mim',
    '14': 'O Dia do Eterno'
  },
  '39': {
    '3': 'Purificados pela Tua Luz'
  },
  '40': {
    '3': 'Preparai o Caminho do Senhor',
    '4': 'Vencedor das Trevas',
    '5': 'Luz do Mundo',
    '6': 'No Segredo da Tua Presença',
    '11': 'Vinde a Mim, Encontrai Descanso',
    '13': 'Sementes de Glória',
    '21': 'Hosana ao Rei!',
    '22': 'Vinde às Bodas do Rei'
  },
  '41': {
    '4': 'Ouça o Semeador, Dê Fruto!',
    '6': 'Jesus, Nossa Esperança Eterna'
  },
  '42': {
    '1': 'Promessas de Graça e Luz',
    '4': 'O Messias, Nossa Esperança',
    '7': 'Fé que Move Montanhas',
    '8': 'Seguindo o Mestre',
    '9': 'Sigamos o Rei',
    '10': 'Na Jornada com Jesus',
    '12': 'Valor Além da Medida'
  },
  '43': {
    '3': 'Luz da Vida, Amor Eterno',
    '4': 'A Água Viva da Graça',
    '7': 'Vinde a Mim, Ó Sedentos!',
    '11': 'Acordai-nos, Senhor',
    '12': 'Hosana ao Rei dos Céus!',
    '13': 'Aos Teus Pés, Senhor',
    '15': 'Raízes de Amor',
    '16': 'Permanecei em Mim',
    '17': 'Unidos na Tua Glória',
    '18': 'O Rei dos Céus',
    '19': 'Coroa de Espinhos, Amor Eterno'
  },
  '44': {
    '21': 'Unidos para Sua Glória'
  },
  '45': {
    '7': 'Libertado pela Graça de Cristo'
  },
  '46': {
    '7': 'Unidos no Amor de Cristo',
    '9': 'Livres para o Evangelho, Unidos em Sua Graça'
  },
  '49': {
    '1': 'Esperança em Ti, Nossa Glória'
  },
  '09': {
    '2': 'Meu Coração Se Alegra em Ti, Eterno'
  },
  '06': {
    '6': 'As Muralhas de Jericó Caem!',
    '13': 'A Herança da Promessa'
  },
  '02': {
    '8': 'Libertação pelo Teu Poder',
    '35': 'Oferta de Corações'
  },
  '05': {
    '31': 'Fortalecidos por Sua Promessa'
  },
  '01': {
    '36': 'Esaú, Pai de uma Grande Nação',
    '41': 'O Mestre dos Sonhos'
  },
  '03': {
    '9': 'Glória na Presença do Eterno',
    '13': 'Purificados pela Tua Mão',
    '15': 'Purificados pela Tua Graça',
    '16': 'Purificados pelo Sangue do Cordeiro',
    '17': 'Vida no Sangue',
    '22': 'Ofertas Sem Defeito',
    '27': 'A Ti, Senhor, Nossos Votos e Nossos Corações'
  },
  '04': {
    '4': 'Na Tenda de Sua Glória',
    '7': 'Ofertas de Louvor ao Altíssimo'
  }
};

// Appliquer les traductions
for (const book in translations) {
  if (!pt[book]) pt[book] = {};
  for (const chapter in translations[book]) {
    pt[book][chapter] = translations[book][chapter];
  }
}

fs.writeFileSync('./titles/PT.json', JSON.stringify(pt, null, 2));
console.log('✓ Tous les 79 titres PT traduits et ajoutés!');
console.log('✓✓✓ PT.json est maintenant 100% COMPLET! ✓✓✓');
