import { Owl } from "./Owl";

const LEAF = "M0 0 C 10 -10, 26 -8, 30 0 C 26 8, 10 10, 0 0 Z";

function LeafClump({ x, y, r = 0, s = 1, delay = 0, colors = ["#3A8A2E", "#7CC24A", "#2E7A36"] }: { x: number; y: number; r?: number; s?: number; delay?: number; colors?: string[] }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <g className="origin-hang animate-sway" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 0 L0 26" stroke="#245A1C" strokeWidth="2" />
        <path d={LEAF} transform="translate(0 8) rotate(30)" fill={colors[0]} />
        <path d={LEAF} transform="translate(0 14) rotate(150)" fill={colors[1]} />
        <path d={LEAF} transform="translate(0 24) rotate(70)" fill={colors[2]} />
        <path d={LEAF} transform="translate(0 24) rotate(110)" fill={colors[0]} />
      </g>
    </g>
  );
}

function Berries({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="origin-hang animate-sway" style={{ animationDelay: `${delay}s` }}>
        <path d="M0 0 C 2 10, -4 18, -6 26 M0 0 C 2 12, 8 18, 10 24" stroke="#245A1C" strokeWidth="2" fill="none" />
        <circle cx="-6" cy="30" r="7" fill="#C2185B" />
        <circle cx="10" cy="28" r="7" fill="#6A2C91" />
        <circle cx="2" cy="38" r="7" fill="#C2185B" />
        <circle cx="-8" cy="27" r="2" fill="#fff" opacity="0.6" />
        <circle cx="8" cy="25" r="2" fill="#fff" opacity="0.6" />
      </g>
    </g>
  );
}

