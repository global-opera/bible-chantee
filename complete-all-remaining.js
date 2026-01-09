const fs = require('fs');

// Charger FR comme référence
const fr = require('./titles/FR.json');

// Fonction pour vérifier et compléter une langue
function completeLanguage(lang, translations) {
  const data = require(`./titles/${lang}.json`);
  let added = 0;

  for (const book in translations) {
    if (!data[book]) data[book] = {};
    for (const chapter in translations[book]) {
      if (!data[book][chapter]) {
        data[book][chapter] = translations[book][chapter];
        added++;
      }
    }
  }

  fs.writeFileSync(`./titles/${lang}.json`, JSON.stringify(data, null, 2));
  return added;
}

console.log('Vérification et complétion de toutes les langues...\n');

// Compter les manquants pour chaque langue
const langs = ['EN', 'ES', 'PT', 'DE', 'IT', 'TL'];
langs.forEach(lang => {
  const data = require(`./titles/${lang}.json`);
  let missing = 0;
  for (const book in fr) {
    for (const chapter in fr[book]) {
      if (!data[book] || !data[book][chapter]) {
        missing++;
      }
    }
  }
  console.log(`${lang}: ${missing} titres manquants`);
});

console.log('\n✓ Vérification terminée. Exécutez les scripts de traduction individuels pour compléter.');
