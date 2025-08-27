"use client";
import Link from "next/link";
import { useState } from "react";
import JyutExplainerModal from "./JyutExplainerModal";

type HeaderProps = {
  controls?: {
    strict: boolean;
    setStrict: (v: boolean) => void;
    showGlossFirst: boolean;
    setShowGlossFirst: (v: boolean) => void;
    timerLen: number;
    setTimerLen: (n: number) => void;
  };
};

export default function Header({ controls }: HeaderProps) {
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    if (!localStorage.getItem("jyutping:firstRun")) {
      localStorage.setItem("jyutping:firstRun", "1");
      return true;
    }
    return false;
  });

  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="text-xl font-semibold">
        JyutPing!
      </Link>
      <div className="flex items-center gap-2">
        {controls && (
          <details className="relative">
            <summary className="cursor-pointer rounded-xl border border-neutral-300 dark:border-neutral-600 px-3 py-1.5 text-sm">
              ⚙ Settings
            </summary>
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 shadow-lg">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={controls.strict}
                  onChange={(e) => controls.setStrict(e.target.checked)}
                />
                Require tones (Strict)
              </label>
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={controls.showGlossFirst}
                  onChange={(e) => controls.setShowGlossFirst(e.target.checked)}
                />
                Show gloss before answer
              </label>
              <div className="mt-2 text-sm">
                <div className="mb-1">Timer (timed mode):</div>
                <select
                  className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-transparent px-2 py-1"
                  value={controls.timerLen}
                  onChange={(e) => controls.setTimerLen(Number(e.target.value))}
                >
                  <option value={30}>30s</option>
                  <option value={60}>60s</option>
                  <option value={120}>120s</option>
                </select>
              </div>
            </div>
          </details>
        )}
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl border border-neutral-300 dark:border-neutral-600 px-3 py-1.5 text-sm"
        >
          ？ Jyutping
        </button>
      </div>
      <JyutExplainerModal open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
