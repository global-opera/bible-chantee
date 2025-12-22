#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère le fichier bible-data-es.js pour le site web
Bible: Reina Valera 1909 - Public Domain
"""
import json
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Chemins
BIBLE_JSON = Path(r"G:\Mon Drive\01 BibleChantee\es_bible_reina_valera_1909.json")
OUTPUT_FILE = Path(r"C:\ScriptBible\bible-chantee\bible-data-es.js")

def load_bible():
    """Charge la Bible Reina Valera 1909"""
    with open(BIBLE_JSON, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_bible_data_js():
    """Génère le fichier JavaScript avec les données bibliques ES"""
    print("Chargement de la Bible Reina Valera 1909...")
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

    print(f"  -> {len(bible_data)} libros encontrados")
    total_chapters = sum(len(chapters) for chapters in bible_data.values())
    print(f"  -> {total_chapters} capitulos en total")

    # Générer le fichier JavaScript
    print("\nGeneracion del archivo bible-data-es.js...")

    js_content = "// Datos Biblicos - Reina Valera 1909\n"
    js_content += "// Dominio Publico\n"
    js_content += "// Generado automaticamente - No modificar manualmente\n\n"
    js_content += "const bibleDataES = " + json.dumps(bible_data, ensure_ascii=False, indent=2) + ";\n"

    # Écrire le fichier
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"  -> Guardado: {OUTPUT_FILE}")
    print(f"  -> Tamano: {OUTPUT_FILE.stat().st_size / 1024 / 1024:.1f} MB")

    print("\n" + "="*80)
    print("TERMINADO!")
    print("="*80)

if __name__ == "__main__":
    generate_bible_data_js()
