import groups from "./units.json";
import { PAYMENT, PRICE_BANDS } from "./towers";

/**
 * Residential units per floor, extracted from the residential plan sheets of the construction design.
 * `x`/`y` are the unit label positions in percent of the plan image; `n` numbers units clockwise.
 * `outline` is the unit's footprint in percent points of the plan image, `box` its bounds (x0, y0, x1, y1),
 * and `plan` a crop of the unit alone (`pw` × `ph` pixels, transparent outside the footprint).
 * Regenerate with C:\Glob3x-work\extract_units.py, segment_units.py --write and render_unit_plans.py.
 */
export type PlanUnit = {
  type: string;
  area: number;
  x: number;
  y: number;
  n: number;
  outline?: [number, number][];
  box?: [number, number, number, number];
  plan?: string;
  pw?: number;
  ph?: number;
};
export type PlanGroup = {
  tower: "A" | "B";
  sheet: number;
  floors: number[];
  floorArea: number;
  image: string;
  w: number;
  h: number;
  units: PlanUnit[];
};

export const PLAN_GROUPS = groups as PlanGroup[];

export function groupFor(tower: "A" | "B", floor: number) {
  return PLAN_GROUPS.find((g) => g.tower === tower && g.floors.includes(floor));
}

/** Residential floors of a tower, top to bottom. */
export function residentialFloors(tower: "A" | "B") {
  return PLAN_GROUPS.filter((g) => g.tower === tower)
    .flatMap((g) => g.floors.map((floor) => ({ floor, group: g })))
    .sort((a, b) => b.floor - a.floor);
}

export const unitCode = (tower: string, floor: number, n: number) => `${tower}-${String(floor).padStart(2, "0")}-${String(n).padStart(2, "0")}`;

/** Price per m² for a floor, or null when priced on request. */
export function pricePerM2(floor: number) {
  return PRICE_BANDS.find((b) => floor <= b.maxFloor)?.pricePerM2 ?? null;
}

export function paymentPlan(total: number) {
  const down = total * PAYMENT.downPayment;
  return { total, down, installment: (total - down) / PAYMENT.installments };
}

export const UNIT_COUNT = PLAN_GROUPS.reduce((sum, g) => sum + g.floors.length * g.units.length, 0);
