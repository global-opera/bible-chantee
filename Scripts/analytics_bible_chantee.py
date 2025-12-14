"""
Analytics avancées - Bible Chantée
Statistiques, tendances, prédictions et insights
"""
import json
import os
from pathlib import Path
from datetime import datetime, timedelta
from collections import defaultdict
import statistics

# Configuration
SUNO_OUTPUT_DIR = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/FR")
ANALYTICS_DIR = Path("G:/Mon Drive/01 BibleChantee/Analytics")
ANALYTICS_DIR.mkdir(parents=True, exist_ok=True)

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


class BibleAnalytics:
    def __init__(self):
        self.output_dir = SUNO_OUTPUT_DIR
        self.analytics_dir = ANALYTICS_DIR
        self.data = {}
        self.history = []
        self.load_history()

    def load_history(self):
        """Charge l'historique des analytics"""
        history_file = self.analytics_dir / "analytics_history.json"
        if history_file.exists():
            try:
                with open(history_file, 'r', encoding='utf-8') as f:
                    self.history = json.load(f)
            except:
                self.history = []

    def save_history(self):
        """Sauvegarde l'historique"""
        history_file = self.analytics_dir / "analytics_history.json"
        with open(history_file, 'w', encoding='utf-8') as f:
            json.dump(self.history, f, indent=2, ensure_ascii=False)

    def collect_data(self):
        """Collecte toutes les données"""
        print("📊 Collecte des données...")

        data = {
            'timestamp': datetime.now().isoformat(),
            'books': {},
            'files': {},
            'sizes': {}
        }

        total_size = 0
        total_mp3s = 0

        for book_code in BOOK_NAMES.keys():
            book_dir = self.output_dir / book_code

            if book_dir.exists():
                mp3_files = list(book_dir.glob(f"{book_code}_*.mp3"))
                expected = CHAPTER_COUNTS[book_code]

                # Tailles de fichiers
                sizes = []
                for mp3 in mp3_files:
                    size = mp3.stat().st_size
                    sizes.append(size)
                    total_size += size

                total_mp3s += len(mp3_files)

                # CDN URLs
                cdn_file = book_dir / "cdn_urls.json"
                cdn_urls = 0
                valid_cdn = 0

                if cdn_file.exists():
                    try:
                        with open(cdn_file, 'r', encoding='utf-8') as f:
                            urls = json.load(f)
                        cdn_urls = len(urls)
                        valid_cdn = sum(1 for url in urls.values() if url.startswith("https://cdn"))
                    except:
                        pass

                data['books'][book_code] = {
                    'mp3_count': len(mp3_files),
                    'expected': expected,
                    'progress': len(mp3_files) / expected if expected > 0 else 0,
                    'total_size': sum(sizes),
                    'avg_size': statistics.mean(sizes) if sizes else 0,
                    'min_size': min(sizes) if sizes else 0,
                    'max_size': max(sizes) if sizes else 0,
                    'cdn_urls': cdn_urls,
                    'valid_cdn': valid_cdn
                }

        data['global'] = {
            'total_mp3s': total_mp3s,
            'total_size': total_size,
            'total_chapters': 1189,
            'progress': total_mp3s / 1189
        }

        self.data = data
        self.history.append(data)

        # Limiter l'historique à 1000 entrées
        if len(self.history) > 1000:
            self.history = self.history[-1000:]

        self.save_history()

        print(f"✓ Données collectées: {total_mp3s} chapitres, {self.format_size(total_size)}")

        return data

    def format_size(self, bytes):
        """Formate une taille en bytes"""
        for unit in ['B', 'KB', 'MB', 'GB']:
            if bytes < 1024:
                return f"{bytes:.2f} {unit}"
            bytes /= 1024

    def calculate_trends(self):
        """Calcule les tendances sur l'historique"""
        if len(self.history) < 2:
            return None

        print("\n📈 Calcul des tendances...")

        # Prendre les 30 dernières entrées
        recent = self.history[-30:]

        trends = {
            'daily_average': 0,
            'weekly_projection': 0,
            'eta_days': 0,
            'fastest_book': None,
            'slowest_book': None
        }

        # Calculer le taux de génération
        time_diffs = []
        count_diffs = []

        for i in range(1, len(recent)):
            prev = recent[i-1]
            curr = recent[i]

            try:
                time_diff = (datetime.fromisoformat(curr['timestamp']) -
                           datetime.fromisoformat(prev['timestamp'])).total_seconds() / 3600  # heures

                count_diff = curr['global']['total_mp3s'] - prev['global']['total_mp3s']

                if time_diff > 0 and count_diff > 0:
                    time_diffs.append(time_diff)
                    count_diffs.append(count_diff)
            except:
                continue

        if time_diffs:
            # Taux moyen (chapitres/heure)
            rate_per_hour = sum(count_diffs) / sum(time_diffs)
            trends['daily_average'] = rate_per_hour * 24
            trends['weekly_projection'] = rate_per_hour * 24 * 7

            # ETA
            current_count = recent[-1]['global']['total_mp3s']
            remaining = 1189 - current_count

            if rate_per_hour > 0:
                hours_remaining = remaining / rate_per_hour
                trends['eta_days'] = hours_remaining / 24
                trends['eta_date'] = (datetime.now() + timedelta(hours=hours_remaining)).isoformat()

        # Analyser les livres les plus rapides/lents
        book_rates = {}

        for book_code in BOOK_NAMES.keys():
            if len(recent) >= 2:
                first_count = recent[0]['books'].get(book_code, {}).get('mp3_count', 0)
                last_count = recent[-1]['books'].get(book_code, {}).get('mp3_count', 0)

                diff = last_count - first_count

                if diff > 0:
                    time_span = (datetime.fromisoformat(recent[-1]['timestamp']) -
                               datetime.fromisoformat(recent[0]['timestamp'])).total_seconds() / 3600

                    rate = diff / time_span if time_span > 0 else 0
                    book_rates[book_code] = rate

        if book_rates:
            fastest = max(book_rates, key=book_rates.get)
            slowest = min(book_rates, key=book_rates.get)

            trends['fastest_book'] = {
                'code': fastest,
                'name': BOOK_NAMES[fastest],
                'rate': book_rates[fastest]
            }

            trends['slowest_book'] = {
                'code': slowest,
                'name': BOOK_NAMES[slowest],
                'rate': book_rates[slowest]
            }

        return trends

    def analyze_quality(self):
        """Analyse la qualité des fichiers"""
        print("\n🔍 Analyse qualité...")

        quality = {
            'avg_file_size': 0,
            'size_consistency': 0,
            'cdn_coverage': 0,
            'quality_score': 0
        }

        all_sizes = []
        total_cdn = 0
        valid_cdn = 0

        for book_code, book_data in self.data['books'].items():
            if book_data['mp3_count'] > 0:
                all_sizes.append(book_data['avg_size'])
                total_cdn += book_data['cdn_urls']
                valid_cdn += book_data['valid_cdn']

        if all_sizes:
            quality['avg_file_size'] = statistics.mean(all_sizes)
            quality['size_std_dev'] = statistics.stdev(all_sizes) if len(all_sizes) > 1 else 0
            quality['size_consistency'] = 100 - (quality['size_std_dev'] / quality['avg_file_size'] * 100) if quality['avg_file_size'] > 0 else 0

        if total_cdn > 0:
            quality['cdn_coverage'] = (valid_cdn / total_cdn) * 100

        # Score de qualité global
        quality['quality_score'] = (quality['size_consistency'] + quality['cdn_coverage']) / 2

        return quality

    def identify_gaps(self):
        """Identifie les chapitres manquants"""
        print("\n🔍 Identification des gaps...")

        gaps = {
            'missing_chapters': [],
            'incomplete_books': [],
            'total_missing': 0
        }

        for book_code, book_data in self.data['books'].items():
            if book_data['mp3_count'] < book_data['expected']:
                missing = book_data['expected'] - book_data['mp3_count']

                gaps['incomplete_books'].append({
                    'code': book_code,
                    'name': BOOK_NAMES[book_code],
                    'have': book_data['mp3_count'],
                    'need': book_data['expected'],
                    'missing': missing,
                    'progress': book_data['progress'] * 100
                })

                gaps['total_missing'] += missing

                # Identifier chapitres spécifiques manquants
                book_dir = self.output_dir / book_code
                if book_dir.exists():
                    existing_chapters = set()
                    for mp3 in book_dir.glob(f"{book_code}_*.mp3"):
                        import re
                        match = re.search(r'_(\d+)\.mp3$', mp3.name)
                        if match:
                            existing_chapters.add(int(match.group(1)))

                    for ch in range(1, book_data['expected'] + 1):
                        if ch not in existing_chapters:
                            gaps['missing_chapters'].append({
                                'book_code': book_code,
                                'book_name': BOOK_NAMES[book_code],
                                'chapter': ch
                            })

        # Trier par nombre de chapitres manquants
        gaps['incomplete_books'].sort(key=lambda x: x['missing'], reverse=True)

        return gaps

    def generate_report(self):
        """Génère un rapport complet"""
        self.collect_data()

        print("\n" + "="*80)
        print("  📊 RAPPORT ANALYTICS COMPLET - BIBLE CHANTÉE")
        print("="*80)

        # 1. Vue d'ensemble
        print("\n1️⃣  VUE D'ENSEMBLE")
        print("-" * 80)
        global_data = self.data['global']
        print(f"Chapitres générés:  {global_data['total_mp3s']:>4} / {global_data['total_chapters']}")
        print(f"Progression:        {global_data['progress']*100:>5.1f}%")
        print(f"Taille totale:      {self.format_size(global_data['total_size'])}")
        print(f"Taille moyenne/ch:  {self.format_size(global_data['total_size']/global_data['total_mp3s']) if global_data['total_mp3s'] > 0 else '0 B'}")

        # 2. Tendances
        trends = self.calculate_trends()
        if trends:
            print("\n2️⃣  TENDANCES")
            print("-" * 80)
            print(f"Taux quotidien:     {trends['daily_average']:.1f} chapitres/jour")
            print(f"Projection hebdo:   {trends['weekly_projection']:.0f} chapitres/semaine")

            if trends.get('eta_days'):
                print(f"ETA complétion:     {trends['eta_days']:.1f} jours")
                eta_date = datetime.fromisoformat(trends['eta_date'])
                print(f"Date estimée:       {eta_date.strftime('%Y-%m-%d %H:%M')}")

            if trends.get('fastest_book'):
                print(f"\nLivre le plus rapide: {trends['fastest_book']['name']}")
                print(f"  Taux: {trends['fastest_book']['rate']:.2f} ch/h")

            if trends.get('slowest_book'):
                print(f"\nLivre le plus lent:   {trends['slowest_book']['name']}")
                print(f"  Taux: {trends['slowest_book']['rate']:.2f} ch/h")

        # 3. Qualité
        quality = self.analyze_quality()
        print("\n3️⃣  QUALITÉ")
        print("-" * 80)
        print(f"Taille moyenne:     {self.format_size(quality['avg_file_size'])}")
        print(f"Consistance:        {quality['size_consistency']:.1f}%")
        print(f"CDN V5 coverage:    {quality['cdn_coverage']:.1f}%")
        print(f"Score qualité:      {quality['quality_score']:.1f}/100")

        # 4. Gaps
        gaps = self.identify_gaps()
        print("\n4️⃣  CHAPITRES MANQUANTS")
        print("-" * 80)
        print(f"Total manquants:    {gaps['total_missing']} chapitres")
        print(f"Livres incomplets:  {len(gaps['incomplete_books'])}")

        if gaps['incomplete_books']:
            print("\nTop 10 livres incomplets:")
            for book in gaps['incomplete_books'][:10]:
                print(f"  {book['code']} {book['name']:20} {book['have']:>3}/{book['need']:<3} ({book['progress']:>5.1f}%) - {book['missing']:>3} manquants")

        # 5. Top/Bottom performers
        print("\n5️⃣  PERFORMANCE PAR TESTAMENT")
        print("-" * 80)

        at_books = [code for code in BOOK_NAMES.keys() if int(code.split('_')[0]) <= 39]
        nt_books = [code for code in BOOK_NAMES.keys() if int(code.split('_')[0]) > 39]

        at_total = sum(self.data['books'].get(code, {}).get('mp3_count', 0) for code in at_books)
        at_expected = sum(CHAPTER_COUNTS[code] for code in at_books)
        nt_total = sum(self.data['books'].get(code, {}).get('mp3_count', 0) for code in nt_books)
        nt_expected = sum(CHAPTER_COUNTS[code] for code in nt_books)

        print(f"Ancien Testament:   {at_total:>4} / {at_expected} ({at_total/at_expected*100:.1f}%)")
        print(f"Nouveau Testament:  {nt_total:>4} / {nt_expected} ({nt_total/nt_expected*100:.1f}%)")

        print("\n" + "="*80)

        # Sauvegarder le rapport
        report_file = self.analytics_dir / f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(report_file, 'w', encoding='utf-8') as f:
            # Rediriger stdout
            import sys
            old_stdout = sys.stdout
            sys.stdout = f
            self.generate_report()
            sys.stdout = old_stdout

        # Export JSON
        json_file = self.analytics_dir / "latest_analytics.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump({
                'data': self.data,
                'trends': trends,
                'quality': quality,
                'gaps': gaps
            }, f, indent=2, ensure_ascii=False)

        print(f"\n✅ Rapport sauvegardé: {report_file}")
        print(f"✅ Données JSON: {json_file}")

    def export_csv(self):
        """Export données en CSV"""
        import csv

        csv_file = self.analytics_dir / "books_stats.csv"

        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)

            writer.writerow([
                'Code', 'Livre', 'MP3s', 'Attendus', 'Progression%',
                'Taille Totale', 'Taille Moyenne', 'URLs CDN', 'URLs Valides'
            ])

            for book_code in sorted(BOOK_NAMES.keys()):
                book_data = self.data['books'].get(book_code, {})
                if book_data:
                    writer.writerow([
                        book_code,
                        BOOK_NAMES[book_code],
                        book_data.get('mp3_count', 0),
                        book_data.get('expected', 0),
                        f"{book_data.get('progress', 0)*100:.1f}",
                        book_data.get('total_size', 0),
                        book_data.get('avg_size', 0),
                        book_data.get('cdn_urls', 0),
                        book_data.get('valid_cdn', 0)
                    ])

        print(f"✅ Export CSV: {csv_file}")


