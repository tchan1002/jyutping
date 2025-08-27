"use client";

export default function JyutExplainerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      style={{
        paddingTop: "calc(env(safe-area-inset-top) + 1rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)",
        minHeight: "100svh",
      }}
      onClick={onClose}
    >
      <div
        className="max-w-2xl w-[90vw] sm:w-full max-h-[80vh] sm:max-h-none overflow-auto rounded-2xl bg-white dark:bg-neutral-900 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">What is Jyutping?</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg px-3 py-1.5 border border-neutral-300 dark:border-neutral-700"
          >
            Close
          </button>
        </div>

        <div className="mt-3 space-y-3 text-sm leading-6">
          <p>
            Jyutping is a standard romanization for Cantonese. Each syllable has an initial (consonant),
            a final (vowel or vowel+ending), and an optional tone number (1–6). This game accepts answers
            <b> with or without</b> tone numbers by default; enable “Require tones (Strict)” in Settings to drill tones.
          </p>

          <div>
            <div className="font-medium">Initials</div>
            <div className="mt-1 grid grid-cols-5 gap-2">
              {["b p m f","d t n l","z c s","g k ng","h"].map((row,i)=>(
                <div key={i} className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2 text-center">{row}</div>
              ))}
            </div>
            <div className="mt-1 text-neutral-500 text-xs">
              z ≈ “j”, c ≈ “ch”; <code>ng</code> can start a syllable.
            </div>
          </div>

          <div>
            <div className="font-medium">Finals (examples)</div>
            <div className="mt-1 grid grid-cols-3 gap-2 text-center">
              {["a e i o u yu","ai au oi ui eo eu","-m -n -ng -p -t -k"].map((row,i)=>(
                <div key={i} className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">{row}</div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-medium">Tones</div>
            <div className="mt-1 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              {["si1","si2","si3","si4","si5","si6"].map((t,i)=>(
                <div key={i} className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">{t}</div>
              ))}
            </div>
            <div className="mt-1 text-neutral-500 text-xs">Type numbers 1–6 after each syllable (optional).</div>
          </div>

          <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800 p-3">
            <div className="font-medium">Typing Tips</div>
            <ul className="list-disc pl-5 mt-1">
              <li>Spaces optional: <code>neihou</code> = <code>nei hou</code>.</li>
              <li>Tones optional by default; Strict mode requires them.</li>
              <li>Either answer format works: <code>jam2caa4</code> or <code>jam2 caa4</code>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
