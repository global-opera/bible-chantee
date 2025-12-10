// Bible Chantee V2 - URLs des fichiers MP3
// Source: Google Drive - Suno_Output_V2/FR/

const audioUrlsV2 = {
    // Format: "BOOK_CHAPTER": "URL_MP3"
    // Les URLs Google Drive doivent etre au format:
    // https://drive.google.com/uc?export=download&id=FILE_ID
    
    // 01_GEN - Genese (50 chapitres)
    // A remplir avec les IDs Google Drive des MP3 V2
    
    // Exemple:
    // "01_GEN_01": "https://drive.google.com/uc?export=download&id=XXXX",
    // "01_GEN_02": "https://drive.google.com/uc?export=download&id=XXXX",
    
    // 02_EXO - Exode (40 chapitres)
    // A remplir au fur et a mesure
};

// Export pour utilisation dans le lecteur
if (typeof module !== 'undefined') {
    module.exports = audioUrlsV2;
}
