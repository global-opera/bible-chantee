#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Audit complet des lyrics FR - Vérifie tous les livres et chapitres
"""
import re

LYRICS_FILE = r"C:\ScriptBible\bible-chantee\lyrics-data-fr.js"

# Nombre de chapitres attendus par livre (de books.js)
EXPECTED_CHAPTERS = {
    "01": 50, "02": 40, "03": 27, "04": 36, "05": 34, "06": 24, "07": 21, "08": 4,
    "09": 31, "10": 24, "11": 22, "12": 25, "13": 29, "14": 36, "15": 10, "16": 13,
    "17": 10, "18": 42, "19": 150, "20": 31, "21": 12, "22": 8, "23": 66, "24": 52,
    "25": 5, "26": 48, "27": 12, "28": 14, "29": 3, "30": 9, "31": 1, "32": 4,
    "33": 7, "34": 3, "35": 3, "36": 3, "37": 2, "38": 14, "39": 4, "40": 28,
    "41": 16, "42": 24, "43": 21, "44": 28, "45": 16, "46": 16, "47": 13, "48": 6,
    "49": 6, "50": 4, "51": 4, "52": 5, "53": 3, "54": 6, "55": 4, "56": 3,
    "57": 1, "58": 13, "59": 5, "60": 5, "61": 3, "62": 5, "63": 1, "64": 1,
    "65": 1, "66": 22
}

BOOK_NAMES = {
    "01": "Genese", "02": "Exode", "03": "Levitique", "04": "Nombres", "05": "Deuteronome",
    "06": "Josue", "07": "Juges", "08": "Ruth", "09": "1 Samuel", "10": "2 Samuel",
    "11": "1 Rois", "12": "2 Rois", "13": "1 Chroniques", "14": "2 Chroniques",
    "15": "Esdras", "16": "Nehemie", "17": "Esther", "18": "Job", "19": "Psaumes",
    "20": "Proverbes", "21": "Ecclesiaste", "22": "Cantique", "23": "Esaie",
    "24": "Jeremie", "25": "Lamentations", "26": "Ezechiel", "27": "Daniel",
    "28": "Osee", "29": "Joel", "30": "Amos", "31": "Abdias", "32": "Jonas",
    "33": "Michee", "34": "Nahum", "35": "Habacuc", "36": "Sophonie", "37": "Aggee",
    "38": "Zacharie", "39": "Malachie", "40": "Matthieu", "41": "Marc", "42": "Luc",
    "43": "Jean", "44": "Actes", "45": "Romains", "46": "1 Corinthiens",
    "47": "2 Corinthiens", "48": "Galates", "49": "Ephesiens", "50": "Philippiens",
    "51": "Colossiens", "52": "1 Thessaloniciens", "53": "2 Thessaloniciens",
    "54": "1 Timothee", "55": "2 Timothee", "56": "Tite", "57": "Philemon",
    "58": "Hebreux", "59": "Jacques", "60": "1 Pierre", "61": "2 Pierre",
    "62": "1 Jean", "63": "2 Jean", "64": "3 Jean", "65": "Jude", "66": "Apocalypse"
}

def extract_lyrics_structure():
    """Parse lyrics-data-fr.js et extrait la structure"""
    with open(LYRICS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extraire la structure des livres
    books = {}
    current_book = None
    
    lines = content.split('\n')
    for i, line in enumerate(lines):
        # Détecter un livre
        book_match = re.match(r'\s*"(\d{2})":\s*\{', line)
        if book_match:
            current_book = book_match.group(1)
            books[current_book] = []
            continue
        
        # Détecter un chapitre
        if current_book:
            chapter_match = re.match(r'\s*(\d+):\s*`', line)
            if chapter_match:
                chapter = int(chapter_match.group(1))
                books[current_book].append(chapter)
    
    return books

def check_corrupted_lyrics():
    """Vérifie les lyrics corrompues (contenu suspect)"""
    with open(LYRICS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    corrupted = []
    
    # Pattern pour trouver les livres/chapitres
    pattern = r'"(\d{2})":\s*\{\s*(\d+):\s*`([^`]{0,100})'
    
    for match in re.finditer(pattern, content, re.DOTALL):
        book_num = match.group(1)
        chapter = match.group(2)
        lyrics_start = match.group(3).strip()
        
        # Détection contenu corrompu
        if lyrics_start.startswith('...') or len(lyrics_start) < 30:
            corrupted.append((book_num, chapter, lyrics_start[:50]))
    
    return corrupted

def main():
    print("=" * 80)
    print("AUDIT COMPLET LYRICS FR - TOUS LIVRES ET CHAPITRES")
    print("=" * 80)
    print()
    
    # 1. Extraire structure
    print("[1/4] Extraction structure lyrics-data-fr.js...")
    found_books = extract_lyrics_structure()
    print(f"      Trouve: {len(found_books)} livres")
    
    # 2. Vérifier livres manquants
    print("\n[2/4] Verification livres manquants...")
    missing_books = []
    for book_num in EXPECTED_CHAPTERS.keys():
        if book_num not in found_books:
            missing_books.append(book_num)
            print(f"      X Livre {book_num} ({BOOK_NAMES[book_num]}) MANQUANT")
    
    if not missing_books:
        print("      OK - Tous les 66 livres presents")
    
    # 3. Vérifier chapitres manquants
    print("\n[3/4] Verification chapitres manquants...")
    missing_chapters = []
    extra_chapters = []
    total_expected = sum(EXPECTED_CHAPTERS.values())
    total_found = 0
    
    for book_num, expected_count in EXPECTED_CHAPTERS.items():
        if book_num not in found_books:
            missing_chapters.append((book_num, "ALL", expected_count))
            continue
        
        found_chapters = found_books[book_num]
        total_found += len(found_chapters)
        expected_chapters = set(range(1, expected_count + 1))
        found_set = set(found_chapters)
        
        missing = expected_chapters - found_set
        extra = found_set - expected_chapters
        
        if missing:
            for ch in sorted(missing):
                missing_chapters.append((book_num, ch, 0))
                print(f"      X {BOOK_NAMES[book_num]} {book_num}:{ch} MANQUANT")
        
        if extra:
            for ch in sorted(extra):
                extra_chapters.append((book_num, ch))
                print(f"      ! {BOOK_NAMES[book_num]} {book_num}:{ch} EN TROP")
    
    if not missing_chapters and not extra_chapters:
        print(f"      OK - Tous les chapitres presents ({total_found}/{total_expected})")
    else:
        print(f"      Chapitres trouves: {total_found}/{total_expected}")
    
    # 4. Vérifier lyrics corrompues
    print("\n[4/4] Verification lyrics corrompues...")
    corrupted = check_corrupted_lyrics()
    
    if corrupted:
        for book_num, chapter, preview in corrupted:
            print(f"      ! {BOOK_NAMES[book_num]} {book_num}:{chapter} - Suspect: {preview}...")
    else:
        print("      OK - Aucune lyrics corrompue detectee")
    
    # 5. Résumé
    print("\n" + "=" * 80)
    print("RESUME")
    print("=" * 80)
    print(f"Livres: {len(found_books)}/66")
    print(f"Chapitres: {total_found}/{total_expected}")
    print(f"Livres manquants: {len(missing_books)}")
    print(f"Chapitres manquants: {len(missing_chapters)}")
    print(f"Chapitres en trop: {len(extra_chapters)}")
    print(f"Lyrics corrompues: {len(corrupted)}")
    
    if missing_books or missing_chapters or corrupted:
        print("\nX AUDIT ECHOUE - Corrections necessaires")
        return 1
    else:
        print("\nOK AUDIT REUSSI - Tous les lyrics sont presents et valides")
        return 0

if __name__ == "__main__":
    exit(main())
