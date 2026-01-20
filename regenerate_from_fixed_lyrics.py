#!/usr/bin/env python3
"""
Script de régénération complète depuis les paroles CORRIGÉES
Pipeline: Lyrics_Whisper_FR_FIXED_FR -> FR.json -> lyrics-data.js
Auteur: Claude Code
Date: 2026-01-14
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import shutil

# === CHEMINS ===
FIXED_LYRICS_DIR = Path(r"G:\Mon Drive\01 BibleChantee\Lyrics_FR_FINAL_SINGABLE")
OUTPUT_FR_JSON = Path(r"C:\ScriptBible\bible-chantee\lyrics\FR.json")
OUTPUT_LYRICS_JS = Path(r"C:\ScriptBible\bible-chantee\lyrics-data.js")

def parse_whisper_filename(filename):
    """
    Parse le nom de fichier Whisper pour extraire le livre et le chapitre
    Exemple: 19_PSA_23_FR.txt -> (19, 23)
    """
    match = re.match(r'(\d+)_([A-Z0-9]+)_(\d+)_FR\.txt', filename)
    if match:
        book_num = match.group(1)
        chapter_num = int(match.group(3))
        return (book_num, chapter_num)
    return None

def read_lyrics_file(filepath):
    """Lit un fichier de paroles et retourne son contenu complet"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except Exception as e:
        print(f"[ERREUR] Impossible de lire {filepath}: {e}")
        return None

def generate_fr_json_from_fixed(fixed_dir, output_json):
    """Génère FR.json depuis les paroles CORRIGÉES"""

    print("="*70)
    print("ÉTAPE 1/2: GÉNÉRATION FR.json DEPUIS PAROLES CORRIGÉES")
    print("="*70)
    print(f"Source: {fixed_dir}")
    print(f"Destination: {output_json}")
    print("="*70 + "\n")

    # Vérifier que la source existe
    if not fixed_dir.exists():
        print(f"[ERREUR] Le dossier source n'existe pas: {fixed_dir}")
        return False

    # Structure: {book_num: {chapter_num: content}}
    lyrics_data = defaultdict(dict)
    processed = 0
    errors = 0

    # Parcourir tous les dossiers de livres
    for book_dir in sorted(fixed_dir.iterdir()):
        if not book_dir.is_dir():
            continue

        print(f"[LIVRE] Traitement de {book_dir.name}...")

        # Parcourir tous les fichiers .txt du livre
        for txt_file in sorted(book_dir.glob("*.txt")):
            try:
                # Parser le nom de fichier
                parsed = parse_whisper_filename(txt_file.name)
                if not parsed:
                    print(f"  [SKIP] Nom de fichier non reconnu: {txt_file.name}")
                    continue

                book_num, chapter_num = parsed

                # Lire le contenu
                content = read_lyrics_file(txt_file)
                if content is None:
                    errors += 1
                    continue

                # Ajouter au dictionnaire
                lyrics_data[book_num][str(chapter_num)] = content.strip()

                processed += 1
                if processed % 50 == 0:
                    print(f"  [PROGRESS] {processed} chapitres traités...")

            except Exception as e:
                print(f"  [ERREUR] {txt_file.name}: {e}")
                errors += 1

    # Convertir defaultdict en dict normal pour JSON
    final_data = {book: dict(chapters) for book, chapters in sorted(lyrics_data.items())}

    # Backup de l'ancien fichier
    if output_json.exists():
        backup_file = output_json.parent / f"FR.json.backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        print(f"\n[BACKUP] Sauvegarde: {output_json} -> {backup_file.name}")
        shutil.copy2(output_json, backup_file)

    # Écrire le fichier JSON
    print("\n[ÉCRITURE] Génération du fichier FR.json...")
    try:
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)

        file_size = output_json.stat().st_size / (1024 * 1024)
        print(f"[OK] Fichier généré: {output_json}")
        print(f"[OK] Taille: {file_size:.2f} MB")
    except Exception as e:
        print(f"[ERREUR] Impossible d'écrire le fichier: {e}")
        return False

    # Résumé
    print("\n" + "="*70)
    print("RÉSUMÉ ÉTAPE 1")
    print("="*70)
    print(f"Chapitres traités: {processed}")
    print(f"Erreurs: {errors}")
    print(f"Livres dans le JSON: {len(final_data)}")
    print("="*70 + "\n")

    return True

