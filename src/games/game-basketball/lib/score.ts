/** Puntos de una canasta; cada canasta seguida suma un punto más, hasta `MAX_BONUS`. */
export const BASE_POINTS = 2;
const MAX_BONUS = 2;

/** Puntos del siguiente tiro, según las canastas seguidas que ya lleva (`streak`). */
export const pointsFor = (streak: number) => BASE_POINTS + Math.min(streak, MAX_BONUS);

export type Rank = 'mvp' | 'starter' | 'rookie';

/** Título del jugador según su puntería: todos los tiros a la primera es MVP. */
export const rankOf = (made: number, attempts: number): Rank => {
  const accuracy = attempts ? made / attempts : 0;

  return accuracy === 1 ? 'mvp' : accuracy >= 0.6 ? 'starter' : 'rookie';
};

export const accuracyOf = (made: number, attempts: number) => (attempts ? Math.round((made / attempts) * 100) : 0);
