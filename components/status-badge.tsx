import type { Status } from "@/lib/projects";

const TONES: Record<Status, string> = {
  selling: "bg-gold text-ink",
  completed: "bg-paper text-ink",
  "in-development": "bg-blue text-paper",
  "coming-soon": "bg-ink/80 text-paper backdrop-blur",
  concept: "bg-paper/20 text-paper backdrop-blur border border-paper/40",
};

export function StatusBadge({ status, label, className = "" }: { status: Status; label: string; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] uppercase ${TONES[status]} ${className}`}>
      {label}
    </span>
  );
}
