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

function cleanLine(s) {
  if (!s) return null;
  s = String(s).replace(/\r/g, "").trim();

  s = s.replace(/^#+\s*/, "");
  s = s.replace(/\[(TITLE|LYRICS|STYLE)\]/gi, "").trim();
  s = s.replace(/^(TITRE|TITLE|T[IÍ]TULO|TITEL|TITOLO)\s*:\s*/i, "").trim();

  s = s.replace(/^\*+/, "").replace(/\*+$/, "").trim();

  // retirer tags type [Verse 1]
  s = s.replace(/^\[(verse|chorus|bridge|pre-chorus|refrain)\s*\d*\]\s*/i, "").trim();

  if (!s) return null;
  if (/^\[?lyrics\]?$/i.test(s)) return null;
  if (/^\[?title\]?$/i.test(s)) return null;
  if (/^\[?titre\]?$/i.test(s)) return null;
  if (/^#+$/.test(s)) return null;

  return s;
}

function extractBestTitleFromLyricsBlock(txt) {
  if (!txt) return null;
  const lines = String(txt).replace(/\r/g, "").split("\n").map(l => l.trim());

  // 1) après [TITLE]
  for (let i = 0; i < lines.length; i++) {
    if (/^\[title\]$/i.test(lines[i])) {
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const cand = cleanLine(lines[j]);
        if (cand && !/^verse\s*\d+[\s:.\-]*$/i.test(cand)) return cand;
      }
    }
  }

  // 2) ligne "Title: xxx"
  for (const ln of lines) {
    const m = ln.match(/^#+\s*(TITRE|TITLE)\s*:?\s*(.+)$/i);
    if (m) {
      const cand = cleanLine(m[2]);
      if (cand && !/^verse\s*\d+[\s:.\-]*$/i.test(cand)) return cand;
    }
  }

  // 3) première ligne utile après [LYRICS]
  for (let i = 0; i < lines.length; i++) {
    if (/^\[lyrics\]$/i.test(lines[i])) {
      for (let j = i + 1; j < Math.min(i + 80, lines.length); j++) {
        const cand = cleanLine(lines[j]);
        if (!cand) continue;
        if (/^(verse|chorus|bridge|pre-chorus|refrain)\s*\d*:?$/i.test(cand)) continue;
        if (/^verse\s*\d+[\s:.\-]*$/i.test(cand)) continue;
        return cand;
      }
    }
  }

  // 4) fallback ultime
  for (const ln of lines) {
    const cand = cleanLine(ln);
    if (cand && !/^verse\s*\d+[\s:.\-]*$/i.test(cand)) return cand;
  }

  return null;
}

function main() {
  const { ctFile, T } = loadChapterTitles();

  const lf = "lyrics/EN.json";
  if (!fs.existsSync(lf)) {
    console.error("FAIL — lyrics/EN.json introuvable.");
    process.exit(2);
  }
  const data = JSON.parse(fs.readFileSync(lf, "utf8"));

  const bookKeyByNum = {};
  for (const k of Object.keys(data)) {
    const bn = k.split("_")[0];
    if (bn) bookKeyByNum[bn] = k;
  }

  let fixedVerseOnly = 0;
  let cleanedSuffix = 0;
  let couldNot = 0;

  // ✅ accepte "Verse 1", "Verse 1:", "Verse 1 -", "Verse 1."
  const rxVerseOnly = /^verse\s*\d+[\s:.\-]*$/i;

  // ✅ enlève suffixes "- (verse 1)" "- verse 1:" "[verse 1]" etc.
  const rxTail = /\s*-\s*(?:\(|\[)?\s*verse\s*\d+\s*(?:\)|\])?\s*[:.\-]*\s*$/i;

  for (const b in T.EN) {
    for (const ch in T.EN[b]) {
      const before = String(T.EN[b][ch] ?? "").trim();

      const noSuffix = before.replace(rxTail, "").trim();
      if (noSuffix !== before) {
        T.EN[b][ch] = noSuffix;
        cleanedSuffix++;
      }

      const cur = String(T.EN[b][ch] ?? "").trim();

      if (rxVerseOnly.test(cur)) {
        const key = bookKeyByNum[b];
        if (!key || !data[key] || !data[key][ch]) { couldNot++; continue; }
        const title = extractBestTitleFromLyricsBlock(data[key][ch]);
        if (!title) { couldNot++; continue; }
        T.EN[b][ch] = title;
        fixedVerseOnly++;
      }
    }
  }

  fs.writeFileSync(ctFile, "window.CHAPTER_TITLES = " + JSON.stringify(T, null, 2) + ";", "utf8");

  let remaining = 0;
  const samples = [];
  for (const b in T.EN) for (const ch in T.EN[b]) {
    const v = String(T.EN[b][ch] ?? "");
    if (rxVerseOnly.test(v) || rxTail.test(v)) {
      remaining++;
      if (samples.length < 12) samples.push(["EN", b, ch, v]);
    }
  }

  console.log("OK — EN fixedVerseOnly =", fixedVerseOnly, "cleanedSuffix =", cleanedSuffix, "couldNot =", couldNot);
  console.log("AUDIT — EN remaining VerseX problems =", remaining);
  if (samples.length) {
    console.log("SAMPLES:");
    for (const s of samples) console.log("BAD", ...s);
  }
  if (remaining !== 0) process.exit(3);
}

main();
