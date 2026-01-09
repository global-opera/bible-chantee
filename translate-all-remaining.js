const fs = require('fs');
const missing = require('./missing-en.json');
const en = require('./titles/EN.json');

// Fonction de traduction FR -> EN
function translateToEN(titleFR) {
  // Dictionnaire de traductions courantes
  const translations = {
    // Mots courants
    "l'Éternel": "the Eternal",
    "Éternel": "Eternal",
    "l'éternel": "the Eternal",
    "éternel": "eternal",
    "Seigneur": "Lord",
    "Dieu": "God",
    "notre": "our",
    "Notre": "Our",
    "mon": "my",
    "Mon": "My",
    "ma": "my",
    "Ma": "My",
    "mes": "my",
    "Mes": "My",
    "dans": "in",
    "Dans": "In",
    "de": "of",
    "De": "From",
    "à": "to",
    "À": "To",
    "pour": "for",
    "Pour": "For",
    "avec": "with",
    "et": "and",
    "la": "the",
    "La": "The",
    "le": "the",
    "Le": "The",
    "les": "the",
    "Les": "The",
    "du": "of the",
    "Du": "Of the",
    "des": "of the",
    "Des": "Of the",
    "au": "to the",
    "Au": "To the",
    "aux": "to the",
    "Aux": "To the",

    // Expressions bibliques
    "Chant": "Song",
    "Louange": "Praise",
    "Gloire": "Glory",
    "Roi": "King",
    "Royaume": "Kingdom",
    "Majesté": "Majesty",
    "Puissance": "Power",
    "Force": "Strength",
    "Refuge": "Refuge",
    "Lumière": "Light",
    "Ténèbres": "Darkness",
    "Cœur": "Heart",
    "Âme": "Soul",
    "Esprit": "Spirit",
    "Victoire": "Victory",
    "Paix": "Peace",
    "Joie": "Joy",
    "Grâce": "Grace",
    "Miséricorde": "Mercy",
    "Justice": "Justice",
    "Sagesse": "Wisdom",
    "Vérité": "Truth",
    "Amour": "Love",
    "Foi": "Faith",
    "Espérance": "Hope",
    "Salut": "Salvation",
    "Délivrance": "Deliverance",
    "Rédemption": "Redemption",
    "Alliance": "Covenant",
    "Promesse": "Promise",
    "Bénédiction": "Blessing",
    "Temple": "Temple",
    "Maison": "House",
    "Cieux": "Heaven",
    "Terre": "Earth",
    "Peuple": "People",
    "Nation": "Nation",
    "Jérusalem": "Jerusalem",
    "Sion": "Zion"
  };

  // Liste de traductions directes pour des titres complets
  const directTranslations = {
    "Sagesse et Paix sous le Règne de Salomon": "Wisdom and Peace Under Solomon's Reign",
    "Dans la Maison de l'Éternel": "In the House of the Eternal",
    "La Sagesse du Roi Salomon": "The Wisdom of King Solomon",
    "Un Cœur Fidèle à Toi": "A Heart Faithful to You",
    "Guide nos cœurs vers l'unité": "Guide Our Hearts to Unity",
    "Écoute la Voix de Dieu": "Hear the Voice of God",
    // ... (on pourrait en ajouter plus)
  };

  // Si traduction directe existe
  if (directTranslations[titleFR]) {
    return directTranslations[titleFR];
  }

  // Sinon, retourner le titre FR tel quel (sera traduit manuellement après)
  return titleFR;
}

// Compter les titres déjà traduits
let alreadyTranslated = 0;
let toTranslate = 0;

for (const m of missing) {
  if (en[m.book] && en[m.book][m.chapter]) {
    alreadyTranslated++;
  } else {
    toTranslate++;
  }
}

console.log(`Titres déjà traduits: ${alreadyTranslated}`);
console.log(`Titres restants à traduire: ${toTranslate}`);
console.log(`\nAffichage des 50 prochains titres à traduire:\n`);

// Afficher les 50 prochains
let count = 0;
for (const m of missing) {
  if (!en[m.book] || !en[m.book][m.chapter]) {
    console.log(`${count + 1}. Livre ${m.book}, Ch ${m.chapter}: "${m.titleFR}"`);
    count++;
    if (count >= 50) break;
  }
}
