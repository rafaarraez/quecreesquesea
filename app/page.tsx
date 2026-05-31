/*
import Hero from "@/components/Hero";
import VoteForm from "@/components/VoteForm";
import PulseMeter from "@/components/PulseMeter";
import EchoesFeed from "@/components/EchoesFeed";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <VoteForm />
      <PulseMeter />
      <EchoesFeed />

      <footer className="px-6 py-12 text-center text-sm text-cream/40">
        Hecho con 💛 para el pequeño Mandolese López
      </footer>
    </main>
  );
}
*/

import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import type { Gender } from "@/lib/types";

export const metadata: Metadata = {
  title: "La Revelación — Mandolese López",
  robots: { index: false, follow: false },
};

/**
 * Pantalla secreta de los papás. El género se configura por variable de
 * entorno (lado servidor) y no se expone en el resto de la app.
 */
export default function RevelarPage() {
  const raw = (process.env.BABY_GENDER ?? "girl").toLowerCase();
  const gender: Gender = raw === "boy" ? "boy" : "girl";

  return <Reveal gender={gender} />;
}
