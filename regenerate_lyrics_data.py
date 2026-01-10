#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Régénération des fichiers lyrics-data*.js depuis les fichiers JSON
"""

import json
import sys
import os
from pathlib import Path

# Force UTF-8 pour stdout
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE_DIR = Path(r"C:\ScriptBible\bible-chantee")
LYRICS_DIR = BASE_DIR / "lyrics"

# Configuration des langues
LANGUAGES = {
    'FR': {'json': 'FR.json', 'output': 'lyrics-data.js', 'var': 'chapterLyrics'},
    'EN': {'json': 'EN.json', 'output': 'lyrics-data-en.js', 'var': 'chapterLyricsEN'},
    'PT': {'json': 'PT.json', 'output': 'lyrics-data-pt.js', 'var': 'chapterLyricsPT'},
    'ES': {'json': 'ES.json', 'output': 'lyrics-data-es.js', 'var': 'chapterLyricsES'},
    'DE': {'json': 'DE.json', 'output': 'lyrics-data-de.js', 'var': 'chapterLyricsDE'},
    'IT': {'json': 'IT.json', 'output': 'lyrics-data-it.js', 'var': 'chapterLyricsIT'},
    'TL': {'json': 'TL.json', 'output': 'lyrics-data-tl.js', 'var': 'chapterLyricsTL'}
}

def escape_js_string(text):
    """Échappe les caractères spéciaux pour JavaScript"""
    if not text:
        return ""

    # Remplacer les backslashes d'abord
    text = text.replace('\\', '\\\\')
    # Remplacer les backticks
    text = text.replace('`', '\\`')
    # Remplacer ${} pour éviter l'interpolation
    text = text.replace('${', '\\${')

    return text

def generate_lyrics_data_file(lang_code, config):
    """Génère un fichier lyrics-data*.js depuis un JSON"""
    json_file = LYRICS_DIR / config['json']
    output_file = BASE_DIR / config['output']
    var_name = config['var']

    print(f"\nTraitement de {lang_code}...")
    print(f"  Lecture de: {json_file}")

    if not json_file.exists():
        print(f"  ERREUR: Fichier {json_file} introuvable")
        return False

    try:
        # Charger le JSON
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        print(f"  Livres trouves: {len(data)} livres")

        # Compter les chapitres
        total_chapters = sum(len(chapters) for chapters in data.values())
        print(f"  Chapitres totaux: {total_chapters}")

        # Générer le contenu JavaScript
        js_lines = []
        js_lines.append("// Paroles des chapitres - Bible Chantee")
        js_lines.append(f"// Source: {config['json']}")
        js_lines.append(f"// Auto-genere: 2026-01-10")
        js_lines.append(f"window.{var_name} = {{")

        # Trier les livres par numéro
        sorted_books = sorted(data.keys(), key=lambda x: int(x))

        for book_num in sorted_books:
            chapters = data[book_num]

            # Trier les chapitres par numéro
            sorted_chapters = sorted(chapters.keys(), key=lambda x: int(x))

            js_lines.append(f'    "{book_num}": {{')

            for i, chapter_num in enumerate(sorted_chapters):
                chapter_text = chapters[chapter_num]

                # Échapper le texte pour JavaScript
                escaped_text = escape_js_string(chapter_text)

                # Utiliser template literals (backticks)
                comma = "," if i < len(sorted_chapters) - 1 else ""
                js_lines.append(f'        {chapter_num}: `{escaped_text}`{comma}')

            # Virgule après le livre sauf si c'est le dernier
            comma = "," if book_num != sorted_books[-1] else ""
            js_lines.append(f'    }}{comma}')

        js_lines.append("};")

        # Écrire le fichier
        output_content = '\n'.join(js_lines)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(output_content)

        print(f"  Fichier genere: {output_file}")
        print(f"  Taille: {len(output_content) / 1024:.1f} KB")

        # Vérifier Genèse 1 pour FR
        if lang_code == 'FR' and '01' in data and '1' in data['01']:
            gen1_preview = data['01']['1'][:100].replace('\r', ' ').replace('\n', ' ')
            print(f"\n  Genese 1 FR (preview): {gen1_preview}...")

        return True

    except Exception as e:
        print(f"  ERREUR lors du traitement: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Fonction principale"""
    print("=" * 80)
    print("REGENERATION DES FICHIERS LYRICS-DATA*.JS")
    print("=" * 80)

    success_count = 0
    error_count = 0

    for lang_code, config in LANGUAGES.items():
        if generate_lyrics_data_file(lang_code, config):
            success_count += 1
        else:
            error_count += 1

    print("\n" + "=" * 80)
    print(f"TERMINE: {success_count} fichiers generes avec succes, {error_count} erreurs")
    print("=" * 80)

if __name__ == "__main__":
    main()
