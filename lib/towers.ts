/**
 * Floor-by-floor programme of both towers, from the floor-plan sheets of the construction design
 * (sheet titles "PLANI I KATIT … Sip. …m2"). Areas in m² per floor plate.
 */

export type EntityKey = "restaurant" | "residential" | "technical" | "hotel" | "office" | "ground" | "parking";

export type Floor = { n: number; kind: EntityKey; area: number };
export type TowerGeometry = { id: "A" | "B"; floors: Floor[]; parking: { levels: number; area: number } };

const CROWN_A = [630.07, 551.09, 415.37, 238.09, 137.61, 75.46, 41.14];
const CROWN_B = [536.86, 409.66, 251.6, 157.05, 119.15, 82.46];

function towerA(): TowerGeometry {
  const area = (n: number) => {
    if (n <= 8) return 996.31;
    if (n === 9) return 982.03;
    if (n === 10) return 902.06;
    if (n <= 15) return 868.53;
    if (n <= 21) return 835.07;
    if (n <= 27) return 814.32;
    if (n <= 32) return 787.55;
    if (n <= 37) return 739.95;
    if (n <= 39) return 672.41;
    if (n <= 41) return 651.35;
    if (n <= 47) return 630.07;
    return CROWN_A[n - 48];
  };
  const kind = (n: number): EntityKey => {
    if (n === 0) return "ground";
    if (n <= 2) return "office";
    if (n <= 5) return "hotel";
    if (n === 15 || n === 34) return "technical";
    if (n <= 47) return "residential";
    return "restaurant";
  };
  return {
    id: "A",
    floors: Array.from({ length: 55 }, (_, n) => ({ n, kind: kind(n), area: area(n) })),
    parking: { levels: 5, area: 2515.3 },
  };
}

function towerB(): TowerGeometry {
  const area = (n: number) => {
    if (n <= 4) return 790.14;
    if (n <= 7) return 765.53;
    if (n <= 10) return 730.93;
    if (n <= 13) return 710.62;
    if (n <= 17) return 694.99;
    if (n <= 21) return 654.91;
    if (n <= 24) return 629.91;
    if (n <= 27) return 604.9;
    if (n <= 29) return 571.22;
    return CROWN_B[n - 30];
  };
  const kind = (n: number): EntityKey => {
    if (n === 0) return "ground";
    if (n <= 3) return "office";
    if (n === 15) return "technical";
    if (n <= 29) return "residential";
    return "restaurant";
  };
  return {
    id: "B",
    floors: Array.from({ length: 36 }, (_, n) => ({ n, kind: kind(n), area: area(n) })),
    parking: { levels: 5, area: 1476.1 },
  };
}

export const TOWERS: Record<"A" | "B", TowerGeometry> = { A: towerA(), B: towerB() };

/** Price per m² by floor band for residential units. Above floor 30 is priced on request. */
export const PRICE_BANDS = [
  { id: "low", maxFloor: 12, pricePerM2: 3800 },
  { id: "mid", maxFloor: 30, pricePerM2: 4200 },
] as const;

export const PAYMENT = { downPayment: 0.3, installments: 10, monthsBetween: 6 } as const;
