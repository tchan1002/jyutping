"use client";

import { useEffect, useState } from "react";

/** Chrome/Edge PWA install event */
interface BeforeInstallPromptEvent extends Event {
  platforms?: string[];
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

/** iOS Safari exposes navigator.standalone (non-standard) */
type NavigatorWithStandalone = Navigator & { standalone?: boolean };

/** Web Share API */
type NavigatorWithShare = Navigator & { share?: (data: ShareData) => Promise<void> };

export default function AddToHome() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isIOS = /iphone|ipad|ipod/i.test(ua);

  const displayModeStandalone =
    typeof window !== "undefined" &&
    (window.matchMedia?.("(display-mode: standalone)").matches ?? false);

  const iOSStandalone =
    typeof navigator !== "undefined" &&
    ((navigator as NavigatorWithStandalone).standalone === true);

  const isStandalone = displayModeStandalone || iOSStandalone;

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      // Only handle if it looks like a BIP event
      if ("preventDefault" in e) {
        e.preventDefault();
      }
      // Type-narrow by feature check
      if ("prompt" in (e as BeforeInstallPromptEvent)) {
        setDeferred(e as BeforeInstallPromptEvent);
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  async function onClick() {
    setMessage(null);

    // Android / Desktop Chrome path
    if (deferred) {
      try {
        await deferred.prompt();
        const choice = (await deferred.userChoice?.catch(() => null)) ?? null;
        setDeferred(null); // one-shot

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

    // iOS Safari: manual instructions (optionally try share sheet if available)
    if (isIOS && !isStandalone) {
      const navWithShare = navigator as NavigatorWithShare;
      if (navWithShare.share) {
        try {
          await navWithShare.share({ url: window.location.href });
          return; // user saw share sheet
        } catch {
          /* ignore cancel */
        }
      }
      setMessage("On iPhone/iPad: Tap the Share button, then “Add to Home Screen”.");
      return;
    }

    // Fallback (unsupported)
    setMessage("Add to Home Screen is not available in this browser.");
  }

  // Don’t render if already installed
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
      {message && <div className="mt-2 text-xs text-neutral-500">{message}</div>}
    </div>
  );
}
