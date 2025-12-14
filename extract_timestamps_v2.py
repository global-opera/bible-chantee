#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extrait les timestamps bruts depuis les fichiers HTML autoscroll
"""
import os
import re
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HTML_DIR = Path(r"C:\ScriptBible\bible-chantee")
OUTPUT_FILE = Path(r"C:\ScriptBible\bible-chantee\lyrics-timestamps.js")

def extract_sections_raw(html_path):
    """Extrait le contenu brut du tableau sections"""
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Chercher le tableau JavaScript "sections" et extraire le contenu brut
        match = re.search(r'const sections = (\[.*?\]);', content, re.DOTALL)
        if match:
            return match.group(1)
        return None
    except Exception as e:
        return None

def main():
    print("="*80)
    print("EXTRACTION TIMESTAMPS BRUTS DEPUIS FICHIERS HTML")
    print("="*80)
    print()

    # Dictionnaire pour stocker tous les timestamps
    timestamps_by_book = {}

    # Parcourir tous les fichiers HTML autoscroll
    html_files = sorted(HTML_DIR.glob("*_autoscroll.html"))
    print(f"Fichiers trouves: {len(html_files)}")

    count_success = 0
    for html_file in html_files:
        # Extraire le code du livre et le numéro de chapitre
        match = re.match(r'(\d{2})_([A-Z0-9]+)_(\d{2})_autoscroll\.html', html_file.name)
        if not match:
            continue

        book_num = match.group(1)
        chapter_num = match.group(3)

        # Extraire les sections brutes
        sections_raw = extract_sections_raw(html_file)
        if sections_raw:
            # Initialiser le livre
            if book_num not in timestamps_by_book:
                timestamps_by_book[book_num] = {}

            # Stocker le JSON brut
            timestamps_by_book[book_num][chapter_num] = sections_raw
            count_success += 1
            if count_success % 50 == 0:
                print(f"  {count_success} fichiers traites...")

    print(f"\n[OK] {count_success} chapitres extraits")

    # Générer le fichier JavaScript
    print("\nGeneration du fichier lyrics-timestamps.js...")

    js_content = "// Timestamps de synchronisation des paroles - Bible Chantee\n"
    js_content += "const lyricsTimestamps = {\n"

    for book_num in sorted(timestamps_by_book.keys()):
        js_content += f'  "{book_num}": {{\n'
        for chapter_num in sorted(timestamps_by_book[book_num].keys()):
            sections_raw = timestamps_by_book[book_num][chapter_num]
            js_content += f'    "{chapter_num}": {sections_raw},\n'
        js_content += '  },\n'

    js_content += '};\n'

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"[OK] Fichier cree: {OUTPUT_FILE}")
    print(f"  Taille: {OUTPUT_FILE.stat().st_size / 1024 / 1024:.1f} MB")

    print("\n" + "="*80)
    print("TERMINE!")
    print("="*80)

if __name__ == "__main__":
    main()
