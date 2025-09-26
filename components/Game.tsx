"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Card from "@/components/Card";
import { Card as TCard, createDeck, shuffle } from "@/lib/deck";

type Hand = {
  player?: TCard;
  opponent?: TCard;
  result?: "win" | "lose" | "draw";
};

type GamePhase = "waiting" | "dealing" | "revealing" | "celebrating";

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
  const [gamePhase, setGamePhase] = useState<GamePhase>("waiting");
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [winRate, setWinRate] = useState(0);

  const dealingLock = useRef(false);

  const reset = useCallback(() => {
    setDeck(shuffle(createDeck()));
    setScore({ player: 0, opponent: 0, rounds: 0 });
    setHand({});
    setStreak(0);
    setBestStreak(0);
    setWinRate(0);
    setGamePhase("waiting");
  }, []);

  const deal = useCallback(() => {
    if (dealingLock.current || gamePhase === "dealing") return;
    dealingLock.current = true;
    setGamePhase("dealing");

    setTimeout(() => {
      setDeck((prev) => {
        const d = prev.length < 2 ? shuffle(createDeck()) : prev.slice();
        const p = d.shift()!;
        const o = d.shift()!;
        const res = compare(p, o);

        setHand(res);
        setGamePhase("revealing");

        // CRITICAL: All updates in ONE callback to prevent double counting
        setTimeout(() => {
          if (!dealingLock.current) return; // Prevent double execution
          const isWin = res.result === "win";
          const isLose = res.result === "lose";

          setScore(prev => {
            const newScore = {
              player: prev.player + (isWin ? 1 : 0),
              opponent: prev.opponent + (isLose ? 1 : 0),
              rounds: prev.rounds + 1,
            };

            const rate = Math.round((newScore.player / newScore.rounds) * 100);
            setWinRate(rate);
            return newScore;
          });

          setStreak(prev => {
            const newStreak = isWin ? prev + 1 : 0;
            setBestStreak(current => Math.max(current, newStreak));
            return newStreak;
          });
          
          setGamePhase(isWin ? "celebrating" : "waiting");

          dealingLock.current = false;
        }, 1000);

        return d;
      });
    }, 600);
  }, [gamePhase, setScore, setStreak, setBestStreak, setWinRate, setGamePhase, setHand, setDeck]);

  useEffect(() => {
    reset();
  }, [reset]);

  // Keyboard controls
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

  const canDeal = deck.length >= 2 && gamePhase !== "dealing";

  const status = useMemo(() => {
    switch (gamePhase) {
      case "dealing":
        return "Dealing cards...";
      case "celebrating":
        return `You won! ${streak > 1 ? `Win streak: ${streak}!` : ""}`;
      case "revealing":
        if (hand.result === "win") return "You dominated this round!";
        if (hand.result === "lose") return "Opponent won this round";
        return "Draw - try again!";
      default:
        return streak > 0
          ? `Ready for next round? Win streak: ${streak}`
          : "Ready to duel? Press DEAL!";
    }
  }, [hand.result, gamePhase, streak]);

  return (
    <div className="relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10"></div>
      </div>

      <section className="relative rounded-3xl border border-emerald-900/40 bg-gradient-to-br from-emerald-900/95 to-emerald-800/95 backdrop-blur-sm p-6 shadow-2xl ring-1 ring-emerald-700/50">
        {/* Stats Panel */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Rounds" value={score.rounds} color="emerald" />
          <StatCard label="Wins" value={score.player} color="amber" />
          <StatCard label="Losses" value={score.opponent} color="red" />
          <StatCard label="Streak" value={streak} color="purple" />
          <StatCard label="Win Rate" value={`${winRate}%`} color="blue" />
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-emerald-50/80">
            <Badge>Cards left: {deck.length}</Badge>
            {bestStreak > 0 && (
              <Badge highlight>Best streak: {bestStreak}</Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={deal}
              disabled={!canDeal}
              className={`
                px-6 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-300
                ${
                  canDeal
                    ? "bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 hover:from-amber-500 hover:to-orange-500 hover:scale-105 active:scale-95"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }
                ${gamePhase === "dealing" ? "animate-pulse" : ""}
              `}
              title="Space/Enter"
            >
              {gamePhase === "dealing" ? "DEALING..." : "DEAL"}
            </button>

            <button
              onClick={reset}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/90 backdrop-blur hover:bg-white/15 transition-all duration-200"
              title="R for reset"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
          <BoardPanel
            title="Your Side"
            isWinner={hand.result === "win"}
            isLoser={hand.result === "lose"}
          >
            <Card
              card={hand.player ?? placeholder("♠")}
              faceUp={gamePhase !== "waiting"}
              large
              winner={hand.result === "win"}
              loser={hand.result === "lose"}
            />
          </BoardPanel>

          <BoardPanel
            title="Opponent"
            isWinner={hand.result === "lose"}
            isLoser={hand.result === "win"}
          >
            <Card
              card={hand.opponent ?? placeholder("♥")}
              faceUp={gamePhase !== "waiting"}
              large
              winner={hand.result === "lose"}
              loser={hand.result === "win"}
            />
          </BoardPanel>
        </div>

        {/* Status */}
        <div className="text-center mb-4">
          <div
            className={`
            inline-block rounded-2xl border backdrop-blur-sm px-6 py-4 transition-all duration-300
            ${
              gamePhase === "celebrating"
                ? "border-amber-400/50 bg-gradient-to-r from-amber-500/20 to-orange-500/20 animate-pulse"
                : "border-white/15 bg-black/20"
            }
          `}
          >
            <p className="text-lg font-medium text-white">{status}</p>
          </div>
        </div>

        {/* Keyboard shortcuts */}
        <p className="text-center text-xs text-emerald-50/60">
          Shortcuts: <Kbd>Space</Kbd> / <Kbd>Enter</Kbd> = Deal • <Kbd>R</Kbd> =
          Reset
        </p>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "emerald" | "amber" | "red" | "purple" | "blue";
}) {
  const colorClasses = {
    emerald:
      "from-emerald-500/20 to-emerald-600/20 border-emerald-400/30 text-emerald-300",
    amber:
      "from-amber-500/20 to-amber-600/20 border-amber-400/30 text-amber-300",
    red: "from-red-500/20 to-red-600/20 border-red-400/30 text-red-300",
    purple:
      "from-purple-500/20 to-purple-600/20 border-purple-400/30 text-purple-300",
    blue: "from-blue-500/20 to-blue-600/20 border-blue-400/30 text-blue-300",
  };

  return (
    <div
      className={`rounded-xl border bg-gradient-to-br backdrop-blur-sm p-3 text-center ${colorClasses[color]}`}
    >
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs opacity-80 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function BoardPanel({
  title,
  children,
  isWinner = false,
  isLoser = false,
}: {
  title: string;
  children: React.ReactNode;
  isWinner?: boolean;
  isLoser?: boolean;
}) {
  return (
    <div
      className={`
      rounded-2xl border p-4 text-white/90 shadow-inner backdrop-blur transition-all duration-500
      ${
        isWinner
          ? "border-amber-400/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10 shadow-amber-400/20"
          : isLoser
          ? "border-red-400/30 bg-gradient-to-br from-red-500/5 to-red-600/5"
          : "border-white/15 bg-black/15"
      }
    `}
    >
      <h2 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-white/70">
        {title}
        {isWinner && <span className="ml-2 text-amber-400">👑</span>}
      </h2>
      <div className="flex items-center justify-center">{children}</div>
    </div>
  );
}

function Badge({
  children,
  highlight = false,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <span
      className={`
      rounded-lg border px-2.5 py-1 text-sm backdrop-blur font-medium
      ${
        highlight
          ? "border-amber-400/50 bg-amber-500/20 text-amber-300"
          : "border-white/20 bg-black/20 text-emerald-50"
      }
    `}
    >
      {children}
    </span>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-white/30 bg-white/10 px-2 py-0.5 text-xs font-mono">
      {children}
    </kbd>
  );
}

function placeholder(suit: "♠" | "♥" | "♦" | "♣") {
  return { id: `empty_${suit}`, suit, rank: "2", value: 2 } as TCard;
}
