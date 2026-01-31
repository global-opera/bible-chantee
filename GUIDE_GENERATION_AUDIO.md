# GUIDE - Génération Audio Prières et Confessions

Date: 2026-01-31

---

## 📋 PRÉREQUIS

### 1. Clé API Suno
Créez le fichier `api_key.py` à la racine du projet:
```python
SUNO_API_KEY = "votre_clé_api_suno_ici"
```

### 2. Python et dépendances
```bash
pip install requests
```

---

## 🎵 GÉNÉRATION PRIÈRES PT et TL

### Script disponible
`suno_prayers_generator.py` - Génère les 11 prières manquantes

### Commandes

#### Générer TOUTES les prières PT et TL
```bash
cd C:\ScriptBible\bible-chantee
python suno_prayers_generator.py
```

#### Générer seulement PT
```bash
python suno_prayers_generator.py --lang PT
```

#### Générer seulement TL
```bash
python suno_prayers_generator.py --lang TL
```

#### Mode automatique (sans confirmation)
```bash
python suno_prayers_generator.py --auto
```

#### Régénérer (forcer même si MP3 existe)
```bash
python suno_prayers_generator.py --force
```

### Ce que fait le script

1. ✅ Vérifie les crédits API Suno
2. ✅ Lit les lyrics depuis `C:\ScriptBible\bible-chantee\lyrics\prayers\`
3. ✅ Génère via API Suno avec style contemplative 72-80 BPM
4. ✅ Télécharge les MP3 vers `G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\`
5. ✅ Skip automatique si MP3 déjà existe (sauf --force)

### Prières générées

**PT (5 prières):**
- PT_Pai Nosso.mp3
- PT_Gratidão.mp3
- PT_Oração de Libertação.mp3
- PT_Primeiro Eu Te Busco.mp3
- PT_Tu És a Minha Proteção.mp3

**TL (6 prières):**
- TL_Ama Namin.mp3
- TL_Pasasalamat.mp3
- TL_Panalangin ng Paglaya.mp3
- TL_Una Kitang Hinahanap.mp3
- TL_Binubuksan Mo Ang Pinto.mp3
- TL_Ikaw ang Aking Proteksiyon.mp3

### Durée estimée
- **PT**: ~25 minutes (5 prières × ~5 min/prière)
- **TL**: ~30 minutes (6 prières × ~5 min/prière)
- **TOTAL**: ~1 heure

---

## 📤 APRÈS GÉNÉRATION: Upload vers R2

### 1. Vérifier les MP3 générés
```bash
ls "G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\"
```

### 2. Upload vers R2
```bash
rclone copy "G:\Mon Drive\01 BibleChantee\Suno_Output\prayers" \
  "r2-bible-chantee:bible-chantee-audio/prayers" \
  --include "*.mp3" \
  --progress
```

### 3. Tester les URLs
```bash
# Test PT
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/PT_Pai Nosso.mp3"

# Test TL
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/TL_Ama Namin.mp3"
```

Devrait retourner: `HTTP/1.1 200 OK`

### 4. Tester sur le site
```
https://biblechantee.com/prieres.html?lang=PT
https://biblechantee.com/prieres.html?lang=TL
```

---

## 🎵 GÉNÉRATION CONFESSIONS (autres langues)

### Script disponible
`suno_confessions_generator.py` - Génère confessions multilingues

### Commandes

#### Toutes les langues manquantes
```bash
python suno_confessions_generator.py --auto
```

#### Langue spécifique
```bash
python suno_confessions_generator.py --start-lang EN
```

#### Reprendre depuis une langue/confession
```bash
python suno_confessions_generator.py --start-lang ES --start-conf 5
```

### Confessions à générer (90 fichiers)
- EN: 10 fichiers
- ES: 10 fichiers
- DE: 10 fichiers
- IT: 10 fichiers
- AR: 10 fichiers
- HI: 10 fichiers
- RU: 10 fichiers
- SW: 10 fichiers
- ZH: 10 fichiers

### Durée estimée
- **Une langue**: ~50 minutes (10 confessions × ~5 min)
- **9 langues**: ~8 heures

---

## 🎯 MIGRATION TL CONFESSIONS vers Archive.org

### 1. Fichiers sources
```
G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\TL\
01_Kagalakan.mp3
02_Kagalingan.mp3
03_Kalusugan.mp3
04_Tagumpay.mp3
05_Kasaganaan.mp3
06_Pasasalamat.mp3
07_Kaligayahan.mp3
08_Pagpapala.mp3
09_Amen.mp3
10_Shalom.mp3
```

### 2. Upload vers Archive.org

#### Option A: Via interface web
1. Aller sur https://archive.org/create
2. Créer collection: `bible-chantee-confessions-tl`
3. Upload les 10 fichiers MP3
4. Définir metadata: Type=Audio, License=CC BY

#### Option B: Via CLI (si installé)
```bash
ia upload bible-chantee-confessions-tl \
  "G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\TL\*.mp3" \
  --metadata="title:Bible Chantée - Confessions Tagalog" \
  --metadata="mediatype:audio" \
  --metadata="language:tl"
