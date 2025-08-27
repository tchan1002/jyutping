"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function AddToHome() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Detect platform / installed mode
  const isIOS =
    typeof navigator !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent);

  const isStandalone =
    typeof window !== "undefined" &&
    ((window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches) ||
      // iOS Safari
      (window.navigator as any).standalone === true);

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      // Stop Chrome from showing its mini-infobar
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as any);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt as any
      );
  }, []);

  async function onClick() {
    setMessage(null);

    // Android / desktop Chrome path
    if (deferred) {
      try {
        await deferred.prompt();
        const choice = (await deferred.userChoice?.catch(() => null)) ?? null;
        setDeferred(null); // can only use once

        if (choice && choice.outcome === "accepted") {
          setMessage("Installed to home screen.");
        } else {
          setMessage("Install dismissed.");
        }
      } catch {
        setMessage("Install prompt failed. Try again.");
      }
      return;
    }

    // iOS Safari: show manual instructions
    if (isIOS && !isStandalone) {
      setMessage("On iPhone/iPad: Tap the Share button, then “Add to Home Screen”.");
      return;
    }

    // Fallback (unsupported context)
    setMessage("Add to Home Screen is not available in this browser.");
  }

  // Don’t show if already installed
  if (isStandalone) return null;

  return (
    <div className="mt-8 text-center text-sm text-neutral-500">
      <button
        type="button"
        onClick={onClick}
        className="underline underline-offset-4 hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        Add to Home Screen
      </button>
      {message && (
        <div className="mt-2 text-xs text-neutral-500">{message}</div>
      )}
    </div>
  );
}
