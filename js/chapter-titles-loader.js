// Titres des chapitres - Bible Chantee
// Charge les fichiers titles/*.json
window.CHAPTER_TITLES = {
  "FR": null,
  "EN": null,
  "PT": null,
  "ES": null,
  "DE": null,
  "IT": null,
  "TL": null
};

// Fonction pour charger les titres d'une langue
async function loadTitles(lang) {
  if (window.CHAPTER_TITLES[lang] !== null) return;
  try {
    const response = await fetch(`titles/${lang}.json`);
    window.CHAPTER_TITLES[lang] = await response.json();
  } catch (e) {
    console.error(`Erreur chargement titres ${lang}:`, e);
    window.CHAPTER_TITLES[lang] = {};
  }
}

// Charger toutes les langues au démarrage
['FR', 'EN', 'PT', 'ES', 'DE', 'IT', 'TL'].forEach(loadTitles);
