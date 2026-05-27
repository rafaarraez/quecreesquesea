"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import Egg from "./Egg";

const TITLE = "Se Viene un Mandolese López";

// 🥚 Easter egg: el huevo reacciona si lo tocás de más (tierno y bobo).
type EggMessage = { at: number; text: string; href?: string; cta?: string };

const EGG_TAP_MESSAGES: EggMessage[] = [
  { at: 3, text: "¿Hola? Me haces cosquillas 🥚" },
  { at: 6, text: "Eh, tranqui… todavía no salgo 😅" },
  { at: 9, text: "¡Faltan unos días! Gracias por la compañía 💛" },
  {
    at: 12,
    text: "¿Quieres un avance de lo que seré? 👀",
    href: "/spoiler",
    cta: "Ver el spoiler 🤫",
  },
  { at: 16, text: "Ok, ya eres oficialmente mi tío/a favorito/a 😂" },
  { at: 21, text: "En serio… anda a votar 👉 ¡pero te quiero! 🌟" },
];

/** Animación escalonada para revelar el título letra por letra. */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.2 },
  },
};
const letter = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 14, stiffness: 120 },
  },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax: capas a distintas velocidades.
  const yFar = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const yNear = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Easter egg de los toques al huevo.
  const eggTaps = useRef(0);
  const [eggMsg, setEggMsg] = useState<EggMessage | null>(null);
  const [jiggle, setJiggle] = useState(0);

  function handleEggTap() {
    eggTaps.current += 1;
    const n = eggTaps.current;
    // Tomamos el último mensaje cuyo umbral ya alcanzamos.
    const match = [...EGG_TAP_MESSAGES].reverse().find((m) => n >= m.at);
    if (match) setEggMsg(match);
    setJiggle((j) => j + 1); // fuerza un meneíto en cada toque
  }

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* ── Capas de parallax (plantas y estrellas) ── */}
      <motion.div
        style={{ y: yFar }}
        className="pointer-events-none absolute inset-x-0 top-[12%] flex justify-center opacity-40"
        aria-hidden
      >
        <div className="h-64 w-64 rounded-full bg-lila/20 blur-3xl" />
      </motion.div>

      <motion.div
        style={{ y: yMid }}
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 text-6xl opacity-30 select-none"
      >
        🌿
      </motion.div>
      <motion.div
        style={{ y: yMid }}
        aria-hidden
        className="pointer-events-none absolute right-2 bottom-6 text-5xl opacity-30 select-none"
      >
        🌿
      </motion.div>
      <motion.div
        style={{ y: yNear }}
        aria-hidden
        className="pointer-events-none absolute bottom-[-1rem] left-1/2 -translate-x-1/2 text-7xl opacity-25 select-none"
      >
        🌱
      </motion.div>

      {/* ── Contenido ── */}
      <motion.div style={{ opacity: fade }} className="relative z-10 flex flex-col items-center">
        {/* Título letra por letra con glow dorado */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          aria-label={TITLE}
          className="font-display text-glow-gold max-w-3xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-cream sm:text-6xl md:text-7xl"
        >
          {/* Cada palabra se mantiene entera (no corta a mitad) y solo se
              envuelve entre palabras; las letras aparecen escalonadas. */}
          {TITLE.split(" ").map((word, wi, words) => (
            <Fragment key={wi}>
              <span className="inline-block whitespace-nowrap">
                {word.split("").map((char, ci) => (
                  <motion.span key={ci} variants={letter} className="inline-block">
                    {char}
                  </motion.span>
                ))}
              </span>
              {wi < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="font-display mt-4 text-base font-medium tracking-[0.15em] text-lila uppercase text-glow-soft sm:text-lg"
        >
          El nuevo miembro de la familia 🌿
        </motion.p>

        {/* Huevo con respiración + halo */}
        <div className="relative mt-10 flex items-center justify-center">
          <motion.div
            aria-hidden
            className="absolute rounded-full bg-gold/30 blur-3xl"
            initial={{ width: 180, height: 180, opacity: 0.2 }}
            animate={{
              width: [200, 320, 200],
              height: [200, 320, 200],
              opacity: [0.25, 0.55, 0.25],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 🥚 Globito del easter egg */}
          <AnimatePresence>
            {eggMsg && (
              <motion.div
                key={eggMsg.text}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="absolute -top-16 left-1/2 z-30 w-max max-w-[15rem] -translate-x-1/2 rounded-2xl border border-gold/40 bg-night-800 px-4 py-2.5 text-center text-sm font-semibold leading-snug text-cream shadow-[0_8px_30px_rgba(0,0,0,0.55)]"
              >
                {eggMsg.text}
                {eggMsg.href && (
                  <Link
                    href={eggMsg.href}
                    className="mt-2 block rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-gold transition-colors hover:bg-gold/30"
                  >
                    {eggMsg.cta ?? "Ver más"}
                  </Link>
                )}
                {/* Flechita del globo apuntando al huevo */}
                <span className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-gold/40 bg-night-800" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 1.5, -1.5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <motion.button
              type="button"
              onClick={handleEggTap}
              aria-label="El huevo del secreto"
              key={jiggle}
              animate={{ rotate: [0, -6, 6, -3, 0] }}
              transition={{ duration: 0.4 }}
              className="cursor-pointer rounded-full"
            >
              <Egg className="h-56 w-44 drop-shadow-[0_0_25px_rgba(243,213,136,0.4)] sm:h-72 sm:w-56" />
            </motion.button>
          </motion.div>
        </div>

        {/* Bajada poética */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-10 max-w-md text-balance text-lg leading-relaxed text-cream/85 sm:text-xl"
        >
          ¿Qué crees o esperas que sea? 💭
        </motion.p>

        {/* CTA suave */}
        <motion.a
          href="#votar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 2.4, duration: 0.8 },
            y: { delay: 2.4, duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="group mt-12 inline-flex flex-col items-center gap-1 text-cream/70 transition-colors hover:text-gold"
        >
          <span className="font-display text-base tracking-wide">
            Deja tu predicción
          </span>
          <span className="text-2xl transition-transform group-hover:translate-y-1">
            ↓
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}
