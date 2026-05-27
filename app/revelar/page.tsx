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
