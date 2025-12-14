"""
Upload automatique des vidéos Bible Chantée sur YouTube
Utilise YouTube Data API v3 avec OAuth2
"""
import os
import json
import time
from pathlib import Path
from datetime import datetime
import pickle

# Google API imports
try:
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
    from googleapiclient.errors import HttpError
except ImportError:
    print("[ERROR] Modules Google API manquants!")
    print("Installation requise:")
    print("  pip install google-api-python-client google-auth-oauthlib google-auth-httplib2")
    exit(1)

# Configuration
SCOPES = ['https://www.googleapis.com/auth/youtube.upload',
          'https://www.googleapis.com/auth/youtube']
CLIENT_SECRETS_FILE = "client_secret.json"  # À télécharger depuis Google Cloud Console
TOKEN_FILE = "youtube_token.pickle"

VIDEO_DIR = Path("G:/Mon Drive/01 BibleChantee/Videos/FR")
THUMBNAIL_DIR = Path("G:/Mon Drive/01 BibleChantee/Thumbnails/FR")
TRACKING_FILE = Path("youtube_uploads.json")
PLAYLISTS_FILE = Path("youtube_playlists.json")

# Mapping des livres
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

# Thèmes par chapitre (pour les titres optimisés)
CHAPTER_THEMES = {
    "01_GEN_01": "La Création",
    "19_PSA_23": "L'Éternel est mon Berger",
    "43_JOH_03": "Naître de nouveau",
    "43_JOH_01": "La Parole faite chair",
    "40_MAT_05": "Les Béatitudes",
    "46_1CO_13": "L'hymne à l'amour",
    "45_ROM_08": "Rien ne nous séparera",
    "19_PSA_91": "Sous sa protection",
    "66_REV_21": "Nouvelle Jérusalem",
    "02_EXO_20": "Les Dix Commandements"
}


