export type Gender = "girl" | "boy";

export interface Vote {
  id: string;
  name: string;
  gender: Gender;
  message: string | null;
  created_at: string;
}

/** Datos que envía el formulario para crear un voto. */
export interface NewVote {
  name: string;
  gender: Gender;
  message: string;
}
