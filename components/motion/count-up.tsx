"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion, useInView } from "./use-in-view";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Animates from 0 to `value` once visible. Formats with thousands separators. */
export function CountUp({
  value,
  duration = 1800,
  delay = 0,
  className = "",
}: {
  value: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const total = prefersReducedMotion() ? 0 : duration;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = total === 0 ? 1 : Math.min(1, (now - start) / total);
      setCurrent(Math.round(easeOutExpo(t) * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [inView, value, duration, delay]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {current.toLocaleString("en-US")}
    </span>
  );
}
