"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { asset } from "@/lib/site";
import { groupFor, paymentPlan, PLAN_GROUPS, pricePerM2, residentialFloors, unitCode, type PlanUnit } from "@/lib/units";

export type UnitSelectorLabels = {
  tower: string;
  unitsLabel: string;
  chooseFloor: string;
  floor: string;
  plate: string;
  onFloor: string;
  prompt: string;
  table: { nr: string; type: string; area: string; price: string };
  detail: {
    code: string;
    type: string;
    area: string;
    pricePerM2: string;
    total: string;
    down: string;
    installment: string;
    reserve: string;
    requestPrice: string;
    onRequest: string;
  };
  legend: { low: string; mid: string; request: string };
  typologies: Record<string, string>;
  note: string;
};

type TowerId = "A" | "B";

const MAX_PLATE = 996.31;
const eur = (v: number) => `€${Math.round(v).toLocaleString("en-US")}`;
const m2 = (v: number) => `${v.toFixed(1)} m²`;

/** Tone of a floor by price band: up to floor 12, floors 13–30, above 30 (on request). */
function band(floor: number) {
  const p = pricePerM2(floor);
  return p === 3800 ? "low" : p === 4200 ? "mid" : "request";
}
const BAND_BAR = { low: "bg-ink", mid: "bg-gold", request: "bg-[#c9c2b3]" } as const;

const towerUnitCount = (t: TowerId) =>
  PLAN_GROUPS.filter((g) => g.tower === t).reduce((s, g) => s + g.floors.length * g.units.length, 0);

function centerInStrip(el: HTMLElement | null) {
  const strip = el?.parentElement;
  if (el && strip) strip.scrollLeft = el.offsetLeft - strip.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2;
}

function parseInitial(params: URLSearchParams | null) {
  const code = params?.get("unit")?.match(/^([AB])-(\d{2})-(\d{2})$/);
  if (code && groupFor(code[1] as TowerId, Number(code[2]))) {
    return { tower: code[1] as TowerId, floor: Number(code[2]), unit: Number(code[3]) };
  }
  return { tower: "A" as TowerId, floor: 6, unit: null };
}

