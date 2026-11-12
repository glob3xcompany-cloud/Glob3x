"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { asset } from "@/lib/site";
import { groupFor, paymentPlan, PLAN_GROUPS, pricePerM2, residentialFloors, unitCode, type PlanGroup, type PlanUnit } from "@/lib/units";

export type UnitSelectorLabels = {
  tower: string;
  unitsLabel: string;
  chooseFloor: string;
  floor: string;
  plate: string;
  onFloor: string;
  prompt: string;
  steps: string[];
  planHint: string;
  selected: { plan: string; where: string; back: string; prev: string; next: string; enlarge: string; close: string; view: string };
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
const points = (outline: [number, number][], sy = 1) => outline.map(([x, y]) => `${x},${y * sy}`).join(" ");

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

const scrollBehavior = (): ScrollBehavior => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

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
  const [panelBelow, setPanelBelow] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const maskId = `focus-${useId().replace(/[^\w-]/g, "")}`;

  const floors = useMemo(() => residentialFloors(tower), [tower]);
  const group = groupFor(tower, floor)!;
  const units = useMemo(() => [...group.units].sort((a, b) => a.n - b.n), [group]);
  const unit = units.find((u) => u.n === unitN) ?? null;
  const rate = pricePerM2(floor);

  // On phones the unit panel sits below the plan; a bar offers the way down whenever it is out of sight.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPanelBelow(!e.isIntersecting && e.boundingClientRect.top > 0), {
      rootMargin: "0px 0px -20% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
  /** Bring the unit panel into view: always when it is off screen, and on phones also when it only peeks in at the bottom. */
  function revealPanel(force = false) {
    requestAnimationFrame(() => {
      const el = panelRef.current;
      if (!el) return;
      const { top, bottom } = el.getBoundingClientRect();
      const header = window.innerWidth >= 768 ? 80 : 64;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const hidden = wide ? bottom < header || top > window.innerHeight - 120 : top < header || top > window.innerHeight * 0.4;
      if (force || hidden) el.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    });
  }
  function pickUnit(n: number, reveal = true) {
    setUnitN(n);
    sync(tower, floor, n);
    if (reveal) revealPanel();
  }
  function step(dir: 1 | -1) {
    const i = units.findIndex((u) => u.n === unitN);
    pickUnit(units[(i + dir + units.length) % units.length].n, false);
  }
  function backToPlan() {
    planRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }

  const doneSteps = unit ? 3 : 2;

  return (
    <div className="grid grid-cols-1 gap-10">
      <ol className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
        {labels.steps.map((s, i) => {
          const done = i < doneSteps;
          const current = i === doneSteps;
          return (
            <li key={s} className={`flex items-center gap-2.5 ${done || current ? "text-ink" : "text-muted"}`}>
              <span
                className={`relative grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[0.6875rem] font-semibold tabular-nums ${
                  done ? "border-gold bg-gold text-ink" : current ? "border-ink bg-ink text-paper" : "border-line"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="m2.5 6.5 2.5 2.5 4.5-6" />
                  </svg>
                ) : (
                  i + 1
                )}
                {current && <span className="absolute inset-0 animate-ping rounded-full bg-ink/25" aria-hidden="true" />}
              </span>
              {s}
            </li>
          );
        })}
      </ol>

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
                className={`h-11 min-w-11 shrink-0 border text-sm tabular-nums transition-colors ${
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
        <div ref={planRef} className="min-w-0 scroll-mt-20 md:scroll-mt-24 lg:col-span-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
            <p className="font-display text-4xl">
              {labels.tower} {tower} · {labels.floor} {floor}
            </p>
            <p className="text-sm text-muted">
              {labels.plate} {m2(group.floorArea)} · {units.length} {labels.onFloor}
            </p>
          </div>
          <p
            className={`mt-4 flex items-center gap-2.5 text-sm transition-colors ${unit ? "text-muted" : "text-ink"}`}
            aria-hidden={unit ? "true" : undefined}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
              {!unit && <span className="absolute inset-0 animate-ping rounded-full bg-gold" />}
              <span className="relative h-2.5 w-2.5 rounded-full bg-gold" />
            </span>
            {labels.planHint}
          </p>
          <div className="relative mt-4 bg-white" style={{ aspectRatio: `${group.w} / ${group.h}` }}>
            <Image
              key={group.image}
              src={asset(group.image)}
              alt={`${labels.tower} ${tower} · ${labels.floor} ${floor}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="animate-[fade-in_.5s_ease-out] object-contain"
              priority
            />
            {/* Footprints: the whole flat is the tap target; the chosen one stays clear while the rest of the floor fades back. */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
              {unit?.outline && (
                <>
                  <defs>
                    <mask id={maskId}>
                      <rect width="100" height="100" fill="white" />
                      <polygon points={points(unit.outline)} fill="black" />
                    </mask>
                  </defs>
                  <rect
                    key={`${group.image}-${unit.n}`}
                    width="100"
                    height="100"
                    fill="white"
                    fillOpacity="0.62"
                    mask={`url(#${maskId})`}
                    className="pointer-events-none animate-[fade-in_.35s_ease-out]"
                  />
                </>
              )}
              {units.map((u) =>
                u.outline ? (
                  <polygon
                    key={`${group.image}-${u.n}`}
                    points={points(u.outline)}
                    onClick={() => pickUnit(u.n)}
                    onMouseEnter={() => setHovered(u.n)}
                    onMouseLeave={() => setHovered(null)}
                    fill="var(--color-gold)"
                    fillOpacity={u.n === unitN ? 0.14 : u.n === hovered ? 0.16 : 0}
                    stroke={u.n === unitN ? "var(--color-gold)" : u.n === hovered ? "var(--color-ink)" : "transparent"}
                    strokeWidth={u.n === unitN ? 3 : 1.5}
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className="cursor-pointer transition-[fill-opacity,stroke] duration-200"
                  />
                ) : null,
              )}
            </svg>
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

        {/* Selected unit: its own plan right next to (on phones right under) the floor plan, then price and payment plan */}
        <div className="grid min-w-0 content-start gap-8 lg:col-span-4">
          <div ref={panelRef} className="scroll-mt-20 md:scroll-mt-24" aria-live="polite">
            {unit ? (
              <UnitPanel
                key={`${tower}-${floor}-${unit.n}`}
                unit={unit}
                units={units}
                group={group}
                code={unitCode(tower, floor, unit.n)}
                tower={tower}
                floor={floor}
                rate={rate}
                labels={labels}
                contactHref={contactHref}
                onStep={step}
                onPick={(n) => pickUnit(n, false)}
                onBack={backToPlan}
              />
            ) : (
              <div className="bg-ink p-7 text-paper">
                <p className="font-display text-2xl leading-snug text-paper/70">{labels.prompt}</p>
              </div>
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
                  <td className="py-3">
                    <button onClick={() => pickUnit(u.n)} className="tabular-nums hover:text-gold">
                      {String(u.n).padStart(2, "0")}
                    </button>
                  </td>
                  <td className="py-3">{u.type}</td>
                  <td className="py-3 text-right tabular-nums">{m2(u.area)}</td>
                  <td className="py-3 text-right tabular-nums">{rate ? eur(u.area * rate) : labels.detail.onRequest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {unit && panelBelow && (
        <button
          onClick={() => revealPanel(true)}
          className="fixed inset-x-4 bottom-4 z-40 flex animate-[fade-in_.3s_ease-out] items-center justify-between gap-4 rounded-full bg-ink py-3 pr-4 pl-5 text-left text-paper shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] lg:hidden"
        >
          <span className="min-w-0 truncate text-sm tabular-nums">
            {unitCode(tower, floor, unit.n)} · {unit.type} · {m2(unit.area)}
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-gold uppercase">
            {labels.selected.view}
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6 1.5v9M2 6.5l4 4 4-4" />
            </svg>
          </span>
        </button>
      )}
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
      className="absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
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

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d={dir === "left" ? "M7.5 2 3.5 6l4 4" : "M4.5 2l4 4-4 4"} />
    </svg>
  );
}

function UnitPanel({
  unit,
  units,
  group,
  code,
  tower,
  floor,
  rate,
  labels,
  contactHref,
  onStep,
  onPick,
  onBack,
}: {
  unit: PlanUnit;
  units: PlanUnit[];
  group: PlanGroup;
  code: string;
  tower: TowerId;
  floor: number;
  rate: number | null;
  labels: UnitSelectorLabels;
  contactHref: string;
  onStep: (dir: 1 | -1) => void;
  onPick: (n: number) => void;
  onBack: () => void;
}) {
  const [zoom, setZoom] = useState(false);
  const plan = rate ? paymentPlan(unit.area * rate) : null;
  const q = new URLSearchParams({ unit: code, type: unit.type, area: unit.area.toFixed(1), tower, floor: String(floor) });
  const row = "flex items-baseline justify-between gap-4 border-t border-line-dark py-2.5 text-sm";
  const alt = `${labels.selected.plan} ${code} · ${unit.type} · ${m2(unit.area)}`;
  const ratio = group.h / group.w;
  const navButton = "grid h-11 w-11 place-items-center border border-line transition-colors hover:border-ink";

  return (
    <div className="animate-[fade-in_.4s_ease-out]">
      <div className="border border-line bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-line py-3 pr-3 pl-5">
          <div className="min-w-0">
            <p className="eyebrow text-muted">{labels.selected.plan}</p>
            <p className="font-display mt-1 text-3xl tabular-nums">{code}</p>
            <p className="mt-1 text-sm tabular-nums">
              {unit.type} · {m2(unit.area)} · <span className="font-semibold text-gold-2">{plan ? eur(plan.total) : labels.detail.onRequest}</span>
            </p>
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => onStep(-1)} aria-label={labels.selected.prev} title={labels.selected.prev} className={navButton}>
              <Chevron dir="left" />
            </button>
            <button onClick={() => onStep(1)} aria-label={labels.selected.next} title={labels.selected.next} className={navButton}>
              <Chevron dir="right" />
            </button>
          </div>
        </div>

        {unit.plan && unit.pw && unit.ph && (
          <button onClick={() => setZoom(true)} className="group relative block w-full cursor-zoom-in px-4 pt-4 pb-14" aria-label={`${labels.selected.enlarge}: ${alt}`}>
            <Image
              src={asset(unit.plan)}
              alt={alt}
              width={unit.pw}
              height={unit.ph}
              sizes="(min-width: 1024px) 30vw, 92vw"
              className="mx-auto h-auto max-h-[44vh] w-auto max-w-full animate-[fade-in_.4s_ease-out] object-contain lg:max-h-[58vh]"
            />
            <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[0.6875rem] font-semibold tracking-[0.12em] text-paper uppercase transition-colors group-hover:bg-gold group-hover:text-ink">
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M7 1.5h3.5V5M5 10.5H1.5V7M10.5 1.5 7 5M1.5 10.5 5 7" />
              </svg>
              {labels.selected.enlarge}
            </span>
          </button>
        )}

        <div className="flex items-center gap-4 border-t border-line px-5 py-3">
          {/* Where the flat sits on the floor; tapping a footprint switches to that flat. */}
          <svg viewBox={`0 0 100 ${100 * ratio}`} className="w-20 shrink-0" role="group" aria-label={labels.selected.where}>
            {units.map((u) =>
              u.outline ? (
                <polygon
                  key={u.n}
                  points={points(u.outline, ratio)}
                  onClick={() => onPick(u.n)}
                  fill={u.n === unit.n ? "var(--color-gold)" : "var(--color-paper-2)"}
                  stroke="white"
                  strokeWidth="0.8"
                  className="cursor-pointer"
                />
              ) : null,
            )}
          </svg>
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-muted">{labels.selected.where}</p>
            <p className="mt-1 text-sm">
              {labels.tower} {tower} · {labels.floor} {floor}
            </p>
          </div>
        </div>
        <div className="border-t border-line p-3 lg:hidden">
          <button
            onClick={onBack}
            className="inline-flex w-full items-center justify-center gap-2 border border-line py-3 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase transition-colors hover:border-ink"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M6 10.5v-9M2 5.5l4-4 4 4" />
            </svg>
            {labels.selected.back}
          </button>
        </div>
      </div>

      <div className="bg-ink p-7 text-paper">
        <p className="eyebrow text-gold">{labels.detail.type}</p>
        <p className="font-display mt-2 text-2xl">{labels.typologies[unit.type] ?? unit.type}</p>

        <dl className="mt-5">
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

      {zoom && unit.plan && unit.pw && unit.ph && (
        <Lightbox src={asset(unit.plan)} width={unit.pw} height={unit.ph} alt={alt} closeLabel={labels.selected.close} onClose={() => setZoom(false)} />
      )}
    </div>
  );
}

function Lightbox({
  src,
  width,
  height,
  alt,
  closeLabel,
  onClose,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  closeLabel: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex animate-[fade-in_.25s_ease-out] items-center justify-center bg-ink/92 p-3 md:p-8"
    >
      <div onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full overflow-auto bg-white p-3 md:p-5">
        {/* The original crop (≈1400 px, under 80 KB) so a pinch-zoom on the phone stays sharp. */}
        <Image src={src} alt={alt} width={width} height={height} unoptimized className="h-auto max-h-[86vh] w-auto max-w-full" />
      </div>
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute top-3 right-3 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-ink uppercase md:top-6 md:right-6"
      >
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="m2 2 8 8M10 2l-8 8" />
        </svg>
        {closeLabel}
      </button>
    </div>
  );
}
