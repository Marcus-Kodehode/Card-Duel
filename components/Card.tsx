"use client";

import type { Card as CardType } from "@/lib/deck";
import clsx from "clsx";

export default function Card({
  card,
  faceUp = true,
  large = false,
}: {
  card: CardType;
  faceUp?: boolean;
  large?: boolean;
}) {
  const red = card.suit === "♥" || card.suit === "♦";
  const size = large ? "h-44 w-32 sm:h-56 sm:w-40" : "h-32 w-24";

  return (
    <div
      aria-label={faceUp ? `${card.rank} ${card.suit}` : "Skjult kort"}
      className={clsx(
        size,
        "animate-pop-in select-none rounded-2xl border border-zinc-300/70 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900",
        !faceUp &&
          "bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700"
      )}
    >
      {faceUp && (
        <div
          className={clsx(
            "flex h-full w-full flex-col justify-between text-zinc-900 dark:text-zinc-100",
            red && "text-rose-600 dark:text-rose-400"
          )}
        >
          <div className="text-xl font-bold">{card.rank}</div>
          <div className="flex items-center justify-center text-4xl">
            {card.suit}
          </div>
          <div className="self-end text-xl font-bold">{card.rank}</div>
        </div>
      )}
    </div>
  );
}
