"use client";

import Image from "next/image";
import type { Card as CardType } from "@/lib/deck";
import { useMemo, useState, useRef, useEffect } from "react";

type Props = {
  card: CardType;
  faceUp?: boolean;
  large?: boolean;
  winner?: boolean;
  loser?: boolean;
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

export default function Card({
  card,
  faceUp = true,
  large = false,
  winner = false,
  loser = false,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const [backImgError, setBackImgError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Always try to use custom images for face cards and aces
  const useImage = useMemo(() => ["J", "Q", "K", "A"].includes(card.rank) && !imgError, [card.rank, imgError]);

  const size = large ? "h-56 w-40 sm:h-64 sm:w-44" : "h-40 w-28";
  const suit = card.suit;
  const rank = card.rank;
  const colorClass = isRed(suit)
    ? "text-rose-500 dark:text-rose-400"
    : "text-slate-800 dark:text-slate-100";

  // English card naming convention
  const asset = `/images/cards/${rankSlug[rank]}_of_${suitSlug[suit]}.webp`;
  const backAsset = `/images/cards/card_back.webp`;

  useEffect(() => {
    if (winner || loser) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [winner, loser]);

  const cardClasses = `
    ${size} 
    transform-gpu transition-all duration-500 ease-out [perspective:1000px]
    ${
      winner
        ? "scale-110 z-10"
        : loser
        ? "scale-95 opacity-75"
        : "hover:scale-105"
    }
    ${faceUp ? "animate-pop-in" : ""}
    ${isAnimating && winner ? "animate-bounce" : ""}
    relative
  `;

  return (
    <div className="relative" ref={cardRef}>
      {winner && (
        <div className="absolute inset-0 scale-125 rounded-2xl bg-gradient-to-r from-amber-400/50 to-orange-400/50 blur-lg animate-pulse"></div>
      )}

      {loser && (
        <div className="absolute inset-0 scale-110 rounded-2xl bg-red-900/20 blur-sm"></div>
      )}

      <div className={`card-scene ${cardClasses}`}>
        <div
          className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
            faceUp ? "" : "rotate-y-180"
          }`}
        >
          {/* FRONT */}
          <div
            className={`
            card-face absolute inset-0 select-none rounded-2xl shadow-2xl transition-all duration-300 backface-hidden
            ${
              winner
                ? "border-2 border-amber-400/80 bg-gradient-to-br from-white via-amber-50/50 to-white dark:from-gray-800 dark:via-amber-900/20 dark:to-gray-800"
                : loser
                ? "border border-red-400/50 bg-gradient-to-br from-white via-red-50/30 to-white dark:from-gray-800 dark:via-red-900/10 dark:to-gray-800"
                : "border border-zinc-300/70 bg-gradient-to-br from-white to-gray-50 dark:border-zinc-700 dark:from-gray-800 dark:to-gray-900"
            }
          `}
          >
            <div className="absolute inset-0 rounded-2xl p-3">
              {useImage ? (
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  <Image
                    src={asset}
                    alt={`${rank} of ${suitSlug[suit]}`}
                    fill
                    sizes="(max-width: 768px) 160px, 220px"
                    onError={() => setImgError(true)}
                    className="object-contain"
                    priority={large}
                  />
                </div>
              ) : (
                <PipLayout rank={rank} suit={suit} colorClass={colorClass} />
              )}
            </div>
          </div>

          {/* BACK */}
          <div className="card-face absolute inset-0 select-none rounded-2xl shadow-2xl overflow-hidden backface-hidden rotate-y-180 bg-white">
            {!backImgError ? (
              <div className="relative h-full w-full">
                <Image
                  src={backAsset}
                  alt="Card back"
                  fill
                  className="object-contain rounded-2xl"
                  onError={() => setBackImgError(true)}
                  priority={large}
                />
              </div>
            ) : (
              <div className="absolute inset-0 border border-purple-400/30 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 rounded-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white/90 mb-2 animate-pulse">
                        HD
                      </div>
                      <div className="w-12 h-12 border-2 border-white/30 rounded-full animate-spin-slow mx-auto"></div>
                    </div>
                  </div>

                  <div className="absolute inset-2 rounded-xl border border-white/20"></div>
                  <div className="absolute top-4 left-4 w-4 h-4 border border-white/30 rounded-full"></div>
                  <div className="absolute top-4 right-4 w-4 h-4 border border-white/30 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-4 h-4 border border-white/30 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-4 h-4 border border-white/30 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {winner && isAnimating && (
        <div className="absolute -top-8 -right-8 text-3xl animate-bounce delay-100 pointer-events-none">
          🏆
        </div>
      )}
    </div>
  );
}

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
      <div className="flex items-start justify-between">
        <div className="text-xl font-bold leading-none">
          {rank}
          <div className="text-sm">{glyph}</div>
        </div>
        <div className="opacity-0">.</div>
      </div>

      <div className="flex items-center justify-center">
        {rank === "A" ? (
          <div className="text-5xl drop-shadow-sm">{glyph}</div>
        ) : (
          <Pips count={value} glyph={glyph} />
        )}
      </div>

      <div className="self-end rotate-180 text-xl font-bold leading-none">
        {rank}
        <div className="text-sm">{glyph}</div>
      </div>
    </div>
  );
}

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
        const show = positions.some(([rr, cc]) => r === rr && c === cc);
        return (
          <div key={i} className="text-2xl drop-shadow-sm">
            {show ? glyph : ""}
          </div>
        );
      })}
    </div>
  );
}
