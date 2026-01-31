#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur de prières musicales via l'API Suno
Génère les MP3 manquants pour PT et TL
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
    print("[ERROR] api_key.py non trouvé. Créez ce fichier avec: SUNO_API_KEY = 'votre_clé'")

# Configure UTF-8 encoding for Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Configuration
SUNO_BASE_URL = "https://api.sunoapi.org/api/v1"

# Styles musicaux par langue
PRAYER_STYLES = {
    "FR": "French worship prayer, contemplative, acoustic, 72-80 BPM, emotional, devotional, peaceful",
    "EN": "English worship prayer, contemplative, acoustic, 72-80 BPM, emotional, devotional, peaceful",
    "PT": "Portuguese worship prayer, contemplative, acoustic, 72-80 BPM, emotional, devotional, peaceful",
    "ES": "Spanish worship prayer, contemplative, acoustic, 72-80 BPM, emotional, devotional, peaceful",
    "DE": "German worship prayer, contemplative, acoustic, 72-80 BPM, emotional, devotional, peaceful",
    "IT": "Italian worship prayer, contemplative, acoustic, 72-80 BPM, emotional, devotional, peaceful",
    "TL": "Tagalog worship prayer, contemplative, acoustic, 72-80 BPM, emotional, devotional, peaceful"
}

# Mapping des prières par langue avec leurs fichiers lyrics
PRAYER_MAPPING = {
    "PT": [
        {"num": 1, "filename": "PT_Pai Nosso", "title": "Pai Nosso"},
        {"num": 2, "filename": "PT_Gratidão", "title": "Gratidão"},
        {"num": 3, "filename": "PT_Oração de Libertação", "title": "Oração de Libertação"},
        {"num": 4, "filename": "PT_Primeiro Eu Te Busco", "title": "Primeiro Eu Te Busco"},
        {"num": 5, "filename": "PT_Tu És a Minha Proteção", "title": "Tu És a Minha Proteção"}
    ],
    "TL": [
        {"num": 1, "filename": "TL_Ama Namin", "title": "Ama Namin"},
        {"num": 2, "filename": "TL_Pasasalamat", "title": "Pasasalamat"},
        {"num": 3, "filename": "TL_Panalangin ng Paglaya", "title": "Panalangin ng Paglaya"},
        {"num": 4, "filename": "TL_Una Kitang Hinahanap", "title": "Una Kitang Hinahanap"},
        {"num": 5, "filename": "TL_Binubuksan Mo Ang Pinto", "title": "Binubuksan Mo Ang Pinto"},
        {"num": 6, "filename": "TL_Ikaw ang Aking Proteksiyon", "title": "Ikaw ang Aking Proteksiyon"}
    ]
}


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
                    print(f"[OK] Génération terminée!")
                    return status
                elif state in ["failed", "FAILED", "ERROR"]:
                    print(f"[ERROR] Génération échouée")
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

            file_size = Path(output_path).stat().st_size / (1024 * 1024)
            print(f"[OK] Téléchargé - {file_size:.2f} MB")
            return True
        else:
            print(f"[ERROR] Téléchargement échoué: {response.status_code}")
            return False

    def extract_audio_url(self, status_data):
        """Extrait l'URL audio depuis la réponse"""
        if not status_data:
            return None

        if 'response' in status_data and 'sunoData' in status_data['response']:
            suno_data = status_data['response']['sunoData']
            for song in suno_data:
                url = song.get('audioUrl') or song.get('sourceAudioUrl')
                if url:
                    return url
        return status_data.get('audioUrl')

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


