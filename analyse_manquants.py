#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Analyse détaillée des fichiers manquants
"""

import os
from pathlib import Path

BASE_DIR = Path(r"C:\ScriptBible\bible-chantee")
LYRICS_DIR = BASE_DIR / "lyrics"

# Liste des livres complets
BOOKS = [
    {"num": "01", "code": "01_GEN", "name_fr": "Genèse", "chapters": 50},
    {"num": "02", "code": "02_EXO", "name_fr": "Exode", "chapters": 40},
    {"num": "03", "code": "03_LEV", "name_fr": "Lévitique", "chapters": 27},
    {"num": "04", "code": "04_NUM", "name_fr": "Nombres", "chapters": 36},
    {"num": "05", "code": "05_DEU", "name_fr": "Deutéronome", "chapters": 34},
    {"num": "06", "code": "06_JOS", "name_fr": "Josué", "chapters": 24},
    {"num": "07", "code": "07_JDG", "name_fr": "Juges", "chapters": 21},
    {"num": "08", "code": "08_RUT", "name_fr": "Ruth", "chapters": 4},
    {"num": "09", "code": "09_1SAM", "name_fr": "1 Samuel", "chapters": 31},
    {"num": "10", "code": "10_2SAM", "name_fr": "2 Samuel", "chapters": 24},
    {"num": "11", "code": "11_1KI", "name_fr": "1 Rois", "chapters": 22},
    {"num": "12", "code": "12_2KI", "name_fr": "2 Rois", "chapters": 25},
    {"num": "13", "code": "13_1CH", "name_fr": "1 Chroniques", "chapters": 29},
    {"num": "14", "code": "14_2CH", "name_fr": "2 Chroniques", "chapters": 36},
    {"num": "15", "code": "15_EZR", "name_fr": "Esdras", "chapters": 10},
    {"num": "16", "code": "16_NEH", "name_fr": "Néhémie", "chapters": 13},
    {"num": "17", "code": "17_EST", "name_fr": "Esther", "chapters": 10},
    {"num": "18", "code": "18_JOB", "name_fr": "Job", "chapters": 42},
    {"num": "19", "code": "19_PSA", "name_fr": "Psaumes", "chapters": 150},
    {"num": "20", "code": "20_PRO", "name_fr": "Proverbes", "chapters": 31},
    {"num": "21", "code": "21_ECC", "name_fr": "Ecclésiaste", "chapters": 12},
    {"num": "22", "code": "22_SON", "name_fr": "Cantique", "chapters": 8},
    {"num": "23", "code": "23_ISA", "name_fr": "Ésaïe", "chapters": 66},
    {"num": "24", "code": "24_JER", "name_fr": "Jérémie", "chapters": 52},
    {"num": "25", "code": "25_LAM", "name_fr": "Lamentations", "chapters": 5},
    {"num": "26", "code": "26_EZE", "name_fr": "Ézéchiel", "chapters": 48},
    {"num": "27", "code": "27_DAN", "name_fr": "Daniel", "chapters": 12},
    {"num": "28", "code": "28_HOS", "name_fr": "Osée", "chapters": 14},
    {"num": "29", "code": "29_JOE", "name_fr": "Joël", "chapters": 3},
    {"num": "30", "code": "30_AMO", "name_fr": "Amos", "chapters": 9},
    {"num": "31", "code": "31_OBA", "name_fr": "Abdias", "chapters": 1},
    {"num": "32", "code": "32_JON", "name_fr": "Jonas", "chapters": 4},
    {"num": "33", "code": "33_MIC", "name_fr": "Michée", "chapters": 7},
    {"num": "34", "code": "34_NAH", "name_fr": "Nahum", "chapters": 3},
    {"num": "35", "code": "35_HAB", "name_fr": "Habacuc", "chapters": 3},
    {"num": "36", "code": "36_ZEP", "name_fr": "Sophonie", "chapters": 3},
    {"num": "37", "code": "37_HAG", "name_fr": "Aggée", "chapters": 2},
    {"num": "38", "code": "38_ZEC", "name_fr": "Zacharie", "chapters": 14},
    {"num": "39", "code": "39_MAL", "name_fr": "Malachie", "chapters": 4},
    {"num": "40", "code": "40_MAT", "name_fr": "Matthieu", "chapters": 28},
    {"num": "41", "code": "41_MAR", "name_fr": "Marc", "chapters": 16},
    {"num": "42", "code": "42_LUK", "name_fr": "Luc", "chapters": 24},
    {"num": "43", "code": "43_JOH", "name_fr": "Jean", "chapters": 21},
    {"num": "44", "code": "44_ACT", "name_fr": "Actes", "chapters": 28},
    {"num": "45", "code": "45_ROM", "name_fr": "Romains", "chapters": 16},
    {"num": "46", "code": "46_1CO", "name_fr": "1 Corinthiens", "chapters": 16},
    {"num": "47", "code": "47_2CO", "name_fr": "2 Corinthiens", "chapters": 13},
    {"num": "48", "code": "48_GAL", "name_fr": "Galates", "chapters": 6},
    {"num": "49", "code": "49_EPH", "name_fr": "Éphésiens", "chapters": 6},
    {"num": "50", "code": "50_PHP", "name_fr": "Philippiens", "chapters": 4},
    {"num": "51", "code": "51_COL", "name_fr": "Colossiens", "chapters": 4},
    {"num": "52", "code": "52_1TH", "name_fr": "1 Thessaloniciens", "chapters": 5},
    {"num": "53", "code": "53_2TH", "name_fr": "2 Thessaloniciens", "chapters": 3},
    {"num": "54", "code": "54_1TI", "name_fr": "1 Timothée", "chapters": 6},
    {"num": "55", "code": "55_2TI", "name_fr": "2 Timothée", "chapters": 4},
    {"num": "56", "code": "56_TIT", "name_fr": "Tite", "chapters": 3},
    {"num": "57", "code": "57_PHM", "name_fr": "Philémon", "chapters": 1},
    {"num": "58", "code": "58_HEB", "name_fr": "Hébreux", "chapters": 13},
    {"num": "59", "code": "59_JAM", "name_fr": "Jacques", "chapters": 5},
    {"num": "60", "code": "60_1PE", "name_fr": "1 Pierre", "chapters": 5},
    {"num": "61", "code": "61_2PE", "name_fr": "2 Pierre", "chapters": 3},
    {"num": "62", "code": "62_1JN", "name_fr": "1 Jean", "chapters": 5},
    {"num": "63", "code": "63_2JN", "name_fr": "2 Jean", "chapters": 1},
    {"num": "64", "code": "64_3JN", "name_fr": "3 Jean", "chapters": 1},
    {"num": "65", "code": "65_JUD", "name_fr": "Jude", "chapters": 1},
    {"num": "66", "code": "66_REV", "name_fr": "Apocalypse", "chapters": 22}
]

print("ANALYSE DES FICHIERS MANQUANTS - FRANÇAIS")
print("=" * 80)

missing = []
for book in BOOKS:
    book_code = book['code']
    book_name = book['name_fr']

    for chapter in range(1, book['chapters'] + 1):
        chapter_str = str(chapter).zfill(2)
        filename = f"{book_code}_{chapter_str}_FR.txt"
        filepath = LYRICS_DIR / "FR" / filename

        if not filepath.exists():
            missing.append({
                'book': book_name,
                'code': book_code,
                'chapter': chapter,
                'filename': filename
            })

if missing:
    print(f"\nFICHIERS MANQUANTS: {len(missing)}\n")
    for item in missing:
        print(f"  - {item['book']} chapitre {item['chapter']:2d}  ({item['filename']})")
else:
    print("\nAucun fichier manquant!")

print("\n" + "=" * 80)