```

### 3. Mettre à jour audio-urls-confessions-tl.js

Remplacer les URLs musicfile.api.box par Archive.org:

```javascript
window.audioUrlsConfessionsTL = {
    "01": "https://archive.org/download/bible-chantee-confessions-tl/01_Kagalakan.mp3",
    "02": "https://archive.org/download/bible-chantee-confessions-tl/02_Kagalingan.mp3",
    "03": "https://archive.org/download/bible-chantee-confessions-tl/03_Kalusugan.mp3",
    "04": "https://archive.org/download/bible-chantee-confessions-tl/04_Tagumpay.mp3",
    "05": "https://archive.org/download/bible-chantee-confessions-tl/05_Kasaganaan.mp3",
    "06": "https://archive.org/download/bible-chantee-confessions-tl/06_Pasasalamat.mp3",
    "07": "https://archive.org/download/bible-chantee-confessions-tl/07_Kaligayahan.mp3",
    "08": "https://archive.org/download/bible-chantee-confessions-tl/08_Pagpapala.mp3",
    "09": "https://archive.org/download/bible-chantee-confessions-tl/09_Amen.mp3",
    "10": "https://archive.org/download/bible-chantee-confessions-tl/10_Shalom.mp3"
};
```

### 4. Commit et deploy
```bash
git add audio-urls-confessions-tl.js
git commit -m "Update TL confessions to permanent Archive.org URLs"
git push
```

---

## ⚠️ NOTES IMPORTANTES

### Crédits Suno
- Vérifier crédits avant de lancer: le script affiche les crédits au démarrage
- Chaque génération consomme ~5 crédits
- Budget minimum recommandé: 100 crédits pour prières PT+TL

### Qualité audio
- Style: Worship contemplativo, acoustic, 72-80 BPM
- Model: V5 (meilleure qualité)
- Durée cible: 2-3 minutes par prière/confession

### Gestion erreurs
- Le script continue en cas d'erreur
- Les erreurs sont comptabilisées dans le rapport final
- Possibilité de reprendre avec --start-lang/--start-conf

### Skip existants
- Par défaut: skip si MP3 existe déjà
- Utiliser --force pour régénérer

---

## 📊 CHECKLIST COMPLÈTE

### Phase 1: Prières (CRITIQUE)
- [ ] Générer PT prayers (5 fichiers)
- [ ] Générer TL prayers (6 fichiers)
- [ ] Upload vers R2
- [ ] Tester PT prieres.html
- [ ] Tester TL prieres.html

### Phase 2: Confessions TL (HAUTE PRIORITÉ)
- [ ] Upload TL confessions vers Archive.org
- [ ] Mettre à jour audio-urls-confessions-tl.js
- [ ] Commit et deploy
- [ ] Tester confessions.html?lang=TL

### Phase 3: Confessions multilingues (MOYEN TERME)
- [ ] Générer EN confessions (10 fichiers)
- [ ] Générer ES confessions (10 fichiers)
- [ ] Générer DE confessions (10 fichiers)
- [ ] Générer IT confessions (10 fichiers)
- [ ] Générer AR confessions (10 fichiers)
- [ ] Générer HI confessions (10 fichiers)
- [ ] Générer RU confessions (10 fichiers)
- [ ] Générer SW confessions (10 fichiers)
- [ ] Générer ZH confessions (10 fichiers)
- [ ] Upload chaque langue vers Archive.org
- [ ] Créer audio-urls-confessions-XX.js pour chaque langue
- [ ] Mettre à jour confessions.html (charger scripts)

---

## 🚀 COMMANDE RAPIDE (Tout générer)

```bash
# 1. Prières PT et TL
cd C:\ScriptBible\bible-chantee
python suno_prayers_generator.py --auto

# 2. Attendre ~1 heure

# 3. Upload R2
rclone copy "G:\Mon Drive\01 BibleChantee\Suno_Output\prayers" \
  "r2-bible-chantee:bible-chantee-audio/prayers" \
  --include "*.mp3" --progress

# 4. Test
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/PT_Pai Nosso.mp3"
```

---

FIN DU GUIDE
