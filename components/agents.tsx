import { site, telHref } from "@/lib/site";
import { Reveal } from "./motion/reveal";

/** Sales agents with direct lines and WhatsApp deep links. */
export function Agents({ whatsappLabel, callLabel, tone = "light" }: { whatsappLabel: string; callLabel: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
      {site.salesAgents.map((a, i) => {
        const digits = a.phone.replace(/[^\d]/g, "");
        return (
          <Reveal key={a.phone} delay={i * 80} className={`${dark ? "bg-paper/5" : "bg-paper"} p-6`}>
            <p className="font-display text-2xl">{a.name}</p>
            <a href={telHref(a.phone)} className={`mt-1 block text-sm tabular-nums ${dark ? "text-paper/70 hover:text-paper" : "text-muted hover:text-ink"}`}>
              {a.phone}
            </a>
            <div className="mt-5 flex gap-4 text-[0.6875rem] font-semibold tracking-[0.18em] uppercase">
              <a href={telHref(a.phone)} className={dark ? "text-gold" : "text-blue"}>
                {callLabel}
              </a>
              <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" className={dark ? "text-gold" : "text-blue"}>
                {whatsappLabel}
              </a>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
