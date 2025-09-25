"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "./Card";
import { Card as TCard, createDeck, shuffle } from "@/lib/deck";

type Hand = {
  player?: TCard;
  opponent?: TCard;
  result?: "win" | "lose" | "draw";
};

export default function Game() {
  const [deck, setDeck] = useState<TCard[]>([]);
  const [hand, setHand] = useState<Hand>({});
  const [score, setScore] = useState({ player: 0, opponent: 0, rounds: 0 });
  const [autoDraw, setAutoDraw] = useState(false);

  // init deck
  useEffect(() => {
    reset();
  }, []);

  // space/enter => draw
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        deal();
      } else if (e.key.toLowerCase() === "r") {
        reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deck]);

  // Auto-draw for litt “juice”
  useEffect(() => {
    if (!autoDraw) return;
    const t = setInterval(() => deal(), 1100);
    return () => clearInterval(t);
  }, [autoDraw, deck, score]);

  const canDeal = deck.length >= 2;

  function reset() {
    setDeck(shuffle(createDeck()));
    setScore({ player: 0, opponent: 0, rounds: 0 });
    setHand({});
  }

  function deal() {
    if (deck.length < 2) {
      // tomt / nesten tomt -> reshuffle
      setDeck(shuffle(createDeck()));
    }
    setDeck((prev) => {
      const d = prev.length < 2 ? shuffle(createDeck()) : prev.slice();
      const p = d.shift()!;
      const o = d.shift()!;
      const res: Hand = compare(p, o);
      setHand(res);
      setScore((s) => ({
        player: s.player + (res.result === "win" ? 1 : 0),
        opponent: s.opponent + (res.result === "lose" ? 1 : 0),
        rounds: s.rounds + 1,
      }));
      return d;
    });
  }

  function compare(player: TCard, opponent: TCard): Hand {
    if (player.value > opponent.value)
      return { player, opponent, result: "win" };
    if (player.value < opponent.value)
      return { player, opponent, result: "lose" };
    return { player, opponent, result: "draw" };
  }

  const status = useMemo(() => {
    if (!hand.result) return "Trykk DEAL for å trekke kort (Space/Enter)";
    if (hand.result === "win") return "Du vant runden! 🎉";
    if (hand.result === "lose") return "Motstanderen vant runden.";
    return "Uavgjort. Trekker på ny.";
  }, [hand.result]);

  return (
    <section className="rounded-2xl border border-zinc-200/60 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      {/* Scoreboard */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge>Runder: {score.rounds}</Badge>
          <Badge>Deg: {score.player}</Badge>
          <Badge>Motstander: {score.opponent}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={deal}
            disabled={!canDeal}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-white shadow hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
            title="Space/Enter"
          >
            DEAL
          </button>
          <button
            onClick={reset}
            className="rounded-xl border border-zinc-300/70 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            title="R for reset"
          >
            Reset
          </button>
          <label className="ml-2 inline-flex select-none items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <input
              type="checkbox"
              className="size-4 accent-zinc-900 dark:accent-zinc-100"
              checked={autoDraw}
              onChange={(e) => setAutoDraw(e.target.checked)}
            />
            Auto-deal
          </label>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Player */}
        <div className="rounded-2xl border border-zinc-200/60 p-4 dark:border-zinc-800">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Deg
          </h2>
          <div className="flex items-center gap-4">
            <Card
              card={hand.player ?? placeholder("♠")}
              faceUp={!!hand.player}
              large
            />
          </div>
        </div>

        {/* Opponent */}
        <div className="rounded-2xl border border-zinc-200/60 p-4 dark:border-zinc-800">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Motstander
          </h2>
          <div className="flex items-center gap-4">
            <Card
              card={hand.opponent ?? placeholder("♥")}
              faceUp={!!hand.opponent}
              large
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <p className="mt-6 rounded-xl border border-zinc-200/60 bg-zinc-50 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200">
        {status}
      </p>

      {/* Hintkeys */}
      <p className="mt-2 text-xs text-zinc-500">
        Tastatursnarveier: <kbd className="rounded border px-1">Space</kbd>/
        <kbd className="rounded border px-1">Enter</kbd> = Deal,{" "}
        <kbd className="rounded border px-1">R</kbd> = Reset
      </p>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-lg border border-zinc-300/70 bg-white px-2.5 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900">
      {children}
    </span>
  );
}

function placeholder(suit: "♠" | "♥" | "♦" | "♣") {
  return { id: `X${suit}`, suit, rank: "A", value: 14 } as TCard;
}
