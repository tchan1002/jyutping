import { NextResponse } from "next/server";
import seed from "@/app/../data/words.json";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const n = Math.max(1, Math.min(50, Number(searchParams.get("n") || 10)));
  const items = shuffle(seed as any[]).slice(0, n);
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
