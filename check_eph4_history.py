import json
import os

# Fichiers à vérifier
files = [
    'FR.json',
    'FR.json.backup',
    'FR.json.backup_20260114_203204',
    'FR.json.backup2',
    'FR.json.bak-20260112_235716'
]

base_path = 'C:/ScriptBible/bible-chantee/lyrics/'

print("=" * 80)
print("ANALYSE HISTORIQUE - ÉPHÉSIENS 4 FR")
print("=" * 80)
print()

for filename in files:
    filepath = os.path.join(base_path, filename)
    if not os.path.exists(filepath):
        print(f"❌ {filename}: Fichier absent")
        continue

    file_size = os.path.getsize(filepath)
    if file_size < 100:
        print(f"❌ {filename}: Trop petit ({file_size} bytes)")
        continue

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if '49' not in data:
            print(f"⚠️ {filename}: Livre 49 absent")
            continue

        if '4' not in data['49']:
            print(f"⚠️ {filename}: Chapitre 4 absent")
            continue

        content = data['49']['4']

        # Vérifier si corrompu
        corrupt_markers = [
            'отпousses',  # Caractères russes
            'beginning with a single heart',  # Anglais
            'clients',
            'curlsent',
            'Power yet',
            'Translations par Léonard'
        ]

        is_corrupt = any(marker in content for marker in corrupt_markers)

        # Extraire dernières lignes
        lines = content.strip().split('\n')
        last_3_lines = '\n'.join(lines[-3:])

        print(f"\n{'='*60}")
        print(f"📄 {filename}")
        print(f"{'='*60}")
        print(f"Taille: {len(content)} caractères")
        print(f"Lignes: {len(lines)}")
        print(f"Statut: {'❌ CORROMPU' if is_corrupt else '✅ OK'}")
        if is_corrupt:
            print(f"\nMarqueurs corruption détectés:")
            for marker in corrupt_markers:
                if marker in content:
                    print(f"  - '{marker}'")

        print(f"\n3 dernières lignes:")
        print("-" * 60)
        print(last_3_lines)

    except Exception as e:
        print(f"❌ {filename}: Erreur - {e}")

print("\n" + "=" * 80)
