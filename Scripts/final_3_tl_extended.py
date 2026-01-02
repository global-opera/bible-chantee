"""Génération finale des 3 chapitres TL avec timeout étendu (300s)"""
import sys
import os
import io
import requests
import time
import json
from pathlib import Path

# Configurer UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Clé API
SUNO_API_KEY = os.environ.get('SUNO_API_KEY', 'baa2f6a4d4244bd9a4b5c0c755db5dab')
SUNO_BASE_URL = "https://api.sunoapi.org/api/v1"

# 3 chapitres problématiques
FINAL_CHAPTERS = [
    ("23_ISA", 21),
    ("24_JER", 45),
    ("43_JOH", 8)
]

class SunoAPIExtended:
    def __init__(self, api_key):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def get_credits(self):
        """Récupère le solde de crédits"""
        response = requests.get(f"{SUNO_BASE_URL}/credits", headers=self.headers)
        if response.status_code == 200:
            data = response.json()
            return data.get("data", {}).get("balance", 0)
        return None

    def generate_song(self, lyrics, style, title, model="V4_5ALL"):
        """Génère une chanson"""
        payload = {
            "customMode": True,
            "prompt": lyrics,
            "style": style,
            "title": title,
            "instrumental": False,
            "model": model,
            "callBackUrl": "https://webhook.site/unique-endpoint",
            "styleWeight": 0.65,
            "weirdnessConstraint": 0.65,
            "audioWeight": 0.65
        }

        response = requests.post(
            f"{SUNO_BASE_URL}/generate",
            headers=self.headers,
            json=payload
        )

        if response.status_code == 200:
            result = response.json()
            if result.get("code") == 200 and "data" in result:
                task_id = result["data"].get("taskId")
                return task_id
            else:
                raise Exception(f"Generation failed: {result}")
        else:
            raise Exception(f"Erreur API: {response.status_code} - {response.text}")

    def wait_for_completion(self, task_id, max_wait=300, check_interval=10):
        """Attend la complétion avec timeout étendu à 300s (5 min)"""
        print(f"[WAIT] Attente de la generation (max {max_wait}s)...")
        elapsed = 0

        while elapsed < max_wait:
            response = requests.get(
                f"{SUNO_BASE_URL}/generate/record-info",
                headers=self.headers,
                params={"taskIds": task_id}
            )

            if response.status_code != 200:
                print(f"[{elapsed}s] Erreur requete: {response.status_code}")
                time.sleep(check_interval)
                elapsed += check_interval
                continue

            data = response.json()
            status = data.get("data", {}).get("status", "UNKNOWN")
            print(f"[{elapsed}s] Status: {status}")

            if status in ["SUCCESS", "FIRST_SUCCESS"]:
                print(f"[OK] Generation terminee! (status: {status})")
                return data["data"]
            elif status == "FAILED":
                raise Exception(f"Generation failed: {data}")

            time.sleep(check_interval)
            elapsed += check_interval

        print(f"[TIMEOUT] Temps maximum atteint ({max_wait}s)")
        return None

    def download_audio(self, audio_url, output_path):
        """Télécharge le fichier audio"""
        print(f"[DOWNLOAD] Telechargement vers {output_path}")
        response = requests.get(audio_url, stream=True)

        if response.status_code != 200:
            raise Exception(f"Download failed: {response.status_code}")

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        print(f"[OK] Telechargement termine")
        return output_path

