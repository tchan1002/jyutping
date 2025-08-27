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
      </body>
    </html>
  );
}
