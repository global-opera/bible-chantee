"""Lanceur pour la génération complète de la Bible FR"""
import sys
from pathlib import Path
from api_key import SUNO_API_KEY
from suno_api_generator import SunoAPIGenerator, parse_lyrics_file

# Liste des 66 livres de la Bible
BIBLE_BOOKS = [
    "01_GEN", "02_EXO", "03_LEV", "04_NUM", "05_DEU", "06_JOS", "07_JDG", "08_RUT",
    "09_1SAM", "10_2SAM", "11_1KIN", "12_2KIN", "13_1CHR", "14_2CHR", "15_EZR", "16_NEH",
    "17_EST", "18_JOB", "19_PSA", "20_PRO", "21_ECC", "22_SON", "23_ISA", "24_JER",
    "25_LAM", "26_EZE", "27_DAN", "28_HOS", "29_JOE", "30_AMO", "31_OBA", "32_JON",
    "33_MIC", "34_NAH", "35_HAB", "36_ZEP", "37_HAG", "38_ZEC", "39_MAL",
    "40_MAT", "41_MAR", "42_LUK", "43_JOH", "44_ACT", "45_ROM", "46_1COR", "47_2COR",
    "48_GAL", "49_EPH", "50_PHI", "51_COL", "52_1THE", "53_2THE", "54_1TIM", "55_2TIM",
    "56_TIT", "57_PHI", "58_HEB", "59_JAM", "60_1PET", "61_2PET", "62_1JOH", "63_2JOH",
    "64_3JOH", "65_JUD", "66_REV"
]

def generate_complete_bible():
    """Génère tous les livres de la Bible en français"""
    print("=" * 80)
    print("  GENERATION COMPLETE BIBLE FRANCAISE - API SUNO")
    print("=" * 80)

    generator = SunoAPIGenerator(SUNO_API_KEY)

    # Vérifier les crédits
    print("\n[CREDITS] Verification...")
    credits = generator.check_credits()
    print(f"[INFO] Credits disponibles: {credits}")
    print(f"[INFO] Credits necessaires: ~14,268 (1189 chapitres × 12)")

    if credits < 14268:
        print("[WARNING] Crédits potentiellement insuffisants!")
        response = input("Continuer quand même? (o/N): ").strip().lower()
        if response != 'o':
            print("Annulé")
            return

    # Statistiques
    total_chapters = 0
    total_generated = 0
    total_failed = 0

    # Traiter chaque livre
    for i, book_code in enumerate(BIBLE_BOOKS, 1):
        print("\n" + "=" * 80)
        print(f"  [{i}/66] LIVRE: {book_code}")
        print("=" * 80)

        project_root = Path(__file__).parent.parent
        lyrics_dir = project_root / f"Lyrics/FR/{book_code}"

        if not lyrics_dir.exists():
            print(f"[SKIP] Dossier introuvable: {lyrics_dir}")
            continue

        files = sorted(lyrics_dir.glob(f"{book_code}_*_FR.txt"))
        if not files:
            print(f"[SKIP] Aucun fichier dans {book_code}")
            continue

        print(f"[INFO] {len(files)} chapitres trouves")

        output_dir = project_root / f"Suno_Output/FR/{book_code}"
        output_dir.mkdir(parents=True, exist_ok=True)

        # Traiter chaque chapitre
        for j, file_path in enumerate(files, 1):
            # Extraire le numéro de chapitre
            import re
            match = re.search(r'_(\d+)_FR', file_path.name)
            if not match:
                continue

            chapter_num = int(match.group(1))
            output_file = output_dir / f"{book_code}_{chapter_num:02d}.mp3"

            # Skip si déjà généré
            if output_file.exists():
                print(f"[SKIP] [{j}/{len(files)}] Chapitre {chapter_num} (deja genere)")
                total_chapters += 1
                total_generated += 1
                continue

            print(f"\n--- [{j}/{len(files)}] Chapitre {chapter_num} ---")
            total_chapters += 1

            # Parser
            song_data = parse_lyrics_file(file_path)
            print(f"Titre: {song_data['title']}")

            # Générer
            result = generator.generate_song(
                lyrics=song_data['lyrics'],
                style=song_data['style'],
                title=song_data['title'],
                model="V4_5ALL",
                styleWeight=0.65,
                weirdnessConstraint=0.65,
                audioWeight=0.65
            )

            if not result:
                print("[ERROR] Generation echouee")
                total_failed += 1
                continue

            task_id = result.get('taskId')
            if not task_id:
                print("[ERROR] Pas de task_id")
                total_failed += 1
                continue

            # Attendre
            completed = generator.wait_for_completion(task_id, max_wait=180)

            if completed:
                audio_url = generator.extract_audio_url(completed)
                if audio_url:
                    if generator.download_song(audio_url, output_file):
                        total_generated += 1
                        print(f"[OK] Genere: {output_file.name}")
                    else:
                        total_failed += 1
                else:
                    print("[ERROR] Pas d'URL audio")
                    total_failed += 1
            else:
                print("[ERROR] Timeout")
                total_failed += 1

            # Pause
            import time
            time.sleep(2)

        # Statistiques du livre
        print(f"\n[LIVRE {book_code}] Termine: {len(files)} chapitres traites")

    # Statistiques finales
    print("\n" + "=" * 80)
    print("  GENERATION TERMINEE!")
    print("=" * 80)
    print(f"Total chapitres: {total_chapters}")
    print(f"Generes: {total_generated}")
    print(f"Echecs: {total_failed}")
    print(f"Taux de reussite: {(total_generated/total_chapters*100):.1f}%")

    # Vérifier crédits restants
    credits_final = generator.check_credits()
    print(f"\nCredits utilises: ~{credits - credits_final}")

if __name__ == "__main__":
    try:
        generate_complete_bible()
    except KeyboardInterrupt:
        print("\n\n[INTERRUPTED] Generation interrompue par l'utilisateur")
        print("[INFO] Vous pouvez relancer ce script pour reprendre")
    except Exception as e:
        print(f"\n[ERROR] {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
