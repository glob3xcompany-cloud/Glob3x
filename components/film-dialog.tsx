"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/site";

export function FilmDialog({ label, closeLabel }: { label: string; closeLabel: string }) {
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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-4 text-[0.8125rem] font-medium tracking-[0.12em] uppercase"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full border border-paper/60 bg-paper/10 backdrop-blur transition-colors group-hover:bg-paper group-hover:text-ink">
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
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute -top-10 right-0 text-[0.75rem] font-semibold tracking-[0.2em] text-paper uppercase md:-top-12"
          >
            {closeLabel} ×
          </button>
          <video
            ref={videoRef}
            controls
            playsInline
            preload="none"
            poster={asset("/media/reeds/hero-poster.jpg")}
            className="aspect-[1280/633] w-full bg-ink"
            src={asset("/media/reeds/film-720.mp4")}
          />
        </div>
      </dialog>
    </>
  );
}
