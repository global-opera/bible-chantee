# 🚨 UPLOAD URGENT - Prières TL vers R2

## ✅ Fichiers prêts (6 fichiers)
```
G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\
├── TL_Ama Namin.mp3
├── TL_Binubuksan Mo Ang Pinto.mp3
├── TL_Ikaw ang Aking Proteksiyon.mp3
├── TL_Panalangin ng Paglaya.mp3
├── TL_Pasasalamat.mp3
└── TL_Una Kitang Hinahanap.mp3
```

---

## 🔧 SOLUTION 1: Via rclone (RECOMMANDÉ)

### A. Installer rclone (si pas déjà fait)
```powershell
winget install Rclone.Rclone
```

Ou télécharger: https://rclone.org/downloads/

### B. Configurer R2 (si pas déjà fait)
```powershell
rclone config
# Suivre l'assistant pour configurer "r2-bible-chantee"
```

### C. Upload
```powershell
rclone copy "G:\Mon Drive\01 BibleChantee\Suno_Output\prayers" `
  "r2-bible-chantee:bible-chantee-audio/prayers" `
  --include "TL_*.mp3" `
  --progress
```

---

## 🔧 SOLUTION 2: Via Cloudflare Dashboard (SIMPLE)

### Étapes:
1. Ouvrir https://dash.cloudflare.com
2. R2 → Buckets → `bible-chantee-audio`
3. Naviguer vers dossier `prayers/`
4. Click "Upload files"
5. Sélectionner les 6 fichiers TL_*.mp3 depuis:
   ```
   G:\Mon Drive\01 BibleChantee\Suno_Output\prayers\
   ```
6. Attendre upload (41 MB total)

---

## 🔧 SOLUTION 3: Via wrangler CLI

### A. Installer wrangler
```powershell
npm install -g wrangler
```

### B. Login Cloudflare
```powershell
wrangler login
```

### C. Upload chaque fichier
```powershell
cd "G:\Mon Drive\01 BibleChantee\Suno_Output\prayers"

wrangler r2 object put bible-chantee-audio/prayers/TL_Ama_Namin.mp3 --file "TL_Ama Namin.mp3"
wrangler r2 object put bible-chantee-audio/prayers/TL_Binubuksan_Mo_Ang_Pinto.mp3 --file "TL_Binubuksan Mo Ang Pinto.mp3"
wrangler r2 object put bible-chantee-audio/prayers/TL_Ikaw_ang_Aking_Proteksiyon.mp3 --file "TL_Ikaw ang Aking Proteksiyon.mp3"
wrangler r2 object put bible-chantee-audio/prayers/TL_Panalangin_ng_Paglaya.mp3 --file "TL_Panalangin ng Paglaya.mp3"
wrangler r2 object put bible-chantee-audio/prayers/TL_Pasasalamat.mp3 --file "TL_Pasasalamat.mp3"
wrangler r2 object put bible-chantee-audio/prayers/TL_Una_Kitang_Hinahanap.mp3 --file "TL_Una Kitang Hinahanap.mp3"
```

---

## ✅ APRÈS UPLOAD: Vérification

### Test URLs (doivent retourner HTTP 200)
```bash
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/TL_Ama Namin.mp3"
curl -I "https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/prayers/TL_Pasasalamat.mp3"
```

### Test sur le site
https://biblechantee.com/prieres.html?lang=TL

**Toutes les 6 prières doivent jouer avec audio!**

---

## 📋 CHECKLIST

- [ ] Solution 1, 2 ou 3 choisie
- [ ] 6 fichiers TL uploadés vers R2
- [ ] Test curl → HTTP 200 OK
- [ ] Test site → Audio joue
- [ ] Vérifier aussi PT (5 fichiers à uploader de la même manière)

---

## 🚨 PLUS RAPIDE: Cloudflare Dashboard

**La solution 2 (Dashboard) est la plus rapide si rclone n'est pas configuré:**
1. https://dash.cloudflare.com → R2
2. Upload interface web
3. 2 minutes pour uploader les 6 fichiers
4. Test immédiat

---

FIN
