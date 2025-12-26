// Bible Chantee - Internationalization System
// Reusable multi-language system for all pages

(function(window) {
  'use strict';

  // REMOVED: Old dropdown language selector (replaced by horizontal language bar in each page)

  // I18n class
  class I18n {
    constructor() {
      this.currentLang = this.getInitialLanguage();
      this.translations = window.translations || {};
      this.init();
    }

    // Get initial language from URL, localStorage, or browser
    getInitialLanguage() {
      // Valid language codes
      const validLangs = ['FR', 'EN', 'ES', 'PT', 'DE', 'IT', 'RU', 'AR', 'ZH', 'HI', 'TL', 'KO'];

      // Priority 1: URL parameter ?lang=XX (highest priority for navigation)
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang) {
        const langCode = urlLang.toUpperCase();
        if (validLangs.includes(langCode)) {
          // Save to localStorage for future visits (unified on bc_lang)
          localStorage.setItem('bc_lang', langCode);
          // Sync with selectedLanguage for backward compatibility
          localStorage.setItem('selectedLanguage', langCode);
          return langCode;
        }
      }

      // Priority 2: localStorage (user's previous choice)
      // Read from bc_lang (primary) or selectedLanguage (fallback for compatibility)
      const saved = localStorage.getItem('bc_lang') || localStorage.getItem('selectedLanguage');
      if (saved && validLangs.includes(saved)) {
        // Ensure both keys are synced
        if (!localStorage.getItem('bc_lang')) {
          localStorage.setItem('bc_lang', saved);
        }
        if (!localStorage.getItem('selectedLanguage')) {
          localStorage.setItem('selectedLanguage', saved);
        }
        return saved;
      }

      // Priority 3: Detect browser language
      const browserLang = navigator.language || navigator.userLanguage;
      const langCode = browserLang.split('-')[0].toUpperCase();

      // Map common browser language codes
      const langMap = {
        'FR': 'FR', 'EN': 'EN', 'ES': 'ES', 'PT': 'PT',
        'DE': 'DE', 'IT': 'IT', 'RU': 'RU', 'AR': 'AR',
        'ZH': 'ZH', 'HI': 'HI', 'TL': 'TL', 'KO': 'KO'
      };

      return langMap[langCode] || 'FR';
    }

    // Initialize the i18n system
    init() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    // Setup: Apply translations (dropdown removed - now using horizontal language bar in each page)
    setup() {
      // Apply initial translations
      this.applyTranslations(this.currentLang);
    }

    // Apply translations to page
    applyTranslations(lang) {
      const trans = this.translations[lang] || this.translations['FR'] || {};

      // Update all elements with data-i18n attribute
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (trans[key]) {
          // Check if element has children that should be preserved
          const hasImportantChildren = element.querySelector('strong, em, b, i, a');

          if (hasImportantChildren) {
            // Try to preserve HTML structure
            const parser = new DOMParser();
            const doc = parser.parseFromString(trans[key], 'text/html');
            if (doc.body.firstChild) {
              element.textContent = trans[key];
            }
          } else {
            element.textContent = trans[key];
          }
        }
      });

      // Update placeholders for input elements with data-i18n-placeholder attribute
      document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (trans[key]) {
          element.placeholder = trans[key];
        }
      });

      // Update page title if exists
      if (trans.pageTitle) {
        document.title = trans.pageTitle;
      }

      // Update HTML lang attribute
      const langAttrMap = {
        'FR': 'fr', 'EN': 'en', 'ES': 'es', 'PT': 'pt',
        'DE': 'de', 'IT': 'it', 'RU': 'ru', 'AR': 'ar',
        'ZH': 'zh', 'HI': 'hi', 'TL': 'tl', 'KO': 'ko'
      };
      document.documentElement.lang = langAttrMap[lang] || 'fr';

      // Handle RTL languages
      if (lang === 'AR') {
        document.body.dir = 'rtl';
      } else {
        document.body.dir = 'ltr';
      }

      // CRITICAL: Preserve language in all links after translation
      this.preserveLanguageInLinks();
    }

    // UNIVERSAL LINK FIXER - Automatically preserve language across navigation
    preserveLanguageInLinks() {
      const currentLang = this.currentLang;

      // Update all internal links to include ?lang parameter
      document.querySelectorAll('a[href]').forEach(link => {
        let href = link.getAttribute('href');

        // Skip external links, anchors, mailto, and javascript
        if (!href ||
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('mailto:') ||
            href.startsWith('#') ||
            href.startsWith('javascript:')) {
          return;
        }

        // Remove existing lang parameter if present
        href = href.replace(/[?&]lang=[A-Z]{2}(&|$)/, (match, after) => {
          return after === '&' ? '&' : '';
        });

        // Clean up any trailing ? or &
        href = href.replace(/[?&]$/, '');

        // Add updated language parameter
        const separator = href.includes('?') ? '&' : '?';
        const newHref = href + separator + 'lang=' + currentLang;
        link.setAttribute('href', newHref);
      });
    }

    // Get current language
    getCurrentLanguage() {
      return this.currentLang;
    }

    // Translate a key programmatically
    t(key) {
      const trans = this.translations[this.currentLang] || this.translations['FR'] || {};
      return trans[key] || key;
    }
  }

  // Initialize when translations are loaded
  window.BibleI18n = {
    init: function() {
      if (!window.i18nInstance) {
        window.i18nInstance = new I18n();
        // Expose getTranslation function globally
        window.getTranslation = function(key) {
          return window.i18nInstance ? window.i18nInstance.t(key) : key;
        };
      }
      return window.i18nInstance;
    },
    getInstance: function() {
      return window.i18nInstance;
    }
  };

  // Auto-initialize if translations are already loaded
  if (window.translations) {
    window.BibleI18n.init();
  }

})(window);
