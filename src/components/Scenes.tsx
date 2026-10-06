import type { ReactNode } from "react";
import { Owl } from "./Owl";

// Illustrated scenes of school life, drawn in SVG (used instead of photos).

function Frame({ children, sky, label }: { children: ReactNode; sky: [string, string]; label: string }) {
  const id = `sky-${label.replace(/\W+/g, "")}`;
  return (
    <svg viewBox="0 0 400 260" className="block h-auto w-full" role="img" aria-label={label}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#${id})`} />
      {children}
    </svg>
  );
}

const Hills = ({ c1 = "#3A8A2E", c2 = "#2E7A36" }: { c1?: string; c2?: string }) => (
  <>
    <path d="M0 200 C 80 170, 150 190, 210 200 C 280 175, 340 180, 400 195 L400 260 L0 260 Z" fill={c1} />
    <path d="M0 230 C 90 210, 200 225, 260 232 C 320 220, 370 222, 400 228 L400 260 L0 260 Z" fill={c2} />
  </>
);

const Tuft = ({ x, y, c = "#245A1C" }: { x: number; y: number; c?: string }) => (
  <path d={`M${x} ${y} l4 -14 l3 12 l4 -16 l3 18 l4 -12 l2 12 Z`} fill={c} />
);

export function LibraryScene() {
  return (
    <Frame sky={["#FFE7A8", "#FBF6E6"]} label="The treetop library">
      <circle cx="330" cy="60" r="34" fill="#FFB320" opacity="0.6" />
      <Hills />
      <path d="M180 260 L188 120 L212 120 L220 260 Z" fill="#7A4B22" />
      <circle cx="200" cy="90" r="80" fill="#2E8B3E" />
      <circle cx="140" cy="110" r="46" fill="#3A9A45" />
      <circle cx="262" cy="108" r="48" fill="#3A9A45" />
      <rect x="128" y="112" width="144" height="70" rx="8" fill="#C08A4E" stroke="#5A3818" strokeWidth="4" />
      <path d="M128 147 H272" stroke="#5A3818" strokeWidth="4" />
      {[["#C2185B", 136], ["#6A2C91", 150], ["#FFB320", 162], ["#1D6B42", 176], ["#C2185B", 188], ["#5FAE3A", 202]].map(([c, x]) => (
        <rect key={`a${x}`} x={x as number} y={118} width="11" height="27" rx="2" fill={c as string} />
      ))}
      {[["#FFB320", 212], ["#6A2C91", 226], ["#1D6B42", 238], ["#C2185B", 252]].map(([c, x]) => (
        <rect key={`b${x}`} x={x as number} y={154} width="11" height="26" rx="2" fill={c as string} />
      ))}
      <Owl x="214" y="108" width="52" height="58" book />
      <Tuft x={40} y={236} />
      <Tuft x={320} y={240} />
    </Frame>
  );
}

export function SportsScene() {
  return (
    <Frame sky={["#BFE6F2", "#F2FBE8"]} label="Sports day in the clearing">
      <circle cx="70" cy="56" r="28" fill="#FFB320" />
      <path d="M0 40 Q 100 70, 200 44 T 400 44" stroke="#5A3818" strokeWidth="2" fill="none" />
      {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380].map((x, i) => (
        <path key={x} d={`M${x - 12} ${48 + Math.sin(i) * 6} l12 22 l12 -22 Z`} fill={["#C2185B", "#FFB320", "#6A2C91", "#3A8A2E"][i % 4]} />
      ))}
      <path d="M0 170 C 120 150, 280 150, 400 170 L400 260 L0 260 Z" fill="#5FAE3A" />
      <path d="M-10 260 C 100 200, 300 200, 410 260" stroke="#E8664D" strokeWidth="44" fill="none" />
      <path d="M-10 260 C 100 200, 300 200, 410 260" stroke="#fff" strokeWidth="2" strokeDasharray="10 8" fill="none" />
      <g transform="translate(270 96)">
        <path d="M0 0 H50 V14 C 50 40, 36 52, 25 52 C 14 52, 0 40, 0 14 Z" fill="#FFB320" stroke="#B87800" strokeWidth="3" />
        <path d="M0 8 C -16 8, -16 30, 4 30 M50 8 C 66 8, 66 30, 46 30" stroke="#B87800" strokeWidth="4" fill="none" />
        <rect x="18" y="52" width="14" height="12" fill="#B87800" />
        <rect x="8" y="64" width="34" height="10" rx="2" fill="#5A3818" />
        <text x="25" y="30" textAnchor="middle" fontSize="18" fontWeight="800" fill="#7A4B00">1</text>
      </g>
      <g transform="translate(110 110)">
        <rect x="0" y="0" width="8" height="70" fill="#5A3818" />
        <path d="M8 2 L60 14 L8 28 Z" fill="#C2185B" />
      </g>
      <circle cx="190" cy="150" r="14" fill="#fff" stroke="#2A1C12" strokeWidth="3" />
      <path d="M180 142 L192 150 L186 162 M200 144 L192 150" stroke="#2A1C12" strokeWidth="2" fill="none" />
    </Frame>
  );
}

