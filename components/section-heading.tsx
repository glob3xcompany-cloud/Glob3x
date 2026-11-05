import { Reveal } from "./motion/reveal";

export function SectionHeading({
  eyebrow,
  title,
  body,
  tone = "light",
  className = "",
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const muted = tone === "dark" ? "text-paper/70" : "text-muted";
  const accent = tone === "dark" ? "text-gold" : "text-blue";
  return (
    <div className={`max-w-3xl ${className}`}>
      <Reveal>
        <p className={`eyebrow ${accent}`}>{eyebrow}</p>
      </Reveal>
      <Reveal delay={80}>
        <Tag className="font-display mt-4 text-display-lg leading-[1.02] font-light tracking-[-0.01em] text-balance">{title}</Tag>
      </Reveal>
      {body ? (
        <Reveal delay={160}>
          <p className={`mt-6 text-base leading-relaxed md:text-lg ${muted}`}>{body}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
