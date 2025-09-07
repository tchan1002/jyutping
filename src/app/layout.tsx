export const metadata = {
  title: "JyutPing!",
  description: "Type Jyutping for Cantonese words — tones optional by default.",
  manifest: "/manifest.webmanifest",
  themeColor: "#111111",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JyutPing!",
  },
} as const;

export const viewport = {
  themeColor: "#111111",
  viewportFit: "cover",
} as const;

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <div className="max-w-3xl mx-auto p-4">{children}</div>
        {/* Desktop-only donation link */}
        <div className="hidden md:block fixed bottom-6 right-6 z-50">
          <a
            href="https://buymeacoffee.com/tchan0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-200/80 hover:bg-neutral-300/80 dark:bg-neutral-700/80 dark:hover:bg-neutral-600/80 text-neutral-700 dark:text-neutral-300 text-sm font-medium shadow-md backdrop-blur-sm transition-all duration-200 border border-neutral-300/50 dark:border-neutral-600/50"
          >
            <span>☕</span>
            <span>唔該晒</span>
          </a>
        </div>
      </body>
    </html>
  );
}