def generate_chapter(generator, book_code, chapter_num, lang_code="TL"):
    """Génère un chapitre spécifique"""
    # Chemin des lyrics (capital L!)
    project_root = Path(__file__).parent.parent
    lyrics_dir = project_root / f"Lyrics/{lang_code}/{book_code}"

    # Trouver le fichier (format: BOOK_CHAPTER_LANG.txt)
    lyrics_file = lyrics_dir / f"{book_code}_{chapter_num:02d}_{lang_code}.txt"

    if not lyrics_file.exists():
        raise Exception(f"Lyrics non trouvés: {lyrics_file}")

    # Lire les lyrics
    with open(lyrics_file, 'r', encoding='utf-8') as f:
        lyrics = f.read().strip()

    # Générer
    title = f"{book_code}_{chapter_num:02d}_{lang_code}"
    style = "French worship, 72 BPM"

    print(f"\nTitre: {title}")
    print(f"Style: {style}")
    print(f"[API] Generation: {title}")
    print(f"[API] Style: {style}")
    print(f"[API] Model: V4_5ALL")
    print(f"[API] Parametres avances: ['styleWeight', 'weirdnessConstraint', 'audioWeight']")

    task_id = generator.generate_song(lyrics, style, title)
    print(f"[OK] Task created: {task_id}")

    # Attendre avec timeout étendu (300s au lieu de 180s)
    result = generator.wait_for_completion(task_id, max_wait=300)

    if not result:
        return None

    # Télécharger
    audio_url = result.get("audio_url")
    if not audio_url:
        raise Exception("No audio URL in result")

    output_dir = project_root.parent / f"Suno_Output/{lang_code}/{book_code}"
    output_file = output_dir / f"{book_code}_{chapter_num:02d}.mp3"

    generator.download_audio(audio_url, output_file)
    return output_file

def main():
    print("="*80)
    print("  GENERATION FINALE - 3 CHAPITRES TL (TIMEOUT ETENDU 300s)")
    print("="*80)
    print(f"\nChapitres à générer: {len(FINAL_CHAPTERS)}")
    print(f"Timeout par chapitre: 300s (5 minutes)")
    print(f"Estimation temps: ~{len(FINAL_CHAPTERS) * 5 / 60:.1f} heures")
    print(f"Coût estimé: ~{len(FINAL_CHAPTERS) * 12} crédits Suno\n")

    generator = SunoAPIExtended(SUNO_API_KEY)

    # Vérifier crédits
    credits = generator.get_credits()
    if credits:
        print(f"[CREDITS] {credits}\n")

    generated_count = 0
    failed_count = 0

    for i, (book_code, chapter_num) in enumerate(FINAL_CHAPTERS, 1):
        print(f"\n{'='*80}")
        print(f"[{i}/{len(FINAL_CHAPTERS)}] {book_code} chapitre {chapter_num}")
        print(f"{'='*80}")

        # Vérifier si existe déjà
        project_root = Path(__file__).parent.parent
        output_dir = project_root.parent / f"Suno_Output/TL/{book_code}"
        output_file = output_dir / f"{book_code}_{chapter_num:02d}.mp3"

        if output_file.exists():
            print(f"✅ SKIP - {book_code}_{chapter_num:02d}.mp3 existe déjà")
            generated_count += 1
            continue

        print(f"🚀 GENERATION FINALE - {book_code} chapitre {chapter_num}...")
        print(f"⏱️ Timeout étendu: 300s (au lieu de 180s)")

        try:
            result = generate_chapter(generator, book_code, chapter_num)

            if result and result.exists():
                generated_count += 1
                print(f"\n✅ {book_code}_{chapter_num:02d}.mp3 GENERE")
            else:
                failed_count += 1
                print(f"\n⚠️ {book_code}_{chapter_num:02d}.mp3 ECHEC")

        except KeyboardInterrupt:
            print(f"\n\n⏸️ INTERRUPTION - Chapitre {book_code}_{chapter_num}")
            print(f"Progression: {generated_count}/{len(FINAL_CHAPTERS)} générés")
            print(f"Échecs: {failed_count}")
            sys.exit(0)
        except Exception as e:
            print(f"\n❌ ERREUR {book_code}_{chapter_num}: {e}")
            failed_count += 1
            continue

    # Statistiques finales
    print("\n" + "="*80)
    print("  🎉 GENERATION FINALE TERMINEE!")
    print("="*80)
    print(f"Chapitres générés: {generated_count}/{len(FINAL_CHAPTERS)}")
    print(f"Échecs: {failed_count}")
    print(f"Taux succès: {(generated_count/len(FINAL_CHAPTERS)*100):.1f}%")

    total_tl = 1186 + generated_count
    print(f"\n📊 Total TL: {total_tl}/1189 chapitres ({total_tl/1189*100:.1f}%)")

    if total_tl == 1189:
        print("\n🎊 TL est maintenant à 100% (1189/1189 chapitres)!")
    else:
        remaining = 1189 - total_tl
        print(f"\n⚠️ Il reste {remaining} chapitre(s) à générer")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏹️ Arrêt manuel")
        sys.exit(0)
