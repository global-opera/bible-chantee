"""
Générateur automatique de posts pour réseaux sociaux - Bible Chantée
Crée des posts optimisés pour Facebook, Instagram, X/Twitter, LinkedIn
"""
import json
import random
from pathlib import Path
from datetime import datetime, timedelta

# Configuration
OUTPUT_DIR = Path("G:/Mon Drive/01 BibleChantee/Social_Media_Posts")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

BOOK_NAMES = {
    "01_GEN": "Genèse", "02_EXO": "Exode", "03_LEV": "Lévitique", "04_NUM": "Nombres",
    "05_DEU": "Deutéronome", "06_JOS": "Josué", "07_JDG": "Juges", "08_RUT": "Ruth",
    "09_1SAM": "1 Samuel", "10_2SAM": "2 Samuel", "11_1KI": "1 Rois", "12_2KI": "2 Rois",
    "13_1CH": "1 Chroniques", "14_2CH": "2 Chroniques", "15_EZR": "Esdras",
    "16_NEH": "Néhémie", "17_EST": "Esther", "18_JOB": "Job", "19_PSA": "Psaumes",
    "20_PRO": "Proverbes", "21_ECC": "Ecclésiaste", "22_SON": "Cantique des Cantiques",
    "23_ISA": "Ésaïe", "24_JER": "Jérémie", "25_LAM": "Lamentations",
    "26_EZE": "Ézéchiel", "27_DAN": "Daniel", "28_HOS": "Osée", "29_JOE": "Joël",
    "30_AMO": "Amos", "31_OBA": "Abdias", "32_JON": "Jonas", "33_MIC": "Michée",
    "34_NAH": "Nahum", "35_HAB": "Habacuc", "36_ZEP": "Sophonie", "37_HAG": "Aggée",
    "38_ZEC": "Zacharie", "39_MAL": "Malachie", "40_MAT": "Matthieu", "41_MAR": "Marc",
    "42_LUK": "Luc", "43_JOH": "Jean", "44_ACT": "Actes", "45_ROM": "Romains",
    "46_1CO": "1 Corinthiens", "47_2CO": "2 Corinthiens", "48_GAL": "Galates",
    "49_EPH": "Éphésiens", "50_PHP": "Philippiens", "51_COL": "Colossiens",
    "52_1TH": "1 Thessaloniciens", "53_2TH": "2 Thessaloniciens",
    "54_1TI": "1 Timothée", "55_2TI": "2 Timothée", "56_TIT": "Tite",
    "57_PHM": "Philémon", "58_HEB": "Hébreux", "59_JAS": "Jacques",
    "60_1PE": "1 Pierre", "61_2PE": "2 Pierre", "62_1JO": "1 Jean",
    "63_2JO": "2 Jean", "64_3JO": "3 Jean", "65_JUD": "Jude", "66_REV": "Apocalypse"
}

# Chapitres phares avec descriptions
FEATURED_CHAPTERS = {
    "01_GEN_01": {
        "title": "La Création",
        "verse": "Au commencement, Dieu créa les cieux et la terre",
        "theme": "Origines",
        "emoji": "🌍"
    },
    "19_PSA_23": {
        "title": "Le Bon Berger",
        "verse": "L'Éternel est mon berger: je ne manquerai de rien",
        "theme": "Protection",
        "emoji": "🐑"
    },
    "43_JOH_03": {
        "title": "Naître de nouveau",
        "verse": "Car Dieu a tant aimé le monde qu'il a donné son Fils unique",
        "theme": "Salut",
        "emoji": "💝"
    },
    "43_JOH_01": {
        "title": "La Parole faite chair",
        "verse": "Au commencement était la Parole",
        "theme": "Incarnation",
        "emoji": "✝️"
    },
    "40_MAT_05": {
        "title": "Les Béatitudes",
        "verse": "Heureux ceux qui ont le cœur pur, car ils verront Dieu",
        "theme": "Sagesse",
        "emoji": "⛰️"
    },
    "46_1CO_13": {
        "title": "L'hymne à l'amour",
        "verse": "L'amour est patient, l'amour est plein de bonté",
        "theme": "Amour",
        "emoji": "❤️"
    },
    "45_ROM_08": {
        "title": "Plus que vainqueurs",
        "verse": "Rien ne pourra nous séparer de l'amour de Dieu",
        "theme": "Victoire",
        "emoji": "🏆"
    },
    "19_PSA_91": {
        "title": "Sous sa protection",
        "verse": "Celui qui demeure sous l'abri du Très-Haut",
        "theme": "Protection",
        "emoji": "🛡️"
    },
    "66_REV_21": {
        "title": "Nouvelle Jérusalem",
        "verse": "Voici, je fais toutes choses nouvelles",
        "theme": "Espérance",
        "emoji": "🌟"
    },
    "02_EXO_20": {
        "title": "Les Dix Commandements",
        "verse": "Je suis l'Éternel, ton Dieu",
        "theme": "Loi",
        "emoji": "📜"
    }
}


