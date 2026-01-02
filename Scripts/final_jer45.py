"""Génération du dernier chapitre TL: 24_JER_45"""
import sys
import os
from pathlib import Path
from suno_api_generator import process_book

SUNO_API_KEY = os.environ.get('SUNO_API_KEY', 'baa2f6a4d4244bd9a4b5c0c755db5dab')

print("="*80)
print("  DERNIER CHAPITRE TL - 24_JER_45")
print("="*80)
print("\n🎯 Tentative finale pour compléter TL à 100% (1189/1189)\n")

project_root = Path(__file__).parent.parent
output_dir = project_root.parent / "Suno_Output/TL/24_JER"
output_file = output_dir / "24_JER_45.mp3"

if output_file.exists():
    print("✅ Le fichier existe déjà!")
    sys.exit(0)

print("🚀 GENERATION 24_JER chapitre 45...")
print("⏱️ Patience... peut prendre jusqu'à 3 minutes\n")

try:
    process_book(
        lang_code="TL",
        book_code="24_JER",
        api_key=SUNO_API_KEY,
        output_dir=output_dir,
        start_chapter=45,
        end_chapter=45
    )

    if output_file.exists():
        print("\n" + "="*80)
        print("  🎊🎊🎊 SUCCÈS COMPLET! 🎊🎊🎊")
        print("="*80)
        print("\n✅ 24_JER_45.mp3 GENERE")
        print("\n🏆 TL EST MAINTENANT À 100% (1189/1189 CHAPITRES)!")
        print("\n🌍 Bible complète en Tagalog disponible!")
    else:
        print("\n⚠️ Échec - fichier non créé")
        print("💡 Suggestion: Réessayer dans quelques heures quand API moins chargée")

except Exception as e:
    print(f"\n❌ ERREUR: {e}")
    print("💡 Suggestion: Réessayer plus tard")

print("\n" + "="*80)
