#!/usr/bin/env python3
"""Copie quelques fichiers MP3 en local pour test rapide"""
import shutil
import sys
import io
from pathlib import Path

# Fix encoding pour Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("Copie de fichiers de test...")

# Créer dossiers locaux
local_v1 = Path("audio_v1_local/01_GEN")
local_v2 = Path("audio_v2_local/01_GEN")
local_v1.mkdir(parents=True, exist_ok=True)
local_v2.mkdir(parents=True, exist_ok=True)

# Copier 3 fichiers V1 depuis Google Drive
source_v1 = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR_V1/01_GEN")
for i in range(1, 4):
    src = source_v1 / f"01_GEN_{i:02d}_FR.mp3"
    dst = local_v1 / f"01_GEN_{i:02d}_FR.mp3"
    if src.exists():
        print(f"  Copie V1 chapitre {i}...")
        shutil.copy2(src, dst)
        print(f"    ✓ {dst.stat().st_size / 1024 / 1024:.1f} MB")

# Copier 3 fichiers V2 depuis Google Drive
source_v2 = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR_V2/01_GEN")
for i in range(1, 4):
    src = source_v2 / f"01_GEN_{i:03d}_v1.mp3"
    dst = local_v2 / f"01_GEN_{i:03d}_v1.mp3"
    if src.exists():
        print(f"  Copie V2 chapitre {i}...")
        shutil.copy2(src, dst)
        print(f"    ✓ {dst.stat().st_size / 1024 / 1024:.1f} MB")

print("\n✅ Fichiers copiés!")
print("\nPour tester avec fichiers locaux:")
print("  1. Modifiez lecteur.html:")
print("     audio_v1/ → audio_v1_local/")
print("     audio_v2/ → audio_v2_local/")
print("  2. Rechargez la page")
