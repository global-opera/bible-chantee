/* Bible Chantée V3 — player.js (standalone, robust) */
(function () {
  const LANGS = (window.I18N && window.I18N.LANGS) || ['FR','EN','PT','ES','DE','IT','AR','RU','ZH','HI','TL','SW'];

  function pad2(n) { return String(n).padStart(2, '0'); }

  function getLang() {
    try {
      const url = new URLSearchParams(location.search).get('lang');
      if (url && LANGS.includes(url.toUpperCase())) {
        const lang = url.toUpperCase();
        localStorage.setItem('bc_lang', lang);
        return lang;
      }
      const stored = (localStorage.getItem('bc_lang') || '').toUpperCase();
      if (stored && LANGS.includes(stored)) return stored;
      return 'FR';
    } catch (e) { return 'FR'; }
  }

  function setLang(lang) {
    const L = String(lang||'').toUpperCase();
    if (!LANGS.includes(L)) return;
    localStorage.setItem('bc_lang', L);
    const url = new URL(location.href);
    url.searchParams.set('lang', L);
    location.href = url.toString();
  }

  // Mapping-first, fallback local pattern
  function getAudioUrl(bookNum, chapter, lang, bookCode) {
    const L = String(lang || 'FR').toUpperCase();
    const B = String(bookNum || '').padStart(2, '0');
    const C = String(chapter);

    // 1) Mapping (if present)
    const mapVar = 'AUDIO_URLS_' + L;
    const urls = window[mapVar];
    if (urls && urls[B] && urls[B][C]) return urls[B][C];

    // 2) Local pattern
    const code = bookCode || null;
    if (!code) return null;

    const ch2 = pad2(Number(chapter));
    return `./audio/${L}/${code}/${code}_${ch2}_${L}.mp3`;
  }

  function getLyricsUrl(bookCode, chapter, lang) {
    const L = String(lang || 'FR').toUpperCase();
    const ch2 = pad2(Number(chapter));
    return `./lyrics/${L}/${bookCode}/${bookCode}_${ch2}_${L}.txt`;
  }

  async function loadText(url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) return null;
    return await r.text();
  }

  function $(id) { return document.getElementById(id); }

    function bookDisplayName(book, lang) {
    const name = getBookName(book.num, book.code, lang);
    return ${name};
  }

  function buildBookIndex() {
    if (window.BOOKS && !window.BOOKS_BY_NUM) {
      const idx = {};
      window.BOOKS.forEach(b => idx[b.num] = b);
      window.BOOKS_BY_NUM = idx;
    }
  }

  function renderChapters(book, selectedChap, onPick) {
    const grid = $('chapterGrid');
    grid.innerHTML = '';
    for (let c = 1; c <= book.chapters; c++) {
      const btn = document.createElement('button');
      btn.className = 'chap-btn' + (c === selectedChap ? ' active' : '');
      btn.textContent = String(c);
      btn.addEventListener('click', () => onPick(c));
      grid.appendChild(btn);
    }
  }

  async function setChapter(book, chapter, lang) {
    const audio = $('audioPlayer');
    const status = $('audioStatus');
    const lyricsBox = $('lyricsBox');
    const bibleBox = $('bibleBox');
    const ref = $('currentRef');

    ref.textContent = `${book.code} — ${chapter}`;

    // AUDIO
    const audioUrl = getAudioUrl(book.num, chapter, lang, book.code);
    if (!audioUrl) {
      status.textContent = 'MP3 introuvable';
      audio.removeAttribute('src');
    } else {
      status.textContent = audioUrl.includes('http') ? 'Audio (R2)' : 'Audio (local)';
      audio.src = audioUrl;
      audio.load();
    }

    // LYRICS
    const lurl = getLyricsUrl(book.code, chapter, lang);
    const ltxt = await loadText(lurl);
    lyricsBox.textContent = ltxt || '—';

    // BIBLE (placeholder for now)
    bibleBox.textContent = '—';
  }

  function init() {
    buildBookIndex();

    const lang = getLang();

    // Lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const L = btn.dataset.lang;
      btn.classList.toggle('active', L === lang);
      btn.addEventListener('click', () => setLang(L));
    });

    // i18n apply
    if (window.I18N && window.I18N.applyTranslations) window.I18N.applyTranslations();

    // Books
    const books = window.BOOKS || [];
    const bookSelect = $('bookSelect');
    if (!books.length) {
      $('audioStatus').textContent = 'ERREUR: BOOKS non chargé (books.js)';
      return;
    }

    // default: first book
    let currentBook = books[0];
    let currentChapter = 1;

    bookSelect.innerHTML = '';
    books.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.num;
      opt.textContent = bookDisplayName(b, lang);
      bookSelect.appendChild(opt);
    });

    bookSelect.value = currentBook.num;

    const pickChapter = async (c) => {
      currentChapter = c;
      renderChapters(currentBook, currentChapter, pickChapter);
      await setChapter(currentBook, currentChapter, lang);
    };

    bookSelect.addEventListener('change', async () => {
      const num = bookSelect.value;
      currentBook = window.BOOKS_BY_NUM[num] || books[0];
      currentChapter = 1;
      renderChapters(currentBook, currentChapter, pickChapter);
      await setChapter(currentBook, currentChapter, lang);
    });

    renderChapters(currentBook, currentChapter, pickChapter);
    pickChapter(currentChapter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();