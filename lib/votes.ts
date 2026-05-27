import { supabase, isSupabaseConfigured } from "./supabase";
import type { NewVote, Vote } from "./types";

/**
 * Capa de acceso a votos. Si Supabase está configurado usa la base real
 * (con Realtime); si no, cae a un almacén local en `localStorage` que emite
 * eventos entre pestañas para imitar el tiempo real. Así la experiencia se
 * puede previsualizar sin credenciales.
 */

const LOCAL_KEY = "egs:votes";
const LOCAL_EVENT = "egs:votes-changed";

/* ───────────────────────── Almacén local de respaldo ───────────────────── */

function readLocal(): Vote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as Vote[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(votes: Vote[]) {
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(votes));
  // Notifica a esta pestaña y a las demás (storage event).
  window.dispatchEvent(new CustomEvent(LOCAL_EVENT));
}

/* ──────────────────────────────── API ──────────────────────────────────── */

/** Devuelve todos los votos en orden cronológico ascendente. */
export async function fetchVotes(): Promise<Vote[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as Vote[]) ?? [];
  }
  return readLocal();
}

/** Crea un voto y devuelve el registro insertado. */
export async function createVote(input: NewVote): Promise<Vote> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("votes")
      .insert({
        name: input.name.trim(),
        gender: input.gender,
        message: input.message.trim() || null,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Vote;
  }

  const vote: Vote = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()),
    name: input.name.trim(),
    gender: input.gender,
    message: input.message.trim() || null,
    created_at: new Date().toISOString(),
  };
  writeLocal([...readLocal(), vote]);
  return vote;
}

/**
 * Se suscribe a cambios en la lista de votos. `onChange` recibe la lista
 * completa actualizada. Devuelve una función para cancelar la suscripción.
 */
export function subscribeToVotes(onChange: (votes: Vote[]) => void): () => void {
  if (isSupabaseConfigured && supabase) {
    const client = supabase;
    // Nombre único por suscripción: varios componentes (marcador, historial)
    // escuchan a la vez y Supabase no permite reusar el mismo canal.
    const channelName = `votes-realtime-${Math.random().toString(36).slice(2)}`;
    const channel = client
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votes" },
        async () => {
          try {
            onChange(await fetchVotes());
          } catch {
            /* silencioso: la UI conserva el último estado válido */
          }
        },
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }

  // Respaldo local: escucha eventos de esta pestaña y de otras.
  const handler = () => onChange(readLocal());
  window.addEventListener(LOCAL_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(LOCAL_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
