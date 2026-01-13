#!/usr/bin/env python3
"""
Génère lyrics-data.js depuis les transcriptions Whisper FR
Format compatible avec le site biblechantee.com
"""
import os
import re
from pathlib import Path
from datetime import datetime

WHISPER_DIR = Path(r"G:\Mon Drive\01 BibleChantee\Lyrics_Whisper_FR_FINAL")
OUTPUT_FILE = Path(r"C:\ScriptBible\bible-chantee\lyrics-data.js")

def extract_content(file_path):
    """Extrait le contenu complet d'un fichier Whisper"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return content.strip()

def main():
    print("="*60)
    print("GÉNÉRATION lyrics-data.js DEPUIS WHISPER FR")
    print("="*60)
    
    lyrics_data = {}
    total = 0
    
    # Parcourir tous les dossiers de livres
    for book_dir in sorted(WHISPER_DIR.iterdir()):
        if not book_dir.is_dir():
            continue
        
        book_code = book_dir.name  # ex: 01_GEN
        book_num = book_code.split('_')[0]  # ex: 01
        lyrics_data[book_num] = {}
        
        # Parcourir tous les fichiers du livre
        for txt_file in sorted(book_dir.glob("*.txt")):
            # Extraire le numéro de chapitre du nom de fichier
            match = re.search(r'_(\d+)_FR\.txt$', txt_file.name)
            if match:
                chapter = int(match.group(1))  # Nombre entier
                content = extract_content(txt_file)
                lyrics_data[book_num][chapter] = content
                total += 1
    
    print(f"Total: {total} chapitres")
    
    # Générer le fichier JS
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("// Paroles des chapitres - Bible Chantee\n")
        f.write("// Source: Whisper FR transcriptions\n")
        f.write(f"// Auto-genere: {datetime.now().strftime('%Y-%m-%d')}\n")
        f.write("window.chapterLyrics = {\n")
        
        for book_num in sorted(lyrics_data.keys()):
            chapters = lyrics_data[book_num]
            if not chapters:
                continue
            f.write(f'    "{book_num}": {{\n')
            for ch in sorted(chapters.keys()):
                content = chapters[ch]
                # Échapper les backticks et backslashes
                content = content.replace('\\', '\\\\')
                content = content.replace('`', '\\`')
                content = content.replace('${', '\\${')
                f.write(f'        {ch}: `{content}`,\n')
            f.write('    },\n')
        
        f.write("};\n")
    
    print(f"Fichier généré: {OUTPUT_FILE}")
    print("="*60)

if __name__ == "__main__":
    main()
