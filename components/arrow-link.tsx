import Link from "next/link";

export function ArrowLink({ href, children, tone = "light" }: { href: string; children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 text-[0.75rem] font-semibold tracking-[0.18em] uppercase ${
        tone === "dark" ? "text-gold" : "text-ink"
      }`}
    >
      {children}
      <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
        →
      </span>
    </Link>
  );
}