export function GardenScene() {
  return (
    <Frame sky={["#DDF2C9", "#FBF6E6"]} label="Science in the school garden">
      <Hills c1="#7CC24A" c2="#5FAE3A" />
      <rect x="40" y="170" width="320" height="18" rx="6" fill="#8A5A2B" />
      {[80, 160, 240, 320].map((x, i) => (
        <g key={x} transform={`translate(${x} 170)`}>
          <path d="M-22 0 L22 0 L16 34 L-16 34 Z" fill={["#C2185B", "#FFB320", "#6A2C91", "#E8664D"][i]} />
          <path d={`M0 0 C 0 -${20 + i * 12}, 0 -${30 + i * 12}, 0 -${34 + i * 14}`} stroke="#2E7A36" strokeWidth="4" />
          <path d={`M0 -${14 + i * 6} c -14 -10, -24 -2, -24 4 c 10 4, 18 2, 24 -4 Z`} fill="#3A8A2E" />
          <path d={`M0 -${22 + i * 8} c 14 -10, 24 -2, 24 4 c -10 4, -18 2, -24 -4 Z`} fill="#5FAE3A" />
          {i === 3 && <circle cx="0" cy="-80" r="12" fill="#FFB320" stroke="#E08A00" strokeWidth="4" />}
        </g>
      ))}
      <g transform="translate(250 50) rotate(20)">
        <circle r="28" fill="#DFF3FF" fillOpacity="0.7" stroke="#5A3818" strokeWidth="7" />
        <rect x="-5" y="30" width="10" height="46" rx="4" fill="#5A3818" />
      </g>
      <g transform="translate(110 70)">
        <path d="M0 0 C -20 -20, -34 0, -10 10 C -30 20, -14 34, 0 10 C 14 34, 30 20, 10 10 C 34 0, 20 -20, 0 0 Z" fill="#B98BD3" stroke="#6A2C91" strokeWidth="2" />
        <path d="M0 -6 V 16" stroke="#2A1C12" strokeWidth="3" strokeLinecap="round" />
      </g>
    </Frame>
  );
}

export function MusicScene() {
  return (
    <Frame sky={["#FFC98A", "#FFF0C7"]} label="Music under the baobab tree">
      <circle cx="320" cy="70" r="40" fill="#FFB320" opacity="0.7" />
      <Hills c1="#C99A4E" c2="#A8783A" />
      <path d="M130 240 C 140 190, 136 140, 122 110 L 198 110 C 184 140, 180 190, 190 240 Z" fill="#8A5A2B" />
      <path d="M126 112 C 100 90, 80 92, 60 80 M140 110 C 132 80, 118 70, 110 50 M160 110 V 60 M180 110 C 190 80, 206 70, 214 52 M194 112 C 220 92, 240 92, 262 82" stroke="#8A5A2B" strokeWidth="9" strokeLinecap="round" fill="none" />
      {[[60, 72], [104, 44], [160, 48], [218, 44], [264, 74]].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx="30" ry="16" fill="#3A8A2E" />
      ))}
      <g transform="translate(250 166)">
        <path d="M-26 -30 C -14 -22, 14 -22, 26 -30 L 18 30 C 8 36, -8 36, -18 30 Z" fill="#C2185B" />
        <ellipse cx="0" cy="-30" rx="26" ry="8" fill="#FFF0C7" stroke="#5A3818" strokeWidth="3" />
        <path d="M-22 -24 L18 28 M22 -24 L-18 28" stroke="#5A3818" strokeWidth="2" />
      </g>
      <g transform="translate(320 176)">
        <path d="M-18 -26 H18 L 12 26 H -12 Z" fill="#6A2C91" />
        <ellipse cx="0" cy="-26" rx="18" ry="6" fill="#FFF0C7" stroke="#5A3818" strokeWidth="3" />
      </g>
      {[[230, 100, "♪"], [272, 84, "♫"], [350, 118, "♪"], [300, 126, "♩"]].map(([x, y, n]) => (
        <text key={`${x}`} x={x as number} y={y as number} fontSize="28" fill="#5A3818" fontWeight="700">{n}</text>
      ))}
    </Frame>
  );
}

