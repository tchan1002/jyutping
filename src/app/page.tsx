"use client";
import Link from "next/link";
import Header from "@/app/components/Header";

export default function Home() {
  return (
    <main className="space-y-6">
      <Header />
      <section className="rounded-2xl p-6 shadow bg-white dark:bg-neutral-800">
        <h1 className="text-3xl font-bold">JyutPing!</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          A quick game: type the Jyutping for each Cantonese word. Tones are optional by default;
          turn on Strict Tones in Settings if you want to drill them.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/play?mode=practice"
            className="rounded-xl px-5 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          >
            Start Practice
          </Link>
          <Link
            href="/play?mode=timed"
            className="rounded-xl px-5 py-3 border border-neutral-300 dark:border-neutral-600"
          >
            Start Timed
          </Link>
        </div>
      </section>
    </main>
  );
}
