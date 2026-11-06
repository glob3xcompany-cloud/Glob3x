"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { prefersReducedMotion, useInView } from "./use-in-view";

/**
 * Image that wipes in on scroll and drifts slowly (parallax) while it travels through the viewport.
 * Wrapper must have a size (aspect-ratio or height); the image fills it.
 */
export function ParallaxImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  strength = 10,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Max drift in percent of the wrapper height. */
  strength?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.05);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const target = inner.current;
    if (!el || !target || prefersReducedMotion()) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      // -1 when the element's centre is at the bottom of the viewport, +1 at the top.
      const progress = ((rect.top + rect.height / 2) / vh - 0.5) * -2;
      target.style.transform = `translate3d(0, ${(progress * strength).toFixed(2)}%, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, strength]);

  // The observed wrapper stays unclipped (clip-path would zero out its intersection geometry);
  // the wipe happens on the inner layer.
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div data-reveal="clip" data-shown={inView || undefined} className="absolute inset-0 overflow-hidden">
        <div ref={inner} className="absolute inset-x-0" style={{ top: `-${strength}%`, bottom: `-${strength}%` }}>
          <div className="reveal-scale absolute inset-0">
            <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
