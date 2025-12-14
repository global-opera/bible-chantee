"""Vérification rapide du statut de génération"""
import json
from pathlib import Path
from datetime import datetime
import os

def count_mp3_files():
    """Compte tous les MP3 générés"""
    base_dir = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")
    if not base_dir.exists():
        return 0, []

    all_mp3s = list(base_dir.glob("*/*.mp3"))

    # Fichiers récents (dernière heure)
    one_hour_ago = datetime.now().timestamp() - 3600
    recent_files = []

    for mp3 in all_mp3s:
        mtime = os.path.getmtime(mp3)
        if mtime > one_hour_ago:
            recent_files.append((mp3.name, datetime.fromtimestamp(mtime)))

    return len(all_mp3s), recent_files

def check_cdn_urls():
    """Vérifie les URLs CDN sauvegardées"""
    base_dir = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")
    cdn_count = 0

    for book_dir in base_dir.glob("*"):
        if not book_dir.is_dir():
            continue
        cdn_file = book_dir / "cdn_urls.json"
        if cdn_file.exists():
            try:
                with open(cdn_file, 'r', encoding='utf-8') as f:
                    urls = json.load(f)
                    cdn_count += len(urls)
            except:
                pass

    return cdn_count

def main():
    print("="*80)
    print("  STATUT GÉNÉRATION - BIBLE CHANTÉE")
    print("  " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print("="*80)

    # Compter MP3
    total_mp3, recent = count_mp3_files()
    print(f"\n[MP3] TOTAUX: {total_mp3}/1189")
    print(f"      Progression: {(total_mp3/1189*100):.1f}%")

    # Fichiers récents
    print(f"\n[RECENT] DERNIERE HEURE: {len(recent)} nouveaux fichiers")
    if recent:
        print("\n   Derniers fichiers crees:")
        for name, mtime in sorted(recent, key=lambda x: x[1], reverse=True)[:5]:
            print(f"   - {name} ({mtime.strftime('%H:%M:%S')})")
    else:
        print("   [ALERTE] AUCUN fichier cree dans la derniere heure!")
        print("   [ALERTE] La generation semble BLOQUEE!")

    # URLs CDN
    cdn_count = check_cdn_urls()
    print(f"\n[CDN] URLs sauvegardees: {cdn_count}")

    # Processus Python actifs
    print("\n[PROCESS] VERIFICATION...")
    import subprocess
    try:
        result = subprocess.run(
            ['tasklist', '/FI', 'IMAGENAME eq python.exe', '/FO', 'CSV'],
            capture_output=True,
            text=True
        )
        python_processes = result.stdout.count('python.exe')
        print(f"   Processus Python actifs: {python_processes}")
    except:
        print("   (Impossible de verifier)")

    # Résumé
    print("\n" + "="*80)
    if len(recent) == 0:
        print("  [ALERTE] Generation STOPPEE ou BLOQUEE")
        print("  [ACTIONS] Suggestions:")
        print("     1. Verifier la fenetre CMD de generation")
        print("     2. Verifier les credits Suno restants")
        print("     3. Verifier les erreurs API")
    else:
        print("  [OK] Generation EN COURS")
        print(f"  [INFO] {len(recent)} fichiers crees dans la derniere heure")
    print("="*80)

if __name__ == "__main__":
    main()
