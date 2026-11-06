"use client";

import { useEffect, useRef, useState } from "react";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Fraction of the viewport, measured from the top, that an element must reach before it counts as in view. */
const LINE = 0.92;

type Pending = { el: Element; threshold: number; show: () => void };

/**
 * One shared scroll/resize listener for every pending reveal. Positions are read directly, so an
 * element that jumps across the viewport while images load (common on phones) is still caught:
 * IntersectionObserver only fires when the intersection *changes*, which never happens in that case.
 */
const pending = new Set<Pending>();
let frame = 0;
let listening = false;

function passed({ el, threshold }: Pending, vh: number) {
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return false; // display:none, e.g. a desktop-only decoration
  if (r.bottom <= 0) return true; // already scrolled past
  // Tall elements can never have `threshold` of their height on screen, so cap the demand at a third of the viewport.
  const need = Math.min(r.height * threshold, vh / 3);
  return r.top + need <= vh * LINE;
}

function check() {
  frame = 0;
  const vh = window.innerHeight;
  for (const p of pending) {
    if (passed(p, vh)) {
      pending.delete(p);
      p.show();
    }
  }
  if (pending.size === 0) stop();
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(check);
}

function start() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
}

function stop() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  window.removeEventListener("load", schedule);
}

/**
 * Returns a ref and a boolean that flips to true once the element has entered the viewport.
 * `threshold` is the fraction of the element that has to be visible (0.15 by default).
 */
export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const entry: Pending = { el, threshold, show: () => setInView(true) };
    pending.add(entry);
    start();
    // Check now, and again once fonts/images have had a moment to settle the layout.
    schedule();
    const settle = window.setTimeout(schedule, 400);
    return () => {
      pending.delete(entry);
      window.clearTimeout(settle);
      if (pending.size === 0) stop();
    };
  }, [threshold]);

  return { ref, inView };
}
