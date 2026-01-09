# 🛠️ Lyrics Archive Tools

Scripts Node.js pour exporter, auditer et vérifier les lyrics de Bible Chantée.

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `export_lyrics_archive.js` | Export complet → JSON |
| `audit_lyrics_archive.js` | Audit manquants/doublons |
| `export_flat_txt.js` | Export TXT (1 fichier/chapitre) |
| `verify_integrity.js` | Vérification vs sources |

## 🚀 Usage

```bash
cd C:\ScriptBible\bible-chantee

# 1. Export
node tools/export_lyrics_archive.js

# 2. Audit
node tools/audit_lyrics_archive.js

# 3. TXT flat (optionnel)
node tools/export_flat_txt.js

# 4. Vérification
node tools/verify_integrity.js
```

## 📁 Sortie

```
lyrics-archive/
├── lyrics-archive.json       # Complet
├── FR.json                    # Par langue
├── EN.json
├── ...
├── lyrics-audit-report.json   # Rapport
└── flat/                      # TXT
    ├── FR/
    │   ├── 01_1.txt
    │   └── ...
    └── ...
```

## ✅ Garanties

- **Copie exacte** (pas de normalisation)
- **Zéro modification** du site
- **Node.js natif** (fs/path/vm/crypto)
- **Réversible** (rm -rf lyrics-archive)

## 🔒 Sécurité

- Sandbox VM pour parser JS
- Pas d'eval() direct
- Détection conflits de merge

---

**Date** : 2026-01-09
