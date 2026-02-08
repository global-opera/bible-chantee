// BIBLE CHANTÉE - MOTEUR RECHERCHE SÉMANTIQUE V2
// Remplace: js/semantic-engine.js
// Dépend de: js/semantic-dictionary.js (chargé avant dans HTML)
// UTF-8 sans BOM

(function() {
  'use strict';

  function normalize(str) {
    if (!str) return '';
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '').trim();
  }

  function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    var m = [];
    for (var i = 0; i <= b.length; i++) m[i] = [i];
    for (var j = 0; j <= a.length; j++) m[0][j] = j;
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        m[i][j] = b[i-1] === a[j-1]
          ? m[i-1][j-1]
          : Math.min(m[i-1][j-1]+1, m[i][j-1]+1, m[i-1][j]+1);
      }
    }
    return m[b.length][a.length];
  }

  function fuzzyMatch(search, keyword) {
    var s = normalize(search), k = normalize(keyword);
    if (!s || !k) return {match:false, score:0};
    if (s === k) return {match:true, score:1.0};
    if (k.startsWith(s) && s.length >= 3) return {match:true, score:0.9};
    if (s.startsWith(k) && k.length >= 3) return {match:true, score:0.85};
    if (k.indexOf(s) !== -1 && s.length >= 4) return {match:true, score:0.8};
    if (s.length >= 4 && k.length >= 4) {
      var maxDist = s.length <= 5 ? 1 : 2;
      var d = levenshtein(s, k);
      if (d <= maxDist) return {match:true, score:0.7 - d*0.1};
    }
    return {match:false, score:0};
  }

  function detectLang() {
    if (window.currentLanguage) return window.currentLanguage.toUpperCase().substring(0,2);
    var s = localStorage.getItem('selectedLanguage');
    return s ? s.toUpperCase().substring(0,2) : 'FR';
  }

  // Recherche principale
  function semanticSearch(query, lang) {
    if (!query || query.trim().length < 2) return [];
    lang = lang || detectLang();
    var dictLang = {'FR':'FR','EN':'EN','PT':'PT','ES':'ES','DE':'DE','IT':'IT'}[lang] || 'FR';
    var words = query.trim().toLowerCase().split(/\s+/);
    var results = {};
    var dict = window.SEMANTIC_DICTIONARY;
    if (!dict) { console.error('[Semantic] Dictionnaire non charge'); return []; }

    // 1) Recherche dans le dictionnaire thematique
    for (var fam in dict) {
      if (!dict.hasOwnProperty(fam)) continue;
      var family = dict[fam];
      if (!family.keywords || !family.keywords[dictLang]) continue;
      var kws = family.keywords[dictLang];
      var chaps = family.chapters;

      for (var wi = 0; wi < words.length; wi++) {
        var w = words[wi];
        if (w.length < 2) continue;
        var best = {match:false, score:0, word:''};
        for (var ki = 0; ki < kws.length; ki++) {
          var r = fuzzyMatch(w, kws[ki]);
          if (r.match && r.score > best.score) {
            best = {match:true, score:r.score, word:kws[ki]};
          }
        }
        if (best.match) {
          for (var ci = 0; ci < chaps.length; ci++) {
            var ch = chaps[ci];
            if (!results[ch]) results[ch] = {score:0, families:[], matchedWords:[]};
            results[ch].score = Math.max(results[ch].score, best.score);
            if (results[ch].families.indexOf(fam) === -1) results[ch].families.push(fam);
            if (results[ch].matchedWords.indexOf(best.word) === -1) results[ch].matchedWords.push(best.word);
          }
        }
      }
    }

    // 2) Recherche dans les titres (si titres disponibles)
    var titresData = null;
    try {
      if (window['titres_' + lang.toLowerCase()]) titresData = window['titres_' + lang.toLowerCase()];
      else if (window.titresData) titresData = window.titresData;
    } catch(e) {}

    if (titresData) {
      var normQuery = normalize(query);
      for (var chapKey in titresData) {
        if (!titresData.hasOwnProperty(chapKey)) continue;
        var titre = titresData[chapKey];
        if (typeof titre !== 'string') continue;
        var normTitre = normalize(titre);
        if (normTitre.indexOf(normQuery) !== -1) {
          if (!results[chapKey]) results[chapKey] = {score:0, families:[], matchedWords:[]};
          results[chapKey].score = Math.max(results[chapKey].score, 0.95);
          if (results[chapKey].families.indexOf('titre') === -1) results[chapKey].families.push('titre');
          if (results[chapKey].matchedWords.indexOf(titre) === -1) results[chapKey].matchedWords.push(titre);
        }
      }
    }

    // 3) Convertir en tableau trie par score
    var arr = [];
    for (var key in results) {
      if (!results.hasOwnProperty(key)) continue;
      arr.push({
        chapter: key,
        score: results[key].score,
        families: results[key].families,
        matchedWords: results[key].matchedWords
      });
    }
    arr.sort(function(a, b) { return b.score - a.score; });

    // Limiter a 50 resultats max
    return arr.slice(0, 50);
  }

  // Fonction utilitaire: decoder un code chapitre
  // "19_PSA_023" → { book: "19_PSA", bookCode: "PSA", chapterNum: 23 }
  function parseChapter(code) {
    var parts = code.split('_');
    if (parts.length < 3) return null;
    return {
      book: parts[0] + '_' + parts[1],
      bookCode: parts[1],
      chapterNum: parseInt(parts[2], 10)
    };
  }

  // API publique
  window.SemanticEngine = {
    search: semanticSearch,
    parseChapter: parseChapter,
    normalize: normalize,
    version: '2.0.0'
  };

  console.log('[SemanticEngine V2] Charge - ' +
    (window.SEMANTIC_DICTIONARY ? Object.keys(window.SEMANTIC_DICTIONARY).length + ' familles' : 'DICTIONNAIRE MANQUANT'));

})();
