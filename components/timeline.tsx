import { Reveal } from "./motion/reveal";

export type TimelineItem = { year: string; title: string; body: string };

export function Timeline({ items, tone = "light" }: { items: TimelineItem[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ol className="relative grid gap-0 md:grid-cols-4">
      <Reveal variant="line" className="absolute inset-x-0 top-[0.4rem] hidden md:block">
        <div className={`h-px w-full ${dark ? "bg-paper/25" : "bg-ink/20"}`} />
      </Reveal>
      {items.map((item, i) => (
        <li key={item.year} className={`relative pl-8 md:pl-0 md:pr-10 ${i < items.length - 1 ? "pb-10 md:pb-0" : ""}`}>
          <span className={`absolute top-[0.4rem] left-0 hidden h-3 w-3 -translate-y-1/2 rounded-full md:block ${dark ? "bg-gold" : "bg-blue"}`} aria-hidden="true" />
          <span className={`absolute top-0 bottom-0 left-[0.3125rem] w-px md:hidden ${dark ? "bg-paper/25" : "bg-ink/20"}`} aria-hidden="true" />
          <span className={`absolute top-[0.35rem] left-0 h-3 w-3 -translate-y-1/2 rounded-full md:hidden ${dark ? "bg-gold" : "bg-blue"}`} aria-hidden="true" />
          <Reveal delay={i * 120} className="md:pt-8">
            <p className={`font-display text-4xl leading-none md:text-5xl ${dark ? "text-gold" : "text-blue"}`}>{item.year}</p>
            <h3 className="mt-4 text-base font-semibold tracking-[0.02em]">{item.title}</h3>
            <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-paper/65" : "text-muted"}`}>{item.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