export function UnitSelector({ labels, contactHref }: { labels: UnitSelectorLabels; contactHref: string }) {
  const params = useSearchParams();
  const [initial] = useState(() => parseInitial(params));
  const [tower, setTower] = useState<TowerId>(initial.tower);
  const [floor, setFloor] = useState(initial.floor);
  const [unitN, setUnitN] = useState<number | null>(initial.unit);
  const [hovered, setHovered] = useState<number | null>(null);

  const floors = useMemo(() => residentialFloors(tower), [tower]);
  const group = groupFor(tower, floor)!;
  const units = useMemo(() => [...group.units].sort((a, b) => a.n - b.n), [group]);
  const unit = units.find((u) => u.n === unitN) ?? null;
  const rate = pricePerM2(floor);

  function sync(t: TowerId, f: number, n: number | null) {
    const q = n ? `?unit=${unitCode(t, f, n)}` : "";
    // window.location keeps the /reeds basePath; usePathname() strips it, and a stripped URL 404s when reloaded or shared.
    window.history.replaceState(null, "", `${window.location.pathname}${q}`);
  }
  function pickTower(t: TowerId) {
    const first = residentialFloors(t).at(-1)!.floor;
    setTower(t);
    setFloor(first);
    setUnitN(null);
    sync(t, first, null);
  }
  function pickFloor(f: number) {
    const next = groupFor(tower, f)!;
    const keep = unitN && next.units.some((u) => u.n === unitN) ? unitN : null;
    setFloor(f);
    setUnitN(keep);
    sync(tower, f, keep);
  }
  function pickUnit(n: number) {
    setUnitN(n);
    sync(tower, floor, n);
  }

  return (
    <div className="grid grid-cols-1 gap-10">
      {/* Tower tabs */}
      <div role="tablist" className="grid grid-cols-2 border border-line sm:inline-grid sm:w-max">
        {(["A", "B"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tower === t}
            onClick={() => pickTower(t)}
            className={`px-6 py-4 text-left transition-colors sm:min-w-56 ${tower === t ? "bg-ink text-paper" : "hover:bg-paper-2"}`}
          >
            <span className="font-display block text-2xl">
              {labels.tower} {t}
            </span>
            <span className={`text-[0.6875rem] tracking-[0.14em] uppercase ${tower === t ? "text-paper/60" : "text-muted"}`}>
              {towerUnitCount(t)} {labels.unitsLabel}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Floor picker: each bar is drawn to the width of its floor plate */}
        <div className="min-w-0 lg:col-span-2">
          <p className="eyebrow text-muted">{labels.chooseFloor}</p>
          <div className="mt-4 flex gap-1 overflow-x-auto pb-2 lg:hidden">
            {[...floors].reverse().map(({ floor: f }) => (
              <button
                key={f}
                ref={f === floor ? centerInStrip : undefined}
                onClick={() => pickFloor(f)}
                aria-pressed={f === floor}
                className={`h-10 min-w-10 shrink-0 border text-sm tabular-nums transition-colors ${
                  f === floor ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="mt-4 hidden lg:sticky lg:top-24 lg:grid lg:gap-[3px]">
            {floors.map(({ floor: f, group: g }) => {
              const active = f === floor;
              return (
                <button
                  key={f}
                  onClick={() => pickFloor(f)}
                  aria-pressed={active}
                  aria-label={`${labels.floor} ${f} · ${g.units.length} ${labels.unitsLabel}`}
                  className="group grid h-[13px] grid-cols-[1.5rem_1fr_1rem] items-center gap-2 text-[0.625rem] tabular-nums"
                >
                  <span className={`text-right ${active ? "font-semibold text-ink" : "text-muted"}`}>{f}</span>
                  <span className="flex justify-center">
                    <span
                      className={`block h-[11px] transition-all duration-300 ${BAND_BAR[band(f)]} ${
                        active ? "opacity-100 outline outline-2 outline-offset-1 outline-ink" : "opacity-45 group-hover:opacity-90"
                      }`}
                      style={{ width: `${(g.floorArea / MAX_PLATE) * 100}%` }}
                    />
                  </span>
                  <span className={`text-left ${active ? "text-ink" : "text-muted/70"}`}>{g.units.length}</span>
                </button>
              );
            })}
          </div>
          <ul className="mt-6 grid gap-2 text-[0.6875rem] text-muted">
            {(["low", "mid", "request"] as const).map((b) =>
              tower === "B" && b === "request" ? null : (
                <li key={b} className="flex items-center gap-2">
                  <span className={`h-2 w-4 ${BAND_BAR[b]}`} aria-hidden="true" />
                  {labels.legend[b]}
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Plan */}
        <div className="min-w-0 lg:col-span-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
            <p className="font-display text-4xl">
              {labels.tower} {tower} · {labels.floor} {floor}
            </p>
            <p className="text-sm text-muted">
              {labels.plate} {m2(group.floorArea)} · {units.length} {labels.onFloor}
            </p>
          </div>
          <div className="relative mt-6 bg-white" style={{ aspectRatio: `${group.w} / ${group.h}` }}>
            <Image
              key={group.image}
              src={asset(group.image)}
              alt={`${labels.tower} ${tower} · ${labels.floor} ${floor}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="animate-[fade-in_.5s_ease-out] object-contain"
              priority
            />
            {units.map((u) => (
              <Hotspot
                key={u.n}
                unit={u}
                active={u.n === unitN}
                hovered={u.n === hovered}
                onPick={() => pickUnit(u.n)}
                onHover={(on) => setHovered(on ? u.n : null)}
                label={`${unitCode(tower, floor, u.n)} · ${u.type} · ${m2(u.area)}`}
              />
            ))}
          </div>
          <p className="mt-4 text-[0.75rem] leading-relaxed text-muted">{labels.note}</p>
        </div>

        {/* Unit detail + list */}
        <div className="grid min-w-0 content-start gap-8 lg:col-span-4">
          <div className="min-h-[19rem] bg-ink p-7 text-paper" aria-live="polite">
            {unit ? (
              <UnitDetail unit={unit} code={unitCode(tower, floor, unit.n)} tower={tower} floor={floor} rate={rate} labels={labels} contactHref={contactHref} />
            ) : (
              <p className="font-display text-2xl leading-snug text-paper/70">{labels.prompt}</p>
            )}
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
                <th className="py-2 font-medium">{labels.table.nr}</th>
                <th className="py-2 font-medium">{labels.table.type}</th>
                <th className="py-2 text-right font-medium">{labels.table.area}</th>
                <th className="py-2 text-right font-medium">{labels.table.price}</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr
                  key={u.n}
                  onClick={() => pickUnit(u.n)}
                  onMouseEnter={() => setHovered(u.n)}
                  onMouseLeave={() => setHovered(null)}
                  className={`cursor-pointer border-b border-line transition-colors ${
                    u.n === unitN ? "bg-gold/15" : u.n === hovered ? "bg-paper-2" : ""
                  }`}
                >
                  <td className="py-2.5">
                    <button onClick={() => pickUnit(u.n)} className="tabular-nums hover:text-gold">
                      {String(u.n).padStart(2, "0")}
                    </button>
                  </td>
                  <td className="py-2.5">{u.type}</td>
                  <td className="py-2.5 text-right tabular-nums">{m2(u.area)}</td>
                  <td className="py-2.5 text-right tabular-nums">{rate ? eur(u.area * rate) : labels.detail.onRequest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Hotspot({
  unit,
  active,
  hovered,
  onPick,
  onHover,
  label,
}: {
  unit: PlanUnit;
  active: boolean;
  hovered: boolean;
  onPick: () => void;
  onHover: (on: boolean) => void;
  label: string;
}) {
  const two = unit.type.startsWith("2");
  return (
    <button
      onClick={onPick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center"
      style={{ left: `${unit.x}%`, top: `${unit.y}%` }}
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-full border-2 text-[0.625rem] font-semibold tabular-nums shadow-sm transition-all duration-200 md:h-8 md:w-8 md:text-[0.6875rem] ${
          active
            ? "scale-125 border-gold bg-gold text-ink"
            : hovered
              ? "scale-110 border-ink bg-ink text-paper"
              : two
                ? "border-ink bg-paper text-ink"
                : "border-gold bg-paper text-ink"
        }`}
      >
        {String(unit.n).padStart(2, "0")}
      </span>
      {active && <span className="absolute h-7 w-7 animate-ping rounded-full bg-gold/40 md:h-8 md:w-8" aria-hidden="true" />}
    </button>
  );
}

function UnitDetail({
  unit,
  code,
  tower,
  floor,
  rate,
  labels,
  contactHref,
}: {
  unit: PlanUnit;
  code: string;
  tower: TowerId;
  floor: number;
  rate: number | null;
  labels: UnitSelectorLabels;
  contactHref: string;
}) {
  const plan = rate ? paymentPlan(unit.area * rate) : null;
  const q = new URLSearchParams({ unit: code, type: unit.type, area: unit.area.toFixed(1), tower, floor: String(floor) });
  const row = "flex items-baseline justify-between gap-4 border-t border-line-dark py-2.5 text-sm";

  return (
    <div key={code} className="animate-[fade-in_.4s_ease-out]">
      <p className="eyebrow text-gold">{labels.detail.code}</p>
      <p className="font-display mt-2 text-4xl tabular-nums">{code}</p>
      <p className="mt-1 text-sm text-paper/60">{labels.typologies[unit.type] ?? unit.type}</p>

      <dl className="mt-6">
        <div className={row}>
          <dt className="text-paper/60">{labels.detail.area}</dt>
          <dd className="tabular-nums">{m2(unit.area)}</dd>
        </div>
        <div className={row}>
          <dt className="text-paper/60">{labels.detail.pricePerM2}</dt>
          <dd className="tabular-nums">{rate ? eur(rate) : labels.detail.onRequest}</dd>
        </div>
        {plan && (
          <>
            <div className={row}>
              <dt className="text-paper/60">{labels.detail.total}</dt>
              <dd className="font-display text-2xl text-gold tabular-nums">{eur(plan.total)}</dd>
            </div>
            <div className={row}>
              <dt className="text-paper/60">{labels.detail.down}</dt>
              <dd className="tabular-nums">{eur(plan.down)}</dd>
            </div>
            <div className={row}>
              <dt className="text-paper/60">{labels.detail.installment}</dt>
              <dd className="tabular-nums">10 × {eur(plan.installment)}</dd>
            </div>
          </>
        )}
      </dl>

      <Link
        href={`${contactHref}?${q}`}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3.5 text-[0.75rem] font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:bg-gold-2"
      >
        {plan ? labels.detail.reserve : labels.detail.requestPrice}
      </Link>
    </div>
  );
}
