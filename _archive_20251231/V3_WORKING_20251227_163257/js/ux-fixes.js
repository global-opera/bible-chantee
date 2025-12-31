/* BC_UX_FIXES_V1 */
(function(){
  function getLang(){
    try{
      if (window.BC_LANG && window.BC_LANG.current) return String(window.BC_LANG.current).toUpperCase();
      if (window.currentLanguage) return String(window.currentLanguage).toUpperCase();
      var u=new URL(location.href); return String(u.searchParams.get('lang')||'FR').toUpperCase();
    }catch(e){return 'FR';}
  }

  function getBookName(lang, code){
    try{
      if (code && window.BOOK_NAMES && window.BOOK_NAMES[lang] && window.BOOK_NAMES[lang][code]) return window.BOOK_NAMES[lang][code];
      if (code && window.BOOK_NAMES && window.BOOK_NAMES.FR && window.BOOK_NAMES.FR[code]) return window.BOOK_NAMES.FR[code];
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
      var a=document.querySelector("audio");
      if(a && a.src){var m=a.src.match(/(\d{2}_[A-Z0-9]{3})/); if(m) return m[1];}
    }catch(e){}
    return "";
  }

  function prettifyBookOptions(){
    var lang=getLang();
    var sels=document.querySelectorAll("select");
    for(var s=0;s<sels.length;s++){
      var sel=sels[s];
      if(!sel || !sel.options || sel.options.length<2) continue;

      // heuristique: select livre = options contenant 01_GEN / 02_EXO etc.
      var sample=String(sel.options[0].textContent||"");
      var looksBook = /(\d{2}_[A-Z0-9]{3})/.test(sample);
      if(!looksBook){
        // autre format "01 - 01_GEN"
        looksBook = /\b\d{2}\s*-\s*\d{2}_[A-Z0-9]{3}\b/.test(sample);
      }
      if(!looksBook) continue;

      for(var i=0;i<sel.options.length;i++){
        var opt=sel.options[i];
        var t=String(opt.textContent||"");
        var m=t.match(/(\d{2}_[A-Z0-9]{3})/);
        if(!m) continue;
        var code=m[1];
        var idx=t.match(/\b(\d{2})\b/); var n = idx ? idx[1] : code.substring(0,2);
        var name=getBookName(lang,code) || getBookName("FR",code) || code;
        opt.textContent = n + " - " + name;
      }
    }
  }

  function isChapterSelect(sel){
    if(!sel || sel.tagName!=="SELECT" || !sel.options || sel.options.length<2) return false;
    var t0=String(sel.options[0].textContent||"").trim();
    return (/^\d{1,3}\s*-\s*\d{1,3}$/.test(t0) || /^\d{1,3}$/.test(t0) || /Chapitre/i.test(t0));
  }

  function chapterNum(opt,i){
    var v=String(opt.value||"").trim();
    if(/^\d{1,3}$/.test(v)) return parseInt(v,10);
    var t=String(opt.textContent||"").trim();
    var m=t.match(/^\d{1,3}\s*-\s*(\d{1,3})$/);
    if(m) return parseInt(m[1],10);
    if(/^\d{1,3}$/.test(t)) return parseInt(t,10);
    return i+1;
  }

  function prettifyChapterOptions(){
    var lang=getLang();
    var code=inferBookCode();
    var book=getBookName(lang,code) || getBookName("FR",code) || "";

    // fallback: essayer de lire le select livre (option sélectionnée)
    if(!book){
      var sels=document.querySelectorAll("select");
      for(var s=0;s<sels.length;s++){
        var sel=sels[s];
        if(!sel || !sel.options || sel.options.length<2) continue;
        var tx=String(sel.options[sel.selectedIndex||0].textContent||"");
        var m=tx.match(/-\s*(.+)$/);
        if(m && tx.match(/(\d{2}_[A-Z0-9]{3})/)){ book=m[1].trim(); break; }
      }
    }

    if(!book) return;

    var sels2=document.querySelectorAll("select");
    for(var s2=0;s2<sels2.length;s2++){
      var sel2=sels2[s2];
      if(!isChapterSelect(sel2)) continue;
      for(var i=0;i<sel2.options.length;i++){
        var opt=sel2.options[i];
        var ch=chapterNum(opt,i);
        opt.textContent = book + " – Chapitre " + ch;
      }
    }
  }

  function prettifyHeader(){
    try{
      var lang=getLang();
      var code=inferBookCode();
      var book=getBookName(lang,code) || getBookName("FR",code) || "";
      if(!book) return;

      var title=document.querySelector("h1,h2,.header-title,.lecteur-title,[data-role='page-title']");
      if(!title) return;

      var t=String(title.textContent||"");
      // remplace "01_GEN" ou "01 - 01_GEN" ou "01 — Chapitre X"
      if(/(\d{2}_[A-Z0-9]{3})/.test(t) || /\b\d{2}\b/.test(t)){
        title.textContent = book;
      }
    }catch(e){}
  }

  function run(){
    prettifyBookOptions();
    prettifyChapterOptions();
    prettifyHeader();
  }

  run();
  setTimeout(run,250);
  setTimeout(run,900);

  try{
    var obs=new MutationObserver(function(){run();});
    obs.observe(document.documentElement,{subtree:true,childList:true});
  }catch(e){}
})();
