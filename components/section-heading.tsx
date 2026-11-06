import { Reveal } from "./motion/reveal";

export function SectionHeading({
  eyebrow,
  title,
  body,
  tone = "light",
  className = "",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const muted = tone === "dark" ? "text-paper/70" : "text-muted";
  return (
    <div className={`max-w-3xl ${className}`}>
      <Reveal>
        <p className="eyebrow text-gold">{eyebrow}</p>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="font-display mt-4 text-display-lg leading-[1.02] font-light tracking-[-0.01em] text-balance">{title}</h2>
      </Reveal>
      {body ? (
        <Reveal delay={160}>
          <p className={`mt-6 text-base leading-relaxed md:text-lg ${muted}`}>{body}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
