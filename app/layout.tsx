import "./globals.css";
import Image from "next/image";

export const metadata = {
  title: "High-Card Duel",
  description:
    "Et enkelt, raskt og pent kortspill bygget med Next + TS + Tailwind.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" suppressHydrationWarning>
      <body className="min-h-dvh bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100 overflow-x-hidden">
        {/* Stor bakgrunnslogo */}
        <div className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0">
          <div className="relative w-[800px] h-[800px]">
            <Image
              src="/images/logo.png"
              alt="Card Duel Background"
              width={800}
              height={800}
              className="w-full h-full object-contain opacity-[0.03] dark:opacity-[0.04] rotate-12 transform scale-150"
              priority
            />
          </div>
        </div>

        {/* Header med logo */}
        <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-emerald-900/30 to-transparent z-50">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="w-32 h-16">
              <Image
                src="/images/logo.png"
                alt="Card Duel"
                width={128}
                height={64}
                className="w-full h-full object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </div>
        </div>

        {/* Hovedinnhold */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
