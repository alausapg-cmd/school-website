import { useId } from "react";

/** An embroidered-looking round mission patch with curved text. */
export function MissionPatch({ emoji, color = "#3A3FBF", top = "MISSION LOG", bottom = "NOVARIDGE", className = "h-32 w-32" }: { emoji: string; color?: string; top?: string; bottom?: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden>
      <defs>
        <path id={`t${id}`} d="M26 80 A54 54 0 0 1 134 80" />
        <path id={`b${id}`} d="M17 80 A63 63 0 0 0 143 80" />
      </defs>
      <circle cx="80" cy="80" r="78" fill="#161A3D" />
      <circle cx="80" cy="80" r="72" fill={color} />
      <circle cx="80" cy="80" r="68" fill="none" stroke="#fff" strokeWidth="1.6" strokeDasharray="3 4" opacity="0.7" />
      <circle cx="80" cy="80" r="47" fill="#F7F5FE" stroke="#161A3D" strokeWidth="3" />
      <text fill="#fff" fontSize="12" fontWeight="700" letterSpacing="2.5" style={{ fontFamily: "var(--font-spacemono), monospace" }}>
        <textPath href={`#t${id}`} startOffset="50%" textAnchor="middle">{top}</textPath>
      </text>
      <text fill="#fff" fontSize="10.5" fontWeight="700" letterSpacing="2" style={{ fontFamily: "var(--font-spacemono), monospace" }}>
        <textPath href={`#b${id}`} startOffset="50%" textAnchor="middle">{bottom}</textPath>
      </text>
      <path d="M22 80 l3 -3 l3 3 l-3 3 Z M132 80 l3 -3 l3 3 l-3 3 Z" fill="#FFD95A" />
      <text x="80" y="96" textAnchor="middle" fontSize="44">{emoji}</text>
    </svg>
  );
}
