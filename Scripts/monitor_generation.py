"""
Monitoring en temps réel de la génération Bible Chantée
Affiche progression, statistiques et ETA
"""
import os
import json
import time
from pathlib import Path
from datetime import datetime, timedelta
import sys
import requests
from api_key import SUNO_API_KEY

# Configuration
SUNO_OUTPUT_DIR = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")
MONITOR_INTERVAL = 30  # Secondes entre chaque mise à jour

# Bible complète: 1,189 chapitres
TOTAL_CHAPTERS = 1189

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

# Nombre de chapitres par livre (pour détection complète)
CHAPTER_COUNTS = {
    "01_GEN": 50, "02_EXO": 40, "03_LEV": 27, "04_NUM": 36, "05_DEU": 34,
    "06_JOS": 24, "07_JDG": 21, "08_RUT": 4, "09_1SAM": 31, "10_2SAM": 24,
    "11_1KI": 22, "12_2KI": 25, "13_1CH": 29, "14_2CH": 36, "15_EZR": 10,
    "16_NEH": 13, "17_EST": 10, "18_JOB": 42, "19_PSA": 150, "20_PRO": 31,
    "21_ECC": 12, "22_SON": 8, "23_ISA": 66, "24_JER": 52, "25_LAM": 5,
    "26_EZE": 48, "27_DAN": 12, "28_HOS": 14, "29_JOE": 3, "30_AMO": 9,
    "31_OBA": 1, "32_JON": 4, "33_MIC": 7, "34_NAH": 3, "35_HAB": 3,
    "36_ZEP": 3, "37_HAG": 2, "38_ZEC": 14, "39_MAL": 4, "40_MAT": 28,
    "41_MAR": 16, "42_LUK": 24, "43_JOH": 21, "44_ACT": 28, "45_ROM": 16,
    "46_1CO": 16, "47_2CO": 13, "48_GAL": 6, "49_EPH": 6, "50_PHP": 4,
    "51_COL": 4, "52_1TH": 5, "53_2TH": 3, "54_1TI": 6, "55_2TI": 4,
    "56_TIT": 3, "57_PHM": 1, "58_HEB": 13, "59_JAS": 5, "60_1PE": 5,
    "61_2PE": 3, "62_1JO": 5, "63_2JO": 1, "64_3JO": 1, "65_JUD": 1,
    "66_REV": 22
}


