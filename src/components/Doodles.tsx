import type { CSSProperties, ReactNode } from "react";

// Crayon box used by every drawing on the site.
export const C = {
  ink: "#2A2B33",
  paper: "#FFFEF9",
  sun: "#FFC83D",
  sky: "#1F5FC4",
  skyL: "#9CC7FF",
  grass: "#3FAE5F",
  grassL: "#9EDDAE",
  coral: "#E5484D",
  orange: "#FF8A3D",
  grape: "#8A5CDB",
  pink: "#FF9EB5",
  wood: "#F4C690",
  brown: "#8B5A3C",
  steel: "#C9CED6",
};

const SKIN = ["#8D5524", "#5C3A1E", "#C68642", "#A0663B", "#6B4226"];

const line = { stroke: C.ink, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/* ---------------- small doodles ---------------- */

export function StarShape({ x, y, r = 10, fill = C.sun }: { x: number; y: number; r?: number; fill?: string }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
  }).join(" ");
  return <polygon points={pts} fill={fill} {...line} strokeWidth={2.5} />;
}

export function CloudShape({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M12 42 Q0 42 2 31 Q5 19 19 21 Q23 5 41 9 Q54 0 64 13 Q80 10 81 27 Q93 31 87 42 Z"
      fill="#fff"
      {...line}
    />
  );
}

export function SunShape({ x, y, r = 30, face = true, spin = false }: { x: number; y: number; r?: number; face?: boolean; spin?: boolean }) {
  return (
    <g>
      <g className={spin ? "animate-spin-slow" : undefined} style={{ transformOrigin: `${x}px ${y}px` }}>
        {Array.from({ length: 10 }, (_, i) => {
          const a = (Math.PI / 5) * i;
          return (
            <line
              key={i}
              x1={x + Math.cos(a) * (r + 8)}
              y1={y + Math.sin(a) * (r + 8)}
              x2={x + Math.cos(a) * (r + 22)}
              y2={y + Math.sin(a) * (r + 22)}
              {...line}
              stroke={C.orange}
              strokeWidth={5}
            />
          );
        })}
      </g>
      <circle cx={x} cy={y} r={r} fill={C.sun} {...line} />
      {face && (
        <>
          <circle cx={x - r * 0.33} cy={y - r * 0.15} r={2.8} fill={C.ink} />
          <circle cx={x + r * 0.33} cy={y - r * 0.15} r={2.8} fill={C.ink} />
          <path d={`M${x - r * 0.38} ${y + r * 0.22} Q${x} ${y + r * 0.6} ${x + r * 0.38} ${y + r * 0.22}`} fill="none" {...line} strokeWidth={2.5} />
        </>
      )}
    </g>
  );
}

export function PlaneShape({ x = 0, y = 0, s = 1, className, style }: { x?: number; y?: number; s?: number; className?: string; style?: CSSProperties }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={className} style={style}>
        <path d="M0 16 L58 0 L16 36 L21 24 Z" fill="#fff" {...line} />
        <path d="M21 24 L58 0 L30 30 Z" fill={C.skyL} {...line} />
      </g>
    </g>
  );
}

export function HeartShape({ x, y, s = 1, fill = C.coral }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 6 C0 -4 14 -4 14 6 C14 -4 28 -4 28 6 C28 16 14 22 14 28 C14 22 0 16 0 6 Z"
      fill={fill}
      {...line}
      strokeWidth={2.5}
    />
  );
}

