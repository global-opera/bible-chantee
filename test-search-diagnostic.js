/**
 * TEST DIAGNOSTIC - Fonction recherche Bible Chantée
 * Copier/coller dans Console DevTools (F12) sur la page où la recherche ne marche pas
 */

console.log('🔍 === DIAGNOSTIC RECHERCHE ===\n');

const diag = [
  '📍 URL actuelle',
  location.href,
  '',
  '📦 Scripts bible-data chargés',
  'window.bibleData (FR): ' + typeof window.bibleData,
  'window.bibleDataEN: ' + typeof window.bibleDataEN,
  'window.bibleDataPT: ' + typeof window.bibleDataPT,
  'window.bibleDataES: ' + typeof window.bibleDataES,
  '',
  '🌐 Variables de langue détectées',
  'window.currentLanguage: ' + (window.currentLanguage || '(undefined)'),
  'localStorage bc_lang: ' + (localStorage.getItem('bc_lang') || '(null)'),
  'localStorage BC_LANG: ' + (localStorage.getItem('BC_LANG') || '(null)'),
  'URL param lang: ' + (new URLSearchParams(location.search).get('lang') || '(null)'),
  '',
  '🔬 Test getBibleDatasetForLang()',
  'getBibleDatasetForLang("FR"): ' + (typeof getBibleDatasetForLang === 'function' ? (getBibleDatasetForLang('FR') ? 'OK ✅' : 'NULL ❌') : 'fonction non trouvée ❌'),
  'getBibleDatasetForLang("EN"): ' + (typeof getBibleDatasetForLang === 'function' ? (getBibleDatasetForLang('EN') ? 'OK ✅' : 'NULL ❌') : 'fonction non trouvée ❌'),
  'getBibleDatasetForLang("PT"): ' + (typeof getBibleDatasetForLang === 'function' ? (getBibleDatasetForLang('PT') ? 'OK ✅' : 'NULL ❌') : 'fonction non trouvée ❌'),
  'getBibleDatasetForLang("ES"): ' + (typeof getBibleDatasetForLang === 'function' ? (getBibleDatasetForLang('ES') ? 'OK ✅' : 'NULL ❌') : 'fonction non trouvée ❌'),
  '',
  '🎯 Test recherche manuelle',
  'Essayez: searchBible() après avoir tapé un mot dans le champ',
  'Ou copiez ce test rapide:',
  '',
  'const testSearch = (lang, word) => {',
  '  const dataset = getBibleDatasetForLang(lang);',
  '  if (!dataset) return `❌ Dataset ${lang} NULL`;',
  '  let count = 0;',
  '  for (let book in dataset) {',
  '    for (let chapter in dataset[book]) {',
  '      dataset[book][chapter].forEach(v => {',
  '        if (String(v.text || "").toLowerCase().includes(word.toLowerCase())) count++;',
  '      });',
  '    }',
  '  }',
  '  return `✅ ${count} versets trouvés avec "${word}" en ${lang}`;',
  '};',
  '',
  'testSearch("FR", "Dieu")',
  'testSearch("EN", "God")',
  'testSearch("PT", "Deus")',
  'testSearch("ES", "Dios")',
];

console.log(diag.join('\n'));

console.log('\n\n✅ Pour tester rapidement, copiez/collez:');
console.log('testSearch("FR", "Dieu")');
console.log('testSearch("EN", "God")');
console.log('testSearch("PT", "Deus")');
console.log('testSearch("ES", "Dios")');

// Définir la fonction test globalement
window.testSearch = function(lang, word) {
  const dataset = getBibleDatasetForLang(lang);
  if (!dataset) return `❌ Dataset ${lang} NULL - Les scripts bible-data-*.js ne sont pas chargés`;
  let count = 0;
  for (let book in dataset) {
    for (let chapter in dataset[book]) {
      dataset[book][chapter].forEach(v => {
        if (String(v.text || "").toLowerCase().includes(word.toLowerCase())) count++;
      });
    }
  }
  return `✅ ${count} versets trouvés avec "${word}" en ${lang}`;
};

console.log('\n📋 Fonction testSearch() maintenant disponible globalement');
