/* BC_HEADER_V1 */
(function(){
  const READY = ['FR','EN','PT','ES','DE','IT'];
  const SOON  = ['AR','RU','ZH','HI','TL','SW'];

  function codeOf(btn){
    let c = (btn.getAttribute('data-lang') || '').toUpperCase().trim();
    if(!c){
      const t = (btn.textContent || '').toUpperCase();
      const m = t.match(/\b(FR|EN|PT|ES|DE|IT|AR|RU|ZH|HI|TL|SW)\b/);
      c = (m && m[1]) ? m[1] : '';
    }
    return c;
  }

  function splitLangButtons(){
    const btns = [...document.querySelectorAll('.lang-btn')];
    if(btns.length < 10) return false;

    // parent commun le plus simple (celui du 1er bouton)
    const host = btns[0].parentElement;
    if(!host) return false;

    // déjà fait ?
    if(host.querySelector('.bc-lang-wrap')) return true;

    // si boutons déjà dans 2 lignes, on ne re-split pas
    if(host.classList && host.classList.contains('bc-lang-wrap')) return true;

    const wrap = document.createElement('div');
    wrap.className = 'bc-lang-wrap';

    const rowReady = document.createElement('div');
    rowReady.className = 'bc-lang-row ready';

    const rowSoon = document.createElement('div');
    rowSoon.className = 'bc-lang-row soon';

    btns.forEach(b=>{
      const c = codeOf(b) || (b.dataset.lang || '').toUpperCase();
      if(READY.includes(c)) rowReady.appendChild(b);
      else if(SOON.includes(c)) rowSoon.appendChild(b);
      else rowReady.appendChild(b);
    });

    wrap.appendChild(rowReady);
    wrap.appendChild(rowSoon);

    host.innerHTML = '';
    host.appendChild(wrap);
    return true;
  }

  function runWithRetry(){
    let tries = 0;
    const t = setInterval(()=>{
      tries++;
      if(splitLangButtons() || tries >= 15) clearInterval(t);
    }, 200);
  }

  document.addEventListener('DOMContentLoaded', runWithRetry);
  runWithRetry();
})();
