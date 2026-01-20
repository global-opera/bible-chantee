#!/usr/bin/env python3
"""
Script de correction du format des paroles FR
- Remplace les titres techniques par les titres poétiques de titles/FR.json
- Reformate les paroles avec retours à la ligne corrects
"""

import json
import re
from pathlib import Path

# Mapping des numéros de livres vers leurs noms français
BOOK_NAMES = {
    "01": "Genèse", "02": "Exode", "03": "Lévitique", "04": "Nombres", "05": "Deutéronome",
    "06": "Josué", "07": "Juges", "08": "Ruth", "09": "1 Samuel", "10": "2 Samuel",
    "11": "1 Rois", "12": "2 Rois", "13": "1 Chroniques", "14": "2 Chroniques", "15": "Esdras",
    "16": "Néhémie", "17": "Esther", "18": "Job", "19": "Psaumes", "20": "Proverbes",
    "21": "Ecclésiaste", "22": "Cantique", "23": "Ésaïe", "24": "Jérémie", "25": "Lamentations",
    "26": "Ézéchiel", "27": "Daniel", "28": "Osée", "29": "Joël", "30": "Amos",
    "31": "Abdias", "32": "Jonas", "33": "Michée", "34": "Nahum", "35": "Habakuk",
    "36": "Sophonie", "37": "Aggée", "38": "Zacharie", "39": "Malachie", "40": "Matthieu",
    "41": "Marc", "42": "Luc", "43": "Jean", "44": "Actes", "45": "Romains",
    "46": "1 Corinthiens", "47": "2 Corinthiens", "48": "Galates", "49": "Éphésiens", "50": "Philippiens",
    "51": "Colossiens", "52": "1 Thessaloniciens", "53": "2 Thessaloniciens", "54": "1 Timothée", "55": "2 Timothée",
    "56": "Tite", "57": "Philémon", "58": "Hébreux", "59": "Jacques", "60": "1 Pierre",
    "61": "2 Pierre", "62": "1 Jean", "63": "2 Jean", "64": "3 Jean", "65": "Jude",
    "66": "Apocalypse"
}

def load_titles(titles_file):
    """Charge les titres depuis titles/FR.json"""
    with open(titles_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def fix_lyrics_formatting(lyrics_text):
    """
    Reformate les paroles pour ajouter les retours à la ligne corrects
    """
    # Les paroles Whisper sont collées - on doit les reformater intelligemment

    # Ajouter retour à la ligne après chaque marqueur de section
    lyrics_text = re.sub(r'\[([^\]]+)\]', r'[\1]\n', lyrics_text)

    # Ajouter retour à la ligne après les phrases qui se terminent par certains mots clés
    # (approximatif, mais mieux que tout collé)
    keywords = ['moi', 'nom', 'blessés', 'revivre', 'jamais', 'paix', 'ceux', 'demain',
                'vies', 'bénédictions', 'cieux', 'glorieux', 'grâce', 'embrasse', 'demeure']

    for keyword in keywords:
        lyrics_text = re.sub(f'({keyword})\\s+([A-ZÀÂÄÉÈÊËÏÎÔÙÛÜŸŒÆÇ])', r'\1\n\2', lyrics_text)

    # Nettoyer les lignes vides multiples
    lyrics_text = re.sub(r'\n\n\n+', r'\n\n', lyrics_text)

    return lyrics_text

def fix_title(lyrics_text, book_num, chapter_num, titles_data):
    """
    Remplace le titre technique par le titre poétique
    """
    # Extraire la partie après [TITLE]
    match = re.match(r'\[TITLE\]\s*\n(.+?)\n\n\[LYRICS\]', lyrics_text, re.DOTALL)
    if not match:
        return lyrics_text

    old_title = match.group(1).strip()

    # Récupérer le titre poétique depuis titles/FR.json
    if book_num in titles_data and chapter_num in titles_data[book_num]:
        poetic_title = titles_data[book_num][chapter_num]
        book_name = BOOK_NAMES.get(book_num, f"Livre {book_num}")

        # Format: "Livre X - Titre poétique"
        if book_num == "19":  # Psaumes
            new_title = f"Psaume {int(chapter_num)} - {poetic_title}"
        else:
            new_title = f"{book_name} {int(chapter_num)} - {poetic_title}"

        # Remplacer le titre
        lyrics_text = lyrics_text.replace(f'[TITLE]\n{old_title}\n', f'[TITLE]\n{new_title}\n')

    return lyrics_text

def fix_all_lyrics(lyrics_file, titles_file, output_file):
    """
    Corrige tous les chapitres
    """
    print("="*70)
    print("CORRECTION DU FORMAT DES PAROLES FR")
    print("="*70)
    print(f"Lecture: {lyrics_file}")
    print(f"Titres: {titles_file}")
    print(f"Sortie: {output_file}")
    print("="*70 + "\n")

    # Charger les données
    with open(lyrics_file, 'r', encoding='utf-8') as f:
        lyrics_data = json.load(f)

    titles_data = load_titles(titles_file)

    # Compteurs
    total = 0
    fixed_titles = 0
    fixed_format = 0

    # Parcourir et corriger
    for book_num in lyrics_data:
        for chapter_num in lyrics_data[book_num]:
            total += 1
            lyrics_text = lyrics_data[book_num][chapter_num]

            # Vérifier si le titre est technique
            if re.search(r'\d+_[A-Z]+\s+Chapitre\s+\d+', lyrics_text):
                # Corriger le titre
                lyrics_text = fix_title(lyrics_text, book_num, chapter_num, titles_data)
                fixed_titles += 1

            # Reformater les paroles
            original_text = lyrics_text
            lyrics_text = fix_lyrics_formatting(lyrics_text)

            if original_text != lyrics_text:
                fixed_format += 1

            # Mettre à jour
            lyrics_data[book_num][chapter_num] = lyrics_text

            if total % 100 == 0:
                print(f"  [PROGRESS] {total} chapitres traités...")

    # Sauvegarder
    print(f"\n[SAVE] Écriture de {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(lyrics_data, f, ensure_ascii=False, indent=2)

    # Résumé
    print("\n" + "="*70)
    print("RÉSUMÉ")
    print("="*70)
    print(f"Chapitres traités: {total}")
    print(f"Titres corrigés: {fixed_titles}")
    print(f"Formats corrigés: {fixed_format}")
    print("="*70)

def main():
    """Fonction principale"""
    lyrics_file = Path(r"C:\ScriptBible\bible-chantee\lyrics\FR.json")
    titles_file = Path(r"C:\ScriptBible\bible-chantee\titles\FR.json")
    output_file = Path(r"C:\ScriptBible\bible-chantee\lyrics\FR.json")
    backup_file = Path(r"C:\ScriptBible\bible-chantee\lyrics\FR.json.backup2")

    # Backup
    import shutil
    print(f"[BACKUP] {lyrics_file} -> {backup_file}")
    shutil.copy2(lyrics_file, backup_file)

    # Corriger
    fix_all_lyrics(lyrics_file, titles_file, output_file)

    print("\n[SUCCESS] Correction terminée!")
    print("\nProchaines étapes:")
    print("1. Vérifier le résultat avec un chapitre test")
    print("2. Régénérer lyrics-data.js")
    print("3. Commit et push")

if __name__ == "__main__":
    main()
