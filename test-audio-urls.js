// Script de test pour vérifier audio-urls.js
const fs = require('fs');

// Charger audio-urls.js
const content = fs.readFileSync('./audio-urls.js', 'utf8');

// Créer window pour Node.js
global.window = {};
eval(content); // Exécuter pour obtenir window.audioUrls

console.log('=== TEST AUDIO-URLs.JS ===\n');

// Vérifier que window.audioUrls existe
if (typeof window === 'undefined' || !window.audioUrls) {
    console.error('ERREUR: window.audioUrls non défini');
    process.exit(1);
}

const audioUrls = window.audioUrls;

// Compter les livres
const books = Object.keys(audioUrls);
console.log(`Nombre de livres: ${books.length} / 66`);

// Vérifier chaque livre
const expectedBooks = [
    { num: "01", name: "Genèse", chapters: 50 },
    { num: "02", name: "Exode", chapters: 40 },
    { num: "03", name: "Lévitique", chapters: 27 },
    { num: "04", name: "Nombres", chapters: 36 },
    { num: "05", name: "Deutéronome", chapters: 34 },
    { num: "06", name: "Josué", chapters: 24 },
    { num: "07", name: "Juges", chapters: 21 },
    { num: "08", name: "Ruth", chapters: 4 },
    { num: "09", name: "1 Samuel", chapters: 31 },
    { num: "10", name: "2 Samuel", chapters: 24 },
    { num: "11", name: "1 Rois", chapters: 22 },
    { num: "12", name: "2 Rois", chapters: 25 },
    { num: "13", name: "1 Chroniques", chapters: 29 },
    { num: "14", name: "2 Chroniques", chapters: 36 },
    { num: "15", name: "Esdras", chapters: 10 },
    { num: "16", name: "Néhémie", chapters: 13 },
    { num: "17", name: "Esther", chapters: 10 },
    { num: "18", name: "Job", chapters: 42 },
    { num: "19", name: "Psaumes", chapters: 150 },
    { num: "20", name: "Proverbes", chapters: 31 },
    { num: "21", name: "Ecclésiaste", chapters: 12 },
    { num: "22", name: "Cantique", chapters: 8 },
    { num: "23", name: "Ésaïe", chapters: 66 },
    { num: "24", name: "Jérémie", chapters: 52 },
    { num: "25", name: "Lamentations", chapters: 5 },
    { num: "26", name: "Ézéchiel", chapters: 48 },
    { num: "27", name: "Daniel", chapters: 12 },
    { num: "28", name: "Osée", chapters: 14 },
    { num: "29", name: "Joël", chapters: 3 },
    { num: "30", name: "Amos", chapters: 9 },
    { num: "31", name: "Abdias", chapters: 1 },
    { num: "32", name: "Jonas", chapters: 4 },
    { num: "33", name: "Michée", chapters: 7 },
    { num: "34", name: "Nahum", chapters: 3 },
    { num: "35", name: "Habacuc", chapters: 3 },
    { num: "36", name: "Sophonie", chapters: 3 },
    { num: "37", name: "Aggée", chapters: 2 },
    { num: "38", name: "Zacharie", chapters: 14 },
    { num: "39", name: "Malachie", chapters: 4 },
    { num: "40", name: "Matthieu", chapters: 28 },
    { num: "41", name: "Marc", chapters: 16 },
    { num: "42", name: "Luc", chapters: 24 },
    { num: "43", name: "Jean", chapters: 21 },
    { num: "44", name: "Actes", chapters: 28 },
    { num: "45", name: "Romains", chapters: 16 },
    { num: "46", name: "1 Corinthiens", chapters: 16 },
    { num: "47", name: "2 Corinthiens", chapters: 13 },
    { num: "48", name: "Galates", chapters: 6 },
    { num: "49", name: "Éphésiens", chapters: 6 },
    { num: "50", name: "Philippiens", chapters: 4 },
    { num: "51", name: "Colossiens", chapters: 4 },
    { num: "52", name: "1 Thessaloniciens", chapters: 5 },
    { num: "53", name: "2 Thessaloniciens", chapters: 3 },
    { num: "54", name: "1 Timothée", chapters: 6 },
    { num: "55", name: "2 Timothée", chapters: 4 },
    { num: "56", name: "Tite", chapters: 3 },
    { num: "57", name: "Philémon", chapters: 1 },
    { num: "58", name: "Hébreux", chapters: 13 },
    { num: "59", name: "Jacques", chapters: 5 },
    { num: "60", name: "1 Pierre", chapters: 5 },
    { num: "61", name: "2 Pierre", chapters: 3 },
    { num: "62", name: "1 Jean", chapters: 5 },
    { num: "63", name: "2 Jean", chapters: 1 },
    { num: "64", name: "3 Jean", chapters: 1 },
    { num: "65", name: "Jude", chapters: 1 },
    { num: "66", name: "Apocalypse", chapters: 22 }
];

let totalErrors = 0;
let totalBooks = 0;
let totalChapters = 0;

console.log('\nVérification des livres:\n');

expectedBooks.forEach(expected => {
    const bookData = audioUrls[expected.num];

    if (!bookData) {
        console.log(`❌ ${expected.num} ${expected.name}: MANQUANT`);
        totalErrors++;
        return;
    }

    totalBooks++;
    const chapters = Object.keys(bookData);
    const hasAllChapters = chapters.length === expected.chapters;

    // Vérifier que les chapitres sont des strings
    const allStrings = chapters.every(ch => typeof ch === 'string');

    if (hasAllChapters && allStrings) {
        console.log(`✓ ${expected.num} ${expected.name}: ${chapters.length}/${expected.chapters} chapitres (format OK)`);
        totalChapters += chapters.length;
    } else {
        console.log(`⚠ ${expected.num} ${expected.name}: ${chapters.length}/${expected.chapters} chapitres (${!allStrings ? 'FORMAT INCORRECT' : 'INCOMPLET'})`);
        totalErrors++;
    }
});

console.log(`\n=== RÉSUMÉ ===`);
console.log(`Livres présents: ${totalBooks}/66`);
console.log(`Chapitres totaux: ${totalChapters}`);
console.log(`Erreurs: ${totalErrors}`);

if (totalErrors === 0 && totalBooks === 66) {
    console.log('\n✅ TOUS LES TESTS PASSENT - AUDIO DEVRAIT FONCTIONNER');
    process.exit(0);
} else {
    console.log('\n❌ DES ERREURS ONT ÉTÉ DÉTECTÉES');
    process.exit(1);
}
