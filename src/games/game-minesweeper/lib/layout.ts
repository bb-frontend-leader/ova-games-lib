import type { Cell } from '../types/types';

type Random = () => number;

const shuffle = <T>(items: readonly T[], random: Random) => {
  const list = [...items];

  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [list[i], list[j]] = [list[j], list[i]];
  }

  return list;
};

/**
 * Tamaño del campo: una casilla segura por pregunta más las minas. Las filas salen de dividir entre las columnas
 * y, para que el campo sea rectangular, las casillas que sobran son minas (así hay siempre al menos `minMines`).
 */
export const gridSize = (questions: number, columns: number, minMines: number) => {
  const cols = Math.max(2, Math.floor(columns));
  const rows = Math.max(2, Math.ceil((questions + minMines) / cols));

  return { cols, rows, mines: rows * cols - questions };
};

/**
 * Reparte las minas y las preguntas por el campo: las minas al azar y cada casilla segura con una pregunta distinta.
 */
export const createCells = (questions: number, cols: number, rows: number, random: Random = Math.random): Cell[] => {
  const size = cols * rows;
  const mines = new Set(
    shuffle(
      Array.from({ length: size }, (_, id) => id),
      random
    ).slice(0, size - questions)
  );
  const order = shuffle(
    Array.from({ length: questions }, (_, q) => q),
    random
  );
  let next = 0;

  return Array.from({ length: size }, (_, id) => {
    const row = Math.floor(id / cols);
    const col = id % cols;
    let adj = 0;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = row + dr;
        const c = col + dc;

        if ((dr || dc) && r >= 0 && r < rows && c >= 0 && c < cols && mines.has(r * cols + c)) adj++;
      }
    }

    const mine = mines.has(id);

    return { id, row, col, mine, q: mine ? null : order[next++], adj, status: 'closed', flag: false, radar: false };
  });
};
