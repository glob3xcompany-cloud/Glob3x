"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { type EntityKey, REEDS_TOWERS, type TowerGeometry } from "@/lib/towers";
import { useInView } from "./motion/use-in-view";

type EntityDict = { key: string; name: string; floors: string; area: string };
type TowerDict = { id: string; name: string; meta: string; entities: EntityDict[] };
type Labels = { floor: string; level: string; hint: string };

const COLOR: Record<EntityKey, { fill: string; swatch: string }> = {
  restaurant: { fill: "fill-gold", swatch: "bg-gold" },
  residential: { fill: "fill-ink", swatch: "bg-ink" },
  technical: { fill: "fill-[#c9c2b3]", swatch: "bg-[#c9c2b3]" },
  hotel: { fill: "fill-gold-2", swatch: "bg-gold-2" },
  office: { fill: "fill-[#6f6c66]", swatch: "bg-[#6f6c66]" },
  ground: { fill: "fill-[#a29d92]", swatch: "bg-[#a29d92]" },
  parking: { fill: "fill-paper stroke-ink/45", swatch: "border border-dashed border-ink/60" },
};

// Shared scale so both towers read at their true relative height.
const MAX_FLOORS = 55;
const FH = 7;
const TOP = 8;
const W = 280;
const CX = 160;
const BW = 150; // width of a 996.31 m² floor plate
const REF_AREA = 996.31;
const GROUND_Y = TOP + MAX_FLOORS * FH;
const H = GROUND_Y + 2 + 5 * FH + 6;

type Hover = { n: number; kind: EntityKey; area: number } | null;

function Section({ geo, name, active, inView, onHover }: { geo: TowerGeometry; name: string; active: EntityKey | null; inView: boolean; onHover: (h: Hover) => void }) {
  const dim = (k: EntityKey) => (active && active !== k ? 0.15 : 1);
  const grow = (delay: number) => ({
    transform: inView ? "scaleX(1)" : "scaleX(0)",
    transformBox: "fill-box" as const,
    transformOrigin: "center",
    transition: `transform 0.7s var(--ease-out-expo) ${delay}ms, opacity 0.3s`,
  });
  const parkW = Math.min(BW * Math.sqrt(geo.parking.area / REF_AREA), W - 40);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={name} onMouseLeave={() => onHover(null)}>
      {[0, 10, 20, 30, 40, 50].map((n) => (
        <g key={n}>
          <line x1={28} x2={36} y1={TOP + (MAX_FLOORS - 1 - n) * FH + FH / 2} y2={TOP + (MAX_FLOORS - 1 - n) * FH + FH / 2} className="stroke-ink/30" />
          <text x={24} y={TOP + (MAX_FLOORS - 1 - n) * FH + FH / 2 + 3.5} textAnchor="end" fontSize={9} className="fill-muted" fontFamily="var(--font-sans)">
            {n}
          </text>
        </g>
      ))}
      <line x1={32} x2={32} y1={TOP} y2={GROUND_Y} className="stroke-ink/15" />

      {geo.floors.map((f) => {
        const w = (BW * f.area) / REF_AREA;
        return (
          <rect
            key={f.n}
            x={CX - w / 2}
            y={TOP + (MAX_FLOORS - 1 - f.n) * FH}
            width={w}
            height={FH - 1.2}
            className={`${COLOR[f.kind].fill} cursor-pointer motion-reduce:transition-none`}
            style={{ ...grow(f.n * 14), opacity: dim(f.kind) }}
            onMouseEnter={() => onHover(f)}
            onClick={() => onHover(f)}
          />
        );
      })}

      <line x1={0} x2={W} y1={GROUND_Y + 1} y2={GROUND_Y + 1} className="stroke-ink" strokeWidth={1.25} />
      <text x={W} y={GROUND_Y - 3} textAnchor="end" fontSize={9} className="fill-muted" fontFamily="var(--font-sans)">
        ±0.00
      </text>

      {Array.from({ length: geo.parking.levels }, (_, i) => (
        <rect
          key={i}
          x={CX - parkW / 2}
          y={GROUND_Y + 2.5 + i * FH}
          width={parkW}
          height={FH - 1.2}
          strokeDasharray="3 2"
          className={`${COLOR.parking.fill} cursor-pointer motion-reduce:transition-none`}
          style={{ ...grow(0), opacity: dim("parking") }}
          onMouseEnter={() => onHover({ n: -(i + 1), kind: "parking", area: geo.parking.area })}
          onClick={() => onHover({ n: -(i + 1), kind: "parking", area: geo.parking.area })}
        />
      ))}
    </svg>
  );
}

function TowerCard({ tower, labels, locale }: { tower: TowerDict; labels: Labels; locale: string }) {
  const geo = REEDS_TOWERS[tower.id as "A" | "B"];
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const [hover, setHover] = useState<Hover>(null);
  const [pinned, setPinned] = useState<EntityKey | null>(null);
  const active = hover?.kind ?? pinned;
  const entityName = (k: EntityKey) => tower.entities.find((e) => e.key === k)?.name ?? k;

  const readout = hover
    ? `${hover.n < 0 ? labels.level : labels.floor} ${hover.n < 0 ? `−${-hover.n}` : hover.n} · ${entityName(hover.kind)} · ${formatNumber(locale, Math.round(hover.area), 0)} m²`
    : labels.hint;

  return (
    <div ref={ref} className="min-w-0">
      <div className="flex items-baseline justify-between gap-4 border-b border-ink/30 pb-3">
        <h3 className="font-display text-3xl md:text-4xl">{tower.name}</h3>
        <p className="text-right text-[0.75rem] tracking-[0.06em] text-muted">{tower.meta}</p>
      </div>

      <div className="mt-6 grid gap-8 sm:grid-cols-[minmax(0,16rem)_1fr]">
        <div>
          <Section geo={geo} name={tower.name} active={active} inView={inView} onHover={setHover} />
          <p className="mt-3 min-h-[2.5em] text-[0.75rem] leading-snug text-muted" aria-live="polite">
            {readout}
          </p>
        </div>

        <ul className="grid content-start">
          {tower.entities.map((e) => {
            const key = e.key as EntityKey;
            const on = active === key;
            return (
              <li key={e.key}>
                <button
                  type="button"
                  onMouseEnter={() => setPinned(key)}
                  onMouseLeave={() => setPinned(null)}
                  onFocus={() => setPinned(key)}
                  onBlur={() => setPinned(null)}
                  onClick={() => setPinned(on ? null : key)}
                  className={`grid w-full grid-cols-[0.875rem_1fr] gap-x-3 border-t border-line py-3 text-left transition-colors ${on ? "bg-ink/[0.04]" : ""}`}
                >
                  <span className={`mt-1.5 h-3 w-3.5 ${COLOR[key].swatch}`} aria-hidden="true" />
                  <span>
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="font-display text-xl leading-tight">{e.name}</span>
                      <span className="text-[0.6875rem] font-semibold tracking-[0.12em] text-muted uppercase">{e.floors}</span>
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] text-muted">{e.area}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Schematic sections of both Reeds towers at a shared scale; floor width is proportional to floor area. */
export function TowerSections({ towers, labels, locale }: { towers: TowerDict[]; labels: Labels; locale: string }) {
  return (
    <div className="grid gap-16 xl:grid-cols-2 xl:gap-12">
      {towers.map((t) => (
        <TowerCard key={t.id} tower={t} labels={labels} locale={locale} />
      ))}
    </div>
  );
}
