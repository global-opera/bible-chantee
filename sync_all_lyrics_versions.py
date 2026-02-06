#!/usr/bin/env python3
"""
Synchronise lyrics-data-fr.js avec les bonnes versions de paroles (FR, FR_V1 ou FR_V2)
en se basant sur les URLs dans audio-urls-fr.js
"""

import os
import re
import json
from pathlib import Path

# Chemins
SITE_DIR = r"C:\ScriptBible\bible-chantee"
LYRICS_BASE = r"G:\Mon Drive\01 BibleChantee\Lyrics"
AUDIO_URLS_FILE = os.path.join(SITE_DIR, "audio-urls-fr.js")
LYRICS_DATA_FILE = os.path.join(SITE_DIR, "lyrics-data-fr.js")

def extract_version_from_url(url):
    """
    Extrait la version (FR, FR_V1, FR_V2) depuis l'URL
    Ex: https://.../FR/31_OBA/... -> FR
        https://.../FR_V1/31_OBA/... -> FR_V1
    """
    match = re.search(r'/(FR(?:_V[12])?)/(\d+_[A-Z]+)/', url)
    if match:
        return match.group(1), match.group(2)  # version, book_code
    return None, None

def read_audio_urls():
    """
    Lit audio-urls-fr.js et retourne un dict {book_num: {chapter_num: (url, version, book_code)}}
    """
    with open(AUDIO_URLS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    result = {}
    # Pattern pour matcher les blocs de livres
    # "31": { "1": "https://..." }
    book_pattern = r'"(\d+)":\s*\{([^}]+)\}'

    for book_match in re.finditer(book_pattern, content):
        book_num = book_match.group(1)
        chapters_block = book_match.group(2)

        # Pattern pour les chapitres
        chapter_pattern = r'"(\d+)":\s*"([^"]+)"'

        result[book_num] = {}
        for chap_match in re.finditer(chapter_pattern, chapters_block):
            chapter_num = chap_match.group(1)
            url = chap_match.group(2)
            version, book_code = extract_version_from_url(url)
            result[book_num][chapter_num] = (url, version, book_code)

    return result

def find_lyrics_file(version, book_code, chapter_num):
    """
    Trouve le fichier de paroles pour un livre/chapitre donné
    Retourne le contenu des paroles ou None
    """
    # Construire le chemin selon la version
    lyrics_dir = os.path.join(LYRICS_BASE, version, book_code)

    # Convertir chapter_num en int pour formatage
    chap_int = int(chapter_num)

    # Essayer différents formats de nom de fichier
    possible_names = [
        f"{book_code}_{chap_int:03d}_FR.txt",  # Format 001, 002, etc.
        f"{book_code}_{chap_int:02d}_FR.txt",  # Format 01, 02, etc.
        f"{book_code}_0{chapter_num}_FR.txt" if len(chapter_num) == 1 else f"{book_code}_{chapter_num}_FR.txt",
    ]

    for filename in possible_names:
        filepath = os.path.join(lyrics_dir, filename)
        if os.path.exists(filepath):
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                # Extraire seulement la section [LYRICS]
                lyrics_match = re.search(r'\[LYRICS\]\s*(.*)', content, re.DOTALL)
                if lyrics_match:
                    return lyrics_match.group(1).strip()
                return content.strip()
            except Exception as e:
                print(f"Erreur lecture {filepath}: {e}")

    return None

def read_current_lyrics_data():
    """
    Lit le fichier lyrics-data-fr.js actuel
    """
    with open(LYRICS_DATA_FILE, 'r', encoding='utf-8') as f:
        return f.read()

def update_lyrics_in_js(js_content, book_num, chapter_num, new_lyrics):
    """
    Met à jour les paroles pour un livre/chapitre spécifique dans le contenu JS
    """
    # Échapper les backticks et backslashes dans les paroles
    escaped_lyrics = new_lyrics.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

    # Pattern pour trouver et remplacer les paroles
    # "31": { 1: `...` }
    pattern = rf'("{book_num}":\s*\{{\s*){chapter_num}:\s*`[^`]*`'

    def replace_func(match):
        return f'{match.group(1)}{chapter_num}: `{escaped_lyrics}`'

    new_content = re.sub(pattern, replace_func, js_content, flags=re.DOTALL)

    # Si pas de match, le chapitre n'existe peut-être pas, essayer d'ajouter
    if new_content == js_content:
        print(f"  [WARN]  Pattern non trouvé pour livre {book_num}, chapitre {chapter_num}")

    return new_content

def main():
    print("Synchronisation des paroles FR avec les versions correctes...\n")

    # Lire les URLs audio
    print("Lecture de audio-urls-fr.js...")
    audio_urls = read_audio_urls()
    print(f"   Trouve {len(audio_urls)} livres\n")

    # Lire le fichier lyrics actuel
    print("Lecture de lyrics-data-fr.js...")
    js_content = read_current_lyrics_data()

    # Statistiques
    stats = {
        'total': 0,
        'updated': 0,
        'not_found': 0,
        'errors': 0,
        'by_version': {'FR': 0, 'FR_V1': 0, 'FR_V2': 0}
    }

    # Pour chaque livre/chapitre
    for book_num in sorted(audio_urls.keys(), key=int):
        for chapter_num in sorted(audio_urls[book_num].keys(), key=int):
            stats['total'] += 1
            url, version, book_code = audio_urls[book_num][chapter_num]

            if not version or not book_code:
                print(f"[WARN] Livre {book_num}, Ch {chapter_num}: URL invalide")
                stats['errors'] += 1
                continue

            print(f"Livre {book_num} ({book_code}), Ch {chapter_num} - Version: {version}")

            # Trouver les paroles
            lyrics = find_lyrics_file(version, book_code, chapter_num)

            if lyrics:
                # Mettre à jour le JS
                new_js_content = update_lyrics_in_js(js_content, book_num, chapter_num, lyrics)
                if new_js_content != js_content:
                    js_content = new_js_content
                    stats['updated'] += 1
                    stats['by_version'][version] += 1
                    print(f"   [OK] Mis a jour ({len(lyrics)} caracteres)")
                else:
                    print(f"   [WARN] Pas de changement detecte")
            else:
                print(f"   [ERR] Paroles introuvables dans {version}/{book_code}/")
                stats['not_found'] += 1

    # Sauvegarder le fichier mis à jour
    print(f"\nSauvegarde de lyrics-data-fr.js...")

    # Backup de l'ancien fichier
    backup_file = LYRICS_DATA_FILE + ".backup_before_sync"
    with open(backup_file, 'w', encoding='utf-8') as f:
        with open(LYRICS_DATA_FILE, 'r', encoding='utf-8') as orig:
            f.write(orig.read())
    print(f"   Backup: {backup_file}")

    # Écrire le nouveau fichier
    with open(LYRICS_DATA_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

    # Afficher les stats
    print("\n" + "="*60)
    print("STATISTIQUES")
    print("="*60)
    print(f"Total chapitres traites: {stats['total']}")
    print(f"Mis a jour: {stats['updated']}")
    print(f"Introuvables: {stats['not_found']}")
    print(f"Erreurs: {stats['errors']}")
    print("\nPar version:")
    print(f"  FR:    {stats['by_version']['FR']}")
    print(f"  FR_V1: {stats['by_version']['FR_V1']}")
    print(f"  FR_V2: {stats['by_version']['FR_V2']}")
    print("="*60)

if __name__ == "__main__":
    main()
