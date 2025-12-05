"""Générateur de musique via l'API Suno - Remplacement des robots PyAutoGUI"""
import requests
import time
import json
import sys
import io
from pathlib import Path
from api_key import SUNO_API_KEY

# Configurer l'encodage UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Configuration
SUNO_BASE_URL = "https://api.sunoapi.org/api/v1"

class SunoAPIGenerator:
    def __init__(self, api_key):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def generate_song(self, lyrics, style, title, model="V4_5ALL", **kwargs):
        """
        Génère une chanson avec l'API Suno

        Args:
            lyrics: Paroles de la chanson
            style: Style musical (ex: "French worship, 72 BPM")
            title: Titre de la chanson
            model: Modèle à utiliser (V4, V4_5, V4_5PLUS, V4_5ALL, V5)
            **kwargs: Paramètres optionnels avancés:
                - instrumental: True/False (défaut: False)
                - vocalGender: "m" ou "f" (genre vocal)
                - styleWeight: 0.0-1.0 (poids du style, défaut: 0.65)
                - weirdnessConstraint: 0.0-1.0 (créativité, défaut: 0.65)
                - audioWeight: 0.0-1.0 (poids audio, défaut: 0.65)
                - negativeTags: Tags à éviter (ex: "Heavy Metal, Upbeat Drums")
                - personaId: ID de persona personnalisée
                - callBackUrl: URL de callback webhook

        Returns:
            dict: Réponse contenant taskId pour suivre la génération
        """
        payload = {
            "customMode": True,
            "prompt": lyrics,
            "style": style,
            "title": title,
            "instrumental": kwargs.get("instrumental", False),
            "model": model,
            # callBackUrl est requis par sunoapi.org - utiliser placeholder si non fourni
            "callBackUrl": kwargs.get("callBackUrl", "https://webhook.site/unique-endpoint")
        }

        # Ajouter les paramètres optionnels avancés si fournis
        if "vocalGender" in kwargs:
            payload["vocalGender"] = kwargs["vocalGender"]

        if "styleWeight" in kwargs:
            payload["styleWeight"] = kwargs["styleWeight"]

        if "weirdnessConstraint" in kwargs:
            payload["weirdnessConstraint"] = kwargs["weirdnessConstraint"]

        if "audioWeight" in kwargs:
            payload["audioWeight"] = kwargs["audioWeight"]

        if "negativeTags" in kwargs:
            payload["negativeTags"] = kwargs["negativeTags"]

        if "personaId" in kwargs:
            payload["personaId"] = kwargs["personaId"]

        print(f"[API] Generation: {title}")
        print(f"[API] Style: {style}")
        print(f"[API] Model: {model}")
        if kwargs:
            print(f"[API] Parametres avances: {list(kwargs.keys())}")

        # Validation des limites de caractères
        self._validate_lengths(lyrics, style, title, model)

        response = requests.post(
            f"{SUNO_BASE_URL}/generate",
            headers=self.headers,
            json=payload
        )

        if response.status_code == 200:
            result = response.json()

            # Format de réponse Suno: {"code": 200, "msg": "success", "data": {"taskId": "..."}}
            if result.get("code") == 200 and "data" in result:
                task_id = result["data"].get("taskId")
                print(f"[OK] Task created: {task_id}")
                return result["data"]
            else:
                print(f"[ERROR] Reponse inattendue: {result}")
                return None
        else:
            print(f"[ERROR] {response.status_code}: {response.text}")
            return None

    def _validate_lengths(self, lyrics, style, title, model):
        """Valide les limites de caractères selon le modèle"""
        # Limites pour prompt (lyrics)
        if model == "V4":
            max_prompt = 3000
        else:  # V4_5, V4_5PLUS, V4_5ALL, V5
            max_prompt = 5000

        # Limites pour style
        if model == "V4":
            max_style = 200
        else:
            max_style = 1000

        # Limites pour title
        if model in ["V4", "V4_5ALL"]:
            max_title = 80
        else:  # V4_5, V4_5PLUS, V5
            max_title = 100

        # Vérifications
        if len(lyrics) > max_prompt:
            print(f"[WARNING] Lyrics trop longues ({len(lyrics)}/{max_prompt}), troncature...")
            lyrics = lyrics[:max_prompt]

        if len(style) > max_style:
            print(f"[WARNING] Style trop long ({len(style)}/{max_style}), troncature...")
            style = style[:max_style]

        if len(title) > max_title:
            print(f"[WARNING] Title trop long ({len(title)}/{max_title}), troncature...")
            title = title[:max_title]

        return lyrics, style, title

    def check_status(self, task_id):
        """
        Vérifie le statut d'une génération

        Args:
            task_id: ID de la tâche retourné par generate_song

        Returns:
            dict: Statut et informations de la chanson
        """
        response = requests.get(
            f"{SUNO_BASE_URL}/generate/record-info",
            headers=self.headers,
            params={"taskId": task_id}
        )

        if response.status_code == 200:
            result = response.json()

            # Format de réponse: {"code": 200, "msg": "success", "data": {...}}
            if result.get("code") == 200 and "data" in result:
                return result["data"]
            else:
                print(f"[ERROR] Reponse status inattendue: {result}")
                return None
        else:
            print(f"[ERROR] Status check failed: {response.status_code}")
            return None

    def wait_for_completion(self, task_id, max_wait=300, check_interval=10):
        """
        Attend que la génération soit terminée

        Args:
            task_id: ID de la tâche
            max_wait: Temps maximum d'attente en secondes
            check_interval: Intervalle entre les vérifications

        Returns:
            dict: Informations complètes de la chanson générée
        """
        elapsed = 0
        print(f"[WAIT] Attente de la generation (max {max_wait}s)...")

        while elapsed < max_wait:
            status = self.check_status(task_id)

            if status:
                state = status.get("status", "unknown")
                print(f"[{elapsed}s] Status: {state}")

                # États de succès possibles
                if state in ["completed", "COMPLETE", "SUCCESS", "FIRST_SUCCESS", "BOTH_SUCCESS"]:
                    print(f"[OK] Generation terminee! (status: {state})")
                    return status
                elif state in ["failed", "FAILED", "ERROR"]:
                    print(f"[ERROR] Generation echouee (status: {state})")
                    return None

            time.sleep(check_interval)
            elapsed += check_interval

        print("[TIMEOUT] Temps maximum atteint")
        return None

    def download_song(self, audio_url, output_path):
        """
        Télécharge le fichier audio généré

        Args:
            audio_url: URL du fichier audio
            output_path: Chemin de sortie local
        """
        print(f"[DOWNLOAD] Telechargement vers {output_path}")

        response = requests.get(audio_url, stream=True)

        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print("[OK] Telechargement termine")
            return True
        else:
            print(f"[ERROR] Telechargement echoue: {response.status_code}")
            return False

    def extract_audio_url(self, status_data):
        """
        Extrait l'URL audio depuis la structure de réponse Suno

        Args:
            status_data: Données de statut retournées par check_status

        Returns:
            str: URL audio ou None
        """
        if not status_data:
            return None

        # Structure: response.sunoData[] array
        if 'response' in status_data and 'sunoData' in status_data['response']:
            suno_data = status_data['response']['sunoData']
            # Chercher le premier élément avec une audioUrl non vide
            for song in suno_data:
                url = song.get('audioUrl') or song.get('sourceAudioUrl')
                if url:
                    return url

        # Fallback: essayer l'ancien format
        return status_data.get('audioUrl')

    def check_credits(self):
        """Vérifie les crédits restants"""
        response = requests.get(
            f"{SUNO_BASE_URL}/generate/credit",
            headers=self.headers
        )

        if response.status_code == 200:
            result = response.json()

            # Format de réponse: {"code": 200, "msg": "success", "data": {...}}
            if result.get("code") == 200 and "data" in result:
                credits = result["data"]
                print(f"[CREDITS] {credits}")
                return credits
            else:
                print(f"[CREDITS] Reponse: {result}")
                return result
        else:
            print("[ERROR] Impossible de verifier les credits")
            return None


