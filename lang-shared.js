/* lang-shared.js — BibleChantée
   Priority: URL ?lang=XX → localStorage → browser → FR
*/

(function () {
  const STORAGE_KEY = "BC_LANG";
  const VALID_LANGUAGES = ['FR', 'EN', 'ES', 'PT', 'DE', 'IT', 'RU', 'AR', 'ZH', 'HI', 'TL', 'KO'];
  const DEFAULT_LANG = "FR";

  function normalizeLang(v) {
    if (!v) return null;
    const x = String(v).trim().toUpperCase();
    return VALID_LANGUAGES.includes(x) ? x : null;
  }

  function getLangFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return normalizeLang(params.get("lang"));
  }

  function getLangFromStorage() {
    try {
      return normalizeLang(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  function getLangFromBrowser() {
    const nav = (navigator.language || navigator.userLanguage || "").toLowerCase();
    if (!nav) return null;
    if (nav.startsWith("fr")) return "FR";
    if (nav.startsWith("pt")) return "PT";
    if (nav.startsWith("en")) return "EN";
    if (nav.startsWith("es")) return "ES";
    if (nav.startsWith("de")) return "DE";
    if (nav.startsWith("it")) return "IT";
    if (nav.startsWith("ru")) return "RU";
    if (nav.startsWith("ar")) return "AR";
    if (nav.startsWith("zh")) return "ZH";
    if (nav.startsWith("hi")) return "HI";
    if (nav.startsWith("tl")) return "TL";
    if (nav.startsWith("ko")) return "KO";
    return null;
  }

  function getCurrentLanguage() {
    return (
      getLangFromUrl() ||
      getLangFromStorage() ||
      getLangFromBrowser() ||
      DEFAULT_LANG
    );
  }

  function setCurrentLanguage(lang) {
    const v = normalizeLang(lang) || DEFAULT_LANG;
    try { localStorage.setItem(STORAGE_KEY, v); } catch {}
    return v;
  }

  window.BC_LANG = {
    VALID_LANGUAGES,
    DEFAULT_LANG,
    normalizeLang,
    getCurrentLanguage,
    setCurrentLanguage,
    getLangFromUrl,
    getLangFromStorage
  };
})();
