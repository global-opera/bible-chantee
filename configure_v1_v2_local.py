"""
Configure le lecteur Bible Chantée pour utiliser les fichiers locaux V1/V2
via les jonctions symboliques audio_v1, audio_v2, lyrics_v1, lyrics_v2
"""

import re
import sys
import codecs

# Fix Windows console encoding
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')

lecteur_path = r"C:\ScriptBible\bible-chantee\lecteur.html"

print("="*80)
print("  CONFIGURATION LECTEUR LOCAL V1/V2")
print("="*80)

# Lire le fichier
with open(lecteur_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
backup_path = lecteur_path + ".backup"
with open(backup_path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"\nBackup créé: {backup_path}")

# ============================================================================
# 1. MODIFIER getAudioUrl pour utiliser audio_v1 et audio_v2
# ============================================================================

old_getAudioUrl = r'''    function getAudioUrl\(book, chapter, lang\) \{
      const chapterPadded = String\(chapter\)\.padStart\(2, '0'\);
      const langUpper = lang\.toUpperCase\(\);

      // V1: CDN R2 \(1189 chapitres complets, sans paroles\)
      if \(currentVersion === 'v1' \|\| lang !== 'FR'\) \{
        // Format: https://pub-2dc4dfed0c5e45338913878f35d4d56a\.r2\.dev/\{LANG\}/\{BOOK\}/\{BOOK\}_\{CHAPTER\}_\{LANG\}\.mp3
        // Exemple: \.\.\./FR/01_GEN/01_GEN_01_FR\.mp3
        return `https://pub-2dc4dfed0c5e45338913878f35d4d56a\.r2\.dev/\$\{langUpper\}/\$\{book\}/\$\{book\}_\$\{chapterPadded\}_\$\{langUpper\}\.mp3`;
      \}

      // V2: Local \(génération en cours, avec paroles\)
      // Format: \{BOOK\}_\{CHAPTER\}_v1\.mp3 \(chapitre à 3 chiffres\)
      const chapterPadded3 = String\(chapter\)\.padStart\(3, '0'\);
      return `audio_v2/FR/\$\{book\}/\$\{book\}_\$\{chapterPadded3\}_v1\.mp3`;
    \}'''

new_getAudioUrl = '''    function getAudioUrl(book, chapter, lang) {
      const langUpper = lang.toUpperCase();

      // V1: Local FR_V1 (1189 chapitres complets)
      if (currentVersion === 'v1') {
        // Format: audio_v1/{BOOK}/{BOOK}_{CH:02}_FR.mp3
        // Exemple: audio_v1/01_GEN/01_GEN_01_FR.mp3
        const chapterPadded = String(chapter).padStart(2, '0');
        return `audio_v1/${book}/${book}_${chapterPadded}_FR.mp3`;
      }

      // V2: Local FR_V2 (génération en cours - 433 chapitres, avec paroles)
      // Format: audio_v2/{BOOK}/{BOOK}_{CH:03}_v1.mp3
      // Exemple: audio_v2/01_GEN/01_GEN_001_v1.mp3
      const chapterPadded3 = String(chapter).padStart(3, '0');
      return `audio_v2/${book}/${book}_${chapterPadded3}_v1.mp3`;
    }'''

# Apply replacement
content_new = re.sub(old_getAudioUrl, new_getAudioUrl, content, flags=re.DOTALL)

if content_new == content:
    print("\n⚠️  ATTENTION: Pattern getAudioUrl non trouvé ou déjà modifié")
else:
    content = content_new
    print("\n✅ getAudioUrl modifié")

# ============================================================================
# 2. MODIFIER loadLyricsV2 pour utiliser lyrics_v2
# ============================================================================

old_loadLyricsV2_url = r"const lyricsUrl = `lyrics/FR/\$\{book\}/\$\{book\}_\$\{chapterPadded\}_FR\.txt`;"

new_loadLyricsV2_url = """const chapterPadded3 = String(chapter).padStart(3, '0');
      const lyricsUrl = `lyrics_v2/${book}/${book}_${chapterPadded3}_FR.txt`;"""

content = re.sub(old_loadLyricsV2_url, new_loadLyricsV2_url, content)
print("✅ loadLyricsV2 modifié pour utiliser lyrics_v2")

# ============================================================================
# 3. CRÉER loadLyricsV1 et modifier loadLyrics pour l'utiliser
# ============================================================================

# Trouver la position pour insérer loadLyricsV1
insert_marker = "    // Fonction pour charger les paroles V2 depuis le fichier local"

loadLyricsV1_function = '''    // Fonction pour charger les paroles V1 depuis le fichier local
    async function loadLyricsV1(book, chapter) {
      const lyricsContent = document.getElementById('lyricsContent');
      lyricsContent.innerHTML = '<p style="color: #999; font-style: italic;">Chargement des paroles V1...</p>';

      const chapterPadded = String(chapter).padStart(2, '0');
      const lyricsUrl = `lyrics_v1/${book}/${book}_${chapterPadded}_FR.txt`;

      console.log('[V1] Chargement paroles:', lyricsUrl);

      try {
        const response = await fetch(lyricsUrl);
        console.log('[V1] Response status:', response.status, response.ok);

        if (!response.ok) {
          throw new Error(`Paroles V1 non disponibles (HTTP ${response.status})`);
        }

        let lyrics = await response.text();
        console.log('[V1] Paroles chargées, longueur:', lyrics.length);

        // Nettoyer les tags [TITLE], [LYRICS], [STYLE]
        lyrics = lyrics.replace(/\\[TITLE\\][^\\[]*/, '');
        lyrics = lyrics.replace(/\\[LYRICS\\]/gi, '');
        lyrics = lyrics.replace(/\\[STYLE\\][\\s\\S]*$/gi, '');

        // Formatter les paroles
        const paragraphs = lyrics.trim().split('\\n\\n');
        const html = paragraphs.map(p => {
          const lines = p.split('\\n').join('<br>');
          return '<p style="margin: 0 0 1.5em 0; line-height: 1.8;">' + lines + '</p>';
        }).join('');

        lyricsContent.innerHTML = html || '<p style="color: #999;">Paroles V1 vides</p>';
      } catch (error) {
        console.error('[V1] Erreur chargement paroles:', error);
        lyricsContent.innerHTML = '<div style="text-align: center; padding: 40px; color: #F5CB42; font-size: 16px;">📝 Paroles V1 non disponibles</div>';
      }
    }

'''

if insert_marker in content:
    content = content.replace(insert_marker, loadLyricsV1_function + "\n" + insert_marker)
    print("✅ loadLyricsV1 inséré")
else:
    print("⚠️  ATTENTION: Marqueur d'insertion non trouvé")

# ============================================================================
# 4. MODIFIER loadLyrics pour utiliser loadLyricsV1 en V1
# ============================================================================

old_loadLyrics_v1_section = r'''      // Si on est en FR et en V1, afficher message pour V2
      if \(lang === 'FR' && currentVersion === 'v1'\) \{
        lyricsContent\.innerHTML = '<div style="text-align: center; padding: 40px; color: #F5CB42; font-size: 18px;">🎵 Paroles disponibles en V2</div>';
        return;
      \}'''

new_loadLyrics_v1_section = '''      // Si on est en FR et en V1, charger les paroles V1
      if (lang === 'FR' && currentVersion === 'v1') {
        loadLyricsV1(bookCode, chapter);
        return;
      }'''

content = re.sub(old_loadLyrics_v1_section, new_loadLyrics_v1_section, content, flags=re.DOTALL)
print("✅ loadLyrics modifié pour appeler loadLyricsV1")

# ============================================================================
# 5. MODIFIER le bouton V1 pour charger les paroles V1
# ============================================================================

old_btnV1_handler = r'''    document\.getElementById\('btnV1Mini'\)\.addEventListener\('click', \(\) => \{
      currentVersion = 'v1';
      document\.getElementById\('btnV1Mini'\)\.classList\.add\('active'\);
      document\.getElementById\('btnV2Mini'\)\.classList\.remove\('active'\);

      // Afficher message "Paroles disponibles en V2"
      const lyricsContent = document\.getElementById\('lyricsContent'\);
      lyricsContent\.innerHTML = '<div style="text-align: center; padding: 40px; color: #F5CB42; font-size: 18px;">🎵 Paroles disponibles en V2</div>';

      // Recharger l'audio en V1
      const audioUrl = getAudioUrl\(currentBook, currentChapter, currentLang\);
      audioPlayer\.src = audioUrl;
      audioPlayer\.load\(\);
      if \(isPlaying\) \{
        audioPlayer\.play\(\)\.catch\(e => console\.log\('Lecture bloquée:', e\)\);
      \}
    \}\);'''

new_btnV1_handler = '''    document.getElementById('btnV1Mini').addEventListener('click', () => {
      currentVersion = 'v1';
      document.getElementById('btnV1Mini').classList.add('active');
      document.getElementById('btnV2Mini').classList.remove('active');

      // Charger les paroles V1
      loadLyricsV1(currentBook, currentChapter);

      // Recharger l'audio en V1
      const audioUrl = getAudioUrl(currentBook, currentChapter, currentLang);
      audioPlayer.src = audioUrl;
      audioPlayer.load();
      if (isPlaying) {
        audioPlayer.play().catch(e => console.log('Lecture bloquée:', e));
      }
    });'''

content = re.sub(old_btnV1_handler, new_btnV1_handler, content, flags=re.DOTALL)
print("✅ Bouton V1 modifié pour charger paroles V1")

# ============================================================================
# 6. ÉCRIRE LE FICHIER MODIFIÉ
# ============================================================================

with open(lecteur_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("\n" + "="*80)
print("  ✅ CONFIGURATION TERMINÉE")
print("="*80)
print(f"\nFichier modifié: {lecteur_path}")
print(f"Backup: {backup_path}")
print("\nMODIFICATIONS APPLIQUÉES:")
print("  1. getAudioUrl: Utilise audio_v1 et audio_v2 (liens symboliques)")
print("  2. loadLyricsV1: Charge depuis lyrics_v1/{BOOK}/{BOOK}_{CH:02}_FR.txt")
print("  3. loadLyricsV2: Charge depuis lyrics_v2/{BOOK}/{BOOK}_{CH:03}_FR.txt")
print("  4. Toggle V1/V2: Bascule audio ET paroles")
print("\nTEST:")
print("  cd C:\\ScriptBible\\bible-chantee")
print("  python -m http.server 8080")
print("  Ouvrir: http://localhost:8080/lecteur.html")
print("="*80)
