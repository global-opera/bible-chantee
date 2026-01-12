#!/usr/bin/env python3
"""
Script de génération du fichier lyrics-data.js depuis lyrics/FR.json
Auteur: Claude Code
Date: 2026-01-12
"""

import json
from pathlib import Path
from datetime import datetime

def generate_lyrics_data_js(input_json, output_js):
    """Génère le fichier lyrics-data.js depuis FR.json"""

    print("="*60)
    print("GÉNÉRATION DE lyrics-data.js DEPUIS FR.json")
    print("="*60)
    print(f"Source: {input_json}")
    print(f"Destination: {output_js}")
    print("="*60 + "\n")

    # Charger le JSON
    print("Chargement du fichier FR.json...")
    with open(input_json, 'r', encoding='utf-8') as f:
        lyrics_data = json.load(f)

    print(f"  -> {len(lyrics_data)} livres chargés")
    total_chapters = sum(len(chapters) for chapters in lyrics_data.values())
    print(f"  -> {total_chapters} chapitres au total\n")

    # Générer le contenu JavaScript
    print("Génération du contenu JavaScript...")

    js_lines = []
    js_lines.append("// Paroles des chapitres - Bible Chantee")
    js_lines.append("// Source: FR.json")
    js_lines.append(f"// Auto-genere: {datetime.now().strftime('%Y-%m-%d')}")
    js_lines.append("window.chapterLyrics = {")

    # Parcourir les livres
    book_nums = sorted(lyrics_data.keys(), key=lambda x: int(x))

    for i, book_num in enumerate(book_nums):
        chapters = lyrics_data[book_num]
        js_lines.append(f'    "{book_num}": {{')

        # Parcourir les chapitres
        chapter_nums = sorted(chapters.keys(), key=lambda x: int(x))

        for j, chapter_num in enumerate(chapter_nums):
            lyrics_text = chapters[chapter_num]

            # Échapper les caractères spéciaux pour JavaScript
            # Utiliser des template literals (backticks)
            escaped_text = lyrics_text.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

            comma = "," if j < len(chapter_nums) - 1 else ""
            js_lines.append(f'        {chapter_num}: `{escaped_text}`{comma}')

        comma = "," if i < len(book_nums) - 1 else ""
        js_lines.append(f'    }}{comma}')

    js_lines.append("};")

    # Écrire le fichier
    print("Écriture du fichier JavaScript...")
    js_content = '\n'.join(js_lines)

    with open(output_js, 'w', encoding='utf-8') as f:
        f.write(js_content)

    file_size = Path(output_js).stat().st_size / (1024 * 1024)
    print(f"  -> Fichier généré: {output_js}")
    print(f"  -> Taille: {file_size:.2f} MB\n")

    print("="*60)
    print("SUCCESS!")
    print("="*60)
    return True

def main():
    """Fonction principale"""
    input_json = Path(r"C:\ScriptBible\bible-chantee\lyrics\FR.json")
    output_js = Path(r"C:\ScriptBible\bible-chantee\lyrics-data.js")

    # Vérifier que le fichier source existe
    if not input_json.exists():
        print(f"[ERREUR] Le fichier source n'existe pas: {input_json}")
        return 1

    # Backup du fichier existant
    if output_js.exists():
        backup_file = Path(str(output_js) + ".backup")
        print(f"[BACKUP] Sauvegarde de {output_js} -> {backup_file}")
        import shutil
        shutil.copy2(output_js, backup_file)
        print("[OK] Backup créé\n")

    # Générer le fichier
    success = generate_lyrics_data_js(input_json, output_js)

    if success:
        print("\n[SUCCESS] lyrics-data.js généré avec succès!")
        print("\nProchaines étapes:")
        print("1. git add lyrics-data.js")
        print("2. git commit -m 'fix: Régénérer lyrics-data.js depuis FR.json (Whisper)'")
        print("3. git push origin prod")
        return 0
    else:
        print("\n[ERREUR] Échec de la génération")
        return 1

if __name__ == "__main__":
    exit(main())
