"use client";

interface EggProps {
  className?: string;
  /** Color del halo/acentos. Por defecto dorado. */
  glow?: string;
}

/**
 * Huevo decorativo con degradado nacarado y patrones suaves. Sin temática
 * concreta: solo un objeto bello y luminoso. El pulso/halo se anima desde
 * el componente que lo usa (Framer Motion).
 */
export default function Egg({ className, glow = "#f3d588" }: EggProps) {
  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      role="img"
      aria-label="Huevo luminoso"
    >
      <defs>
        <radialGradient id="eggBody" cx="42%" cy="34%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="38%" stopColor="#fdf6e8" />
          <stop offset="72%" stopColor="#e9d9f5" />
          <stop offset="100%" stopColor="#c9b6f5" />
        </radialGradient>
        <linearGradient id="eggSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="eggSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      {/* Cuerpo del huevo */}
      <path
        d="M100 8 C150 8 180 90 180 150 C180 212 144 252 100 252 C56 252 20 212 20 150 C20 90 50 8 100 8 Z"
        fill="url(#eggBody)"
        stroke={glow}
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      {/* Patrones decorativos: bandas de puntos y zig-zag suave */}
      <g stroke={glow} strokeOpacity="0.5" strokeWidth="2" fill="none">
        <path d="M30 150 Q50 138 70 150 T110 150 T150 150 T190 150" opacity="0.5" />
        <path d="M24 178 Q48 166 72 178 T120 178 T168 178" opacity="0.45" />
      </g>
      <g fill={glow} fillOpacity="0.55">
        <circle cx="62" cy="120" r="2.4" />
        <circle cx="100" cy="112" r="2.4" />
        <circle cx="138" cy="120" r="2.4" />
        <circle cx="80" cy="205" r="2.2" />
        <circle cx="120" cy="205" r="2.2" />
        <circle cx="100" cy="222" r="2.2" />
      </g>

      {/* Brillo nacarado */}
      <ellipse
        cx="74"
        cy="74"
        rx="34"
        ry="46"
        fill="url(#eggSheen)"
        filter="url(#eggSoft)"
        opacity="0.85"
      />
    </svg>
  );
}
