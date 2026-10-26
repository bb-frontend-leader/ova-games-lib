import { CELLS_PER_QUESTION, LADDERS, MIN_CELLS, SNAKES } from './constant';

import type { CellKind, Link } from '../types/types';

/** Casillas del tablero (sin contar la salida): la meta es la última. */
export const cellsFor = (questions: number) => Math.max(MIN_CELLS, questions * CELLS_PER_QUESTION);

/** Columnas del tablero según cuántas casillas hay: lo más cuadrado posible, con un tope para que se lea. */
export const columnsFor = (tiles: number) => Math.min(10, Math.max(6, Math.ceil(Math.sqrt(tiles * 1.5))));

/** Fila (desde abajo) y columna de la casilla `i`: el tablero va en serpentina, de abajo a arriba. */
export const tileAt = (i: number, cols: number) => {
  const row = Math.floor(i / cols);
  const k = i % cols;

  return { row, col: row % 2 === 0 ? k : cols - 1 - k };
};

/** Columnas y filas del tablero cuya meta es la casilla `goal` (más la salida). */
export const gridOf = (goal: number) => {
  const tiles = goal + 1;
  const cols = columnsFor(tiles);

  return { cols, rows: Math.ceil(tiles / cols) };
};

/** Posición (en % del tablero) de la esquina de la casilla `i`: sirve para colocar y mover la ficha. */
export const pawnAt = (i: number, goal: number) => {
  const { cols, rows } = gridOf(goal);
  const { row, col } = tileAt(i, cols);

  return { left: `${(col / cols) * 100}%`, top: `${((rows - 1 - row) / rows) * 100}%` };
};

/** Centro de la casilla `i` en unidades de casilla (el tablero mide `cols` x `rows`): para dibujar escaleras y serpientes. */
export const centerOf = (i: number, goal: number) => {
  const { cols, rows } = gridOf(goal);
  const { row, col } = tileAt(i, cols);

  return { x: col + 0.5, y: rows - row - 0.5 };
};

/**
 * Tablero: el tipo de cada casilla (0 = salida, `goal` = meta) y las escaleras y serpientes. Se reparten por
 * fracciones del recorrido y por filas (suben o bajan algunas filas, torcidas unas casillas para que no queden
 * todas verticales), así el tablero se adapta a cualquier número de preguntas.
 */
export const buildBoard = (goal: number) => {
  const { cols } = gridOf(goal);
  const cells: CellKind[] = Array.from({ length: goal + 1 }, () => 'plain');
  const links: Link[] = [];
  const wall = goal - 1;

  cells[0] = 'start';
  cells[goal] = 'goal';

  // Casilla libre más cercana a `i` hacia arriba (sin tocar la salida, el muro ni la meta)
  const free = (i: number) => i > 1 && i < wall - 1 && cells[i] === 'plain';
  const claim = (i: number, dir: 1 | -1) => {
    let at = i;

    while (at > 1 && at < wall - 1 && !free(at)) at += dir;

    return free(at) ? at : null;
  };

  const place = (kind: Link['kind'], fraction: number, rows: number, shift: number) => {
    const base = claim(Math.round(goal * fraction), 1);

    if (base === null) return;

    // Las escaleras suben (el destino es mayor) y las serpientes bajan desde su cabeza (el destino es menor)
    const up = kind === 'ladder';
    const target = up ? base + rows * cols + shift : base - rows * cols + shift;
    const end = Math.max(2, Math.min(wall - 1, target));

    if (up ? end <= base + cols - 2 : end >= base - cols + 2) return; // Tiene que cambiar de fila

    // Los extremos tampoco pueden pisar otra escalera o serpiente
    if (links.some((l) => l.from === end || l.to === end || l.to === base)) return;

    cells[base] = kind;
    links.push({ kind, from: base, to: end });
  };

  LADDERS.forEach(({ at, rows, shift }) => place('ladder', at, rows, shift));
  SNAKES.forEach(({ at, rows, shift }) => place('snake', at, rows, shift));

  return { cells, links };
};

/** A dónde manda la casilla `at` (null si no tiene escalera ni serpiente). */
export const linkAt = (links: Link[], at: number) => links.find((l) => l.from === at) ?? null;