export function NightScene() {
  return (
    <Frame sky={["#0A2A1C", "#1D4E36"]} label="Boarding cabins at night">
      <circle cx="320" cy="56" r="26" fill="#FFF4C8" />
      {[[40, 30], [90, 60], [150, 24], [210, 52], [260, 20], [370, 100], [30, 100], [120, 100]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#FFF4C8" />
      ))}
      <path d="M0 190 C 100 170, 300 170, 400 190 L400 260 L0 260 Z" fill="#14502F" />
      {[60, 170, 280].map((x, i) => (
        <g key={x} transform={`translate(${x} ${150 + (i % 2) * 8})`}>
          <rect x="0" y="20" width="80" height="54" fill="#8A5A2B" />
          <path d="M-8 24 L40 -10 L88 24 Z" fill={["#6A2C91", "#C2185B", "#3A8A2E"][i]} />
          <rect x="12" y="34" width="20" height="18" rx="3" fill="#FFE27A" />
          <rect x="48" y="44" width="20" height="30" rx="3" fill="#5A3818" />
        </g>
      ))}
      {[[110, 130], [240, 110], [350, 150], [40, 150], [200, 210]].map(([x, y]) => (
        <circle key={`f${x}`} cx={x} cy={y} r="3.5" fill="#FFE27A" className="animate-pulse" />
      ))}
      <Owl x="330" y="160" width="44" height="48" hat={false} />
    </Frame>
  );
}

export function ArtScene() {
  return (
    <Frame sky={["#E6D6F5", "#FBF6E6"]} label="Painting by the river">
      <Hills c1="#5FAE3A" c2="#3A8A2E" />
      <path d="M0 214 C 120 196, 250 240, 400 214 L 400 236 C 250 262, 120 220, 0 238 Z" fill="#7BC6E0" />
      <g transform="translate(150 70)">
        <path d="M10 140 L50 0 M90 140 L50 0 M50 0 V 150" stroke="#5A3818" strokeWidth="6" strokeLinecap="round" />
        <rect x="6" y="20" width="88" height="70" rx="4" fill="#fff" stroke="#8A5A2B" strokeWidth="5" />
        <circle cx="70" cy="40" r="10" fill="#FFB320" />
        <path d="M10 86 C 30 60, 50 66, 60 80 C 70 70, 84 72, 92 86 Z" fill="#3A8A2E" />
        <path d="M40 56 c 6 -6, 12 -6, 16 0" stroke="#6A2C91" strokeWidth="3" fill="none" />
      </g>
      <g transform="translate(290 170)">
        <path d="M0 0 C -30 -6, -40 30, -10 36 C 10 40, 30 30, 34 14 C 38 0, 20 4, 0 0 Z" fill="#F3E3C3" stroke="#8A5A2B" strokeWidth="3" />
        <circle cx="-12" cy="10" r="5" fill="#C2185B" />
        <circle cx="4" cy="22" r="5" fill="#FFB320" />
        <circle cx="18" cy="12" r="5" fill="#6A2C91" />
        <circle cx="-14" cy="26" r="5" fill="#3A8A2E" />
      </g>
      <Tuft x={60} y={200} />
      <Tuft x={340} y={206} />
    </Frame>
  );
}

