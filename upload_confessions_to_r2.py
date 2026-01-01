#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Upload Confession MP3 files to Cloudflare R2
120 confessions (12 langues × 10)
"""

import sys
import io
import boto3
from botocore.client import Config
from pathlib import Path
import urllib3

# Configure UTF-8 encoding for Windows
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# R2 Configuration
R2_ACCOUNT_ID = "639b9becb7f3884bc3aa3d27b80e671d"
R2_ACCESS_KEY = "6c04a4535b46a47f1bb399ce56caa5e4"
R2_SECRET_KEY = "dfed1692741b07334e6246d7620cfaff8df840e0a59ee8ce4d51e1ea1acdd7bd"
R2_ENDPOINT = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
BUCKET_NAME = "bible-chantee-audio"

# Source directory
SOURCE_DIR = Path("G:/Mon Drive/01 BibleChantee/Suno_Output/confessions")

# Languages
LANGUAGES = ["FR", "EN", "PT", "ES", "DE", "IT", "AR", "RU", "ZH", "HI", "TL", "SW"]


def upload_language(lang):
    """Upload all confessions for a specific language"""
    print(f"\n{'='*80}")
    print(f"  Uploading {lang} Confessions")
    print(f"{'='*80}")

    lang_dir = SOURCE_DIR / lang

    if not lang_dir.exists():
        print(f"  [ERROR] Directory not found: {lang_dir}")
        return 0, 0

    # Create S3 client with SSL verification disabled
    s3_client = boto3.client(
        's3',
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=R2_ACCESS_KEY,
        aws_secret_access_key=R2_SECRET_KEY,
        config=Config(signature_version='s3v4'),
        verify=False
    )

    # Find all MP3 files
    mp3_files = sorted(lang_dir.glob("*.mp3"))

    if not mp3_files:
        print(f"  [WARN] No MP3 files found in {lang}")
        return 0, 0

    print(f"  Found {len(mp3_files)} MP3 files")

    uploaded = 0
    errors = 0

    for mp3_file in mp3_files:
        # R2 key structure: confessions/FR/01_Joie.mp3
        r2_key = f"confessions/{lang}/{mp3_file.name}"

        try:
            # Check if file already exists
            try:
                s3_client.head_object(Bucket=BUCKET_NAME, Key=r2_key)
                print(f"  [{uploaded + 1}/{len(mp3_files)}] ⊘ {mp3_file.name} (exists)")
                uploaded += 1
                continue
            except:
                pass  # File doesn't exist, proceed with upload

            # Upload file
            s3_client.upload_file(
                str(mp3_file),
                BUCKET_NAME,
                r2_key,
                ExtraArgs={'ContentType': 'audio/mpeg'}
            )
            uploaded += 1
            print(f"  [{uploaded}/{len(mp3_files)}] ✓ {mp3_file.name}")

        except Exception as e:
            errors += 1
            print(f"  [ERROR] Failed to upload {mp3_file.name}: {e}")

    print(f"  [RESULT] {uploaded} uploaded, {errors} errors")
    return uploaded, errors


def main():
    """Upload all confessions to R2"""
    print("=" * 80)
    print("  UPLOAD CONFESSIONS TO CLOUDFLARE R2")
    print("=" * 80)
    print(f"  Source: {SOURCE_DIR}")
    print(f"  Bucket: {BUCKET_NAME}")
    print(f"  Languages: {', '.join(LANGUAGES)}")
    print(f"  Total files: 120 (12 × 10)")
    print("=" * 80)

    input("\nPress ENTER to start upload...")

    total_uploaded = 0
    total_errors = 0

    for lang in LANGUAGES:
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

    # Generate R2 URLs
    print("R2 URL Pattern:")
    print(f"https://audio.biblechantee.com/confessions/{{LANG}}/{{NUMBER}}_{{NAME}}.mp3")
    print()
    print("Examples:")
    print(f"https://audio.biblechantee.com/confessions/FR/01_Joie.mp3")
    print(f"https://audio.biblechantee.com/confessions/EN/01_Joy.mp3")
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
