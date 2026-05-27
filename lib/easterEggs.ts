/**
 * Easter eggs — bromas internas para la familia (tono tierno y bobo).
 *
 * Para personalizar los "nombres trolleados": agregá entradas a NAME_JOKES.
 * La clave se compara sin distinguir mayúsculas ni tildes, así que "Sofía",
 * "sofia" y "SOFIA" coinciden todas.
 */

/** minúsculas, sin tildes y sin espacios de más. */
export function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// ⚠️ Las claves van SIEMPRE en minúscula y sin tildes (así las normaliza
// getNameJoke). Agregá o cambiá nombres libremente.
const NAME_JOKES: Record<string, string> = {
  // gabriel: "¡Hola, futuro papá! 🍼 Tu predicción vale doble… porque eres tú 💙",
  // betania: "¡Reina mamá! 👑 Sea lo que sea, ya lo amás más que a nadie 💛",
  // adriana: "¡Tía Adriana en la casa! 🌸 Preparate para malcriarlo sin culpa 😏",
  // rafael: "¡Tío Rafa! 😎 El más cool e increible ya votó. Que quede registrado 💪💙",
};

/** Devuelve la broma para ese nombre, o null si no hay ninguna. */
export function getNameJoke(name: string): string | null {
  return NAME_JOKES[normalizeName(name)] ?? null;
}
