"""
Backup automatique complet - Bible Chantée
Sauvegarde MP3, vidéos, lyrics, thumbnails et métadonnées
"""
import os
import shutil
import json
import hashlib
from pathlib import Path
from datetime import datetime
import sys

# Configuration
SOURCE_BASE = Path("G:/Mon Drive/01 BibleChantee")
BACKUP_BASE = Path("D:/Backups/BibleChantee")  # Modifier selon votre disque externe

# Dossiers à sauvegarder
BACKUP_FOLDERS = {
    "Suno_Output/FR": "MP3 générés",
    "Videos/FR": "Vidéos MP4",
    "Lyrics/FR": "Fichiers paroles",
    "Thumbnails/FR": "Thumbnails YouTube",
    "HTML_Sync/FR": "Pages HTML synchronisées"
}

# Fichiers importants
BACKUP_FILES = [
    "Scripts/*.py",
    "Scripts/*.bat",
    "Scripts/*.txt",
    "Scripts/*.md",
    "Scripts/*.json"
]


class BackupManager:
    def __init__(self, source_base, backup_base):
        self.source_base = Path(source_base)
        self.backup_base = Path(backup_base)
        self.backup_date = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.backup_dir = self.backup_base / f"backup_{self.backup_date}"
        self.log_file = self.backup_dir / "backup_log.txt"
        self.manifest_file = self.backup_dir / "backup_manifest.json"

        self.stats = {
            'files_copied': 0,
            'files_skipped': 0,
            'total_size': 0,
            'errors': []
        }

        self.manifest = {
            'backup_date': self.backup_date,
            'source': str(self.source_base),
            'folders': {},
            'files': []
        }

    def log(self, message, level="INFO"):
        """Log un message"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_msg = f"[{timestamp}] [{level}] {message}"
        print(log_msg)

        # Sauvegarder dans le fichier de log
        if self.log_file.parent.exists():
            with open(self.log_file, 'a', encoding='utf-8') as f:
                f.write(log_msg + '\n')

    def calculate_md5(self, file_path):
        """Calcule le hash MD5 d'un fichier"""
        hash_md5 = hashlib.md5()
        try:
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_md5.update(chunk)
            return hash_md5.hexdigest()
        except:
            return None

    def format_size(self, bytes):
        """Formate une taille en bytes vers format lisible"""
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if bytes < 1024.0:
                return f"{bytes:.2f} {unit}"
            bytes /= 1024.0

    def copy_with_verification(self, src, dst):
        """Copie un fichier avec vérification MD5"""
        try:
            # Créer le dossier de destination
            dst.parent.mkdir(parents=True, exist_ok=True)

            # Vérifier si le fichier existe déjà et est identique
            if dst.exists():
                src_hash = self.calculate_md5(src)
                dst_hash = self.calculate_md5(dst)

                if src_hash == dst_hash:
                    self.stats['files_skipped'] += 1
                    return True, "identique"

            # Copier le fichier
            shutil.copy2(src, dst)

            # Vérifier la copie
            src_hash = self.calculate_md5(src)
            dst_hash = self.calculate_md5(dst)

            if src_hash == dst_hash:
                size = src.stat().st_size
                self.stats['files_copied'] += 1
                self.stats['total_size'] += size
                return True, "copié"
            else:
                return False, "erreur MD5"

        except Exception as e:
            return False, str(e)

    def backup_folder(self, rel_path, description):
        """Sauvegarde un dossier complet"""
        source_dir = self.source_base / rel_path
        backup_dir = self.backup_dir / rel_path

        if not source_dir.exists():
            self.log(f"Dossier source introuvable: {source_dir}", "WARNING")
            return

        self.log(f"Backup: {description} ({rel_path})")

        # Compter les fichiers
        all_files = list(source_dir.rglob("*"))
        files = [f for f in all_files if f.is_file()]
        total_files = len(files)

        self.log(f"  Fichiers trouvés: {total_files}")

        folder_stats = {
            'description': description,
            'total_files': total_files,
            'files_copied': 0,
            'files_skipped': 0,
            'total_size': 0,
            'files': []
        }

        # Copier les fichiers
        for i, src_file in enumerate(files, 1):
            rel_file_path = src_file.relative_to(source_dir)
            dst_file = backup_dir / rel_file_path

            # Afficher progression tous les 10 fichiers
            if i % 10 == 0 or i == total_files:
                progress = (i / total_files) * 100
                print(f"\r  Progression: {i}/{total_files} ({progress:.1f}%)", end='', flush=True)

            success, status = self.copy_with_verification(src_file, dst_file)

            if success:
                file_size = src_file.stat().st_size
                file_info = {
                    'path': str(rel_file_path),
                    'size': file_size,
                    'md5': self.calculate_md5(src_file),
                    'modified': datetime.fromtimestamp(src_file.stat().st_mtime).isoformat()
                }
                folder_stats['files'].append(file_info)

                if status == "copié":
                    folder_stats['files_copied'] += 1
                    folder_stats['total_size'] += file_size
                else:
                    folder_stats['files_skipped'] += 1
            else:
                error_msg = f"Erreur copie {src_file}: {status}"
                self.log(error_msg, "ERROR")
                self.stats['errors'].append(error_msg)

        print()  # Nouvelle ligne après la progression

        self.log(f"  ✓ Copiés: {folder_stats['files_copied']}")
        self.log(f"  ↷ Identiques: {folder_stats['files_skipped']}")
        self.log(f"  📦 Taille: {self.format_size(folder_stats['total_size'])}")

        self.manifest['folders'][rel_path] = folder_stats

    def backup_scripts(self):
        """Sauvegarde les scripts et fichiers de configuration"""
        self.log("Backup: Scripts et configuration")

        scripts_dir = Path("C:/ScriptBible/bible-chantee/Scripts")
        backup_scripts_dir = self.backup_dir / "Scripts"

        if not scripts_dir.exists():
            self.log(f"Dossier scripts introuvable: {scripts_dir}", "WARNING")
            return

        # Extensions à sauvegarder
        extensions = ['.py', '.bat', '.txt', '.md', '.json', '.vbs']

        files = []
        for ext in extensions:
            files.extend(scripts_dir.glob(f"*{ext}"))

        self.log(f"  Fichiers trouvés: {len(files)}")

        for src_file in files:
            dst_file = backup_scripts_dir / src_file.name
            success, status = self.copy_with_verification(src_file, dst_file)

            if success:
                file_info = {
                    'path': src_file.name,
                    'size': src_file.stat().st_size,
                    'md5': self.calculate_md5(src_file)
                }
                self.manifest['files'].append(file_info)

        self.log(f"  ✓ Scripts sauvegardés: {len(files)}")

    def backup_github_repo(self):
        """Sauvegarde le repository GitHub"""
        self.log("Backup: Repository GitHub")

        repo_dir = Path("C:/ScriptBible/bible-chantee")
        backup_repo_dir = self.backup_dir / "GitHub"

        if not repo_dir.exists():
            self.log(f"Repository introuvable: {repo_dir}", "WARNING")
            return

        # Exclure .git (trop gros)
        excluded = ['.git', 'node_modules', '__pycache__']

        files_copied = 0

        for src_file in repo_dir.rglob("*"):
            if src_file.is_file():
                # Vérifier si dans un dossier exclu
                if any(exc in src_file.parts for exc in excluded):
                    continue

                rel_path = src_file.relative_to(repo_dir)
                dst_file = backup_repo_dir / rel_path

                success, status = self.copy_with_verification(src_file, dst_file)
                if success and status == "copié":
                    files_copied += 1

        self.log(f"  ✓ Fichiers sauvegardés: {files_copied}")

    def create_readme(self):
        """Crée un fichier README dans le backup"""
        readme_path = self.backup_dir / "README.txt"

        content = f"""
================================================================================
  BACKUP BIBLE CHANTÉE - {self.backup_date}
================================================================================

Date du backup: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Source: {self.source_base}

STATISTIQUES:
-------------
Fichiers copiés:   {self.stats['files_copied']}
Fichiers identiques: {self.stats['files_skipped']}
Taille totale:     {self.format_size(self.stats['total_size'])}
Erreurs:           {len(self.stats['errors'])}

DOSSIERS SAUVEGARDÉS:
---------------------
"""

        for rel_path, description in BACKUP_FOLDERS.items():
            folder_stats = self.manifest['folders'].get(rel_path)
            if folder_stats:
                content += f"\n{rel_path}:\n"
                content += f"  Description: {description}\n"
                content += f"  Fichiers: {folder_stats['files_copied']} copiés, {folder_stats['files_skipped']} identiques\n"
                content += f"  Taille: {self.format_size(folder_stats['total_size'])}\n"

        if self.stats['errors']:
            content += "\n\nERREURS:\n--------\n"
            for error in self.stats['errors']:
                content += f"- {error}\n"

        content += """

RESTAURATION:
-------------
Pour restaurer, copier les dossiers depuis ce backup vers:
  G:\\Mon Drive\\01 BibleChantee\\

VÉRIFICATION:
-------------
Le fichier backup_manifest.json contient les hash MD5 de tous les fichiers
pour vérifier l'intégrité du backup.

================================================================================
"""

        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(content)

    def save_manifest(self):
        """Sauvegarde le manifest JSON"""
        with open(self.manifest_file, 'w', encoding='utf-8') as f:
            json.dump(self.manifest, f, indent=2, ensure_ascii=False)

    def run_backup(self, folders_only=False, incremental=False):
        """Lance le backup complet"""
        print("="*80)
        print("  💾 BACKUP AUTOMATIQUE - BIBLE CHANTÉE")
        print("="*80)
        print(f"  Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"  Source: {self.source_base}")
        print(f"  Destination: {self.backup_dir}")
        print("="*80)
        print()

        # Créer le dossier de backup
        self.backup_dir.mkdir(parents=True, exist_ok=True)

        start_time = datetime.now()

        # Sauvegarder les dossiers
        for rel_path, description in BACKUP_FOLDERS.items():
            self.backup_folder(rel_path, description)
            print()

        if not folders_only:
            # Sauvegarder les scripts
            self.backup_scripts()
            print()

            # Sauvegarder le repo GitHub
            self.backup_github_repo()
            print()

        # Créer le README
        self.create_readme()

        # Sauvegarder le manifest
        self.save_manifest()

        end_time = datetime.now()
        duration = end_time - start_time

        print("="*80)
        print("  ✅ BACKUP TERMINÉ")
        print("="*80)
        print(f"  Fichiers copiés:     {self.stats['files_copied']}")
        print(f"  Fichiers identiques: {self.stats['files_skipped']}")
        print(f"  Taille totale:       {self.format_size(self.stats['total_size'])}")
        print(f"  Durée:               {duration}")
        print(f"  Erreurs:             {len(self.stats['errors'])}")
        print()
        print(f"  📂 Backup sauvegardé dans: {self.backup_dir}")
        print("="*80)

    def verify_backup(self):
        """Vérifie l'intégrité d'un backup existant"""
        print("="*80)
        print("  🔍 VÉRIFICATION DU BACKUP")
        print("="*80)

        if not self.manifest_file.exists():
            print("[ERROR] Fichier manifest introuvable!")
            return False

        # Charger le manifest
        with open(self.manifest_file, 'r', encoding='utf-8') as f:
            manifest = json.load(f)

        total_files = 0
        verified = 0
        errors = 0

        print("\nVérification des dossiers...")

        for rel_path, folder_data in manifest['folders'].items():
            print(f"\n{rel_path}:")
            backup_folder = self.backup_dir / rel_path

            for file_info in folder_data['files']:
                total_files += 1
                file_path = backup_folder / file_info['path']

                if not file_path.exists():
                    print(f"  ❌ Manquant: {file_info['path']}")
                    errors += 1
                    continue

                # Vérifier le hash MD5
                current_hash = self.calculate_md5(file_path)

                if current_hash == file_info['md5']:
                    verified += 1
                else:
                    print(f"  ⚠️  Hash différent: {file_info['path']}")
                    errors += 1

        print("\n" + "="*80)
        print("  RÉSULTAT VÉRIFICATION")
        print("="*80)
        print(f"  Fichiers vérifiés: {verified}/{total_files}")
        print(f"  Erreurs: {errors}")

        if errors == 0:
            print("  ✅ Backup intègre!")
        else:
            print("  ⚠️  Backup endommagé!")

        print("="*80)

        return errors == 0


def list_backups(backup_base):
    """Liste tous les backups existants"""
    backup_base = Path(backup_base)

    if not backup_base.exists():
        print(f"[ERROR] Dossier de backup introuvable: {backup_base}")
        return []

    backups = sorted(backup_base.glob("backup_*"), reverse=True)

    if not backups:
        print("Aucun backup trouvé")
        return []

    print("\n📦 BACKUPS DISPONIBLES:")
    print("-" * 80)

    for i, backup_dir in enumerate(backups, 1):
        readme = backup_dir / "README.txt"
        manifest = backup_dir / "backup_manifest.json"

        size = sum(f.stat().st_size for f in backup_dir.rglob('*') if f.is_file())

        # Extraire la date du nom
        date_str = backup_dir.name.replace("backup_", "")
        date_formatted = f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]} {date_str[9:11]}:{date_str[11:13]}:{date_str[13:15]}"

        status = "✓" if manifest.exists() else "⚠"

        print(f"{i}. {status} {date_formatted} - {BackupManager(SOURCE_BASE, BACKUP_BASE).format_size(size)}")
        print(f"   Chemin: {backup_dir}")

    print("-" * 80)

    return backups


