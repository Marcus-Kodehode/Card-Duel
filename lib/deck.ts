export type Suit = "♠" | "♥" | "♦" | "♣";
export type Rank =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "10"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

export type Card = {
  id: string; // unik nøkkel
  suit: Suit;
  rank: Rank;
  value: number; // brukes til sammenligning
};

const ranks: Rank[] = [
  "A",
  "K",
  "Q",
  "J",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];
const suits: Suit[] = ["♠", "♥", "♦", "♣"];

const valueMap: Record<Rank, number> = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  "10": 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
};

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const s of suits) {
    for (const r of ranks) {
      deck.push({
        id: `${r}${s}`,
        suit: s,
        rank: r,
        value: valueMap[r],
      });
    }
  }
  return deck;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