function Kid({ x, y, skin = 0, top = C.coral, girl = false, wave = false, s = 1 }: { x: number; y: number; skin?: number; top?: string; girl?: boolean; wave?: boolean; s?: number }) {
  const sk = SKIN[skin % SKIN.length];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1={-7} y1={-30} x2={-9} y2={-2} {...line} />
      <line x1={7} y1={-30} x2={9} y2={-2} {...line} />
      <ellipse cx={-12} cy={0} rx={7} ry={4} fill={C.ink} />
      <ellipse cx={12} cy={0} rx={7} ry={4} fill={C.ink} />
      <line x1={-12} y1={-54} x2={-27} y2={-36} {...line} />
      <line x1={12} y1={-54} x2={wave ? 28 : 27} y2={wave ? -76 : -36} {...line} />
      <circle cx={-28} cy={-35} r={4} fill={sk} {...line} strokeWidth={2} />
      <circle cx={wave ? 29 : 28} cy={wave ? -78 : -35} r={4} fill={sk} {...line} strokeWidth={2} />
      {girl ? (
        <path d="M0 -62 L-20 -26 L20 -26 Z" fill={top} {...line} />
      ) : (
        <>
          <rect x={-14} y={-62} width={28} height={30} rx={7} fill={top} {...line} />
          <rect x={-12} y={-34} width={24} height={8} rx={3} fill={C.sky} {...line} strokeWidth={2.5} />
        </>
      )}
      {girl && (
        <>
          <circle cx={-15} cy={-86} r={7} fill={C.ink} />
          <circle cx={15} cy={-86} r={7} fill={C.ink} />
        </>
      )}
      <circle cx={0} cy={-76} r={15} fill={sk} {...line} />
      {!girl && <path d="M-15 -78 Q0 -100 15 -78 Q4 -86 -15 -78 Z" fill={C.ink} {...line} strokeWidth={2} />}
      <circle cx={-5} cy={-77} r={2} fill="#fff" />
      <circle cx={5} cy={-77} r={2} fill="#fff" />
      <path d="M-5 -70 Q0 -65 5 -70" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

/* ---------------- Pip the pencil ---------------- */

export function PipShape({ wave = true, mood = "happy" }: { wave?: boolean; mood?: "happy" | "wow" | "sleepy" }) {
  return (
    <g>
      {/* arms */}
      <path d="M30 96 Q16 102 10 116" fill="none" {...line} />
      <circle cx={10} cy={118} r={6} fill={C.paper} {...line} strokeWidth={2.5} />
      <g style={wave ? { transformOrigin: "70px 94px", animation: "wave 1.8s ease-in-out infinite" } : undefined}>
        <path d="M70 94 Q84 84 90 66" fill="none" {...line} />
        <circle cx={91} cy={63} r={6} fill={C.paper} {...line} strokeWidth={2.5} />
      </g>
      {/* eraser + metal band */}
      <rect x={30} y={8} width={40} height={24} rx={9} fill={C.pink} {...line} />
      <rect x={27} y={28} width={46} height={16} rx={3} fill={C.steel} {...line} />
      <line x1={27} y1={36} x2={73} y2={36} stroke={C.ink} strokeWidth={1.5} opacity={0.5} />
      {/* yellow body */}
      <rect x={28} y={44} width={44} height={88} fill={C.sun} {...line} />
      <line x1={42} y1={46} x2={42} y2={130} stroke={C.ink} strokeWidth={1.5} opacity={0.25} />
      <line x1={58} y1={46} x2={58} y2={130} stroke={C.ink} strokeWidth={1.5} opacity={0.25} />
      {/* sharpened tip */}
      <path d="M28 132 L72 132 L50 180 Z" fill={C.wood} {...line} />
      <path d="M41 160 L59 160 L50 180 Z" fill={C.ink} {...line} />
      {/* face */}
      {mood === "sleepy" ? (
        <>
          <path d="M36 72 Q41 76 46 72" fill="none" {...line} strokeWidth={2.5} />
          <path d="M54 72 Q59 76 64 72" fill="none" {...line} strokeWidth={2.5} />
        </>
      ) : (
        <>
          <circle cx={41} cy={71} r={5} fill={C.ink} />
          <circle cx={59} cy={71} r={5} fill={C.ink} />
          <circle cx={42.6} cy={69.2} r={1.6} fill="#fff" />
          <circle cx={60.6} cy={69.2} r={1.6} fill="#fff" />
        </>
      )}
      <circle cx={34} cy={84} r={5} fill={C.pink} opacity={0.8} />
      <circle cx={66} cy={84} r={5} fill={C.pink} opacity={0.8} />
      {mood === "wow" ? (
        <ellipse cx={50} cy={88} rx={5} ry={6.5} fill={C.coral} {...line} strokeWidth={2.5} />
      ) : (
        <path d="M40 84 Q50 97 60 84" fill={C.coral} {...line} strokeWidth={2.5} />
      )}
    </g>
  );
}

/** Pip, the Doodlebrook pencil mascot. */
export function Pip({ className = "", wave = true, mood = "happy", title }: { className?: string; wave?: boolean; mood?: "happy" | "wow" | "sleepy"; title?: string }) {
  return (
    <svg viewBox="0 0 100 186" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <PipShape wave={wave} mood={mood} />
    </svg>
  );
}

/** Pip with a speech bubble. */
export function PipSays({ children, mood = "happy", className = "" }: { children: ReactNode; mood?: "happy" | "wow" | "sleepy"; className?: string }) {
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      <Pip className="h-24 w-auto shrink-0 animate-bob" mood={mood} />
      <div className="relative mb-10 wobbly border-2 border-ink bg-paper px-4 py-2.5 font-display text-lg leading-snug shadow-[3px_3px_0_rgb(42_43_51/0.15)]">
        <span className="absolute -left-[11px] bottom-3 h-4 w-4 rotate-45 border-b-2 border-l-2 border-ink bg-paper" aria-hidden />
        {children}
      </div>
    </div>
  );
}

