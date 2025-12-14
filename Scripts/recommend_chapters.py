"""
Système de recommandation de chapitres - Bible Chantée
Suggestions basées sur l'humeur, le besoin spirituel et le contexte
"""
import json
import random
from pathlib import Path

# Base de données de chapitres par catégorie
RECOMMENDATIONS = {
    # Émotions
    "tristesse": {
        "title": "Réconfort dans la tristesse",
        "chapters": [
            ("19_PSA", 23, "L'Éternel est mon berger", "Le Bon Berger qui console"),
            ("19_PSA", 34, "Délivrance des afflictions", "Dieu écoute les cœurs brisés"),
            ("19_PSA", 42, "L'âme qui soupire après Dieu", "Espérance en Dieu"),
            ("19_PSA", 46, "Dieu est notre refuge", "Force dans les épreuves"),
            ("19_PSA", 130, "Des profondeurs je crie", "Espérance dans l'attente"),
            ("40_MAT", 11, "Venez à moi", "Repos pour les âmes fatiguées"),
            ("43_JOH", 14, "Que votre cœur ne se trouble pas", "Promesse de paix"),
            ("45_ROM", 8, "Rien ne nous séparera", "Amour éternel de Dieu"),
            ("47_2CO", 1, "Dieu de toute consolation", "Réconfort dans l'affliction"),
            ("60_1PE", 5, "Déchargez-vous sur lui", "Dieu prend soin de vous")
        ]
    },

    "anxiete": {
        "title": "Paix dans l'anxiété",
        "chapters": [
            ("19_PSA", 91, "Sous sa protection", "Refuge du Très-Haut"),
            ("19_PSA", 121, "D'où me viendra le secours", "L'Éternel veille sur toi"),
            ("19_PSA", 139, "Tu me sondes", "Dieu te connaît parfaitement"),
            ("40_MAT", 6, "Ne vous inquiétez pas", "Dieu pourvoit"),
            ("50_PHP", 4, "Ne vous inquiétez de rien", "Paix qui surpasse"),
            ("43_JOH", 14, "Paix je vous laisse", "Paix de Christ"),
            ("60_1PE", 5, "Déchargez vos soucis", "Dieu a soin de vous")
        ]
    },

    "joie": {
        "title": "Célébration et louange",
        "chapters": [
            ("19_PSA", 100, "Poussez des cris de joie", "Louange joyeuse"),
            ("19_PSA", 150, "Que tout ce qui respire loue l'Éternel", "Louange finale"),
            ("19_PSA", 103, "Mon âme bénis l'Éternel", "Reconnaissance"),
            ("19_PSA", 145, "Je t'exalterai ô mon Dieu", "Grandeur de Dieu"),
            ("50_PHP", 4, "Réjouissez-vous toujours", "Joie en Christ"),
            ("19_PSA", 118, "Rendez grâce à l'Éternel", "Fidélité de Dieu"),
            ("66_REV", 19, "Alléluia", "Célébration céleste")
        ]
    },

    "gratitude": {
        "title": "Actions de grâces",
        "chapters": [
            ("19_PSA", 103, "Bénis l'Éternel ô mon âme", "Bienfaits de Dieu"),
            ("19_PSA", 136, "Car sa miséricorde dure à toujours", "Reconnaissance"),
            ("19_PSA", 116, "J'aime l'Éternel", "Délivrance"),
            ("51_COL", 3, "Soyez reconnaissants", "Gratitude en Christ"),
            ("52_1TH", 5, "Rendez grâces en toutes choses", "Gratitude constante")
        ]
    },

    # Besoins spirituels
    "direction": {
        "title": "Guidance divine",
        "chapters": [
            ("19_PSA", 25, "Enseigne-moi tes sentiers", "Guidance"),
            ("19_PSA", 32, "Je t'instruirai", "Direction de Dieu"),
            ("19_PSA", 143, "Enseigne-moi à faire ta volonté", "Obéissance"),
            ("20_PRO", 3, "Confie-toi en l'Éternel", "Sagesse divine"),
            ("59_JAS", 1, "Si quelqu'un manque de sagesse", "Demander la sagesse")
        ]
    },

    "force": {
        "title": "Force et courage",
        "chapters": [
            ("19_PSA", 46, "Dieu est notre refuge", "Force divine"),
            ("19_PSA", 27, "L'Éternel est ma lumière", "Courage"),
            ("23_ISA", 40, "Ceux qui se confient en l'Éternel", "Renouvellement"),
            ("50_PHP", 4, "Je puis tout", "Force en Christ"),
            ("06_JOS", 1, "Fortifie-toi et prends courage", "Courage divin"),
            ("49_EPH", 6, "Revêtez l'armure de Dieu", "Force spirituelle")
        ]
    },

    "pardon": {
        "title": "Pardon et réconciliation",
        "chapters": [
            ("19_PSA", 51, "Pitié ô Dieu selon ta bonté", "Repentance de David"),
            ("19_PSA", 32, "Heureux celui dont la transgression est remise", "Pardon"),
            ("40_MAT", 18, "Pardonner 70 fois 7 fois", "Pardon illimité"),
            ("42_LUK", 15, "Fils prodigue", "Amour du Père"),
            ("62_1JO", 1, "Si nous confessons nos péchés", "Purification")
        ]
    },

    "amour": {
        "title": "Amour de Dieu",
        "chapters": [
            ("43_JOH", 3, "Car Dieu a tant aimé le monde", "Amour sacrificiel"),
            ("46_1CO", 13, "L'amour est patient", "Hymne à l'amour"),
            ("45_ROM", 8, "Rien ne nous séparera", "Amour éternel"),
            ("62_1JO", 4, "Dieu est amour", "Définition de l'amour"),
            ("22_SON", 8, "L'amour est fort comme la mort", "Amour puissant")
        ]
    },

    # Moments de la journée
    "matin": {
        "title": "Prière du matin",
        "chapters": [
            ("19_PSA", 5, "Éternel écoute mes paroles", "Prière matinale"),
            ("19_PSA", 90, "Rassasie-nous chaque matin", "Nouvelle journée"),
            ("19_PSA", 143, "Fais-moi dès le matin entendre", "Guidance"),
            ("25_LAM", 3, "Les compassions ne sont pas épuisées", "Nouvelles chaque matin")
        ]
    },

    "soir": {
        "title": "Prière du soir",
        "chapters": [
            ("19_PSA", 4, "En paix je me couche et je m'endors", "Repos en Dieu"),
            ("19_PSA", 91, "Celui qui demeure sous l'abri", "Protection nocturne"),
            ("19_PSA", 134, "Bénissez l'Éternel pendant les nuits", "Veille spirituelle"),
            ("19_PSA", 3, "Je me couche et je m'endors", "Confiance")
        ]
    },

    # Situations de vie
    "maladie": {
        "title": "Guérison et santé",
        "chapters": [
            ("19_PSA", 103, "Qui pardonne et qui guérit", "Guérison divine"),
            ("19_PSA", 41, "L'Éternel le soutient sur son lit", "Maladie"),
            ("59_JAS", 5, "Priez les uns pour les autres", "Prière de guérison"),
            ("02_EXO", 15, "Je suis l'Éternel qui te guérit", "Dieu guérisseur")
        ]
    },

    "travail": {
        "title": "Vie professionnelle",
        "chapters": [
            ("20_PRO", 3, "Honore l'Éternel dans ton travail", "Prospérité"),
            ("20_PRO", 16, "Recommande tes œuvres à l'Éternel", "Succès"),
            ("21_ECC", 9, "Tout ce que ta main trouve à faire", "Excellence"),
            ("51_COL", 3, "Faites-le de bon cœur", "Travail pour Dieu")
        ]
    },

    "famille": {
        "title": "Vie de famille",
        "chapters": [
            ("19_PSA", 127, "Si l'Éternel ne bâtit la maison", "Famille bénie"),
            ("19_PSA", 128, "Heureux celui qui craint l'Éternel", "Bonheur familial"),
            ("20_PRO", 22, "Instruis l'enfant", "Éducation"),
            ("49_EPH", 5, "Maris, aimez vos femmes", "Mariage"),
            ("49_EPH", 6, "Enfants, obéissez", "Relations familiales")
        ]
    }
}


