# GUIDE COMPLET - Audio Manquants Bible Chantée

Date: 2026-01-31
Statut: **CRITIQUE** - Fonctionnalités cassées sans ces audio

---

## 📋 RÉSUMÉ DES AUDIO MANQUANTS

### ⚠️ PRIORITÉ CRITIQUE (fonctionnalités cassées)

1. **Prières PT** - 5 prières sans audio vérifié sur R2
2. **Prières TL** - 6 prières sans audio sur R2

### ⚠️ PRIORITÉ HAUTE (URLs temporaires)

3. **Confessions TL** - 10 fichiers avec URLs musicfile.api.box (besoin Archive.org)

### 📊 PRIORITÉ MOYENNE (expansion)

4. **Confessions multilingues** - 90 fichiers manquants (9 langues × 10)

---

## 1. PRIÈRES PT - Vérifier/Upload R2

### Fichiers concernés
```
PT_Pai Nosso.mp3
PT_Gratidao.mp3
PT_Oracao de Libertacao.mp3
PT_Primeiro Eu Te Busco.mp3
PT_Tu es a Minha Protecao.mp3
```

### Localisation R2
```
Bucket: bible-chantee-audio
Path: prayers/PT_*.mp3
URL publique: https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/PT_*.mp3
```

### Actions requises

#### Étape 1: Vérifier si les fichiers existent sur R2
```bash
rclone ls "r2-bible-chantee:bible-chantee-audio/prayers" --include "PT_*.mp3"
```

#### Étape 2: Si manquants, localiser les fichiers sources
```bash
# Chercher dans Google Drive
find "/g/Mon Drive/01 BibleChantee" -name "PT_Pai*.mp3" -o -name "*Pai Nosso*.mp3"
```

#### Étape 3: Upload vers R2
```bash
# Si fichiers trouvés localement
rclone copy <SOURCE_DIR> "r2-bible-chantee:bible-chantee-audio/prayers" --include "PT_*.mp3"
```

#### Étape 4: Test
```bash
# Tester chaque URL
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/PT_Pai Nosso.mp3"
# Devrait retourner: HTTP/1.1 200 OK
```

---

## 2. PRIÈRES TL - Générer et Upload R2

### Fichiers à créer
```
TL_Ama Namin.mp3
TL_Pasasalamat.mp3
TL_Panalangin ng Paglaya.mp3
TL_Una Kitang Hinahanap.mp3
TL_Binubuksan Mo Ang Pinto.mp3
TL_Ikaw ang Aking Proteksiyon.mp3
```

### Lyrics disponibles
✅ Tous les lyrics existent dans `/lyrics/prayers/TL_*.md`

### Actions requises

#### Option A: Si audio existe localement
```bash
# Chercher dans archives
find "/g/Mon Drive/01 BibleChantee" -name "TL_*.mp3" -path "*/prayers/*"

# Upload si trouvé
rclone copy <SOURCE_DIR> "r2-bible-chantee:bible-chantee-audio/prayers" --include "TL_*.mp3"
```

#### Option B: Si audio à générer
1. Utiliser Suno.ai ou service similaire
2. Input: Fichiers `/lyrics/prayers/TL_*.md`
3. Style: Worship contemplativo, acustico, 72-80 BPM
4. Langue: Tagalog
5. Export en MP3
6. Upload vers R2

#### Étape finale: Test
```bash
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/TL_Ama Namin.mp3"
```

---

## 3. CONFESSIONS TL - Migrer vers Archive.org

### Situation actuelle
✅ Audio existe: `G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\TL\*.mp3`
⚠️ URLs temporaires dans `audio-urls-confessions-tl.js` (musicfile.api.box)
❌ Besoin migration vers Archive.org (permanent)

### Fichiers à uploader
```
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

### Actions requises

#### Étape 1: Créer collection Archive.org
1. Aller sur https://archive.org
2. Créer collection: `bible-chantee-confessions-tl`
3. Type: Audio
4. License: Creative Commons
5. Description: "Bible Chantée - Confessions en Tagalog (TL)"

#### Étape 2: Upload fichiers
```bash
# Depuis Google Drive vers Archive.org
cd "G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\TL"

# Via interface web Archive.org ou CLI
ia upload bible-chantee-confessions-tl *.mp3 \
  --metadata="title:Bible Chantée - Confessions Tagalog" \
  --metadata="mediatype:audio" \
  --metadata="collection:opensource_audio"
