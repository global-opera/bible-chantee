#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère le fichier bible-data.js pour le site web GitHub Pages
"""
import json
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Chemins
BIBLE_JSON = Path(r"G:\Mon Drive\01 BibleChantee\fr_bible_segond1910.json")
OUTPUT_FILE = Path(r"C:\ScriptBible\bible-chantee\bible-data.js")

def load_bible():
    """Charge la Bible Segond 1910"""
    with open(BIBLE_JSON, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_bible_data_js():
    """Génère le fichier JavaScript avec les données bibliques"""
    print("Chargement de la Bible Segond 1910...")
    bible = load_bible()

    # Organiser les versets par livre et chapitre
    bible_data = {}

    for verse in bible['verses']:
        book_num = str(verse['book']).zfill(2)  # Format: "01", "02", etc.
        chapter = verse['chapter']
        verse_num = verse['verse']
        verse_text = verse['text']

        # Initialiser le livre s'il n'existe pas
        if book_num not in bible_data:
            bible_data[book_num] = {}

        # Initialiser le chapitre s'il n'existe pas
        if chapter not in bible_data[book_num]:
            bible_data[book_num][chapter] = []

        # Ajouter le verset
        bible_data[book_num][chapter].append({
            'num': verse_num,
            'text': verse_text
        })

    print(f"  -> {len(bible_data)} livres trouvés")
    total_chapters = sum(len(chapters) for chapters in bible_data.values())
    print(f"  -> {total_chapters} chapitres au total")

    # Générer le fichier JavaScript
    print("\nGénération du fichier bible-data.js...")

    js_content = "// Données bibliques - Bible Segond 1910\n"
    js_content += "// Généré automatiquement - Ne pas modifier manuellement\n\n"
    js_content += "const bibleData = " + json.dumps(bible_data, ensure_ascii=False, indent=2) + ";\n"

    # Écrire le fichier
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"  -> Sauvegardé: {OUTPUT_FILE}")
    print(f"  -> Taille: {OUTPUT_FILE.stat().st_size / 1024:.1f} KB")

    print("\n" + "="*80)
    print("TERMINÉ!")
    print("="*80)

if __name__ == "__main__":
    generate_bible_data_js()
