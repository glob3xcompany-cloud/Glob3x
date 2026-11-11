import { asset } from "@/lib/site";
import { FilmDialog } from "./film-dialog";

type HeroDict = {
  eyebrow: string;
  title: string;
  subtitle: string;
  watch: string;
  scroll: string;
};

export function Hero({ dict, closeLabel }: { dict: HeroDict; closeLabel: string }) {
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-paper">
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={asset("/media/reeds/hero-poster.jpg")}
        aria-hidden="true"
      >
        <source src={asset("/media/reeds/hero-loop.mp4")} type="video/mp4" />
      </video>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(14_15_18/0.85)_0%,rgb(14_15_18/0.25)_45%,rgb(14_15_18/0.35)_100%)]" />

      {/* Below 3xl the floating plans button lies along the bottom edge, so the content keeps clear of it. */}
      <div className="container-x relative pb-28 pt-40 [text-shadow:0_1px_18px_rgb(0_0_0/0.45)] 3xl:pb-20">
        <p className="eyebrow animate-rise text-gold">{dict.eyebrow}</p>
        <h1 className="font-display animate-rise mt-5 max-w-5xl text-display-xl leading-[0.98] font-light tracking-[-0.01em] [animation-delay:120ms]">
          {dict.title}
        </h1>
        <div className="animate-rise mt-8 flex flex-col gap-8 md:flex-row md:items-center md:justify-between [animation-delay:240ms]">
          <p className="text-base text-paper/80 md:text-lg">{dict.subtitle}</p>
          <FilmDialog label={dict.watch} closeLabel={closeLabel} />
        </div>
      </div>

      <a
        href="#stats"
        aria-label={dict.scroll}
        className="absolute bottom-6 right-5 hidden h-16 w-px bg-paper/40 md:block lg:right-16"
      >
        <span className="absolute inset-x-0 top-0 h-1/2 animate-pulse bg-paper" />
      </a>
    </section>
  );
}
