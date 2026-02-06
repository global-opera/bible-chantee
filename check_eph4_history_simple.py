import json
import os

files = [
    ('ACTUEL', 'FR.json'),
    ('BACKUP_DEC25', 'FR.json.backup'),
    ('BACKUP_JAN14_20h', 'FR.json.backup_20260114_203204'),
    ('BACKUP2', 'FR.json.backup2'),
    ('BAK_JAN12', 'FR.json.bak-20260112_235716')
]

base_path = 'C:/ScriptBible/bible-chantee/lyrics/'
output_file = 'C:/ScriptBible/bible-chantee/RAPPORT_EPH4_HISTORIQUE.md'

results = []
results.append("# RAPPORT HISTORIQUE - EPHESIENS 4 FR CORRUPTION\n")
results.append("Date: 2026-02-01\n\n")
results.append("=" * 80 + "\n\n")

for label, filename in files:
    filepath = os.path.join(base_path, filename)

    if not os.path.exists(filepath):
        results.append(f"## {label} ({filename}): FICHIER ABSENT\n\n")
        continue

    file_size = os.path.getsize(filepath)
    if file_size < 100:
        results.append(f"## {label} ({filename}): FICHIER TROP PETIT ({file_size} bytes)\n\n")
        continue

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if '49' not in data or '4' not in data['49']:
            results.append(f"## {label} ({filename}): EPHESIENS 4 ABSENT\n\n")
            continue

        content = data['49']['4']

        # Marqueurs de corruption
        corrupt_markers = [
            'отпousses',
            'beginning with a single heart',
            'clients',
            'curlsent',
            'Power yet',
            'Translations par Leonard'
        ]

        is_corrupt = any(marker in content for marker in corrupt_markers)

        lines = content.strip().split('\n')
        last_5_lines = '\n'.join(lines[-5:]) if len(lines) >= 5 else content

        results.append(f"## {label} ({filename})\n\n")
        results.append(f"**Taille:** {len(content)} caracteres\n")
        results.append(f"**Lignes:** {len(lines)}\n")
        results.append(f"**Statut:** {'CORROMPU' if is_corrupt else 'OK'}\n\n")

        if is_corrupt:
            results.append("**Marqueurs corruption detectes:**\n")
            for marker in corrupt_markers:
                if marker in content:
                    results.append(f"- '{marker}'\n")
            results.append("\n")

        results.append("**5 dernieres lignes:**\n")
        results.append("```\n")
        results.append(last_5_lines + "\n")
        results.append("```\n\n")
        results.append("-" * 80 + "\n\n")

    except Exception as e:
        results.append(f"## {label} ({filename}): ERREUR - {str(e)}\n\n")

results.append("\n## CONCLUSION\n\n")
results.append("Analyse terminee.\n")

with open(output_file, 'w', encoding='utf-8') as f:
    f.writelines(results)

print(f"Rapport sauvegarde: {output_file}")
print(f"Total fichiers analyses: {len(files)}")
