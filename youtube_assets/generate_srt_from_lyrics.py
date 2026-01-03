"""
Generer un fichier SRT a partir des paroles Whisper
Repartition temporelle approximative
"""

DURATION = 234.84  # 3m54s
LYRICS_FILE = r"G:\Mon Drive\01 BibleChantee\Lyrics_Whisper_FR\01_GEN\01_GEN_01_FR.txt"
OUTPUT_FILE = "01_GEN_01_FR.srt"

def read_lyrics(filepath):
    """Lire les paroles et extraire les lignes non-vides"""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Extraire seulement les paroles (ignorer [TITLE], [LYRICS], [Verse], etc.)
    lyrics = []
    in_lyrics = False
    for line in lines:
        line = line.strip()
        if line == "[LYRICS]":
            in_lyrics = True
            continue
        if in_lyrics and line and not line.startswith('['):
            lyrics.append(line)
    
    return lyrics

def format_time(seconds):
    """Convertir secondes en format SRT: HH:MM:SS,mmm"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def create_srt(lyrics, duration, output_file):
    """Creer le fichier SRT"""
    num_lines = len(lyrics)
    time_per_line = duration / num_lines
    
    with open(output_file, 'w', encoding='utf-8') as f:
        for i, line in enumerate(lyrics):
            start_time = i * time_per_line
            end_time = (i + 1) * time_per_line
            
            # Numero de sous-titre
            f.write(f"{i+1}\n")
            # Timestamps
            f.write(f"{format_time(start_time)} --> {format_time(end_time)}\n")
            # Texte
            f.write(f"{line}\n")
            # Ligne vide
            f.write("\n")
    
    print(f"OK! SRT cree: {output_file}")
    print(f"  {num_lines} sous-titres")
    print(f"  Duree: {duration:.2f}s")
    print(f"  Temps moyen par ligne: {time_per_line:.2f}s")

def main():
    print("Generation SRT depuis paroles Whisper...")
    
    lyrics = read_lyrics(LYRICS_FILE)
    print(f"  {len(lyrics)} lignes extraites")
    
    create_srt(lyrics, DURATION, OUTPUT_FILE)

if __name__ == "__main__":
    main()