def main():
    """Point d'entrée principal"""
    print("="*80)
    print("  💾 BACKUP AUTOMATIQUE - BIBLE CHANTÉE")
    print("="*80)
    print()
    print("CONFIGURATION:")
    print(f"  Source:      {SOURCE_BASE}")
    print(f"  Destination: {BACKUP_BASE}")
    print()
    print("OPTIONS:")
    print("  1. Backup complet (tous les fichiers)")
    print("  2. Backup incrémental (uniquement nouveaux/modifiés)")
    print("  3. Backup MP3 seulement")
    print("  4. Backup vidéos seulement")
    print("  5. Vérifier un backup existant")
    print("  6. Lister tous les backups")
    print()

    choice = input("Votre choix (1-6): ").strip()

    if choice == "1":
        # Backup complet
        confirm = input("\n⚠️  Backup complet peut prendre beaucoup de temps. Continuer? (oui/non): ").strip().lower()

        if confirm == "oui":
            manager = BackupManager(SOURCE_BASE, BACKUP_BASE)
            manager.run_backup()

    elif choice == "2":
        # Backup incrémental
        manager = BackupManager(SOURCE_BASE, BACKUP_BASE)
        manager.run_backup(incremental=True)

    elif choice == "3":
        # MP3 seulement
        folders_mp3 = {"Suno_Output/FR": "MP3 générés"}
        manager = BackupManager(SOURCE_BASE, BACKUP_BASE)

        # Temporairement remplacer les dossiers
        original_folders = BACKUP_FOLDERS.copy()
        BACKUP_FOLDERS.clear()
        BACKUP_FOLDERS.update(folders_mp3)

        manager.run_backup(folders_only=True)

        BACKUP_FOLDERS.clear()
        BACKUP_FOLDERS.update(original_folders)

    elif choice == "4":
        # Vidéos seulement
        folders_video = {"Videos/FR": "Vidéos MP4"}
        manager = BackupManager(SOURCE_BASE, BACKUP_BASE)

        original_folders = BACKUP_FOLDERS.copy()
        BACKUP_FOLDERS.clear()
        BACKUP_FOLDERS.update(folders_video)

        manager.run_backup(folders_only=True)

        BACKUP_FOLDERS.clear()
        BACKUP_FOLDERS.update(original_folders)

    elif choice == "5":
        # Vérifier un backup
        backups = list_backups(BACKUP_BASE)

        if backups:
            print()
            selection = input("Numéro du backup à vérifier: ").strip()

            try:
                index = int(selection) - 1
                if 0 <= index < len(backups):
                    backup_dir = backups[index]
                    manager = BackupManager(SOURCE_BASE, BACKUP_BASE)
                    manager.backup_dir = backup_dir
                    manager.manifest_file = backup_dir / "backup_manifest.json"
                    manager.verify_backup()
                else:
                    print("[ERROR] Numéro invalide")
            except ValueError:
                print("[ERROR] Entrée invalide")

    elif choice == "6":
        # Lister les backups
        list_backups(BACKUP_BASE)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[STOP] Backup interrompu")
    except Exception as e:
        print(f"\n[ERROR] {e}")
        import traceback
        traceback.print_exc()
