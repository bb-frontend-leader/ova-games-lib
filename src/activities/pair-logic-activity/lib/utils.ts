import type { Side } from '../types/types';

/** Letra visible de una pareja resuelta (1 → A). Pasadas las 26 se usa el número. */
export const pairLetter = (position: number) =>
  position <= 26 ? String.fromCharCode(64 + position) : String(position);

/** Id del DOM del radio de una tarjeta (el reinicio de foco y los `<label>` lo comparten). */
export const getInputId = (uid: string, side: Side, id: string) => `${uid}-${side}-${id}`;

/** Id del DOM del botón de reinicio. */
export const getResetId = (uid: string) => `${uid}-reset`;

/** Mezcla los ids sin dejar ninguno en su posición original, para que el orden de los textos nunca coincida con el de las imágenes. */
export const shuffleIds = (ids: string[]) => {
  if (ids.length < 2) return ids;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const mixed = [...ids];

    for (let index = mixed.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [mixed[index], mixed[other]] = [mixed[other], mixed[index]];
    }

    if (mixed.every((id, index) => id !== ids[index])) return mixed;
  }

  // Una rotación nunca deja un id en su sitio: sirve de respaldo.
  return [...ids.slice(1), ids[0]];
};