def parse_lyrics_file(file_path):
    """
    Parse un fichier de lyrics au format standard

    Returns:
        dict: {lyrics, style, title}
    """
    content = Path(file_path).read_text(encoding='utf-8')

    # Extraire [LYRICS]
    import re
    lyrics_match = re.search(r'\[LYRICS\]\s*\n(.+?)(?=\[STYLE\]|\[TITRE\]|$)', content, re.DOTALL)
    lyrics = lyrics_match.group(1).strip() if lyrics_match else ""

    # Extraire [STYLE]
    style_match = re.search(r'\[STYLE\]\s*\n(.+?)(?=\[TITRE\]|$)', content, re.DOTALL)
    style = style_match.group(1).strip() if style_match else "French worship, 72 BPM"

    # Extraire [TITRE]
    titre_match = re.search(r'\[TITRE\]\s*\n(.+?)$', content, re.DOTALL)
    title = titre_match.group(1).strip() if titre_match else Path(file_path).stem

    return {
        "lyrics": lyrics,
        "style": style,
        "title": title
    }


def process_book(lang_code, book_code, api_key, output_dir=None, start_chapter=1):
    """
    Traite tous les chapitres d'un livre avec l'API Suno

    Args:
        lang_code: Code de langue (FR, EN, etc.)
        book_code: Code du livre (01_GEN, etc.)
        api_key: Clé API Suno
        output_dir: Dossier de sortie pour les MP3
        start_chapter: Chapitre de départ
    """
    generator = SunoAPIGenerator(api_key)

    # Vérifier les crédits
    generator.check_credits()

    # Trouver tous les fichiers du livre
    lyrics_dir = Path(f"G:/Mon Drive/01 BibleChantee/Lyrics/{lang_code}/{book_code}")

    if not lyrics_dir.exists():
        print(f"[ERROR] Dossier introuvable: {lyrics_dir}")
        return

    files = sorted(lyrics_dir.glob(f"{book_code}_*_{lang_code}.txt"))

    if not files:
        print(f"[ERROR] Aucun fichier trouve dans {lyrics_dir}")
        return

    # Output directory
    if not output_dir:
        output_dir = Path(f"G:/Mon Drive/01 BibleChantee/Suno_Output/{lang_code}/{book_code}")
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n{'='*70}")
    print(f"  GENERATION SUNO API - {book_code} [{lang_code}]")
    print(f"{'='*70}")
    print(f"Fichiers trouves: {len(files)}")
    print(f"Dossier sortie: {output_dir}")

    # Traiter chaque chapitre
    for i, file_path in enumerate(files, 1):
        # Extraire le numéro de chapitre
        import re
        match = re.search(r'_(\d+)_' + lang_code, file_path.name)
        if not match:
            continue

        chapter_num = int(match.group(1))

        if chapter_num < start_chapter:
            print(f"[SKIP] Chapitre {chapter_num} (< {start_chapter})")
            continue

        print(f"\n--- [{i}/{len(files)}] Chapitre {chapter_num} ---")

        # Parser le fichier
        song_data = parse_lyrics_file(file_path)

        print(f"Titre: {song_data['title']}")
        print(f"Style: {song_data['style']}")

        # Générer avec paramètres par défaut optimisés
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
            print("[ERROR] Generation echouee, passage au suivant")
            continue

        task_id = result.get('taskId')
        if not task_id:
            print("[ERROR] Pas de task_id retourne")
            continue

        # Attendre la completion
        completed = generator.wait_for_completion(task_id, max_wait=180)

        if completed:
            # Télécharger le MP3
            audio_url = generator.extract_audio_url(completed)
            if audio_url:
                output_file = output_dir / f"{book_code}_{chapter_num:02d}.mp3"
                generator.download_song(audio_url, output_file)
            else:
                print("[ERROR] Pas d'URL audio dans la reponse")

        # Petite pause entre les générations
        time.sleep(2)

    print(f"\n{'='*70}")
    print(f"  TERMINE!")
    print(f"{'='*70}")


