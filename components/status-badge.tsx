import type { Status } from "@/lib/projects";

const TONES: Record<Status, string> = {
  ongoing: "bg-blue text-paper",
  completed: "bg-paper text-ink",
};

export function StatusBadge({ status, label, className = "" }: { status: Status; label: string; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.625rem] font-semibold tracking-[0.2em] uppercase ${TONES[status]} ${className}`}>
      {label}
    </span>
  );
}
