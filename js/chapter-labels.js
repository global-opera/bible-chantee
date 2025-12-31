/* BC_CHAPTER_LABELS_CLEAN_V1 */
(function(){
  try{ console.log("[chapter-labels CLEAN] loaded"); }catch(e){}

  function getLang(){
    try{
      if (window.BC_LANG && window.BC_LANG.current) return String(window.BC_LANG.current).toUpperCase();
      if (window.currentLanguage) return String(window.currentLanguage).toUpperCase();
      var u = new URL(location.href);
      return String(u.searchParams.get("lang") || "FR").toUpperCase();
    }catch(e){ return "FR"; }
  }

  function idxToCode(idx){
    var m={
      "01":"01_GEN","02":"02_EXO","03":"03_LEV","04":"04_NUM","05":"05_DEU",
      "06":"06_JOS","07":"07_JDG","08":"08_RUT","09":"09_1SA","10":"10_2SA",
      "11":"11_1KI","12":"12_2KI","13":"13_1CH","14":"14_2CH","15":"15_EZR",
      "16":"16_NEH","17":"17_EST","18":"18_JOB","19":"19_PSA","20":"20_PRO",
      "21":"21_ECC","22":"22_SNG","23":"23_ISA","24":"24_JER","25":"25_LAM",
      "26":"26_EZK","27":"27_DAN","28":"28_HOS","29":"29_JOL","30":"30_AMO",
      "31":"31_OBA","32":"32_JON","33":"33_MIC","34":"34_NAM","35":"35_HAB",
      "36":"36_ZEP","37":"37_HAG","38":"38_ZEC","39":"39_MAL",
      "40":"40_MAT","41":"41_MRK","42":"42_LUK","43":"43_JHN","44":"44_ACT",
      "45":"45_ROM","46":"46_1CO","47":"47_2CO","48":"48_GAL","49":"49_EPH",
      "50":"50_PHP","51":"51_COL","52":"52_1TH","53":"53_2TH",
      "54":"54_1TI","55":"55_2TI","56":"56_TIT","57":"57_PHM",
      "58":"58_HEB","59":"59_JAS","60":"60_1PE","61":"61_2PE",
      "62":"62_1JN","63":"63_2JN","64":"64_3JN","65":"65_JUD","66":"66_REV"
    };
    return m[idx] || "";
  }

  function inferBookIndex(){
    try{
      var title = document.querySelector("h1,h2,.header-title,.lecteur-title,[data-role='page-title']");
      if (title){
        var t = String(title.textContent || "");
        var m = t.match(/\b(\d{2})\b/);
        if (m) return m[1];
      }
    }catch(e){}
    return "";
  }

  function inferBookCode(){
    try{
      if (window.BC_STATE && window.BC_STATE.bookCode) return window.BC_STATE.bookCode;
      if (window.currentBookCode) return window.currentBookCode;
      if (window.bookCode) return window.bookCode;
    }catch(e){}

    try{
      var a = document.querySelector("audio");
      if (a && a.src){
        var m = a.src.match(/(\d{2}_[A-Z0-9]{3})/);
        if (m) return m[1];
      }
    }catch(e){}

    var idx = inferBookIndex();
    if (idx){
      var code = idxToCode(idx);
      if (code) return code;
    }
    return "";
  }

  function getBookName(lang, code){
    try{
      if (code && window.BOOK_NAMES && window.BOOK_NAMES[lang] && window.BOOK_NAMES[lang][code]) return window.BOOK_NAMES[lang][code];
      if (code && window.BOOK_NAMES && window.BOOK_NAMES.FR && window.BOOK_NAMES.FR[code]) return window.BOOK_NAMES.FR[code];
    }catch(e){}
    return "";
  }

  function isChapterSelect(sel){
    if (!sel || sel.tagName !== "SELECT" || !sel.options || sel.options.length < 2) return false;
    var t0 = String(sel.options[0].textContent || "").trim();
    return (/^\d{1,3}\s*-\s*\d{1,3}$/.test(t0) || /^\d{1,3}$/.test(t0) || /Chapitre/i.test(t0));
  }

  function chapterNum(opt,i){
    var v = String(opt.value || "").trim();
    if (/^\d{1,3}$/.test(v)) return parseInt(v,10);
    var t = String(opt.textContent || "").trim();
    var m = t.match(/^\d{1,3}\s*-\s*(\d{1,3})$/);
    if (m) return parseInt(m[1],10);
    if (/^\d{1,3}$/.test(t)) return parseInt(t,10);
    return i+1;
  }

  function relabel(){
    var lang = getLang();
    var code = inferBookCode();
    var name = getBookName(lang, code) || getBookName("FR", code);

    if (!name){
      var idx = inferBookIndex();
      if (idx){
        var code2 = idxToCode(idx);
        name = getBookName(lang, code2) || getBookName("FR", code2);
        if (name) code = code2;
      }
    }

    var finalBook = name || code || "Genèse";
    var sels = document.querySelectorAll("select");
    for (var s=0; s<sels.length; s++){
      var sel = sels[s];
      if (!isChapterSelect(sel)) continue;
      for (var i=0; i<sel.options.length; i++){
        var opt = sel.options[i];
        var ch = chapterNum(opt,i);
        opt.textContent = finalBook + " – Chapitre " + ch;
      }
    }
  }

  relabel();
  setTimeout(relabel, 200);
  setTimeout(relabel, 800);
  setTimeout(relabel, 2000);

  try{
    var obs = new MutationObserver(function(){ relabel(); });
    obs.observe(document.documentElement, {subtree:true, childList:true});
  }catch(e){}
})();
