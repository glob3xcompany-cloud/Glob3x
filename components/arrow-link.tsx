import Link from "next/link";

export function ArrowLink({
  href,
  children,
  tone = "light",
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  external?: boolean;
  className?: string;
}) {
  const classes = `group inline-flex items-center gap-3 text-[0.75rem] font-semibold tracking-[0.18em] uppercase ${
    tone === "dark" ? "text-gold" : "text-blue"
  } ${className}`;
  const arrow = (
    <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
      →
    </span>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
      {arrow}
    </Link>
  );
}
