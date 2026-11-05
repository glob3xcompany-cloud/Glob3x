"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./motion/use-in-view";

/**
 * Background video with a guaranteed good first frame: the poster is rendered as an image underneath and the
 * video only fades in once it is actually playing. React does not serialise `muted` into SSR markup, which can
 * block autoplay, so muting and playing are done imperatively as well.
 */
export function HeroVideo({ src, poster, alt = "" }: { src: string; poster: string; alt?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return;
    video.muted = true;
    video.defaultMuted = true;
    const onPlaying = () => setPlaying(true);
    video.addEventListener("playing", onPlaying);
    void video.play().catch(() => undefined);
    return () => video.removeEventListener("playing", onPlaying);
  }, []);

  return (
    <div className="absolute inset-0 -z-20 bg-ink">
      <Image src={poster} alt={alt} fill priority sizes="100vw" className="object-cover" />
      <video
        ref={ref}
        // visibility, not just opacity: some compositors paint an opaque layer for a video even at opacity 0.
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? "visible opacity-100" : "invisible opacity-0"}`}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>
  );
}
