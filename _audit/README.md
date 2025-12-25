# Système d'Audit & Release Engineering - Bible Chantée

## 🎯 Objectif

Système "stable + auditée + rollback instant" pour maintenir la qualité PROD du projet Bible Chantée avec:
- **Audit automatique** avant chaque modification
- **Baseline figée** avec tag Git + backup ZIP + manifest SHA256
- **Rollback immédiat** en cas de problème

---

## 📁 Structure

```
_audit/
├── audit_prod.ps1              # Audit complet PROD
├── make_release_backup.ps1     # Backup + tag + ZIP + manifest
├── reports/                    # Logs d'audit horodatés
│   └── audit_prod_YYYYMMDD_HHMMSS.log
└── releases/                   # Release backups
    └── release_YYYYMMDD_HHMMSS/
        ├── repo.zip            # Backup complet du repo
        ├── manifest_sha256.txt # Manifest d'intégrité
        └── reports/            # Copie des logs d'audit
```

---

## 🔍 Scripts

### `audit_prod.ps1` - Audit PROD global

Vérifie:
1. ✅ **Pages PROD** existent (17 pages critiques)
2. ✅ **lang-shared.js** présent dans chaque page
3. ✅ **i18n strict v4** (si CHECK_I18N_STRICT_v4.ps1 existe)
4. ✅ **Clés i18n** complètes (si CHECK_KEYS_NODE.js existe)
5. ✅ **Patterns interdits** (FR/fr hard-coded, sungbible_* legacy)
6. ✅ **translations-extra.js** présent

**Usage:**
```powershell
cd "C:\ScriptBible\bible-chantee"
.\_audit\audit_prod.ps1
```

**Sortie:**
- Exit code 0 si OK
- Exit code 1 si échec
- Log dans `_audit/reports/audit_prod_YYYYMMDD_HHMMSS.log`

---

### `make_release_backup.ps1` - Release Backup complet

Crée une release baseline avec:
1. ✅ **Audit PROD** (doit passer)
2. ✅ **Git status clean** (vérifie working tree)
3. ✅ **Tag Git** `release-YYYYMMDD_HHMMSS`
4. ✅ **ZIP complet** (exclu .git, node_modules, _audit/releases)
5. ✅ **Manifest SHA256** de tous les fichiers
6. ✅ **Copie des logs** d'audit

**Usage:**
```powershell
cd "C:\ScriptBible\bible-chantee"
.\_audit\make_release_backup.ps1
```

**Sortie:**
- Tag Git créé
- Dossier `_audit/releases/release_YYYYMMDD_HHMMSS/`
- Push tags: `git push --tags`

---

## 🔄 Workflow Standard

### Avant TOUTE modification

```powershell
cd "C:\ScriptBible\bible-chantee"
.\_audit\audit_prod.ps1
git status
```

### Commit si audit OK

```powershell
git add -A
git commit -m "feat: description"
git push
```

### Release backup pour jalons importants

Créer un backup quand:
- ✅ Nouvelle langue ajoutée
- ✅ Page critique internationalisée
- ✅ Refactor i18n majeur
- ✅ Avant grosse modification

```powershell
.\_audit\make_release_backup.ps1
git push --tags
```

---

## 🚨 Rollback Immédiat

### Méthode A: Git tag (recommandé)

```powershell
# Lister les releases disponibles
git tag --list "release-*"

# Retour à une release
git checkout release-20251225_173000

# Ou créer une branche depuis la release
git checkout -b fix-from-release release-20251225_173000
```

### Méthode B: Restaurer ZIP

Si le repo local est trop cassé:

1. Aller dans `_audit/releases/release_YYYYMMDD_HHMMSS/`
2. Extraire `repo.zip` dans un nouveau dossier
3. Vérifier l'intégrité avec `manifest_sha256.txt`
4. Repartir depuis ce point stable

---

## 📊 Pages PROD Auditées (17)

1. index.html
2. demo.html
3. lecteur.html
4. premium.html
5. promesses.html
6. promesse-detail.html
7. about.html
8. contact.html
9. pricing.html
10. signup.html
11. success.html
12. thank-you.html
13. mentions-legales.html
14. nouveautes.html
15. recover-premium.html
16. bible.html
17. aide.html

---

## ⚠️ Règles d'Or

1. **JAMAIS merger sans audit OK**
2. **TOUJOURS commit avec working tree clean**
3. **TOUJOURS backup release avant grosse modif**
4. **TOUJOURS vérifier git status avant release**
5. **TOUJOURS push les tags après release**

---

## 📝 Logs d'Audit

Tous les logs sont horodatés et conservés dans `_audit/reports/`:
- Format: `audit_prod_YYYYMMDD_HHMMSS.log`
- Traçabilité complète de tous les audits
- Utile pour debug et forensics

---

## 🔐 Intégrité

Le manifest SHA256 permet de vérifier l'intégrité d'un backup:

```powershell
# Vérifier le manifest
cd _audit/releases/release_YYYYMMDD_HHMMSS/
Get-Content manifest_sha256.txt | ForEach-Object {
    $hash, $file = $_ -split '  '
    $actualHash = (Get-FileHash $file -Algorithm SHA256).Hash
    if ($hash -eq $actualHash) { Write-Host "✅ $file" }
    else { Write-Host "❌ $file CORRUPTED" -ForegroundColor Red }
}
```

---

## 🎉 Avantages

- ✅ **Stabilité garantie**: Audit avant chaque commit
- ✅ **Rollback instant**: Tag Git ou ZIP en 30 secondes
- ✅ **Traçabilité**: Logs horodatés de tous les audits
- ✅ **Intégrité**: Manifest SHA256 de tous les fichiers
- ✅ **Confiance**: Baseline figée testée et validée
- ✅ **Productivité**: Pas de peur de casser PROD

---

**Créé le:** 2025-12-25
**Auteur:** Release Engineering - Bible Chantée
**Version:** 1.0
