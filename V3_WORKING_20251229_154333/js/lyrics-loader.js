(function(){
  function pad2(n){ return String(n).padStart(2,'0'); }

  async function loadLyrics(lang, bookCode, chapter){
    const base = (window.BC3 && BC3.paths && BC3.paths.lyricsBase) ? BC3.paths.lyricsBase : './data/lyrics';
    const ch = pad2(chapter);
    const url = `${base}/${lang}/${bookCode}/${bookCode}_${ch}_${lang}.txt`;
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) return null;
    return await r.text();
  }

  window.BC3 = window.BC3 || {};
  BC3.Lyrics = { loadLyrics };
})();