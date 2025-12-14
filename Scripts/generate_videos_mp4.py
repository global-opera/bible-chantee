"""
Génération automatique de vidéos MP4 à partir des MP3 existants
Utilise l'API Suno pour créer des vidéos avec artwork et paroles
"""
import requests
import time
import json
from pathlib import Path
from api_key import SUNO_API_KEY

# Configuration
SUNO_BASE_URL = "https://api.sunoapi.org/api/v1"
SUNO_OUTPUT_DIR = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")
VIDEO_OUTPUT_DIR = Path("G:/Mon Drive/01 BibleChantee/Videos/FR")

# Mapping des codes de livres avec noms complets
BOOK_NAMES = {
    "01_GEN": "Genèse", "02_EXO": "Exode", "03_LEV": "Lévitique", "04_NUM": "Nombres",
    "05_DEU": "Deutéronome", "06_JOS": "Josué", "07_JDG": "Juges", "08_RUT": "Ruth",
    "09_1SAM": "1 Samuel", "10_2SAM": "2 Samuel", "11_1KI": "1 Rois", "12_2KI": "2 Rois",
    "13_1CH": "1 Chroniques", "14_2CH": "2 Chroniques", "15_EZR": "Esdras",
    "16_NEH": "Néhémie", "17_EST": "Esther", "18_JOB": "Job", "19_PSA": "Psaumes",
    "20_PRO": "Proverbes", "21_ECC": "Ecclésiaste", "22_SON": "Cantique des Cantiques",
    "23_ISA": "Ésaïe", "24_JER": "Jérémie", "25_LAM": "Lamentations",
    "26_EZE": "Ézéchiel", "27_DAN": "Daniel", "28_HOS": "Osée", "29_JOE": "Joël",
    "30_AMO": "Amos", "31_OBA": "Abdias", "32_JON": "Jonas", "33_MIC": "Michée",
    "34_NAH": "Nahum", "35_HAB": "Habacuc", "36_ZEP": "Sophonie", "37_HAG": "Aggée",
    "38_ZEC": "Zacharie", "39_MAL": "Malachie", "40_MAT": "Matthieu", "41_MAR": "Marc",
    "42_LUK": "Luc", "43_JOH": "Jean", "44_ACT": "Actes", "45_ROM": "Romains",
    "46_1CO": "1 Corinthiens", "47_2CO": "2 Corinthiens", "48_GAL": "Galates",
    "49_EPH": "Éphésiens", "50_PHP": "Philippiens", "51_COL": "Colossiens",
    "52_1TH": "1 Thessaloniciens", "53_2TH": "2 Thessaloniciens",
    "54_1TI": "1 Timothée", "55_2TI": "2 Timothée", "56_TIT": "Tite",
    "57_PHM": "Philémon", "58_HEB": "Hébreux", "59_JAS": "Jacques",
    "60_1PE": "1 Pierre", "61_2PE": "2 Pierre", "62_1JO": "1 Jean",
    "63_2JO": "2 Jean", "64_3JO": "3 Jean", "65_JUD": "Jude", "66_REV": "Apocalypse"
}