class ChapterRecommender:
    def __init__(self):
        self.history = []
        self.load_history()

    def load_history(self):
        """Charge l'historique des recommandations"""
        history_file = Path("G:/Mon Drive/01 BibleChantee/Analytics/recommendation_history.json")
        if history_file.exists():
            try:
                with open(history_file, 'r', encoding='utf-8') as f:
                    self.history = json.load(f)
            except:
                self.history = []

    def save_history(self):
        """Sauvegarde l'historique"""
        history_file = Path("G:/Mon Drive/01 BibleChantee/Analytics/recommendation_history.json")
        history_file.parent.mkdir(parents=True, exist_ok=True)
        with open(history_file, 'w', encoding='utf-8') as f:
            json.dump(self.history, f, indent=2, ensure_ascii=False)

    def recommend(self, mood_or_need, count=5):
        """Recommande des chapitres selon l'humeur/besoin"""
        if mood_or_need not in RECOMMENDATIONS:
            return None

        category = RECOMMENDATIONS[mood_or_need]
        chapters = category['chapters']

        # Mélanger et prendre N chapitres
        selected = random.sample(chapters, min(count, len(chapters)))

        # Enregistrer dans l'historique
        self.history.append({
            'timestamp': datetime.now().isoformat(),
            'category': mood_or_need,
            'title': category['title'],
            'recommendations': [
                {
                    'book': ch[0],
                    'chapter': ch[1],
                    'title': ch[2],
                    'description': ch[3]
                } for ch in selected
            ]
        })

        # Limiter historique
        if len(self.history) > 100:
            self.history = self.history[-100:]

        self.save_history()

        return {
            'category': mood_or_need,
            'title': category['title'],
            'recommendations': selected
        }

    def get_multiple_recommendations(self, categories, count_per_category=3):
        """Obtient des recommandations pour plusieurs catégories"""
        results = {}

        for category in categories:
            results[category] = self.recommend(category, count_per_category)

        return results

    def display_recommendation(self, result):
        """Affiche une recommandation de manière formatée"""
        if not result:
            print("❌ Catégorie non trouvée")
            return

        print("\n" + "="*80)
        print(f"  💡 {result['title'].upper()}")
        print("="*80 + "\n")

        for i, (book_code, chapter_num, title, description) in enumerate(result['recommendations'], 1):
            book_name = BOOK_NAMES.get(book_code, book_code)

            print(f"{i}. 📖 {book_name} {chapter_num} - {title}")
            print(f"   {description}")
            print(f"   🎵 Écouter: https://biblechantee.netlify.app/{book_code}/{chapter_num}")
            print()

        print("="*80)