class SocialMediaPostGenerator:
    def __init__(self):
        self.posts = []
        self.email = "global.opera.biblechantee@gmail.com"
        self.website = "https://biblechantee.netlify.app"
        self.youtube = "https://youtube.com/@BibleChantee"  # À mettre à jour avec le vrai canal

    def generate_new_chapter_post(self, book_code, chapter_num, platform="facebook"):
        """Génère un post pour annoncer un nouveau chapitre"""
        book_name = BOOK_NAMES.get(book_code, book_code)
        chapter_key = f"{book_code}_{chapter_num:02d}"

        # Chercher si c'est un chapitre phare
        featured = FEATURED_CHAPTERS.get(chapter_key)

        if platform == "facebook":
            if featured:
                post = f"""🎵 NOUVEAU CHAPITRE disponible! {featured['emoji']}

{book_name} Chapitre {chapter_num} - {featured['title']}

"{featured['verse']}" - {book_name} {chapter_num}

Découvrez ce chapitre magnifiquement mis en musique en worship français contemporain. Parfait pour la méditation, la prière ou simplement pour se plonger dans la Parole de Dieu d'une manière nouvelle et rafraîchissante.

🎧 Écouter maintenant: {self.website}
📖 Bible Louis Segond 1910 complète
✨ Qualité studio (Suno AI V5)
💝 100% gratuit

#BibleChantee #BibleEnMusique #{featured['theme']} #{book_name.replace(' ', '')} #WorshipFrancais #MeditationBiblique #Christianisme"""

            else:
                post = f"""🎵 Nouveau chapitre disponible!

{book_name} Chapitre {chapter_num}

La Bible entière mise en musique pour faciliter votre méditation quotidienne.

🎧 Écouter: {self.website}
📖 Texte intégral Louis Segond 1910
🎼 Worship français 72 BPM
💝 Gratuit et libre de partage

#BibleChantee #BibleEnMusique #{book_name.replace(' ', '')} #Worship #PriereDuJour"""

        elif platform == "instagram":
            # Instagram: plus court, plus d'emojis
            if featured:
                post = f"""{featured['emoji']} NOUVEAU: {book_name} {chapter_num}

"{featured['verse']}"

La Bible en musique 🎵
Worship français ✨
100% gratuit 💝

Lien dans bio 👉 {self.website}

#biblechantee #bibleenmusique #{book_name.lower().replace(' ', '')} #worship #bible #musiquechretienne #louange #meditation #foi #chretienfr"""

            else:
                post = f"""🎵 {book_name} Chapitre {chapter_num}

Toute la Bible en musique française

🎧 Écoute gratuite
📖 Texte intégral
✨ Qualité studio

Lien dans bio

#biblechantee #bibleenmusique #worship #bible #chretien #louange #foi"""

        elif platform == "twitter":
            # Twitter/X: max 280 caractères
            if featured:
                post = f"""{featured['emoji']} NOUVEAU: {book_name} {chapter_num} - {featured['title']}

"{featured['verse'][:50]}..."

🎵 Bible en musique française
✨ Gratuit

{self.website}

#BibleChantee #Worship"""

            else:
                post = f"""🎵 {book_name} Chapitre {chapter_num}

La Bible complète en worship français

🎧 {self.website}

#BibleChantee #BibleEnMusique #Worship"""

        elif platform == "linkedin":
            # LinkedIn: plus professionnel, focus sur le projet
            post = f"""📢 Nouveau chapitre disponible - Projet Bible Chantée

{book_name} Chapitre {chapter_num}

Le projet Bible Chantée rend accessible l'intégralité de la Bible Louis Segond 1910 (1,189 chapitres) sous forme musicale, facilitant ainsi la mémorisation et la méditation pour les francophones du monde entier.

🎼 Technologie: Suno AI V5 (septembre 2025)
📖 Source: Bible Louis Segond 1910 (domaine public)
🎵 Style: Worship français contemplatif (72 BPM)
💝 Licence: Creative Commons BY-NC-SA 4.0

Ce projet innovant allie technologie de pointe et spiritualité pour rendre la Parole accessible à tous.

Découvrir: {self.website}
Contact: {self.email}

#Innovation #IA #Musique #Spiritualité #TechForGood #BibleChantee"""

        return post

    def generate_milestone_post(self, milestone_type, value, platform="facebook"):
        """Génère un post pour célébrer un jalon"""

        if milestone_type == "chapters":
            if platform == "facebook":
                post = f"""🎉 JALON ATTEINT! {value} chapitres générés! 🎊

Un immense MERCI à toute la communauté qui suit et partage ce projet!

📊 Progression:
• {value}/1,189 chapitres complétés
• {int((value/1189)*100)}% de la Bible en musique
• 66 livres bibliques en cours
• Qualité studio V5 (Suno AI)

🎯 Prochaines étapes:
• Complétion de la Bible française
• Lancement canal YouTube
• Expansion multilingue (anglais, espagnol, portugais)

Vous aussi, découvrez la Bible d'une manière nouvelle!

🎧 {self.website}

Partagez si vous aimez! ❤️

#BibleChantee #Milestone #BibleEnMusique #Merci #Communauté #Worship"""

            elif platform == "instagram":
                post = f"""🎉 {value} CHAPITRES! 🎊

Merci pour votre soutien! 💝

{int((value/1189)*100)}% de la Bible complétée

Prochaine étape: YouTube 📺

#biblechantee #milestone #merci #bibleenmusique #worship #communaute #gratitude"""

            elif platform == "twitter":
                post = f"""🎉 JALON: {value} chapitres générés!

{int((value/1189)*100)}% de la Bible française complétée

Merci à la communauté! ❤️

{self.website}

#BibleChantee #Milestone"""

        elif milestone_type == "book_complete":
            book_name = value
            if platform == "facebook":
                post = f"""✅ LIVRE COMPLET: {book_name}! 📚

Tous les chapitres de {book_name} sont maintenant disponibles en musique!

Écoutez l'intégralité de ce livre magnifique dans notre playlist dédiée.

🎧 {self.website}

Quel livre aimeriez-vous voir complété ensuite? Commentez! 👇

#BibleChantee #BibleEnMusique #{book_name.replace(' ', '')} #LivreComplet #Worship"""

        return post

    def generate_weekly_recap_post(self, chapters_added, books_completed, platform="facebook"):
        """Génère un récap hebdomadaire"""

        if platform == "facebook":
            post = f"""📊 RÉCAP DE LA SEMAINE

Cette semaine dans Bible Chantée:

📈 Nouveaux chapitres: {chapters_added}
✅ Livres complétés: {books_completed}
🎵 Heures d'écoute: Toujours croissantes!
❤️ Abonnés: Merci pour votre fidélité!

🔜 La semaine prochaine:
• Nouveaux chapitres quotidiens
• Amélioration continue de la qualité
• Préparation du lancement YouTube

📅 Rappel: Nouveau chapitre chaque jour!
🔔 Activez les notifications pour ne rien manquer

🎧 {self.website}

Belle semaine à tous! 🙏

#BibleChantee #RecapHebdo #BibleEnMusique #Worship #Communaute"""

        elif platform == "instagram":
            post = f"""📊 CETTE SEMAINE:

✨ {chapters_added} nouveaux chapitres
✅ {books_completed} livres complétés
❤️ Merci!

Semaine prochaine: encore plus! 🚀

#biblechantee #recap #weekly #bibleenmusique #worship #communaute"""

        return post

    def generate_verse_of_day_post(self, book_code, chapter_num, verse_text, platform="facebook"):
        """Génère un post 'Verset du jour'"""
        book_name = BOOK_NAMES.get(book_code, book_code)

        if platform == "facebook":
            post = f"""📖 VERSET DU JOUR

"{verse_text}"

- {book_name} {chapter_num}

🎵 Écoutez ce chapitre en musique:
{self.website}

#VersetDuJour #BibleChantee #BibleEnMusique #{book_name.replace(' ', '')} #Inspiration #Foi"""

        elif platform == "instagram":
            post = f"""📖 VERSET DU JOUR

"{verse_text}"

{book_name} {chapter_num}

Écouter en musique 🎵
Lien dans bio

#versetdujour #biblechantee #bible #inspiration #foi #bibleenmusique"""

        elif platform == "twitter":
            verse_short = verse_text[:120] + "..." if len(verse_text) > 120 else verse_text
            post = f"""📖 "{verse_short}"

- {book_name} {chapter_num}

🎵 {self.website}

#VersetDuJour #BibleChantee"""

        return post

    def generate_youtube_announcement_post(self, platform="facebook"):
        """Génère un post pour annoncer YouTube"""

        if platform == "facebook":
            post = f"""🎬 GRANDE ANNONCE: Bible Chantée arrive sur YOUTUBE! 📺

Nous sommes ravis d'annoncer le lancement prochain de notre canal YouTube officiel!

🎥 CE QUI VOUS ATTEND:
• 1,189 vidéos (tous les chapitres de la Bible!)
• Paroles synchronisées à l'écran
• Playlists par livre biblique
• Visuels artistiques originaux
• Qualité HD optimisée

📅 LANCEMENT: Très bientôt!
🔔 Soyez les premiers informés en vous abonnant dès maintenant

🎯 OBJECTIF: Rendre la Bible accessible au monde entier via la musique

En attendant, toute la Bible est disponible sur:
🎧 {self.website}

Partagez cette annonce avec votre communauté! ❤️

#BibleChantee #YouTube #GrandeAnnonce #BibleEnMusique #Lancement #Excitation"""

        elif platform == "instagram":
            post = f"""🎬 BIENTÔT SUR YOUTUBE! 📺

1,189 vidéos
Toute la Bible en musique
Paroles synchronisées
Qualité HD

Lancement imminent! 🚀

Abonnez-vous maintenant (lien en bio)

#biblechantee #youtube #comingsoon #bibleenmusique #annonce #excitation #nouveaute"""

        return post

    def generate_calendar_posts(self, start_date, days=30, posts_per_day=2):
        """Génère un calendrier de posts pour plusieurs jours"""
        calendar = {}
        current_date = datetime.strptime(start_date, "%Y-%m-%d")

        # Sélectionner des chapitres phares aléatoirement
        featured_keys = list(FEATURED_CHAPTERS.keys())

        for day in range(days):
            date_str = current_date.strftime("%Y-%m-%d")
            calendar[date_str] = []

            for post_num in range(posts_per_day):
                # Alterner types de posts
                if post_num == 0:
                    # Post principal: nouveau chapitre
                    chapter_key = random.choice(featured_keys)
                    book_code, chapter = chapter_key.rsplit('_', 1)
                    chapter_num = int(chapter)

                    for platform in ["facebook", "instagram", "twitter"]:
                        post = self.generate_new_chapter_post(book_code, chapter_num, platform)
                        calendar[date_str].append({
                            'time': '08:00',
                            'platform': platform,
                            'type': 'new_chapter',
                            'content': post
                        })

                else:
                    # Post secondaire: verset du jour
                    chapter_key = random.choice(featured_keys)
                    book_code, chapter = chapter_key.rsplit('_', 1)
                    chapter_num = int(chapter)
                    featured = FEATURED_CHAPTERS[chapter_key]

                    for platform in ["facebook", "instagram"]:
                        post = self.verse_of_day_post(book_code, chapter_num, featured['verse'], platform)
                        calendar[date_str].append({
                            'time': '18:00',
                            'platform': platform,
                            'type': 'verse_of_day',
                            'content': post
                        })

            current_date += timedelta(days=1)

        return calendar

    def save_posts_to_files(self, posts_dict, filename="social_posts"):
        """Sauvegarde les posts dans différents formats"""

        # JSON
        json_file = OUTPUT_DIR / f"{filename}.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(posts_dict, f, indent=2, ensure_ascii=False)

        print(f"[OK] Posts sauvegardés: {json_file}")

        # TXT lisible
        txt_file = OUTPUT_DIR / f"{filename}.txt"
        with open(txt_file, 'w', encoding='utf-8') as f:
            f.write("="*80 + "\n")
            f.write("  POSTS RÉSEAUX SOCIAUX - BIBLE CHANTÉE\n")
            f.write("="*80 + "\n\n")

            for date, posts in sorted(posts_dict.items()):
                f.write(f"\n📅 {date}\n")
                f.write("-"*80 + "\n\n")

                for post in posts:
                    f.write(f"[{post['time']}] {post['platform'].upper()} - {post['type']}\n")
                    f.write("-"*40 + "\n")
                    f.write(post['content'])
                    f.write("\n\n")

        print(f"[OK] Version texte: {txt_file}")


