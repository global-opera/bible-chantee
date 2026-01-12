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

## 🔒 Règle d'or : lyrics/FR.json est GOLDEN MASTER

**IMPORTANT** : `lyrics/FR.json` est la source de vérité. Ne JAMAIS l'écraser automatiquement.

- **Tag de référence** : `fr-lyrics-structured-v1`
- **Source** : Fichiers structurés de `C:\Users\Stéphane CASSANI\bible-chantee\Lyrics\FR\`
- **Audit** : 334 chapitres, 0 erreur, formatage parfait
- **Date** : 2026-01-13

### Scripts de maintenance FR

| Script | Description |
|--------|-------------|
| `import_structured_fr_folder.js` | ⚠️ **Usage initial uniquement** - Rebuild FR.json depuis fichiers structurés |
| `regenerate_lyrics_data_js.js` | Régénère lyrics-data.js depuis FR.json (pour web) |
| `audit_fr_lyrics.js` | Audit qualité FR.json (mojibake, blocs manquants) |
| `whisper_reformat_fr.js` | ❌ **Non recommandé** - Reformatage Whisper (résultats imparfaits) |

### Workflow pour modifications futures

1. ❌ Ne JAMAIS écraser `lyrics/FR.json` en masse
2. ✅ Créer un script dédié pour chaque type de modification
3. ✅ Toujours faire un backup automatique
4. ✅ Commit explicite avec message détaillé
5. ✅ Régénérer `lyrics-data.js` après modification
6. ✅ Tester avant push

### Phase 2 : Hybride Whisper (futur, optionnel)

Si besoin d'améliorer la fidélité audio chapitre par chapitre :

- **Base** : paroles structurées actuelles (FR.json)
- **Whisper** : outil de diff uniquement
- **Script** : `compare_whisper_vs_structured.js` (à créer)
- **Sortie** : rapport de différences, jamais overwrite
- **Action** : corrections manuelles ciblées

Zéro urgence.

---

**Dernière mise à jour** : 2026-01-13
