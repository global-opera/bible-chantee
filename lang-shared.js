const params = new URLSearchParams(window.location.search);
let currentLanguage =
  params.get("lang") ||
  localStorage.getItem("lang") ||
  "PT";

localStorage.setItem("lang", currentLanguage);