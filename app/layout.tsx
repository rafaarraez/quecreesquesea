import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import ParticlesBackground from "@/components/ParticlesBackground";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://quecreesquesea.vercel.app";
const TITLE = "Se Viene un Mandolese López";
const DESCRIPTION =
  "El nuevo miembro de la familia está por llegar. ¿Qué creés que será? Dejá tu predicción y tu mensaje de amor 💛";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "¿Qué creés que será?",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#05030f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      // Evita errores de hidratación por nodos/atributos que inyectan las
      // extensiones del navegador (p. ej. ColorZilla) y por el streaming de
      // metadata de Next.js.
      suppressHydrationWarning
      className={`${baloo.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="relative min-h-full" suppressHydrationWarning>
        <ParticlesBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
