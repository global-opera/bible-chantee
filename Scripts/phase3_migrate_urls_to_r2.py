#!/usr/bin/env python3
"""
Phase 3 - Migrer toutes les URLs vers R2
Crée des backups avant modification
"""

import re
import shutil
from pathlib import Path
from datetime import datetime

# Configuration
BASE_DIR = Path(r"C:\ScriptBible\bible-chantee")
BACKUP_DIR = BASE_DIR / "backups" / f"urls_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

# Base URL R2
R2_BASE_URL = "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev"

# Mapping des URLs à migrer
URL_MAPPINGS = {
    "audio-urls-confessions-fr.js": {
        "https://archive.org/download/bible-chantee-confessions-fr/01_Joie.mp3":
            f"{R2_BASE_URL}/confessions/FR_01_Joie.mp3",
        "https://archive.org/download/bible-chantee-confessions-fr/02_Gueri.mp3":
            f"{R2_BASE_URL}/confessions/FR_02_Gueri.mp3",
        "https://archive.org/download/bible-chantee-confessions-fr/03_Sante.mp3":
            f"{R2_BASE_URL}/confessions/FR_03_Sante.mp3",
        "https://archive.org/download/bible-chantee-confessions-fr/04_Vainqueur.mp3":
            f"{R2_BASE_URL}/confessions/FR_04_Vainqueur.mp3",
        "https://archive.org/download/bible-chantee-confessions-fr/05_Prospere.mp3":
            f"{R2_BASE_URL}/confessions/FR_05_Prospere.mp3",
        "https://archive.org/download/bible-chantee-confessions-fr/06_Reconnaissant.mp3":
            f"{R2_BASE_URL}/confessions/FR_06_Reconnaissant.mp3",
        "https://archive.org/download/bible-chantee-confessions-fr/07_Heureux.mp3":
            f"{R2_BASE_URL}/confessions/FR_07_Heureux.mp3",
        "https://archive.org/download/bible-chantee-confessions-fr/08_Beni.mp3":
            f"{R2_BASE_URL}/confessions/FR_08_Beni.mp3",
        "https://archive.org/download/bible-chantee-confessions-fr/09_Amen.mp3":
            f"{R2_BASE_URL}/confessions/FR_09_Amen.mp3",
        "https://archive.org/download/bible-chantee-confessions-fr/10_Shalom.mp3":
            f"{R2_BASE_URL}/confessions/FR_10_Shalom.mp3",
    },
    "audio-urls-confessions-pt.js": {
        "https://archive.org/download/bible-chantee-confessions-pt/01_Alegria.mp3":
            f"{R2_BASE_URL}/confessions/PT_01_Alegria.mp3",
        "https://archive.org/download/bible-chantee-confessions-pt/02_Curado.mp3":
            f"{R2_BASE_URL}/confessions/PT_02_Curado.mp3",
        "https://archive.org/download/bible-chantee-confessions-pt/03_Saude.mp3":
            f"{R2_BASE_URL}/confessions/PT_03_Saude.mp3",
        "https://archive.org/download/bible-chantee-confessions-pt/04_Vencedor.mp3":
            f"{R2_BASE_URL}/confessions/PT_04_Vencedor.mp3",
        "https://archive.org/download/bible-chantee-confessions-pt/05_Prospero.mp3":
            f"{R2_BASE_URL}/confessions/PT_05_Prospero.mp3",
        "https://archive.org/download/bible-chantee-confessions-pt/06_Grato.mp3":
            f"{R2_BASE_URL}/confessions/PT_06_Grato.mp3",
        "https://archive.org/download/bible-chantee-confessions-pt/07_Feliz.mp3":
            f"{R2_BASE_URL}/confessions/PT_07_Feliz.mp3",
        "https://archive.org/download/bible-chantee-confessions-pt/08_Abencoado.mp3":
            f"{R2_BASE_URL}/confessions/PT_08_Abencoado.mp3",
        "https://archive.org/download/bible-chantee-confessions-pt/09_Amem.mp3":
            f"{R2_BASE_URL}/confessions/PT_09_Amem.mp3",
        "https://archive.org/download/bible-chantee-confessions-pt/10_Shalom.mp3":
            f"{R2_BASE_URL}/confessions/PT_10_Shalom.mp3",
    },
    "audio-urls-confessions-tl.js": {
        "https://archive.org/download/bible-chantee-confessions-tl/01_Kagalakan.mp3":
            f"{R2_BASE_URL}/confessions/TL_01_Kagalakan.mp3",
        "https://archive.org/download/bible-chantee-confessions-tl/02_Kagalingan.mp3":
            f"{R2_BASE_URL}/confessions/TL_02_Kagalingan.mp3",
        "https://archive.org/download/bible-chantee-confessions-tl/03_Kalusugan.mp3":
            f"{R2_BASE_URL}/confessions/TL_03_Kalusugan.mp3",
        "https://archive.org/download/bible-chantee-confessions-tl/04_Tagumpay.mp3":
            f"{R2_BASE_URL}/confessions/TL_04_Tagumpay.mp3",
        "https://archive.org/download/bible-chantee-confessions-tl/05_Kasaganaan.mp3":
            f"{R2_BASE_URL}/confessions/TL_05_Kasaganaan.mp3",
        "https://archive.org/download/bible-chantee-confessions-tl/06_Pasasalamat.mp3":
            f"{R2_BASE_URL}/confessions/TL_06_Pasasalamat.mp3",
        "https://archive.org/download/bible-chantee-confessions-tl/07_Kaligayahan.mp3":
            f"{R2_BASE_URL}/confessions/TL_07_Kaligayahan.mp3",
        "https://archive.org/download/bible-chantee-confessions-tl/08_Pagpapala.mp3":
            f"{R2_BASE_URL}/confessions/TL_08_Pagpapala.mp3",
        "https://archive.org/download/bible-chantee-confessions-tl/09_Amen.mp3":
            f"{R2_BASE_URL}/confessions/TL_09_Amen.mp3",
        "https://archive.org/download/bible-chantee-confessions-tl/10_Shalom.mp3":
            f"{R2_BASE_URL}/confessions/TL_10_Shalom.mp3",
    },
}

