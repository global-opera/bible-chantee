#!/usr/bin/env python3
"""
Whisper TEST - 10 Chapitres Représentatifs
Test avant transcription complète des 1189
"""

import whisper
import torch
import os
from pathlib import Path
from datetime import datetime

# Configuration
MP3_BASE = r"G:\Mon Drive\01 BibleChantee\Suno_Output\FR"
OUTPUT_BASE = r"C:\ScriptBible\bible-chantee\whisper_test_10_results"
MODEL_NAME = "small"  # Rapide et bonne qualité
LANGUAGE = "fr"

# 10 chapitres représentatifs (différents livres, styles)
TEST_FILES = [
    "01_GEN/01_GEN_01_FR.mp3",   # Genèse 1
    "01_GEN/01_GEN_22_FR.mp3",   # Genèse 22 (sacrifice Isaac)
    "02_EXO/02_EXO_20_FR.mp3",   # Exode 20 (10 commandements)
    "19_PSA/19_PSA_01_FR.mp3",   # Psaume 1
    "19_PSA/19_PSA_23_FR.mp3",   # Psaume 23 (berger)
    "19_PSA/19_PSA_103_FR.mp3",  # Psaume 103
    "40_MAT/40_MAT_05_FR.mp3",   # Matthieu 5 (béatitudes)
    "43_JOH/43_JOH_01_FR.mp3",   # Jean 1 (Parole)
    "45_ROM/45_ROM_08_FR.mp3",   # Romains 8
    "66_REV/66_REV_21_FR.mp3"    # Apocalypse 21 (nouvelle Jérusalem)
]

def transcribe_file(model, mp3_path, output_dir):
    """Transcrit un fichier MP3"""
    try:
        print(f"  Transcription en cours...")
        result = model.transcribe(str(mp3_path), language=LANGUAGE, verbose=False)

        # Créer output file
        output_path = output_dir / mp3_path.with_suffix('.txt').name

        # Format output
        content = f"[TITLE]\n"
        content += f"{mp3_path.stem.replace('_FR', '')}\n\n"
        content += f"[LYRICS]\n"
        content += result['text'].strip() + "\n"

        # Sauvegarder
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True, output_path, len(result['text'])

    except Exception as e:
        print(f"  [X] ERREUR: {e}")
        return False, None, 0

def main():
    print("=" * 80)
    print("WHISPER TEST - 10 CHAPITRES REPRÉSENTATIFS")
    print("=" * 80)

    # Check GPU
    has_cuda = torch.cuda.is_available()
    device = "cuda" if has_cuda else "cpu"

    if has_cuda:
        gpu_name = torch.cuda.get_device_name(0)
        print(f"[OK] GPU: {gpu_name} (CUDA)")
    else:
        print("[!] CPU only")

    print(f"Modele: {MODEL_NAME}")
    print(f"Fichiers: {len(TEST_FILES)}")
    print("=" * 80)

    # Créer output dir
    output_base = Path(OUTPUT_BASE)
    output_base.mkdir(parents=True, exist_ok=True)

    # Load model
    print(f"\nChargement du modele {MODEL_NAME}...")
    model = whisper.load_model(MODEL_NAME, device=device)
    print("[OK] Modele charge\n")

    # Transcribe
    start_time = datetime.now()
    success_count = 0
    error_count = 0
    total_chars = 0

    for i, rel_path in enumerate(TEST_FILES, 1):
        mp3_path = Path(MP3_BASE) / rel_path

        if not mp3_path.exists():
            print(f"[{i}/{len(TEST_FILES)}] [X] MANQUANT: {rel_path}")
            error_count += 1
            continue

        print(f"\n[{i}/{len(TEST_FILES)}] {mp3_path.stem}")
        print(f"  Fichier: {mp3_path.relative_to(Path(MP3_BASE).parent)}")

        file_start = datetime.now()
        success, output_path, char_count = transcribe_file(model, mp3_path, output_base)
        file_duration = (datetime.now() - file_start).total_seconds()

        if success:
            print(f"  [OK] {file_duration:.1f}s ({char_count} caracteres)")
            success_count += 1
            total_chars += char_count
        else:
            error_count += 1

    # Résumé
    elapsed = datetime.now() - start_time
    avg_time = elapsed.total_seconds() / len(TEST_FILES)

    print("\n" + "=" * 80)
    print("RÉSUMÉ TEST")
    print("=" * 80)
    print(f"Succès: {success_count}/{len(TEST_FILES)}")
    print(f"Erreurs: {error_count}")
    print(f"Durée totale: {elapsed}")
    print(f"Temps moyen/fichier: {avg_time:.1f}s")
    print(f"Caracteres transcrits: {total_chars:,}")
    print(f"\nOutput: {OUTPUT_BASE}")
    print("=" * 80)

    if success_count > 0:
        # Estimation pour 1189 fichiers
        total_seconds = 1189 * avg_time
        hours = total_seconds / 3600
        print(f"\n[ESTIMATION POUR 1189 FICHIERS]")
        print(f"   Temps estime: {hours:.1f} heures ({hours/24:.1f} jours)")
        print(f"   Avec modèle: {MODEL_NAME}")

    print("\n[OK] Verifiez les resultats dans:")
    print(f"   {OUTPUT_BASE}")
    print("\nSi les resultats sont bons, lancez:")
    print("   python tools/whisper_transcribe_all_1189.py")
    print("=" * 80)

if __name__ == "__main__":
    main()
