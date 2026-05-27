"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchLikeCounts,
  getMyLikes,
  likeVote,
  subscribeToLikes,
} from "./likes";

export interface LikesState {
  counts: Record<string, number>;
  liked: Set<string>;
  like: (voteId: string) => void;
}

/**
 * Mantiene los conteos de likes en vivo y recuerda qué mensajes likeó este
 * dispositivo. El like es optimista (se ve al instante) y luego se reconcilia
 * con el server vía Realtime.
 */
export function useLikes(): LikesState {
  const [counts, setCounts] = useState<Record<string, number>>({});
  // Inicialización perezosa: lee de localStorage una sola vez (sin setState
  // dentro del efecto, que dispara renders en cascada).
  const [liked, setLiked] = useState<Set<string>>(() => getMyLikes());

  useEffect(() => {
    let active = true;
    fetchLikeCounts().then((c) => active && setCounts(c));
    const unsubscribe = subscribeToLikes((c) => active && setCounts(c));
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const like = useCallback(
    (voteId: string) => {
      if (liked.has(voteId)) return;
      // Optimista: marcamos como likeado y subimos el conteo al instante.
      // Los efectos van FUERA de los updaters (que deben ser puros), para no
      // duplicarse con la doble invocación de Strict Mode.
      setLiked((prev) => new Set(prev).add(voteId));
      setCounts((c) => ({ ...c, [voteId]: (c[voteId] ?? 0) + 1 }));
      void likeVote(voteId);
    },
    [liked],
  );

  return { counts, liked, like };
}
