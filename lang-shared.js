const params = new URLSearchParams(window.location.search);
let currentLanguage =
  params.get("lang") ||
  localStorage.getItem("lang") ||
  "PT";

localStorage.setItem("lang", currentLanguage);

// Helpers pour gestion globale de la langue
function getLang() {
  return (localStorage.getItem("lang") || "FR").toUpperCase();
}

function setLang(lang) {
  localStorage.setItem("lang", String(lang || "FR").toUpperCase());
}

function applyLangToLinks() {
  const lang = getLang();
  document.querySelectorAll("a[data-lang-link]").forEach(a => {
    const base = a.getAttribute("href");
    if (!base) return;
    const u = new URL(base, window.location.origin);
    u.searchParams.set("lang", lang);
    a.setAttribute("href", u.pathname + u.search);
  });
}

// Auto-apply on page load
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", applyLangToLinks);
} else {
  applyLangToLinks();
}