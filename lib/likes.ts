import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Likes anónimos en los mensajes. Un like por dispositivo, recordado en
 * localStorage. Usa la tabla `likes` de Supabase (con Realtime) cuando está
 * disponible; si no, cae a un almacén local.
 *
 * Todo es a prueba de fallos: si la tabla `likes` aún no existe (no se corrió
 * la migración), las llamadas no rompen la app — solo no persisten en el server.
 */

const DEVICE_KEY = "egs:deviceId";
const MY_LIKES_KEY = "egs:myLikes"; // votos que ESTE dispositivo likeó
const LOCAL_COUNTS_KEY = "egs:likeCounts"; // conteo local (modo demo)
const LOCAL_EVENT = "egs:likes-changed";

/* ─────────────────────────── Identidad del dispositivo ──────────────────── */

export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

/* ────────────────────── Memoria local de "yo likeé" ─────────────────────── */

export function getMyLikes(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(MY_LIKES_KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function rememberMyLike(voteId: string) {
  const set = getMyLikes();
  set.add(voteId);
  window.localStorage.setItem(MY_LIKES_KEY, JSON.stringify([...set]));
}

/* ──────────────────────────── Conteo local (demo) ───────────────────────── */

function readLocalCounts(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_COUNTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function writeLocalCounts(counts: Record<string, number>) {
  window.localStorage.setItem(LOCAL_COUNTS_KEY, JSON.stringify(counts));
  window.dispatchEvent(new CustomEvent(LOCAL_EVENT));
}

/* ──────────────────────────────── API ──────────────────────────────────── */

/** Devuelve un mapa { voteId: cantidad de likes }. Nunca lanza. */
export async function fetchLikeCounts(): Promise<Record<string, number>> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("likes").select("vote_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      for (const row of data as { vote_id: string }[]) {
        counts[row.vote_id] = (counts[row.vote_id] ?? 0) + 1;
      }
      return counts;
    } catch {
      // Tabla inexistente u otro error: no rompemos la UI.
      return {};
    }
  }
  return readLocalCounts();
}

/**
 * Registra un like de este dispositivo en un mensaje. Idempotente: si ya
 * likeó, no hace nada. Devuelve true si quedó likeado.
 */
export async function likeVote(voteId: string): Promise<boolean> {
  if (getMyLikes().has(voteId)) return true;

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("likes")
        .insert({ vote_id: voteId, device_id: getDeviceId() });
      // 23505 = violación de unique → ya existía, lo tratamos como éxito.
      if (error && error.code !== "23505") throw error;
      rememberMyLike(voteId);
      return true;
    } catch {
      // No persistió en el server, pero recordamos localmente para no romper.
      rememberMyLike(voteId);
      return true;
    }
  }

  // Modo demo: contamos localmente.
  const counts = readLocalCounts();
  counts[voteId] = (counts[voteId] ?? 0) + 1;
  rememberMyLike(voteId);
  writeLocalCounts(counts);
  return true;
}

/** Suscripción en vivo a cambios de likes. Devuelve la función de baja. */
export function subscribeToLikes(
  onChange: (counts: Record<string, number>) => void,
): () => void {
  if (isSupabaseConfigured && supabase) {
    const client = supabase;
    const channelName = `likes-realtime-${Math.random().toString(36).slice(2)}`;
    const channel = client
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        async () => {
          onChange(await fetchLikeCounts());
        },
      )
      .subscribe();
    return () => {
      client.removeChannel(channel);
    };
  }

  const handler = () => onChange(readLocalCounts());
  window.addEventListener(LOCAL_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(LOCAL_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