def generate_prayers(api_key, languages=None, skip_existing=True):
    """
    Génère les prières manquantes pour PT et TL

    Args:
        api_key: Clé API Suno
        languages: Liste des langues à traiter (None = PT et TL)
        skip_existing: Si True, saute les MP3 existants
    """
    generator = SunoAPIGenerator(api_key)

    # Vérifier les crédits
    generator.check_credits()

    # Langues à traiter
    if not languages:
        languages = ["PT", "TL"]

    # Chemins
    lyrics_base = Path("C:/ScriptBible/bible-chantee/lyrics/prayers")
    output_base = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/prayers")
    output_base.mkdir(parents=True, exist_ok=True)

    # Statistiques
    total_generated = 0
    total_skipped = 0
    total_errors = 0

    print(f"\n{'='*80}")
    print(f"  GÉNÉRATION PRIÈRES SUNO API")
    print(f"{'='*80}")
    print(f"Langues: {', '.join(languages)}")
    print(f"Lyrics: {lyrics_base}")
    print(f"Output: {output_base}")
    print(f"{'='*80}\n")

    # Traiter chaque langue
    for lang in languages:
        if lang not in PRAYER_MAPPING:
            print(f"[SKIP] Langue {lang} non supportée")
            continue

        prayers = PRAYER_MAPPING[lang]

        print(f"\n{'='*80}")
        print(f"  LANGUE: {lang} ({len(prayers)} prières)")
        print(f"{'='*80}")

        # Traiter chaque prière
        for prayer in prayers:
            filename = prayer["filename"]
            title = prayer["title"]
            lyrics_file = lyrics_base / f"{filename}.md"
            output_file = output_base / f"{filename}.mp3"

            print(f"\n--- Prière {prayer['num']}: {title} ---")

            # Vérifier si le MP3 existe déjà
            if skip_existing and output_file.exists():
                file_size = output_file.stat().st_size / (1024 * 1024)
                print(f"[SKIP] MP3 existant ({file_size:.2f} MB)")
                total_skipped += 1
                continue

            # Vérifier si le fichier lyrics existe
            if not lyrics_file.exists():
                print(f"[ERROR] Lyrics introuvable: {lyrics_file}")
                total_errors += 1
                continue

            # Lire les lyrics
            try:
                lyrics_content = lyrics_file.read_text(encoding='utf-8')
                print(f"Lyrics: {len(lyrics_content)} caractères")

                # Générer avec l'API Suno
                result = generator.generate_song(
                    lyrics=lyrics_content,
                    style=PRAYER_STYLES[lang],
                    title=title,
                    model="V5",
                    styleWeight=0.70,
                    weirdnessConstraint=0.55,  # Moins de variation pour prières
                    audioWeight=0.65
                )

                if not result:
                    print("[ERROR] Génération échouée")
                    total_errors += 1
                    continue

                task_id = result.get('taskId')
                if not task_id:
                    print("[ERROR] Pas de task_id")
                    total_errors += 1
                    continue

                # Attendre la complétion
                completed = generator.wait_for_completion(task_id, max_wait=300)

                if completed:
                    audio_url = generator.extract_audio_url(completed)

                    if audio_url:
                        generator.download_song(audio_url, output_file)
                        total_generated += 1
                        print(f"[OK] Prière {prayer['num']} terminée")
                    else:
                        print("[ERROR] Pas d'URL audio")
                        total_errors += 1
                else:
                    print("[ERROR] Timeout ou échec")
                    total_errors += 1

            except Exception as e:
                print(f"[ERROR] Exception: {e}")
                total_errors += 1
                continue

            # Pause entre générations
            time.sleep(2)

    # Rapport final
    print(f"\n{'='*80}")
    print(f"  GÉNÉRATION TERMINÉE!")
    print(f"{'='*80}")
    print(f"Prières générées: {total_generated}")
    print(f"Prières sautées: {total_skipped}")
    print(f"Erreurs: {total_errors}")
    print(f"Total: {total_generated + total_skipped + total_errors}")
    print(f"{'='*80}\n")

    return total_generated, total_errors


def main():
    """Point d'entrée principal"""
    import argparse

    parser = argparse.ArgumentParser(description='Générateur de prières Suno API')
    parser.add_argument('--auto', action='store_true', help='Mode automatique')
    parser.add_argument('--lang', type=str, default=None, help='Langue spécifique (PT ou TL)')
    parser.add_argument('--force', action='store_true', help='Régénérer même si MP3 existe')
    args = parser.parse_args()

    print("=" * 80)
    print("  SUNO PRAYERS GENERATOR")
    print("=" * 80)

    if not SUNO_API_KEY:
        print("\n[ERROR] SUNO_API_KEY non définie")
        print("\nCréez le fichier api_key.py avec:")
        print('SUNO_API_KEY = "votre_clé_api"')
        print("\nOu définissez la variable d'environnement SUNO_API_KEY")
        return 1

    # Langues à générer
    if args.lang:
        if args.lang.upper() not in ["PT", "TL"]:
            print(f"[ERROR] Langue {args.lang} non supportée. Utilisez PT ou TL")
            return 1
        languages = [args.lang.upper()]
    else:
        languages = None  # PT et TL par défaut

    print(f"\nGénération des prières manquantes")
    print(f"Langues: {', '.join(languages) if languages else 'PT, TL'}")
    print(f"Skip existants: {not args.force}")

    if not args.auto:
        response = input("\nCommencer la génération? (o/n): ").strip().lower()
        if response != 'o':
            print("Génération annulée.")
            return 0

    # Lancer la génération
    try:
        generated, errors = generate_prayers(
            SUNO_API_KEY,
            languages=languages,
            skip_existing=not args.force
        )

        if errors > 0:
            print(f"\n⚠️  {errors} erreur(s) rencontrée(s)")
            return 1
        else:
            print(f"\n✅ Succès! {generated} prière(s) générée(s)")
            return 0

    except KeyboardInterrupt:
        print("\n\n[INTERROMPU] Génération interrompue")
        return 1
    except Exception as e:
        print(f"\n[ERROR] Exception: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
