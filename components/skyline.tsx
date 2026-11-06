"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { formatNumber } from "@/lib/format";
import type { Elevation } from "@/lib/projects";
import { useInView } from "./motion/use-in-view";

export type SkylineTower = {
  slug: string;
  href: string;
  name: string;
  height: number;
  floors?: string;
  gfa?: number;
  kicker: string;
  elevation?: Elevation;
};

const W = 1000;
const H = 560;
const BASE = 420;
const SCALE = 1.95; // px per metre
const REF_HEIGHT = 32; // typical 10-storey Tirana block
const GRID = [50, 100, 150];

/**
 * Each tower is its own render, cropped to the building and drawn at one shared metric scale, so the
 * comparison stays readable as buildings rather than abstract blocks. `elevation` says where the
 * building sits inside the render; everything else follows from the real height in metres.
 */
function geometry(tower: SkylineTower, cx: number) {
  const h = tower.height * SCALE;
  const top = BASE - h;
  const e = tower.elevation;
  if (!e) return { h, top, w: 70, image: null };

  const imageH = h / (e.base - e.top);
  const imageW = imageH * (e.w / e.h);
  return {
    h,
    top,
    w: e.width * imageW,
    image: { x: cx - e.cx * imageW, y: top - e.top * imageH, width: imageW, height: imageH, src: e.src },
  };
}

export function Skyline({ towers, labels, locale }: { towers: SkylineTower[]; labels: { reference: string; height: string; floors: string; gfa: string }; locale: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const [active, setActive] = useState<string | null>(null);
  const uid = useId().replace(/:/g, "");
  const slot = W / (towers.length + 2);

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={towers.map((t) => `${t.name} ${t.height} m`).join(", ")}>
        <defs>
          {towers.map((t, i) => {
            const g = geometry(t, slot * (i + 1));
            return (
              <clipPath key={t.slug} id={`${uid}-${t.slug}`}>
                <rect
                  x={slot * (i + 1) - g.w / 2}
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
            <text x={0} y={BASE - hm * SCALE - 6} fontSize={12} className="fill-muted" fontFamily="var(--font-sans)">
              {hm} m
            </text>
          </g>
        ))}

        {towers.map((t, i) => {
          const cx = slot * (i + 1);
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
                {g.image ? (
                  <image
                    href={g.image.src}
                    x={g.image.x}
                    y={g.image.y}
                    width={g.image.width}
                    height={g.image.height}
                    clipPath={`url(#${uid}-${t.slug})`}
                    preserveAspectRatio="none"
                  />
                ) : (
                  <rect x={cx - g.w / 2} y={g.top} width={g.w} height={g.h} className="fill-ink" clipPath={`url(#${uid}-${t.slug})`} />
                )}
                <rect
                  x={cx - g.w / 2}
                  y={g.top}
                  width={g.w}
                  height={g.h}
                  fill="none"
                  strokeWidth={on ? 2 : 1}
                  className={on ? "stroke-blue" : "stroke-ink/25"}
                  style={{ opacity: inView ? 1 : 0, transition: `opacity 0.6s ${700 + i * 160}ms, stroke-width 0.3s` }}
                />
                <text
                  x={cx}
                  y={g.top - 14}
                  textAnchor="middle"
                  fontSize={22}
                  className="fill-ink"
                  fontFamily="var(--font-display)"
                  style={{ opacity: inView ? 1 : 0, transition: `opacity 0.6s ${800 + i * 160}ms` }}
                >
                  {formatNumber(locale, t.height)} m
                </text>
                <text x={cx} y={BASE + 26} textAnchor="middle" fontSize={14} fontWeight={600} className="fill-ink" fontFamily="var(--font-sans)">
                  {t.name}
                </text>
                {[t.floors && `${t.floors} ${labels.floors.toLowerCase()}`, t.gfa && `${formatNumber(locale, t.gfa, 0)} m²`].filter(Boolean).map((line, k) => (
                  <text key={line as string} x={cx} y={BASE + 46 + k * 18} textAnchor="middle" fontSize={11.5} className="fill-muted" fontFamily="var(--font-sans)">
                    {line}
                  </text>
                ))}
                <text x={cx} y={BASE + 84} textAnchor="middle" fontSize={11} className="fill-blue" fontFamily="var(--font-sans)">
                  {t.kicker}
                </text>
              </g>
            </Link>
          );
        })}

        {/* Reference building, so the metres mean something to the eye */}
        <g style={{ opacity: inView ? 1 : 0, transition: "opacity 0.8s 1s" }}>
          <rect x={W - 130} y={BASE - REF_HEIGHT * SCALE} width={52} height={REF_HEIGHT * SCALE} className="fill-paper-2 stroke-ink/40" />
          {Array.from({ length: 9 }, (_, k) => (
            <line key={k} x1={W - 130} x2={W - 78} y1={BASE - (REF_HEIGHT * SCALE * (k + 1)) / 10} y2={BASE - (REF_HEIGHT * SCALE * (k + 1)) / 10} className="stroke-ink/20" />
          ))}
          <text x={W - 104} y={BASE + 26} textAnchor="middle" fontSize={12} fontWeight={600} className="fill-muted" fontFamily="var(--font-sans)">
            {REF_HEIGHT} m
          </text>
          <text x={W} y={BASE + 46} textAnchor="end" fontSize={11} className="fill-muted" fontFamily="var(--font-sans)">
            {labels.reference}
          </text>
        </g>

        <line x1={0} x2={W} y1={BASE} y2={BASE} className="stroke-ink" strokeWidth={1.5} />
      </svg>
    </div>
  );
}
