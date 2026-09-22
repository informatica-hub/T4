import { cn } from "@/lib/utils";

interface NucleotideBackgroundProps {
  className?: string;
}

export function NucleotideBackground({ className }: NucleotideBackgroundProps) {
  // Fixed seed-based pseudo-random positions for consistency
  const letters = [
    { char: "C", x: 25, y: 40, rot: -15, size: 18 },
    { char: "T", x: 80, y: 20, rot: 25, size: 16 },
    { char: "G", x: 150, y: 70, rot: -30, size: 20 },
    { char: "A", x: 220, y: 30, rot: 10, size: 17 },
    { char: "T", x: 45, y: 130, rot: 40, size: 15 },
    { char: "G", x: 120, y: 160, rot: -20, size: 19 },
    { char: "C", x: 200, y: 120, rot: 35, size: 16 },
    { char: "A", x: 270, y: 80, rot: -10, size: 18 },
    { char: "G", x: 60, y: 220, rot: 15, size: 17 },
    { char: "T", x: 160, y: 250, rot: -25, size: 20 },
    { char: "A", x: 240, y: 200, rot: 5, size: 15 },
    { char: "C", x: 100, y: 280, rot: 30, size: 18 },
    { char: "T", x: 280, y: 260, rot: -35, size: 16 },
    { char: "G", x: 30, y: 90, rot: 20, size: 14 },
    { char: "A", x: 190, y: 180, rot: -5, size: 21 },
    { char: "C", x: 260, y: 150, rot: 45, size: 15 },
    { char: "T", x: 140, y: 100, rot: -40, size: 17 },
    { char: "G", x: 70, y: 170, rot: 12, size: 19 },
  ];

  const hexagons = [
    { cx: 50, cy: 60, r: 6 },
    { cx: 180, cy: 40, r: 5 },
    { cx: 110, cy: 200, r: 7 },
    { cx: 250, cy: 170, r: 5 },
    { cx: 40, cy: 260, r: 6 },
    { cx: 290, cy: 50, r: 4 },
  ];

  const circles = [
    { cx: 90, cy: 35, r: 3 },
    { cx: 230, cy: 110, r: 4 },
    { cx: 160, cy: 140, r: 3 },
    { cx: 50, cy: 200, r: 4 },
    { cx: 270, cy: 230, r: 3 },
  ];

  const lines = [
    { x1: 85, y1: 38, x2: 105, y2: 55 },
    { x1: 175, y1: 45, x2: 155, y2: 68 },
    { x1: 225, y1: 115, x2: 245, y2: 125 },
    { x1: 45, y1: 205, x2: 65, y2: 218 },
    { x1: 265, y1: 235, x2: 280, y2: 255 },
    { x1: 115, y1: 205, x2: 140, y2: 195 },
    { x1: 55, y1: 135, x2: 70, y2: 155 },
  ];

  const hexPath = (cx: number, cy: number, r: number) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    });
    return `M${pts.join("L")}Z`;
  };

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="nucleotide-pattern"
            x="0"
            y="0"
            width="300"
            height="300"
            patternUnits="userSpaceOnUse"
          >
            {/* Letters CTGA */}
            {letters.map((l, i) => (
              <text
                key={`l-${i}`}
                x={l.x}
                y={l.y}
                fontSize={l.size}
                fontFamily="monospace"
                fontWeight="700"
                fill={i % 2 === 0 ? "#384747" : "#859085"}
                opacity={i % 3 === 0 ? 0.12 : 0.08}
                transform={`rotate(${l.rot} ${l.x} ${l.y})`}
              >
                {l.char}
              </text>
            ))}

            {/* Hexagons (nucleotide bases) */}
            {hexagons.map((h, i) => (
              <path
                key={`h-${i}`}
                d={hexPath(h.cx, h.cy, h.r)}
                fill="none"
                stroke={i % 2 === 0 ? "#384747" : "#859085"}
                strokeWidth="0.8"
                opacity={0.1}
              />
            ))}

            {/* Small circles */}
            {circles.map((c, i) => (
              <circle
                key={`c-${i}`}
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                fill={i % 2 === 0 ? "#384747" : "#859085"}
                opacity={0.08}
              />
            ))}

            {/* Phosphodiester bond lines */}
            {lines.map((ln, i) => (
              <line
                key={`ln-${i}`}
                x1={ln.x1}
                y1={ln.y1}
                x2={ln.x2}
                y2={ln.y2}
                stroke={i % 2 === 0 ? "#384747" : "#859085"}
                strokeWidth="0.8"
                opacity={0.1}
              />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#nucleotide-pattern)" />
      </svg>
    </div>
  );
}