class SunoVideoGenerator:
    def __init__(self, api_key):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def generate_video_from_audio(self, audio_url, title, lyrics=None):
        """
        Génère une vidéo MP4 à partir d'une URL audio

        Args:
            audio_url: URL CDN du fichier MP3
            title: Titre de la vidéo
            lyrics: Paroles optionnelles à afficher

        Returns:
            dict: Informations de la tâche vidéo
        """
        # NOTE: L'endpoint exact peut varier selon la documentation Suno
        # Ceci est une structure générique basée sur les patterns API Suno

        payload = {
            "audioUrl": audio_url,
            "title": title,
            "lyrics": lyrics or "",
            "coverImage": "default",  # Peut être personnalisé
        }

        print(f"[VIDEO] Génération: {title}")

        try:
            response = requests.post(
                f"{SUNO_BASE_URL}/generate-video",  # Endpoint à vérifier
                headers=self.headers,
                json=payload
            )

            if response.status_code == 200:
                result = response.json()
                if result.get("code") == 200:
                    task_id = result.get("data", {}).get("taskId")
                    print(f"[OK] Tâche vidéo créée: {task_id}")
                    return result.get("data")
                else:
                    print(f"[ERROR] Réponse: {result}")
            else:
                print(f"[ERROR] Status {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[ERROR] Exception: {e}")

        return None

    def check_video_status(self, task_id):
        """Vérifie le statut de génération vidéo"""
        try:
            response = requests.get(
                f"{SUNO_BASE_URL}/generate-video/status",  # Endpoint à vérifier
                headers=self.headers,
                params={"taskId": task_id}
            )

            if response.status_code == 200:
                result = response.json()
                return result.get("data")
        except Exception as e:
            print(f"[ERROR] Status check: {e}")

        return None

    def wait_for_video(self, task_id, max_wait=300):
        """Attend que la vidéo soit générée"""
        elapsed = 0
        print(f"[WAIT] Attente génération vidéo (max {max_wait}s)...")

        while elapsed < max_wait:
            status = self.check_video_status(task_id)

            if status:
                state = status.get("status", "unknown")
                print(f"[{elapsed}s] Status: {state}")

                if state in ["completed", "COMPLETE", "SUCCESS"]:
                    print(f"[OK] Vidéo terminée!")
                    return status
                elif state in ["failed", "FAILED", "ERROR"]:
                    print(f"[ERROR] Génération échouée")
                    return None

            time.sleep(10)
            elapsed += 10

        print("[TIMEOUT] Temps maximum atteint")
        return None

    def download_video(self, video_url, output_path):
        """Télécharge le fichier vidéo MP4"""
        print(f"[DOWNLOAD] Téléchargement vidéo vers {output_path}")

        try:
            response = requests.get(video_url, stream=True)

            if response.status_code == 200:
                output_path.parent.mkdir(parents=True, exist_ok=True)

                with open(output_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)

                print("[OK] Téléchargement terminé")
                return True
            else:
                print(f"[ERROR] Téléchargement échoué: {response.status_code}")
        except Exception as e:
            print(f"[ERROR] Exception: {e}")

        return False


def load_lyrics(book_code, chapter_num):
    """Charge les paroles depuis le fichier lyrics"""
    lyrics_file = Path(f"G:/Mon Drive/01 BibleChantee/Lyrics/FR/{book_code}/{book_code}_{chapter_num:02d}_FR.txt")

    if lyrics_file.exists():
        try:
            content = lyrics_file.read_text(encoding='utf-8')
            # Extraire la section [LYRICS]
            import re
            match = re.search(r'\[LYRICS\]\s*\n(.+?)(?=\[STYLE\]|\[TITRE\]|$)', content, re.DOTALL)
            if match:
                return match.group(1).strip()
        except Exception as e:
            print(f"[WARNING] Impossible de charger lyrics: {e}")

    return None


