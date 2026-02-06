#!/usr/bin/env python3
"""
Synchronise lyrics-data-fr.js avec les paroles FR_V1
Car les MP3 uploadés sur R2 dans /FR/ sont en réalité de version FR_V1
"""

import os
import re
from pathlib import Path

# Chemins
SITE_DIR = r"C:\ScriptBible\bible-chantee"
LYRICS_FR_V1 = r"G:\Mon Drive\01 BibleChantee\Lyrics\FR_V1"
AUDIO_URLS_FILE = os.path.join(SITE_DIR, "audio-urls-fr.js")
LYRICS_DATA_FILE = os.path.join(SITE_DIR, "lyrics-data-fr.js")

def read_audio_urls():
    """Lit audio-urls-fr.js et retourne les livres/chapitres"""
    with open(AUDIO_URLS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    result = {}
    book_pattern = r'"(\d+)":\s*\{([^}]+)\}'

    for book_match in re.finditer(book_pattern, content):
        book_num = book_match.group(1)
        chapters_block = book_match.group(2)

        chapter_pattern = r'"(\d+)":\s*"([^"]+)"'
        result[book_num] = {}

        for chap_match in re.finditer(chapter_pattern, chapters_block):
            chapter_num = chap_match.group(1)
            url = chap_match.group(2)
            # Extraire le code du livre de l'URL
            book_code_match = re.search(r'/(\d+_[A-Z]+)/', url)
            if book_code_match:
                result[book_num][chapter_num] = book_code_match.group(1)

    return result

def find_fr_v1_lyrics(book_code, chapter_num):
    """Trouve les paroles FR_V1 pour un livre/chapitre"""
    lyrics_dir = os.path.join(LYRICS_FR_V1, book_code)

    if not os.path.exists(lyrics_dir):
        return None

    chap_int = int(chapter_num)
    possible_names = [
        f"{book_code}_{chap_int:02d}_FR.txt",
        f"{book_code}_0{chapter_num}_FR.txt" if len(chapter_num) == 1 else f"{book_code}_{chapter_num}_FR.txt",
    ]

    for filename in possible_names:
        filepath = os.path.join(lyrics_dir, filename)
        if os.path.exists(filepath):
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                # Extraire section [LYRICS]
                lyrics_match = re.search(r'\[LYRICS\]\s*(.*)', content, re.DOTALL)
                if lyrics_match:
                    return lyrics_match.group(1).strip()
                return content.strip()
            except Exception as e:
                print(f"Erreur lecture {filepath}: {e}")
                return None

    return None

def update_lyrics_in_js(js_content, book_num, chapter_num, new_lyrics):
    """Met à jour les paroles dans le contenu JS"""
    escaped_lyrics = new_lyrics.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

    # Pattern pour trouver et remplacer
    pattern = rf'("{book_num}":\s*\{{\s*)({chapter_num}):\s*`[^`]*`'

    def replace_func(match):
        return f'{match.group(1)}{match.group(2)}: `{escaped_lyrics}`'

    new_content, count = re.subn(pattern, replace_func, js_content, flags=re.DOTALL)

    if count == 0:
        print(f"  [WARN] Pattern non trouve pour livre {book_num}, ch {chapter_num}")

    return new_content, count > 0

def main():
    print("Synchronisation avec FR_V1...\n")

    # Lire les URLs
    print("Lecture audio-urls-fr.js...")
    audio_urls = read_audio_urls()
    print(f"  {len(audio_urls)} livres trouves\n")

    # Lire lyrics-data-fr.js
    print("Lecture lyrics-data-fr.js...")
    with open(LYRICS_DATA_FILE, 'r', encoding='utf-8') as f:
        js_content = f.read()

    stats = {
        'total': 0,
        'updated': 0,
        'not_found': 0,
        'failed': 0
    }

    # Pour chaque livre/chapitre
    for book_num in sorted(audio_urls.keys(), key=int):
        for chapter_num in sorted(audio_urls[book_num].keys(), key=int):
            stats['total'] += 1
            book_code = audio_urls[book_num][chapter_num]

            print(f"Livre {book_num} ({book_code}), Ch {chapter_num}... ", end='')

            # Chercher paroles FR_V1
            lyrics = find_fr_v1_lyrics(book_code, chapter_num)

            if lyrics:
                new_js_content, success = update_lyrics_in_js(js_content, book_num, chapter_num, lyrics)
                if success:
                    js_content = new_js_content
                    stats['updated'] += 1
                    print(f"[OK] ({len(lyrics)} car)")
                else:
                    stats['failed'] += 1
                    print("[FAIL]")
            else:
                stats['not_found'] += 1
                print("[NOT FOUND]")

    # Sauvegarder
    print(f"\nSauvegarde lyrics-data-fr.js...")

    backup_file = LYRICS_DATA_FILE + ".backup_fr_v1_sync"
    with open(backup_file, 'w', encoding='utf-8') as f:
        with open(LYRICS_DATA_FILE, 'r', encoding='utf-8') as orig:
            f.write(orig.read())
    print(f"  Backup: {backup_file}")

    with open(LYRICS_DATA_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print("  Fichier mis a jour!")

    # Stats
    print("\n" + "="*60)
    print("STATISTIQUES")
    print("="*60)
    print(f"Total:       {stats['total']}")
    print(f"Mis a jour:  {stats['updated']}")
    print(f"Introuvables: {stats['not_found']}")
    print(f"Echecs:      {stats['failed']}")
    print("="*60)

if __name__ == "__main__":
    main()
