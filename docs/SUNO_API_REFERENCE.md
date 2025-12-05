# Référence API Suno - Paramètres et Limites

## 📋 Format de Réponse Standard

Toutes les réponses de l'API Suno suivent ce format:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "5c79****be8e"
  }
}
```

## 🎛️ Modes de Génération

### Custom Mode (`customMode: true`)

Mode avec contrôle complet sur les paroles, style et titre.

**Instrumental = true:**
- ✅ `style` (requis)
- ✅ `title` (requis)
- ❌ `prompt` (ignoré)

**Instrumental = false:**
- ✅ `style` (requis)
- ✅ `prompt` / lyrics (requis)
- ✅ `title` (requis)

### Non-Custom Mode (`customMode: false`)

Mode automatique où Suno génère tout.

- ✅ `prompt` (requis uniquement)
- ❌ Tous les autres paramètres doivent être vides

**Limite:** 500 caractères pour le prompt

## 📏 Limites de Caractères par Modèle

### Prompt (Lyrics)

| Modèle | Limite |
|--------|--------|
| V4 | 3 000 caractères |
| V4_5 | 5 000 caractères |
| V4_5PLUS | 5 000 caractères |
| V4_5ALL | 5 000 caractères |
| V5 | 5 000 caractères |

### Style

| Modèle | Limite |
|--------|--------|
| V4 | 200 caractères |
| V4_5 | 1 000 caractères |
| V4_5PLUS | 1 000 caractères |
| V4_5ALL | 1 000 caractères |
| V5 | 1 000 caractères |

### Title

| Modèle | Limite |
|--------|--------|
| V4 | 80 caractères |
| V4_5 | 100 caractères |
| V4_5PLUS | 100 caractères |
| V4_5ALL | 80 caractères |
| V5 | 100 caractères |

## 🎵 Paramètres Disponibles

### Paramètres de Base

```python
{
  "customMode": True,              # Mode personnalisé
  "prompt": "lyrics here",         # Paroles (requis si instrumental=False)
  "style": "French worship",       # Style musical (requis)
  "title": "Song Title",           # Titre (requis)
  "instrumental": False,           # Avec/sans voix
  "model": "V4_5ALL"              # Version du modèle
}
```

### Paramètres Avancés

```python
{
  "vocalGender": "m",              # Genre vocal: "m" ou "f"
  "styleWeight": 0.65,             # Poids du style: 0.0-1.0
  "weirdnessConstraint": 0.65,     # Créativité: 0.0-1.0
  "audioWeight": 0.65,             # Poids audio: 0.0-1.0
  "negativeTags": "Heavy Metal",   # Tags à éviter
  "personaId": "persona_123",      # ID persona personnalisée
  "callBackUrl": "https://..."     # URL webhook
}
```

## 📊 Modèles Disponibles

### V4
- Qualité vocale améliorée
- Traitement audio raffiné
- Durée max: **4 minutes**

### V4_5
- Excellente compréhension du prompt
- Génération plus rapide
- Durée max: **8 minutes**

### V4_5PLUS
- Modèle le plus avancé
- Variation tonale améliorée
- Durée max: **8 minutes**

### V4_5ALL
- Meilleure structure de chanson
- Durée max: **8 minutes**
- **Recommandé pour usage général**

### V5
- Modèle de pointe le plus récent
- Dernières améliorations
- Durée max: À confirmer

## 🔄 Processus de Callback

Le webhook passe par **3 étapes:**

1. **`text`** - Génération du texte
2. **`first`** - Première piste complète
3. **`complete`** - Toutes les pistes complètes

## 🗑️ Rétention des Fichiers

Les fichiers générés sont conservés **15 jours** avant suppression automatique.

## ✅ Recommandations pour Débutants

Pour vos premiers tests:

```python
{
  "customMode": False,
  "instrumental": False,
  "prompt": "A calm worship song about grace"
}
```

C'est la configuration la plus simple pour tester rapidement l'API.

## 📝 Exemples Complets

### Exemple 1: Chanson Worship Française

```python
payload = {
    "customMode": True,
    "instrumental": False,
    "model": "V4_5ALL",
    "prompt": """[Verse]
Dans la lumière du matin
Je chante ton nom divin
Tu es mon guide et mon soutien

[Chorus]
Alléluia, gloire à Toi
Mon cœur t'adore, mon Roi""",
    "style": "French worship, acoustic guitar, 72 BPM, contemplative",
    "title": "Lumière du Matin",
    "styleWeight": 0.65,
    "weirdnessConstraint": 0.65,
    "audioWeight": 0.65
}
```

### Exemple 2: Musique Instrumentale

```python
payload = {
    "customMode": True,
    "instrumental": True,
    "model": "V4_5ALL",
    "style": "Classical piano, peaceful, meditative, 60 BPM",
    "title": "Peaceful Meditation",
    "styleWeight": 0.7,
    "weirdnessConstraint": 0.5
}
```

### Exemple 3: Mode Simple (Débutant)

```python
payload = {
    "customMode": False,
    "instrumental": False,
    "prompt": "Create a joyful worship song about God's love"
}
```

## 🔍 Vérification du Statut

Au lieu d'attendre les callbacks, vous pouvez activement interroger:

```python
GET /api/v1/generate/record-info?taskId={taskId}
```

## ⚙️ Valeurs Recommandées

Pour de la musique worship:

```python
styleWeight = 0.65          # Bon équilibre style/créativité
weirdnessConstraint = 0.65  # Créativité modérée
audioWeight = 0.65          # Qualité audio standard
model = "V4_5ALL"           # Meilleure structure
```

Pour de la musique instrumentale:

```python
styleWeight = 0.7           # Plus fidèle au style
weirdnessConstraint = 0.5   # Moins de créativité
audioWeight = 0.7           # Priorité à la qualité audio
instrumental = True
```

## 🚨 Erreurs Communes

1. **Dépassement des limites de caractères**
   - ✅ Le script valide et tronque automatiquement

2. **Paramètres manquants en Custom Mode**
   - ✅ Vérifier que style, prompt, title sont fournis

3. **Custom Mode avec instrumental=true**
   - ❌ Ne pas fournir de prompt
   - ✅ Fournir uniquement style et title

4. **Format de callback URL invalide**
   - ✅ Doit être une URL HTTPS valide

## 📞 Support

- Documentation: [docs.sunoapi.org](https://docs.sunoapi.org)
- Email: support@sunoapi.org
- Disponibilité: 24/7

---

**Dernière mise à jour:** Décembre 2025
