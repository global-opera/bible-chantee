/* BC_CLEAR_CACHE_SITE_ONLY_V1 */
(function(){
  function removePrefixed(storage, prefixes){
    try{
      var keys=[];
      for(var i=0;i<storage.length;i++) keys.push(storage.key(i));
      for(var j=0;j<keys.length;j++){
        var k=keys[j];
        for(var p=0;p<prefixes.length;p++){
          if(k && k.indexOf(prefixes[p])===0){ storage.removeItem(k); break; }
        }
      }
    }catch(e){}
  }
  function delCookie(name){
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
  window.bcClearCache = function(){
    try{
      removePrefixed(localStorage,["bc_","sungbible_"]);
      removePrefixed(sessionStorage,["bc_","sungbible_"]);
      var cookies=["bc_lang","bc_premium","bc_debug","sungbible_lang","sungbible_premium"];
      for(var i=0;i<cookies.length;i++) delCookie(cookies[i]);
      if(window.caches && caches.keys){
        caches.keys().then(function(keys){
          for(var i=0;i<keys.length;i++) caches.delete(keys[i]);
        });
      }
      alert("Cache Bible Chantée vidé. Rechargement…");
      location.reload();
    }catch(e){
      try{console.error(e);}catch(x){}
      alert("Erreur lors du nettoyage du cache.");
    }
  };
})();
