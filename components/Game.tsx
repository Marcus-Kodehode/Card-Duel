"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Card from "@/components/Card";
import { Card as TCard, createDeck, shuffle } from "@/lib/deck";

type Hand = {
  player?: TCard;
  opponent?: TCard;
  result?: "win" | "lose" | "draw";
};

const compare = (player: TCard, opponent: TCard): Hand => {
  if (player.value > opponent.value) return { player, opponent, result: "win" };
  if (player.value < opponent.value)
    return { player, opponent, result: "lose" };
  return { player, opponent, result: "draw" };
};

export default function Game() {
  const [deck, setDeck] = useState<TCard[]>([]);
  const [hand, setHand] = useState<Hand>({});
  const [score, setScore] = useState({ player: 0, opponent: 0, rounds: 0 });
  const [autoDraw, setAutoDraw] = useState(false);

  // liten lås for å hindre dobbelkall samme “frame”
  const dealingLock = useRef(false);

  const reset = useCallback(() => {
    setDeck(shuffle(createDeck()));
    setScore({ player: 0, opponent: 0, rounds: 0 });
    setHand({});
  }, []);

  const deal = useCallback(() => {
    if (dealingLock.current) return;
    dealingLock.current = true;
    // slippe låsen helt på slutten av event-loop
    setTimeout(() => (dealingLock.current = false), 0);

    setDeck((prev) => {
      const d = prev.length < 2 ? shuffle(createDeck()) : prev.slice();
      const p = d.shift()!;
      const o = d.shift()!;
      const res = compare(p, o);
      setHand(res);
      setScore((s) => ({
        player: s.player + (res.result === "win" ? 1 : 0),
        opponent: s.opponent + (res.result === "lose" ? 1 : 0),
        rounds: s.rounds + 1,
      }));
      return d;
    });
  }, []);

  useEffect(() => {
    reset();
  }, [reset]);

  // ✅ Bruk KEYUP, og ignorer når fokus er i knapp/lenke/input
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      const isEditable = el && (el as HTMLElement).isContentEditable;
      const insideButton = el?.closest("button, [role='button'], a");

      if (tag === "INPUT" || tag === "TEXTAREA" || isEditable || insideButton)
        return;

      if (e.code === "Space" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        deal();
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        reset();
      }
    };

    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, [deal, reset]);

  // Auto-deal (uendret)
  useEffect(() => {
    if (!autoDraw) return;
    const t = setInterval(() => deal(), 1100);
    return () => clearInterval(t);
  }, [autoDraw, deal]);

  const canDeal = deck.length >= 2;

  const status = useMemo(() => {
    if (!hand.result) return "Trykk DEAL for å trekke kort (Space/Enter)";
    if (hand.result === "win") return "Du vant runden! 🎉";
    if (hand.result === "lose") return "Motstanderen vant runden.";
    return "Uavgjort. Trekker på ny.";
  }, [hand.result]);

  return (
    <section className="rounded-3xl border border-emerald-900/40 bg-gradient-to-br from-emerald-900 to-emerald-800 p-5 shadow-xl ring-1 ring-emerald-700/50">
      {/* Panel top: score + controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-emerald-50">
          <Badge>Runder: {score.rounds}</Badge>
          <Badge>Deg: {score.player}</Badge>
          <Badge>Motstander: {score.opponent}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={deal}
            disabled={!canDeal}
            className="rounded-xl bg-amber-400 px-4 py-2 font-semibold text-amber-950 shadow hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
            title="Space/Enter"
          >
            DEAL
          </button>
          <button
            onClick={reset}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/90 backdrop-blur hover:bg-white/15"
            title="R for reset"
          >
            Reset
          </button>
          <label className="ml-2 inline-flex select-none items-center gap-2 text-sm text-emerald-50/80">
            <input
              type="checkbox"
              className="size-4 accent-amber-400"
              checked={autoDraw}
              onChange={(e) => setAutoDraw(e.target.checked)}
            />
            Auto-deal
          </label>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <BoardPanel title="Deg">
          <Card
            card={hand.player ?? placeholder("♠")}
            faceUp={!!hand.player}
            large
          />
        </BoardPanel>
        <BoardPanel title="Motstander">
          <Card
            card={hand.opponent ?? placeholder("♥")}
            faceUp={!!hand.opponent}
            large
          />
        </BoardPanel>
      </div>

      {/* Status */}
      <p className="mt-6 rounded-xl border border-white/15 bg-black/20 p-3 text-sm text-white/90 backdrop-blur">
        {status}
      </p>

      <p className="mt-2 text-xs text-emerald-50/80">
        Snarveier:{" "}
        <kbd className="rounded border border-white/20 bg-white/10 px-1">
          Space
        </kbd>
        /
        <kbd className="rounded border border-white/20 bg-white/10 px-1">
          Enter
        </kbd>{" "}
        = Deal,{" "}
        <kbd className="rounded border border-white/20 bg-white/10 px-1">R</kbd>{" "}
        = Reset
      </p>
    </section>
  );
}

function BoardPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/15 p-4 text-white/90 shadow-inner backdrop-blur">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">
        {title}
      </h2>
      <div className="flex items-center justify-center">{children}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-lg border border-white/20 bg-black/20 px-2.5 py-1 text-sm backdrop-blur">
      {children}
    </span>
  );
}

function placeholder(suit: "♠" | "♥" | "♦" | "♣") {
  return { id: `X${suit}`, suit, rank: "A", value: 14 } as TCard;
}
