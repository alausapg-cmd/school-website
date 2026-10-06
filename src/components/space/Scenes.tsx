import { useId, type ReactNode } from "react";

// Illustrated "mission photos": little SVG scenes of school life, drawn in place of real photographs.

const INK = "#161A3D";
const SKIN = ["#8D5524", "#6B3E1F", "#A86B3C", "#5A341A", "#C68642"];

type Arms = "down" | "up" | "hold" | "point";

function Kid({ x, y, s = 1, skin = SKIN[0], shirt = "#3A3FBF", hair = "#1b1208", arms = "down", puffs = false, cap }: { x: number; y: number; s?: number; skin?: string; shirt?: string; hair?: string; arms?: Arms; puffs?: boolean; cap?: string }) {
  const armPath = {
    down: "M-11 10 L-18 27 M11 10 L18 27",
    up: "M-11 10 L-21 -10 M11 10 L21 -10",
    hold: "M-11 12 L-3 21 M11 12 L3 21",
    point: "M-11 10 L-18 27 M11 10 L26 -2",
  }[arms];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-6 30 L-7 47 M6 30 L7 47" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
      <path d={armPath} stroke={skin} strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <rect x="-12" y="3" width="24" height="30" rx="10" fill={shirt} />
      {puffs && (
        <>
          <circle cx="-11" cy="-13" r="5.5" fill={hair} />
          <circle cx="11" cy="-13" r="5.5" fill={hair} />
        </>
      )}
      <circle cy="-8" r="11" fill={skin} />
      <path d="M-11 -9 A11 11 0 0 1 11 -9 Q0 -15 -11 -9 Z" fill={hair} />
      <circle cx="-4" cy="-7" r="1.5" fill={INK} />
      <circle cx="4" cy="-7" r="1.5" fill={INK} />
      <path d="M-4 -2.5 Q0 1 4 -2.5" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {cap && (
        <>
          <path d="M-14 -18 L0 -24 L14 -18 L0 -12 Z" fill={cap} />
          <rect x="-7" y="-18" width="14" height="5" fill={cap} />
          <path d="M14 -18 L15 -9" stroke="#FFD95A" strokeWidth="1.6" />
        </>
      )}
    </g>
  );
}

function Stars({ seed = 1, count = 18, h = 140 }: { seed?: number; count?: number; h?: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = (i * 97 + seed * 41) % 400;
        const y = (i * 53 + seed * 29) % h;
        return <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.8 : 1} fill={i % 5 === 0 ? "#FFD95A" : "#fff"} opacity={0.85} />;
      })}
    </g>
  );
}

function Star({ x, y, r = 8, fill = "#FFD95A" }: { x: number; y: number; r?: number; fill?: string }) {
  const p = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`;
  }).join(" ");
  return <polygon points={p} fill={fill} />;
}

function Sky({ id, from, to }: { id: string; from: string; to: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#${id})`} />
    </>
  );
}

