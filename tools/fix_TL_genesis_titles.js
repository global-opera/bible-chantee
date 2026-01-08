const fs = require("fs");
const vm = require("vm");

const ctFile = "js/chapter-titles.js";
const ctCode = fs.readFileSync(ctFile, "utf8");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(ctCode, ctx);
const T = ctx.window.CHAPTER_TITLES;

function setTL(book, ch, title) {
  if (!T.TL) T.TL = {};
  if (!T.TL[book]) T.TL[book] = {};
  T.TL[book][String(ch)] = title;
}

// ✅ TL — Genèse (01) : remplacer les 3 fallbacks par titres traduits
setTL("01", 28, "Hagdan ni Jacob Patungo sa Langit");
setTL("01", 30, "Sa Laban ng Buhay, Dinirinig ng Diyos");
setTL("01", 33, "Pagkakasundo at Kapayapaan");

// Audit fallback (même logique que gplay_ready_titles_check.js)
const rxFallback = /^(Chapitre|Chapter|Cap[ií]tulo|Kapitel|Capitolo|Kabanata)\s+\d+/;
let fallbackCount = 0;
const list = [];
for (const l in T) for (const b in T[l]) for (const ch in T[l][b]) {
  const v = T[l][b][ch];
  if (rxFallback.test(v)) { fallbackCount++; list.push([l,b,ch,v]); }
}

fs.writeFileSync(ctFile, "window.CHAPTER_TITLES = " + JSON.stringify(T, null, 2) + ";", "utf8");

console.log("OK — TL Genesis titles patched.");
console.log("AUDIT — fallbackCount =", fallbackCount);
if (fallbackCount) {
  console.log("FALLBACKS:");
  for (const it of list) console.log("FALLBACK", ...it);
  process.exit(2);
}
console.log("PASS — no fallbacks remain.");