export function RobotScene() {
  return (
    <Frame sky={["#CDEBD8", "#FBF6E6"]} label="Robotics club in the workshop">
      <rect x="0" y="190" width="400" height="70" fill="#C08A4E" />
      <path d="M0 190 H400" stroke="#8A5A2B" strokeWidth="6" />
      <g transform="translate(200 70)">
        <path d="M0 -10 V -30" stroke="#5A3818" strokeWidth="4" />
        <circle cx="0" cy="-34" r="7" fill="#C2185B" className="animate-pulse" />
        <rect x="-44" y="-10" width="88" height="62" rx="16" fill="#6A2C91" />
        <rect x="-32" y="2" width="64" height="34" rx="10" fill="#EBDDF5" />
        <circle cx="-14" cy="19" r="7" fill="#2A1C12" />
        <circle cx="14" cy="19" r="7" fill="#2A1C12" />
        <rect x="-36" y="56" width="72" height="56" rx="12" fill="#1D6B42" />
        <circle cx="0" cy="84" r="12" fill="#FFB320" />
        <path d="M-36 66 L -64 90 M36 66 L 64 44" stroke="#1D6B42" strokeWidth="10" strokeLinecap="round" />
        <rect x="-30" y="112" width="18" height="10" fill="#5A3818" />
        <rect x="12" y="112" width="18" height="10" fill="#5A3818" />
      </g>
      {[[60, 160], [330, 150]].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <circle r="22" fill="none" stroke="#8A5A2B" strokeWidth="8" strokeDasharray="8 5" />
          <circle r="7" fill="#8A5A2B" />
        </g>
      ))}
    </Frame>
  );
}

export function GraduationScene() {
  return (
    <Frame sky={["#FFD7E6", "#FFF0C7"]} label="Graduation day in the clearing">
      <Hills />
      {[[70, 70, -20], [160, 40, 15], [250, 64, -8], [330, 36, 22]].map(([x, y, r]) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
          <polygon points="0,-12 36,0 0,12 -36,0" fill="#2A1C12" />
          <path d="M-14 4 V 14 C -4 20, 4 20, 14 14 V 4" fill="#3B2818" />
          <path d="M0 0 L 26 6 V 22" stroke="#FFB320" strokeWidth="3" fill="none" />
        </g>
      ))}
      {[[40, 120, "#C2185B"], [120, 110, "#FFB320"], [210, 130, "#6A2C91"], [300, 110, "#3A8A2E"], [370, 128, "#C2185B"], [90, 150, "#6A2C91"], [260, 156, "#FFB320"]].map(([x, y, c]) => (
        <rect key={`${x}-${y}`} x={x as number} y={y as number} width="8" height="12" fill={c as string} transform={`rotate(30 ${x} ${y})`} />
      ))}
      <Owl x="160" y="140" width="80" height="88" />
    </Frame>
  );
}

export const GALLERY = [
  { Scene: LibraryScene, caption: "The treetop library", text: "Story time with Professor Hoot, high in the branches.", tone: "bg-sun-soft" },
  { Scene: SportsScene, caption: "Sports day in the clearing", text: "Races, relays and a very shiny trophy.", tone: "bg-sky-soft" },
  { Scene: GardenScene, caption: "Science in the garden", text: "Growing beans and spotting butterflies.", tone: "bg-grass-soft" },
  { Scene: MusicScene, caption: "Music under the baobab", text: "Drumming circles every Friday afternoon.", tone: "bg-sun-soft" },
  { Scene: NightScene, caption: "Boarding cabins at night", text: "Fireflies, cocoa and lights-out stories.", tone: "bg-grape-soft" },
  { Scene: ArtScene, caption: "Painting by the river", text: "Our young artists paint what they see.", tone: "bg-coral-soft" },
  { Scene: RobotScene, caption: "Robotics club", text: "Building Bolt, our friendly classroom robot.", tone: "bg-sky-soft" },
  { Scene: GraduationScene, caption: "Graduation day", text: "Caps in the air for our wise young owls.", tone: "bg-coral-soft" },
];
