#!/usr/bin/env python3
"""
Script de génération du fichier lyrics/FR.json depuis les transcriptions Whisper
Auteur: Claude Code
Date: 2026-01-12
Contexte: Réclamation utilisateur - paroles site ≠ audio réel
"""

import os
import json
import re
from pathlib import Path
from collections import defaultdict

# Mapping des codes de livres bibliques vers leur numéro
BOOK_CODES = {
    "GEN": "01", "EXO": "02", "LEV": "03", "NUM": "04", "DEU": "05",
    "JOS": "06", "JDG": "07", "RUT": "08", "1SAM": "09", "2SAM": "10",
    "1KI": "11", "2KI": "12", "1CH": "13", "2CH": "14", "EZR": "15",
    "NEH": "16", "EST": "17", "JOB": "18", "PSA": "19", "PRO": "20",
    "ECC": "21", "SON": "22", "ISA": "23", "JER": "24", "LAM": "25",
    "EZE": "26", "DAN": "27", "HOS": "28", "JOE": "29", "AMO": "30",
    "OBA": "31", "JON": "32", "MIC": "33", "NAH": "34", "HAB": "35",
    "ZEP": "36", "HAG": "37", "ZEC": "38", "MAL": "39", "MAT": "40",
    "MAR": "41", "LUK": "42", "JOH": "43", "ACT": "44", "ROM": "45",
    "1CO": "46", "2CO": "47", "GAL": "48", "EPH": "49", "PHP": "50",
    "COL": "51", "1TH": "52", "2TH": "53", "1TI": "54", "2TI": "55",
    "TIT": "56", "PHM": "57", "HEB": "58", "JAM": "59", "1PE": "60",
    "2PE": "61", "1JO": "62", "2JO": "63", "3JO": "64", "JUD": "65",
    "REV": "66"
}

def parse_whisper_filename(filename):
    """
    Parse le nom de fichier Whisper pour extraire le livre et le chapitre
    Exemple: 19_PSA_23_FR.txt -> (19, 23)
    """
    # Pattern: XX_CODE_YY_FR.txt où XX = numéro livre, YY = numéro chapitre
    match = re.match(r'(\d+)_([A-Z0-9]+)_(\d+)_FR\.txt', filename)
    if match:
        book_num = match.group(1)
        chapter_num = int(match.group(3))
        return (book_num, chapter_num)
    return None

def read_whisper_file(filepath):
    """
    Lit un fichier Whisper et retourne son contenu complet
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except Exception as e:
        print(f"[ERREUR] Impossible de lire {filepath}: {e}")
        return None

def generate_fr_json(whisper_dir, output_file):
    """
    Génère le fichier FR.json depuis tous les fichiers Whisper
    """
    print("="*60)
    print("GÉNÉRATION FR.json DEPUIS TRANSCRIPTIONS WHISPER")
    print("="*60)
    print(f"Source: {whisper_dir}")
    print(f"Destination: {output_file}")
    print("="*60 + "\n")

    # Structure: {book_num: {chapter_num: content}}
    lyrics_data = defaultdict(dict)

    # Statistiques
    processed = 0
    errors = 0

    # Parcourir tous les dossiers de livres
    for book_dir in sorted(Path(whisper_dir).iterdir()):
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
                content = read_whisper_file(txt_file)
                if content is None:
                    errors += 1
                    continue

                # Ajouter au dictionnaire (convertir Windows line endings)
                lyrics_data[book_num][str(chapter_num)] = content.replace('\r\n', '\r\n')

                processed += 1
                if processed % 50 == 0:
                    print(f"  [PROGRESS] {processed} chapitres traités...")

            except Exception as e:
                print(f"  [ERREUR] {txt_file.name}: {e}")
                errors += 1

    # Convertir defaultdict en dict normal pour JSON
    final_data = {book: dict(chapters) for book, chapters in sorted(lyrics_data.items())}

    # Écrire le fichier JSON
    print("\n" + "="*60)
    print("ÉCRITURE DU FICHIER JSON...")
    print("="*60)

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
        print(f"[OK] Fichier généré: {output_file}")
    except Exception as e:
        print(f"[ERREUR] Impossible d'écrire le fichier: {e}")
        return False

    # Résumé
    print("\n" + "="*60)
    print("RÉSUMÉ")
    print("="*60)
    print(f"Chapitres traités: {processed}")
    print(f"Erreurs: {errors}")
    print(f"Livres dans le JSON: {len(final_data)}")

    # Afficher quelques exemples
    print("\nExemples de livres générés:")
    for book_num in sorted(final_data.keys())[:5]:
        chapters = len(final_data[book_num])
        print(f"  Livre {book_num}: {chapters} chapitres")

    print("="*60)
    return True

def main():
    """Fonction principale"""
    # Chemins
    whisper_dir = Path(r"G:\Mon Drive\01 BibleChantee\Lyrics_Whisper_FR")
    output_file = Path(r"C:\ScriptBible\bible-chantee\lyrics\FR.json")
    backup_file = Path(r"C:\ScriptBible\bible-chantee\lyrics\FR.json.backup")

    # Vérifier que le dossier source existe
    if not whisper_dir.exists():
        print(f"[ERREUR] Le dossier Whisper n'existe pas: {whisper_dir}")
        return 1

    # Créer un backup du fichier existant
    if output_file.exists():
        print(f"[BACKUP] Sauvegarde de {output_file} -> {backup_file}")
        try:
            import shutil
            shutil.copy2(output_file, backup_file)
            print("[OK] Backup créé\n")
        except Exception as e:
            print(f"[ERREUR] Impossible de créer le backup: {e}")
            return 1

    # Générer le nouveau fichier
    success = generate_fr_json(whisper_dir, output_file)

    if success:
        print("\n[SUCCESS] FR.json généré avec succès depuis les transcriptions Whisper!")
        return 0
    else:
        print("\n[ERREUR] Échec de la génération")
        return 1

if __name__ == "__main__":
    exit(main())
