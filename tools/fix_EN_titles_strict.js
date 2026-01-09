const fs = require("fs");
const vm = require("vm");

function loadT() {
  const ctFile = "js/chapter-titles.js";
  const code = fs.readFileSync(ctFile, "utf8");
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return { ctFile, T: ctx.window.CHAPTER_TITLES };
}

function cleanLine(s) {
  if (!s) return null;
  s = String(s).replace(/\r/g, "").trim();

  s = s.replace(/^#+\s*/, "");
  s = s.replace(/\[(TITLE|LYRICS|STYLE)\]/gi, "").trim();
  s = s.replace(/^(TITRE|TITLE)\s*:\s*/i, "").trim();
  s = s.replace(/^\*+/, "").replace(/\*+$/, "").trim();

  // enlever tags en début de ligne: [Verse 1], [Chorus], etc.
  s = s.replace(/^\[(verse|chorus|bridge|pre-chorus|refrain)\s*\d*\]\s*/i, "").trim();

  if (!s) return null;
  if (/^\[?lyrics\]?$/i.test(s)) return null;
  if (/^\[?title\]?$/i.test(s)) return null;
  if (/^\[?titre\]?$/i.test(s)) return null;
  if (/^#+$/.test(s)) return null;

  return s;
}

const RX_SECTION_ONLY = /^\s*(?:\(|\[)?\s*(verse|chorus|bridge|pre-chorus|refrain)\s*\d*\s*(?:\)|\])?\s*:?\s*$/i;
const RX_TRAILING_VERSE = /\s*-\s*(?:\(|\[)?\s*verse\s*\d+\s*(?:\)|\])?\s*:?\s*$/i;

function extractBestTitleFromLyricsBlock(txt) {
  if (!txt) return null;
  const lines = String(txt).replace(/\r/g, "").split("\n").map(l => l.trim());

  // 1) après [TITLE]
  for (let i = 0; i < lines.length; i++) {
    if (/^\[title\]$/i.test(lines[i])) {
      for (let j = i + 1; j < Math.min(i + 12, lines.length); j++) {
        const cand = cleanLine(lines[j]);
        if (cand && !RX_SECTION_ONLY.test(cand) && !/^verse\s*\d+$/i.test(cand)) return cand;
      }
    }
  }

  // 2) "Title: xxx"
  for (const ln of lines) {
    const m = ln.match(/^#+\s*(TITRE|TITLE)\s*:?\s*(.+)$/i);
    if (m) {
      const cand = cleanLine(m[2]);
      if (cand && !RX_SECTION_ONLY.test(cand) && !/^verse\s*\d+$/i.test(cand)) return cand;
    }
  }

  // 3) première vraie ligne après [LYRICS]
  for (let i = 0; i < lines.length; i++) {
    if (/^\[lyrics\]$/i.test(lines[i])) {
      for (let j = i + 1; j < Math.min(i + 80, lines.length); j++) {
        let cand = cleanLine(lines[j]);
        if (!cand) continue;
        if (RX_SECTION_ONLY.test(cand)) continue;
        return cand;
      }
    }
  }

  // 4) fallback ultime : première ligne utile qui n'est pas un section marker
  for (const ln of lines) {
    const cand = cleanLine(ln);
    if (cand && !RX_SECTION_ONLY.test(cand)) return cand;
  }

  return null;
}

function main() {
  const { ctFile, T } = loadT();

  if (!T || !T.EN) {
    console.error("FAIL — CHAPTER_TITLES.EN introuvable.");
    process.exit(2);
  }

  const lf = "lyrics/EN.json";
  if (!fs.existsSync(lf)) {
    console.error("FAIL — lyrics/EN.json introuvable.");
    process.exit(2);
  }
  const data = JSON.parse(fs.readFileSync(lf, "utf8"));

  // map "01" -> "01_GEN", etc.
  const bookKeyByNum = {};
  for (const k of Object.keys(data)) {
    const bn = k.split("_")[0];
    if (bn) bookKeyByNum[bn] = k;
  }

  let cleanedTrailing = 0;
  let replacedBad = 0;
  let couldNot = 0;

  for (const b in T.EN) {
    for (const ch in T.EN[b]) {
      const before = String(T.EN[b][ch] ?? "").trim();

      // A) enlever suffixe " - Verse X" (toutes variantes)
      const noTrail = before.replace(RX_TRAILING_VERSE, "").trim();
      if (noTrail !== before) {
        T.EN[b][ch] = noTrail;
        cleanedTrailing++;
      }

      // B) si le titre est (verse 1) / Verse 1: / [verse 1] etc => remplacer depuis lyrics
      const cur = String(T.EN[b][ch] ?? "").trim();
      if (!cur || RX_SECTION_ONLY.test(cur) || /^verse\s*\d+\s*:?\s*$/i.test(cur) || /^\(\s*verse\s*\d+\s*\)\s*:?\s*$/i.test(cur)) {
        const key = bookKeyByNum[b];
        const block = key && data[key] ? data[key][ch] : null;
        const title = extractBestTitleFromLyricsBlock(block);
        if (title) {
          T.EN[b][ch] = title;
          replacedBad++;
        } else {
          couldNot++;
        }
      }
    }
  }

  fs.writeFileSync(ctFile, "window.CHAPTER_TITLES = " + JSON.stringify(T, null, 2) + ";", "utf8");

  // AUDIT EN: plus aucun VerseX restant (toutes variantes)
  let remaining = 0;
  const samples = [];
  for (const b in T.EN) for (const ch in T.EN[b]) {
    const v = String(T.EN[b][ch] ?? "").trim();
    if (RX_TRAILING_VERSE.test(v) || RX_SECTION_ONLY.test(v) || /^verse\s*\d+\s*:?\s*$/i.test(v) || /^\(\s*verse\s*\d+\s*\)\s*:?\s*$/i.test(v)) {
      remaining++;
      if (samples.length < 12) samples.push(["EN", b, ch, v]);
    }
  }

  console.log("OK — EN cleanedTrailing =", cleanedTrailing, "replacedBad =", replacedBad, "couldNot =", couldNot);
  console.log("AUDIT — EN remaining VerseX-like titles =", remaining);
  if (samples.length) {
    console.log("SAMPLES:");
    for (const s of samples) console.log("BAD", ...s);
  }
  if (remaining !== 0) process.exit(3);
}

main();
