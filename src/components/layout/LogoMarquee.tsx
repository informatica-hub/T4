import { useMemo } from "react";

export interface MarqueeLogo {
  src: string;
  alt: string;
}

interface LogoMarqueeProps {
  logos: MarqueeLogo[];
  direction?: "left" | "right";
  speed?: number; // seconds per loop
}

export function LogoMarquee({ logos, direction = "left", speed = 40 }: LogoMarqueeProps) {
  const doubled = useMemo(() => [...logos, ...logos], [logos]);
  const animationName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div
      className="group relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className="flex w-max items-center gap-12 md:gap-20 motion-reduce:!animate-none group-hover:[animation-play-state:paused]"
        style={{
          animation: `${animationName} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((logo, i) => (
          <div
            key={`${logo.alt}-${i}`}
            className="shrink-0 flex items-center justify-center bg-white rounded-xl border border-border/50 shadow-sm h-24 md:h-32 w-44 md:w-56 px-5"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              className="max-h-full max-w-full w-auto object-contain transition-all duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
