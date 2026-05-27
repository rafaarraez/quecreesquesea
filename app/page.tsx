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
