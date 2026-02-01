/**
 * Formateur de paroles avec structure [Verse]/[Chorus]
 * Convertit les tags en HTML avec classes CSS pour formatage
 */

const LyricsFormatter = {
    /**
     * Formate les paroles avec tags structurels
     * @param {string} rawLyrics - Paroles brutes avec tags [Verse], [Chorus], etc.
     * @returns {string} HTML formaté
     */
    format(rawLyrics) {
        if (!rawLyrics) {
            return '<p class="lyrics-empty">Paroles non disponibles</p>';
        }

        let html = rawLyrics;

        // Supprimer les espaces de début (reste du symbole ¶)
        html = html.replace(/^ /gm, '');

        // Convertir les tags en HTML avec traduction française
        const tagMap = {
            'Verse': 'Couplet',
            'Pre-Chorus': 'Pré-refrain',
            'Chorus': 'Refrain',
            'Bridge': 'Pont',
            'Outro': 'Final',
            'Final Chorus': 'Refrain final',
            'Intro': 'Introduction'
        };

        // Détecter et convertir chaque tag
        Object.keys(tagMap).forEach(tag => {
            const frenchLabel = tagMap[tag];

            // Pattern: [Tag] ou [Tag 1], [Tag 2], etc.
            const pattern = new RegExp(`\\[${tag}(\\s+(\\d+))?\\]`, 'gi');

            html = html.replace(pattern, (match, _, num) => {
                const label = num ? `${frenchLabel} ${num}` : frenchLabel;
                const cssClass = tag.toLowerCase().replace(/\s+/g, '-');
                return `<div class="lyrics-section lyrics-${cssClass}"><div class="lyrics-tag">${label}</div>`;
            });
        });

        // Fermer les sections avant le prochain tag ou à la fin
        html = html.replace(/(<div class="lyrics-section[^>]*>[\s\S]*?)(?=<div class="lyrics-section|$)/g, '$1</div>');

        // Convertir les doubles sauts de ligne en paragraphes
        html = html.replace(/\n\n+/g, '</p><p class="lyrics-paragraph">');

        // Convertir les simples sauts de ligne en <br>
        html = html.replace(/\n/g, '<br>');

        // Wrap le tout dans un conteneur
        html = '<div class="lyrics-container"><p class="lyrics-paragraph">' + html + '</p></div>';

        // Nettoyer les paragraphes vides
        html = html.replace(/<p class="lyrics-paragraph"><\/p>/g, '');
        html = html.replace(/<p class="lyrics-paragraph">[\s<br>]*<\/p>/g, '');

        return html;
    },

    /**
     * Extrait le premier titre répété (pour le supprimer si nécessaire)
     * @param {string} lyrics - Paroles
     * @returns {string} Titre extrait ou null
     */
    extractRepeatedTitle(lyrics) {
        const lines = lyrics.split('\n');
        const firstLines = lines.slice(0, 5).filter(l => l.trim());

        // Chercher une ligne qui se répète dans les premiers couplets
        for (let line of firstLines) {
            const trimmed = line.trim();
            if (trimmed.length > 20) {  // Titre probable
                const occurrences = (lyrics.match(new RegExp(this.escapeRegex(trimmed), 'g')) || []).length;
                if (occurrences >= 3) {  // Se répète au moins 3 fois
                    return trimmed;
                }
            }
        }

        return null;
    },

    /**
     * Échappe les caractères spéciaux pour regex
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    /**
     * Supprime le titre répété du début des paroles
     * @param {string} lyrics - Paroles
     * @param {string} title - Titre à supprimer
     * @returns {string} Paroles sans titre répété
     */
    removeRepeatedTitle(lyrics, title) {
        if (!title) return lyrics;

        // Supprimer seulement la première occurrence dans [Verse 1]
        const pattern = new RegExp(`(\\[Verse 1\\][^\\[]*?)${this.escapeRegex(title)}`, 'i');
        return lyrics.replace(pattern, '$1');
    }
};

// Export pour utilisation dans lecteur.html
if (typeof window !== 'undefined') {
    window.LyricsFormatter = LyricsFormatter;
}
