const fs = require("fs");
const vm = require("vm");

function loadChapterTitles() {
  const ctFile = "js/chapter-titles.js";
  const ctCode = fs.readFileSync(ctFile, "utf8");
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(ctCode, ctx);
  return { ctFile, T: ctx.window.CHAPTER_TITLES };
}

const labels = {
  FR: "Chapitre",
  EN: "Chapter",
  PT: "Capítulo",
  ES: "Capítulo",
  DE: "Kapitel",
  IT: "Capitolo",
  TL: "Kabanata",
};

const small = {
  FR: ["de","du","des","la","le","les","en","et","à","au","aux","sur","pour","dans"],
  ES: ["de","del","la","el","los","las","y","en","a","por","para"],
  PT: ["de","do","da","dos","das","e","em","a","por","para"],
  EN: ["of","the","and","in","on","to","for","with"],
  DE: ["und","der","die","das","den","von","im","in","zu"],
  IT: ["di","del","della","e","in","a","da","per"],
  TL: ["ng","sa","at","kay","para","mga"],
};

function pad2(n) {
  return String(n).padStart(2, "0");
}

function titleCase(txt, lang) {
  const keep = new Set(small[lang] || []);
  const parts = String(txt).split(/(\s+)/);
  return parts.map((w, i) => {
    if (/^\s+$/.test(w)) return w;
    const lw = w.toLowerCase();
    if (i > 0 && keep.has(lw)) return lw;
    return lw.charAt(0).toUpperCase() + lw.slice(1);
  }).join("");
}

