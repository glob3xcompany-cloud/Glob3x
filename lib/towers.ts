/**
 * Floor-by-floor programme of both Reeds Towers, from the building-permit drawings. Areas in m² per floor.
 * Where the drawings give only a start and end area (stepped crowns, tower B residential), values are interpolated.
 */

export type EntityKey = "restaurant" | "residential" | "technical" | "hotel" | "office" | "ground" | "parking";

export type Floor = { n: number; kind: EntityKey; area: number };
export type TowerGeometry = { id: "A" | "B"; floors: Floor[]; parking: { levels: number; area: number } };

const lerp = (from: number, to: number, i: number, steps: number) => from + ((to - from) * i) / Math.max(1, steps - 1);

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
    return lerp(630.07, 41.14, n - 48, 7);
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
    if (n <= 29) return lerp(765.53, 571.22, n - 5, 25);
    return lerp(536.86, 82.46, n - 30, 6);
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

export const REEDS_TOWERS: Record<"A" | "B", TowerGeometry> = { A: towerA(), B: towerB() };
