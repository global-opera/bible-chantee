// ============================================
// BIBLE CHANTÉE V3 - SYSTÈME LANGUE GLOBALE
// ============================================

const BC_LANG = {
    default: 'FR',
    available: ['FR', 'EN', 'PT', 'ES', 'DE', 'IT'],
    upcoming: ['AR', 'RU', 'ZH', 'HI', 'TL', 'SW'],

    get: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.isValid(urlLang)) {
            this.set(urlLang);
            return urlLang.toUpperCase();
        }
        const stored = localStorage.getItem('bc_lang');
        if (stored && this.isValid(stored)) {
            return stored.toUpperCase();
        }
        return this.default;
    },

    set: function(lang) {
        if (this.isValid(lang)) {
            localStorage.setItem('bc_lang', lang.toUpperCase());
            return true;
        }
        return false;
    },

    isValid: function(lang) {
        const all = [...this.available, ...this.upcoming];
        return all.includes(lang.toUpperCase());
    },

    hasAudio: function(lang) {
        return this.available.includes(lang.toUpperCase());
    },

    apply: function() {
        const lang = this.get();
        if (typeof translations !== 'undefined' && translations[lang]) {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang][key]) {
                    el.textContent = translations[lang][key];
                }
            });
        }
        document.querySelectorAll('.flag-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
        return lang;
    },

    goTo: function(page) {
        window.location.href = page + '?lang=' + this.get();
    }
};

document.addEventListener('DOMContentLoaded', () => BC_LANG.apply());
