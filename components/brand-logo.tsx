import Image from "next/image";

/**
 * Logo mark + wordmark, set as on the company logo: "GLOB 3X" with "Group" centred beneath the "3X".
 * Inherits the text colour of its parent so it works on dark and light headers.
 */
export function BrandLogo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const px = size === "lg" ? 44 : size === "sm" ? 28 : 34;
  // The mark is 227×232, so keep its intrinsic ratio (Preflight sets `img { height: auto }`).
  const h = Math.round((px * 232) / 227);
  const word = "font-display font-semibold uppercase";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image src="/brand/glob3x-mark.png" alt="" width={px} height={h} priority className="h-auto shrink-0" />
      <span className={`flex items-start leading-none ${size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg md:text-xl"}`}>
        <span className={`${word} tracking-[0.2em]`}>Glob</span>
        {/* A word space after GLOB, then "3X" set tight with "Group" centred beneath it. */}
        <span className="ml-[0.35em] flex flex-col items-center">
          <span className={`${word} tracking-[0.02em]`}>3x</span>
          {/* Zero-width holder: "Group" is a little wider than "3X" and must not push the two words apart. The negative margin takes back the letter-spacing that trails its last letter. */}
          <span className={`mt-1 flex w-0 justify-center ${size === "sm" ? "hidden" : ""}`}>
            <span className="-mr-[0.42em] text-[0.5rem] font-semibold tracking-[0.42em] whitespace-nowrap uppercase opacity-70">Group</span>
          </span>
        </span>
      </span>
    </span>
  );
}
