"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Gender } from "@/lib/types";

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
  size: number;
  color: string;
  round: boolean;
  emoji: string | null;
}

interface ConfettiProps {
  gender: Gender;
  /** Número de piezas. Sube para la revelación final. */
  count?: number;
  /** Emojis extra que llueven junto al confeti. */
  emojis?: string[];
}

const PALETTES: Record<Gender, string[]> = {
  girl: ["#f4a6c4", "#f8cfe0", "#c9b6f5", "#fdf6e8", "#f3d588"],
  boy: ["#8ec9f0", "#c4e4fa", "#b8e0f6", "#fdf6e8", "#f3d588"],
};

/**
 * Lluvia de confeti del color elegido. Se monta cuando hace falta y se
 * desmonta solo (las piezas caen una vez). Posición fija, sin interacción.
 */
export default function Confetti({ gender, count = 80, emojis }: ConfettiProps) {
  // El azar se calcula una sola vez, en el inicializador perezoso del estado,
  // para que las piezas no cambien en cada render. El componente solo se monta
  // en el cliente (al disparar la celebración), así que no hay desajuste SSR.
  const [pieces] = useState<Piece[]>(() => {
    const palette = PALETTES[gender];
    return Array.from({ length: count }, (_, i): Piece => {
      const isEmoji = !!emojis && emojis.length > 0 && Math.random() > 0.7;
      return {
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.8,
        drift: (Math.random() - 0.5) * 220,
        rotate: Math.random() * 720 - 360,
        size: 7 + Math.random() * 9,
        color: palette[i % palette.length],
        round: Math.random() > 0.5,
        emoji: isEmoji
          ? emojis[Math.floor(Math.random() * emojis.length)]
          : null,
      };
    });
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
    >
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-[-5%]"
          style={{ left: `${p.left}%` }}
          initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: "110vh",
            x: p.drift,
            rotate: p.rotate,
            opacity: [1, 1, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
          }}
        >
          {p.emoji ? (
            <span style={{ fontSize: p.size + 6 }}>{p.emoji}</span>
          ) : (
            <span
              style={{
                display: "block",
                width: p.size,
                height: p.round ? p.size : p.size * 0.5,
                background: p.color,
                borderRadius: p.round ? "9999px" : "2px",
                boxShadow: `0 0 6px ${p.color}aa`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
