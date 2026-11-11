"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { formatNumber } from "@/lib/format";
import type { Massing } from "@/lib/projects";
import { useInView } from "./motion/use-in-view";

export type SkylineTower = {
  slug: string;
  href: string;
  name: string;
  height: number;
  floors?: string;
  gfa?: number;
  kicker: string;
  massing?: Massing;
};

const BASE = 420;
const SCALE = 1.95; // px per metre
const REF_HEIGHT = 32; // typical 10-storey Tirana block
const GRID = [50, 100, 150];

/**
 * The drawing is set twice: wide for tablets and desktop, narrow for phones, where a scaled-down wide
 * drawing would leave the figures unreadably small. Sizes are in drawing units.
 */
const LAYOUTS = {
  wide: { W: 1000, height: 22, grid: 12, tick: 2 },
  narrow: { W: 480, height: 26, grid: 15, tick: 3 },
} as const;
type Layout = (typeof LAYOUTS)[keyof typeof LAYOUTS];

/**
 * Each tower is a background-free miniature whose image box is the building itself, so its height in
 * metres is the only input: the width follows from the aspect ratio and every tower ends up at the
 * same metric scale, standing on the shared ground line.
 */
function geometry(tower: SkylineTower, cx: number) {
  const h = tower.height * SCALE;
  const top = BASE - h;
  const w = tower.massing ? h * (tower.massing.w / tower.massing.h) : 70;
  return { h, top, w, x: cx - w / 2, src: tower.massing?.src };
}

type ChartProps = {
  towers: SkylineTower[];
  layout: Layout;
  id: string;
  inView: boolean;
  active: string | null;
  setActive: (slug: string | null) => void;
  locale: string;
  className: string;
};

function Chart({ towers, layout, id, inView, active, setActive, locale, className }: ChartProps) {
  const { W } = layout;
  // One equal column per tower, matching the grid of names underneath.
  const slot = W / towers.length;
  const H = BASE + 4;
  const refY = BASE - REF_HEIGHT * SCALE;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`h-auto w-full ${className}`} role="img" aria-label={towers.map((t) => `${t.name} ${t.height} m`).join(", ")}>
      <defs>
        {towers.map((t, i) => {
          const g = geometry(t, slot * (i + 0.5));
          return (
            <clipPath key={t.slug} id={`${id}-${t.slug}`}>
              <rect
                x={g.x}
                y={g.top}
                width={g.w}
                height={g.h}
                style={{
                  transform: inView ? "scaleY(1)" : "scaleY(0)",
                  transformBox: "fill-box",
                  transformOrigin: "bottom",
                  transition: `transform 1.3s var(--ease-out-expo) ${i * 160}ms`,
                }}
              />
            </clipPath>
          );
        })}
      </defs>

      {GRID.map((hm) => (
        <g key={hm}>
          <line x1={0} x2={W} y1={BASE - hm * SCALE} y2={BASE - hm * SCALE} className="stroke-ink/10" strokeDasharray="4 6" />
          <text x={0} y={BASE - hm * SCALE - 6} fontSize={layout.grid} className="fill-muted" fontFamily="var(--font-sans)">
            {hm} m
          </text>
        </g>
      ))}

      {/* Reference height, explained in the key under the drawing. */}
      <g style={{ opacity: inView ? 1 : 0, transition: "opacity 0.8s 1s" }}>
        <line x1={0} x2={W} y1={refY} y2={refY} className="stroke-gold" strokeWidth={1.25} strokeDasharray="10 6" />
        <text x={0} y={refY - 6} fontSize={layout.grid} fontWeight={600} className="fill-gold-2" fontFamily="var(--font-sans)">
          {REF_HEIGHT} m
        </text>
      </g>

      {towers.map((t, i) => {
        const cx = slot * (i + 0.5);
        const g = geometry(t, cx);
        const on = active === t.slug;
        return (
          <Link key={t.slug} href={t.href} aria-label={t.name}>
            <g
              onMouseEnter={() => setActive(t.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(t.slug)}
              onBlur={() => setActive(null)}
              style={{ opacity: active && !on ? 0.45 : 1, transition: "opacity 0.35s" }}
              className="cursor-pointer"
            >
              {g.src ? (
                <image href={g.src} x={g.x} y={g.top} width={g.w} height={g.h} clipPath={`url(#${id}-${t.slug})`} preserveAspectRatio="none" />
              ) : (
                <rect x={g.x} y={g.top} width={g.w} height={g.h} className="fill-ink" clipPath={`url(#${id}-${t.slug})`} />
              )}
              {/* Footprint tick: marks where the miniature meets the ground line on hover. */}
              <line
                x1={g.x}
                x2={g.x + g.w}
                y1={BASE}
                y2={BASE}
                strokeWidth={on ? layout.tick + 1 : layout.tick}
                className={on ? "stroke-blue" : "stroke-ink/30"}
                style={{ opacity: inView ? 1 : 0, transition: `opacity 0.6s ${700 + i * 160}ms, stroke-width 0.3s` }}
              />
              <text
                x={cx}
                y={g.top - 14}
                textAnchor="middle"
                fontSize={layout.height}
                className="fill-ink"
                fontFamily="var(--font-display)"
                style={{ opacity: inView ? 1 : 0, transition: `opacity 0.6s ${800 + i * 160}ms` }}
              >
                {formatNumber(locale, t.height)} m
              </text>
            </g>
          </Link>
        );
      })}

      <line x1={0} x2={W} y1={BASE} y2={BASE} className="stroke-ink" strokeWidth={1.5} />
    </svg>
  );
}