class GenerationMonitor:
    def __init__(self):
        self.output_dir = SUNO_OUTPUT_DIR
        self.history_file = Path("monitor_history.json")
        self.history = self.load_history()
        self.start_time = datetime.now()

    def load_history(self):
        """Charge l'historique des mesures précédentes"""
        if self.history_file.exists():
            try:
                with open(self.history_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass
        return []

    def save_history(self):
        """Sauvegarde l'historique"""
        with open(self.history_file, 'w', encoding='utf-8') as f:
            json.dump(self.history, f, indent=2, ensure_ascii=False)

    def count_mp3s(self):
        """Compte tous les MP3 générés"""
        total = 0
        by_book = {}

        for book_code in BOOK_NAMES.keys():
            book_dir = self.output_dir / book_code

            if book_dir.exists():
                mp3_files = list(book_dir.glob(f"{book_code}_*.mp3"))
                count = len(mp3_files)
                total += count
                by_book[book_code] = count
            else:
                by_book[book_code] = 0

        return total, by_book

    def check_cdn_urls(self):
        """Compte les URLs CDN valides (Suno V5)"""
        total_urls = 0
        valid_urls = 0
        by_book = {}

        for book_code in BOOK_NAMES.keys():
            cdn_file = self.output_dir / book_code / "cdn_urls.json"

            if cdn_file.exists():
                try:
                    with open(cdn_file, 'r', encoding='utf-8') as f:
                        urls = json.load(f)

                    book_total = len(urls)
                    book_valid = sum(1 for url in urls.values() if url.startswith("https://cdn"))

                    total_urls += book_total
                    valid_urls += book_valid
                    by_book[book_code] = {'total': book_total, 'valid': book_valid}
                except:
                    by_book[book_code] = {'total': 0, 'valid': 0}
            else:
                by_book[book_code] = {'total': 0, 'valid': 0}

        return total_urls, valid_urls, by_book

    def get_api_credits(self):
        """Récupère les crédits API restants"""
        try:
            headers = {'Authorization': f'Bearer {SUNO_API_KEY}'}
            response = requests.get('https://api.sunoapi.org/api/v1/generate/credit',
                                   headers=headers, timeout=5)

            if response.status_code == 200:
                data = response.json()
                return data.get('data', None)
        except:
            pass

        return None

    def get_completed_books(self, by_book_count):
        """Détermine quels livres sont complets"""
        completed = []
        incomplete = []

        for book_code, count in by_book_count.items():
            expected = CHAPTER_COUNTS.get(book_code, 0)

            if count >= expected and expected > 0:
                completed.append(book_code)
            elif count > 0:
                incomplete.append((book_code, count, expected))

        return completed, incomplete

    def calculate_eta(self):
        """Calcule l'ETA basé sur l'historique"""
        if len(self.history) < 2:
            return None, None

        # Prendre les 10 dernières mesures
        recent = self.history[-10:]

        # Calculer le taux de génération (chapitres/seconde)
        time_diffs = []
        count_diffs = []

        for i in range(1, len(recent)):
            prev = recent[i-1]
            curr = recent[i]

            time_diff = (datetime.fromisoformat(curr['timestamp']) -
                        datetime.fromisoformat(prev['timestamp'])).total_seconds()

            count_diff = curr['total_mp3s'] - prev['total_mp3s']

            if time_diff > 0 and count_diff > 0:
                time_diffs.append(time_diff)
                count_diffs.append(count_diff)

        if not time_diffs:
            return None, None

        # Taux moyen
        avg_rate = sum(count_diffs) / sum(time_diffs)  # chapitres/seconde

        if avg_rate <= 0:
            return None, None

        # Chapitres restants
        current_total = recent[-1]['total_mp3s']
        remaining = TOTAL_CHAPTERS - current_total

        # Temps restant
        seconds_remaining = remaining / avg_rate
        eta = datetime.now() + timedelta(seconds=seconds_remaining)

        return eta, avg_rate * 3600  # chapitres/heure

    def display_status(self):
        """Affiche le statut actuel"""
        # Nettoyer l'écran (Windows)
        os.system('cls' if os.name == 'nt' else 'clear')

        print("="*80)
        print("  📊 MONITORING GÉNÉRATION - BIBLE CHANTÉE")
        print("="*80)
        print(f"  Heure: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"  Monitoring depuis: {self.start_time.strftime('%H:%M:%S')}")
        print("="*80)
        print()

        # Compter les MP3
        total_mp3s, by_book = self.count_mp3s()

        # Compter les URLs CDN
        total_urls, valid_urls, cdn_by_book = self.check_cdn_urls()

        # Calculer progression
        progress = (total_mp3s / TOTAL_CHAPTERS) * 100
        remaining = TOTAL_CHAPTERS - total_mp3s

        # Livres complets
        completed_books, incomplete_books = self.get_completed_books(by_book)

        # === STATISTIQUES GLOBALES ===
        print("📈 PROGRESSION GLOBALE")
        print("-" * 80)
        print(f"  Chapitres générés:  {total_mp3s:>4} / {TOTAL_CHAPTERS} ({progress:.1f}%)")
        print(f"  Chapitres restants: {remaining:>4}")

        # Crédits API
        api_credits = self.get_api_credits()
        if api_credits is not None:
            cost_needed = remaining * 12  # 12 crédits par chapitre
            print(f"  💳 Crédits API:      {api_credits:>,.0f}")
            print(f"  💰 Coût restant:     {cost_needed:>,.0f} crédits")
            if api_credits >= cost_needed:
                print(f"     ✅ Suffisant ({api_credits - cost_needed:>,.0f} en surplus)")
            else:
                deficit = cost_needed - api_credits
                print(f"     ⚠️  Insuffisant ({deficit:>,.0f} manquants)")

        print()

        # Barre de progression
        bar_width = 60
        filled = int(bar_width * total_mp3s / TOTAL_CHAPTERS)
        bar = '█' * filled + '░' * (bar_width - filled)
        print(f"  [{bar}]")
        print()

        # URLs CDN
        print("🌐 URLS CDN (SUNO V5)")
        print("-" * 80)
        print(f"  URLs totales:       {total_urls:>4}")
        print(f"  URLs CDN valides:   {valid_urls:>4} ({(valid_urls/total_urls*100) if total_urls > 0 else 0:.1f}%)")
        print(f"  URLs obsolètes:     {total_urls - valid_urls:>4}")
        print()

        # Livres
        print("📚 LIVRES")
        print("-" * 80)
        print(f"  Livres complets:    {len(completed_books):>2} / 66")
        print(f"  Livres en cours:    {len(incomplete_books):>2}")
        print()

        # ETA
        eta, rate = self.calculate_eta()
        if eta and rate:
            print("⏱️  ESTIMATION")
            print("-" * 80)
            print(f"  Taux de génération: {rate:.2f} chapitres/heure")
            print(f"  Fin estimée:        {eta.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"  Temps restant:      {str(eta - datetime.now()).split('.')[0]}")
            print()

        # === TOP 10 LIVRES EN COURS ===
        if incomplete_books:
            print("📖 LIVRES EN COURS (Top 10)")
            print("-" * 80)

            sorted_incomplete = sorted(incomplete_books, key=lambda x: x[1], reverse=True)[:10]

            for book_code, count, expected in sorted_incomplete:
                book_name = BOOK_NAMES[book_code]
                book_progress = (count / expected) * 100 if expected > 0 else 0

                # Mini barre
                mini_bar_width = 20
                mini_filled = int(mini_bar_width * count / expected) if expected > 0 else 0
                mini_bar = '█' * mini_filled + '░' * (mini_bar_width - mini_filled)

                # URLs CDN pour ce livre
                cdn_info = cdn_by_book.get(book_code, {'total': 0, 'valid': 0})
                cdn_mark = "✓" if cdn_info['valid'] == count else "⚠"

                print(f"  {book_code} {book_name:20} [{mini_bar}] {count:>3}/{expected:<3} ({book_progress:>5.1f}%) {cdn_mark}")

        # === DERNIERS LIVRES COMPLÉTÉS ===
        if len(completed_books) > 0:
            print()
            print("✅ DERNIERS LIVRES COMPLÉTÉS")
            print("-" * 80)

            recent_completed = completed_books[-5:]
            for book_code in recent_completed:
                book_name = BOOK_NAMES[book_code]
                count = by_book[book_code]
                cdn_info = cdn_by_book.get(book_code, {'total': 0, 'valid': 0})
                cdn_status = "✓ CDN V5" if cdn_info['valid'] == count else "⚠ URLs manquantes"

                print(f"  {book_code} {book_name:20} {count:>3} chapitres  {cdn_status}")

        print()
        print("="*80)
        print(f"  Prochaine mise à jour dans {MONITOR_INTERVAL} secondes...")
        print(f"  Appuyez sur Ctrl+C pour arrêter")
        print("="*80)

        # Sauvegarder dans l'historique
        self.history.append({
            'timestamp': datetime.now().isoformat(),
            'total_mp3s': total_mp3s,
            'total_urls': total_urls,
            'valid_urls': valid_urls,
            'completed_books': len(completed_books)
        })

        # Limiter l'historique à 100 entrées
        if len(self.history) > 100:
            self.history = self.history[-100:]

        self.save_history()

    def run(self, interval=MONITOR_INTERVAL):
        """Lance le monitoring en continu"""
        print("Démarrage du monitoring...")
        print("Affichage dans 2 secondes...")
        time.sleep(2)

        try:
            while True:
                self.display_status()
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n\n[STOP] Monitoring arrêté")
            print("\nStatistiques finales:")
            total_mp3s, _ = self.count_mp3s()
            progress = (total_mp3s / TOTAL_CHAPTERS) * 100
            print(f"  Progression: {total_mp3s}/{TOTAL_CHAPTERS} ({progress:.1f}%)")
            print(f"  Durée monitoring: {datetime.now() - self.start_time}")

    def generate_report(self):
        """Génère un rapport détaillé"""
        print("="*80)
        print("  📊 RAPPORT DÉTAILLÉ - BIBLE CHANTÉE")
        print("="*80)
        print()

        total_mp3s, by_book = self.count_mp3s()
        total_urls, valid_urls, cdn_by_book = self.check_cdn_urls()
        completed_books, incomplete_books = self.get_completed_books(by_book)

        # === SECTION 1: RÉSUMÉ ===
        print("1️⃣  RÉSUMÉ GÉNÉRAL")
        print("-" * 80)
        print(f"Progression:        {total_mp3s}/{TOTAL_CHAPTERS} ({(total_mp3s/TOTAL_CHAPTERS*100):.1f}%)")
        print(f"Livres complets:    {len(completed_books)}/66")
        print(f"URLs CDN valides:   {valid_urls}/{total_urls}")
        print()

        # === SECTION 2: TOUS LES LIVRES ===
        print("2️⃣  DÉTAIL PAR LIVRE")
        print("-" * 80)
        print(f"{'Code':<8} {'Livre':<25} {'Chap':<10} {'URLs CDN':<12} {'Statut':<15}")
        print("-" * 80)

        for book_code in BOOK_NAMES.keys():
            book_name = BOOK_NAMES[book_code]
            count = by_book.get(book_code, 0)
            expected = CHAPTER_COUNTS.get(book_code, 0)
            cdn_info = cdn_by_book.get(book_code, {'total': 0, 'valid': 0})

            if count >= expected and expected > 0:
                status = "✅ Complet"
            elif count > 0:
                status = f"⏳ {count}/{expected}"
            else:
                status = "❌ Pas commencé"

            cdn_status = f"{cdn_info['valid']}/{cdn_info['total']}"

            print(f"{book_code:<8} {book_name:<25} {f'{count}/{expected}':<10} {cdn_status:<12} {status:<15}")

        print()

        # === SECTION 3: LIVRES MANQUANTS ===
        missing_books = [code for code in BOOK_NAMES.keys() if by_book.get(code, 0) == 0]

        if missing_books:
            print("3️⃣  LIVRES ENTIÈREMENT MANQUANTS")
            print("-" * 80)
            for book_code in missing_books:
                book_name = BOOK_NAMES[book_code]
                expected = CHAPTER_COUNTS[book_code]
                print(f"  {book_code} {book_name:20} ({expected} chapitres)")
            print()

        # === SECTION 4: CHAPITRES MANQUANTS PAR LIVRE ===
        print("4️⃣  CHAPITRES MANQUANTS PAR LIVRE")
        print("-" * 80)

        total_missing = 0

        for book_code, count, expected in incomplete_books:
            book_name = BOOK_NAMES[book_code]
            missing = expected - count

            if missing > 0:
                print(f"  {book_code} {book_name:20} {missing:>3} chapitres manquants")
                total_missing += missing

        print()
        print(f"  TOTAL: {total_missing} chapitres à générer")
        print()

        print("="*80)

        # Sauvegarder le rapport
        report_file = Path("generation_report.txt")
        with open(report_file, 'w', encoding='utf-8') as f:
            # Rediriger stdout vers le fichier
            old_stdout = sys.stdout
            sys.stdout = f
            self.generate_report()
            sys.stdout = old_stdout

        print(f"\n✅ Rapport sauvegardé: {report_file}")


def main():
    """Point d'entrée principal"""
    print("="*80)
    print("  MONITORING GÉNÉRATION - BIBLE CHANTÉE")
    print("="*80)
    print()
    print("OPTIONS:")
    print("  1. Monitoring en temps réel (rafraîchi toutes les 30s)")
    print("  2. Générer un rapport détaillé (snapshot)")
    print()

    choice = input("Votre choix (1-2): ").strip()

    monitor = GenerationMonitor()

    if choice == "1":
        interval = input(f"Intervalle de rafraîchissement (défaut: {MONITOR_INTERVAL}s): ").strip()
        interval = int(interval) if interval else MONITOR_INTERVAL

        print(f"\nDémarrage monitoring toutes les {interval} secondes...")
        time.sleep(1)

        monitor.run(interval=interval)

    elif choice == "2":
        monitor.generate_report()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[STOP] Arrêté")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