def main():
    """Point d'entrée principal"""
    print("="*80)
    print("  📊 ANALYTICS AVANCÉES - BIBLE CHANTÉE")
    print("="*80)
    print()

    analytics = BibleAnalytics()

    print("OPTIONS:")
    print("  1. Générer rapport complet")
    print("  2. Voir les tendances")
    print("  3. Analyser la qualité")
    print("  4. Identifier les gaps")
    print("  5. Export CSV")
    print()

    choice = input("Votre choix (1-5, ou ALL pour tout): ").strip().upper()

    if choice == "ALL" or choice == "1":
        analytics.generate_report()

    elif choice == "2":
        analytics.collect_data()
        trends = analytics.calculate_trends()
        if trends:
            print(json.dumps(trends, indent=2, ensure_ascii=False))

    elif choice == "3":
        analytics.collect_data()
        quality = analytics.analyze_quality()
        print(json.dumps(quality, indent=2, ensure_ascii=False))

    elif choice == "4":
        analytics.collect_data()
        gaps = analytics.identify_gaps()
        print(f"\nChapitres manquants: {gaps['total_missing']}")
        for book in gaps['incomplete_books'][:20]:
            print(f"  {book['name']:20} {book['have']}/{book['need']} ({book['progress']:.1f}%)")

    elif choice == "5":
        analytics.collect_data()
        analytics.export_csv()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[STOP] Arrêté")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
