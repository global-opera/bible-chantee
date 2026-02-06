#!/usr/bin/env python3
"""
Phase 3 - Analyse complète des URLs dans tous les fichiers audio-urls-*.js
"""

import re
import json
from pathlib import Path
from collections import defaultdict

# Configuration
BASE_DIR = Path(r"C:\ScriptBible\bible-chantee")

# Fichiers à scanner
FILES_TO_SCAN = [
    "audio-urls-fr.js",
    "audio-urls-en.js",
    "audio-urls-pt.js",
    "audio-urls-es.js",
    "audio-urls-de.js",
    "audio-urls-it.js",
    "audio-urls-tl.js",
    "audio-urls-ar.js",
    "audio-urls-hi.js",
    "audio-urls-ko.js",
    "audio-urls-ru.js",
    "audio-urls-zh.js",
    "audio-urls-confessions-fr.js",
    "audio-urls-confessions-pt.js",
    "audio-urls-confessions-tl.js",
    "audio-urls-promesses-fr.js",
    "audio-urls-promessas-pt.js",
]

# Domaines à identifier
DOMAINS = {
    "r2": "pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev",
    "archive": "archive.org",
    "suno": "cdn1.suno.ai",
    "box": "dl.boxcloud.com",
}

def extract_urls_from_file(filepath):
    """Extraire toutes les URLs d'un fichier JS"""
    urls = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Trouver toutes les URLs entre guillemets
            pattern = r'https?://[^"\s]+'
            urls = re.findall(pattern, content)
    except FileNotFoundError:
        print(f"[WARN] Fichier non trouve: {filepath}")
    except Exception as e:
        print(f"[ERROR] Erreur lors de la lecture de {filepath}: {e}")
    return urls

def classify_url(url):
    """Classifier une URL par domaine"""
    for domain_key, domain_value in DOMAINS.items():
        if domain_value in url:
            return domain_key
    return "unknown"

def analyze_all_files():
    """Analyser tous les fichiers et générer un rapport"""

    results = {
        "total_files": 0,
        "total_urls": 0,
        "by_domain": defaultdict(int),
        "by_file": {},
        "detailed_urls": []
    }

    print("=" * 80)
    print("PHASE 3 - ANALYSE DES URLs")
    print("=" * 80)
    print()

    for filename in FILES_TO_SCAN:
        filepath = BASE_DIR / filename

        if not filepath.exists():
            print(f"[SKIP] Ignore (n'existe pas): {filename}")
            continue

        results["total_files"] += 1

        # Extraire les URLs
        urls = extract_urls_from_file(filepath)

        # Classifier par domaine
        file_stats = defaultdict(int)
        for url in urls:
            domain = classify_url(url)
            file_stats[domain] += 1
            results["by_domain"][domain] += 1
            results["total_urls"] += 1

            # Stocker les détails
            results["detailed_urls"].append({
                "file": filename,
                "url": url,
                "domain": domain
            })

        results["by_file"][filename] = dict(file_stats)

        # Afficher le résumé du fichier
        total_in_file = sum(file_stats.values())
        print(f"[FILE] {filename}: {total_in_file} URLs")
        for domain, count in file_stats.items():
            print(f"   - {domain}: {count}")

    print()
    print("=" * 80)
    print("RÉSUMÉ GLOBAL")
    print("=" * 80)
    print(f"Fichiers scannés: {results['total_files']}")
    print(f"URLs totales: {results['total_urls']}")
    print()
    print("Par domaine:")
    for domain, count in sorted(results["by_domain"].items(), key=lambda x: -x[1]):
        percentage = (count / results['total_urls'] * 100) if results['total_urls'] > 0 else 0
        print(f"  {domain:12s}: {count:5d} ({percentage:5.1f}%)")

    return results

def save_json_report(results, output_file):
    """Sauvegarder le rapport en JSON"""
    # Convertir defaultdict en dict normal
    clean_results = {
        "total_files": results["total_files"],
        "total_urls": results["total_urls"],
        "by_domain": dict(results["by_domain"]),
        "by_file": results["by_file"],
        "detailed_urls": results["detailed_urls"]
    }

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(clean_results, f, indent=2, ensure_ascii=False)

    print()
    print(f"[OK] Rapport JSON sauvegarde: {output_file}")

def generate_markdown_report(results, output_file):
    """Générer un rapport Markdown"""

    md_lines = [
        "# Analyse URLs - Phase 3",
        "",
        f"Date: 2026-02-01",
        "",
        "## Résumé Global",
        "",
        f"- Fichiers scannés: {results['total_files']}",
        f"- URLs totales: {results['total_urls']}",
        "",
        "## Par Domaine",
        "",
        "| Domaine | URLs | % |",
        "|---------|------|---|",
    ]

    for domain, count in sorted(results["by_domain"].items(), key=lambda x: -x[1]):
        percentage = (count / results['total_urls'] * 100) if results['total_urls'] > 0 else 0
        md_lines.append(f"| {domain} | {count:,} | {percentage:.1f}% |")

    md_lines.extend([
        "",
        "## Par Fichier",
        "",
        "| Fichier | R2 | Archive | Suno | Box | Unknown | Total |",
        "|---------|-----|---------|------|-----|---------|-------|",
    ])

    for filename, stats in sorted(results["by_file"].items()):
        r2 = stats.get("r2", 0)
        archive = stats.get("archive", 0)
        suno = stats.get("suno", 0)
        box = stats.get("box", 0)
        unknown = stats.get("unknown", 0)
        total = r2 + archive + suno + box + unknown

        md_lines.append(
            f"| {filename} | {r2} | {archive} | {suno} | {box} | {unknown} | {total} |"
        )

    md_lines.extend([
        "",
        "## Fichiers avec URLs non-R2",
        "",
    ])

    # Lister les fichiers qui ont des URLs non-R2
    for filename, stats in sorted(results["by_file"].items()):
        non_r2 = sum(count for domain, count in stats.items() if domain != "r2")
        if non_r2 > 0:
            md_lines.append(f"### {filename}")
            md_lines.append("")
            for domain, count in stats.items():
                if domain != "r2":
                    md_lines.append(f"- {domain}: {count} URLs")
            md_lines.append("")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(md_lines))

    print(f"[OK] Rapport Markdown sauvegarde: {output_file}")

if __name__ == "__main__":
    # Analyser tous les fichiers
    results = analyze_all_files()

    # Sauvegarder les rapports
    json_file = BASE_DIR / "PHASE3_URLS_ANALYSE.json"
    md_file = BASE_DIR / "PHASE3_URLS_ANALYSE.md"

    save_json_report(results, json_file)
    generate_markdown_report(results, md_file)

    print()
    print("=" * 80)
    print("TERMINÉ")
    print("=" * 80)
