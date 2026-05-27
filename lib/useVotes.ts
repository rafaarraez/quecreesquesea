"use client";

import { useEffect, useState } from "react";
import { fetchVotes, subscribeToVotes } from "./votes";
import type { Vote } from "./types";

export interface VotesState {
  votes: Vote[];
  loading: boolean;
  girl: number;
  boy: number;
  total: number;
}

/**
 * Carga los votos una vez y se mantiene en vivo mediante Realtime (o el
 * respaldo local). Devuelve los conteos derivados ya listos para la UI.
 */
export function useVotes(): VotesState {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchVotes()
      .then((data) => {
        if (active) setVotes(data);
      })
      .catch(() => {
        /* conserva lista vacía si falla la carga inicial */
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const unsubscribe = subscribeToVotes((data) => {
      if (active) setVotes(data);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const girl = votes.filter((v) => v.gender === "girl").length;
  const boy = votes.filter((v) => v.gender === "boy").length;

  return { votes, loading, girl, boy, total: votes.length };
}
