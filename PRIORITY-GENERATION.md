# GÉNÉRATION PRIORITAIRE - 10 Chapitres PT
**Compléter 5 livres pour passer de 12 à 17 livres complets (42% → 26% de progression)**

## 📋 COMMANDES À EXÉCUTER (dans l'ordre):

### 1. 1 Chroniques - CH. 29 (1 chapitre)
```bash
python Scripts/suno_api_generator.py --lang PT --book 13_1CH --chapter 29
```
**Résultat:** 1 Chroniques 100% complet ✅

---

### 2. Esdras - CH. 6 (1 chapitre)
```bash
python Scripts/suno_api_generator.py --lang PT --book 15_EZR --chapter 6
```
**Résultat:** Esdras 100% complet ✅

---

### 3. Esther - CH. 6 (1 chapitre)
```bash
python Scripts/suno_api_generator.py --lang PT --book 17_EST --chapter 6
```
**Résultat:** Esther 100% complet ✅

---

### 4. Néhémie - CH. 5, 10 (2 chapitres)
```bash
python Scripts/suno_api_generator.py --lang PT --book 16_NEH --chapter 5
python Scripts/suno_api_generator.py --lang PT --book 16_NEH --chapter 10
```
**Résultat:** Néhémie 100% complet ✅

---

### 5. 2 Chroniques - CH. 5, 16, 21, 27, 33 (5 chapitres)
```bash
python Scripts/suno_api_generator.py --lang PT --book 14_2CH --chapter 5
python Scripts/suno_api_generator.py --lang PT --book 14_2CH --chapter 16
python Scripts/suno_api_generator.py --lang PT --book 14_2CH --chapter 21
python Scripts/suno_api_generator.py --lang PT --book 14_2CH --chapter 27
python Scripts/suno_api_generator.py --lang PT --book 14_2CH --chapter 33
```
**Résultat:** 2 Chroniques 100% complet ✅

---

## 📊 IMPACT:

**Avant:**
- 12 livres complets / 66 (18.2%)
- 436 chapitres / 1189 (36.7%)

**Après ces 10 chapitres:**
- **17 livres complets / 66 (25.8%)** ⬆️ +7.6%
- **446 chapitres / 1189 (37.5%)** ⬆️ +0.8%

---

## 🔄 APRÈS GÉNÉRATION:

```bash
# 1. Vérifier les nouveaux fichiers
ls "G:/Mon Drive/01 BibleChantee/Suno_Output_V2/PT/"

# 2. Régénérer audio-urls-pt.js
cd bible-chantee
python generate-all-audio-urls.py

# 3. Analyser progression
python analyze-missing-chapters.py

# 4. Déployer
git add audio-urls-pt.js
git commit -m "Update PT: +10 chapters (17 books complete)"
git push

# 5. Upload vers Archive.org
# (Uploader les 10 nouveaux MP3 vers bible-chantee-pt-v2)
```

---

## ⏱️ ESTIMATION:

- **Temps:** ~2.5 minutes par chapitre = ~25 minutes total
- **Coût:** ~120 crédits Suno (10 chapitres × 12 crédits)

---

## 🎯 PROCHAINES PRIORITÉS (après ces 10):

**6. Job - Chapitres 11-42** (32 chapitres)
- Compléter Job: 76% → 100%

**7. Psaumes** (150 chapitres)
- Livre le plus long, commencer progressivement

**8. Nouveau Testament** (260 chapitres)
- Impact maximum: 27 livres d'un coup
