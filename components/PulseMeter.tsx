"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useVotes } from "@/lib/useVotes";

/** Contador numérico que sube suavemente hasta `value`. */
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1, ease: "easeOut" });
    return controls.stop;
  }, [mv, value]);

  return <motion.span>{rounded}</motion.span>;
}

export default function PulseMeter() {
  const { girl, boy, total, loading } = useVotes();

  // Proporción para la barra (50/50 cuando no hay votos).
  const girlPct = total === 0 ? 50 : Math.round((girl / total) * 100);
  const boyPct = total === 0 ? 50 : 100 - girlPct;

  return (
    <section id="resultados" className="mx-auto w-full max-w-2xl scroll-mt-8 px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display mb-10 text-center text-3xl font-bold text-cream text-glow-soft sm:text-4xl"
      >
        El mundo ya eligió…
      </motion.h2>

      <div className="glass rounded-3xl p-6 sm:p-8">
        {/* Etiquetas + porcentajes */}
        <div className="mb-3 flex items-end justify-between">
          <div className="flex flex-col items-start">
            <span className="text-2xl">🌸</span>
            <span className="font-display text-3xl font-extrabold text-girl">
              <Counter value={girlPct} suffix="%" />
            </span>
            <span className="text-sm text-cream/60">{girl} votos</span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-2xl">💙</span>
            <span className="font-display text-3xl font-extrabold text-boy">
              <Counter value={boyPct} suffix="%" />
            </span>
            <span className="text-sm text-cream/60">{boy} votos</span>
          </div>
        </div>

        {/* Barra fluida */}
        <div className="relative h-6 w-full overflow-hidden rounded-full bg-night-900/70 ring-1 ring-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-girl to-girl-soft"
            initial={false}
            animate={{ width: `${girlPct}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 bg-gradient-to-l from-boy to-boy-soft"
            initial={false}
            animate={{ width: `${boyPct}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
          />
          {/* Costura luminosa central */}
          <motion.div
            className="absolute inset-y-0 w-1 -translate-x-1/2 bg-cream/80 shadow-[0_0_12px_rgba(253,246,232,0.9)]"
            initial={false}
            animate={{ left: `${girlPct}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
          />
        </div>

        <p className="mt-5 text-center text-cream/70">
          {loading ? (
            "Sintiendo el pulso…"
          ) : (
            <>
              <span className="font-display text-xl font-bold text-gold">
                <Counter value={total} />
              </span>{" "}
              {total === 1 ? "corazón ya eligió" : "corazones ya eligieron"}
            </>
          )}
        </p>
      </div>
    </section>
  );
}
