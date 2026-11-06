"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "./use-in-view";

type Variant = "up" | "fade" | "clip" | "line";

/**
 * Reveals its children when scrolled into view.
 * - up:   fade + rise
 * - fade: fade only
 * - clip: wipe from the bottom while the child settles from a slight zoom (for media)
 * - line: horizontal rule growing from the left
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  style,
}: {
  children?: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  // clip-path / scale(0) shrink the element's intersection geometry to nothing, so the observer
  // would never fire. Observe an unclipped wrapper and animate an inner layer instead.
  // The wrapper is a grid so the inner layer stretches to the wrapper's (min-)height.
  if (variant === "clip" || variant === "line") {
    return (
      <div ref={ref} style={style} className={`grid ${className}`}>
        <div data-reveal={variant} data-shown={inView || undefined} style={{ transitionDelay: `${delay}ms` }} className="relative min-w-0">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-reveal={variant}
      data-shown={inView || undefined}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      className={className}
    >
      {children}
    </div>
  );
}
