"use client";

import Image from "next/image";
import type { Card as CardType } from "@/lib/deck";
import { useMemo, useState } from "react";

type Props = {
  card: CardType;
  faceUp?: boolean;
  large?: boolean;
};

const suitSlug = {
  "♠": "spades",
  "♥": "hearts",
  "♦": "diamonds",
  "♣": "clubs",
} as const;

const isRed = (s: CardType["suit"]) => s === "♥" || s === "♦";

const rankSlug: Record<CardType["rank"], string> = {
  A: "ace",
  K: "king",
  Q: "queen",
  J: "jack",
  "10": "10",
  "9": "9",
  "8": "8",
  "7": "7",
  "6": "6",
  "5": "5",
  "4": "4",
  "3": "3",
  "2": "2",
};

export default function Card({ card, faceUp = true, large = false }: Props) {
  const [imgError, setImgError] = useState(false);

  // TS-safe: ikke bruk includes med union; bruk direkte sammenligning
  const isFace =
    card.rank === "J" ||
    card.rank === "Q" ||
    card.rank === "K" ||
    card.rank === "A";
  const useImage = useMemo(() => isFace && !imgError, [isFace, imgError]);

  const size = large ? "h-56 w-40 sm:h-64 sm:w-44" : "h-40 w-28";
  const suit = card.suit;
  const rank = card.rank;
  const colorClass = isRed(suit)
    ? "text-rose-600 dark:text-rose-400"
    : "text-zinc-900 dark:text-zinc-100";
  const asset = `/cards/custom/${rankSlug[rank]}_${suitSlug[suit]}.svg`; // legg SVG/PNG her

  return (
    <div className={`card-scene ${size}`}>
      <div
        className={`card-3d ${
          faceUp ? "" : "is-flipped"
        } relative h-full w-full`}
      >
        {/* FRONT */}
        <div className="card-face animate-pop-in absolute inset-0 select-none rounded-2xl border border-zinc-300/70 bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {useImage ? (
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image
                src={asset}
                alt={`${rank} of ${suitSlug[suit]}`}
                fill
                sizes="(max-width: 768px) 160px, 220px"
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            <PipLayout rank={rank} suit={suit} colorClass={colorClass} />
          )}
        </div>

        {/* BACK */}
        <div className="card-face card-back absolute inset-0 select-none rounded-2xl border border-zinc-300/70 bg-gradient-to-br from-indigo-600 to-fuchsia-600 shadow-lg dark:border-zinc-700">
          {/* Hvis du har fil: bruk denne */}
          {/* <Image src="/cards/classic/back.svg" alt="Back" fill /> */}
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-4xl font-bold text-white/90">MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Genererer pips for 2–10 og A (én pip midt) */
function PipLayout({
  rank,
  suit,
  colorClass,
}: {
  rank: CardType["rank"];
  suit: CardType["suit"];
  colorClass: string;
}) {
  const glyph = suit;
  const value = rank === "A" ? 1 : Number(rank);

  return (
    <div
      className={`flex h-full w-full flex-col justify-between ${colorClass}`}
    >
      {/* topp venstre */}
      <div className="flex items-start justify-between">
        <div className="text-xl font-bold leading-none">
          {rank}
          <div className="text-sm">{glyph}</div>
        </div>
        <div className="opacity-0">.</div>
      </div>

      {/* midt – pips */}
      <div className="flex items-center justify-center">
        {rank === "A" ? (
          <div className="text-5xl">{glyph}</div>
        ) : (
          <Pips count={value} glyph={glyph} />
        )}
      </div>

      {/* bunn høyre */}
      <div className="self-end rotate-180 text-xl font-bold leading-none">
        {rank}
        <div className="text-sm">{glyph}</div>
      </div>
    </div>
  );
}

/** Enkelt pip-mønster (5x3 grid) for 2–10 */
function Pips({ count, glyph }: { count: number; glyph: string }) {
  const map: Record<number, Array<[number, number]>> = {
    2: [
      [2, 2],
      [4, 2],
    ],
    3: [
      [2, 2],
      [3, 2],
      [4, 2],
    ],
    4: [
      [2, 1],
      [2, 3],
      [4, 1],
      [4, 3],
    ],
    5: [
      [2, 1],
      [2, 3],
      [3, 2],
      [4, 1],
      [4, 3],
    ],
    6: [
      [2, 1],
      [2, 3],
      [3, 1],
      [3, 3],
      [4, 1],
      [4, 3],
    ],
    7: [
      [2, 1],
      [2, 3],
      [3, 1],
      [3, 3],
      [3, 2],
      [4, 1],
      [4, 3],
    ],
    8: [
      [2, 1],
      [2, 3],
      [3, 1],
      [3, 3],
      [4, 1],
      [4, 3],
      [2, 2],
      [4, 2],
    ],
    9: [
      [2, 1],
      [2, 3],
      [3, 1],
      [3, 3],
      [4, 1],
      [4, 3],
      [2, 2],
      [3, 2],
      [4, 2],
    ],
    10: [
      [1, 2],
      [2, 1],
      [2, 3],
      [3, 1],
      [3, 3],
      [4, 1],
      [4, 3],
      [5, 2],
      [2, 2],
      [4, 2],
    ],
  };

  const positions = map[count] ?? [[3, 2]];
  return (
    <div className="grid h-28 w-20 grid-cols-3 grid-rows-5 place-items-center">
      {Array.from({ length: 15 }).map((_, i) => {
        const r = Math.floor(i / 3) + 1;
        const c = (i % 3) + 1;
        const show = positions.some(([rr, cc]) => rr === r && cc === c);
        return (
          <div key={i} className="text-2xl">
            {show ? glyph : ""}
          </div>
        );
      })}
    </div>
  );
}
