// tools/whisper_reformat_fr.js
// Reformate les paroles FR "collées" (type Whisper) dans lyrics/FR.json
// Usage:
//   node tools/whisper_reformat_fr.js --only "19:1,19:23,19:91,19:103,19:121,19:150,01:1"
//
// Par défaut, écrit un backup lyrics/FR.json.bak-<timestamp> puis met à jour lyrics/FR.json

const fs = require("fs");
const path = require("path");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeJsonPretty(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// --- Text utils ---
function normalizeSpaces(s) {
  return s
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Split into "sentences" based on punctuation.
// Whisper FR peut avoir peu de ponctuation : on coupe aussi sur " - " si très long.
function sentenceSplit(s) {
  const txt = normalizeSpaces(s).replace(/\n/g, " ");
  // Protect common abbreviations
  const protectedTxt = txt
    .replace(/\b(M|Mme|Dr|St|Ste|vs)\./g, (m) => m.replace(".", "§"));

  let parts = protectedTxt
    .split(/(?<=[.!?;:])\s+/)
    .map((p) => p.replace(/§/g, ".").trim())
    .filter(Boolean);

  // If Whisper has almost no punctuation, fallback chunking
  if (parts.length <= 2 && txt.length > 220) {
    // Cut on " - " or on commas every ~20 words
    const tmp = txt.split(/\s-\s/);
    parts = [];
    for (const chunk of tmp) {
      const words = chunk.trim().split(/\s+/).filter(Boolean);
      if (words.length <= 24) {
        parts.push(chunk.trim());
      } else {
        let acc = [];
        for (let i = 0; i < words.length; i++) {
          acc.push(words[i]);
          if (acc.length >= 18 && (words[i].endsWith(",") || acc.length >= 24)) {
            parts.push(acc.join(" ").trim().replace(/,$/, "."));
            acc = [];
          }
        }
        if (acc.length) parts.push(acc.join(" ").trim());
      }
    }
    parts = parts.map((p) => p.trim()).filter(Boolean);
  }

  return parts;
}

function wrapLine(s, width = 68) {
  const words = s.split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if (!cur) {
      cur = w;
    } else if ((cur + " " + w).length <= width) {
      cur += " " + w;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.join("\n");
}

function looksLikeBlockFormat(text) {
  return /^\s*\[(TITLE|LYRICS|STYLE)\]\s*$/im.test(text);
}

function extractBlocks(text) {
  // Returns { titleBlock?, lyricsBlock?, styleBlock?, rest? }
  const raw = text.replace(/\r\n/g, "\n");
  const lines = raw.split("\n");

  let cur = null;
  const blocks = { TITLE: [], LYRICS: [], STYLE: [], OTHER: [] };

  for (const ln of lines) {
    const m = ln.trim().match(/^\[(TITLE|LYRICS|STYLE)\]$/i);
    if (m) {
      cur = m[1].toUpperCase();
      continue;
    }
    if (!cur) blocks.OTHER.push(ln);
    else blocks[cur].push(ln);
  }

  const join = (arr) => normalizeSpaces(arr.join("\n"));
  return {
    titleBlock: join(blocks.TITLE),
    lyricsBlock: join(blocks.LYRICS),
    styleBlock: join(blocks.STYLE),
    other: join(blocks.OTHER),
  };
}

function rebuildWithBlocks(chTitle, lyricsText, styleText = "") {
  const out = [];
  out.push("[TITLE]");
  out.push(chTitle || "");
  out.push("");
  out.push("[LYRICS]");
  out.push(lyricsText || "");
  out.push("");
  out.push("[STYLE]");
  out.push(styleText || "");
  return out.join("\n").trim() + "\n";
}

function formatLyricsFromRaw(rawLyrics) {
  const parts = sentenceSplit(rawLyrics);

  // Grouping: add blank line every 3-4 "sentences" to simulate stanzas
  const stanza = [];
  let count = 0;
  for (const p of parts) {
    stanza.push(wrapLine(p, 68));
    count++;
    if (count % 4 === 0) stanza.push(""); // blank line
  }

  return normalizeSpaces(stanza.join("\n")).replace(/\n{3,}/g, "\n\n");
}

// --- CLI args ---
function parseOnlyArg(argv) {
  const idx = argv.indexOf("--only");
  if (idx === -1) return null;
  const raw = argv[idx + 1] || "";
  // format: "19:1,19:23,01:1"
  const pairs = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((p) => {
      const [b, c] = p.split(":").map((x) => x.trim());
      if (!b || !c) return null;
      return { book: String(Number(b)).padStart(2, '0'), chapter: String(Number(c)) };
    })
    .filter(Boolean);
  return pairs.length ? pairs : null;
}

function main() {
  const repoRoot = process.cwd();
  const lyricsPath = path.join(repoRoot, "lyrics", "FR.json");
  const titlesPath = path.join(repoRoot, "titles", "FR.json");

  if (!fs.existsSync(lyricsPath)) {
    console.error("Missing file:", lyricsPath);
    process.exit(1);
  }
  if (!fs.existsSync(titlesPath)) {
    console.error("Missing file:", titlesPath);
    process.exit(1);
  }

  const onlyPairs = parseOnlyArg(process.argv);

  const lyrics = readJson(lyricsPath);
  const titles = readJson(titlesPath);

  const backupPath = lyricsPath + ".bak-" + nowStamp();
  fs.copyFileSync(lyricsPath, backupPath);

  let changed = 0;
  let scanned = 0;
  const targets = [];

  if (onlyPairs) {
    for (const p of onlyPairs) targets.push(p);
  } else {
    // fallback: all books/chapters (not recommended)
    for (const b of Object.keys(lyrics)) {
      for (const c of Object.keys(lyrics[b] || {})) targets.push({ book: b, chapter: c });
    }
  }

  for (const { book, chapter } of targets) {
    if (!lyrics[book] || typeof lyrics[book][chapter] !== "string") continue;

    const original = lyrics[book][chapter];
    scanned++;

    const title =
      (titles?.[book]?.[chapter] && String(titles[book][chapter]).trim()) ||
      `Livre ${book} - Chapitre ${chapter}`;

    let blocks;
    let style = "";
    let lyricsRaw = original;

    if (looksLikeBlockFormat(original)) {
      blocks = extractBlocks(original);
      style = blocks.styleBlock || "";
      // If lyrics block is empty, fallback other
      lyricsRaw = blocks.lyricsBlock || blocks.other || "";
    } else {
      // no blocks: treat entire text as lyrics
      lyricsRaw = original;
    }

    const formattedLyrics = formatLyricsFromRaw(lyricsRaw);

    // Keep existing style if present; keep title from titles/FR.json (authoritative)
    const rebuilt = rebuildWithBlocks(title, formattedLyrics, style);

    if (rebuilt.trim() !== original.trim()) {
      lyrics[book][chapter] = rebuilt;
      changed++;
      console.log(`UPDATED ${book}:${chapter} (${title})`);
    } else {
      console.log(`SKIP ${book}:${chapter} (no diff)`);
    }
  }

  writeJsonPretty(lyricsPath, lyrics);

  console.log("");
  console.log("Done.");
  console.log("Scanned:", scanned);
  console.log("Changed:", changed);
  console.log("Backup :", backupPath);
}

main();
