#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Upload Bible Chantée Confessions to Archive.org
12 collections (one per language)
120 total files (12 × 10)
"""

import sys
import io
from pathlib import Path
from internetarchive import get_item, get_session, configure

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Configuration
BASE_DIR = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/confessions")

# Language configurations
LANGUAGES = {
    "FR": {"name": "French", "code": "fra"},
    "EN": {"name": "English", "code": "eng"},
    "PT": {"name": "Portuguese", "code": "por"},
    "ES": {"name": "Spanish", "code": "spa"},
    "DE": {"name": "German", "code": "deu"},
    "IT": {"name": "Italian", "code": "ita"},
    "AR": {"name": "Arabic", "code": "ara"},
    "RU": {"name": "Russian", "code": "rus"},
    "ZH": {"name": "Chinese", "code": "chi"},
    "HI": {"name": "Hindi", "code": "hin"},
    "TL": {"name": "Tagalog", "code": "tgl"},
    "SW": {"name": "Swahili", "code": "swa"}
}


def check_ia_configured():
    """Check if ia is configured with credentials"""
    try:
        session = get_session()
        if not session.access_key or not session.secret_key:
            return False
        return True
    except Exception as e:
        print(f"[ERROR] Problem with ia: {e}")
        return False


def configure_ia():
    """Configure ia with Archive.org credentials"""
    print("=" * 80)
    print("  ARCHIVE.ORG CONFIGURATION")
    print("=" * 80)
    print()
    print("To upload to Archive.org, you need to configure your credentials.")
    print()
    print("Run: ia configure")
    print()
    return False


def get_collection_metadata(lang):
    """Generate metadata for a language collection"""
    lang_info = LANGUAGES[lang]

    return {
        'title': f'Bible Chantée - Confessions - {lang_info["name"]}',
        'collection': 'opensource_audio',
        'mediatype': 'audio',
        'subject': ['bible', 'worship', 'confessions', lang_info["name"].lower(), 'music', 'christian', 'faith'],
        'description': f'''Bible Chantée Confessions - {lang_info["name"]} version.

10 biblical confessions transformed into worship songs using AI (GPT-4 + Suno V5).

Confessions:
1. I am a child of God (John 1:12)
2. I am justified by faith (Romans 5:1)
3. I am more than a conqueror (Romans 8:37)
4. I can do all things through Christ (Philippians 4:13)
5. God supplies all my needs (Philippians 4:19)
6. By His stripes I am healed (Isaiah 53:5)
7. No weapon shall prosper (Isaiah 54:17)
8. The Lord is my shepherd (Psalm 23:1)
9. I am blessed (Ephesians 1:3)
10. God's love is in me (Romans 5:5)

Project: https://biblechantee.com
Language: {lang_info["name"]} ({lang})
Format: MP3, ~3-5MB per confession
Generated: January 2026

Part of a multilingual Bible worship project covering 12 languages.''',
        'language': lang_info["code"],
        'creator': 'Bible Chantée - Stéphane Cassani',
        'licenseurl': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        'year': '2026'
    }


def upload_language(lang):
    """Upload all confessions for a specific language"""
    print(f"\n{'='*80}")
    print(f"  Uploading {lang} ({LANGUAGES[lang]['name']}) Confessions")
    print(f"{'='*80}")

    lang_dir = BASE_DIR / lang

    if not lang_dir.exists():
        print(f"  [ERROR] Directory not found: {lang_dir}")
        return 0, 0

    # Find all MP3 files
    mp3_files = sorted(lang_dir.glob("*.mp3"))

    if not mp3_files:
        print(f"  [WARN] No MP3 files found in {lang}")
        return 0, 0

    print(f"  Found {len(mp3_files)} MP3 files")

    # Calculate total size
    total_size = sum(f.stat().st_size for f in mp3_files)
    total_size_mb = total_size / (1024**2)
    print(f"  Total size: {total_size_mb:.2f} MB")

    # Collection ID
    collection_id = f"bible-chantee-confessions-{lang.lower()}"
    print(f"  Collection: {collection_id}")

    # Get or create item
    item = get_item(collection_id)

    # Get metadata
    metadata = get_collection_metadata(lang)

    uploaded = 0
    errors = 0

    for idx, mp3_file in enumerate(mp3_files, 1):
        try:
            # Check if file already exists
            if mp3_file.name in [f['name'] for f in item.files]:
                print(f"  [{idx}/{len(mp3_files)}] ⊘ {mp3_file.name} (exists)")
                uploaded += 1
                continue

            # Upload file
            print(f"  [{idx}/{len(mp3_files)}] ↑ Uploading {mp3_file.name}...", end="", flush=True)

            result = item.upload_file(
                str(mp3_file),
                metadata=metadata if idx == 1 else {},  # Only set metadata on first upload
                access_key=None,
                secret_key=None,
                verbose=False,
                verify=True,
                checksum=True
            )

            if result:
                uploaded += 1
                print(f" ✓")
            else:
                errors += 1
                print(f" ✗ Failed")

        except Exception as e:
            errors += 1
            print(f"  [ERROR] Failed to upload {mp3_file.name}: {e}")

    print(f"\n  [RESULT] {uploaded} uploaded, {errors} errors")
    print(f"  URL: https://archive.org/details/{collection_id}")

    return uploaded, errors


def main():
    """Upload all confessions to Archive.org"""
    print("=" * 80)
    print("  UPLOAD CONFESSIONS TO ARCHIVE.ORG")
    print("=" * 80)
    print(f"  Source: {BASE_DIR}")
    print(f"  Languages: {', '.join(LANGUAGES.keys())}")
    print(f"  Total files: 120 (12 × 10)")
    print("=" * 80)

    # Check ia configuration
    if not check_ia_configured():
        print("\n[ERROR] Archive.org credentials not configured")
        print("Run: ia configure")
        return

    print("\n[OK] Archive.org credentials found")

    input("\nPress ENTER to start upload...")

    total_uploaded = 0
    total_errors = 0

    for lang in LANGUAGES.keys():
        uploaded, errors = upload_language(lang)
        total_uploaded += uploaded
        total_errors += errors

    # Summary
    print("\n" + "=" * 80)
    print("  UPLOAD COMPLETED")
    print("=" * 80)
    print(f"  Total uploaded: {total_uploaded}")
    print(f"  Total errors: {total_errors}")
    print(f"  Success rate: {total_uploaded}/{total_uploaded + total_errors}")
    print("=" * 80)
    print()

    # Generate Archive.org URLs
    print("Archive.org Collections:")
    for lang in LANGUAGES.keys():
        collection_id = f"bible-chantee-confessions-{lang.lower()}"
        print(f"  {lang}: https://archive.org/details/{collection_id}")
    print()

    print("URL Pattern:")
    print(f"https://archive.org/download/bible-chantee-confessions-{{lang}}/{{number}}_{{name}}.mp3")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[INTERRUPTED] Upload cancelled by user")
    except Exception as e:
        print(f"\n[ERROR] Fatal error: {e}")
        import traceback
        traceback.print_exc()
