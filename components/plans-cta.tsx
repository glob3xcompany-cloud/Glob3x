import Link from "next/link";

/** A floor plan in miniature: outer walls, two partitions and a door opening. */
function PlanIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" aria-hidden="true" className={className}>
      <path d="M2.5 2.5h15v15h-15z" />
      <path d="M8.5 2.5v5.5M2.5 11h3.5M9 11h8.5M12.5 11v6.5" />
    </svg>
  );
}

/**
 * The way to the floor plans, fixed to the bottom edge of the screen so it is one tap away wherever
 * the visitor has scrolled to: centred on phones and tablets, in the right-hand corner on desktop.
 * The header has no room for it next to the full navigation, which is why it floats instead.
 */
export function PlansDock({ href, label, hint }: { href: string; label: string; hint: string }) {
  return (
    <div
      data-plans-dock
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-6 lg:justify-end lg:px-10 lg:pb-8 xl:px-16"
    >
      <Link
        href={href}
        className="group animate-rise pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-full border border-gold/50 bg-ink/90 py-2 pr-2 pl-4 text-paper min-[380px]:gap-3.5 min-[380px]:pl-5 shadow-[0_14px_40px_-10px_rgb(0_0_0/0.6)] backdrop-blur-md transition-colors duration-300 [animation-delay:500ms] hover:border-gold hover:bg-ink lg:w-auto lg:max-w-none lg:gap-4 lg:pl-6"
      >
        <PlanIcon className="h-5 w-5 shrink-0 text-gold" />
        <span className="min-w-0 flex-1">
          {/* The narrowest phones (320px) get a slightly tighter label so it never clips. */}
          <span className="block text-[0.6875rem] font-semibold tracking-[0.1em] whitespace-nowrap uppercase min-[380px]:text-[0.75rem] min-[380px]:tracking-[0.18em]">{label}</span>
          <span className="mt-0.5 block truncate text-[0.6875rem] text-paper/60">{hint}</span>
        </span>
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-base text-ink transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-active:scale-95"
        >
          →
        </span>
      </Link>
    </div>
  );
}
