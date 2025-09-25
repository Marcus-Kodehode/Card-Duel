import Game from "@/components/Game";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          High-Card Duel <span className="text-zinc-400">/ Høyeste kort vinner</span>
        </h1>
        <ThemeToggle />
      </header>

      <Game />

      <footer className="mt-10 text-sm text-zinc-500">
        Bygget med Next + TypeScript + Tailwind. Ingen bilder – kun semantikk og litt kjærlighet.
      </footer>
    </main>
  );
}

/** Enkel mørk/lys-modus – slår 'dark' på <html> */
function ThemeToggle() {
  // client-side only
  if (typeof window === "undefined") return null;

  const isDark = () => document.documentElement.classList.contains("dark");
  const toggle = () => {
    document.documentElement.classList.toggle("dark", !isDark());
    localStorage.setItem("theme", !isDark() ? "dark" : "light");
  };

  // init from localStorage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme");
    if (saved) document.documentElement.classList.toggle("dark", saved === "dark");
  }

  return (
    <button
      onClick={toggle}
      className="rounded-xl border border-zinc-300/60 px-3 py-2 text-sm shadow-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
      title="Bytt tema"
    >
      {typeof window !== "undefined" && isDark() ? "🌙 Mørk" : "☀️ Lys"}
    </button>
  );
}
