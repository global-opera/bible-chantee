# Guide d'Upload MP3 FR vers R2

## ✅ Étapes Complétées

1. ✅ **Fichiers .lyrics.txt générés** (1621 fichiers pour FR, FR_V1, FR_V2)
2. ✅ **lyrics-data-fr.js régénéré** (48 livres, 872 chapitres depuis version FR)
3. ✅ **MP3 renommés** (792 fichiers : XXX → XX format)

---

## 📋 Prochaine Étape : Upload vers R2

### Option 1 : Script PowerShell Automatique

```powershell
cd C:\ScriptBible\bible-chantee

# Test (DryRun) - Voir ce qui sera uploadé sans uploader
.\upload_fr_to_r2.ps1 -DryRun

# Upload réel
.\upload_fr_to_r2.ps1
```

**Ce que fait le script :**
- Upload tous les MP3 de `G:\Mon Drive\01 BibleChantee\Suno_Output\FR\`
- Vers R2 : `r2-bible-chantee:bible-chantee-audio/FR/`
- Avec progression en temps réel
- Remplace les fichiers existants

---

### Option 2 : Commandes rclone Manuelles

#### A. Configuration rclone (si pas déjà fait)

```bash
rclone config

# Choisir :
n) New remote
name> r2-bible-chantee
Type: s3
Provider: Cloudflare
env_auth> false
access_key_id> [VOTRE_R2_ACCESS_KEY]
secret_access_key> [VOTRE_R2_SECRET_KEY]
region> auto
endpoint> https://[ACCOUNT_ID].r2.cloudflarestorage.com
location_constraint>
acl>
```

#### B. Test Upload (DryRun)

```bash
rclone copy \
  "G:/Mon Drive/01 BibleChantee/Suno_Output/FR" \
  "r2-bible-chantee:bible-chantee-audio/FR" \
  --include "*.mp3" \
  --progress \
  --dry-run
```

#### C. Upload Réel

```bash
rclone copy \
  "G:/Mon Drive/01 BibleChantee/Suno_Output/FR" \
  "r2-bible-chantee:bible-chantee-audio/FR" \
  --include "*.mp3" \
  --progress \
  --transfers 4 \
  --checkers 8 \
  --stats 5s
```

**Paramètres expliqués :**
- `--include "*.mp3"` : Seulement les fichiers MP3
- `--progress` : Barre de progression
- `--transfers 4` : 4 uploads simultanés
- `--checkers 8` : 8 vérifications en parallèle
- `--stats 5s` : Stats toutes les 5 secondes

---

### Option 3 : Upload par Lots (Recommandé pour gros volumes)

Si vous avez beaucoup de fichiers, uploadez par livres :

```bash
# Ancien Testament (livres 01-39)
rclone copy \
  "G:/Mon Drive/01 BibleChantee/Suno_Output/FR" \
  "r2-bible-chantee:bible-chantee-audio/FR" \
  --include "0[1-3]*/*.mp3" \
  --progress

# Nouveau Testament (livres 40-66)
rclone copy \
  "G:/Mon Drive/01 BibleChantee/Suno_Output/FR" \
  "r2-bible-chantee:bible-chantee-audio/FR" \
  --include "[4-6]*/*.mp3" \
  --progress
```

---

## 🔍 Vérification Post-Upload

### 1. Vérifier qu'Abdias est bien uploadé

```bash
# Lister le contenu
rclone ls "r2-bible-chantee:bible-chantee-audio/FR/31_OBA/"

# Tester l'URL
curl -I https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/FR/31_OBA/31_OBA_01_FR.mp3
```

### 2. Compter les fichiers uploadés

```bash
rclone size "r2-bible-chantee:bible-chantee-audio/FR" --include "*.mp3"
```

### 3. Tester le site

1. Ouvrir le site : https://biblechantee.com
2. Naviguer vers Abdias (livre 31)
3. Vérifier que :
   - ✅ Le MP3 se charge et joue
   - ✅ Les paroles s'affichent correctement
   - ✅ Les paroles correspondent au MP3

---

## 📊 Structure Finale Attendue sur R2

```
r2://bible-chantee-audio/
└── FR/
    ├── 01_GEN/
    │   └── 01_GEN_01_FR.mp3
    ├── 02_EXO/
    │   └── 02_EXO_01_FR.mp3
    ├── 31_OBA/
    │   └── 31_OBA_01_FR.mp3
    └── ...
```

**Format des noms :**
- `XX_CODE_XX_FR.mp3` (avec suffixe `_v1` possible)
- XX = numéro livre sur 2 chiffres
- CODE = code du livre (3-4 lettres)
- XX = numéro chapitre sur 2 chiffres

---

## ⚠️ Important

1. **Backup** : Les MP3 locaux sont votre source de vérité
2. **Pas de suffixes** : Éviter `_v2`, `_FIXED`, `_CORRIGE`
3. **Cohérence** : Les paroles dans lyrics-data-fr.js correspondent maintenant aux MP3 FR
4. **URLs publiques** : `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/FR/XX_CODE/XX_CODE_XX_FR.mp3`

---

## 🚀 Commande Rapide (Tout-en-un)

```powershell
# Windows PowerShell
cd C:\ScriptBible\bible-chantee
.\upload_fr_to_r2.ps1
```

Ou en bash/cmd :

```bash
cd "C:\ScriptBible\bible-chantee"
rclone copy "G:/Mon Drive/01 BibleChantee/Suno_Output/FR" "r2-bible-chantee:bible-chantee-audio/FR" --include "*.mp3" --progress --transfers 4
```

---

## 📝 Logs et Monitoring

Pour garder un log de l'upload :

```bash
rclone copy \
  "G:/Mon Drive/01 BibleChantee/Suno_Output/FR" \
  "r2-bible-chantee:bible-chantee-audio/FR" \
  --include "*.mp3" \
  --progress \
  --log-file="upload_fr_$(date +%Y%m%d_%H%M%S).log" \
  --log-level INFO
```

---

## ✅ Checklist Post-Upload

- [ ] Tous les MP3 uploadés (vérifier le count)
- [ ] Abdias fonctionne sur le site
- [ ] Les paroles correspondent au MP3
- [ ] URLs publiques accessibles
- [ ] Pas d'erreurs 404
- [ ] Audio joue correctement dans le navigateur
