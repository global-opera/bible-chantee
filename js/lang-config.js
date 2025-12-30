/**
 * Language Configuration Module
 * Centralized language settings for Bible Chantée
 *
 * Usage:
 *   <script src="js/lang-config.js"></script>
 *   const config = await LANG_CONFIG.load();
 *   console.log(config.languages.FR.chapters); // 1189
 */

window.LANG_CONFIG = (function() {
    let config = null;

    /**
     * Load language configuration from JSON file
     * @returns {Promise<Object>} Language configuration object
     */
    async function load() {
        if (config) return config;

        try {
            const response = await fetch('js/lang-config.json');
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status}`);
            }
            config = await response.json();
            return config;
        } catch (error) {
            console.error('Error loading language config:', error);
            // Return fallback config
            return getFallbackConfig();
        }
    }

    /**
     * Get language info by code
     * @param {string} langCode - Language code (e.g., 'FR', 'EN')
     * @returns {Promise<Object>} Language info
     */
    async function getLanguage(langCode) {
        const cfg = await load();
        return cfg.languages[langCode] || null;
    }

    /**
     * Get all complete languages
     * @returns {Promise<Array>} Array of complete language codes
     */
    async function getCompleteLanguages() {
        const cfg = await load();
        return Object.entries(cfg.languages)
            .filter(([code, lang]) => lang.status === 'complete')
            .map(([code]) => code);
    }

    /**
     * Get progress percentage for a language
     * @param {string} langCode - Language code
     * @returns {Promise<number>} Progress percentage (0-100)
     */
    async function getProgress(langCode) {
        const cfg = await load();
        const lang = cfg.languages[langCode];
        if (!lang) return 0;
        return Math.round((lang.chapters / cfg.totalChapters) * 100);
    }

    /**
     * Update language progress
     * @param {string} langCode - Language code
     * @param {number} chapters - Number of chapters completed
     */
    function updateProgress(langCode, chapters) {
        if (!config) {
            console.warn('Config not loaded yet');
            return;
        }
        if (config.languages[langCode]) {
            config.languages[langCode].chapters = chapters;
            const progress = (chapters / config.totalChapters) * 100;
            if (progress === 100) {
                config.languages[langCode].status = 'complete';
            } else if (progress > 0) {
                config.languages[langCode].status = 'generating';
            }
        }
    }

    /**
     * Fallback configuration if JSON fails to load
     */
    function getFallbackConfig() {
        return {
            languages: {
                FR: { name: "Français", flag: "🇫🇷", chapters: 1189, status: "complete" },
                EN: { name: "English", flag: "🇬🇧", chapters: 1189, status: "complete" },
                PT: { name: "Português", flag: "🇧🇷", chapters: 1189, status: "complete" },
                ES: { name: "Español", flag: "🇪🇸", chapters: 1189, status: "complete" },
                DE: { name: "Deutsch", flag: "🇩🇪", chapters: 1189, status: "complete" },
                IT: { name: "Italiano", flag: "🇮🇹", chapters: 1189, status: "complete" }
            },
            totalChapters: 1189,
            lastUpdated: "2024-12-30"
        };
    }

    // Public API
    return {
        load,
        getLanguage,
        getCompleteLanguages,
        getProgress,
        updateProgress
    };
})();

// Auto-load on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LANG_CONFIG.load());
} else {
    LANG_CONFIG.load();
}