def create_backup(filepath):
    """Créer un backup du fichier avant modification"""
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    backup_path = BACKUP_DIR / filepath.name
    shutil.copy2(filepath, backup_path)
    return backup_path

def migrate_file(filepath, mappings):
    """Migrer les URLs d'un fichier"""

    print(f"\n[PROCESSING] {filepath.name}")

    # Créer backup
    backup_path = create_backup(filepath)
    print(f"  [BACKUP] {backup_path}")

    # Lire le contenu
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    replacements = 0

    # Remplacer chaque URL
    for old_url, new_url in mappings.items():
        if old_url in content:
            content = content.replace(old_url, new_url)
            replacements += 1
            print(f"  [REPLACED] {old_url.split('/')[-1]}")

    # Mettre à jour le commentaire en haut du fichier
    content = re.sub(
        r'// Archive\.org collection:.*\n',
        f'// R2 CDN: {R2_BASE_URL}/confessions/\n',
        content
    )

    # Supprimer les lignes de commentaire permanentes
    content = re.sub(
        r'// ✅ PERMANENT:.*\n',
        '',
        content
    )

    # Sauvegarder le fichier modifié
    if replacements > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  [SAVED] {replacements} URLs migrées vers R2")
    else:
        print(f"  [SKIP] Aucune URL à migrer")

    return replacements

def migrate_all_files():
    """Migrer tous les fichiers"""

    print("=" * 80)
    print("PHASE 3 - MIGRATION URLS VERS R2")
    print("=" * 80)

    total_replacements = 0

    for filename, mappings in URL_MAPPINGS.items():
        filepath = BASE_DIR / filename

        if not filepath.exists():
            print(f"\n[SKIP] Fichier n'existe pas: {filename}")
            continue

        replacements = migrate_file(filepath, mappings)
        total_replacements += replacements

    print("\n" + "=" * 80)
    print("RESUME")
    print("=" * 80)
    print(f"Total URLs migrées: {total_replacements}")
    print(f"Backups sauvegardés dans: {BACKUP_DIR}")
    print()

    if total_replacements > 0:
        print("[OK] Migration terminée avec succès")
        print("     Prochaine étape: Tester avec TEST_URLS.html")
    else:
        print("[INFO] Aucune URL à migrer (déjà à jour?)")

if __name__ == "__main__":
    migrate_all_files()
