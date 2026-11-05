"use client";

import Link from "next/link";
import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { useInView } from "./motion/use-in-view";

export type SkylineTower = {
  slug: string;
  href: string;
  name: string;
  height: number;
  floors?: string;
  gfa?: number;
  kicker: string;
};

const W = 1000;
const H = 460;
const BASE = 400;
const SCALE = 1.8; // px per metre
const REF_HEIGHT = 32; // typical 10-storey building

/** Height comparison of the towers at a shared scale, with a reference building for the human eye. */
export function Skyline({ towers, labels, locale }: { towers: SkylineTower[]; labels: { reference: string; height: string; floors: string; gfa: string }; locale: string }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const [active, setActive] = useState<string | null>(null);
  const slot = W / (towers.length + 1);

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={towers.map((t) => `${t.name} ${t.height} m`).join(", ")}>
        {[50, 100, 150].map((hm) => (
          <g key={hm}>
            <line x1={0} x2={W} y1={BASE - hm * SCALE} y2={BASE - hm * SCALE} className="stroke-ink/10" strokeDasharray="4 6" />
            <text x={0} y={BASE - hm * SCALE - 6} fontSize={12} className="fill-muted" fontFamily="var(--font-sans)">
              {hm} m
            </text>
          </g>
        ))}

        {towers.map((t, i) => {
          const cx = slot * (i + 1);
          const h = t.height * SCALE;
          const w = Math.max(54, Math.min(120, 40 + (t.gfa ?? 30000) / 900));
          const on = active === t.slug;
          const dim = active && !on ? 0.3 : 1;
          return (
            <Link key={t.slug} href={t.href} aria-label={t.name}>
              <g
                onMouseEnter={() => setActive(t.slug)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(t.slug)}
                onBlur={() => setActive(null)}
                style={{ opacity: dim, transition: "opacity 0.3s" }}
                className="cursor-pointer"
              >
                <rect
                  x={cx - w / 2}
                  y={BASE - h}
                  width={w}
                  height={h}
                  className={on ? "fill-blue" : "fill-ink"}
                  style={{
                    transform: inView ? "scaleY(1)" : "scaleY(0)",
                    transformBox: "fill-box",
                    transformOrigin: "bottom",
                    transition: `transform 1.2s var(--ease-out-expo) ${i * 160}ms, fill 0.3s`,
                  }}
                />
                {/* window texture */}
                {Array.from({ length: Math.floor(h / 14) - 1 }, (_, k) => (
                  <line key={k} x1={cx - w / 2 + 6} x2={cx + w / 2 - 6} y1={BASE - 14 * (k + 1)} y2={BASE - 14 * (k + 1)} className="stroke-paper/25" style={{ opacity: inView ? 1 : 0, transition: `opacity 0.6s ${600 + i * 160}ms` }} />
                ))}
                <text x={cx} y={BASE - h - 14} textAnchor="middle" fontSize={22} className="fill-ink" fontFamily="var(--font-display)" style={{ opacity: inView ? 1 : 0, transition: `opacity 0.6s ${800 + i * 160}ms` }}>
                  {formatNumber(locale, t.height)} m
                </text>
                <text x={cx} y={BASE + 24} textAnchor="middle" fontSize={13} fontWeight={600} className="fill-ink" fontFamily="var(--font-sans)">
                  {t.name}
                </text>
                <text x={cx} y={BASE + 42} textAnchor="middle" fontSize={11} className="fill-muted" fontFamily="var(--font-sans)">
                  {on && t.gfa ? `${labels.gfa} ${formatNumber(locale, t.gfa, 0)} m²${t.floors ? ` · ${labels.floors} ${t.floors}` : ""}` : t.kicker}
                </text>
              </g>
            </Link>
          );
        })}

        {/* reference building */}
        <g style={{ opacity: inView ? 1 : 0, transition: "opacity 0.8s 1s" }}>
          <rect x={W - 70} y={BASE - REF_HEIGHT * SCALE} width={40} height={REF_HEIGHT * SCALE} className="fill-paper-2 stroke-ink/40" />
          <text x={W - 50} y={BASE + 24} textAnchor="middle" fontSize={11} className="fill-muted" fontFamily="var(--font-sans)">
            {REF_HEIGHT} m
          </text>
          <text x={W - 50} y={BASE + 40} textAnchor="middle" fontSize={10} className="fill-muted" fontFamily="var(--font-sans)">
            {labels.reference}
          </text>
        </g>

        <line x1={0} x2={W} y1={BASE} y2={BASE} className="stroke-ink" strokeWidth={1.5} />
      </svg>
    </div>
  );
}