def main():
    """Point d'entrée principal"""
    print("=" * 70)
    print("  SUNO API GENERATOR")
    print("=" * 70)

    if not SUNO_API_KEY:
        print("[ERROR] SUNO_API_KEY n'est pas definie")
        print("Configurez-la dans vos variables d'environnement")
        print("ou via CONFIGURER_API_KEYS.ps1")
        return

    # Exemple d'utilisation
    print("\nExemple d'utilisation:")
    print('  python suno_api_generator.py')
    print('\nPuis dans le code, appelez:')
    print('  process_book("FR", "01_GEN", SUNO_API_KEY, start_chapter=1)')

    # Mode interactif
    print("\n" + "="*70)
    print("  MODE INTERACTIF")
    print("="*70)

    generator = SunoAPIGenerator(SUNO_API_KEY)
    credits = generator.check_credits()

    if not credits:
        print("[ERROR] Impossible de se connecter a l'API Suno")
        return

    print("\nQuel livre voulez-vous generer?")
    print("Exemples: FR/01_GEN, EN/40_MAT, ES/19_PSA")

    livre_input = input("\nEntrez [LANGUE]/[CODE_LIVRE] (ou ENTER pour quitter): ").strip()

    if not livre_input:
        print("Au revoir!")
        return

    try:
        lang_code, book_code = livre_input.split('/')
        start = input("Chapitre de depart (defaut=1): ").strip()
        start_chapter = int(start) if start else 1

        process_book(lang_code.upper(), book_code, SUNO_API_KEY, start_chapter=start_chapter)

    except ValueError:
        print("[ERROR] Format invalide. Utilisez: LANGUE/CODE_LIVRE")
    except Exception as e:
        print(f"[ERROR] {e}")


if __name__ == "__main__":
    main()
