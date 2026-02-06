# Archive - Bible Chantée

## À propos de ce dossier

Ce dossier `_archive/` contient tous les fichiers archivés lors du nettoyage et de l'organisation du projet Bible Chantée.

**Date de création:** 2026-02-01 (Phase 2 - Harmonisation et Nettoyage)

## ⚠️ IMPORTANT

**NE PAS UTILISER** les fichiers de ce dossier en production!

Ce sont des anciennes versions, backups, et fichiers obsolètes conservés pour:
- Traçabilité historique
- Récupération d'urgence si nécessaire
- Documentation des évolutions du projet

## Structure

```
_archive/
├── old-versions/          (Anciennes versions code/config)
│   ├── chapter-titles/    (10 fichiers - versions obsolètes)
│   ├── audio-urls/        (1 fichier - backup)
│   ├── lyrics-data/       (2 fichiers - backups)
│   ├── titles/            (6 fichiers - .bak)
│   ├── lyrics-archive/    (2 fichiers - .bak)
│   └── [autres]           (3 fichiers divers)
├── backup-originals/      (Backups données importantes)
│   └── lyrics-txt/        (164 fichiers - .txt FR)
└── deprecated/            (Fonctionnalités abandonnées)
    ├── FR_V1/             (vide - prévu Phase 3)
    └── FR_V2/             (vide - prévu Phase 3)
```

## Statistiques

- **Total fichiers:** 186
- **Taille totale:** 11 MB
- **Date archivage:** 2026-02-01

## Catégories

### old-versions/ (21 fichiers)

Versions obsolètes de fichiers de configuration.

**Contenu principal:**
- Chapter-titles obsolètes (10 fichiers)
- Audio-urls backups (1 fichier)
- Lyrics-data backups (2 fichiers)
- Titles .bak (6 fichiers)
- Autres backups (3 fichiers)

### backup-originals/ (164 fichiers)

Copies de sauvegarde des données originales importantes.

**Contenu:**
- lyrics-txt/ : Backup complet des fichiers .txt français
- Format: 01_GEN_001_FR.txt, 01_GEN_002_FR.txt, etc.
- Usage: Backup de sécurité uniquement

### deprecated/ (0 fichiers actuellement)

Fonctionnalités ou versions abandonnées.

**Prévu:**
- FR_V1/ : Migration future
- FR_V2/ : Migration future

## Comment Utiliser

### Consulter un Fichier Archivé

```bash
# Lister le contenu
ls _archive/old-versions/chapter-titles/

# Voir un fichier
cat _archive/old-versions/chapter-titles/chapter-titles-OLD.js
```

### Restaurer un Fichier (si nécessaire)

```bash
# 1. Copier (ne pas déplacer!)
cp _archive/old-versions/[fichier] [destination]

# 2. Vérifier que ça fonctionne

# 3. Si OK, documenter la restauration
```

### Chercher un Fichier

```bash
# Par nom
find _archive -name "*chapter-titles*"

# Par type
find _archive -name "*.js"
find _archive -name "*.txt"

# Par date
find _archive -type f -mtime -30  # modifiés < 30 jours
```

## Maintenance

### Nettoyage Périodique

**Trimestriel:**
- Réviser contenu de _archive/
- Compresser si taille > 100 MB
- Documenter fichiers importants

### Règles

1. **Ne jamais supprimer** de fichiers sans documenter
2. **Compresser** les gros fichiers après 6 mois
3. **Documenter** toute restauration
4. **Garder** minimum 1 an

## Questions Fréquentes

### Puis-je supprimer _archive/ ?

**Non!** Ces fichiers servent de backup de sécurité. Garder au minimum 1 an.

### Un fichier archivé est nécessaire, que faire?

1. Copier (pas déplacer) vers production
2. Tester que ça fonctionne
3. Documenter dans git commit
4. Laisser copie dans _archive/

### Comment archiver un nouveau fichier?

```bash
# 1. Copier vers _archive/old-versions/[catégorie]/
cp [fichier] _archive/old-versions/[catégorie]/

# 2. Vérifier la copie
ls -lh _archive/old-versions/[catégorie]/

# 3. Supprimer l'original
rm [fichier]

# 4. Documenter dans git
git commit -m "Archive [fichier] - [raison]"
```

## Documentation Associée

Voir les fichiers de documentation du projet principal:

- **ARCHITECTURE.md** - Structure complète du projet
- **MAINTENANCE.md** - Procédures de maintenance
- **PHASE2_RAPPORT_NETTOYAGE.md** - Rapport détaillé Phase 2

## Contact

Pour questions sur les archives:
- Consulter PHASE2_RAPPORT_NETTOYAGE.md
- Vérifier historique git: `git log --all -- _archive/`

---

**Créé:** 2026-02-01
**Phase:** Phase 2 - Harmonisation et Nettoyage
**Statut:** Actif
