"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type Step = "idle" | "loading" | "reveal";

/**
 * 🥚 Easter egg — ruta secreta falsa. Finge filtrar "el spoiler" pero es una
 * broma tierna. La revelación de verdad vive en /revelar (solo papás).
 */
export default function SpoilerPage() {
  const [step, setStep] = useState<Step>("idle");

  function start() {
    setStep("loading");
    setTimeout(() => setStep("reveal"), 2600);
  }

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <AnimatePresence mode="wait">
        {step === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="text-6xl">🤫</div>
            <h1 className="font-display text-glow-gold mt-6 text-3xl font-bold text-cream sm:text-4xl">
              Información ultra secreta
            </h1>
            <p className="mt-4 max-w-sm text-cream/75">
              Encontraste la página prohibida. ¿Seguro que querés ver el spoiler
              del bebé? 👀
            </p>
            <motion.button
              onClick={start}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="font-display mt-8 rounded-full border border-gold/40 bg-gold/10 px-8 py-4 text-lg font-bold text-gold"
            >
              Sí, mostrame el secreto 🔓
            </motion.button>
          </motion.div>
        )}

        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="text-5xl"
            >
              🔮
            </motion.div>
            <p className="font-display mt-6 text-xl text-cream">
              Descifrando el secreto mejor guardado del universo…
            </p>
            <p className="mt-2 text-sm text-cream/50">
              Sobornando a la cigüeña… 🐦
            </p>
          </motion.div>
        )}

        {step === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 14 }}
            className="flex flex-col items-center"
          >
            <p className="text-cream/70">El bebé es…</p>
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="my-4 text-8xl drop-shadow-[0_0_30px_rgba(243,213,136,0.5)]"
            >
              👶
            </motion.div>
            <h1 className="font-display text-glow-gold text-4xl font-extrabold text-cream sm:text-6xl">
              ¡UN BEBÉ! 🎉
            </h1>
            <p className="mt-6 max-w-md text-balance text-lg text-cream/80">
              Felicitaciones, descubriste el secreto más obvio del universo 🌌
              Tu premio: un abrazo enorme cuando lo conozcas 🤗
            </p>
            <Link
              href="/"
              className="font-display mt-10 text-cream/70 underline-offset-4 transition-colors hover:text-gold hover:underline"
            >
              ← Volver y dejar tu predicción de verdad
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
