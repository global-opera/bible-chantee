const fs = require("fs");
const vm = require("vm");

function loadT() {
  const c = fs.readFileSync("js/chapter-titles.js", "utf8");
  const x = { window: {} };
  vm.createContext(x);
  vm.runInContext(c, x);
  return x.window.CHAPTER_TITLES;
}

const T = loadT();

// Les 3 fallbacks à corriger
const targets = [
  ["01","28"],
  ["01","30"],
  ["01","33"],
];

// Source de secours (priorité FR, sinon EN)
function pickSourceTitle(book, ch) {
  const fr = T.FR?.[book]?.[ch];
  if (fr && !/^(Chapitre)\s+\d+$/i.test(fr)) return fr;

  const en = T.EN?.[book]?.[ch];
  if (en && !/^(Chapter)\s+\d+$/i.test(en)) return en;

  return null;
}

let changed = 0;
for (const [book, ch] of targets) {
  const src = pickSourceTitle(book, ch);
  if (!src) {
    console.log("WARN no FR/EN title found for", book, ch, "— keeping fallback");
    continue;
  }
  const before = T.TL?.[book]?.[ch];
  T.TL[book][ch] = src; // copie du titre FR/EN
  if (before !== src) changed++;
  console.log("FIXED TL", book, ch, "=>", src);
}

// Sauvegarde
fs.writeFileSync("js/chapter-titles.js", "window.CHAPTER_TITLES = " + JSON.stringify(T, null, 2) + ";", "utf8");

// Audit final: plus aucun fallback TL Kabanata NN
const rxFallbackTL = /^Kabanata\s+\d+$/;
let remain = 0;
for (const b in T.TL) for (const ch in T.TL[b]) {
  if (rxFallbackTL.test(T.TL[b][ch])) remain++;
}

console.log("OK — changed =", changed, "remaining TL fallbacks =", remain);
if (remain !== 0) process.exit(2);
console.log("PASS — TL fallbacks cleared.");
