const fs = require('fs');
const path = require('path');

// Lire tous les fichiers de titres
const languages = ['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'TL'];
const allTitles = {};

console.log('Régénération de js/chapter-titles.js...');
console.log('');

languages.forEach(lang => {
  const filePath = path.join(__dirname, 'titles', `${lang}.json`);
  console.log(`Lecture de ${lang}.json...`);

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  allTitles[lang] = data;

  // Compter les titres
  let count = 0;
  for (const book of Object.values(data)) {
    count += Object.keys(book).length;
  }
  console.log(`  ${lang}: ${count} titres`);
});

console.log('');
console.log('Génération du fichier JavaScript...');

// Générer le contenu du fichier
const jsContent = `// Titres - Bible Chantee V3
window.CHAPTER_TITLES = ${JSON.stringify(allTitles, null, 2)};
`;

// Écrire le fichier
const outputPath = path.join(__dirname, 'js', 'chapter-titles.js');
fs.writeFileSync(outputPath, jsContent, 'utf8');

console.log('');
console.log('✅ Fichier généré : js/chapter-titles.js');
console.log('');

// Vérifier la syntaxe avec Node
console.log('Vérification de la syntaxe...');
try {
  require(outputPath);
  console.log('✅ Syntaxe JavaScript valide');
} catch (e) {
  console.log('❌ Erreur de syntaxe :');
  console.log(e.message);
  process.exit(1);
}

console.log('');
console.log('═══════════════════════════════════════');
console.log('✅ RÉGÉNÉRATION TERMINÉE AVEC SUCCÈS');
console.log('═══════════════════════════════════════');
