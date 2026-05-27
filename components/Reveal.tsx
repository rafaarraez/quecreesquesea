"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Egg from "./Egg";
import Confetti from "./Confetti";
import type { Gender } from "@/lib/types";

type Step = "idle" | "darken" | "tremble" | "crack" | "emerge";

const COPY: Record<Gender, { color: string; soft: string; word: string; emoji: string }> = {
  girl: { color: "#f4a6c4", soft: "#f8cfe0", word: "¡Bienvenida", emoji: "🌸" },
  boy: { color: "#8ec9f0", soft: "#c4e4fa", word: "¡Bienvenido", emoji: "💙" },
};

export default function Reveal({ gender }: { gender: Gender }) {
  const [step, setStep] = useState<Step>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const c = COPY[gender];

  // Coreografía de la secuencia.
  function start() {
    audioRef.current?.play().catch(() => {});
    setStep("darken");
    setTimeout(() => setStep("tremble"), 1200);
    setTimeout(() => setStep("crack"), 4200);
    setTimeout(() => setStep("emerge"), 5000);
  }

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  const trembling = step === "tremble";
  const cracking = step === "crack";
  const emerged = step === "emerge";

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Audio opcional (colocá un archivo en /public/reveal.mp3) */}
      <audio ref={audioRef} src="/reveal.mp3" preload="auto" loop />

      {/* Oscurecimiento de la pantalla */}
      <AnimatePresence>
        {step !== "idle" && !emerged && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-20 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Explosión de luz blanca cegadora al partirse */}
      <AnimatePresence>
        {cracking && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-40 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6] }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>

      {/* Resplandor de color tras emerger */}
      <AnimatePresence>
        {emerged && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-20"
            style={{
              background: `radial-gradient(circle at center, ${c.color}55, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
        )}
      </AnimatePresence>

      {emerged && (
        <Confetti gender={gender} count={180} emojis={[c.emoji, "✨", "💛", "🌟"]} />
      )}

      <div className="relative z-30 flex flex-col items-center">
        {step === "idle" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={start}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="font-display rounded-full border border-gold/40 bg-gold/10 px-10 py-5 text-xl font-bold text-gold text-glow-gold backdrop-blur"
          >
            Revelar el secreto ✨
          </motion.button>
        )}

        {/* Huevo: tiembla cada vez más, luego se parte */}
        {step !== "idle" && !emerged && (
          <motion.div
            animate={
              trembling
                ? {
                    x: [0, -4, 4, -7, 7, -10, 10, -12, 12],
                    rotate: [0, -2, 2, -3, 3, -5, 5],
                  }
                : cracking
                  ? { scale: [1, 1.2], opacity: [1, 0] }
                  : {}
            }
            transition={
              trembling
                ? { duration: 2.8, ease: "easeInOut" }
                : { duration: 0.6 }
            }
          >
            <Egg className="h-72 w-56" glow={c.color} />
          </motion.div>
        )}

        {/* Mensaje final */}
        <AnimatePresence>
          {emerged && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-8xl drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                {c.emoji}
              </motion.div>
              <h1
                className="font-display mt-8 max-w-2xl text-balance text-4xl font-extrabold sm:text-6xl"
                style={{
                  color: c.soft,
                  textShadow: `0 0 24px ${c.color}cc`,
                }}
              >
                {c.word} al mundo, pequeñ{gender === "girl" ? "a" : "o"} Mandolese
                López! 🌿
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
