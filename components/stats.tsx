import { CountUp } from "./motion/count-up";
import { Reveal } from "./motion/reveal";

export type Stat = { value: string; label: string };

/**
 * Splits "83,576 m²" into a number to animate and a trailing unit. Values that are not numeric
 * (e.g. "55 + 36") are rendered as-is.
 */
function parse(value: string): { n: number; prefix: string; suffix: string } | null {
  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!match) return null;
  const n = Number(match[2].replace(/,/g, ""));
  if (!Number.isFinite(n) || /[.]/.test(match[2])) return null;
  // Years ("2008") read wrong with a thousands separator; show them verbatim.
  if (/^\d{4}$/.test(match[2]) && n >= 1900 && n <= 2100) return null;
  return { n, prefix: match[1], suffix: match[3] };
}

export function Stats({ items, tone = "light", columns = 4 }: { items: Stat[]; tone?: "light" | "dark"; columns?: 3 | 4 }) {
  const dark = tone === "dark";
  const cols = columns === 3 ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <section className={`${dark ? "border-line-dark bg-navy text-paper" : "border-line bg-paper"} border-y`}>
      <dl className={`container-x grid ${cols}`}>
        {items.map((f, i) => {
          const parsed = parse(f.value);
          return (
            <Reveal
              key={f.label}
              delay={i * 100}
              className={`py-10 md:py-14 ${i > 0 ? `border-t ${dark ? "border-line-dark" : "border-line"} sm:border-t-0 lg:border-l lg:pl-10` : ""} ${
                i === 1 ? "sm:border-l sm:pl-10 lg:pl-10" : ""
              } ${i === 2 ? "sm:border-t lg:border-t-0" : ""} ${i === 3 ? "sm:border-t sm:border-l sm:pl-10 lg:border-t-0" : ""}`}
            >
              <dd className={`font-display whitespace-nowrap ${dark ? "text-gold" : "text-blue"}`}>
                <span className="text-5xl leading-none md:text-6xl">
                  {parsed ? (
                    <>
                      {parsed.prefix}
                      <CountUp value={parsed.n} delay={i * 100} />
                      {parsed.suffix.startsWith("+") ? "+" : ""}
                    </>
                  ) : (
                    f.value
                  )}
                </span>
                {parsed && parsed.suffix.replace(/^\+/, "").trim() ? <span className="ml-2 text-xl md:text-2xl">{parsed.suffix.replace(/^\+/, "").trim()}</span> : null}
              </dd>
              <dt className={`mt-3 text-[0.8125rem] tracking-[0.04em] ${dark ? "text-paper/60" : "text-muted"}`}>{f.label}</dt>
            </Reveal>
          );
        })}
      </dl>
    </section>
  );
}
