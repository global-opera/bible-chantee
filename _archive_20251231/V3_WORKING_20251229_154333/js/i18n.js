(function() {
  const LANGS = (window.BC3 && BC3.LANGUAGES) ? BC3.LANGUAGES : ['FR','EN','PT','ES','DE','IT','AR','RU','ZH','HI','TL','SW'];

  function getLang() {
    const urlLang = new URLSearchParams(location.search).get('lang');
    if (urlLang && LANGS.includes(urlLang.toUpperCase())) {
      const lang = urlLang.toUpperCase();
      localStorage.setItem((window.BC3 && BC3.LS_KEY_LANG) ? BC3.LS_KEY_LANG : 'bc3_lang', lang);
      return lang;
    }
    const stored = localStorage.getItem((window.BC3 && BC3.LS_KEY_LANG) ? BC3.LS_KEY_LANG : 'bc3_lang');
    if (stored && LANGS.includes(stored)) return stored;
    return (window.BC3 && BC3.DEFAULT_LANG) ? BC3.DEFAULT_LANG : 'FR';
  }

  function setLang(lang) {
    const L = (lang || '').toUpperCase();
    if (!LANGS.includes(L)) return;
    localStorage.setItem((window.BC3 && BC3.LS_KEY_LANG) ? BC3.LS_KEY_LANG : 'bc3_lang', L);
    const url = new URL(location.href);
    url.searchParams.set('lang', L);
    location.href = url.toString();
  }

  function getTranslationsRoot() {
    return window.TRANSLATIONS || window.translations || {};
  }

  function t(key) {
    const lang = getLang();
    const root = getTranslationsRoot();
    const pack = root[lang] || root.FR || {};
    return pack[key] || (root.FR ? (root.FR[key] || key) : key);
  }

  function applyTranslations() {
    const lang = getLang();
    const root = getTranslationsRoot();
    const pack = root[lang] || root.FR || {};

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (pack[key]) el.textContent = pack[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (pack[key]) el.placeholder = pack[key];
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', (btn.dataset.lang || '').toUpperCase() === lang);
    });
  }

  window.I18N = { getLang, setLang, t, applyTranslations, LANGS };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyTranslations);
  else applyTranslations();
})();