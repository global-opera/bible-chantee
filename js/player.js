/* Bible ChantÃ©e V3 â player.js (standalone, tolerant)
   - Noms livres: BOOK_NAMES + aliases BOOK_CODE_ALIASES
   - Audio: supporte AUDIO_URLS, AUDIO_URLS_FR, AUDIO_URLS_fr, AUDIO_URLS_PT, etc.
   - Bible: supporte BC_BIBLE, BIBLE, BIBLE_TEXTS, BIBLE_FR, BIBLE_fr, BC_BIBLE_FR, etc.
   - Toggle simple Paroles/Bible dans le mÃªme panneau
*/
(function () {
  'use strict';

  var LANGS = ['FR','EN','PT','ES','DE','IT','AR','RU','ZH','HI','TL','SW','KO'];

  var BIBLE_FILES = {
    FR: 'V3/bible/fr_bible_segond1910.json',
    EN: 'V3/bible/en_bible_kjv_1611.json',
    PT: 'V3/bible/pt_bible_almeida_acf.json',
    ES: 'V3/bible/es_bible_reina_valera_1909.json',
    DE: 'V3/bible/de_bible_luther_1912.json',
    IT: 'V3/bible/it_bible_diodati_1649.json',
    AR: 'V3/bible/ar_bible_van_dyck_1865.json',
    RU: 'V3/bible/ru_bible_synodal.json',
    ZH: 'V3/bible/zh_bible_cuv_1919.json',
    HI: 'V3/bible/hi_bible_bfbs_1914_publicdomain.json',
    TL: 'V3/bible/tl_bible_old_tagalog.json',
    SW: 'V3/bible/sw_bible_swahili_publicdomain.json'
  };

  var bibleCache = {};

  // Book code to book number mapping
  var BOOK_CODE_TO_NUM = {
    '01_GEN': 1, '02_EXO': 2, '03_LEV': 3, '04_NUM': 4, '05_DEU': 5,
    '06_JOS': 6, '07_JDG': 7, '08_RUT': 8, '09_1SA': 9, '10_2SA': 10,
    '11_1KI': 11, '12_2KI': 12, '13_1CH': 13, '14_2CH': 14, '15_EZR': 15,
    '16_NEH': 16, '17_EST': 17, '18_JOB': 18, '19_PSA': 19, '20_PRO': 20,
    '21_ECC': 21, '22_SNG': 22, '23_ISA': 23, '24_JER': 24, '25_LAM': 25,
    '26_EZK': 26, '27_DAN': 27, '28_HOS': 28, '29_JOL': 29, '30_AMO': 30,
    '31_OBA': 31, '32_JON': 32, '33_MIC': 33, '34_NAM': 34, '35_HAB': 35,
    '36_ZEP': 36, '37_HAG': 37, '38_ZEC': 38, '39_MAL': 39, '40_MAT': 40,
    '41_MRK': 41, '42_LUK': 42, '43_JHN': 43, '44_ACT': 44, '45_ROM': 45,
    '46_1CO': 46, '47_2CO': 47, '48_GAL': 48, '49_EPH': 49, '50_PHP': 50,
    '51_COL': 51, '52_1TH': 52, '53_2TH': 53, '54_1TI': 54, '55_2TI': 55,
    '56_TIT': 56, '57_PHM': 57, '58_HEB': 58, '59_JAS': 59, '60_1PE': 60,
    '61_2PE': 61, '62_1JN': 62, '63_2JN': 63, '64_3JN': 64, '65_JUD': 65,
    '66_REV': 66
  };

  // Inverse mapping: book number to book code
  var NUM_TO_BOOK_CODE = {};
  for (var code in BOOK_CODE_TO_NUM) {
    NUM_TO_BOOK_CODE[BOOK_CODE_TO_NUM[code]] = code;
  }

  // Alias locaux pour codes anciens/variants (normalisÃ©s vers le code canonique)
  var LOCAL_BOOK_CODE_ALIASES = {
    '22_SON': '22_SNG',  // Song of Solomon variant
    '25_EZK': '26_EZK',  // Ezekiel ancien numÃ©rotage
    '26_EZE': '26_EZK'   // Ezekiel suffixe alternatif
  };

  function normLang(x){ return String(x || 'FR').toUpperCase(); }

  function getLang(){
    try{
      var qp = new URLSearchParams(location.search).get('lang');
      if(qp && LANGS.indexOf(qp.toUpperCase()) >= 0){
        var Lq = qp.toUpperCase();
        try{ localStorage.setItem('bc_lang', Lq); }catch(e){}
        return Lq;
      }
    }catch(e){}
    try{
      var st = String(localStorage.getItem('bc_lang') || '').toUpperCase();
      if(st && LANGS.indexOf(st) >= 0) return st;
    }catch(e){}
    return 'FR';
  }

  function setLang(L){
    var lang = normLang(L);
    if(LANGS.indexOf(lang) < 0) return;
    try{ localStorage.setItem('bc_lang', lang); }catch(e){}

    // Sauvegarder livre et chapitre actuels AVANT de recharger
    var currentBook = getSelectedBookCode();
    var currentChap = getSelectedChapter();
    if(currentBook){
      try{ localStorage.setItem('bc_pending_book', currentBook); }catch(e){}
      try{ localStorage.setItem('bc_pending_chapter', String(currentChap || 1)); }catch(e){}
    }

    try{
      var url = new URL(location.href);
      url.searchParams.set('lang', lang);
      location.href = url.toString();
    }catch(e){
      location.search = '?lang=' + encodeURIComponent(lang);
    }
  }

  function $(id){ return document.getElementById(id); }

  function codeAlias(code){
    var c = String(code || '').toUpperCase();
    try{
      if(window.BOOK_CODE_ALIASES && window.BOOK_CODE_ALIASES[c]) c = window.BOOK_CODE_ALIASES[c];
    }catch(e){}
    if(LOCAL_BOOK_CODE_ALIASES[c]) c = LOCAL_BOOK_CODE_ALIASES[c];
    return c;
  }

  function getBookName(lang, code){
    var L = normLang(lang);
    var c = codeAlias(code);
    try{
      if(window.BOOK_NAMES && window.BOOK_NAMES[L] && window.BOOK_NAMES[L][c]) return window.BOOK_NAMES[L][c];
      if(window.BOOK_NAMES && window.BOOK_NAMES.FR && window.BOOK_NAMES.FR[c]) return window.BOOK_NAMES.FR[c];
    }catch(e){}
    return String(code || '');
  }

  function getChapterWord(lang){
    var L = normLang(lang);
    var map = {
      FR:'Chapitre', EN:'Chapter', PT:'CapÃ­tulo', ES:'CapÃ­tulo', DE:'Kapitel', IT:'Capitolo',
      AR:'Ø§ÙÙØµÙ', RU:'ÐÐ»Ð°Ð²Ð°', ZH:'ç« ', HI:'à¤à¤§à¥à¤¯à¤¾à¤¯', TL:'Kabanata', SW:'Sura', KO:'ì¥'
    };
    return map[L] || map.FR;
  }

  function buildBookIndex(){
    if(window.BOOKS && !window.BOOKS_BY_CODE){
      var idx2 = {};
      for(var j=0;j<window.BOOKS.length;j++){
        var bb = window.BOOKS[j];
        if(bb && bb.code) idx2[String(bb.code).toUpperCase()] = bb;
      }
      window.BOOKS_BY_CODE = idx2;
    }
  }

  function findBookSelect(){
    return document.querySelector('#bookSelect, #book, #bookSelector, select[name="book"], select[id*="book"]');
  }

  function findChapterWrap(){
    return document.querySelector('#chapterButtons, #chapters, #chapterGrid, .chapter-buttons, .chapters, .chapter-grid');
  }

  function findAudioEl(){
    return document.querySelector('#audioPlayer, audio#audio, audio');
  }

  function findLyricsBox(){
    return document.querySelector('#lyricsBox, #lyricsText, #lyrics, pre#lyrics');
  }

  function findBibleBox(){
    return document.querySelector('#bibleBox, #bibleText, #bible, pre#bible');
  }

  function findLyricsHeader(){
    return document.querySelector('[data-i18n="readerLyrics"], #readerLyrics, .readerLyrics');
  }

  function findBibleHeader(){
    return document.querySelector('[data-i18n="readerBible"], #readerBible, .readerBible');
  }

  function findHeaderTitle(){
    return document.querySelector('#currentRef, #headerTitle, #bcHeaderTitle, .bc-header-title, .header-title, [data-role="header-title"]');
  }

  function pad2(n){
    var s = String(n);
    return (s.length === 1) ? ('0'+s) : s;
  }

  function padChapterForFilename(ch) {
    var n = Number(ch);
    if (!Number.isFinite(n)) return String(ch);
    if (n < 100) return String(n).padStart(2, "0");
    return String(n).padStart(3, "0");
  }

  function resolveBookKey(bookCode) {
    var bc = String(bookCode || "").trim().toUpperCase();

    // DÃ©jÃ  au bon format: "01_GEN"
    if (/^\d{2}_[A-Z0-9]+$/.test(bc)) return bc;

    // Essaie de retrouver via une liste de livres dÃ©jÃ  prÃ©sente dans player.js
    // Cherche un tableau global du type BOOKS / BOOK_LIST / books
    var lists = [
      window.BOOKS,
      window.BOOK_LIST,
      window.books,
      (typeof BOOKS !== "undefined" ? BOOKS : null),
      (typeof BOOK_LIST !== "undefined" ? BOOK_LIST : null),
      (typeof books !== "undefined" ? books : null),
    ].filter(Boolean);

    // Normalise en une liste de codes "01_GEN"
    var all = [];
    for (var i = 0; i < lists.length; i++) {
      var arr = lists[i];
      if (!Array.isArray(arr)) continue;
      for (var j = 0; j < arr.length; j++) {
        var it = arr[j];
        if (!it) continue;

        // cas: string "01_GEN"
        if (typeof it === "string" && /^\d{2}_[A-Z0-9]+$/.test(it.toUpperCase())) {
          all.push(it.toUpperCase());
          continue;
        }

        // cas: object { code:"01_GEN" } / { key:"01_GEN" } / { id:"01_GEN" } / { value:"01_GEN" }
        var cand =
          (it.code || it.key || it.id || it.value || it.book || it.bookKey || "");
        cand = String(cand).toUpperCase();
        if (/^\d{2}_[A-Z0-9]+$/.test(cand)) all.push(cand);
      }
    }

    // Si bookCode = "01" â match sur prÃ©fixe
    if (/^\d{2}$/.test(bc)) {
      for (var k = 0; k < all.length; k++) {
        if (all[k].slice(0, 2) === bc) return all[k];
      }
    }

    // Si bookCode = "GEN" â match sur suffixe
    if (/^[A-Z0-9]{3,}$/.test(bc)) {
      for (var k2 = 0; k2 < all.length; k2++) {
        var parts = all[k2].split("_");
        if (parts[1] === bc) return all[k2];
      }
    }

    // Fallback: on retourne ce qu'on a (Ã§a fera un log clair)
    return bc;
  }

  function safeText(s){
    return (s == null) ? '' : String(s);
  }

  function setBoxText(el, text){
    if(!el) return;
    el.textContent = safeText(text);
  }

  function getSelectedBookCode(){
    var sel = findBookSelect();
    if(!sel) return '';
    return String(sel.value || '').toUpperCase();
  }

  function setSelectedBookCode(code){
    var sel = findBookSelect();
    if(!sel) return;
    sel.value = code;
  }

  function getSelectedChapter(){
    var active = document.querySelector('.chapter-btn.active, .chapterButton.active, .chap-btn.active, button[aria-current="true"][data-chapter]');
    if(active){
      var t = (active.getAttribute('data-chapter') || active.textContent || '').trim();
      if(/^\d+$/.test(t)) return parseInt(t,10);
    }
// Fallback: check <select> element (lecteur.html uses select, not buttons)
           var sel = document.getElementById('chapterSelect');
           if(sel && sel.value && /^\d+$/.test(sel.value)) return parseInt(sel.value, 10);
           return 1;
  }

  function setActiveChapter(n){
    var wrap = findChapterWrap();
    if(!wrap) return;
    var btns = wrap.querySelectorAll('button');
    for(var i=0;i<btns.length;i++){
      var b = btns[i];
      var t = (b.getAttribute('data-chapter') || b.textContent || '').trim();
      if(String(n) === t){
        b.classList.add('active');
        b.setAttribute('aria-current','true');
      }else{
        b.classList.remove('active');
        b.removeAttribute('aria-current');
      }
    }
  }

  function getLyricsUrl(lang, bookCode, chapter){
    var L = normLang(lang);
    var bk = resolveBookKey(bookCode);
    var ch = padChapterForFilename(chapter);
    var fileName = bk + "_" + ch + "_" + L + ".txt";
    var relPath = "data/lyrics/" + L + "/" + bk + "/" + fileName;
    return new URL(relPath, document.baseURI).toString();
  }

  // -------- AUDIO (tolÃ©rant) --------

  function getAudioMapsForLang(L){
    var out = [];

    function pushIf(obj){
      if(obj && typeof obj === 'object') out.push(obj);
    }

    try{ pushIf(window.AUDIO_URLS && window.AUDIO_URLS[L]); }catch(e){}
    try{ pushIf(window.AUDIO_URLS && window.AUDIO_URLS[L.toLowerCase && L.toLowerCase()]); }catch(e){}

    var keys = [
      'AUDIO_URLS_' + L,
      'AUDIO_URLS_' + L.toLowerCase(),
      'audio_urls_' + L,
      'audio_urls_' + L.toLowerCase(),
      'AUDIO_' + L,
      'AUDIO_' + L.toLowerCase()
    ];

    for(var i=0;i<keys.length;i++){
      try{ pushIf(window[keys[i]]); }catch(e){}
    }

    return out;
  }

  function resolveAudioUrl(L, bookCode, chapter){
    var bc = String(bookCode||'').toUpperCase();
    var key1 = bc + '_' + pad2(chapter) + '_' + L;         // ex 08_RUT_01_PT
    var key2 = bc + '_' + chapter + '_' + L;               // fallback
    var key3 = bc + '_' + pad2(chapter);                   // fallback sans langue
    var key4 = bc + '_' + chapter;

    var maps = getAudioMapsForLang(L);

    function tryMap(m){
      if(!m) return '';
      if(typeof m[key1] === 'string') return m[key1];
      if(typeof m[key2] === 'string') return m[key2];

      // parfois m[bookCode] = { "1": url, "01": url }
      if(m[bc] && typeof m[bc] === 'object'){
        var mm = m[bc];
        if(typeof mm[chapter] === 'string') return mm[chapter];
        if(typeof mm[String(chapter)] === 'string') return mm[String(chapter)];
        if(typeof mm[pad2(chapter)] === 'string') return mm[pad2(chapter)];
      }

      // parfois clÃ© sans langue
      if(typeof m[key3] === 'string') return m[key3];
      if(typeof m[key4] === 'string') return m[key4];

      return '';
    }

    for(var i=0;i<maps.length;i++){
      var u = tryMap(maps[i]);
      if(u) return u;
    }
    // Fallback: construct R2 CDN URL directly when no audio maps exist
    var chPad = pad2(chapter);
    return 'https://pub-2dc4dfed0c5e45338913878f35d4d56a.r2.dev/' + L + '/' + bc + '/' + bc + '_' + chPad + '_' + L + '.mp3';
  }

  function setAudioFor(lang, bookCode, chapter){
    var audio = findAudioEl();
    if(!audio) return;

    var L = normLang(lang);
    var url = resolveAudioUrl(L, bookCode, chapter);

    try{ audio.pause(); }catch(e){}

    if(url){
      try{
        audio.src = url;
        audio.currentTime = 0;
        audio.load();
      }catch(e){}
    }else{
      try{
        audio.removeAttribute('src');
        audio.load();
      }catch(e){}
    }
  }

  // -------- BIBLE (tolÃ©rant) --------

  function normalizeBibleValue(v){
    if(v == null) return '';
    if(typeof v === 'string') return v;
    if(Array.isArray(v)) return v.join('\n');
    if(typeof v === 'object'){
      // objet de versets {1:"...",2:"..."} -> concat
      try{
        var keys = Object.keys(v).sort(function(a,b){
          var na = parseInt(a,10), nb = parseInt(b,10);
          if(isNaN(na) || isNaN(nb)) return String(a).localeCompare(String(b));
          return na-nb;
        });
        var out = [];
        for(var i=0;i<keys.length;i++){
          out.push(v[keys[i]]);
        }
        return out.join('\n');
      }catch(e){}
    }
    return String(v);
  }

  function findBibleText(lang, bookCode, chapter){
    var L = normLang(lang);
    var c = codeAlias(bookCode);

    function grab(obj){
      if(!obj) return '';
      var byBook = obj[c] || obj[String(c)];
      if(!byBook) return '';
      var v = byBook[chapter] || byBook[String(chapter)] || byBook[pad2(chapter)];
      return normalizeBibleValue(v);
    }

    // 1) structures multi-langues: BC_BIBLE[L][code][ch]
    try{
      if(window.BC_BIBLE && window.BC_BIBLE[L]) {
        var t1 = grab(window.BC_BIBLE[L]);
        if(t1) return t1;
      }
    }catch(e){}
    try{
      if(window.BIBLE && window.BIBLE[L]) {
        var t2 = grab(window.BIBLE[L]);
        if(t2) return t2;
      }
    }catch(e){}
    try{
      if(window.BIBLE_TEXTS && window.BIBLE_TEXTS[L]) {
        var t3 = grab(window.BIBLE_TEXTS[L]);
        if(t3) return t3;
      }
    }catch(e){}

    // 2) variables par langue: BIBLE_FR, BC_BIBLE_FR, BIBLE_fr...
    var candidates = [
      'BC_BIBLE_' + L, 'BC_BIBLE_' + L.toLowerCase(),
      'BIBLE_' + L,    'BIBLE_' + L.toLowerCase(),
      'BIBLE_TEXT_' + L, 'BIBLE_TEXT_' + L.toLowerCase(),
      'BIBLE_TEXTS_' + L, 'BIBLE_TEXTS_' + L.toLowerCase()
    ];

    for(var i=0;i<candidates.length;i++){
      try{
        var obj = window[candidates[i]];
        var t = grab(obj);
        if(t) return t;
      }catch(e){}
    }

    return '';
  }

  async function loadBibleFromJSON(lang){
    var L = normLang(lang);
    if(bibleCache[L]) return bibleCache[L];
    if(!BIBLE_FILES[L]) return null;

    try{
      var response = await fetch(BIBLE_FILES[L]);
      if(!response.ok) return null;
      var data = await response.json();
      bibleCache[L] = data;
      return data;
    }catch(e){
      console.error('Error loading Bible JSON:', e);
      return null;
    }
  }

  function extractChapterFromJSON(jsonData, bookCode, chapter){
    if(!jsonData || !jsonData.verses) return '';

    var c = codeAlias(bookCode);
    var bookNum = BOOK_CODE_TO_NUM[c];
    if(!bookNum) return '';

    var chapterVerses = [];
    for(var i=0; i<jsonData.verses.length; i++){
      var v = jsonData.verses[i];
      if(v.book === bookNum && v.chapter === chapter){
        chapterVerses.push(v.text);
      }
    }

    return chapterVerses.join('\n');
  }

  async function loadBible(lang, bookCode, chapter){
    var box = findBibleBox();
    if(!box) return '';

    // Try existing global variables first
    var t = findBibleText(lang, bookCode, chapter);
    if(t){
      setBoxText(box, t);
      return t;
    }

    // Load from JSON if available
    var jsonData = await loadBibleFromJSON(lang);
    if(jsonData){
      var text = extractChapterFromJSON(jsonData, bookCode, chapter);
      if(text){
        setBoxText(box, text);
        return text;
      }
    }

    setBoxText(box, 'â');
    return '';
  }

  // -------- UI / render --------

  function renderBookDropdown(lang){
    buildBookIndex();
    var sel = findBookSelect();
    if(!sel) return;

    var L = normLang(lang);
    if(sel.getAttribute('data-bc-labeled') === L) return;

    var opts = sel.querySelectorAll('option');
    if(opts && opts.length){
      for(var i=0;i<opts.length;i++){
        var code = String(opts[i].value || opts[i].getAttribute('value') || opts[i].textContent || '').trim();
        if(!code) continue;
        opts[i].textContent = getBookName(L, code);
      }
      sel.setAttribute('data-bc-labeled', L);
      return;
    }

    var books = window.BOOKS || [];
    sel.innerHTML = '';
    for(var j=0;j<books.length;j++){
      var b = books[j];
      if(!b || !b.code) continue;
      var opt = document.createElement('option');
      opt.value = String(b.code).toUpperCase();
      opt.textContent = getBookName(L, b.code);
      sel.appendChild(opt);
    }
    sel.setAttribute('data-bc-labeled', L);
  }

  function renderChaptersFor(bookCode){
    buildBookIndex();
    var wrap = findChapterWrap();
    if(!wrap) return;

    var book = (window.BOOKS_BY_CODE && window.BOOKS_BY_CODE[String(bookCode||'').toUpperCase()]) || null;
    var total = 1;

    if(book){
      if(typeof book.chapters === 'number') total = book.chapters;
      else if(typeof book.chapterCount === 'number') total = book.chapterCount;
      else if(Array.isArray(book.chapterTitles)) total = book.chapterTitles.length;
    }

    wrap.innerHTML = '';
    for(var i=1;i<=total;i++){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chapter-btn';
      btn.textContent = String(i);
      btn.setAttribute('data-chapter', String(i));
      (function(n){
        btn.addEventListener('click', function(){
          setActiveChapter(n);
          ensureToggleUI();
          setupAutoplayListener();
          refreshContent();
        });
      })(i);
      wrap.appendChild(btn);
    }
  }

  function setHeaderTitleLine(lang, bookCode, chapter, lyricsText){
    var ht = findHeaderTitle();
    if(!ht) return;

    var L = normLang(lang);
    var name = getBookName(L, bookCode);

    // Check if headerSubtitle exists (lecteur.html has separate title/subtitle)
    var hasSubtitle = !!document.getElementById('headerSubtitle');

    if(hasSubtitle){
      // lecteur.html: only set book name in headerTitle
      // headerSubtitle is managed by lecteur.html itself
      ht.textContent = name;
      return;
    }

    // Other pages: use full line format
    var title = '';
    try{
      var m = safeText(lyricsText).match(/\[TITLE\]\s*[\r\n]+([^\r\n]+)/i);
      if(m && m[1]) title = String(m[1]).trim();
      if(title){
        var parts = title.split(/\s-\s/);
        if(parts.length >= 2) title = parts.slice(1).join(' - ').trim();
        parts = title.split(/\sâ\s/);
        if(parts.length >= 2) title = parts.slice(1).join(' â ').trim();
      }
    }catch(e){}

    var line = name + ' â ' + getChapterWord(L) + ' ' + chapter;
    if(title) line = name + ' ' + chapter + ' â ' + title;

    ht.textContent = line;
  }

  function ensureToggleUI(){
    if(document.getElementById('bcToggleWrap')) return;

    var lyricsHeader = findLyricsHeader();
    var bibleHeader  = findBibleHeader();
    var lyricsBox = findLyricsBox();
    var bibleBox  = findBibleBox();

    if(!lyricsHeader || !lyricsBox) return;

    var host = lyricsHeader.parentNode;
    if(!host) return;

    var wrap = document.createElement('div');
    wrap.id = 'bcToggleWrap';
    wrap.style.display = 'flex';
    wrap.style.gap = '10px';
    wrap.style.margin = '0 0 10px 0';

    var bLyrics = document.createElement('button');
    bLyrics.type = 'button';
    bLyrics.id = 'bcBtnLyrics';

    var bBible = document.createElement('button');
    bBible.type = 'button';
    bBible.id = 'bcBtnBible';

    function labelButtons(){
      var L = getLang();
      var tLyrics = null, tBible = null;
      try{
        if(window.translations && window.translations[L]){
          tLyrics = window.translations[L].readerLyrics || window.translations[L].lyrics || null;
          tBible  = window.translations[L].readerBible  || window.translations[L].bible  || null;
        }
      }catch(e){}
      bLyrics.textContent = tLyrics || (L==='EN'?'Lyrics':(L==='PT'?'Letras':(L==='ES'?'Letras':(L==='DE'?'Liedtext':(L==='IT'?'Testo':'Paroles')))));
      bBible.textContent  = tBible  || (L==='EN'?'Bible':(L==='PT'?'BÃ­blia':(L==='ES'?'Biblia':(L==='DE'?'Bibel':(L==='IT'?'Bibbia':'Bible')))));
    }

    function setMode(mode){
      var m = (mode === 'bible') ? 'bible' : 'lyrics';
      try{ localStorage.setItem('bc_mode', m); }catch(e){}
      wrap.setAttribute('data-mode', m);

      var activeStyle = '2px solid rgba(255,255,255,0.7)';
      var idleStyle   = '1px solid rgba(255,255,255,0.25)';

      if(m === 'lyrics'){
        bLyrics.style.border = activeStyle;
        bBible.style.border  = idleStyle;
      }else{
        bBible.style.border  = activeStyle;
        bLyrics.style.border = idleStyle;
      }
      bLyrics.style.padding = bBible.style.padding = '6px 10px';
      bLyrics.style.borderRadius = bBible.style.borderRadius = '10px';
      bLyrics.style.background = bBible.style.background = 'rgba(0,0,0,0.15)';
      bLyrics.style.color = bBible.style.color = '#fff';

      if(bibleHeader) bibleHeader.style.display = (m==='bible') ? '' : 'none';
      if(bibleBox)    bibleBox.style.display    = (m==='bible') ? '' : 'none';

      lyricsHeader.style.display = (m==='lyrics') ? '' : 'none';
      lyricsBox.style.display    = (m==='lyrics') ? '' : 'none';

      // refreshContent(); // Don't reload audio on Paroles/Bible toggle
    }

    bLyrics.addEventListener('click', function(){ setMode('lyrics'); });
    bBible.addEventListener('click',  function(){ setMode('bible');  });

    wrap.appendChild(bLyrics);
    wrap.appendChild(bBible);

    host.insertBefore(wrap, lyricsHeader);

    labelButtons();

    var mode = 'lyrics';
    try{ mode = localStorage.getItem('bc_mode') || 'lyrics'; }catch(e){}
    setMode(mode);

    document.addEventListener('bc:lang', function(){ labelButtons(); }, true);
  }

  function cleanLyricsV2(text){
    // Nettoyer les tags Suno
    return text
      .split('\n')
      .filter(function(line){
        var trimmed = line.trim();
        if(/^\[TITLE\]$/i.test(trimmed)) return false;
        if(/^\[LYRICS\]$/i.test(trimmed)) return false;
        if(/^\[STYLE\]$/i.test(trimmed)) return false;
        if(/^\[TITLE\]/i.test(trimmed)) return false;
        if(/^\[STYLE\]/i.test(trimmed)) return false;
        return true;
      })
      .map(function(line){
        return line
          .replace(/\[Verse\s*\d*\]/gi, '')
          .replace(/\[Chorus\]/gi, '')
          .replace(/\[Bridge\]/gi, '')
          .replace(/\[Pre-Chorus\]/gi, '')
          .replace(/\[Intro\]/gi, '')
          .replace(/\[Outro\]/gi, '')
          .replace(/\[Spoken Word\]/gi, '')
          .trim();
      })
      .filter(function(line){ return line.length > 0; })
      .join('\n')
      .trim();
  }

  async function loadLyrics(lang, bookCode, chapter){
    var box = findLyricsBox();
    if(!box) return '';

    // Fallback sur variables globales si paramÃ¨tres manquants
    var L = normLang(lang || window.currentLang || window.CURRENT_LANG || getLang());
    var bc = bookCode || window.currentBookCode || window.currentBook || window.selectedBook || window.bookCode;
    var ch = chapter || window.currentChapter || window.selectedChapter || window.chapter || 1;

    // Check if V1/V2 system is active (for lecteur.html or pages with version toggle)
    var currentVersion = 'v2'; // Default to V2 (new behavior)
    try {
      if(typeof window.currentVersion !== 'undefined'){
        currentVersion = window.currentVersion;
      }
    } catch(e){}

    // V1: Show message pointing to V2
    if(L === 'FR' && String(currentVersion).toLowerCase() === 'v1'){
      box.innerHTML = '<div style="text-align: center; padding: 40px; color: #F5CB42; font-size: 18px;">ðµ Paroles disponibles en V2</div>';
      return '';
    }

    // V2: Fetch and display cleaned lyrics
    var url = getLyricsUrl(L, bc, ch);

    try{
      var res = await fetch(url, { cache:'no-store' });

      var ct = (res.headers.get("content-type") || "").toLowerCase();
      console.log("[LYRICS V2] URL:", url, "STATUS:", res.status, res.statusText, "CT:", ct);

      if(!res.ok) throw new Error('HTTP ' + res.status + ' ' + res.statusText);

      var text = await res.text();

      // Si le serveur renvoie du HTML (listing de dossier / 404 custom), on bloque
      if(text && text.trim().startsWith("<")){
        throw new Error("HTML reÃ§u au lieu d'un .txt (chemin incorrect)");
      }

      // Clean V2 lyrics (remove Suno tags)
      var cleaned = cleanLyricsV2(text);
      setBoxText(box, cleaned);
      return cleaned;

    }catch(e){
      console.error("[LYRICS V2] Failed to fetch:", e, url);

      // If V2 lyrics not available, show waiting message
      if(L === 'FR' && String(currentVersion).toLowerCase() === 'v2'){
        box.innerHTML = '<div style="text-align: center; padding: 40px; color: #F5CB42; font-size: 18px;">â³ Paroles V2 bientÃ´t disponibles<br><small style="color: #999; font-size: 14px;">' + String(e.message || e) + '</small></div>';
      } else {
        setBoxText(box, 'â');
      }
      return '';
    }
  }

  async function refreshContent(){
    var lang = getLang();
    var bookCode = getSelectedBookCode();
    if(!bookCode){
      var books = window.BOOKS || [];
      if(books.length && books[0].code){
        bookCode = String(books[0].code).toUpperCase();
        setSelectedBookCode(bookCode);
      }
    }
    if(!bookCode) return;

    var chapter = getSelectedChapter();

    setAudioFor(lang, bookCode, chapter);
    await loadBible(lang, bookCode, chapter);

    // Load lyrics and update header (setHeaderTitleLine handles headerSubtitle internally)
    var lyricsText = await loadLyrics(lang, bookCode, chapter);
    setHeaderTitleLine(lang, bookCode, chapter, lyricsText);
  }

  function refreshAll(resetChapter){
    var lang = getLang();
    window.currentLanguage = lang;

    renderBookDropdown(lang);

    var bookCode = getSelectedBookCode();

    // Si on a des paramÃ¨tres URL, les utiliser en prioritÃ©
    if(urlBookCode){
      console.log('[refreshAll] Using urlBookCode:', urlBookCode);
      bookCode = urlBookCode;
      setSelectedBookCode(urlBookCode);
      urlBookCode = null; // Utiliser une seule fois
    } else if(!bookCode){
      var sel = findBookSelect();
      if(sel && sel.options && sel.options.length){
        bookCode = String(sel.options[0].value || '').toUpperCase();
        if(bookCode) setSelectedBookCode(bookCode);
      }
    }

    if(bookCode){
      // Sauvegarder le chapitre AVANT de dÃ©truire les boutons
      var savedChapter = getSelectedChapter();

      renderChaptersFor(bookCode);

      // Si on a un chapitre depuis l'URL, l'utiliser
      if(urlChapter !== null){
        console.log('[refreshAll] Using urlChapter:', urlChapter);
        setActiveChapter(urlChapter);
        urlChapter = null; // Utiliser une seule fois
      } else {
        if(resetChapter !== false) setActiveChapter(1);
        else setActiveChapter(savedChapter);
      }
    }

    ensureToggleUI();
    refreshContent();
  }

  function wireEvents(){
    var sel = findBookSelect();
    if(sel){
      sel.addEventListener('change', function(){
        var code = getSelectedBookCode();
        if(code){
          renderChaptersFor(code);
          setActiveChapter(1);
        }
        ensureToggleUI();
        setupAutoplayListener();
        refreshContent();
      });
    }

    document.addEventListener('click', function(e){
      var btn = e.target;
      if(!btn) return;

      var lang = btn.getAttribute && (btn.getAttribute('data-lang') || btn.getAttribute('data-language'));
      if(!lang){
        var t = (btn.textContent || '').trim();
        if(/^(FR|EN|PT|ES|DE|IT|AR|RU|ZH|HI|TL|SW|KO)$/.test(t)) lang = t;
      }
      if(lang){
        if(btn.closest && btn.closest('#bcToggleWrap')) return;
        if(btn.closest && btn.closest('.bc-lang-row, .flags-row')) {
          e.preventDefault();
          setLang(lang);
        }
      }
    }, true);
  }

  var shouldAutoplay = false;
  var isAutoplayEnabled = false; // Lecture continue
  var urlBookCode = null;
  var urlChapter = null;

  function loadFromURL(){
    console.log('[loadFromURL] called');
    try {
      var params = new URLSearchParams(location.search);
      var bookNum = params.get('book');
      var chapterNum = params.get('chapter');
      var autoplay = params.get('autoplay');

      console.log('[loadFromURL] book param:', bookNum);
      console.log('[loadFromURL] chapter param:', chapterNum);
      console.log('[loadFromURL] NUM_TO_BOOK_CODE:', NUM_TO_BOOK_CODE);

      // Si on vient des Promesses avec book et chapter, on active l'autoplay
      if (bookNum && chapterNum) {
        shouldAutoplay = true;
        console.log('[loadFromURL] Autoplay enabled');
      }

      if (bookNum) {
        var bookInt = parseInt(bookNum, 10);
        console.log('[loadFromURL] bookInt:', bookInt);

        if (bookInt >= 1 && bookInt <= 66) {
          var bookCode = NUM_TO_BOOK_CODE[bookInt];
          console.log('[loadFromURL] bookCode found:', bookCode);

          if (bookCode) {
            // Stocker les valeurs pour les appliquer aprÃ¨s que le DOM soit crÃ©Ã©
            urlBookCode = bookCode;
            console.log('[loadFromURL] Stored urlBookCode:', urlBookCode);

            if (chapterNum) {
              var chInt = parseInt(chapterNum, 10);
              if (chInt >= 1) {
                urlChapter = chInt;
                console.log('[loadFromURL] Stored urlChapter:', urlChapter);
              }
            }
          } else {
            console.error('[loadFromURL] No book code found for number:', bookInt);
          }
        }
      }
    } catch (e) {
      console.error('[loadFromURL] Error:', e);
    }
  }

  function tryAutoplay(){
    if (shouldAutoplay) {
      shouldAutoplay = false;
      var audio = findAudioEl();
      if (audio && audio.src) {
        setTimeout(function(){
          audio.play().catch(function(e){
            console.log('Autoplay prevented by browser:', e);
          });
        }, 500);
      }
    }
  }

  function playNextChapter(){
    if(!isAutoplayEnabled) return;

    buildBookIndex();
    var bookCode = getSelectedBookCode();
    var currentChapter = getSelectedChapter();

    // Trouver le nombre total de chapitres
    var book = (window.BOOKS_BY_CODE && window.BOOKS_BY_CODE[String(bookCode||'').toUpperCase()]) || null;
    var maxChapters = 1;
    if(book){
      if(typeof book.chapters === 'number') maxChapters = book.chapters;
      else if(typeof book.chapterCount === 'number') maxChapters = book.chapterCount;
    }

    // Si pas le dernier chapitre, avancer
    if(currentChapter < maxChapters){
      var nextChapter = currentChapter + 1;
      setActiveChapter(nextChapter);
      refreshContent();
      console.log('[Autoplay] Playing next chapter:', nextChapter);
    } else {
      console.log('[Autoplay] End of book reached');
    }
  }

  function setupAutoplayListener(){
    var audio = findAudioEl();
    if(!audio) return;

    // Remove existing listener if any
    audio.removeEventListener('ended', playNextChapter);

    // Add ended event listener
    audio.addEventListener('ended', function(){
      console.log('[Audio] Chapter ended, autoplay enabled:', isAutoplayEnabled);
      if(isAutoplayEnabled){
        playNextChapter();
      }
    });
  }

  function boot(){
    buildBookIndex();
    wireEvents();
    loadFromURL();

    // Restaurer livre/chapitre si on vient d'un changement de langue
    if(!urlBookCode){
      try{
        var pendingBook = localStorage.getItem('bc_pending_book');
        var pendingChap = localStorage.getItem('bc_pending_chapter');
        if(pendingBook){
          urlBookCode = pendingBook;
          urlChapter = pendingChap ? parseInt(pendingChap, 10) : 1;
          console.log('[boot] Restored from lang switch: book=' + urlBookCode + ' chapter=' + urlChapter);
        }
      }catch(e){}
      try{ localStorage.removeItem('bc_pending_book'); }catch(e){}
      try{ localStorage.removeItem('bc_pending_chapter'); }catch(e){}
    }

    setupAutoplayListener();
    refreshAll(false);
    setTimeout(tryAutoplay, 1200);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }

  window.BC_PLAYER = window.BC_PLAYER || {};
  window.BC_PLAYER.getLang = getLang;
  window.BC_PLAYER.setLang = setLang;
  window.BC_PLAYER.refresh = function(){ refreshAll(false); };
  window.BC_PLAYER.toggleAutoplay = function(){
    isAutoplayEnabled = !isAutoplayEnabled;
    console.log('[Autoplay] Toggled:', isAutoplayEnabled);
    return isAutoplayEnabled;
  };
  window.BC_PLAYER.getAutoplayStatus = function(){
    return isAutoplayEnabled;
  };

})();












