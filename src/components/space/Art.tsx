import { useId } from "react";

const INK = "#161A3D";

/** The Novaridge badge: a ringed rocket-orange planet with a star, on night navy. */
export function LogoMark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="31" fill="#161A3D" />
      <circle cx="32" cy="32" r="27" fill="none" stroke="#FFC23D" strokeWidth="1.4" strokeDasharray="2 3.2" opacity="0.75" />
      <circle cx="14" cy="22" r="1.2" fill="#fff" />
      <circle cx="20" cy="49" r="1" fill="#C8B6FF" />
      <circle cx="50" cy="44" r="1.1" fill="#fff" />
      <g transform="rotate(-20 30 36)">
        <path d="M8 36 A22 6.5 0 0 1 52 36" fill="none" stroke="#45E3CC" strokeWidth="3.2" strokeLinecap="round" />
      </g>
      <circle cx="30" cy="36" r="13" fill="#FF7A2F" />
      <path d="M18.5 31 Q30 27 41.5 31 L42.6 35 Q30 31 17.4 35 Z" fill="#FFC23D" opacity="0.9" />
      <circle cx="25" cy="41" r="2.4" fill="#DF5418" opacity="0.8" />
      <circle cx="35" cy="44" r="1.5" fill="#DF5418" opacity="0.8" />
      <g transform="rotate(-20 30 36)">
        <path d="M52 36 A22 6.5 0 0 1 8 36" fill="none" stroke="#45E3CC" strokeWidth="3.2" strokeLinecap="round" />
      </g>
      <path d="M47 9 L48.8 14.2 L54 16 L48.8 17.8 L47 23 L45.2 17.8 L40 16 L45.2 14.2 Z" fill="#FFD95A" />
    </svg>
  );
}

/** Nova, our friendly rocket mascot, peeking out of the porthole. */
export function Nova({ className = "h-40 w-auto", flame = true, title }: { className?: string; flame?: boolean; title?: string }) {
  return (
    <svg viewBox="0 0 120 210" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {flame && (
        <g className="origin-[60px_148px] animate-flame">
          <path d="M46 146 Q60 212 74 146 Z" fill="#FF7A2F" />
          <path d="M52 146 Q60 190 68 146 Z" fill="#FFD95A" />
        </g>
      )}
      <path d="M32 98 L10 138 L12 154 L36 134 Z" fill="#7A4FD6" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M88 98 L110 138 L108 154 L84 134 Z" fill="#7A4FD6" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M44 136 L76 136 L71 149 L49 149 Z" fill="#8F94C4" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M60 6 C90 28 94 80 88 136 L32 136 C26 80 30 28 60 6 Z" fill="#F7F5FE" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M60 6 C75 17 83 34 86.5 50 L33.5 50 C37 34 45 17 60 6 Z" fill="#FF7A2F" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <rect x="31" y="122" width="58" height="12" rx="4" fill="#3A3FBF" stroke={INK} strokeWidth="3.5" />
      <circle cx="60" cy="86" r="23" fill="#1A1E57" stroke="#45E3CC" strokeWidth="5" />
      <circle cx="60" cy="86" r="23" fill="none" stroke={INK} strokeWidth="2" />
      <ellipse cx="52" cy="82" rx="4.5" ry="5.5" fill="#fff" />
      <ellipse cx="68" cy="82" rx="4.5" ry="5.5" fill="#fff" />
      <circle cx="53" cy="83.5" r="2.4" fill={INK} />
      <circle cx="69" cy="83.5" r="2.4" fill={INK} />
      <circle cx="46.5" cy="92" r="3" fill="#FF8FA8" opacity="0.85" />
      <circle cx="73.5" cy="92" r="3" fill="#FF8FA8" opacity="0.85" />
      <path d="M53 93 Q60 100 67 93" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 72 Q49 66 56 67" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <circle cx="60" cy="38" r="3" fill="#FFD95A" />
      <circle cx="44" cy="114" r="2.6" fill="#45E3CC" />
      <circle cx="60" cy="116" r="2.6" fill="#45E3CC" />
      <circle cx="76" cy="114" r="2.6" fill="#45E3CC" />
    </svg>
  );
}

/** A friendly planet, optionally with a ring. */
export function Planet({ color = "#FF7A2F", shade = "#DF5418", ring, className = "h-24 w-24", bands = true }: { color?: string; shade?: string; ring?: string; className?: string; bands?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <radialGradient id={`pg${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="35%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={shade} />
        </radialGradient>
      </defs>
      {ring && <path d="M8 66 A52 14 0 0 1 112 54" transform="rotate(-14 60 60)" fill="none" stroke={ring} strokeWidth="6" strokeLinecap="round" opacity="0.9" />}
      <circle cx="60" cy="60" r="38" fill={`url(#pg${id})`} />
      {bands && (
        <>
          <path d="M25 50 Q60 42 95 50" fill="none" stroke={shade} strokeWidth="4" opacity="0.35" strokeLinecap="round" />
          <path d="M24 70 Q60 78 96 70" fill="none" stroke={shade} strokeWidth="5" opacity="0.3" strokeLinecap="round" />
          <circle cx="74" cy="82" r="5" fill={shade} opacity="0.35" />
        </>
      )}
      {ring && <path d="M112 54 A52 14 0 0 1 8 66" transform="rotate(-14 60 60)" fill="none" stroke={ring} strokeWidth="6" strokeLinecap="round" />}
    </svg>
  );
}

/** A four-point sparkle star. */
export function Sparkle({ className = "h-6 w-6", color = "#FFD95A" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z" fill={color} />
    </svg>
  );
}

/** Layers of tiny stars for dark sections. Place inside a `relative` parent. */
export function Starfield({ className = "", shooting = false }: { className?: string; shooting?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="stars absolute inset-0 opacity-70" />
      <div className="stars-lg absolute inset-0 animate-twinkle" />
      <div className="stars absolute inset-0 animate-twinkle opacity-60 [animation-delay:1.6s] [background-position:130px_90px]" />
      {shooting && (
        <span className="absolute left-[10%] top-[12%] h-0.5 w-28 rotate-[20deg] rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 [animation:shoot_7s_ease-in_2s_infinite]" />
      )}
    </div>
  );
}
