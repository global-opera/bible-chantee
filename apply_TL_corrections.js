#!/usr/bin/env node
/**
 * Applique les corrections TL au fichier chapter-titles-DEFINITIF.js
 */
const fs = require('fs');
const path = require('path');

const CORRECTIONS_FILE = './corrections_TL.json';
const TITLES_FILE = './chapter-titles-DEFINITIF.js';

console.log('='.repeat(80));
console.log('APPLICATION CORRECTIONS TL');
console.log('='.repeat(80));
console.log();

// Lire corrections
const corrections = JSON.parse(fs.readFileSync(CORRECTIONS_FILE, 'utf8'));

// Lire fichier titres
let content = fs.readFileSync(TITLES_FILE, 'utf8');

let corrected = 0;

// Appliquer chaque correction
for (const [book, chapters] of Object.entries(corrections)) {
    for (const [chapter, newTitle] of Object.entries(chapters)) {
        // Pattern pour trouver la ligne avec ce livre:chapitre
        const pattern = new RegExp(
            `(// ${book}:${chapter}[^\\n]*\\n\\s*{[^}]*"TL":\\s*")[^"]*"`,
            'g'
        );

        const before = content;
        content = content.replace(pattern, `$1${newTitle}"`);

        if (content !== before) {
            console.log(`  ✓ ${book.padStart(2, '0')}:${chapter.padStart(2, ' ')} → ${newTitle}`);
            corrected++;
        }
    }}

// Sauvegarder
fs.writeFileSync(TITLES_FILE, content, 'utf8');

console.log();
console.log('='.repeat(80));
console.log(`✓ ${corrected} TITRES TL CORRIGÉS`);
console.log('='.repeat(80));
console.log();
console.log(`Fichier: ${TITLES_FILE}`);
console.log();
