/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";

// Simple fetch wrapper without external deps
async function httpGet(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Fetch top N words from words.hk by frequency.
 * API docs: https://words.hk/api
 */
async function run() {
  const N = Number(process.env.LIMIT || 100);
  const url = `https://api.words.hk/v1/wordlist?order=freq&limit=${N}`;
  console.log("Fetching:", url);
  const data = await httpGet(url);

  // Expecting shape like: { result: [{ word, reading, ... }, ...] }
  const items = (data?.result || []).map((it: any) => {
    const hanzi = it?.word || "";
    // Try to get Jyutping candidates. (words.hk often has "jyutping" array.)
    const jyutArr: string[] =
      Array.isArray(it?.jyutping) && it.jyutping.length
        ? it.jyutping
        : Array.isArray(it?.reading)
        ? it.reading
        : it?.reading
        ? [it.reading]
        : [];

    const jyut = [
      // include raw (with tones)
      ...jyutArr,
      // and no-tone fallbacks
      ...jyutArr.map((x: string) => x.replace(/([a-z]+)[1-6]\b/gi, "$1"))
    ]
      .map((s) => s.toLowerCase().trim())
      .filter(Boolean);

    // brief gloss if available; otherwise empty
    const gloss = it?.eng || it?.explain || "";

    return { hanzi, jyut: Array.from(new Set(jyut)), gloss };
  });

  // Basic filter to keep things with both fields
  const clean = items.filter((x: any) => x.hanzi && x.jyut && x.jyut.length);

  const outPath = path.join(process.cwd(), "src", "data", "words.json");
  fs.writeFileSync(outPath, JSON.stringify(clean, null, 2), "utf8");
  console.log(`Saved ${clean.length} items to ${outPath}`);
}

run().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
