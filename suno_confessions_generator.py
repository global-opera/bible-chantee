#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur de confessions musicales via l'API Suno
Génère 120 MP3 (12 langues × 10 confessions)
"""

import requests
import time
import json
import sys
import io
from pathlib import Path

# Import the API key
try:
    from api_key import SUNO_API_KEY
except ImportError:
    SUNO_API_KEY = None

# Configure UTF-8 encoding for Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Configuration
SUNO_BASE_URL = "https://api.sunoapi.org/api/v1"

# Styles musicaux par langue
CONFESSION_STYLES = {
    "FR": "French worship, contemplative, acoustic, 72 BPM, emotional, devotional",
    "EN": "English worship, contemplative, acoustic, 72 BPM, emotional, devotional",
    "PT": "Portuguese worship, contemplative, acoustic, 72 BPM, emotional, devotional",
    "ES": "Spanish worship, contemplative, acoustic, 72 BPM, emotional, devotional",
    "DE": "German worship, contemplative, acoustic, 72 BPM, emotional, devotional",
    "IT": "Italian worship, contemplative, acoustic, 72 BPM, emotional, devotional",
    "AR": "Arabic worship, Middle Eastern, acoustic, 72 BPM, emotional, devotional",
    "RU": "Russian worship, contemplative, acoustic, 72 BPM, emotional, devotional",
    "ZH": "Chinese worship, contemplative, acoustic, 72 BPM, emotional, devotional",
    "HI": "Hindi worship, contemplative, acoustic, 72 BPM, emotional, devotional",
    "TL": "Tagalog worship, contemplative, acoustic, 72 BPM, emotional, devotional",
    "SW": "Swahili worship, African, acoustic, 72 BPM, emotional, devotional"
}

# Durée approximative par confession (2-3 minutes)
CONFESSION_TARGET_DURATION = "2-3 minutes"


class SunoAPIGenerator:
    """Classe pour gérer l'API Suno"""

    def __init__(self, api_key):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def generate_song(self, lyrics, style, title, model="V5", **kwargs):
        """Génère une chanson avec l'API Suno"""
        payload = {
            "customMode": True,
            "prompt": lyrics,
            "style": style,
            "title": title,
            "instrumental": kwargs.get("instrumental", False),
            "model": model,
            "callBackUrl": kwargs.get("callBackUrl", "https://webhook.site/unique-endpoint")
        }

        # Ajouter les paramètres optionnels
        for key in ["vocalGender", "styleWeight", "weirdnessConstraint", "audioWeight", "negativeTags", "personaId"]:
            if key in kwargs:
                payload[key] = kwargs[key]

        print(f"[API] Génération: {title}")
        print(f"[API] Style: {style}")
        print(f"[API] Model: {model}")

        # Validation des limites
        self._validate_lengths(lyrics, style, title, model)

        response = requests.post(
            f"{SUNO_BASE_URL}/generate",
            headers=self.headers,
            json=payload
        )

        if response.status_code == 200:
            result = response.json()
            if result.get("code") == 200 and "data" in result:
                task_id = result["data"].get("taskId")
                print(f"[OK] Task créée: {task_id}")
                return result["data"]
            else:
                print(f"[ERROR] Réponse inattendue: {result}")
                return None
        else:
            print(f"[ERROR] {response.status_code}: {response.text}")
            return None

    def _validate_lengths(self, lyrics, style, title, model):
        """Valide les limites de caractères"""
        max_prompt = 3000 if model == "chirp-v5" else 5000
        max_style = 200 if model == "chirp-v5" else 1000
        max_title = 80 if model == "chirp-v5" else 100

        if len(lyrics) > max_prompt:
            print(f"[WARNING] Lyrics trop longues ({len(lyrics)}/{max_prompt})")
        if len(style) > max_style:
            print(f"[WARNING] Style trop long ({len(style)}/{max_style})")
        if len(title) > max_title:
            print(f"[WARNING] Title trop long ({len(title)}/{max_title})")

        return lyrics, style, title

    def check_status(self, task_id):
        """Vérifie le statut d'une génération"""
        response = requests.get(
            f"{SUNO_BASE_URL}/generate/record-info",
            headers=self.headers,
            params={"taskId": task_id}
        )

        if response.status_code == 200:
            result = response.json()
            if result.get("code") == 200 and "data" in result:
                return result["data"]
        return None

    def wait_for_completion(self, task_id, max_wait=300, check_interval=10):
        """Attend que la génération soit terminée"""
        elapsed = 0
        print(f"[WAIT] Attente de la génération (max {max_wait}s)...")

        while elapsed < max_wait:
            status = self.check_status(task_id)

            if status:
                state = status.get("status", "unknown")
                print(f"[{elapsed}s] Status: {state}")

                if state in ["completed", "COMPLETE", "SUCCESS", "FIRST_SUCCESS", "BOTH_SUCCESS"]:
                    print(f"[OK] Génération terminée! (status: {state})")
                    return status
                elif state in ["failed", "FAILED", "ERROR"]:
                    print(f"[ERROR] Génération échouée (status: {state})")
                    return None

            time.sleep(check_interval)
            elapsed += check_interval

        print("[TIMEOUT] Temps maximum atteint")
        return None

    def download_song(self, audio_url, output_path):
        """Télécharge le fichier audio généré"""
        print(f"[DOWNLOAD] Téléchargement vers {output_path}")

        response = requests.get(audio_url, stream=True)

        if response.status_code == 200:
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            file_size = Path(output_path).stat().st_size
            file_size_mb = file_size / (1024 * 1024)
            print(f"[OK] Téléchargement terminé - {file_size_mb:.2f} MB")
            return True
        else:
            print(f"[ERROR] Téléchargement échoué: {response.status_code}")
            return False

    def extract_all_audio_urls(self, status_data):
        """Extrait toutes les URLs audio"""
        if not status_data:
            return []

        urls = []
        if 'response' in status_data and 'sunoData' in status_data['response']:
            suno_data = status_data['response']['sunoData']
            for song in suno_data:
                url = song.get('audioUrl') or song.get('sourceAudioUrl')
                if url:
                    urls.append(url)
        return urls

    def save_cdn_url(self, confession_num, cdn_url, output_dir):
        """Sauvegarde l'URL CDN dans un fichier JSON"""
        json_file = Path(output_dir) / "cdn_urls.json"

        if json_file.exists():
            with open(json_file, 'r', encoding='utf-8') as f:
                urls_data = json.load(f)
        else:
            urls_data = {}

        urls_data[str(confession_num)] = cdn_url

        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(urls_data, f, indent=2, ensure_ascii=False)

        print(f"[SAVE] CDN URL sauvegardée dans {json_file}")

    def check_credits(self):
        """Vérifie les crédits restants"""
        try:
            response = requests.get(
                f"{SUNO_BASE_URL}/generate/credit",
                headers=self.headers,
                timeout=10
            )
            if response.status_code == 200:
                result = response.json()
                if result.get("code") == 200 and "data" in result:
                    credits = result["data"]
                    print(f"[CREDITS] {credits}")
                    return credits
        except Exception as e:
            print(f"[WARNING] Erreur vérification crédits: {e}")
        return None


