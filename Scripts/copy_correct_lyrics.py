"""
Script pour copier les bons lyrics depuis les archives vers V3
Les vrais lyrics sont dans Archives_Lyrics/FR_V2 (10 dec)
"""
import sys
import io
import shutil
from pathlib import Path

# Configurer l'encodage UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Configuration
ARCHIVE_DIR = Path(r"G:\Mon Drive\01 BibleChantee\Archives_Lyrics\FR_V2")
DEST_DIR = Path(r"C:\ScriptBible\bible-chantee\V3\lyrics\FR")

# Autres langues à vérifier
OTHER_ARCHIVES = {
    'PT': Path(r"G:\Mon Drive\01 BibleChantee\Archives_Lyrics\PT_V2"),
    'EN': Path(r"G:\Mon Drive\01 BibleChantee\Archives_Lyrics\EN_V2"),
    'ES': Path(r"G:\Mon Drive\01 BibleChantee\Archives_Lyrics\ES_V2"),
    'DE': Path(r"G:\Mon Drive\01 BibleChantee\Archives_Lyrics\DE_V2"),
    'IT': Path(r"G:\Mon Drive\01 BibleChantee\Archives_Lyrics\IT_V2"),
}


def copy_lyrics_for_lang(lang, source_dir, dest_base):
    """Copie les lyrics d'une langue depuis les archives"""

    if not source_dir.exists():
        print(f"[SKIP] {lang}: Répertoire source introuvable: {source_dir}")
        return 0, 0

    print(f"\n{'='*70}")
    print(f"  COPIE DES LYRICS: {lang}")
    print(f"{'='*70}")
    print(f"Source: {source_dir}")
    print(f"Destination: {dest_base / lang}")
    print()

    copied_count = 0
    skipped_count = 0
    error_count = 0

    # Parcourir tous les fichiers txt dans les sous-dossiers
    for txt_file in source_dir.rglob("*.txt"):
        try:
            # Construire le chemin de destination en préservant la structure
            relative_path = txt_file.relative_to(source_dir)
            dest_file = dest_base / lang / relative_path

            # Créer le dossier de destination si nécessaire
            dest_file.parent.mkdir(parents=True, exist_ok=True)

            # Vérifier si le fichier existe déjà
            if dest_file.exists():
                # Comparer les tailles pour voir si c'est différent
                source_size = txt_file.stat().st_size
                dest_size = dest_file.stat().st_size

                if source_size == dest_size:
                    print(f"[SKIP] {relative_path} (identique)")
                    skipped_count += 1
                    continue

            # Copier le fichier
            shutil.copy2(txt_file, dest_file)
            print(f"[COPY] {relative_path}")
            copied_count += 1

        except Exception as e:
            print(f"[ERROR] {txt_file.name}: {e}")
            error_count += 1

    print()
    print(f"Résumé {lang}: {copied_count} copiés, {skipped_count} ignorés, {error_count} erreurs")

    return copied_count, error_count


def main():
    """Copie tous les lyrics depuis les archives"""

    print()
    print("="*70)
    print("  COPIE DES VRAIS LYRICS DEPUIS LES ARCHIVES")
    print("="*70)
    print()

    total_copied = 0
    total_errors = 0

    # 1. Copier le français (priorité)
    print("🇫🇷 FRANÇAIS")
    copied, errors = copy_lyrics_for_lang('FR', ARCHIVE_DIR, DEST_DIR.parent)
    total_copied += copied
    total_errors += errors

    # 2. Copier les autres langues si elles existent
    for lang, archive_path in OTHER_ARCHIVES.items():
        flag = {'PT': '🇵🇹', 'EN': '🇬🇧', 'ES': '🇪🇸', 'DE': '🇩🇪', 'IT': '🇮🇹'}.get(lang, '')
        print(f"\n{flag} {lang}")

        copied, errors = copy_lyrics_for_lang(lang, archive_path, DEST_DIR.parent)
        total_copied += copied
        total_errors += errors

    # Résumé final
    print()
    print("="*70)
    print("  RÉSUMÉ FINAL")
    print("="*70)
    print(f"Total fichiers copiés: {total_copied}")
    print(f"Total erreurs: {total_errors}")
    print()

    if total_errors == 0:
        print("✅ Tous les lyrics ont été copiés avec succès!")
    else:
        print(f"⚠️  {total_errors} erreur(s) détectée(s)")

    print()


if __name__ == '__main__':
    main()
