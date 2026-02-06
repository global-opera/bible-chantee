#!/usr/bin/env python3
"""
Phase 3 - Vérifier si les fichiers confessions existent sur R2
"""

import urllib.request
import json
from pathlib import Path

# Configuration R2
R2_BASE_URL = "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev"

# Fichiers confessions
CONFESSIONS = {
    "FR": [
        ("01_Joie.mp3", "confessions/FR_01_Joie.mp3"),
        ("02_Gueri.mp3", "confessions/FR_02_Gueri.mp3"),
        ("03_Sante.mp3", "confessions/FR_03_Sante.mp3"),
        ("04_Vainqueur.mp3", "confessions/FR_04_Vainqueur.mp3"),
        ("05_Prospere.mp3", "confessions/FR_05_Prospere.mp3"),
        ("06_Reconnaissant.mp3", "confessions/FR_06_Reconnaissant.mp3"),
        ("07_Heureux.mp3", "confessions/FR_07_Heureux.mp3"),
        ("08_Beni.mp3", "confessions/FR_08_Beni.mp3"),
        ("09_Amen.mp3", "confessions/FR_09_Amen.mp3"),
        ("10_Shalom.mp3", "confessions/FR_10_Shalom.mp3"),
    ],
    "PT": [
        ("01_Alegria.mp3", "confessions/PT_01_Alegria.mp3"),
        ("02_Curado.mp3", "confessions/PT_02_Curado.mp3"),
        ("03_Saude.mp3", "confessions/PT_03_Saude.mp3"),
        ("04_Vencedor.mp3", "confessions/PT_04_Vencedor.mp3"),
        ("05_Prospero.mp3", "confessions/PT_05_Prospero.mp3"),
        ("06_Grato.mp3", "confessions/PT_06_Grato.mp3"),
        ("07_Feliz.mp3", "confessions/PT_07_Feliz.mp3"),
        ("08_Abencoado.mp3", "confessions/PT_08_Abencoado.mp3"),
        ("09_Amem.mp3", "confessions/PT_09_Amem.mp3"),
        ("10_Shalom.mp3", "confessions/PT_10_Shalom.mp3"),
    ],
    "TL": [
        ("01_Kagalakan.mp3", "confessions/TL_01_Kagalakan.mp3"),
        ("02_Kagalingan.mp3", "confessions/TL_02_Kagalingan.mp3"),
        ("03_Kalusugan.mp3", "confessions/TL_03_Kalusugan.mp3"),
        ("04_Tagumpay.mp3", "confessions/TL_04_Tagumpay.mp3"),
        ("05_Kasaganaan.mp3", "confessions/TL_05_Kasaganaan.mp3"),
        ("06_Pasasalamat.mp3", "confessions/TL_06_Pasasalamat.mp3"),
        ("07_Kaligayahan.mp3", "confessions/TL_07_Kaligayahan.mp3"),
        ("08_Pagpapala.mp3", "confessions/TL_08_Pagpapala.mp3"),
        ("09_Amen.mp3", "confessions/TL_09_Amen.mp3"),
        ("10_Shalom.mp3", "confessions/TL_10_Shalom.mp3"),
    ],
}

def check_url_exists(url):
    """Vérifier si une URL existe avec HEAD request"""
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.status == 200
    except Exception as e:
        return False

def check_all_confessions():
    """Vérifier tous les fichiers confessions sur R2"""

    results = {
        "checked": 0,
        "exists": 0,
        "missing": 0,
        "files": []
    }

    print("=" * 80)
    print("VERIFICATION CONFESSIONS SUR R2")
    print("=" * 80)
    print()

    for lang, files in CONFESSIONS.items():
        print(f"[{lang}]")
        for original_name, r2_path in files:
            r2_url = f"{R2_BASE_URL}/{r2_path}"
            exists = check_url_exists(r2_url)

            results["checked"] += 1
            if exists:
                results["exists"] += 1
                print(f"  [OK] {original_name}")
            else:
                results["missing"] += 1
                print(f"  [MISSING] {original_name}")

            results["files"].append({
                "lang": lang,
                "original_name": original_name,
                "r2_path": r2_path,
                "r2_url": r2_url,
                "exists": exists
            })

        print()

    print("=" * 80)
    print("RESUME")
    print("=" * 80)
    print(f"Total verifie: {results['checked']}")
    print(f"Existants sur R2: {results['exists']}")
    print(f"Manquants sur R2: {results['missing']}")
    print()

    if results['missing'] > 0:
        print("[WARN] Certains fichiers sont manquants sur R2")
        print("       Il faudra les uploader avant de migrer les URLs")
    else:
        print("[OK] Tous les fichiers existent sur R2")
        print("     On peut proceder a la migration des URLs")

    return results

def save_report(results, output_file):
    """Sauvegarder le rapport en JSON"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print()
    print(f"[OK] Rapport sauvegarde: {output_file}")

if __name__ == "__main__":
    results = check_all_confessions()

    # Sauvegarder le rapport
    output_file = Path(r"C:\ScriptBible\bible-chantee\PHASE3_R2_COVERAGE.json")
    save_report(results, output_file)