export function Skyline({ towers, labels, locale }: { towers: SkylineTower[]; labels: { reference: string; height: string; floors: string; gfa: string }; locale: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const [active, setActive] = useState<string | null>(null);
  const uid = useId().replace(/:/g, "");
  const chart = { towers, inView, active, setActive, locale };

  return (
    <div ref={ref}>
      <Chart {...chart} layout={LAYOUTS.wide} id={`${uid}-w`} className="hidden md:block" />
      <Chart {...chart} layout={LAYOUTS.narrow} id={`${uid}-n`} className="md:hidden" />

      {/* Names and figures as text, one column per tower, so they stay legible at every screen size. */}
      <ul className="mt-5 grid gap-3 md:mt-6" style={{ gridTemplateColumns: `repeat(${towers.length}, minmax(0, 1fr))` }}>
        {towers.map((t) => {
          const on = active === t.slug;
          return (
            <li key={t.slug} className="text-center" style={{ opacity: active && !on ? 0.45 : 1, transition: "opacity 0.35s" }}>
              <Link
                href={t.href}
                onMouseEnter={() => setActive(t.slug)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(t.slug)}
                onBlur={() => setActive(null)}
                className="group block"
              >
                <span className={`block text-[0.8125rem] leading-snug font-semibold transition-colors md:text-sm ${on ? "text-blue" : "text-ink"} group-hover:text-blue`}>{t.name}</span>
                {t.floors ? (
                  <span className="mt-1 block text-[0.6875rem] leading-snug text-muted md:text-xs">
                    {t.floors} {labels.floors.toLowerCase()}
                  </span>
                ) : null}
                {t.gfa ? <span className="block text-[0.6875rem] leading-snug text-muted md:text-xs">{formatNumber(locale, t.gfa, 0)} m²</span> : null}
                <span className="mt-1.5 block text-[0.625rem] leading-snug text-blue md:text-[0.6875rem]">{t.kicker}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 flex items-center gap-3 border-t border-line pt-5 text-[0.75rem] text-muted">
        <svg viewBox="0 0 28 2" aria-hidden="true" className="h-0.5 w-7 shrink-0 overflow-visible">
          <line x1={0} x2={28} y1={1} y2={1} className="stroke-gold" strokeWidth={1.5} strokeDasharray="5 3" />
        </svg>
        <span>
          <span className="font-semibold text-gold-2">{REF_HEIGHT} m</span> · {labels.reference}
        </span>
      </p>
    </div>
  );
}
