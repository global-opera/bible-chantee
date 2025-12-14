"""Vérifie que les CDN URLs sont sauvegardées correctement"""
import json
from pathlib import Path
from datetime import datetime

SUNO_OUTPUT_DIR = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")

def check_recent_mp3s_have_urls():
    """Vérifie les MP3 récents (dernières 30 minutes) ont des URLs CDN"""
    print("="*70)
    print("  VERIFICATION CDN URLs - MP3s récents")
    print("="*70)

    now = datetime.now()
    recent_mp3s = []
    recent_with_urls = []
    recent_without_urls = []

    # Scanner tous les livres
    for book_dir in SUNO_OUTPUT_DIR.iterdir():
        if not book_dir.is_dir():
            continue

        # Lire le fichier cdn_urls.json
        cdn_file = book_dir / "cdn_urls.json"
        cdn_urls = {}
        if cdn_file.exists():
            try:
                with open(cdn_file, 'r', encoding='utf-8') as f:
                    cdn_urls = json.load(f)
            except:
                pass

        # Vérifier les MP3 récents
        for mp3_file in book_dir.glob("*.mp3"):
            mtime = datetime.fromtimestamp(mp3_file.stat().st_mtime)
            age_minutes = (now - mtime).total_seconds() / 60

            if age_minutes <= 30:  # Dernières 30 minutes
                recent_mp3s.append(mp3_file)

                # Extraire le numéro de chapitre
                import re
                match = re.search(r'_(\d+)\.mp3$', mp3_file.name)
                if match:
                    chapter_num = match.group(1)
                    has_url = chapter_num in cdn_urls and cdn_urls[chapter_num].startswith("https://cdn")

                    if has_url:
                        recent_with_urls.append((mp3_file.name, mtime))
                    else:
                        recent_without_urls.append((mp3_file.name, mtime))

    print(f"\nMP3s recents (30 dernieres minutes): {len(recent_mp3s)}")
    print(f"  [OK] Avec URL CDN: {len(recent_with_urls)}")
    print(f"  [ERREUR] SANS URL CDN: {len(recent_without_urls)}")

    if recent_with_urls:
        print("\n[OK] SUCCES - Exemples avec URL:")
        for name, mtime in recent_with_urls[:5]:
            print(f"   {name} (cree a {mtime.strftime('%H:%M:%S')})")

    if recent_without_urls:
        print("\n[ERREUR] PROBLEME - Exemples SANS URL:")
        for name, mtime in recent_without_urls[:5]:
            print(f"   {name} (cree a {mtime.strftime('%H:%M:%S')})")

    # Verdict
    if len(recent_mp3s) > 0:
        success_rate = len(recent_with_urls) / len(recent_mp3s) * 100
        print(f"\n[STATS] Taux de reussite: {success_rate:.1f}%")

        if success_rate == 100:
            print("[OK] PARFAIT - Toutes les URLs sont sauvegardees!")
            return True
        elif success_rate > 0:
            print("[WARNING] PARTIEL - Certaines URLs manquent encore")
            return False
        else:
            print("[ERREUR] ECHEC - Aucune URL sauvegardee")
            return False
    else:
        print("\n[ATTENTE] Aucun MP3 recent (attendre generation)")
        return None

if __name__ == "__main__":
    check_recent_mp3s_have_urls()