```

#### Étape 3: Mettre à jour audio-urls-confessions-tl.js
```javascript
// AVANT (temporaire):
window.audioUrlsConfessionsTL = {
    "01": "https://musicfile.api.box/NTA5ZGJiMTYtZDhmNC00NmNjLWI1ZjUtMWIwZjE4N2UwYjM3.mp3",
    // ...
};

// APRÈS (permanent):
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

#### Étape 4: Commit et deploy
```bash
git add audio-urls-confessions-tl.js
git commit -m "Update TL confessions to Archive.org permanent URLs"
git push
```

---

## 4. CONFESSIONS MULTILINGUES - Création Audio

### Langues manquantes (9 langues × 10 confessions = 90 fichiers)

- **EN** (Anglais) - 10 fichiers
- **ES** (Espagnol) - 10 fichiers
- **DE** (Allemand) - 10 fichiers
- **IT** (Italien) - 10 fichiers
- **AR** (Arabe) - 10 fichiers
- **HI** (Hindi) - 10 fichiers
- **RU** (Russe) - 10 fichiers
- **SW** (Swahili) - 10 fichiers
- **ZH** (Chinois) - 10 fichiers

### Lyrics disponibles
✅ Tous les lyrics existent dans `/lyrics/confessions/{LANG}/XX_*.txt`

### Process de création

#### Pour chaque langue:

1. **Générer audio**
   - Input: `/lyrics/confessions/{LANG}/01_*.txt` à `10_*.txt`
   - Outil: Suno.ai ou similaire
   - Style: Worship contemplativo, 72-80 BPM
   - Export: MP3 haute qualité

2. **Upload Archive.org**
   ```bash
   ia upload bible-chantee-confessions-{LANG} *.mp3 \
     --metadata="title:Bible Chantée - Confessions {LANG}" \
     --metadata="language:{lang_code}"
   ```

3. **Créer audio-urls-confessions-{lang}.js**
   ```javascript
   window.audioUrlsConfessions{LANG} = {
       "01": "https://archive.org/download/bible-chantee-confessions-{lang}/01_*.mp3",
       // ...
   };
   ```

4. **Ajouter dans confessions.html**
   ```html
   <script src="/audio-urls-confessions-{lang}.js"></script>
   ```

5. **Commit et deploy**

---

## 🔍 VÉRIFICATION POST-UPLOAD

### Checklist Prières
- [ ] PT: Test 5 URLs R2 → HTTP 200
- [ ] TL: Test 6 URLs R2 → HTTP 200
- [ ] Test prieres.html?lang=PT → Audio joue
- [ ] Test prieres.html?lang=TL → Audio joue

### Checklist Confessions TL
- [ ] Collection Archive.org créée
- [ ] 10 fichiers TL uploadés
- [ ] audio-urls-confessions-tl.js mis à jour
- [ ] Test confessions.html?lang=TL → Audio permanent joue

### Checklist Confessions Multilingues
- [ ] Pour chaque langue: 10 fichiers générés
- [ ] Collections Archive.org créées
- [ ] Scripts audio-urls créés
- [ ] confessions.html mis à jour
- [ ] Tests pour chaque langue

---

## 📊 ESTIMATION TEMPS

| Tâche | Temps estimé |
|-------|-------------|
| Vérifier PT prayers R2 | 10 min |
| Upload PT prayers (si manquants) | 20 min |
| Générer TL prayers audio | 2-4 heures |
| Upload TL prayers R2 | 30 min |
| Migrer TL confessions Archive.org | 1 heure |
| Générer confessions multilingues | 10-20 heures |

**TOTAL MINIMUM**: 4-5 heures (PT + TL critique)
**TOTAL COMPLET**: 15-25 heures (tout compris)

---

## ⚡ ACTIONS IMMÉDIATES

### À faire MAINTENANT (critique):
```bash
# 1. Vérifier PT prayers
rclone ls "r2-bible-chantee:bible-chantee-audio/prayers" --include "PT_*.mp3"

# 2. Test PT prayers URLs
for prayer in "Pai Nosso" "Gratidao" "Oracao de Libertacao" "Primeiro Eu Te Busco" "Tu es a Minha Protecao"; do
    echo "Testing: $prayer"
    curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/PT_${prayer}.mp3"
done

# 3. Chercher TL prayers localement
find "/g/Mon Drive/01 BibleChantee" -name "TL_*.mp3" -path "*/prayer*"
```

### Résultats attendus:
- PT: Si HTTP 200 → ✅ OK, si 404 → Upload requis
- TL: Si fichiers trouvés → Upload, sinon → Générer

---

FIN DU GUIDE
