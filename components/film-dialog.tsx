"use client";

import { useEffect, useRef, useState } from "react";

/** Play button that opens a native <dialog> with the project film. The video is only loaded when opened. */
export function FilmDialog({ src, poster, label, closeLabel, tone = "dark" }: { src: string; poster: string; label: string; closeLabel: string; tone?: "dark" | "light" }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const video = videoRef.current;
    if (!dialog || !video) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      if (dialog.open) dialog.close();
    }
  }, [open]);

  const ring = tone === "dark" ? "border-paper/60 bg-paper/10 group-hover:bg-paper group-hover:text-ink" : "border-ink/40 bg-ink/5 group-hover:bg-ink group-hover:text-paper";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="group inline-flex items-center gap-4 text-[0.8125rem] font-medium tracking-[0.12em] uppercase">
        <span className={`grid h-14 w-14 place-items-center rounded-full border backdrop-blur transition-colors ${ring}`}>
          <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden="true">
            <path d="M0 0l14 8-14 8z" />
          </svg>
        </span>
        {label}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="m-auto w-[min(96vw,1280px)] bg-transparent p-0 backdrop:bg-ink/95 backdrop:backdrop-blur-sm"
      >
        <div className="relative">
          <button type="button" onClick={() => setOpen(false)} className="absolute -top-10 right-0 text-[0.75rem] font-semibold tracking-[0.2em] text-paper uppercase md:-top-12">
            {closeLabel} ×
          </button>
          <video ref={videoRef} controls playsInline preload="none" poster={poster} className="aspect-video w-full bg-ink" src={src} />
        </div>
      </dialog>
    </>
  );
}