# Mapping des noms de livres
BOOK_NAMES = {
    "01_GEN": "Genèse", "02_EXO": "Exode", "03_LEV": "Lévitique", "04_NUM": "Nombres",
    "05_DEU": "Deutéronome", "06_JOS": "Josué", "07_JDG": "Juges", "08_RUT": "Ruth",
    "09_1SAM": "1 Samuel", "10_2SAM": "2 Samuel", "11_1KI": "1 Rois", "12_2KI": "2 Rois",
    "13_1CH": "1 Chroniques", "14_2CH": "2 Chroniques", "15_EZR": "Esdras",
    "16_NEH": "Néhémie", "17_EST": "Esther", "18_JOB": "Job", "19_PSA": "Psaumes",
    "20_PRO": "Proverbes", "21_ECC": "Ecclésiaste", "22_SON": "Cantique",
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


def main():
    """Point d'entrée principal"""
    print("="*80)
    print("  💡 RECOMMANDATIONS PERSONNALISÉES - BIBLE CHANTÉE")
    print("="*80)
    print()

    recommender = ChapterRecommender()

    print("CATÉGORIES DISPONIBLES:")
    print()
    print("🎭 ÉMOTIONS:")
    print("  tristesse, anxiete, joie, gratitude")
    print()
    print("🙏 BESOINS SPIRITUELS:")
    print("  direction, force, pardon, amour")
    print()
    print("⏰ MOMENTS:")
    print("  matin, soir")
    print()
    print("🏠 SITUATIONS:")
    print("  maladie, travail, famille")
    print()

    category = input("Quelle est votre situation actuelle? ").strip().lower()

    if category not in RECOMMENDATIONS:
        print(f"\n❌ Catégorie '{category}' non trouvée.")
        print("Catégories disponibles:", ", ".join(RECOMMENDATIONS.keys()))
        return

    count = input("\nCombien de recommandations? (défaut: 5): ").strip()
    count = int(count) if count else 5

    result = recommender.recommend(category, count)
    recommender.display_recommendation(result)


if __name__ == "__main__":
    from datetime import datetime
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[STOP] Arrêté")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