def main():
    """Point d'entrée principal"""
    print("="*80)
    print("  GÉNÉRATEUR DE POSTS RÉSEAUX SOCIAUX - BIBLE CHANTÉE")
    print("="*80)
    print()
    print("OPTIONS:")
    print("  1. Générer un post pour un nouveau chapitre")
    print("  2. Générer un post de jalon (milestone)")
    print("  3. Générer un récap hebdomadaire")
    print("  4. Générer un verset du jour")
    print("  5. Générer l'annonce YouTube")
    print("  6. Générer un calendrier de posts (30 jours)")
    print()

    choice = input("Votre choix (1-6): ").strip()

    generator = SocialMediaPostGenerator()

    if choice == "1":
        # Nouveau chapitre
        print("\nChapitres phares disponibles:")
        for i, (key, data) in enumerate(FEATURED_CHAPTERS.items(), 1):
            book_code, chapter = key.rsplit('_', 1)
            book_name = BOOK_NAMES[book_code]
            print(f"  {i}. {book_name} {int(chapter)} - {data['title']}")

        selection = input("\nNuméro du chapitre (ou code livre_chapitre): ").strip()

        if selection.isdigit() and 1 <= int(selection) <= len(FEATURED_CHAPTERS):
            chapter_key = list(FEATURED_CHAPTERS.keys())[int(selection)-1]
            book_code, chapter = chapter_key.rsplit('_', 1)
            chapter_num = int(chapter)
        else:
            parts = selection.split('_')
            if len(parts) >= 3:
                book_code = '_'.join(parts[:2])
                chapter_num = int(parts[-1])
            else:
                print("[ERROR] Format invalide")
                return

        print("\nPosts générés:\n")
        for platform in ["facebook", "instagram", "twitter", "linkedin"]:
            post = generator.generate_new_chapter_post(book_code, chapter_num, platform)
            print(f"\n{'='*60}")
            print(f"PLATFORM: {platform.upper()}")
            print('='*60)
            print(post)

    elif choice == "2":
        # Milestone
        value = input("Valeur du jalon (ex: 1000 pour 1000 chapitres): ").strip()
        if value.isdigit():
            for platform in ["facebook", "instagram", "twitter"]:
                post = generator.generate_milestone_post("chapters", int(value), platform)
                print(f"\n{'='*60}")
                print(f"PLATFORM: {platform.upper()}")
                print('='*60)
                print(post)

    elif choice == "3":
        # Récap hebdo
        chapters = input("Chapitres ajoutés cette semaine: ").strip()
        books = input("Livres complétés: ").strip()

        for platform in ["facebook", "instagram"]:
            post = generator.generate_weekly_recap_post(int(chapters), int(books), platform)
            print(f"\n{'='*60}")
            print(f"PLATFORM: {platform.upper()}")
            print('='*60)
            print(post)

    elif choice == "4":
        # Verset du jour
        print("\nUtiliser un chapitre phare? (oui/non): ")
        use_featured = input().strip().lower() == "oui"

        if use_featured:
            print("\nChapitres phares:")
            for i, (key, data) in enumerate(FEATURED_CHAPTERS.items(), 1):
                book_code, chapter = key.rsplit('_', 1)
                book_name = BOOK_NAMES[book_code]
                print(f"  {i}. {book_name} {int(chapter)} - {data['title']}")

            selection = int(input("\nNuméro: ").strip())
            chapter_key = list(FEATURED_CHAPTERS.keys())[selection-1]
            book_code, chapter = chapter_key.rsplit('_', 1)
            chapter_num = int(chapter)
            verse_text = FEATURED_CHAPTERS[chapter_key]['verse']
        else:
            book_code = input("Code livre (ex: 19_PSA): ").strip()
            chapter_num = int(input("Numéro chapitre: ").strip())
            verse_text = input("Texte du verset: ").strip()

        for platform in ["facebook", "instagram", "twitter"]:
            post = generator.generate_verse_of_day_post(book_code, chapter_num, verse_text, platform)
            print(f"\n{'='*60}")
            print(f"PLATFORM: {platform.upper()}")
            print('='*60)
            print(post)

    elif choice == "5":
        # Annonce YouTube
        for platform in ["facebook", "instagram"]:
            post = generator.generate_youtube_announcement_post(platform)
            print(f"\n{'='*60}")
            print(f"PLATFORM: {platform.upper()}")
            print('='*60)
            print(post)

    elif choice == "6":
        # Calendrier
        start_date = input("Date de début (YYYY-MM-DD, défaut=aujourd'hui): ").strip()
        if not start_date:
            start_date = datetime.now().strftime("%Y-%m-%d")

        days = input("Nombre de jours (défaut=30): ").strip()
        days = int(days) if days else 30

        print(f"\nGénération du calendrier pour {days} jours...")

        calendar = generator.generate_calendar_posts(start_date, days)
        generator.save_posts_to_files(calendar, f"calendar_{start_date}")

        print(f"\n[OK] {len(calendar)} jours de posts générés!")
        print(f"[OK] Total de {sum(len(posts) for posts in calendar.values())} posts")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[STOP] Arrêté")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