// The big illustrated Owlberry treehouse for the home page hero.
export function TreehouseScene({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 -24 600 590" className={className} role="img" aria-label="An illustrated treehouse school with Professor Hoot the owl in the window">
      {/* sunset glow */}
      <circle cx="300" cy="250" r="230" fill="#FFB320" opacity="0.18" />
      <circle cx="300" cy="250" r="160" fill="#FFB320" opacity="0.18" />
      {/* distant jungle */}
      <path d="M40 520 C 70 450, 130 440, 170 456 C 220 416, 300 430, 330 450 C 390 418, 470 430, 500 452 C 540 440, 570 470, 566 520 Z" fill="#14502F" />
      {/* trunk and roots */}
      <path d="M222 548 C 258 520, 262 470, 266 400 L 274 150 L 330 150 L 336 400 C 340 470, 344 520, 380 548 Z" fill="#7A4B22" />
      <path d="M288 160 C 284 260, 292 360, 280 520 M312 170 C 318 280, 306 380, 322 520" stroke="#5A3818" strokeWidth="4" fill="none" opacity="0.6" />
      <path d="M232 548 C 210 540, 190 548, 170 552 M370 548 C 400 538, 420 546, 440 552" stroke="#7A4B22" strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* branches */}
      <path d="M276 240 C 230 226, 180 206, 130 196" stroke="#7A4B22" strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d="M328 262 C 380 250, 430 232, 486 214" stroke="#7A4B22" strokeWidth="18" strokeLinecap="round" fill="none" />
      {/* canopy */}
      <g>
        <circle cx="300" cy="120" r="112" fill="#1D6B42" />
        <circle cx="180" cy="160" r="74" fill="#246F3A" />
        <circle cx="430" cy="160" r="78" fill="#246F3A" />
        <circle cx="228" cy="76" r="72" fill="#2E8B3E" />
        <circle cx="378" cy="74" r="74" fill="#2E8B3E" />
        <circle cx="300" cy="46" r="62" fill="#3A9A45" />
        <circle cx="120" cy="190" r="44" fill="#2E8B3E" />
        <circle cx="488" cy="196" r="46" fill="#2E8B3E" />
        <circle cx="250" cy="60" r="20" fill="#7CC24A" opacity="0.5" />
        <circle cx="360" cy="48" r="16" fill="#7CC24A" opacity="0.5" />
        <circle cx="170" cy="130" r="14" fill="#7CC24A" opacity="0.45" />
        <circle cx="440" cy="128" r="18" fill="#7CC24A" opacity="0.45" />
      </g>
      <Berries x={150} y={218} />
      <Berries x={470} y={232} delay={1.2} />
      <Berries x={360} y={180} delay={0.6} />
      <LeafClump x={96} y={222} r={10} delay={0.3} />
      <LeafClump x={520} y={230} r={-10} delay={1.4} />
      <LeafClump x={230} y={186} s={0.8} delay={2.1} />
      <LeafClump x={420} y={222} s={0.9} delay={0.9} />
      {/* string lights along the right branch */}
      <path d="M340 262 Q 400 290, 470 230" stroke="#3B2818" strokeWidth="1.5" fill="none" />
      {[[360, 272, "#FFE27A"], [384, 279, "#F06BA0"], [408, 278, "#FFE27A"], [432, 268, "#B98BD3"], [454, 250, "#FFE27A"]].map(([x, y, c]) => (
        <circle key={`${x}`} cx={x as number} cy={(y as number) + 6} r="5" fill={c as string} className="animate-pulse" />
      ))}
      {/* rope swing on the left branch */}
      <g className="origin-hang animate-swing" style={{ transformOrigin: "160px 204px", transformBox: "view-box" }}>
        <path d="M146 202 L140 410 M176 206 L182 410" stroke="#C08A4E" strokeWidth="3" />
        <rect x="130" y="406" width="62" height="12" rx="4" fill="#8A5A2B" />
      </g>
      {/* platform supports */}
      <path d="M280 410 L190 346 M320 410 L420 346" stroke="#5A3818" strokeWidth="10" strokeLinecap="round" />
      {/* house */}
      <rect x="196" y="236" width="176" height="104" rx="6" fill="#C08A4E" />
      <path d="M196 262 H372 M196 288 H372 M196 314 H372" stroke="#8A5A2B" strokeWidth="2" opacity="0.7" />
      <path d="M180 244 L284 172 L388 244 Z" fill="#6A2C91" />
      <path d="M196 232 L284 182 L372 232" stroke="#4E1F6B" strokeWidth="5" fill="none" />
      <path d="M220 222 L240 210 M250 204 L272 192 M300 192 L322 204 M336 212 L356 224" stroke="#8F4FB8" strokeWidth="4" strokeLinecap="round" />
      {/* flag */}
      <path d="M284 172 L284 132" stroke="#3B2818" strokeWidth="3" />
      <g className="origin-center-box animate-swing" style={{ transformOrigin: "284px 140px", transformBox: "view-box" }}>
        <path d="M284 134 L318 142 L284 152 Z" fill="#FFB320" />
      </g>
      {/* round window with Professor Hoot */}
      <circle cx="244" cy="286" r="34" fill="#FFE9A8" stroke="#5A3818" strokeWidth="6" />
      <clipPath id="hoot-window"><circle cx="244" cy="286" r="31" /></clipPath>
      <g clipPath="url(#hoot-window)">
        <Owl x="210" y="258" width="68" height="75" />
      </g>
      {/* door */}
      <path d="M306 340 V 286 a 22 22 0 0 1 44 0 V 340 Z" fill="#5A3818" />
      <circle cx="340" cy="314" r="3.5" fill="#FFB320" />
      <rect x="296" y="248" width="64" height="18" rx="5" fill="#FFF0C7" stroke="#5A3818" strokeWidth="2" />
      <text x="328" y="261" textAnchor="middle" fontSize="11" fontWeight="800" fill="#5A3818" style={{ fontFamily: "var(--font-baloo)" }}>CLASS 1</text>
      {/* platform and railing */}
      <rect x="166" y="338" width="270" height="16" rx="5" fill="#8A5A2B" />
      <path d="M170 338 V 312 M184 338 V 312 M386 338 V 312 M400 338 V 312 M414 338 V 312 M428 338 V 312 M166 314 H 196 M372 314 H 432" stroke="#5A3818" strokeWidth="4" strokeLinecap="round" />
      {/* ladder */}
      <path d="M394 352 L404 548 M424 352 L434 548" stroke="#5A3818" strokeWidth="5" />
      {[378, 404, 430, 456, 482, 508, 534].map((y) => {
        const t = (y - 352) / 196;
        return <path key={y} d={`M${394 + t * 10} ${y} H ${424 + t * 10}`} stroke="#8A5A2B" strokeWidth="5" />;
      })}
      {/* welcome sign on the trunk */}
      <g transform="rotate(-5 300 452)">
        <path d="M262 420 L300 412 M338 420 L300 412" stroke="#3B2818" strokeWidth="2" />
        <rect x="236" y="424" width="128" height="44" rx="8" fill="#C08A4E" stroke="#5A3818" strokeWidth="3" />
        <text x="300" y="452" textAnchor="middle" fontSize="22" fontWeight="800" fill="#FFF7E6" style={{ fontFamily: "var(--font-baloo)" }}>OWLBERRY</text>
      </g>
      {/* ground bushes */}
      <ellipse cx="300" cy="550" rx="290" ry="18" fill="#0A2A1C" opacity="0.5" />
      <path d="M20 548 C 24 506, 60 494, 90 515 C 110 488, 160 490, 180 520 C 200 500, 230 505, 240 548 Z" fill="#2E8B3E" />
      <path d="M580 548 C 578 504, 540 494, 510 515 C 490 494, 450 497, 440 548 Z" fill="#2E8B3E" />
      <path d="M10 548 Q 300 538, 590 548 Q 300 562, 10 548 Z" fill="#14502F" />
      {/* flowers */}
      {[[40, 520, "#FFB320"], [130, 512, "#F06BA0"], [560, 518, "#FFB320"], [490, 524, "#B98BD3"]].map(([x, y, c]) => (
        <g key={`${x}`} transform={`translate(${x} ${y})`}>
          <circle r="6" fill={c as string} />
          <circle r="2.5" fill="#fff" />
        </g>
      ))}
    </svg>
  );
}
