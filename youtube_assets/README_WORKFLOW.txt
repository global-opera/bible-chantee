================================================================================
WORKFLOW VIDEO YOUTUBE - BIBLE CHANTEE
================================================================================

GENESE 1 FR - EXEMPLE COMPLET

FICHIERS CREES:
================================================================================
1. background_genesis1.png     (1920x1080) - Fond video avec degrade + etoiles
2. thumbnail_genesis1.png      (1280x720)  - Miniature YouTube
3. create_video.bat            - Script assemblage video final
4. 01_GEN_01_FR.srt            - Sous-titres synchronises (EN COURS)

ETAPES COMPLETEES:
================================================================================
[X] Background image (1920x1080)
[X] Thumbnail (1280x720)
[X] Script d'assemblage video
[ ] SRT subtitles (Whisper en cours de generation...)

PROCHAINE ETAPE:
================================================================================
Une fois le fichier SRT genere, lancer:
> create_video.bat

Cela creera: FR_Genese_01_BibleChantee.mp4

DUREE ESTIMEE SRT:
================================================================================
Whisper large-v3 prend ~2-3 minutes pour transcrire un MP3 de 3-4 minutes
avec timestamps precis. La generation est en cours en arriere-plan.

SPECIFICATIONS VIDEO FINALE:
================================================================================
Format:        MP4 (H.264 + AAC)
Resolution:    1920x1080 (Full HD)
Audio bitrate: 192 kbps
Subtitles:     Blancs avec contour noir, centres en bas
Style:         Karaoke synchronise avec l'audio

POUR YOUTUBE:
================================================================================
1. Uploader: FR_Genese_01_BibleChantee.mp4
2. Miniature: thumbnail_genesis1.png
3. Titre suggere: "Genese 1 - Au Commencement | Bible Chantee"
4. Description:
   
   La Genese chapitre 1 mise en musique.
   
   Bible Chantee - L'integralite de la Bible en musique
   1189 chapitres en 7 langues
   
   biblechantee.com
   
   #Bible #Genese #Worship #ChristianMusic

NOMMAGE FICHIERS:
================================================================================
Videos:     [LANG]_[Livre]_[Chapitre]_BibleChantee.mp4
Exemple:    FR_Genese_01_BibleChantee.mp4
            EN_Genesis_01_BibleChantee.mp4
            ES_Genesis_01_BibleChantee.mp4

POUR AUTRES CHAPITRES:
================================================================================
1. Modifier create_background.py pour changer le titre
2. Regenerer le background: python create_background.py
3. Regenerer SRT: whisper [MP3] --model large-v3 --language [LANG] --output_format srt
4. Lancer create_video.bat

AUTOMATISATION FUTURE:
================================================================================
Creer un script Python qui genere automatiquement:
- Background personnalise par chapitre
- SRT via Whisper
- Video via FFmpeg
Pour tous les 1189 chapitres

================================================================================
