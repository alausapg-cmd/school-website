import type { CSSProperties, ReactNode } from "react";

export function Leaf({ className = "", color = "#3A8A2E", vein = "#245A1C", style }: { className?: string; color?: string; vein?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 60" className={className} style={style} aria-hidden>
      <path d="M20 2 C 36 14, 38 40, 20 58 C 2 40, 4 14, 20 2 Z" fill={color} />
      <path d="M20 8 L20 54 M20 22 L29 16 M20 32 L11 25 M20 42 L28 36" stroke={vein} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}

const FLY_SPOTS = [
  [8, 22], [18, 70], [27, 38], [36, 82], [44, 16], [53, 58], [62, 30], [71, 76], [79, 44], [88, 18], [93, 64], [13, 50],
];

// Glowing fireflies drifting about. Place inside a relative parent.
export function Fireflies({ count = 8, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {FLY_SPOTS.slice(0, count).map(([x, y], i) => (
        <span
          key={i}
          className="absolute h-2 w-2 animate-firefly rounded-full bg-[#FFE27A] shadow-[0_0_12px_4px_rgba(255,226,122,0.65)]"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${(i * 0.9) % 6}s`, animationDuration: `${6 + (i % 4)}s` }}
        />
      ))}
    </div>
  );
}

function Vine({ length, flip }: { length: number; flip?: boolean }) {
  const leaves = Array.from({ length: Math.floor(length / 26) }, (_, i) => 18 + i * 26);
  return (
    <svg viewBox={`0 0 40 ${length + 10}`} width="40" height={length + 10} className="origin-hang animate-sway-slow" aria-hidden style={{ animationDelay: `${(length % 7) * 0.4}s` }}>
      <path d={`M20 0 C ${flip ? 8 : 32} ${length * 0.3}, ${flip ? 32 : 8} ${length * 0.6}, 20 ${length}`} stroke="#245A1C" strokeWidth="3" fill="none" strokeLinecap="round" />
      {leaves.map((y, i) => (
        <path
          key={y}
          d={i % 2 ? `M20 ${y} c 10 -8, 18 -4, 18 2 c -8 4, -14 4, -18 -2 Z` : `M20 ${y} c -10 -8, -18 -4, -18 2 c 8 4, 14 4, 18 -2 Z`}
          fill={i % 3 === 0 ? "#7CC24A" : "#3A8A2E"}
        />
      ))}
      <circle cx="20" cy={length + 2} r="5" fill={flip ? "#C2185B" : "#6A2C91"} />
    </svg>
  );
}

// A row of vines hanging from the top edge of a section.
export function Vines({ className = "", lengths = [70, 120, 50, 95, 140, 60, 110, 80] }: { className?: string; lengths?: number[] }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 flex justify-between px-2 ${className}`} aria-hidden>
      {lengths.map((l, i) => (
        <div key={i} className={i % 3 === 2 ? "hidden sm:block" : ""}>
          <Vine length={l} flip={i % 2 === 1} />
        </div>
      ))}
    </div>
  );
}

const FRUIT: Record<string, { body: string; dark: string; light: string }> = {
  mango: { body: "#FFB320", dark: "#E08A00", light: "#FFF0C7" },
  berry: { body: "#C2185B", dark: "#8E0F42", light: "#FBE1EC" },
  lime: { body: "#5FAE3A", dark: "#3A8A2E", light: "#E5F3D2" },
  plum: { body: "#6A2C91", dark: "#4E1F6B", light: "#EFE2F7" },
};

// A round fruit with a leaf on top, used as a badge behind an emoji.
export function Fruit({ kind = "mango", className = "", children }: { kind?: string; className?: string; children?: ReactNode }) {
  const f = FRUIT[kind] ?? FRUIT.mango;
  return (
    <div className={`relative grid place-items-center ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M50 18 C 54 8, 60 4, 66 4" stroke="#5A3818" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M54 14 C 66 2, 84 6, 88 12 C 78 20, 64 22, 54 14 Z" fill="#3A8A2E" />
        <circle cx="50" cy="58" r="40" fill={f.body} />
        <circle cx="50" cy="58" r="40" fill="none" stroke={f.dark} strokeWidth="4" />
        <ellipse cx="34" cy="42" rx="10" ry="6" fill="#fff" opacity="0.35" transform="rotate(-30 34 42)" />
      </svg>
      <span className="relative mt-[12%] leading-none">{children}</span>
    </div>
  );
}
export const fruitColors = FRUIT;

// A wooden sign on two ropes.
export function HangingSign({ children, className = "", tilt = -2 }: { children: ReactNode; className?: string; tilt?: number }) {
  return (
    <div className={`relative inline-block pt-6 ${className}`}>
      <span className="absolute left-[18%] top-0 h-7 w-0.5 bg-wood-dark" aria-hidden />
      <span className="absolute right-[18%] top-0 h-7 w-0.5 bg-wood-dark" aria-hidden />
      <div className="wood rounded-2xl px-6 py-3 shadow-[0_6px_0_#4A2D12] ring-2 ring-wood-dark/50" style={{ transform: `rotate(${tilt}deg)` }}>
        {children}
      </div>
    </div>
  );
}
