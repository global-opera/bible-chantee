#!/usr/bin/env node
/**
 * Applique corrections TL au VRAI fichier: js/chapter-titles.js
 */
const fs = require('fs');

const CORRECTIONS = JSON.parse(fs.readFileSync('./corrections_TL.json', 'utf8'));
const TITLES_FILE = './js/chapter-titles.js';

console.log('Correction js/chapter-titles.js...\n');

let content = fs.readFileSync(TITLES_FILE, 'utf8');
let corrected = 0;

// Pour chaque correction
for (const [book, chapters] of Object.entries(CORRECTIONS)) {
    for (const [chapter, newTitle] of Object.entries(chapters)) {
        // Chercher pattern:  "TL": "ancien titre"
        // Dans contexte du livre et chapitre
        const bookPadded = book.padStart(2, '0');

        // Pattern flexible pour trouver le titre TL pour ce book:chapter
        const regex = new RegExp(
            `(${bookPadded}:${chapter}[^}]*"TL":\\s*")[^"]*"`,
            'g'
        );

        const before = content;
        content = content.replace(regex, `$1${newTitle}"`);

        if (content !== before) {
            console.log(`✓ ${bookPadded}:${chapter.padStart(2, ' ')} → ${newTitle}`);
            corrected++;
        }
    }
}

// Sauvegarder
fs.writeFileSync(TITLES_FILE, content, 'utf8');

console.log(`\n✓ ${corrected} titres TL corrigés dans js/chapter-titles.js`);
