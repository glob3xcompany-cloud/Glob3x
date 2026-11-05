import Image from "next/image";

/** Logo mark + wordmark. Inherits the text colour of its parent so it works on dark and light headers. */
export function BrandLogo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const px = size === "lg" ? 44 : size === "sm" ? 28 : 34;
  // The mark is 227×232, so keep its intrinsic ratio (Preflight sets `img { height: auto }`).
  const h = Math.round((px * 232) / 227);
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image src="/brand/glob3x-mark.png" alt="" width={px} height={h} priority className="h-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold tracking-[0.2em] uppercase ${size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg md:text-xl"}`}>
          Glob3x
        </span>
        <span className={`mt-1 text-[0.5rem] font-semibold tracking-[0.42em] uppercase opacity-70 ${size === "sm" ? "hidden" : ""}`}>Group</span>
      </span>
    </span>
  );
}
