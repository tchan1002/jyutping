import { NextResponse } from "next/server";
import seed from "@/app/../data/words.json";

type WordItem = { hanzi: string; jyut: string[]; gloss: string };

function stripTones(s: string) {
  return s.replace(/([a-z]+)[1-6]\b/gi, "$1");
}

function cartesian<T>(arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>((acc, arr) => {
    if (acc.length === 0) return arr.map((x) => [x]);
    const out: T[][] = [];
    for (const prev of acc) {
      for (const x of arr) out.push([...prev, x]);
    }
    return out;
  }, []);
}

function expandJyutVariants(original: string): string[] {
  const parts = original.trim().split(/\s+/g);
  const optionsPerPart = parts.map((p) => (p.includes("|") ? p.split("|") : [p]));
  const combos = cartesian(optionsPerPart).map((syllables) => syllables.join(" "));
  const withNoTone = combos.flatMap((w) => [w, stripTones(w)]);
  // Deduplicate and normalize spacing
  return Array.from(new Set(withNoTone.map((s) => s.toLowerCase().trim().replace(/\s+/g, " "))));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const n = Math.max(1, Math.min(50, Number(searchParams.get("n") || 10)));
  const enriched = (seed as WordItem[]).map((w) => {
    const expanded = Array.from(
      new Set(
        (w.jyut || [])
          .flatMap((j) => expandJyutVariants(j))
          .map((s) => s.toLowerCase().trim())
      )
    );
    const gloss = /no\s*def/i.test(w.gloss) ? "" : (w.gloss || "");
    return { ...w, jyut: expanded, gloss };
  });
  const items = shuffle(enriched).slice(0, n);
  return NextResponse.json(items);
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
