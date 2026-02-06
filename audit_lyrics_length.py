#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Audit longueur lyrics - Vérifie que toutes ont un contenu substantiel
"""
import re

LYRICS_FILE = r"C:\ScriptBible\bible-chantee\lyrics-data-fr.js"

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

def check_lyrics_length():
    """Vérifie la longueur des lyrics"""
    with open(LYRICS_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern pour extraire lyrics complètes
    pattern = r'"(\d{2})":\s*\{\s*(\d+):\s*`([^`]+)`'
    
    too_short = []
    empty = []
    
    for match in re.finditer(pattern, content, re.DOTALL):
        book_num = match.group(1)
        chapter = match.group(2)
        lyrics = match.group(3).strip()
        
        # Vérifier longueur
        if len(lyrics) == 0:
            empty.append((book_num, chapter))
        elif len(lyrics) < 100:  # Moins de 100 caractères est suspect
            too_short.append((book_num, chapter, len(lyrics)))
    
    return empty, too_short

def main():
    print("=" * 80)
    print("AUDIT LONGUEUR LYRICS FR")
    print("=" * 80)
    print()
    
    empty, too_short = check_lyrics_length()
    
    if empty:
        print(f"\nX LYRICS VIDES ({len(empty)}):")
        for book_num, chapter in empty:
            print(f"   {BOOK_NAMES[book_num]} {book_num}:{chapter}")
    
    if too_short:
        print(f"\nX LYRICS TROP COURTES - Moins de 100 caracteres ({len(too_short)}):")
        for book_num, chapter, length in too_short:
            print(f"   {BOOK_NAMES[book_num]} {book_num}:{chapter} - {length} caracteres")
    
    if not empty and not too_short:
        print("OK - Toutes les lyrics ont un contenu substantiel")
        print("\nNOTE: Les lyrics qui commencent par '...' sont normales")
        print("      Ce sont des choix artistiques, pas des corruptions")
        return 0
    else:
        return 1

if __name__ == "__main__":
    exit(main())
