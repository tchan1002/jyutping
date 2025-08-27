"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/app/components/Header";
import { compareJyut, normalizeJyut } from "@/app/lib/jyut-normalize";

type WordItem = { hanzi: string; jyut: string[]; gloss: string };

export default function PlayPage() {
  // const mode = "practice" as const;
  const [words, setWords] = useState<WordItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [strict, setStrict] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("jyutping:settings");
    return saved ? JSON.parse(saved).strictTones === true : false;
  });
  const [showGlossFirst, setShowGlossFirst] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("jyutping:settings");
    return saved ? JSON.parse(saved).showGlossFirst === true : false;
  });
  // timed mode removed
  const [trainMode, setTrainMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("jyutping:settings");
    return saved ? JSON.parse(saved).trainMode === true : false;
  });

  // stats
  const [score, setScore] = useState(0);
  // const [attempts, setAttempts] = useState(0); // reserved for future stats
  const [streak, setStreak] = useState(0);
  // removed timed end state
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [missedCurrent, setMissedCurrent] = useState(false);
  const [missCounts, setMissCounts] = useState<Record<string, number>>({});

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/words?n=1000`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: WordItem[]) => setWords(data))
      .catch(() => setWords([]));
  }, []);

  useEffect(() => {
    // persist changed settings
    const s = { strictTones: strict, showGlossFirst, trainMode };
    localStorage.setItem("jyutping:settings", JSON.stringify(s));
  }, [strict, showGlossFirst, trainMode]);

  // timed mode removed

  const current = words[idx];

  function nextItem() {
    const prevIndex = idx;
    const prevWord = words[prevIndex];
    if (missedCurrent && prevWord) {
      const key = prevWord.hanzi;
      const misses = missCounts[key] || 1;
      const offset = Math.max(1, 4 - Math.min(misses, 3)); // reappear sooner with more misses
      setWords((arr) => {
        const copy = [...arr];
        const insertAt = Math.min(prevIndex + offset, copy.length);
        copy.splice(insertAt, 0, prevWord);
        return copy;
      });
    }
    setIdx((i) => (i + 1) % (words.length || 1));
    setInput("");
    setShowHint(false);
    setMissedCurrent(false);
    inputRef.current?.focus();
  }

  function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!current) return;
    const user = input.trim();
    const correct = current.jyut.some((gold) => compareJyut(user, gold, strict));
    // setAttempts((a) => a + 1);
    if (correct) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      setFlash("ok");
      setTimeout(() => setFlash(null), 120);
      nextItem();
    } else {
      setStreak(0);
      setMissedCurrent(true);
      setMissCounts((m) => ({ ...m, [current.hanzi]: (m[current.hanzi] || 0) + 1 }));
      setFlash("bad");
      setTimeout(() => setFlash(null), 180);
    }
  }

  function onSkip() {
    // setAttempts((a) => a + 1);
    setStreak(0);
    if (current) {
      setMissedCurrent(true);
      setMissCounts((m) => ({ ...m, [current.hanzi]: (m[current.hanzi] || 0) + 1 }));
    }
    nextItem();
  }

  // accuracy removed from UI, can compute later if needed

  if (!current) {
    return (
      <main className="space-y-6">
        <Header />
        <div className="rounded-2xl p-6 shadow bg-white dark:bg-neutral-800">Loading words…</div>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <Header
        controls={{
          strict,
          setStrict,
          showGlossFirst,
          setShowGlossFirst,
          trainMode,
          setTrainMode,
        }}
      />
      <section
        className={`rounded-2xl p-6 shadow bg-white dark:bg-neutral-800 transition ${
          flash === "ok" ? "ring-4 ring-emerald-400" : flash === "bad" ? "ring-4 ring-rose-400" : ""
        }`}
      >
        <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
          <span className="uppercase tracking-wide">Practice</span>
          <div className="flex items-center gap-3">
            <span>Score: <b>{score}</b></span>
            <span>Streak: <b>{streak}</b></span>
            
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-5xl sm:text-6xl font-extrabold tracking-tight">{current.hanzi}</div>
          {showGlossFirst && current.gloss && (
            <div className="mt-2 text-neutral-600 dark:text-neutral-300">{current.gloss}</div>
          )}
        </div>

        <form className="mt-6 flex flex-col sm:flex-row gap-3" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            autoFocus
            className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900 px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            placeholder={strict ? "Type Jyutping with tones (e.g., nei5 hou2)" : "Type Jyutping (tones optional)"}
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            enterKeyHint="send"
            // Prevent iOS from auto-scrolling the page when focusing the input
            style={{ scrollMarginTop: "20vh" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-xl px-5 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-xl px-5 py-3 border border-neutral-300 dark:border-neutral-600"
          >
            Skip
          </button>
        </form>

        {/* Gloss now only shows in the main word block when toggled on */}

        <div className="mt-3 text-sm">
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-2 py-1"
            aria-expanded={showHint}
          >
            {showHint ? "Hide hint" : "Show hint"}
          </button>
          {(showHint || trainMode) && (
            <div className="mt-2">
              <span className="font-medium">Correct readings:</span>{" "}
              <code className="rounded bg-neutral-100 dark:bg-neutral-700 px-2 py-1">
                {current.jyut
                  .map((j) => normalizeJyut(j, strict ? true : false))
                  .join(" · ")}
              </code>
              {!strict && (
                <span className="ml-2 text-neutral-500">
                  (tones optional; enable Strict in Settings)
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}