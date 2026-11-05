"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Media } from "@/lib/projects";
import { Reveal } from "./motion/reveal";

const COLS = 4;

/** Column span → classes. Aspect ratios are chosen so every span yields the same tile height (≈ 1.33 × column width). */
const SPAN_CLASS: Record<number, string> = {
  1: "md:col-span-1 md:aspect-[3/4]",
  2: "md:col-span-2 md:aspect-[3/2]",
  3: "md:col-span-3 md:aspect-[9/4]",
  4: "md:col-span-4 md:aspect-[3/1]",
};
const SPAN_SIZES: Record<number, string> = {
  1: "(min-width: 768px) 25vw, 50vw",
  2: "(min-width: 768px) 50vw, 50vw",
  3: "(min-width: 768px) 75vw, 50vw",
  4: "(min-width: 768px) 100vw, 50vw",
};

/**
 * Landscape images take two columns, portrait and square images one. Rows are then closed greedily:
 * when the next image does not fit, the previous one grows to fill the row, and the last image fills
 * whatever is left, so the grid never shows holes.
 */
function spans(items: Media[]): number[] {
  const out = items.map((m) => (m.w > m.h * 1.1 ? 2 : 1));
  let used = 0;
  for (let i = 0; i < out.length; i++) {
    if (used + out[i] > COLS) {
      out[i - 1] += COLS - used;
      used = 0;
    }
    used += out[i];
    if (used === COLS) used = 0;
  }
  if (used > 0) out[out.length - 1] += COLS - used;
  return out;
}

/**
 * Responsive image grid with a native <dialog> lightbox.
 * Two columns on phones (uniform 4:5 tiles), four on wider screens with full rows and equal tile heights.
 */
export function Gallery({ items, alt, openLabel, closeLabel }: { items: Media[]; alt: string; openLabel: string; closeLabel: string }) {
  const layout = spans(items);
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (active !== null && !d.open) d.showModal();
    if (active === null && d.open) d.close();
  }, [active]);

  const step = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, step]);

  if (items.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {items.map((img, i) => {
          const span = layout[i];
          return (
            // The aspect ratio sizes the row; `self-stretch` then lets every tile fill the tallest one in its row.
            <Reveal key={img.src} delay={(i % COLS) * 80} className={`aspect-[4/5] self-stretch ${SPAN_CLASS[span]}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${openLabel} ${i + 1}/${items.length}`}
                className="group relative block h-full w-full overflow-hidden bg-paper-2"
              >
                <Image
                  src={img.src}
                  alt={`${alt} ${i + 1}`}
                  fill
                  sizes={SPAN_SIZES[span]}
                  className={`object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.04] ${img.position ?? ""}`}
                />
              </button>
            </Reveal>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setActive(null);
        }}
        className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-ink/95 backdrop:backdrop-blur-sm"
      >
        {active !== null ? (
          <div className="relative flex h-full w-full items-center justify-center p-4 md:p-12">
            <Image
              key={items[active].src}
              src={items[active].src}
              alt={`${alt} ${active + 1}`}
              width={items[active].w}
              height={items[active].h}
              sizes="100vw"
              className="max-h-full w-auto max-w-full object-contain"
              priority
            />
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute top-4 right-4 rounded-full border border-paper/40 px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.18em] text-paper uppercase hover:border-paper"
            >
              {closeLabel}
            </button>
            {items.length > 1 ? (
              <>
                <button type="button" onClick={() => step(-1)} aria-label="Previous" className="absolute top-1/2 left-2 -translate-y-1/2 p-3 text-3xl text-paper/80 hover:text-paper md:left-6">
                  ←
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Next" className="absolute top-1/2 right-2 -translate-y-1/2 p-3 text-3xl text-paper/80 hover:text-paper md:right-6">
                  →
                </button>
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.6875rem] tracking-[0.2em] text-paper/60 tabular-nums">
                  {active + 1} / {items.length}
                </p>
              </>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
