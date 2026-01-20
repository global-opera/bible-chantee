#!/usr/bin/env python3
"""
Whisper Transcription - ALL 1189 FR Chapters
Transcrit tous les MP3 FR avec Whisper
Modèle: small (recommandé pour vitesse/qualité)
GPU: CUDA si disponible
"""

import whisper
import torch
import os
from pathlib import Path
from datetime import datetime
import json

# Configuration
MP3_BASE = r"G:\Mon Drive\01 BibleChantee\Suno_Output\FR"
OUTPUT_BASE = r"G:\Mon Drive\01 BibleChantee\Lyrics_Whisper_FR_FINAL"
MODEL_NAME = "small"  # tiny, base, small, medium, large, large-v3
LANGUAGE = "fr"

# Resume support
PROGRESS_FILE = Path(__file__).parent / "whisper_progress.json"

def load_progress():
    """Charge la progression si le script est interrompu"""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {"completed": [], "failed": [], "last_index": 0}

def save_progress(progress):
    """Sauvegarde la progression"""
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, indent=2)

def find_all_mp3():
    """Trouve tous les MP3 FR"""
    mp3_files = []
    base_path = Path(MP3_BASE)

    for book_dir in sorted(base_path.glob("*_*")):
        if book_dir.is_dir():
            for mp3 in sorted(book_dir.glob("*.mp3")):
                mp3_files.append(mp3)

    return mp3_files

def transcribe_file(model, mp3_path, output_dir):
    """Transcrit un fichier MP3"""
    try:
        print(f"  Transcription...")
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

        return True, output_path

    except Exception as e:
        print(f"  ❌ ERREUR: {e}")
        return False, None

def main():
    print("=" * 80)
    print("WHISPER TRANSCRIPTION - 1189 CHAPITRES FR")
    print("=" * 80)

    # Check GPU
    has_cuda = torch.cuda.is_available()
    device = "cuda" if has_cuda else "cpu"

    if has_cuda:
        gpu_name = torch.cuda.get_device_name(0)
        print(f"[OK] GPU: {gpu_name} (CUDA)")
    else:
        print("[!] CPU only (sera tres lent)")

    print(f"Modèle: {MODEL_NAME}")
    print(f"Output: {OUTPUT_BASE}")
    print("=" * 80)

    # Créer output dir
    output_base = Path(OUTPUT_BASE)
    output_base.mkdir(parents=True, exist_ok=True)

    # Load progress
    progress = load_progress()
    completed_files = set(progress["completed"])

    print(f"\nRecherche des MP3...")
    mp3_files = find_all_mp3()
    print(f"Trouvé: {len(mp3_files)} fichiers MP3")

    if completed_files:
        print(f"Deja completes: {len(completed_files)}")
        remaining = [f for f in mp3_files if str(f) not in completed_files]
        print(f"Restants: {len(remaining)}")
        mp3_files = remaining

    if not mp3_files:
        print("[OK] Tous les fichiers deja transcrits!")
        return

    # Confirmation
    print(f"\n[!] Cette operation va transcrire {len(mp3_files)} fichiers")
    print(f"Estimation: {len(mp3_files) * 22 // 3600} heures")
    print("Lancement automatique...")

    # Load model
    print(f"\nChargement du modele {MODEL_NAME}...")
    model = whisper.load_model(MODEL_NAME, device=device)
    print("[OK] Modele charge\n")

    # Transcribe
    start_time = datetime.now()
    success_count = 0
    error_count = 0

    for i, mp3_path in enumerate(mp3_files, 1):
        # Créer book dir
        book_name = mp3_path.parent.name
        output_dir = output_base / book_name
        output_dir.mkdir(exist_ok=True)

        print(f"[{i}/{len(mp3_files)}] {mp3_path.stem}")

        success, output_path = transcribe_file(model, mp3_path, output_dir)

        if success:
            print(f"  [OK] Sauvegarde: {output_path.name}")
            success_count += 1
            progress["completed"].append(str(mp3_path))
        else:
            error_count += 1
            progress["failed"].append(str(mp3_path))

        progress["last_index"] = i

        # Sauvegarder progression tous les 10 fichiers
        if i % 10 == 0:
            save_progress(progress)
            elapsed = (datetime.now() - start_time).total_seconds()
            avg_time = elapsed / i
            remaining = len(mp3_files) - i
            eta_seconds = remaining * avg_time
            eta_hours = eta_seconds / 3600
            print(f"  Progress: {i}/{len(mp3_files)} | ETA: {eta_hours:.1f}h")

    # Sauvegarder final
    save_progress(progress)

    # Résumé
    elapsed = datetime.now() - start_time
    print("\n" + "=" * 80)
    print("TERMINE")
    print("=" * 80)
    print(f"Succes: {success_count}")
    print(f"Erreurs: {error_count}")
    print(f"Duree totale: {elapsed}")
    print(f"Output: {OUTPUT_BASE}")
    print("=" * 80)

if __name__ == "__main__":
    main()
