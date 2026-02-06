# Fichiers à Uploader vers R2

Date: 2026-02-01

## Résumé

- **Total à uploader**: 30 fichiers MP3
- **Catégorie**: Confessions (FR, PT, TL)
- **Source actuelle**: Archive.org
- **Destination**: Cloudflare R2

## Localisation des Fichiers Sources

Les fichiers MP3 se trouvent probablement dans:
- Google Drive: `G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\`
- Ou localement: `C:\ScriptBible\bible-chantee\audio\confessions\`

## Fichiers à Uploader

### Confessions FR (10 fichiers)

Source Archive.org: `https://archive.org/download/bible-chantee-confessions-fr/`

| Fichier Source | Destination R2 | Taille Estimée |
|----------------|----------------|----------------|
| 01_Joie.mp3 | confessions/FR_01_Joie.mp3 | ~3 MB |
| 02_Gueri.mp3 | confessions/FR_02_Gueri.mp3 | ~3 MB |
| 03_Sante.mp3 | confessions/FR_03_Sante.mp3 | ~3 MB |
| 04_Vainqueur.mp3 | confessions/FR_04_Vainqueur.mp3 | ~3 MB |
| 05_Prospere.mp3 | confessions/FR_05_Prospere.mp3 | ~3 MB |
| 06_Reconnaissant.mp3 | confessions/FR_06_Reconnaissant.mp3 | ~3 MB |
| 07_Heureux.mp3 | confessions/FR_07_Heureux.mp3 | ~3 MB |
| 08_Beni.mp3 | confessions/FR_08_Beni.mp3 | ~3 MB |
| 09_Amen.mp3 | confessions/FR_09_Amen.mp3 | ~3 MB |
| 10_Shalom.mp3 | confessions/FR_10_Shalom.mp3 | ~3 MB |

### Confessions PT (10 fichiers)

Source Archive.org: `https://archive.org/download/bible-chantee-confessions-pt/`

| Fichier Source | Destination R2 | Taille Estimée |
|----------------|----------------|----------------|
| 01_Alegria.mp3 | confessions/PT_01_Alegria.mp3 | ~3 MB |
| 02_Curado.mp3 | confessions/PT_02_Curado.mp3 | ~3 MB |
| 03_Saude.mp3 | confessions/PT_03_Saude.mp3 | ~3 MB |
| 04_Vencedor.mp3 | confessions/PT_04_Vencedor.mp3 | ~3 MB |
| 05_Prospero.mp3 | confessions/PT_05_Prospero.mp3 | ~3 MB |
| 06_Grato.mp3 | confessions/PT_06_Grato.mp3 | ~3 MB |
| 07_Feliz.mp3 | confessions/PT_07_Feliz.mp3 | ~3 MB |
| 08_Abencoado.mp3 | confessions/PT_08_Abencoado.mp3 | ~3 MB |
| 09_Amem.mp3 | confessions/PT_09_Amem.mp3 | ~3 MB |
| 10_Shalom.mp3 | confessions/PT_10_Shalom.mp3 | ~3 MB |

### Confessions TL (10 fichiers)

Source Archive.org: `https://archive.org/download/bible-chantee-confessions-tl/`

| Fichier Source | Destination R2 | Taille Estimée |
|----------------|----------------|----------------|
| 01_Kagalakan.mp3 | confessions/TL_01_Kagalakan.mp3 | ~3 MB |
| 02_Kagalingan.mp3 | confessions/TL_02_Kagalingan.mp3 | ~3 MB |
| 03_Kalusugan.mp3 | confessions/TL_03_Kalusugan.mp3 | ~3 MB |
| 04_Tagumpay.mp3 | confessions/TL_04_Tagumpay.mp3 | ~3 MB |
| 05_Kasaganaan.mp3 | confessions/TL_05_Kasaganaan.mp3 | ~3 MB |
| 06_Pasasalamat.mp3 | confessions/TL_06_Pasasalamat.mp3 | ~3 MB |
| 07_Kaligayahan.mp3 | confessions/TL_07_Kaligayahan.mp3 | ~3 MB |
| 08_Pagpapala.mp3 | confessions/TL_08_Pagpapala.mp3 | ~3 MB |
| 09_Amen.mp3 | confessions/TL_09_Amen.mp3 | ~3 MB |
| 10_Shalom.mp3 | confessions/TL_10_Shalom.mp3 | ~3 MB |

## Commande Upload Manuelle

Si les fichiers sont sur Google Drive, les télécharger d'abord localement, puis:

```powershell
# Configuration Rclone (si configuré)
rclone copy "G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\FR\" r2:bible-chantee-audio/confessions/ --include "*.mp3"
rclone copy "G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\PT\" r2:bible-chantee-audio/confessions/ --include "*.mp3"
rclone copy "G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\TL\" r2:bible-chantee-audio/confessions/ --include "*.mp3"
```

Ou avec Wrangler:

```bash
# Uploader un fichier à la fois
wrangler r2 object put bible-chantee-audio/confessions/FR_01_Joie.mp3 --file "path/to/01_Joie.mp3"
# ... répéter pour chaque fichier
```

## Script Python pour Download + Upload

Voir: `Scripts/upload_confessions_to_r2.py`

Ce script peut:
1. Télécharger les fichiers depuis Archive.org
2. Les renommer selon la convention R2
3. Les uploader vers R2 avec Wrangler

## Après l'Upload

Une fois les 30 fichiers uploadés vers R2:

1. **Relancer la vérification**:
   ```bash
   python Scripts/phase3_check_r2_confessions.py
   ```

2. **Migrer les URLs**:
   ```bash
   python Scripts/phase3_migrate_urls_to_r2.py
   ```

3. **Tester les URLs**:
   Ouvrir `TEST_URLS.html` dans le navigateur

## Vérification URL R2

Base URL: `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/`

Exemple:
- `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/confessions/FR_01_Joie.mp3`
- `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/confessions/PT_01_Alegria.mp3`
- `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/confessions/TL_01_Kagalakan.mp3`

## Statut

- [ ] Télécharger les 30 fichiers depuis Archive.org ou Google Drive
- [ ] Renommer selon la convention (FR_, PT_, TL_)
- [ ] Uploader vers R2 dans le dossier `confessions/`
- [ ] Vérifier l'upload avec `phase3_check_r2_confessions.py`
- [ ] Migrer les URLs avec `phase3_migrate_urls_to_r2.py`
- [ ] Tester avec `TEST_URLS.html`

## Notes

- **Ne pas supprimer** les fichiers d'Archive.org (backup)
- Les fichiers resteront disponibles sur Archive.org en parallèle
- La migration permet d'avoir un CDN unique (R2) pour toutes les URLs
- Vitesse de téléchargement améliorée avec R2