const SCENES: Record<string, (id: string) => ReactNode> = {
  launch: (id) => (
    <>
      <Sky id={id} from="#0B0E2B" to="#7A4FD6" />
      <Stars seed={1} />
      <path d="M70 200 C120 140 200 80 300 40" stroke="#FFD95A" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" fill="none" />
      <g transform="translate(300 40) rotate(55)">
        <path d="M0 -22 C10 -12 10 10 8 18 L-8 18 C-10 10 -10 -12 0 -22 Z" fill="#F7F5FE" stroke={INK} strokeWidth="2.5" />
        <path d="M-8 18 L-14 26 L-6 22 Z M8 18 L14 26 L6 22 Z" fill="#FF7A2F" />
        <circle cy="-2" r="4" fill="#45E3CC" stroke={INK} strokeWidth="2" />
        <path d="M-5 20 Q0 40 5 20 Z" fill="#FF7A2F" />
      </g>
      <ellipse cx="200" cy="300" rx="320" ry="110" fill="#0B8A7E" />
      <ellipse cx="200" cy="304" rx="320" ry="104" fill="#13A595" />
      <rect x="56" y="190" width="28" height="10" rx="3" fill="#8F94C4" />
      <path d="M62 190 L70 172 L78 190" stroke="#8F94C4" strokeWidth="4" fill="none" />
      <Kid x={150} y={196} skin={SKIN[0]} shirt="#FF7A2F" arms="up" puffs />
      <Kid x={210} y={200} skin={SKIN[1]} shirt="#3A3FBF" arms="up" />
      <Kid x={270} y={196} skin={SKIN[2]} shirt="#FFC23D" arms="point" puffs hair="#2a1a0c" />
    </>
  ),
  reading: (id) => (
    <>
      <Sky id={id} from="#0B0E2B" to="#1A1E57" />
      <Stars seed={3} count={26} h={260} />
      <mask id={`${id}m`}>
        <rect width="400" height="260" fill="#fff" />
        <circle cx="250" cy="96" r="92" fill="#000" />
      </mask>
      <circle cx="180" cy="150" r="108" fill="#FFD95A" mask={`url(#${id}m)`} />
      <circle cx="112" cy="196" r="10" fill="#F2B92B" mask={`url(#${id}m)`} />
      <circle cx="96" cy="140" r="7" fill="#F2B92B" mask={`url(#${id}m)`} />
      <circle cx="150" cy="232" r="6" fill="#F2B92B" mask={`url(#${id}m)`} />
      <g transform="translate(162 112)">
        <Kid x={0} y={0} s={0.85} skin={SKIN[3]} shirt="#7A4FD6" arms="hold" puffs />
        <rect x="-9" y="13" width="18" height="12" rx="2" fill="#fff" stroke={INK} strokeWidth="2" />
        <path d="M0 13 L0 25" stroke={INK} strokeWidth="1.5" />
      </g>
      <g transform="translate(206 148)">
        <Kid x={0} y={0} s={0.85} skin={SKIN[4]} shirt="#0B8A7E" arms="hold" />
        <rect x="-9" y="13" width="18" height="12" rx="2" fill="#FF7A2F" stroke={INK} strokeWidth="2" />
      </g>
      <Star x={330} y={200} r={10} />
      <Star x={300} y={40} r={6} fill="#45E3CC" />
      <Star x={40} y={40} r={7} fill="#C8B6FF" />
    </>
  ),
  sports: (id) => (
    <>
      <Sky id={id} from="#3A3FBF" to="#C8B6FF" />
      <Stars seed={5} count={10} h={90} />
      <g transform="translate(320 52)">
        <circle r="26" fill="#FF7A2F" />
        <ellipse rx="44" ry="9" fill="none" stroke="#FFD95A" strokeWidth="4" transform="rotate(-15)" />
      </g>
      <ellipse cx="200" cy="320" rx="330" ry="150" fill="#0B8A7E" />
      <ellipse cx="200" cy="320" rx="300" ry="128" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7" />
      <ellipse cx="200" cy="320" rx="260" ry="104" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7" />
      <path d="M330 190 L330 250 M368 186 L368 250" stroke="#fff" strokeWidth="4" />
      <path d="M330 202 Q349 210 368 200" stroke="#FFC23D" strokeWidth="4" fill="none" />
      <g transform="rotate(-8 140 190)"><Kid x={140} y={190} skin={SKIN[1]} shirt="#FFC23D" arms="up" /></g>
      <g transform="rotate(-8 240 196)"><Kid x={240} y={196} skin={SKIN[0]} shirt="#DF5418" arms="point" puffs /></g>
      <path d="M100 195 L80 192 M104 210 L84 212" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </>
  ),
  art: (id) => (
    <>
      <Sky id={id} from="#EEE7FD" to="#C8B6FF" />
      <circle cx="40" cy="40" r="14" fill="#FF7A2F" opacity="0.7" />
      <circle cx="360" cy="70" r="10" fill="#45E3CC" opacity="0.8" />
      <circle cx="80" cy="220" r="12" fill="#FFC23D" opacity="0.8" />
      <rect y="220" width="400" height="40" fill="#7A4FD6" opacity="0.35" />
      <path d="M190 225 L220 60 L250 225 M220 60 L220 230" stroke="#8D5524" strokeWidth="6" strokeLinecap="round" />
      <rect x="160" y="62" width="120" height="96" rx="6" fill="#0B0E2B" stroke="#fff" strokeWidth="6" />
      <path d="M220 110 m-30 0 a30 14 -20 1 0 60 0 a30 14 -20 1 0 -60 0" fill="none" stroke="#C8B6FF" strokeWidth="3" />
      <circle cx="220" cy="110" r="10" fill="#FF7A2F" />
      <Star x={185} y={80} r={6} />
      <Star x={260} y={140} r={5} fill="#45E3CC" />
      <Kid x={110} y={170} skin={SKIN[2]} shirt="#FF7A2F" arms="point" puffs />
      <path d="M136 168 L150 156" stroke="#8D5524" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="320" cy="210" rx="30" ry="14" fill="#fff" />
      <circle cx="308" cy="206" r="5" fill="#DF5418" />
      <circle cx="322" cy="203" r="5" fill="#3A3FBF" />
      <circle cx="334" cy="209" r="5" fill="#FFC23D" />
    </>
  ),
  garden: (id) => (
    <>
      <Sky id={id} from="#1A1E57" to="#FF7A2F" />
      <Stars seed={7} count={12} h={110} />
      <circle cx="80" cy="70" r="20" fill="#FFD95A" opacity="0.9" />
      <rect y="190" width="400" height="70" fill="#5A341A" />
      <rect y="186" width="400" height="10" fill="#0B8A7E" />
      {[150, 210, 270, 330].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 192 Q${x - 4} ${170 - i * 6} ${x} ${150 - i * 8}`} stroke="#13A595" strokeWidth="4" fill="none" />
          <ellipse cx={x - 9} cy={172 - i * 3} rx="9" ry="4" fill="#13A595" transform={`rotate(-30 ${x - 9} ${172 - i * 3})`} />
          <Star x={x} y={146 - i * 8} r={11} fill={["#FFD95A", "#C8B6FF", "#45E3CC", "#FFD95A"][i]} />
        </g>
      ))}
      <Kid x={80} y={150} skin={SKIN[1]} shirt="#7A4FD6" arms="hold" puffs />
      <path d="M86 168 L112 160 L118 170 L92 178 Z" fill="#45E3CC" stroke={INK} strokeWidth="2" />
      <path d="M118 165 L132 158" stroke="#45E3CC" strokeWidth="3" />
      <path d="M134 160 l4 8 M138 158 l5 7 M140 155 l6 6" stroke="#9ADCFF" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  observatory: (id) => (
    <>
      <Sky id={id} from="#0B0E2B" to="#1A1E57" />
      <Stars seed={9} count={30} h={200} />
      <circle cx="320" cy="56" r="26" fill="#F7F5FE" />
      <circle cx="312" cy="50" r="5" fill="#C8B6FF" />
      <circle cx="328" cy="66" r="4" fill="#C8B6FF" />
      <rect y="214" width="400" height="46" fill="#0B8A7E" />
      <rect x="70" y="150" width="120" height="70" fill="#E7E8FC" />
      <path d="M70 152 A60 60 0 0 1 190 152 Z" fill="#C8B6FF" />
      <path d="M128 100 L140 100 L140 152 L128 152 Z" fill="#1A1E57" />
      <rect x="138" y="96" width="70" height="14" rx="6" fill="#FF7A2F" transform="rotate(-28 138 103)" />
      <rect x="112" y="186" width="34" height="34" rx="4" fill="#3A3FBF" />
      <Kid x={260} y={174} skin={SKIN[0]} shirt="#FFC23D" arms="point" />
      <Kid x={310} y={180} s={0.85} skin={SKIN[3]} shirt="#FF7A2F" arms="up" puffs />
    </>
  ),
  graduation: (id) => (
    <>
      <Sky id={id} from="#3A3FBF" to="#7A4FD6" />
      <Stars seed={11} count={16} h={150} />
      {[60, 140, 250, 330].map((x, i) => (
        <g key={x} transform={`translate(${x} ${40 + (i % 2) * 30}) rotate(${i * 25 - 30})`}>
          <path d="M-14 0 L0 -6 L14 0 L0 6 Z" fill={INK} />
          <path d="M12 0 L13 10" stroke="#FFD95A" strokeWidth="2" />
        </g>
      ))}
      <Star x={200} y={50} r={14} />
      <rect y="214" width="400" height="46" fill="#0B0E2B" opacity="0.5" />
      <Kid x={110} y={176} skin={SKIN[2]} shirt="#161A3D" arms="up" puffs cap="#161A3D" />
      <Kid x={200} y={170} skin={SKIN[1]} shirt="#161A3D" arms="up" cap="#161A3D" />
      <Kid x={290} y={176} skin={SKIN[4]} shirt="#161A3D" arms="up" puffs cap="#161A3D" />
      {[[90, 120, "#FF7A2F"], [160, 100, "#45E3CC"], [250, 110, "#FFD95A"], [320, 130, "#C8B6FF"]].map(([x, y, c]) => (
        <rect key={`${x}`} x={x as number} y={y as number} width="6" height="10" rx="1" fill={c as string} transform={`rotate(30 ${x} ${y})`} />
      ))}
    </>
  ),
  music: (id) => (
    <>
      <Sky id={id} from="#161A3D" to="#7A4FD6" />
      <Stars seed={13} count={20} h={160} />
      <path d="M60 20 L120 200 L0 200 Z" fill="#FFD95A" opacity="0.15" />
      <path d="M340 20 L400 200 L280 200 Z" fill="#45E3CC" opacity="0.15" />
      <rect y="200" width="400" height="60" fill="#DF5418" />
      <rect y="196" width="400" height="8" fill="#FF7A2F" />
      <Kid x={150} y={150} skin={SKIN[0]} shirt="#45E3CC" arms="hold" puffs />
      <ellipse cx="150" cy="182" rx="20" ry="8" fill="#F7F5FE" stroke={INK} strokeWidth="2" />
      <rect x="130" y="182" width="40" height="18" fill="#3A3FBF" />
      <Kid x={250} y={150} skin={SKIN[2]} shirt="#FFC23D" arms="up" />
      <text x="200" y="80" fontSize="34" fill="#FFD95A">♪</text>
      <text x="290" y="60" fontSize="28" fill="#C8B6FF">♫</text>
      <text x="90" y="70" fontSize="26" fill="#45E3CC">♪</text>
    </>
  ),
  culture: (id) => (
    <>
      <Sky id={id} from="#0B8A7E" to="#45E3CC" />
      <circle cx="330" cy="60" r="24" fill="#FFD95A" />
      <path d="M0 60 Q100 30 200 60 T400 60" stroke="#fff" strokeWidth="2" fill="none" opacity="0.6" />
      {[50, 110, 170, 230, 290, 350].map((x, i) => (
        <path key={x} d={`M${x - 12} ${58 + (i % 2) * 4} L${x + 12} ${58 + (i % 2) * 4} L${x} ${80 + (i % 2) * 4} Z`} fill={i % 2 ? "#fff" : "#13A595"} stroke={INK} strokeWidth="1" />
      ))}
      <rect y="210" width="400" height="50" fill="#FFF3D3" />
      <Kid x={110} y={170} skin={SKIN[1]} shirt="#FF7A2F" arms="up" puffs />
      <Kid x={200} y={166} skin={SKIN[3]} shirt="#7A4FD6" arms="up" />
      <Kid x={290} y={170} skin={SKIN[0]} shirt="#FFC23D" arms="up" puffs />
    </>
  ),
};

export const SCENE_KINDS = Object.keys(SCENES);

export function MissionScene({ kind, className = "w-full h-auto", title }: { kind: string; className?: string; title?: string }) {
  const id = `sc${useId().replace(/:/g, "")}`;
  const draw = SCENES[kind] ?? SCENES.launch;
  return (
    <svg viewBox="0 0 400 260" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} preserveAspectRatio="xMidYMid slice">
      {draw(id)}
    </svg>
  );
}