function cleanLine(s) {
  if (!s) return null;
  s = String(s).trim();

  // enlever markdown + prefix title
  s = s.replace(/^#+\s*/, "");
  s = s.replace(/^(TITRE|TITLE|T[IÍ]TULO|TITEL|TITOLO)\s*:\s*/i, "");

  // enlever crochets [TITLE] [LYRICS]
  s = s.replace(/\[(TITLE|LYRICS)\]/gi, "").trim();

  // enlever *italique* (début/fin)
  s = s.replace(/^\*+/, "").replace(/\*+$/, "").trim();

  // refuser tokens parasites
  if (!s) return null;
  if (/^\[?lyrics\]?$/i.test(s)) return null;
  if (/^\[?title\]?$/i.test(s)) return null;
  if (/^\[?titre\]?$/i.test(s)) return null;
  if (/^(t[ií]tulo|titolo|titulo)$/i.test(s)) return null;
  if (/^verse\s+\d+$/i.test(s)) return null;
  if (/^#+$/.test(s)) return null;

  return s;
}

function extractTitleFromBlock(txt) {
  if (!txt) return null;
  const lines = String(txt).replace(/\r/g, "").split("\n").map(l => l.trim());

  // 1) chercher une vraie ligne après [TITLE]
  for (let i = 0; i < lines.length; i++) {
    if (/^\[title\]$/i.test(lines[i])) {
      for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
        const cand = cleanLine(lines[j]);
        if (cand) return cand;
      }
    }
  }

  // 2) chercher un style "### Titre: xxx"
  for (const ln of lines) {
    const m = ln.match(/^#+\s*(TITRE|TITLE|T[IÍ]TULO|TITEL|TITOLO)\s*:?\s*(.+)$/i);
    if (m) {
      const cand = cleanLine(m[2]);
      if (cand) return cand;
    }
  }

  // 3) fallback : première ligne utile après [LYRICS]
  for (let i = 0; i < lines.length; i++) {
    if (/^\[lyrics\]$/i.test(lines[i])) {
      for (let j = i + 1; j < Math.min(i + 25, lines.length); j++) {
        const cand = cleanLine(lines[j]);
        if (cand) return cand;
      }
    }
  }

  return null;
}

function sanitizeTitle(raw, lang, ch) {
  let s = (raw ?? "").toString().trim();

  // supprimer artefacts
  s = s.replace(/^#+\s*/, "");
  s = s.replace(/\[(TITLE|LYRICS)\]/gi, "").trim();
  s = s.replace(/^\*+/, "").replace(/\*+$/, "").trim();
  s = s.replace(/^(TITRE|TITLE|T[IÍ]TULO|TITEL|TITOLO)\s*:\s*/i, "");
  s = s.replace(/^Title\s+/i, "").trim();

  // si c'est juste un token
  if (/^(t[ií]tulo|titolo|titulo)$/i.test(s)) s = "";
  if (/^verse\s+\d+$/i.test(s)) s = "";

  // title case final
  if (s) s = titleCase(s, lang).trim();

  // fallback
  if (!s) return `${labels[lang] ?? "Chapter"} ${pad2(ch)}`;
  return s;
}

function main() {
  const { ctFile, T } = loadChapterTitles();

  // A) Injection depuis lyrics/*.json (si dispo)
  let injected = 0, skipped = 0;
  for (const lang of Object.keys(T)) {
    const lf = `lyrics/${lang}.json`;
    if (!fs.existsSync(lf)) continue;

    const data = JSON.parse(fs.readFileSync(lf, "utf8"));
    for (const book in data) {
      const bookNum = book.split("_")[0]; // '01'...'66'
      for (const ch in data[book]) {
        const title = extractTitleFromBlock(data[book][ch]);
        if (title) {
          if (T[lang]?.[bookNum]?.[ch] != null) {
            T[lang][bookNum][ch] = title;
            injected++;
          } else {
            skipped++;
          }
        }
      }
    }
  }

  // B) Nettoyage global + fallback sûr
  let cleaned = 0;
  for (const lang in T) {
    for (const b in T[lang]) {
      for (const ch in T[lang][b]) {
        const before = T[lang][b][ch];
        const after = sanitizeTitle(before, lang, Number(ch));
        if (before !== after) {
          T[lang][b][ch] = after;
          cleaned++;
        }
      }
    }
  }

  fs.writeFileSync(ctFile, "window.CHAPTER_TITLES = " + JSON.stringify(T, null, 2) + ";", "utf8");

  // C) Audits finaux
  const rxFallback = /^(Chapitre|Chapter|Cap[ií]tulo|Kapitel|Capitolo|Kabanata)\s+\d+/;
  const rxBad = /^(TITLE|TITRE|T[IÍ]TULO|TITEL|TITOLO|LYRICS|#+|\*)/i;
  const rxVerse = /^verse\s+\d+$/i;

  let fallbackCount = 0, badCount = 0, verseCount = 0;

  for (const l in T) for (const b in T[l]) for (const ch in T[l][b]) {
    const v = T[l][b][ch];
    if (rxFallback.test(v)) fallbackCount++;
    if (rxBad.test(v)) badCount++;
    if (rxVerse.test(v)) verseCount++;
  }

  // Vérif complet chapitres par langue
  const perLang = {};
  for (const l in T) {
    let total = 0;
    for (const b in T[l]) total += Object.keys(T[l][b]).length;
    perLang[l] = total;
  }

  console.log("OK — injected =", injected, "skipped =", skipped, "cleaned =", cleaned);
  console.log("AUDIT — fallbackCount =", fallbackCount, "badCount =", badCount, "verseCount =", verseCount);
  console.log("AUDIT — chapters per lang =", JSON.stringify(perLang));

  // Exemples rapides
  console.log("SAMPLE — ES Psalm 23:", T.ES["19"]["23"]);
  console.log("SAMPLE — FR Psalm 23:", T.FR["19"]["23"]);
  console.log("SAMPLE — EN Psalm 23:", T.EN["19"]["23"]);

  // Sortie non-zero si un problème persiste
  if (fallbackCount !== 0 || badCount !== 0 || verseCount !== 0) {
    console.error("FAIL — titres encore imparfaits. Corrige avant Google Play.");
    process.exit(2);
  }
  for (const l in perLang) {
    if (perLang[l] !== 1189) {
      console.error("FAIL — langue", l, "n'a pas 1189 chapitres:", perLang[l]);
      process.exit(3);
    }
  }

  console.log("PASS — prêts pour upload (titres OK).");
}

main();