/* ---------------- logo ---------------- */

/** The Doodlebrook badge: a crayon sun with a pencil "D" drawn through it. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M32 3 C48 2 61 14 61 31 C62 48 49 61 32 61 C15 62 3 49 3 32 C2 15 15 4 32 3 Z" fill={C.sun} {...line} />
      <path d="M8 40 Q20 30 32 40 T56 40" fill="none" stroke={C.sky} strokeWidth={5} strokeLinecap="round" />
      <path d="M9 48 Q21 38 32 48 T55 48" fill="none" stroke={C.grass} strokeWidth={5} strokeLinecap="round" />
      <path d="M22 14 L22 34 M22 14 C38 12 44 20 43 25 C42 32 34 35 22 34" fill="none" {...line} strokeWidth={4} />
      <g transform="rotate(38 46 16)">
        <rect x={40} y={4} width={9} height={22} rx={1.5} fill={C.coral} {...line} strokeWidth={2} />
        <path d="M40 26 L49 26 L44.5 34 Z" fill={C.wood} {...line} strokeWidth={2} />
      </g>
    </svg>
  );
}

/* ---------------- lines ---------------- */

/** A crayon scribble that draws itself under a word. */
export function Scribble({ color = C.coral, className = "" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 240 24" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        d="M4 15 C40 5 78 21 118 11 S196 5 236 13"
        pathLength={100}
        className="draw-in"
        style={{ "--len": 100 } as CSSProperties}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Squiggle({ color = C.sky, className = "" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 16" className={className} aria-hidden>
      <path d="M3 8 Q12 1 21 8 T39 8 T57 8 T75 8 T93 8 T117 8" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

/** A crayon, for decoration. */
export function Crayon({ color = C.coral, className = "" }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 28" className={className} aria-hidden>
      <path d="M14 4 L96 4 L96 24 L14 24 Q8 14 14 4 Z" fill={color} {...line} />
      <path d="M96 4 L116 14 L96 24 Z" fill={color} {...line} />
      <path d="M30 4 L30 24 M80 4 L80 24" {...line} strokeWidth={2} opacity={0.6} />
      <path d="M40 10 L70 10 M40 18 L64 18" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
    </svg>
  );
}

/* ---------------- the big hero drawing ---------------- */

export function HeroScene({ className = "" }: { className?: string }) {
  const rainbow = [C.coral, C.orange, C.sun, C.grass, C.sky];
  return (
    <svg viewBox="0 0 560 460" className={className} role="img" aria-label="A crayon drawing of Doodlebrook: a little school under a rainbow, with children, a tree and Pip the pencil waving">
      <g filter="url(#wobble)">
        {rainbow.map((c, i) => {
          const r = 215 - i * 22;
          return <path key={c} d={`M${255 - r} 372 A${r} ${r} 0 0 1 ${255 + r} 372`} fill="none" stroke={c} strokeWidth={20} strokeLinecap="round" opacity={0.9} />;
        })}
        <SunShape x={480} y={78} r={34} spin />
        <g className="animate-float">
          <CloudShape x={40} y={52} s={1.1} />
        </g>
        <g className="animate-float [animation-delay:2s]">
          <CloudShape x={300} y={18} s={0.9} />
        </g>
        <StarShape x={36} y={210} r={11} fill={C.grape} />
        <StarShape x={530} y={200} r={12} />
        <StarShape x={398} y={150} r={8} fill={C.pink} />

        {/* ground */}
        <path d="M-4 382 Q140 352 280 374 T564 364 L564 464 L-4 464 Z" fill={C.grassL} {...line} />
        <path d="M40 420 l6 -10 l6 10 M300 430 l6 -10 l6 10 M480 412 l6 -10 l6 10" fill="none" stroke={C.grass} strokeWidth={3} strokeLinecap="round" />

        {/* tree */}
        <rect x={86} y={300} width={18} height={80} rx={4} fill={C.brown} {...line} />
        <path d="M95 300 C50 306 46 262 70 252 C60 222 100 208 116 230 C146 222 152 262 132 274 C142 300 116 310 95 300 Z" fill={C.grass} {...line} />
        <circle cx={80} cy={262} r={6} fill={C.coral} {...line} strokeWidth={2} />
        <circle cx={120} cy={250} r={6} fill={C.coral} {...line} strokeWidth={2} />
        <circle cx={108} cy={284} r={6} fill={C.coral} {...line} strokeWidth={2} />

        {/* school house */}
        <rect x={172} y={262} width={150} height={114} fill="#FFE9B3" {...line} />
        <path d="M156 266 L247 198 L338 266 Z" fill={C.coral} {...line} />
        <text x={247} y={252} textAnchor="middle" fontFamily="var(--font-caveat)" fontWeight={700} fontSize={22} fill="#fff">Doodlebrook</text>
        <line x1={247} y1={198} x2={247} y2={160} {...line} />
        <path d="M247 160 L278 169 L247 180 Z" fill={C.sun} {...line} />
        <rect x={229} y={318} width={36} height={58} rx={3} fill={C.sky} {...line} />
        <circle cx={257} cy={348} r={3} fill={C.sun} />
        {[188, 280].map((wx) => (
          <g key={wx}>
            <rect x={wx} y={284} width={28} height={26} fill={C.skyL} {...line} />
            <path d={`M${wx + 14} 284 L${wx + 14} 310 M${wx} 297 L${wx + 28} 297`} {...line} strokeWidth={2} />
          </g>
        ))}

        <Kid x={150} y={392} skin={0} top={C.grape} girl wave />
        <Kid x={352} y={392} skin={2} top={C.sky} />
      </g>

      {/* dashed flight path and paper plane */}
      <path d="M24 318 C70 250 6 220 54 196 C86 180 112 210 84 222 C62 230 52 206 76 190" fill="none" stroke={C.ink} strokeWidth={2.5} strokeDasharray="6 9" strokeLinecap="round" opacity={0.55} />
      <PlaneShape x={78} y={150} s={1.15} className="animate-fly" />

      {/* Pip */}
      <g transform="translate(412 210) scale(0.95)">
        <g className="animate-bob">
          <PipShape />
        </g>
      </g>
    </svg>
  );
}

/* ---------------- gallery scenes ---------------- */

function Frame({ bg, children, label, className }: { bg: string; children: ReactNode; label: string; className?: string }) {
  return (
    <svg viewBox="0 0 320 240" className={className} role="img" aria-label={label}>
      <rect width={320} height={240} fill={bg} />
      <g filter="url(#wobble)">{children}</g>
    </svg>
  );
}

function ArtScene() {
  return (
    <>
      <path d="M0 200 L320 200 L320 240 L0 240 Z" fill={C.wood} {...line} />
      <line x1={150} y1={60} x2={120} y2={206} {...line} strokeWidth={5} stroke={C.brown} />
      <line x1={170} y1={60} x2={200} y2={206} {...line} strokeWidth={5} stroke={C.brown} />
      <rect x={100} y={40} width={120} height={100} fill="#fff" {...line} />
      {[C.coral, C.sun, C.grass, C.sky].map((c, i) => (
        <path key={c} d={`M${120 + i * 9} 126 A${40 - i * 9} ${40 - i * 9} 0 0 1 ${200 - i * 9} 126`} fill="none" stroke={c} strokeWidth={8} />
      ))}
      <rect x={96} y={138} width={128} height={8} fill={C.brown} {...line} />
      <Kid x={262} y={214} skin={1} top={C.coral} girl s={1.1} />
      <line x1={232} y1={176} x2={214} y2={136} stroke={C.brown} strokeWidth={4} strokeLinecap="round" />
      <circle cx={212} cy={132} r={5} fill={C.grape} />
      <circle cx={40} cy={60} r={14} fill={C.coral} opacity={0.85} />
      <circle cx={62} cy={88} r={9} fill={C.sky} opacity={0.85} />
      <circle cx={34} cy={110} r={11} fill={C.sun} opacity={0.9} />
      <path d="M28 214 Q40 196 58 210 Q76 222 60 228 Q40 232 28 214 Z" fill={C.grape} {...line} strokeWidth={2.5} />
    </>
  );
}

function SportsScene() {
  return (
    <>
      <SunShape x={270} y={46} r={20} face={false} />
      <path d="M0 150 Q160 120 320 150 L320 240 L0 240 Z" fill={C.coral} opacity={0.9} {...line} />
      <path d="M0 178 Q160 150 320 178 M0 208 Q160 182 320 208" fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="14 10" />
      <line x1={250} y1={92} x2={250} y2={196} {...line} />
      <line x1={300} y1={92} x2={300} y2={196} {...line} />
      <path d="M250 112 Q275 124 300 112" fill="none" stroke={C.sun} strokeWidth={6} strokeLinecap="round" />
      <g transform="rotate(-8 140 200)">
        <Kid x={140} y={196} skin={3} top={C.sun} wave />
      </g>
      <Kid x={64} y={206} skin={0} top={C.grape} girl s={0.85} />
      <path d="M104 140 L84 140 M108 156 L80 156 M104 172 L88 172" stroke={C.ink} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
      <CloudShape x={30} y={24} s={0.8} />
    </>
  );
}

function ScienceScene() {
  return (
    <>
      <rect x={0} y={176} width={320} height={64} fill={C.wood} {...line} />
      <path d="M90 180 L130 98 L160 98 L200 180 Z" fill={C.brown} {...line} />
      <path d="M130 98 Q120 60 136 44 Q146 66 150 40 Q160 64 170 48 Q176 74 160 98 Z" fill={C.coral} {...line} />
      <path d="M136 98 Q130 120 140 136 M156 98 Q164 116 154 132" fill="none" stroke={C.coral} strokeWidth={6} strokeLinecap="round" />
      {[C.grass, C.grape, C.sky].map((c, i) => (
        <g key={c} transform={`translate(${222 + i * 26} 120)`}>
          <path d="M0 0 L0 46 Q8 58 16 46 L16 0" fill="#fff" {...line} />
          <path d="M0 24 L0 46 Q8 58 16 46 L16 24 Z" fill={c} />
          <path d="M0 0 L0 46 Q8 58 16 46 L16 0" fill="none" {...line} />
        </g>
      ))}
      <Kid x={48} y={214} skin={4} top={C.sky} wave />
      <StarShape x={190} y={40} r={10} />
      <StarShape x={100} y={30} r={7} fill={C.pink} />
    </>
  );
}

function ReadingScene() {
  const books = [C.coral, C.sky, C.sun, C.grass, C.grape, C.orange, C.pink];
  return (
    <>
      <rect x={20} y={30} width={130} height={150} fill={C.wood} {...line} />
      {[0, 1].map((row) => (
        <g key={row}>
          <line x1={20} y1={100 + row * 70} x2={150} y2={100 + row * 70} {...line} />
          {books.map((c, i) => (
            <rect key={c} x={28 + i * 17} y={52 + row * 70 + (i % 3) * 4} width={14} height={48 - (i % 3) * 4} fill={c} {...line} strokeWidth={2} />
          ))}
        </g>
      ))}
      <path d="M170 220 Q170 150 240 150 Q310 150 310 220 Z" fill={C.grape} {...line} />
      <Kid x={240} y={210} skin={2} top={C.sun} girl s={0.95} />
      <path d="M210 160 L240 170 L270 160 L270 186 L240 196 L210 186 Z" fill="#fff" {...line} />
      <line x1={240} y1={170} x2={240} y2={196} {...line} strokeWidth={2} />
      <path d="M262 70 L286 40 L310 70 Z" fill={C.sun} {...line} />
      <line x1={286} y1={70} x2={286} y2={120} {...line} />
      <path d="M274 92 Q286 100 298 92" fill="none" stroke={C.sun} strokeWidth={3} opacity={0.8} />
    </>
  );
}

function GardenScene() {
  return (
    <>
      <SunShape x={268} y={44} r={22} />
      <path d="M0 170 Q160 150 320 170 L320 240 L0 240 Z" fill={C.brown} {...line} />
      {[44, 104, 164].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={170} x2={x} y2={92 + i * 8} stroke={C.grass} strokeWidth={5} strokeLinecap="round" />
          <path d={`M${x} ${140} Q${x - 22} ${128} ${x - 26} ${140} Q${x - 12} ${150} ${x} ${140} Z`} fill={C.grass} {...line} strokeWidth={2} />
          {Array.from({ length: 8 }, (_, k) => {
            const a = (Math.PI / 4) * k;
            const cy = 86 + i * 8;
            return <ellipse key={k} cx={x + Math.cos(a) * 15} cy={cy + Math.sin(a) * 15} rx={8} ry={5} transform={`rotate(${(a * 180) / Math.PI} ${x + Math.cos(a) * 15} ${cy + Math.sin(a) * 15})`} fill={C.sun} {...line} strokeWidth={2} />;
          })}
          <circle cx={x} cy={86 + i * 8} r={10} fill={C.brown} {...line} strokeWidth={2} />
        </g>
      ))}
      <Kid x={250} y={214} skin={1} top={C.grass} />
      <g transform="translate(196 168)">
        <path d="M0 0 L30 0 L26 30 L4 30 Z" fill={C.sky} {...line} />
        <path d="M0 6 L-18 -8" {...line} strokeWidth={4} />
        <path d="M-22 -4 l-6 6 M-20 2 l-8 4" stroke={C.skyL} strokeWidth={3} strokeLinecap="round" />
      </g>
    </>
  );
}

function MusicScene() {
  return (
    <>
      <rect x={0} y={190} width={320} height={50} fill={C.grape} opacity={0.6} />
      <ellipse cx={90} cy={176} rx={46} ry={14} fill={C.coral} {...line} />
      <path d="M44 176 L44 214 Q90 232 136 214 L136 176" fill={C.coral} {...line} />
      <path d="M44 176 Q90 192 136 176" fill="#fff" {...line} />
      <path d="M60 196 L74 214 L88 196 L102 214 L116 196" fill="none" stroke={C.sun} strokeWidth={3} />
      <line x1={120} y1={150} x2={100} y2={170} stroke={C.brown} strokeWidth={4} strokeLinecap="round" />
      <Kid x={220} y={214} skin={3} top={C.coral} girl wave />
      {[[150, 60, C.sky], [200, 40, C.grass], [260, 70, C.coral], [110, 96, C.grape]].map(([x, y, c]) => (
        <g key={`${x}`} transform={`translate(${x} ${y})`}>
          <ellipse cx={0} cy={22} rx={9} ry={7} fill={c as string} {...line} strokeWidth={2.5} />
          <line x1={8} y1={22} x2={8} y2={-6} {...line} />
          <path d="M8 -6 Q18 0 20 10" fill="none" {...line} />
        </g>
      ))}
    </>
  );
}

function SchoolScene() {
  return (
    <>
      <SunShape x={52} y={48} r={20} />
      <CloudShape x={210} y={22} s={0.8} />
      <path d="M0 196 Q160 176 320 196 L320 240 L0 240 Z" fill={C.grassL} {...line} />
      <rect x={94} y={110} width={132} height={92} fill="#FFE9B3" {...line} />
      <path d="M80 114 L160 58 L240 114 Z" fill={C.sky} {...line} />
      <rect x={146} y={150} width={28} height={52} fill={C.coral} {...line} />
      <rect x={108} y={128} width={24} height={22} fill={C.skyL} {...line} />
      <rect x={188} y={128} width={24} height={22} fill={C.skyL} {...line} />
      <line x1={160} y1={58} x2={160} y2={28} {...line} />
      <path d="M160 28 L186 36 L160 44 Z" fill={C.sun} {...line} />
      <Kid x={52} y={214} skin={0} top={C.sun} girl wave s={0.8} />
      <Kid x={272} y={214} skin={4} top={C.grape} wave s={0.8} />
    </>
  );
}

function PlanesScene() {
  return (
    <>
      <path d="M20 200 C80 120 140 220 200 120 S300 60 300 40" fill="none" stroke={C.ink} strokeWidth={2.5} strokeDasharray="6 9" opacity={0.5} />
      <PlaneShape x={70} y={120} s={1.1} />
      <PlaneShape x={210} y={52} s={0.9} />
      <CloudShape x={26} y={24} s={0.9} />
      <CloudShape x={190} y={150} s={0.7} />
      <g transform="translate(232 112) scale(0.62)">
        <PipShape wave={false} mood="wow" />
      </g>
      <StarShape x={150} y={40} r={9} />
      <StarShape x={40} y={150} r={7} fill={C.pink} />
    </>
  );
}

export const SCENES = {
  art: { label: "Painting a rainbow on art day", bg: "#FFF2BF", el: ArtScene },
  sports: { label: "Racing to the finish line on sports day", bg: "#DFEBFF", el: SportsScene },
  science: { label: "A fizzing volcano at the science fair", bg: "#ECE3FF", el: ScienceScene },
  reading: { label: "Snuggled up in the reading corner", bg: "#FFE2DE", el: ReadingScene },
  garden: { label: "Growing sunflowers in garden club", bg: "#DFEBFF", el: GardenScene },
  music: { label: "Drums and songs at music time", bg: "#FFF2BF", el: MusicScene },
  school: { label: "Our little school on Rainbow Crescent", bg: "#DBF3E2", el: SchoolScene },
  planes: { label: "Pip's paper plane competition", bg: "#FFFEF9", el: PlanesScene },
} as const;

export type SceneId = keyof typeof SCENES;

export function Scene({ id, className = "" }: { id: SceneId; className?: string }) {
  const s = SCENES[id];
  const El = s.el;
  return (
    <Frame bg={s.bg} label={s.label} className={className}>
      <El />
    </Frame>
  );
}
