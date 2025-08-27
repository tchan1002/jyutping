"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import JyutExplainerModal from "@/app/components/JyutExplainerModal";

type HeaderProps = {
  controls?: {
    strict: boolean;
    setStrict: (v: boolean) => void;
    showGlossFirst: boolean;
    setShowGlossFirst: (v: boolean) => void;
    trainMode: boolean;
    setTrainMode: (v: boolean) => void;
  };
};

export default function Header({ controls }: HeaderProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Avoid SSR/CSR mismatch by deciding first-run on mount only
  useEffect(() => {
    try {
      const key = "jyutping:firstRun";
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        setOpen(true);
      }
    } catch {}
  }, []);

  // Auto-close settings after 5s when opened
  useEffect(() => {
    if (!settingsOpen) return;
    const id = setTimeout(() => setSettingsOpen(false), 5000);
    return () => clearTimeout(id);
  }, [settingsOpen]);

  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="text-xl font-semibold">
        JyutPing!
      </Link>
      <div className="flex items-center gap-2">
        {controls && (
          <details className="relative" open={settingsOpen} onToggle={(e) => setSettingsOpen((e.currentTarget as HTMLDetailsElement).open)}>
            <summary
              className="cursor-pointer rounded-xl border border-neutral-300 dark:border-neutral-600 px-3 py-1.5 text-sm"
            >
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
                Show gloss
              </label>
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={controls.trainMode}
                  onChange={(e) => controls.setTrainMode(e.target.checked)}
                />
                Show correct reading
              </label>
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
