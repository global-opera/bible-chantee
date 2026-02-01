# 🚨 URGENT: Upload TL Confessions vers Archive.org

## ❌ PROBLÈME
- TL confessions utilise URLs temporaires **musicfile.api.box** (HTTP 441 - NE FONCTIONNENT PAS)
- PT confessions fonctionne ✅ (déjà sur Archive.org)
- FR confessions fonctionne ✅ (déjà sur Archive.org)

## ✅ SOLUTION: Upload TL vers Archive.org

### Fichiers à uploader (10 fichiers, 26 MB)
```
G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\TL\
├── 01_Kagalakan.mp3
├── 02_Kagalingan.mp3
├── 03_Kalusugan.mp3
├── 04_Tagumpay.mp3
├── 05_Kasaganaan.mp3
├── 06_Pasasalamat.mp3
├── 07_Kaligayahan.mp3
├── 08_Pagpapala.mp3
├── 09_Amen.mp3
└── 10_Shalom.mp3
```

---

## 📤 MÉTHODE 1: Via Interface Web Archive.org (RECOMMANDÉ)

### Étape 1: Créer la collection
1. Aller sur https://archive.org/create
2. Click "Upload files"
3. **Identifier**: `bible-chantee-confessions-tl`
4. **Title**: Bible Chantée - Confessions Tagalog
5. **Description**: 10 sung confessions in Tagalog from Bible Chantée project
6. **Creator**: Bible Chantée
7. **Date**: 2026
8. **Subject/Tags**: worship, tagalog, confessions, bible, music
9. **Language**: Tagalog (tl)
10. **License**: Creative Commons Attribution 4.0
11. **Media Type**: Audio

### Étape 2: Upload les 10 fichiers MP3
1. Click "Choose files"
2. Sélectionner les 10 fichiers depuis:
   ```
   G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\TL\
   ```
3. Attendre upload (26 MB)
4. Click "Submit"

### Étape 3: Attendre traitement
- Archive.org prend 5-10 minutes pour traiter
- Les fichiers seront accessibles à:
  ```
  https://archive.org/download/bible-chantee-confessions-tl/01_Kagalakan.mp3
  https://archive.org/download/bible-chantee-confessions-tl/02_Kagalingan.mp3
  ...
  ```

---

## 📤 MÉTHODE 2: Via CLI (si internetarchive installé)

### Installation
```bash
pip install internetarchive
ia configure  # Entrer vos identifiants Archive.org
```

### Upload
```bash
cd "G:\Mon Drive\01 BibleChantee\Suno_Output\confessions\TL"

ia upload bible-chantee-confessions-tl *.mp3 \
  --metadata="title:Bible Chantée - Confessions Tagalog" \
  --metadata="creator:Bible Chantée" \
  --metadata="date:2026" \
  --metadata="language:tl" \
  --metadata="mediatype:audio" \
  --metadata="subject:worship;tagalog;confessions;bible;music" \
  --metadata="licenseurl:https://creativecommons.org/licenses/by/4.0/"
```

---

## 🔧 APRÈS UPLOAD: Mettre à jour audio-urls-confessions-tl.js

Une fois les fichiers uploadés et traités par Archive.org:

```javascript
// Audio URLs - Confessions TL (Bible Chantée)
// Archive.org collection: bible-chantee-confessions-tl

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

---

## ✅ VÉRIFICATION POST-UPDATE

### Test URLs
```bash
curl -I "https://archive.org/download/bible-chantee-confessions-tl/01_Kagalakan.mp3"
# Devrait retourner: HTTP/1.1 200 OK (après traitement)
```

### Test sur le site
```
https://biblechantee.com/confessions.html?lang=TL
```

**Toutes les 10 confessions TL doivent jouer!**

---

## 📋 CHECKLIST

- [ ] Aller sur https://archive.org/create
- [ ] Créer collection `bible-chantee-confessions-tl`
- [ ] Uploader 10 fichiers MP3 TL
- [ ] Attendre traitement Archive.org (5-10 min)
- [ ] Mettre à jour `audio-urls-confessions-tl.js`
- [ ] Commit et push
- [ ] Tester URLs avec curl
- [ ] Tester site: confessions.html?lang=TL

---

## ⏱️ DURÉE ESTIMÉE
- Upload: 5 minutes
- Traitement Archive.org: 5-10 minutes
- Mise à jour code: 2 minutes
- **TOTAL: ~15-20 minutes**

---

FIN
