"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

export default function AddToHome() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const mStandalone = window.matchMedia?.("(display-mode: standalone)").matches;
    const nav = window.navigator as Navigator & { standalone?: boolean };
    const nStandalone = typeof window !== "undefined" && nav.standalone === true;
    setIsStandalone(Boolean(mStandalone || nStandalone));
    setIsIOS(/iphone|ipad|ipod/i.test(window.navigator.userAgent));
    setIsMobile(/android|iphone|ipad|ipod/i.test(window.navigator.userAgent));

    const onBIP = (e: Event) => {
      e.preventDefault?.();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  async function onClick() {
    setMessage(null);
    if (deferred) {
      try {
        await deferred.prompt();
      } catch {}
      return;
    }
    if (isIOS) {
      const nav = window.navigator as Navigator & { share?: (data?: ShareData) => Promise<void> };
      if (nav.share) {
        try {
          await nav.share({ url: window.location.href });
          return;
        } catch {}
      }
      setMessage("On iPhone: Tap the Share button, then choose 'Add to Home Screen'.");
      return;
    }
    setMessage("Add to Home Screen is not available in this browser. Try Chrome or Safari.");
  }

  if (isStandalone || !isMobile) return null;

  return (
    <div className="mt-8 text-center text-sm text-neutral-500">
      <button
        type="button"
        onClick={onClick}
        className="underline underline-offset-4 hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        Add to Home Screen
      </button>
      {message && <div className="mt-2 text-xs text-neutral-500">{message}</div>}
    </div>
  );
}