class YouTubeUploader:
    def __init__(self):
        self.youtube = None
        self.tracking_data = self.load_tracking()
        self.playlists = self.load_playlists()

    def authenticate(self):
        """Authentification OAuth2 avec Google"""
        creds = None

        # Charger token sauvegardé
        if os.path.exists(TOKEN_FILE):
            with open(TOKEN_FILE, 'rb') as token:
                creds = pickle.load(token)

        # Rafraîchir ou obtenir nouveaux credentials
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                print("[INFO] Rafraîchissement du token...")
                creds.refresh(Request())
            else:
                if not os.path.exists(CLIENT_SECRETS_FILE):
                    print("[ERROR] Fichier client_secret.json manquant!")
                    print("\nÉtapes pour l'obtenir:")
                    print("1. Aller sur: https://console.cloud.google.com")
                    print("2. Créer un projet ou sélectionner projet existant")
                    print("3. Activer YouTube Data API v3")
                    print("4. Créer des identifiants OAuth 2.0 (Application de bureau)")
                    print("5. Télécharger le JSON et renommer en 'client_secret.json'")
                    print("6. Placer dans:", os.path.dirname(os.path.abspath(__file__)))
                    return False

                print("[INFO] Authentification OAuth2 nécessaire...")
                print("[INFO] Votre navigateur va s'ouvrir pour autoriser l'accès")
                flow = InstalledAppFlow.from_client_secrets_file(
                    CLIENT_SECRETS_FILE, SCOPES)
                creds = flow.run_local_server(port=8080)

            # Sauvegarder token
            with open(TOKEN_FILE, 'wb') as token:
                pickle.dump(creds, token)
            print("[OK] Authentification réussie!")

        self.youtube = build('youtube', 'v3', credentials=creds)
        return True

    def load_tracking(self):
        """Charge le fichier de tracking des uploads"""
        if TRACKING_FILE.exists():
            try:
                with open(TRACKING_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass
        return {}

    def save_tracking(self):
        """Sauvegarde le fichier de tracking"""
        with open(TRACKING_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.tracking_data, f, indent=2, ensure_ascii=False)

    def load_playlists(self):
        """Charge les IDs de playlists existantes"""
        if PLAYLISTS_FILE.exists():
            try:
                with open(PLAYLISTS_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass
        return {}

    def save_playlists(self):
        """Sauvegarde les IDs de playlists"""
        with open(PLAYLISTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.playlists, f, indent=2, ensure_ascii=False)

    def create_playlist(self, book_code):
        """Crée une playlist pour un livre"""
        book_name = BOOK_NAMES.get(book_code, book_code)

        # Vérifier si playlist existe déjà
        if book_code in self.playlists:
            print(f"[INFO] Playlist existante: {book_name}")
            return self.playlists[book_code]

        try:
            request = self.youtube.playlists().insert(
                part="snippet,status",
                body={
                    "snippet": {
                        "title": f"{book_name} - Bible Chantée FR",
                        "description": f"Tous les chapitres du livre {book_name} en musique française.\n\n"
                                     f"🎵 Bible Louis Segond 1910\n"
                                     f"🎼 Musique générée par Suno AI V5\n"
                                     f"✅ Gratuit et libre de partage\n\n"
                                     f"Site: https://biblechantee.netlify.app",
                        "defaultLanguage": "fr"
                    },
                    "status": {
                        "privacyStatus": "public"
                    }
                }
            )
            response = request.execute()
            playlist_id = response['id']

            self.playlists[book_code] = playlist_id
            self.save_playlists()

            print(f"[OK] Playlist créée: {book_name} (ID: {playlist_id})")
            return playlist_id

        except HttpError as e:
            print(f"[ERROR] Création playlist: {e}")
            return None

    def generate_title(self, book_code, chapter_num):
        """Génère un titre optimisé SEO"""
        book_name = BOOK_NAMES.get(book_code, book_code)

        # Chercher un thème spécifique
        key = f"{book_code}_{chapter_num:02d}"
        theme = CHAPTER_THEMES.get(key, "")

        if theme:
            title = f"{book_name} Chapitre {chapter_num} - {theme} | Bible Chantée FR"
        else:
            title = f"{book_name} Chapitre {chapter_num} | Bible Chantée FR"

        # Limiter à 100 caractères
        if len(title) > 100:
            title = title[:97] + "..."

        return title

    def generate_description(self, book_code, chapter_num, lyrics=None):
        """Génère une description optimisée"""
        book_name = BOOK_NAMES.get(book_code, book_code)

        description = f"🎵 {book_name} Chapitre {chapter_num} - La Bible en musique française\n\n"

        # Ajouter paroles si disponibles
        if lyrics:
            description += f"📖 PAROLES COMPLÈTES\n{lyrics}\n\n"
            description += "---\n\n"

        description += (
            "🎼 À PROPOS DE CE PROJET\n"
            "La Bible Chantée est un projet qui transforme l'intégralité de la Bible en musique française, "
            "pour faciliter la mémorisation, la méditation et le partage de la Parole.\n\n"
            "✅ Texte intégral de la Bible Louis Segond 1910\n"
            "✅ Musique générée par IA Suno V5 (qualité studio)\n"
            "✅ Style: Worship français contemplatif (72 BPM)\n"
            "✅ Gratuit et libre de partage\n\n"
            "---\n\n"
            "🌐 EXPLORER TOUTE LA BIBLE CHANTÉE\n"
            "Site web: https://biblechantee.netlify.app\n"
            "Documentation: https://biblechantee-docs.netlify.app\n\n"
            "🔔 ABONNEZ-VOUS pour recevoir tous les chapitres de la Bible en musique!\n\n"
            "---\n\n"
            "📜 LICENCE\n"
            "Ce contenu est sous licence Creative Commons BY-NC-SA 4.0\n"
            "Vous êtes libre de partager et adapter, avec attribution, pour usage non-commercial.\n\n"
            "#BibleChantee #BibleEnMusique #BibleAudio #WorshipFrancais #LouisSegond "
            f"#{book_name.replace(' ', '')} #MeditationBiblique #PriereDuJour #Christianisme"
        )

        # YouTube limite: 5000 caractères
        if len(description) > 4900:
            description = description[:4900] + "\n\n[...]"

        return description

    def generate_tags(self, book_code):
        """Génère des tags optimisés"""
        book_name = BOOK_NAMES.get(book_code, book_code)

        # Tags universels
        tags = [
            "bible chantée",
            "bible en musique",
            "bible audio",
            "worship français",
            "louis segond",
            "méditation biblique",
            "prière",
            "christianisme",
            "bible française",
            "étude biblique"
        ]

        # Tags spécifiques au livre
        if "PSA" in book_code:
            tags.extend(["psaume", "louange", "adoration", "chant chrétien"])
        elif book_code in ["40_MAT", "41_MAR", "42_LUK", "43_JOH"]:
            tags.extend(["évangile", "jésus christ", "nouveau testament", "paroles de jésus"])
        elif book_code == "20_PRO":
            tags.extend(["sagesse", "proverbe", "conseil biblique", "vie chrétienne"])
        elif book_code in ["23_ISA", "24_JER", "26_EZE", "27_DAN"]:
            tags.extend(["prophétie", "prophète", "ancien testament"])
        elif book_code in ["45_ROM", "46_1CO", "47_2CO", "48_GAL", "49_EPH"]:
            tags.extend(["paul apôtre", "enseignement", "épître", "doctrine chrétienne"])

        # Ajouter le nom du livre
        tags.append(book_name.lower())

        return tags[:15]  # YouTube limite: 15 tags

    def load_lyrics(self, book_code, chapter_num):
        """Charge les paroles depuis le fichier lyrics"""
        lyrics_file = Path(f"G:/Mon Drive/01 BibleChantee/Lyrics/FR/{book_code}/{book_code}_{chapter_num:02d}_FR.txt")

        if lyrics_file.exists():
            try:
                content = lyrics_file.read_text(encoding='utf-8')
                # Extraire la section [LYRICS]
                import re
                match = re.search(r'\[LYRICS\]\s*\n(.+?)(?=\[STYLE\]|\[TITRE\]|$)', content, re.DOTALL)
                if match:
                    lyrics = match.group(1).strip()
                    # Limiter pour la description (max 2000 caractères pour les lyrics)
                    if len(lyrics) > 2000:
                        lyrics = lyrics[:2000] + "\n\n[...]"
                    return lyrics
            except Exception as e:
                print(f"[WARNING] Impossible de charger lyrics: {e}")

        return None

    def upload_video(self, video_path, book_code, chapter_num, thumbnail_path=None):
        """Upload une vidéo sur YouTube"""

        print(f"\n{'='*70}")
        print(f"  UPLOAD: {BOOK_NAMES.get(book_code, book_code)} - Chapitre {chapter_num}")
        print(f"{'='*70}")

        # Vérifier si déjà uploadé
        if book_code not in self.tracking_data:
            self.tracking_data[book_code] = {}

        chapter_key = str(chapter_num)
        if chapter_key in self.tracking_data[book_code]:
            if self.tracking_data[book_code][chapter_key].get('uploaded'):
                print(f"[SKIP] Déjà uploadé: {self.tracking_data[book_code][chapter_key]['youtube_id']}")
                return True

        # Créer playlist si nécessaire
        playlist_id = self.create_playlist(book_code)

        # Charger lyrics
        lyrics = self.load_lyrics(book_code, chapter_num)

        # Générer métadonnées
        title = self.generate_title(book_code, chapter_num)
        description = self.generate_description(book_code, chapter_num, lyrics)
        tags = self.generate_tags(book_code)

        print(f"[INFO] Titre: {title}")
        print(f"[INFO] Tags: {len(tags)}")
        print(f"[INFO] Fichier: {video_path.name}")

        try:
            # Préparer le body de la requête
            body = {
                'snippet': {
                    'title': title,
                    'description': description,
                    'tags': tags,
                    'categoryId': '22',  # People & Blogs
                    'defaultLanguage': 'fr',
                    'defaultAudioLanguage': 'fr'
                },
                'status': {
                    'privacyStatus': 'public',  # ou 'unlisted' ou 'private'
                    'selfDeclaredMadeForKids': False
                }
            }

            # Upload vidéo
            print("[UPLOAD] Upload en cours...")
            media = MediaFileUpload(str(video_path), chunksize=-1, resumable=True)

            request = self.youtube.videos().insert(
                part='snippet,status',
                body=body,
                media_body=media
            )

            response = None
            while response is None:
                status, response = request.next_chunk()
                if status:
                    progress = int(status.progress() * 100)
                    print(f"[UPLOAD] Progression: {progress}%")

            video_id = response['id']
            print(f"[OK] Vidéo uploadée! ID: {video_id}")
            print(f"[OK] URL: https://www.youtube.com/watch?v={video_id}")

            # Upload thumbnail si disponible
            if thumbnail_path and thumbnail_path.exists():
                try:
                    print("[THUMBNAIL] Upload en cours...")
                    self.youtube.thumbnails().set(
                        videoId=video_id,
                        media_body=MediaFileUpload(str(thumbnail_path))
                    ).execute()
                    print("[OK] Thumbnail uploadée!")
                except HttpError as e:
                    print(f"[WARNING] Thumbnail upload échoué: {e}")

            # Ajouter à la playlist
            if playlist_id:
                try:
                    print("[PLAYLIST] Ajout à la playlist...")
                    self.youtube.playlistItems().insert(
                        part='snippet',
                        body={
                            'snippet': {
                                'playlistId': playlist_id,
                                'resourceId': {
                                    'kind': 'youtube#video',
                                    'videoId': video_id
                                }
                            }
                        }
                    ).execute()
                    print("[OK] Ajoutée à la playlist!")
                except HttpError as e:
                    print(f"[WARNING] Ajout playlist échoué: {e}")

            # Sauvegarder dans tracking
            self.tracking_data[book_code][chapter_key] = {
                'uploaded': True,
                'youtube_id': video_id,
                'youtube_url': f"https://www.youtube.com/watch?v={video_id}",
                'upload_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'title': title,
                'playlist_id': playlist_id
            }
            self.save_tracking()

            print(f"[OK] Upload terminé avec succès!")
            return True

        except HttpError as e:
            print(f"[ERROR] Upload échoué: {e}")

            # Gérer les erreurs de quota
            if e.resp.status == 403:
                print("\n[QUOTA] Quota YouTube atteint!")
                print("Quota gratuit: 10,000 unités/jour")
                print("Upload vidéo = ~1,600 unités")
                print("Limite: ~6 vidéos/jour")
                print("\nOptions:")
                print("1. Attendre demain (reset à minuit PT)")
                print("2. Demander augmentation de quota (formulaire Google)")
                print("3. Passer à un compte payant Cloud")

            return False

        except Exception as e:
            print(f"[ERROR] Exception: {e}")
            return False

    def scan_and_upload(self, max_uploads=6, book_filter=None):
        """Scanne les vidéos et uploade automatiquement"""
        print("="*70)
        print("  SCAN ET UPLOAD AUTOMATIQUE - BIBLE CHANTÉE")
        print("="*70)
        print(f"Max uploads: {max_uploads}")
        if book_filter:
            print(f"Filtre: {book_filter}")
        print()

        uploaded_count = 0

        # Parcourir les livres
        for book_code in sorted(BOOK_NAMES.keys()):
            if book_filter and book_code != book_filter:
                continue

            book_dir = VIDEO_DIR / book_code
            if not book_dir.exists():
                continue

            # Parcourir les vidéos
            video_files = sorted(book_dir.glob(f"{book_code}_*.mp4"))

            for video_file in video_files:
                # Extraire le numéro de chapitre
                import re
                match = re.search(r'_(\d+)\.mp4$', video_file.name)
                if not match:
                    continue

                chapter_num = int(match.group(1))

                # Chercher thumbnail
                thumbnail_file = THUMBNAIL_DIR / book_code / f"{book_code}_{chapter_num:02d}.jpg"
                if not thumbnail_file.exists():
                    thumbnail_file = None

                # Upload
                success = self.upload_video(video_file, book_code, chapter_num, thumbnail_file)

                if success:
                    uploaded_count += 1
                    print(f"\n[PROGRESS] {uploaded_count}/{max_uploads} vidéos uploadées")

                    if uploaded_count >= max_uploads:
                        print("\n[STOP] Limite d'uploads atteinte!")
                        return uploaded_count

                    # Pause entre uploads (éviter rate limiting)
                    print("[PAUSE] Attente 5 secondes...")
                    time.sleep(5)
                else:
                    # Si échec d'upload, arrêter (probablement quota)
                    print("\n[STOP] Arrêt suite à une erreur")
                    return uploaded_count

        print(f"\n[DONE] Total uploadé: {uploaded_count} vidéos")
        return uploaded_count


def main():
    """Point d'entrée principal"""
    print("="*70)
    print("  YOUTUBE UPLOADER - BIBLE CHANTÉE")
    print("="*70)
    print()

    uploader = YouTubeUploader()

    # Authentification
    if not uploader.authenticate():
        return

    print()
    print("="*70)
    print("  MODE D'UTILISATION")
    print("="*70)
    print()
    print("OPTIONS:")
    print("  1. Scanner et uploader automatiquement (max 6 vidéos/jour)")
    print("  2. Uploader un livre spécifique")
    print("  3. Uploader une vidéo unique")
    print("  4. Voir statistiques")
    print()

    choice = input("Votre choix (1-4): ").strip()

    if choice == "1":
        # Scan automatique
        max_uploads = input("Nombre max d'uploads (défaut=6): ").strip()
        max_uploads = int(max_uploads) if max_uploads else 6

        uploader.scan_and_upload(max_uploads=max_uploads)

    elif choice == "2":
        # Livre spécifique
        print("\nCodes de livres disponibles:")
        for code, name in list(BOOK_NAMES.items())[:10]:
            print(f"  {code} - {name}")
        print("  ...")

        book_code = input("\nEntrez le code du livre (ex: 19_PSA): ").strip().upper()

        if book_code in BOOK_NAMES:
            max_uploads = input("Nombre max d'uploads (défaut=50): ").strip()
            max_uploads = int(max_uploads) if max_uploads else 50

            uploader.scan_and_upload(max_uploads=max_uploads, book_filter=book_code)
        else:
            print("[ERROR] Code livre invalide")

    elif choice == "3":
        # Vidéo unique
        book_code = input("Code livre (ex: 19_PSA): ").strip().upper()
        chapter = input("Numéro chapitre: ").strip()

        if book_code in BOOK_NAMES and chapter.isdigit():
            chapter_num = int(chapter)
            video_file = VIDEO_DIR / book_code / f"{book_code}_{chapter_num:02d}.mp4"

            if video_file.exists():
                thumbnail_file = THUMBNAIL_DIR / book_code / f"{book_code}_{chapter_num:02d}.jpg"
                if not thumbnail_file.exists():
                    thumbnail_file = None

                uploader.upload_video(video_file, book_code, chapter_num, thumbnail_file)
            else:
                print(f"[ERROR] Vidéo introuvable: {video_file}")
        else:
            print("[ERROR] Paramètres invalides")

    elif choice == "4":
        # Statistiques
        total_uploaded = 0
        books_complete = 0

        for book_code, chapters in uploader.tracking_data.items():
            uploaded = sum(1 for ch in chapters.values() if ch.get('uploaded'))
            total_uploaded += uploaded

            book_name = BOOK_NAMES.get(book_code, book_code)
            print(f"{book_name}: {uploaded} chapitres uploadés")

            # Vérifier si livre complet (approximatif)
            if uploaded >= 10:  # Seuil arbitraire
                books_complete += 1

        print()
        print("="*70)
        print(f"TOTAL: {total_uploaded} vidéos uploadées")
        print(f"Livres en cours: {books_complete}")
        print("="*70)


if __name__ == "__main__":
    main()