def generate_lyrics_data_js_from_json(input_json, output_js):
    """Génère lyrics-data.js depuis FR.json"""

    print("="*70)
    print("ÉTAPE 2/2: GÉNÉRATION lyrics-data.js DEPUIS FR.json")
    print("="*70)
    print(f"Source: {input_json}")
    print(f"Destination: {output_js}")
    print("="*70 + "\n")

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
    js_lines.append("// Source: Whisper FR transcriptions CORRIGÉES")
    js_lines.append(f"// Auto-genere: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
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

    # Backup de l'ancien fichier
    if output_js.exists():
        backup_file = Path(str(output_js) + f".backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
        print(f"[BACKUP] Sauvegarde: {output_js} -> {backup_file.name}")
        shutil.copy2(output_js, backup_file)

    # Écrire le fichier
    print("\n[ÉCRITURE] Écriture du fichier JavaScript...")
    js_content = '\n'.join(js_lines)

    with open(output_js, 'w', encoding='utf-8') as f:
        f.write(js_content)

    file_size = output_js.stat().st_size / (1024 * 1024)
    print(f"[OK] Fichier généré: {output_js}")
    print(f"[OK] Taille: {file_size:.2f} MB")

    print("\n" + "="*70)
    print("RÉSUMÉ ÉTAPE 2")
    print("="*70)
    print(f"Livres générés: {len(book_nums)}")
    print(f"Chapitres générés: {total_chapters}")
    print("="*70 + "\n")

    return True

def main():
    """Fonction principale"""

    print("\n" + "="*70)
    print("RÉGÉNÉRATION COMPLÈTE DEPUIS PAROLES CORRIGÉES")
    print("="*70)
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*70 + "\n")

    # Vérifier que le dossier source existe
    if not FIXED_LYRICS_DIR.exists():
        print(f"[ERREUR] Le dossier de paroles corrigées n'existe pas:")
        print(f"         {FIXED_LYRICS_DIR}")
        print("\nVérifiez que le script PowerShell de correction a bien été exécuté.")
        return 1

    # Étape 1: Générer FR.json
    success_json = generate_fr_json_from_fixed(FIXED_LYRICS_DIR, OUTPUT_FR_JSON)
    if not success_json:
        print("\n[ERREUR] Échec de la génération de FR.json")
        return 1

    # Étape 2: Générer lyrics-data.js
    success_js = generate_lyrics_data_js_from_json(OUTPUT_FR_JSON, OUTPUT_LYRICS_JS)
    if not success_js:
        print("\n[ERREUR] Échec de la génération de lyrics-data.js")
        return 1

    # Succès complet
    print("\n" + "="*70)
    print("✅ RÉGÉNÉRATION COMPLÈTE RÉUSSIE !")
    print("="*70)
    print(f"✓ FR.json régénéré: {OUTPUT_FR_JSON}")
    print(f"✓ lyrics-data.js régénéré: {OUTPUT_LYRICS_JS}")
    print("\nProchaines étapes:")
    print("1. Tester localement avec: python -m http.server 8000")
    print("2. Vérifier quelques chapitres dans le lecteur")
    print("3. Si OK, déployer:")
    print("   git add lyrics/FR.json lyrics-data.js")
    print("   git commit -m 'fix: Mise à jour paroles avec corrections ASR'")
    print("   git push origin prod")
    print("="*70 + "\n")

    return 0

if __name__ == "__main__":
    exit(main())
