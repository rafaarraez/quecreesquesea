"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Egg from "./Egg";
import Confetti from "./Confetti";
import { createVote } from "@/lib/votes";
import { getNameJoke } from "@/lib/easterEggs";
import type { Gender } from "@/lib/types";

type Phase = "form" | "trembling" | "burst" | "thanks" | "done";

const CARDS: {
  gender: Gender;
  emoji: string;
  label: string;
  glow: string;
  ring: string;
  bg: string;
}[] = [
  {
    gender: "girl",
    emoji: "🌸",
    label: "Niña",
    glow: "#f4a6c4",
    ring: "ring-girl",
    bg: "from-girl/30 to-lila/20",
  },
  {
    gender: "boy",
    emoji: "💙",
    label: "Niño",
    glow: "#8ec9f0",
    ring: "ring-boy",
    bg: "from-boy/30 to-celeste/20",
  },
];

export default function VoteForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim().length > 0 && gender !== null && phase === "form";
  const showForm =
    phase === "form" || phase === "trembling" || phase === "burst";

  // El agradecimiento se muestra como overlay a pantalla completa (imposible
  // de no ver). Cuando termina (phase "done") bajamos a los resultados.
  useEffect(() => {
    if (phase !== "done") return;
    document
      .getElementById("resultados")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [phase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Contanos cómo te llaman 💛");
      return;
    }
    if (!gender) {
      setError("Elegí tu predicción ✨");
      return;
    }

    // Secuencia: temblor → explosión de luz + confeti → agradecimiento.
    setPhase("trembling");
    try {
      await createVote({ name, gender, message });
    } catch {
      setError("No pudimos guardar tu voto. Intentá de nuevo en un momento.");
      setPhase("form");
      return;
    }

    setTimeout(() => setPhase("burst"), 900);
    setTimeout(() => setPhase("thanks"), 1600);
    // El overlay de agradecimiento vive ~3.5s y luego pasamos a "done"
    // (que dispara el scroll a resultados desde el useEffect).
    setTimeout(() => setPhase("done"), 1600 + 3500);
  }

  return (
    <section
      id="votar"
      className="relative mx-auto w-full max-w-xl scroll-mt-8 px-6 py-12 sm:py-20"
    >
      {/* El confeti se mantiene durante la explosión y el agradecimiento para
          que alcance a caer y llueva por encima del overlay. */}
      {(phase === "burst" || phase === "thanks") && gender && (
        <Confetti gender={gender} count={120} emojis={["🌸", "💙", "💛", "✨"]} />
      )}

      {/* Overlay de agradecimiento a pantalla completa: imposible no verlo */}
      <AnimatePresence>
        {phase === "thanks" && (
          <motion.div
            key="thanks-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-6 text-center"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 30%, #1b1a45 0%, #0a0820 55%, #05030f 100%)",
            }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-7xl drop-shadow-[0_0_30px_rgba(243,213,136,0.5)]"
              >
                💛
              </motion.div>
              <p className="font-display text-glow-gold mt-8 max-w-md text-balance text-3xl font-bold text-cream sm:text-4xl">
                Tu amor ya rodea a este pequeño ser
              </p>
              <p className="mt-5 text-lg text-cream/75">Gracias, {name.trim()} ✨</p>
              {/* 🥚 Easter egg: broma personalizada según el nombre */}
              {getNameJoke(name) && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mt-4 max-w-sm text-balance text-base font-medium text-gold"
                >
                  {getNameJoke(name)}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
          >
            {/* Huevo guía sobre el formulario */}
            <div className="mb-4 flex justify-center">
              <motion.div
                animate={
                  phase === "trembling"
                    ? {
                        x: [0, -6, 6, -8, 8, -5, 5, 0],
                        rotate: [0, -3, 3, -4, 4, 0],
                        scale: [1, 1.04, 1.02, 1.06],
                      }
                    : { scale: [1, 1.03, 1], y: [0, -4, 0] }
                }
                transition={
                  phase === "trembling"
                    ? { duration: 0.9, ease: "easeInOut" }
                    : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                }
              >
                <Egg className="h-20 w-16 sm:h-24 sm:w-20" />
              </motion.div>

              {/* Destello de explosión */}
              <AnimatePresence>
                {phase === "burst" && (
                  <motion.div
                    className="pointer-events-none fixed inset-0 z-40 bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.9, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                  />
                )}
              </AnimatePresence>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="glass rounded-3xl p-5 sm:p-8"
              animate={phase === "trembling" ? { opacity: 0.6 } : {}}
            >
              <h2 className="font-display mb-4 text-center text-2xl font-bold text-cream sm:text-3xl">
                Deja tu predicción
              </h2>

              {/* Nombre */}
              <label className="mb-4 block">
                <span className="mb-2 block text-sm font-medium text-cream/80">
                  ¿Cómo te llamas?
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  maxLength={40}
                  disabled={phase !== "form"}
                  className="w-full rounded-2xl border border-white/10 bg-night-900/60 px-4 py-3 text-cream placeholder:text-cream/35 focus:border-gold/50"
                />
              </label>

              {/* Tarjetas de género */}
              <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4">
                {CARDS.map((c) => {
                  const selected = gender === c.gender;
                  return (
                    <motion.button
                      type="button"
                      key={c.gender}
                      onClick={() => phase === "form" && setGender(c.gender)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      animate={
                        selected
                          ? {
                              scale: 1.05,
                              boxShadow: `0 0 30px ${c.glow}88`,
                            }
                          : { scale: 1, boxShadow: "0 0 0px transparent" }
                      }
                      className={`relative flex flex-col items-center gap-1.5 overflow-hidden rounded-3xl border bg-gradient-to-b p-4 transition-colors sm:p-6 ${c.bg} ${
                        selected
                          ? "border-white/40"
                          : "border-white/10 opacity-80"
                      }`}
                      aria-pressed={selected}
                    >
                      <span className="text-4xl sm:text-5xl">{c.emoji}</span>
                      <span className="font-display text-lg font-semibold text-cream">
                        {c.label}
                      </span>

                      {/* Partículas que brotan al seleccionar */}
                      <AnimatePresence>
                        {selected && (
                          <>
                            {Array.from({ length: 10 }).map((_, i) => (
                              <motion.span
                                key={i}
                                className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                                style={{ background: c.glow }}
                                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                animate={{
                                  opacity: 0,
                                  x: Math.cos((i / 10) * Math.PI * 2) * 70,
                                  y: Math.sin((i / 10) * Math.PI * 2) * 70,
                                  scale: 0,
                                }}
                                transition={{ duration: 0.8 }}
                              />
                            ))}
                          </>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>

              {/* Mensaje */}
              <label className="mb-4 block">
                <span className="mb-2 block text-sm font-medium text-cream/80">
                  Un mensaje para cuando pueda leerlo 💛
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  maxLength={280}
                  disabled={phase !== "form"}
                  placeholder="Deja aqui todos tus buenos deseos, predicciones o lo que quieras decirle al bebé 💛"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-night-900/60 px-4 py-3 text-cream placeholder:text-cream/35 focus:border-gold/50"
                />
              </label>

              {error && (
                <p className="mb-4 text-center text-sm text-rosa" role="alert">
                  {error}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={!canSubmit}
                whileHover={canSubmit ? { scale: 1.02 } : {}}
                whileTap={canSubmit ? { scale: 0.98 } : {}}
                className="font-display w-full rounded-2xl bg-gradient-to-r from-gold to-rosa px-6 py-4 text-lg font-bold text-night-950 shadow-[0_0_25px_rgba(243,213,136,0.4)] transition-opacity disabled:opacity-40"
              >
                Dejar mi huella ✨
              </motion.button>
            </motion.form>
          </motion.div>
        ) : (
          // Remate suave que queda en el lugar del formulario tras votar.
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="glass flex flex-col items-center justify-center rounded-3xl px-6 py-10 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl"
            >
              💛
            </motion.div>
            <p className="font-display text-glow-gold mt-5 max-w-md text-balance text-xl font-bold text-cream sm:text-2xl">
              Tu amor ya rodea a este pequeño ser
            </p>
            <p className="mt-3 text-cream/70">Gracias, {name.trim()} ✨</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