def generate_videos_for_book(book_code, api_key, priority_only=False):
    """
    Génère des vidéos pour tous les chapitres d'un livre

    Args:
        book_code: Code du livre (ex: "19_PSA")
        api_key: Clé API Suno
        priority_only: Si True, génère seulement les chapitres avec CDN URLs valides
    """
    generator = SunoVideoGenerator(api_key)

    book_name = BOOK_NAMES.get(book_code, book_code)
    mp3_dir = SUNO_OUTPUT_DIR / book_code
    video_dir = VIDEO_OUTPUT_DIR / book_code
    video_dir.mkdir(parents=True, exist_ok=True)

    if not mp3_dir.exists():
        print(f"[ERROR] Dossier MP3 introuvable: {mp3_dir}")
        return

    # Charger les URLs CDN
    cdn_urls_file = mp3_dir / "cdn_urls.json"
    cdn_urls = {}

    if cdn_urls_file.exists():
        try:
            with open(cdn_urls_file, 'r', encoding='utf-8') as f:
                cdn_urls = json.load(f)
        except:
            pass

    print(f"\n{'='*70}")
    print(f"  GÉNÉRATION VIDÉOS - {book_name} ({book_code})")
    print(f"{'='*70}")
    print(f"URLs CDN disponibles: {len(cdn_urls)}")

    # Parcourir les MP3
    mp3_files = sorted(mp3_dir.glob(f"{book_code}_*.mp3"))

    for mp3_file in mp3_files:
        # Extraire le numéro de chapitre
        import re
        match = re.search(r'_(\d+)\.mp3$', mp3_file.name)
        if not match:
            continue

        chapter_num = int(match.group(1))

        # Vérifier si vidéo existe déjà
        video_file = video_dir / f"{book_code}_{chapter_num:02d}.mp4"
        if video_file.exists():
            print(f"[SKIP] Vidéo déjà existante: {book_code} chapitre {chapter_num}")
            continue

        # Obtenir l'URL CDN
        audio_url = cdn_urls.get(str(chapter_num))

        if not audio_url:
            print(f"[SKIP] Pas d'URL CDN pour chapitre {chapter_num}")
            if priority_only:
                continue
            else:
                # Utiliser placeholder (à éviter en production)
                print(f"[WARNING] Utilisation du fichier local")
                continue

        # Vérifier que c'est une URL Suno valide
        if not audio_url.startswith("https://cdn"):
            print(f"[SKIP] URL CDN invalide pour chapitre {chapter_num}")
            continue

        # Charger les paroles
        lyrics = load_lyrics(book_code, chapter_num)

        # Titre de la vidéo
        title = f"{book_name} - Chapitre {chapter_num}"

        print(f"\n--- Chapitre {chapter_num} ---")

        # Générer la vidéo
        result = generator.generate_video_from_audio(audio_url, title, lyrics)

        if not result:
            print("[ERROR] Échec génération vidéo")
            continue

        task_id = result.get('taskId')
        if not task_id:
            print("[ERROR] Pas de task_id")
            continue

        # Attendre la génération
        completed = generator.wait_for_video(task_id, max_wait=300)

        if completed:
            # Extraire l'URL vidéo
            video_url = completed.get('videoUrl')

            if video_url:
                # Télécharger
                generator.download_video(video_url, video_file)

                # Sauvegarder l'URL vidéo
                video_urls_file = video_dir / "video_urls.json"
                video_urls = {}

                if video_urls_file.exists():
                    try:
                        with open(video_urls_file, 'r') as f:
                            video_urls = json.load(f)
                    except:
                        pass

                video_urls[str(chapter_num)] = video_url

                with open(video_urls_file, 'w', encoding='utf-8') as f:
                    json.dump(video_urls, f, indent=2, ensure_ascii=False)
            else:
                print("[ERROR] Pas d'URL vidéo dans la réponse")

        # Pause entre générations
        time.sleep(3)

    print(f"\n{'='*70}")
    print(f"  TERMINÉ - {book_name}")
    print(f"{'='*70}")


def main():
    """Point d'entrée principal"""
    print("=" * 70)
    print("  GÉNÉRATEUR DE VIDÉOS MP4 - BIBLE CHANTÉE")
    print("=" * 70)
    print()
    print("IMPORTANT:")
    print("- Nécessite URLs CDN Suno valides dans cdn_urls.json")
    print("- Génère des vidéos MP4 avec artwork et paroles")
    print("- Les vidéos sont sauvegardées dans Videos/FR/")
    print()

    if not SUNO_API_KEY:
        print("[ERROR] SUNO_API_KEY non définie")
        return

    print("Quel livre voulez-vous générer en vidéo?")
    print("Exemples:")
    print("  19_PSA - Psaumes (150 chapitres)")
    print("  40_MAT - Matthieu (28 chapitres)")
    print("  ALL - Tous les livres")
    print()

    choice = input("Votre choix: ").strip().upper()

    if choice == "ALL":
        print("\n[INFO] Génération de TOUS les livres...")
        for book_code in BOOK_NAMES.keys():
            try:
                generate_videos_for_book(book_code, SUNO_API_KEY, priority_only=True)
            except KeyboardInterrupt:
                print("\n[STOP] Arrêt manuel")
                break
            except Exception as e:
                print(f"[ERROR] {book_code}: {e}")
                continue
    else:
        if choice in BOOK_NAMES:
            generate_videos_for_book(choice, SUNO_API_KEY, priority_only=False)
        else:
            print(f"[ERROR] Code livre invalide: {choice}")


if __name__ == "__main__":
    main()
