import { CountUp } from "./motion/count-up";
import { Reveal } from "./motion/reveal";

/** Official figures from the approved design (docs/01). Labels come from the dictionary. */
const FIGURES = [
  { parts: [{ n: 191 }], unit: "m" },
  { parts: [{ n: 55 }, { text: " + " }, { n: 36 }], unit: "floors" },
  { parts: [{ n: 83576 }], unit: "m²" },
] as const;

export function Stats({ items, floorsUnit }: { items: { label: string }[]; floorsUnit: string }) {
  return (
    <section id="stats" className="border-b border-line bg-paper">
      <dl className="container-x grid md:grid-cols-3">
        {FIGURES.map((f, i) => (
          <Reveal
            key={items[i].label}
            delay={i * 120}
            className={`py-10 md:py-14 ${i > 0 ? "border-t border-line md:border-t-0 md:border-l md:pl-10" : ""}`}
          >
            <dd className="font-display whitespace-nowrap text-gold">
              <span className="text-5xl leading-none md:text-6xl lg:text-7xl">
                {f.parts.map((p, j) =>
                  "n" in p ? <CountUp key={j} value={p.n} delay={i * 120} /> : <span key={j}>{p.text}</span>,
                )}
              </span>
              <span className="ml-2 text-xl md:text-2xl">{f.unit === "floors" ? floorsUnit : f.unit}</span>
            </dd>
            <dt className="mt-3 text-[0.8125rem] tracking-[0.04em] text-muted">{items[i].label}</dt>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