def generate_all_confessions(api_key, languages=None, start_lang=None, start_conf=1):
    """
    Génère toutes les confessions pour toutes les langues

    Args:
        api_key: Clé API Suno
        languages: Liste des langues à traiter (None = toutes)
        start_lang: Langue de départ (None = première langue)
        start_conf: Numéro de confession de départ (1-10)
    """
    generator = SunoAPIGenerator(api_key)

    # Vérifier les crédits
    generator.check_credits()

    # Langues à traiter
    if not languages:
        languages = ["FR", "EN", "PT", "ES", "DE", "IT", "AR", "RU", "ZH", "HI", "TL", "SW"]

    # Trouver l'index de la langue de départ
    start_index = 0
    if start_lang and start_lang in languages:
        start_index = languages.index(start_lang)
        languages = languages[start_index:]

    # Dossier de base pour les lyrics et output
    base_lyrics_dir = Path("C:/ScriptBible/bible-chantee/lyrics/confessions")
    base_output_dir = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/confessions")

    # Statistiques
    total_to_generate = sum(len(list((base_lyrics_dir / lang).glob("*.txt"))) for lang in languages if (base_lyrics_dir / lang).exists())
    total_generated = 0
    total_skipped = 0
    total_errors = 0

    print(f"\n{'='*80}")
    print(f"  GÉNÉRATION CONFESSIONS SUNO API")
    print(f"{'='*80}")
    print(f"Langues: {', '.join(languages)}")
    print(f"Total confessions à traiter: {total_to_generate}")
    print(f"Démarrage: Langue={start_lang or languages[0]}, Confession={start_conf}")
    print(f"{'='*80}\n")

    # Traiter chaque langue
    for lang_idx, lang in enumerate(languages, 1):
        lang_dir = base_lyrics_dir / lang
        output_dir = base_output_dir / lang
        output_dir.mkdir(parents=True, exist_ok=True)

        if not lang_dir.exists():
            print(f"[SKIP] Dossier inexistant: {lang_dir}")
            continue

        # Récupérer tous les fichiers lyrics
        lyrics_files = sorted(lang_dir.glob("*.txt"))

        if not lyrics_files:
            print(f"[SKIP] Aucun fichier dans: {lang_dir}")
            continue

        print(f"\n{'='*80}")
        print(f"  [{lang_idx}/{len(languages)}] LANGUE: {lang}")
        print(f"{'='*80}")
        print(f"Style: {CONFESSION_STYLES[lang]}")
        print(f"Confessions trouvées: {len(lyrics_files)}")
        print(f"Dossier sortie: {output_dir}")
        print(f"{'='*80}\n")

        # Traiter chaque confession
        for conf_idx, lyrics_file in enumerate(lyrics_files, 1):
            # Extraire le numéro de confession depuis le nom de fichier (01_xxx.txt -> 1)
            conf_num = int(lyrics_file.stem.split('_')[0])

            # Skip si on n'a pas encore atteint la confession de départ
            if lang == (start_lang or languages[0]) and conf_num < start_conf:
                print(f"[SKIP] Confession {conf_num} (< {start_conf})")
                total_skipped += 1
                continue

            # Vérifier si le MP3 existe déjà
            output_file = output_dir / f"{conf_num:02d}_{lyrics_file.stem}.mp3"
            if output_file.exists():
                print(f"[SKIP] Confession {conf_num} - {lyrics_file.stem} (MP3 existant)")
                total_skipped += 1
                continue

            print(f"\n--- [{conf_idx}/{len(lyrics_files)}] Confession {conf_num}: {lyrics_file.stem} ---")

            # Lire les lyrics
            try:
                lyrics_content = lyrics_file.read_text(encoding='utf-8')

                # Extraire le titre depuis le nom de fichier
                title_parts = lyrics_file.stem.split('_', 1)
                title = title_parts[1] if len(title_parts) > 1 else lyrics_file.stem

                print(f"Titre: {title}")
                print(f"Lyrics: {len(lyrics_content)} caractères")

                # Générer avec l'API Suno
                result = generator.generate_song(
                    lyrics=lyrics_content,
                    style=CONFESSION_STYLES[lang],
                    title=title,
                    model="V5",
                    styleWeight=0.70,  # Légèrement plus élevé pour confessions
                    weirdnessConstraint=0.60,  # Moins de variation pour cohérence
                    audioWeight=0.65
                )

                if not result:
                    print("[ERROR] Génération échouée, passage à la suivante")
                    total_errors += 1
                    continue

                task_id = result.get('taskId')
                if not task_id:
                    print("[ERROR] Pas de task_id retourné")
                    total_errors += 1
                    continue

                # Attendre la complétion (timeout 300s = 5min)
                completed = generator.wait_for_completion(task_id, max_wait=300)

                if completed:
                    # Extraire les URLs audio
                    all_audio_urls = generator.extract_all_audio_urls(completed)

                    if all_audio_urls:
                        print(f"[OK] {len(all_audio_urls)} variation(s) générée(s)")

                        # Télécharger uniquement la première variante
                        audio_url = all_audio_urls[0]
                        generator.download_song(audio_url, output_file)

                        # Sauvegarder l'URL CDN
                        generator.save_cdn_url(conf_num, audio_url, output_dir)

                        total_generated += 1
                        print(f"[OK] Confession {conf_num} terminée ({total_generated}/{total_to_generate})")
                    else:
                        print("[ERROR] Pas d'URL audio dans la réponse")
                        total_errors += 1
                else:
                    print("[ERROR] Timeout ou échec de génération")
                    total_errors += 1

            except Exception as e:
                print(f"[ERROR] Exception: {e}")
                total_errors += 1
                continue

            # Petite pause entre les générations (2 secondes)
            time.sleep(2)

    # Rapport final
    print(f"\n{'='*80}")
    print(f"  GÉNÉRATION TERMINÉE!")
    print(f"{'='*80}")
    print(f"Confessions générées: {total_generated}")
    print(f"Confessions sautées: {total_skipped}")
    print(f"Erreurs: {total_errors}")
    print(f"Total traité: {total_generated + total_skipped + total_errors}")
    print(f"{'='*80}\n")


