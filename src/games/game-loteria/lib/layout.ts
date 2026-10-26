/** Ancho mínimo (px) de una carta, separación entre cartas (px) y máximo de columnas de la tabla. */
const MIN_CARD = 88;
const GAP = 10;
const MAX_COLS = 5;

/**
 * Columnas de la tabla según el ancho disponible: tantas como quepan (entre 2 y 5, y con al menos dos filas), y si
 * hay margen se prefiere un reparto sin fila coja (12 cartas → 4 x 3; 9 → 3 x 3).
 */
export const colsFor = (width: number, total: number) => {
  const fit = width > 0 ? Math.floor((width + GAP) / (MIN_CARD + GAP)) : 4;
  const cap = Math.max(2, Math.min(fit, MAX_COLS, Math.ceil(total / 2)));

  if (cap >= 4) {
    for (let c = cap; c >= Math.max(3, cap - 2); c--) if (total % c === 0) return c;
  }

  return cap;
};

/** Filas y columnas de la tabla (ids de sus cartas): solo las de dos cartas o más. */
export const linesOf = (board: string[], cols: number) => {
  const lines: string[][] = [];

  for (let r = 0; r < board.length; r += cols) lines.push(board.slice(r, r + cols));
  for (let c = 0; c < cols; c++) lines.push(board.filter((_, k) => k % cols === c));

  return lines.filter((line) => line.length > 1);
};

export const lineKey = (line: string[]) => [...line].sort().join('|');

/** Valoración final de 1 a 4 según la parte de cartas acertadas a la primera. */
export const rankOf = (firstTry: number, total: number) => {
  const ratio = total ? firstTry / total : 0;

  return ratio >= 0.9 ? 1 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 3 : 4;
};
