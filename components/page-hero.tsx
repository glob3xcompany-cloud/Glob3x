import Image from "next/image";

/** Dark image banner used at the top of every inner page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  alt = "",
  position = "object-center",
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  alt?: string;
  position?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-ink text-paper">
      <div className="animate-kenburns absolute inset-0 -z-20">
        <Image src={image} alt={alt} fill priority sizes="100vw" className={`object-cover ${position}`} />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(14_17_23/0.92)_0%,rgb(14_17_23/0.35)_50%,rgb(14_17_23/0.45)_100%)]" />
      <div className="container-x relative pt-40 pb-14 md:pb-20">
        <p className="eyebrow animate-rise text-gold">{eyebrow}</p>
        <h1 className="font-display animate-rise mt-5 max-w-4xl text-display-xl leading-[0.98] font-light tracking-[-0.01em] text-balance [animation-delay:120ms]">
          {title}
        </h1>
        {intro ? (
          <p className="animate-rise mt-8 max-w-2xl text-base leading-relaxed text-paper/80 md:text-lg [animation-delay:240ms]">{intro}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
