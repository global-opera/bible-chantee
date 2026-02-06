#!/usr/bin/env python3
"""
Régénère lyrics-data-fr.js depuis les fichiers .lyrics.txt de la version FR
"""

import os
import re
from datetime import datetime
from pathlib import Path

# Chemins
SUNO_FR_DIR = r"G:\Mon Drive\01 BibleChantee\Suno_Output\FR"
SITE_DIR = r"C:\ScriptBible\bible-chantee"
OUTPUT_FILE = os.path.join(SITE_DIR, "lyrics-data-fr.js")

def extract_book_chapter_from_filename(filename):
    """
    Extrait le numéro de livre et chapitre depuis le nom de fichier
    Ex: 31_OBA_001.lyrics.txt -> (31, 1)
    """
    match = re.match(r'(\d+)_[A-Z]+_(\d+).*\.lyrics\.txt$', filename)
    if match:
        book_num = str(int(match.group(1)))  # Enlever les zéros leading
        chapter_num = str(int(match.group(2)))  # Enlever les zéros leading
        return book_num, chapter_num
    return None, None

def escape_for_js_template(text):
    """Échappe le texte pour utilisation dans un template literal JS"""
    # Échapper les backslashes d'abord
    text = text.replace('\\', '\\\\')
    # Échapper les backticks
    text = text.replace('`', '\\`')
    # Échapper ${
    text = text.replace('${', '\\${')
    return text

def collect_all_lyrics():
    """
    Parcourt tous les dossiers FR et collecte les paroles
    Retourne: dict {book_num: {chapter_num: lyrics_text}}
    """
    lyrics_data = {}

    if not os.path.exists(SUNO_FR_DIR):
        print(f"ERREUR: Dossier FR introuvable: {SUNO_FR_DIR}")
        return lyrics_data

    # Parcourir tous les sous-dossiers (livres)
    for book_dir in sorted(os.listdir(SUNO_FR_DIR)):
        book_path = os.path.join(SUNO_FR_DIR, book_dir)

        if not os.path.isdir(book_path):
            continue

        # Chercher les fichiers .lyrics.txt
        for filename in os.listdir(book_path):
            if not filename.endswith('.lyrics.txt'):
                continue

            book_num, chapter_num = extract_book_chapter_from_filename(filename)

            if not book_num or not chapter_num:
                print(f"[WARN] Format invalide: {book_dir}/{filename}")
                continue

            filepath = os.path.join(book_path, filename)

            try:
                with open(filepath, 'r', encoding='utf-8-sig') as f:  # utf-8-sig pour gérer BOM
                    lyrics = f.read().strip()

                if not lyrics:
                    print(f"[WARN] Fichier vide: {book_dir}/{filename}")
                    continue

                # Initialiser le livre si nécessaire
                if book_num not in lyrics_data:
                    lyrics_data[book_num] = {}

                # Ajouter les paroles
                lyrics_data[book_num][chapter_num] = lyrics
                print(f"[OK] Livre {book_num}, Ch {chapter_num} ({len(lyrics)} car)")

            except Exception as e:
                print(f"[ERR] {book_dir}/{filename}: {e}")

    return lyrics_data

def generate_js_file(lyrics_data):
    """Génère le contenu du fichier lyrics-data-fr.js"""

    lines = []
    lines.append("// Lyrics FR - Français")
    lines.append(f"// Source: Suno_Output/FR/*.lyrics.txt")
    lines.append(f"// Auto-generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("window.chapterLyricsFR = {")
    lines.append("")

    # Trier les livres par numéro
    sorted_books = sorted(lyrics_data.keys(), key=int)

    for i, book_num in enumerate(sorted_books):
        chapters = lyrics_data[book_num]

        # Ajouter le livre
        lines.append(f'    "{book_num}": {{')

        # Trier les chapitres par numéro
        sorted_chapters = sorted(chapters.keys(), key=int)

        for j, chapter_num in enumerate(sorted_chapters):
            lyrics = chapters[chapter_num]
            escaped_lyrics = escape_for_js_template(lyrics)

            # Format: 1: `lyrics`,
            comma = "," if j < len(sorted_chapters) - 1 else ""
            lines.append(f'        {chapter_num}: `{escaped_lyrics}`{comma}')

        # Fermer le livre
        closing = "," if i < len(sorted_books) - 1 else ""
        lines.append(f'    }}{closing}')

        if i < len(sorted_books) - 1:
            lines.append("")

    lines.append("};")
    lines.append("")

    return '\n'.join(lines)

def main():
    print("="*60)
    print("REGENERATION DE lyrics-data-fr.js")
    print("="*60)
    print("")

    # Collecter toutes les paroles
    print("1. Collection des paroles depuis FR/*.lyrics.txt...")
    print("-" * 60)
    lyrics_data = collect_all_lyrics()

    if not lyrics_data:
        print("\nERREUR: Aucune parole collectée!")
        return

    total_books = len(lyrics_data)
    total_chapters = sum(len(chapters) for chapters in lyrics_data.values())

    print("")
    print(f"Collecté: {total_books} livres, {total_chapters} chapitres")
    print("")

    # Générer le fichier JS
    print("2. Generation du fichier JS...")
    js_content = generate_js_file(lyrics_data)

    # Backup de l'ancien fichier
    if os.path.exists(OUTPUT_FILE):
        backup_file = f"{OUTPUT_FILE}.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        print(f"   Backup: {backup_file}")
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            old_content = f.read()
        with open(backup_file, 'w', encoding='utf-8') as f:
            f.write(old_content)

    # Écrire le nouveau fichier
    print(f"   Écriture: {OUTPUT_FILE}")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print("")
    print("="*60)
    print("TERMINÉ")
    print("="*60)
    print(f"Fichier généré: {OUTPUT_FILE}")
    print(f"Taille: {len(js_content):,} caractères")
    print(f"Livres: {total_books}")
    print(f"Chapitres: {total_chapters}")
    print("="*60)

if __name__ == "__main__":
    main()
