import Game from "@/components/Game";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          High-Card Duel{" "}
          <span className="text-zinc-400">/ Høyeste kort vinner</span>
        </h1>
        {/* (Behold ThemeToggle hvis du vil) */}
      </header>
      <Game />
      <footer className="mt-10 text-sm text-zinc-500">
        Bygget med Next + TypeScript + Tailwind. Ingen bilder – kun semantikk og
        litt kjærlighet.
      </footer>
    </main>
  );
}
