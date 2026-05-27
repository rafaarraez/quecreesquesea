"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { loadEmojiShape } from "@tsparticles/shape-emoji";

/**
 * Cascada continua de fondo, siempre activa en toda la app:
 *  · polvo de estrellas y destellos dorados que titilan,
 *  · flores, corazones, estrellitas y huellas (emojis) cayendo como nieve,
 *  · una corriente sutil de partículas flotando hacia arriba.
 * Opacidad suave para no competir con el contenido.
 */
export default function ParticlesBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      await loadEmojiShape(engine);
    }).then(() => setReady(true));
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      detectRetina: true,
      fpsLimit: 60,
      background: { color: "transparent" },
      particles: {
        number: { value: 0 },
      },
      // Cada "manualParticle" lo definimos vía emitters/groups con `emitters`.
      emitters: [
        // 1 · Polvo de estrellas dorado/pastel, caída lenta tipo nieve.
        {
          direction: "bottom",
          rate: { delay: 0.35, quantity: 2 },
          size: { width: 100, height: 0 },
          position: { x: 50, y: -5 },
          particles: {
            shape: { type: "circle" },
            color: {
              value: ["#f3d588", "#fdf6e8", "#c9b6f5", "#b8e0f6", "#f6c6d8"],
            },
            size: { value: { min: 0.6, max: 2.6 } },
            opacity: {
              value: { min: 0.15, max: 0.7 },
              animation: {
                enable: true,
                speed: 0.6,
                sync: false,
                startValue: "random",
              },
            },
            move: {
              enable: true,
              direction: "bottom",
              speed: { min: 0.3, max: 1.1 },
              straight: false,
              drift: { min: -0.4, max: 0.4 },
              outModes: { default: "out" },
            },
            shadow: {
              enable: true,
              color: "#f3d588",
              blur: 4,
            },
          },
        },
        // 2 · Flores, corazones y estrellitas cayendo suavemente.
        {
          direction: "bottom",
          rate: { delay: 1.1, quantity: 1 },
          size: { width: 100, height: 0 },
          position: { x: 50, y: -5 },
          particles: {
            shape: {
              type: "emoji",
              options: {
                emoji: {
                  value: ["🌸", "💮", "🤍", "💜", "✦", "✧", "⭐"],
                },
              },
            },
            size: { value: { min: 8, max: 16 } },
            opacity: { value: { min: 0.35, max: 0.75 } },
            rotate: {
              value: { min: 0, max: 360 },
              direction: "random",
              animation: { enable: true, speed: 4 },
            },
            move: {
              enable: true,
              direction: "bottom",
              speed: { min: 0.5, max: 1.4 },
              straight: false,
              drift: { min: -0.6, max: 0.6 },
              outModes: { default: "out" },
            },
          },
        },
        // 3 · Corriente sutil que flota hacia arriba: huellas y destellos.
        {
          direction: "top",
          rate: { delay: 2.4, quantity: 1 },
          size: { width: 100, height: 0 },
          position: { x: 50, y: 105 },
          particles: {
            shape: {
              type: "emoji",
              options: {
                emoji: { value: ["👣", "💛", "✨"] },
              },
            },
            size: { value: { min: 9, max: 15 } },
            opacity: { value: { min: 0.18, max: 0.45 } },
            rotate: {
              value: { min: -20, max: 20 },
              animation: { enable: true, speed: 2 },
            },
            move: {
              enable: true,
              direction: "top",
              speed: { min: 0.4, max: 1 },
              straight: false,
              drift: { min: -0.5, max: 0.5 },
              outModes: { default: "out" },
            },
          },
        },
      ],
    }),
    [],
  );

  if (!ready) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    >
      <Particles id="tsparticles" options={options} className="h-full w-full" />
    </div>
  );
}
