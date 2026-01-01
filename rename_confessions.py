#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Renomme les fichiers de confessions pour enlever la double numérotation
01_01_Joy.mp3 → 01_Joy.mp3
"""

import sys
import io
from pathlib import Path
import shutil

# Configure UTF-8 encoding for Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def rename_confession_files():
    """Renomme tous les fichiers de confessions"""

    base_dir = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/confessions")
    languages = ["FR", "EN", "PT", "ES", "DE", "IT", "AR", "RU", "ZH", "HI", "TL", "SW"]

    total_renamed = 0
    total_skipped = 0

    print("=" * 80)
    print("  RENOMMAGE DES FICHIERS DE CONFESSIONS")
    print("=" * 80)
    print()

    for lang in languages:
        lang_dir = base_dir / lang

        if not lang_dir.exists():
            print(f"[SKIP] Dossier inexistant: {lang}")
            continue

        print(f"\n--- {lang} ---")

        # Trouver tous les fichiers MP3
        mp3_files = sorted(lang_dir.glob("*.mp3"))

        for mp3_file in mp3_files:
            filename = mp3_file.name

            # Vérifier si le fichier a une double numérotation (ex: 01_01_Joy.mp3)
            parts = filename.split('_', 2)

            if len(parts) >= 3 and parts[0].isdigit() and parts[1].isdigit():
                # Fichier avec double numérotation
                new_filename = f"{parts[0]}_{parts[2]}"
                new_path = mp3_file.parent / new_filename

                if new_path.exists():
                    print(f"[SKIP] {filename} (destination existe déjà)")
                    total_skipped += 1
                else:
                    # Renommer
                    mp3_file.rename(new_path)
                    print(f"[OK] {filename} → {new_filename}")
                    total_renamed += 1
            else:
                # Fichier déjà au bon format
                print(f"[OK] {filename} (déjà correct)")
                total_skipped += 1

    print("\n" + "=" * 80)
    print(f"  RENOMMAGE TERMINÉ")
    print("=" * 80)
    print(f"Fichiers renommés: {total_renamed}")
    print(f"Fichiers sautés: {total_skipped}")
    print(f"Total traité: {total_renamed + total_skipped}")
    print("=" * 80)
    print()


if __name__ == "__main__":
    rename_confession_files()
