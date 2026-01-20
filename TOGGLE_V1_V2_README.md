# Toggle V1/V2 - Bible Chantée

## Modifications apportées au lecteur

### 1. Nouveau toggle V1/V2 (FR uniquement)
- Visible uniquement quand la langue FR est sélectionnée
- Deux boutons :
  - **V1 (Sans paroles)** : Charge les MP3 depuis le CDN R2 (1189 chapitres complets)
  - **V2 (Avec paroles)** : Charge les MP3 locaux + affiche les paroles synchronisées

### 2. Sources des fichiers

#### V1 (Sans paroles)
- **URL**: `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/FR/{BOOK}/{BOOK}_{CH}_FR.mp3`
- **Format**: Chapitre sur 2 chiffres (01-50)
- **Exemple**: `https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/FR/01_GEN/01_GEN_01_FR.mp3`
- **Disponibilité**: 1189 chapitres complets
- **Paroles**: Message "🎵 Paroles disponibles en V2"

#### V2 (Avec paroles)
- **URL MP3**: `http://localhost:8080/Suno_Output/FR/{BOOK}/{BOOK}_{CH}_v1.mp3`
- **Format**: Chapitre sur 3 chiffres (001-050)
- **Exemple MP3**: `http://localhost:8080/Suno_Output/FR/01_GEN/01_GEN_001_v1.mp3`
- **URL Paroles**: `http://localhost:8080/Lyrics/FR/{BOOK}/{BOOK}_{CH}_FR.txt`
- **Exemple Paroles**: `http://localhost:8080/Lyrics/FR/01_GEN/01_GEN_001_FR.txt`
- **Disponibilité**: 90 chapitres (Genesis + Exode + Lévitique en cours)
- **Paroles**: Chargées depuis fichier .txt et nettoyées (tags [VERSE], [CHORUS] supprimés)

### 3. Nettoyage des paroles V2

Les tags suivants sont automatiquement supprimés :
- `[TITLE]`
- `[LYRICS]`
- `[STYLE]`
- `[Verse 1]`, `[Verse 2]`, etc.
- `[Chorus]`
- `[Bridge]`
- `[Pre-Chorus]`
- `[Intro]`
- `[Outro]`

### 4. Comportement du toggle

#### Au changement de version :
1. Met à jour le style du bouton actif
2. Recharge l'audio depuis la nouvelle source
3. Met à jour les paroles :
   - V1 : Affiche "🎵 Paroles disponibles en V2"
   - V2 : Charge et affiche les paroles du fichier .txt ou "⏳ Paroles V2 bientôt disponibles"
4. Garde la lecture en cours si l'audio était en train de jouer

#### Au changement de langue :
- Toggle V1/V2 visible uniquement en FR
- Autres langues : forcées en V1 (CDN R2)

## Test en local

### Prérequis
- Python 3 installé
- Liens symboliques vers Google Drive créés automatiquement

### Lancer le serveur de test
```bash
cd C:\ScriptBible\bible-chantee
test-v2-local.bat
```

### Tester
1. Ouvrir http://localhost:8080/lecteur.html
2. S'assurer que FR est sélectionné (toggle V1/V2 visible)
3. Cliquer sur "V2 (Avec paroles)"
4. Sélectionner Genesis, Exode ou Lévitique (chapitres V2 disponibles)
5. Les paroles doivent s'afficher automatiquement

### Vérifier
- ✅ Toggle visible en FR, masqué dans les autres langues
- ✅ V1 : MP3 du CDN R2 + message "Paroles disponibles en V2"
- ✅ V2 : MP3 local + paroles nettoyées affichées
- ✅ Changement de chapitre met à jour les paroles en V2
- ✅ Message "⏳ Paroles V2 bientôt disponibles" si chapitre V2 n'existe pas encore

## Fichiers modifiés

### lecteur.html
- **Lignes 1219-1287** : Styles CSS pour le toggle et section paroles
- **Lignes 1259-1287** : HTML du toggle V1/V2
- **Ligne 1702** : Variable `currentVersion`
- **Lignes 1911-1928** : Fonction `getAudioUrl()` modifiée pour V1/V2
- **Lignes 1929-1949** : Fonction `loadAndPlayChapter()` avec gestion paroles
- **Lignes 2537-2611** : Gestionnaires événements toggle V1/V2 + fonction `loadLyricsV2()`
- **Lignes 2262-2273** : Affichage/masquage toggle selon langue
- **Lignes 3079-3092** : Initialisation du toggle au chargement

## Structure attendue Google Drive

```
G:\Mon Drive\01 BibleChantee\
├── Suno_Output\
│   └── FR\
│       ├── 01_GEN\
│       │   ├── 01_GEN_001_v1.mp3
│       │   ├── 01_GEN_002_v1.mp3
│       │   └── ...
│       ├── 02_EXO\
│       └── 03_LEV\
└── Lyrics\
    └── FR\
        ├── 01_GEN\
        │   ├── 01_GEN_001_FR.txt
        │   ├── 01_GEN_002_FR.txt
        │   └── ...
        ├── 02_EXO\
        └── 03_LEV\
```

## Prochaines étapes

1. ✅ Test local réussi
2. ⏳ Upload des MP3 V2 sur un CDN dédié
3. ⏳ Mise à jour de l'URL V2 dans `getAudioUrl()` pour pointer vers le CDN
4. ⏳ Génération complète des 1189 chapitres V2
5. ⏳ Déploiement en production

## Notes importantes

- **Version par défaut** : V1 (CDN R2 complet)
- **Basculement automatique** : Si V2 sélectionné mais fichier manquant, message d'attente affiché
- **Performance** : V1 sur CDN = latence faible. V2 local = test uniquement.
- **Production** : Nécessite upload V2 sur CDN avant activation
