"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useVotes } from "@/lib/useVotes";
import type { Vote } from "@/lib/types";

/** Fecha y hora del mensaje en horario de Caracas (UTC-4). */
const caracasFormatter = new Intl.DateTimeFormat("es-VE", {
  timeZone: "America/Caracas",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

function formatCaracas(iso: string): string {
  try {
    return caracasFormatter.format(new Date(iso));
  } catch {
    return "";
  }
}

function EchoCard({ vote }: { vote: Vote }) {
  const [pulse, setPulse] = useState(false);
  const isGirl = vote.gender === "girl";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      onTap={() => {
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      }}
      className={`glass relative cursor-pointer overflow-hidden rounded-2xl border-l-4 p-5 ${
        isGirl ? "border-girl" : "border-boy"
      }`}
    >
      {/* Pulso de luz al tocar */}
      <AnimatePresence>
        {pulse && (
          <motion.span
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, ${
                isGirl ? "#f4a6c4" : "#8ec9f0"
              }55, transparent 70%)`,
            }}
            initial={{ opacity: 0.8, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      <div className="relative flex items-center gap-3">
        <span className="text-3xl">{isGirl ? "🌸" : "💙"}</span>
        <div>
          <p className="font-display font-semibold text-cream">{vote.name}</p>
          <p
            className={`text-xs font-medium ${isGirl ? "text-girl" : "text-boy"}`}
          >
            apuesta por {isGirl ? "Niña" : "Niño"}
          </p>
        </div>
      </div>
      {vote.message && (
        <p className="relative mt-3 text-pretty text-sm leading-relaxed text-cream/80">
          “{vote.message}”
        </p>
      )}
      <p className="relative mt-3 text-right text-xs text-cream/40">
        {formatCaracas(vote.created_at)}
      </p>
    </motion.li>
  );
}

export default function EchoesFeed() {
  const { votes, loading } = useVotes();
  // Orden cronológico inverso (lo más nuevo primero).
  const ordered = [...votes].reverse();

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display mb-3 text-center text-3xl font-bold text-cream text-glow-soft sm:text-4xl"
      >
        Lo que el mundo le desea
      </motion.h2>
      <p className="mb-10 text-center text-cream/60">Ecos del corazón</p>

      {loading ? (
        <p className="text-center text-cream/50">Escuchando los ecos…</p>
      ) : ordered.length === 0 ? (
        <p className="text-center text-cream/50">
          Todavía no hay mensajes. Sé el primero en dejar tu huella ✨
        </p>
      ) : (
        <motion.ul layout className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {ordered.map((vote) => (
              <EchoCard key={vote.id} vote={vote} />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </section>
  );
}