def main():
    """Point d'entrée principal"""
    import argparse

    parser = argparse.ArgumentParser(description='Générateur de confessions Suno API')
    parser.add_argument('--auto', action='store_true', help='Mode automatique sans confirmation')
    parser.add_argument('--start-lang', type=str, default=None, help='Langue de départ (ex: FR)')
    parser.add_argument('--start-conf', type=int, default=1, help='Confession de départ (1-10)')
    args = parser.parse_args()

    print("=" * 80)
    print("  SUNO CONFESSIONS GENERATOR")
    print("=" * 80)

    if not SUNO_API_KEY:
        print("[ERROR] SUNO_API_KEY n'est pas définie")
        print("Configurez-la dans api_key.py")
        print("\nCréez le fichier api_key.py avec:")
        print('SUNO_API_KEY = "votre_clé_api_ici"')
        return

    print("\nGénération de 120 confessions (12 langues × 10 confessions)")
    print("Durée estimée: 2-3 heures")
    print("\nLangues: FR, EN, PT, ES, DE, IT, AR, RU, ZH, HI, TL, SW")

    if not args.auto:
        response = input("\nCommencer la génération? (o/n): ").strip().lower()

        if response != 'o':
            print("Génération annulée.")
            return

        # Options avancées
        print("\n--- Options de reprise ---")
        start_lang_input = input("Langue de départ (ENTER = FR): ").strip().upper()
        start_lang = start_lang_input if start_lang_input else None

        start_conf_input = input("Confession de départ (ENTER = 1): ").strip()
        start_conf = int(start_conf_input) if start_conf_input else 1
    else:
        print("\n[MODE AUTO] Démarrage automatique...")
        start_lang = args.start_lang
        start_conf = args.start_conf

    # Lancer la génération
    try:
        generate_all_confessions(
            SUNO_API_KEY,
            start_lang=start_lang,
            start_conf=start_conf
        )
    except KeyboardInterrupt:
        print("\n\n[INTERROMPU] Génération interrompue par l'utilisateur")
        print("Vous pouvez reprendre en spécifiant la langue et le numéro de confession")
    except Exception as e:
        print(f"\n[ERROR] Exception fatale: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
