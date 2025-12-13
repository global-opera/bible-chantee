// Bible Chantee - Internationalization System
// Reusable multi-language system for all pages

(function(window) {
  'use strict';

  // Language selector HTML template
  const languageSelectorHTML = `
    <div class="language-selector-container">
      <div class="language-selector">
        <label>🌐</label>
        <select id="globalLanguageSelector">
          <option value="FR">🇫🇷 Français</option>
          <option value="EN">🇬🇧 English</option>
          <option value="ES">🇪🇸 Español</option>
          <option value="PT">🇵🇹 Português</option>
          <option value="DE">🇩🇪 Deutsch</option>
          <option value="IT">🇮🇹 Italiano</option>
          <option value="RU">🇷🇺 Русский</option>
          <option value="AR">🇸🇦 العربية</option>
          <option value="ZH">🇨🇳 中文</option>
          <option value="HI">🇮🇳 हिन्दी</option>
          <option value="TL">🇵🇭 Tagalog</option>
          <option value="KO">🇰🇷 한국어</option>
        </select>
      </div>
    </div>
  `;

  // CSS for language selector
  const languageSelectorCSS = `
    .language-selector-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      background: rgba(30, 41, 59, 0.95);
      padding: 10px 15px;
      border-radius: 25px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      border: 2px solid rgba(147, 197, 253, 0.3);
    }
    .language-selector {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .language-selector label {
      color: #93c5fd;
      font-size: 0.9em;
      font-weight: 600;
    }
    .language-selector select {
      padding: 8px 12px;
      font-size: 0.95em;
      border-radius: 8px;
      border: 2px solid rgba(147, 197, 253, 0.3);
      background: rgba(15, 23, 42, 0.9);
      color: #e5e7eb;
      cursor: pointer;
      font-weight: 600;
      outline: none;
      transition: all 0.3s;
    }
    .language-selector select:hover {
      border-color: #60a5fa;
      background: rgba(15, 23, 42, 1);
    }
    .language-selector select:focus {
      border-color: #3b82f6;
    }
    @media (max-width: 600px) {
      .language-selector-container {
        top: 10px;
        right: 10px;
        padding: 8px 12px;
      }
      .language-selector {
        flex-direction: column;
        gap: 5px;
      }
    }
  `;

  // I18n class
  class I18n {
    constructor() {
      this.currentLang = this.getInitialLanguage();
      this.translations = window.translations || {};
      this.init();
    }

    // Get initial language from localStorage or browser
    getInitialLanguage() {
      // Priority 1: localStorage (user choice)
      const saved = localStorage.getItem('selectedLanguage');
      if (saved) {
        // Valid language codes
        const validLangs = ['FR', 'EN', 'ES', 'PT', 'DE', 'IT', 'RU', 'AR', 'ZH', 'HI', 'TL', 'KO'];
        if (validLangs.includes(saved)) {
          return saved;
        }
      }

      // Priority 2: Detect browser language
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
      // Inject CSS
      this.injectCSS();

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    // Inject CSS into page
    injectCSS() {
      const style = document.createElement('style');
      style.textContent = languageSelectorCSS;
      document.head.appendChild(style);
    }

    // Setup language selector and apply translations
    setup() {
      // Inject language selector into body
      const selectorDiv = document.createElement('div');
      selectorDiv.innerHTML = languageSelectorHTML;
      document.body.insertBefore(selectorDiv.firstElementChild, document.body.firstChild);

      // Get selector element
      const languageSelector = document.getElementById('globalLanguageSelector');
      if (!languageSelector) return;

      // Set initial language
      languageSelector.value = this.currentLang;

      // Apply initial translations
      this.applyTranslations(this.currentLang);

      // Listen for language changes
      languageSelector.addEventListener('change', (e) => {
        const newLang = e.target.value;
        this.currentLang = newLang;
        localStorage.setItem('selectedLanguage', newLang);
        this.applyTranslations(newLang);
      });
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
