// Bible Chantee - Internationalization System
// Reusable multi-language system for all pages

(function(window) {
  'use strict';

  // REMOVED: Old dropdown language selector (replaced by horizontal language bar in each page)

  // I18n class
  class I18n {
    constructor() {
      console.log('[i18n DEBUG] Constructor called');
      this.currentLang = this.getInitialLanguage();
      console.log('[i18n DEBUG] Initial language set to:', this.currentLang);
      this.translations = window.translations || {};
      console.log('[i18n DEBUG] Translations loaded:', !!window.translations, 'Languages:', Object.keys(this.translations));
      this.init();
    }

    // Get initial language from URL, localStorage, or browser
    getInitialLanguage() {
      console.log('[i18n DEBUG] getInitialLanguage() called');
      console.log('[i18n DEBUG] Current URL:', window.location.href);

      // Valid language codes
      const validLangs = ['FR', 'EN', 'ES', 'PT', 'DE', 'IT', 'RU', 'AR', 'ZH', 'HI', 'TL', 'KO'];

      // Priority 1: URL parameter ?lang=XX (highest priority for navigation)
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      console.log('[i18n DEBUG] URL lang parameter:', urlLang);
      if (urlLang) {
        const langCode = urlLang.toUpperCase();
        console.log('[i18n DEBUG] URL lang validated:', langCode, 'Valid:', validLangs.includes(langCode));
        if (validLangs.includes(langCode)) {
          // Save to localStorage for future visits (unified on bc_lang)
          localStorage.setItem('bc_lang', langCode);
          // Sync with selectedLanguage for backward compatibility
          localStorage.setItem('selectedLanguage', langCode);
          console.log('[i18n DEBUG] Language from URL saved to localStorage:', langCode);
          return langCode;
        }
      }

      // Priority 2: localStorage (user's previous choice)
      // Read from bc_lang (primary) or selectedLanguage (fallback for compatibility)
      const saved = localStorage.getItem('bc_lang') || localStorage.getItem('selectedLanguage');
      console.log('[i18n DEBUG] localStorage bc_lang:', localStorage.getItem('bc_lang'));
      console.log('[i18n DEBUG] localStorage selectedLanguage:', localStorage.getItem('selectedLanguage'));
      console.log('[i18n DEBUG] Saved language:', saved);
      if (saved && validLangs.includes(saved)) {
        // Ensure both keys are synced
        if (!localStorage.getItem('bc_lang')) {
          localStorage.setItem('bc_lang', saved);
        }
        if (!localStorage.getItem('selectedLanguage')) {
          localStorage.setItem('selectedLanguage', saved);
        }
        console.log('[i18n DEBUG] Language from localStorage:', saved);
        return saved;
      }

      // Priority 3: Detect browser language
      const browserLang = navigator.language || navigator.userLanguage;
      const langCode = browserLang.split('-')[0].toUpperCase();
      console.log('[i18n DEBUG] Browser language:', browserLang, '-> Extracted:', langCode);

      // Map common browser language codes
      const langMap = {
        'FR': 'FR', 'EN': 'EN', 'ES': 'ES', 'PT': 'PT',
        'DE': 'DE', 'IT': 'IT', 'RU': 'RU', 'AR': 'AR',
        'ZH': 'ZH', 'HI': 'HI', 'TL': 'TL', 'KO': 'KO'
      };

      const finalLang = langMap[langCode] || 'FR';
      console.log('[i18n DEBUG] Final language (from browser/default):', finalLang);
      return finalLang;
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
      console.log('[i18n DEBUG] applyTranslations() called with lang:', lang);
      const trans = this.translations[lang] || this.translations['FR'] || {};
      console.log('[i18n DEBUG] Translation object exists for', lang, ':', !!this.translations[lang]);
      console.log('[i18n DEBUG] Translation keys count:', Object.keys(trans).length);

      // Update all elements with data-i18n attribute
      const elements = document.querySelectorAll('[data-i18n]');
      console.log('[i18n DEBUG] Found', elements.length, 'elements with data-i18n attribute');
      elements.forEach(element => {
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
      console.log('[i18n DEBUG] BibleI18n.init() called');
      console.log('[i18n DEBUG] window.translations exists:', !!window.translations);
      console.log('[i18n DEBUG] window.i18nInstance exists:', !!window.i18nInstance);
      if (!window.i18nInstance) {
        console.log('[i18n DEBUG] Creating new I18n instance');
        window.i18nInstance = new I18n();
        // Expose getTranslation function globally
        window.getTranslation = function(key) {
          return window.i18nInstance ? window.i18nInstance.t(key) : key;
        };
        console.log('[i18n DEBUG] I18n instance created successfully');
      }
      return window.i18nInstance;
    },
    getInstance: function() {
      return window.i18nInstance;
    }
  };

  // Auto-initialize if translations are already loaded
  console.log('[i18n DEBUG] Script loaded, checking for auto-init');
  console.log('[i18n DEBUG] window.translations at load time:', !!window.translations);
  if (window.translations) {
    console.log('[i18n DEBUG] Auto-initializing BibleI18n');
    window.BibleI18n.init();
  } else {
    console.log('[i18n DEBUG] Waiting for translations to load before initializing');
  }

})(window);
