const fs = require("fs");
const vm = require("vm");

function loadT(){
  const c = fs.readFileSync("js/chapter-titles.js","utf8");
  const x = { window:{} };
  vm.createContext(x);
  vm.runInContext(c,x);
  return x.window.CHAPTER_TITLES;
}

function saveT(T){
  fs.writeFileSync("js/chapter-titles.js","window.CHAPTER_TITLES = "+JSON.stringify(T,null,2)+";","utf8");
}

function pad2(n){ return String(n).padStart(2,"0"); }
function kabanata(ch){ return `Kabanata ${pad2(ch)}`; }

// détecte pollution évidente dans TL (FR/EN/ES/PT/DE/IT)
const rxNotTL =
  /(Gen[eè]se|Psaume|Chapitre|Chapter|Cap[ií]tulo|Kapitel|Capitolo| - |"|'|’)/i;

// si TL contient des caractères spéciaux de titres FR/EN (guillemets, tiret, apostrophes), on considère “pollué”
function isPollutedTL(s){
  if(!s) return true;
  const t = String(s).trim();
  if(!t) return true;
  if(/^Kabanata\s+\d+$/i.test(t)) return false; // déjà OK
  if(rxNotTL.test(t)) return true;
  return false;
}

const T = loadT();

let changed = 0;
let pollutedCount = 0;

// 1) Remplacer TOUS les titres TL “pollués” par fallback TL propre
for(const b in T.TL){
  for(const ch in T.TL[b]){
    const before = T.TL[b][ch];
    if(isPollutedTL(before)){
      pollutedCount++;
      const after = kabanata(Number(ch));
      if(before !== after){
        T.TL[b][ch] = after;
        changed++;
      }
    }
  }
}

saveT(T);

console.log("OK — TL cleaned:", { pollutedFound: pollutedCount, changed });

// 2) Audit strict : TL doit contenir uniquement “Kabanata NN” (tant qu’on n’a pas de traductions TL réelles)
let bad = 0;
for(const b in T.TL){
  for(const ch in T.TL[b]){
    const v = T.TL[b][ch];
    if(!/^Kabanata\s+\d+$/i.test(String(v).trim())){
      console.log("BAD_TL", b, ch, v);
      bad++;
    }
  }
}
console.log("AUDIT — BAD_TL =", bad);
if(bad!==0) process.exit(2);
