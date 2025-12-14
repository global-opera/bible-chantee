"""
Génération de VRAIES vidéos Suno avec paroles synchronisées
Utilise l'API Suno pour créer des vidéos AI professionnelles
"""
import requests
import time
import json
from pathlib import Path
from api_key import SUNO_API_KEY

# Configuration
SUNO_BASE_URL = "https://api.sunoapi.org"
CDN_URLS_BASE = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")
VIDEO_OUTPUT_DIR = Path("G:/Mon Drive/01 BibleChantee/Videos/FR")
VIDEO_TRACKING_FILE = Path("G:/Mon Drive/01 BibleChantee/Analytics/video_generation_tracking.json")

# Mapping des noms de livres
BOOK_NAMES = {
    "01_GEN": "Genèse", "02_EXO": "Exode", "03_LEV": "Lévitique", "04_NUM": "Nombres",
    "05_DEU": "Deutéronome", "06_JOS": "Josué", "07_JDG": "Juges", "08_RUT": "Ruth",
    "09_1SAM": "1 Samuel", "10_2SAM": "2 Samuel", "11_1KI": "1 Rois", "12_2KI": "2 Rois",
    "13_1CH": "1 Chroniques", "14_2CH": "2 Chroniques", "15_EZR": "Esdras",
    "16_NEH": "Néhémie", "17_EST": "Esther", "18_JOB": "Job", "19_PSA": "Psaumes",
    "20_PRO": "Proverbes", "21_ECC": "Ecclésiaste", "22_SON": "Cantique",
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
        self.tracking = self.load_tracking()

    def load_tracking(self):
        """Charge le fichier de suivi des vidéos"""
        if VIDEO_TRACKING_FILE.exists():
            try:
                with open(VIDEO_TRACKING_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass
        return {}

    def save_tracking(self):
        """Sauvegarde le suivi"""
        VIDEO_TRACKING_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(VIDEO_TRACKING_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.tracking, f, indent=2, ensure_ascii=False)

    def get_audio_cdn_url(self, book_code, chapter_num):
        """Récupère l'URL CDN du MP3"""
        cdn_file = CDN_URLS_BASE / book_code / "cdn_urls.json"

        if not cdn_file.exists():
            return None

        try:
            with open(cdn_file, 'r', encoding='utf-8') as f:
                urls = json.load(f)
                return urls.get(str(chapter_num))
        except:
            return None

    def get_lyrics(self, book_code, chapter_num):
        """Récupère les paroles depuis le fichier texte"""
        txt_file = Path(f"G:/Mon Drive/01 BibleChantee/Textes_Complets/FR/{book_code}/{book_code}_{chapter_num}_FR.txt")

        if not txt_file.exists():
            return None

        try:
            with open(txt_file, 'r', encoding='utf-8') as f:
                content = f.read()

                # Extraire les lyrics (après style et avant fin)
                if "Style:" in content and "---" in content:
                    parts = content.split("---")
                    if len(parts) >= 2:
                        lyrics = parts[1].strip()
                        return lyrics

            return None
        except:
            return None

    def create_video(self, book_code, chapter_num):
        """
        Crée une vidéo Suno avec paroles synchronisées

        Returns:
            task_id ou None si échec
        """
        # Vérifier si déjà générée
        key = f"{book_code}_{chapter_num}"
        if key in self.tracking and self.tracking[key].get('status') == 'completed':
            print(f"[SKIP] Vidéo déjà générée: {key}")
            return None

        # Récupérer URL CDN
        audio_url = self.get_audio_cdn_url(book_code, chapter_num)
        if not audio_url:
            print(f"[ERROR] URL CDN manquante: {book_code} {chapter_num}")
            return None

        # Récupérer paroles
        lyrics = self.get_lyrics(book_code, chapter_num)

        # Titre
        book_name = BOOK_NAMES.get(book_code, book_code)
        title = f"{book_name} {chapter_num}"

        print(f"[VIDEO] Création: {title}")
        print(f"[INFO] Audio: {audio_url[:50]}...")

        # Payload pour l'API
        payload = {
            "audioUrl": audio_url,
            "title": title,
            "lyrics": lyrics or "",
            "style": "biblical",  # Style visuel
            "showLyrics": True,   # Afficher les paroles
            "syncLyrics": True    # Synchroniser les paroles
        }

        try:
            # Appel API
            response = requests.post(
                f"{SUNO_BASE_URL}/suno-api/create-music-video",
                headers=self.headers,
                json=payload,
                timeout=30
            )

            print(f"[API] Status: {response.status_code}")

            if response.status_code == 200:
                result = response.json()

                # Vérifier la structure de réponse
                if result.get("code") == 200 or result.get("success"):
                    data = result.get("data", result)
                    task_id = data.get("taskId") or data.get("id") or data.get("task_id")

                    if task_id:
                        print(f"[OK] Task ID: {task_id}")

                        # Sauvegarder dans le tracking
                        self.tracking[key] = {
                            "book_code": book_code,
                            "chapter_num": chapter_num,
                            "task_id": task_id,
                            "status": "processing",
                            "audio_url": audio_url,
                            "title": title,
                            "created_at": time.time()
                        }
                        self.save_tracking()

                        return task_id
                else:
                    print(f"[ERROR] API response: {result}")
            else:
                print(f"[ERROR] HTTP {response.status_code}: {response.text[:200]}")

        except requests.exceptions.Timeout:
            print(f"[ERROR] Timeout après 30s")
        except Exception as e:
            print(f"[ERROR] Exception: {e}")

        return None

    def check_video_status(self, task_id):
        """
        Vérifie le statut d'une vidéo en génération

        Returns:
            dict avec status et video_url si terminé
        """
        try:
            response = requests.get(
                f"{SUNO_BASE_URL}/suno-api/get-music-video-details",
                headers=self.headers,
                params={"taskId": task_id},
                timeout=15
            )

            if response.status_code == 200:
                result = response.json()

                if result.get("code") == 200 or result.get("success"):
                    data = result.get("data", result)

                    status = data.get("status", "unknown").lower()
                    video_url = data.get("videoUrl") or data.get("video_url")

                    return {
                        "status": status,
                        "video_url": video_url,
                        "progress": data.get("progress", 0)
                    }

        except Exception as e:
            print(f"[ERROR] Check status: {e}")

        return {"status": "error"}

    def download_video(self, video_url, book_code, chapter_num):
        """Télécharge la vidéo générée"""
        output_dir = VIDEO_OUTPUT_DIR / book_code
        output_dir.mkdir(parents=True, exist_ok=True)

        output_file = output_dir / f"{book_code}_{chapter_num}.mp4"

        print(f"[DOWNLOAD] {output_file.name}")

        try:
            response = requests.get(video_url, stream=True, timeout=300)

            if response.status_code == 200:
                with open(output_file, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)

                size_mb = output_file.stat().st_size / (1024*1024)
                print(f"[OK] {output_file.name} ({size_mb:.1f} MB)")
                return True
            else:
                print(f"[ERROR] Download failed: {response.status_code}")

        except Exception as e:
            print(f"[ERROR] {e}")

        return False

    def wait_and_download(self, task_id, book_code, chapter_num, max_wait=600):
        """
        Attend la génération et télécharge

        Args:
            max_wait: Temps max d'attente en secondes (défaut: 10 min)
        """
        print(f"[WAIT] Attente génération (max {max_wait}s)...")

        start_time = time.time()
        check_interval = 10  # Vérifier toutes les 10s

        while (time.time() - start_time) < max_wait:
            status_info = self.check_video_status(task_id)
            status = status_info.get("status")

            elapsed = int(time.time() - start_time)
            print(f"[{elapsed}s] Status: {status.upper()}")

            if status in ["completed", "success", "finished"]:
                video_url = status_info.get("video_url")

                if video_url:
                    # Télécharger
                    if self.download_video(video_url, book_code, chapter_num):
                        # Mettre à jour tracking
                        key = f"{book_code}_{chapter_num}"
                        if key in self.tracking:
                            self.tracking[key]["status"] = "completed"
                            self.tracking[key]["video_url"] = video_url
                            self.tracking[key]["completed_at"] = time.time()
                            self.save_tracking()

                        return True
                else:
                    print(f"[ERROR] Pas d'URL vidéo dans la réponse")
                    return False

            elif status in ["failed", "error"]:
                print(f"[ERROR] Génération échouée")
                return False

            # Attendre avant prochain check
            time.sleep(check_interval)

        print(f"[TIMEOUT] Dépassé {max_wait}s")
        return False

    def generate_video_complete(self, book_code, chapter_num):
        """Génère une vidéo complète (création + attente + téléchargement)"""
        task_id = self.create_video(book_code, chapter_num)

        if not task_id:
            return False

        return self.wait_and_download(task_id, book_code, chapter_num)


def generate_test_videos():
    """Génère 3 vidéos test avec l'API Suno"""
    print("="*80)
    print("  GÉNÉRATION VIDÉOS SUNO TEST - AVEC PAROLES SYNCHRONISÉES")
    print("="*80)

    generator = SunoVideoGenerator(SUNO_API_KEY)

    # Chapitres test (ceux qui ont des MP3)
    test_chapters = [
        ("19_PSA", 23, "Psaume 23 - Le Bon Berger"),
        ("19_PSA", 91, "Psaume 91 - Protection"),
        ("23_ISA", 40, "Ésaïe 40 - Consolation"),
    ]

    success = 0
    failed = 0

    for book_code, chapter_num, description in test_chapters:
        print(f"\n{'='*80}")
        print(f"[{success+failed+1}/3] {description}")
        print("="*80)

        if generator.generate_video_complete(book_code, chapter_num):
            success += 1
            print(f"[SUCCESS] {description}")
        else:
            failed += 1
            print(f"[FAILED] {description}")

    # Résumé
    print("\n" + "="*80)
    print(f"  RÉSULTATS: {success} réussies, {failed} échouées")
    print("="*80)

    if success > 0:
        print(f"\n[INFO] Vidéos dans: {VIDEO_OUTPUT_DIR}")
        print("[INFO] Ce sont de VRAIES vidéos Suno avec:")
        print("  - Visuels AI générés")
        print("  - Paroles synchronisées")
        print("  - Effets professionnels")

    return success, failed


if __name__ == "__main__":
    try:
        generate_test_videos()
    except KeyboardInterrupt:
        print("\n\n[STOP] Arrêté")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
